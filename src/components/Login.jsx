import { useState } from "react";

function Login({ cpf, setCpf, entrar }) {
  const [loading, setLoading] = useState(false);

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
  }

  async function salvarCliente(cpfValor, anonimo = false) {

    //  ANÔNIMO → NÃO CHAMA BACKEND
    if (anonimo) {
      entrar();
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: cpfValor.replace(/\D/g, ""), 
        }),
      });

      if (!res.ok) {
        const erro = await res.text();
        alert("Erro no backend: " + erro);
        return;
      }

      entrar();

    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o backend!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tela-boas-vindas">
      <div className="boot-card">
        <h2>Autenticação</h2>

        <input
          className="input-cpf"
          placeholder="Digite seu CPF"
          value={cpf}
          maxLength={14}
          onChange={(e) => {
            let valor = e.target.value.replace(/\D/g, "");
            valor = valor.slice(0, 11);

            valor = valor
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            setCpf(valor);
          }}
        />

        {/* CPF */}
        <button
          className="btn-primary"
          disabled={loading}
          onClick={() => {
            if (!validarCPF(cpf)) {
              alert("CPF inválido!");
              return;
            }

            salvarCliente(cpf);
          }}
        >
          {loading ? "Processando..." : "CONTINUAR"}
        </button>

        <button
          className="btn-secondary"
          onClick={() => salvarCliente(null, true)}
        >
          CONTINUAR ANÔNIMO
        </button>
      </div>
    </div>
  );
}

export default Login;