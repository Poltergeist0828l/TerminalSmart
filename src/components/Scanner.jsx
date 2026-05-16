import { useEffect, useState } from "react";
import "../css/scanner.css";

function Scanner({ setProdutos }) {
  const [codigo, setCodigo] = useState("");
  const [ultimaLeitura, setUltimaLeitura] = useState("");
  const [status, setStatus] = useState("Aguardando leitura...");

  useEffect(() => {
    let buffer = "";

    function handleKeyDown(e) {
      if (e.key === "Enter") {
        if (!buffer) return;

        const codigoLido = buffer;
        buffer = "";

        setUltimaLeitura(codigoLido);
        setStatus("🔎 PROCESSANDO...");

        fetch(`http://localhost:8080/api/produtos/${codigoLido}`)
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((p) => {
            setProdutos((prev) => [
              { ...p, id: Date.now(), preco: p.preco || 0 },
              ...prev,
            ]);
            setStatus("PRODUTO ADICIONADO");
          })
          .catch(() => setStatus("PRODUTO NÃO ENCONTRADO"))
          .finally(() => {
            setTimeout(() => setStatus("SISTEMA ONLINE"), 1500);
          });

        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        buffer += e.key;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setProdutos]);

  return (
    <div className="camera-box">
      <h2>Posicione o codigo de barras do produto</h2>

      <div className="camera-footer">
        <p>Status: {status}</p>
        <p>Último código: {ultimaLeitura || "Nenhum"}</p>
      </div>
    </div>
  );
}

export default Scanner;