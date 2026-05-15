import "./css/style.css";
import { useState } from "react";

import Boot from "./components/Boot";
import Login from "./components/Login";
import Header from "./components/Header";
import Scanner from "./components/Scanner";
import Carrinho from "./components/Carrinho";
import Balanca from "./components/Balanca";
import Pagamento from "./components/Pagamento";

function App() {
  const [tela, setTela] = useState("boot");
  const [produtos, setProdutos] = useState([]);
  const [cpf, setCpf] = useState("");
  const [telaPagamento, setTelaPagamento] = useState(false);

  const total = produtos.reduce((acc, p) => acc + (p.preco || 0), 0);

  if (tela === "boot") return <Boot irLogin={() => setTela("login")} />;

  if (tela === "login")
    return (
      <Login
        cpf={cpf}
        setCpf={setCpf}
        entrar={() => setTela("app")}
      />
    );

  if (telaPagamento)
    return (
      <Pagamento
        total={total}
        voltar={() => setTelaPagamento(false)}
        finalizar={() => {
          setProdutos([]);
          setTelaPagamento(false);
        }}
      />
    );

  return (
    <div className="container">
      <Header />

      <div className="main">
        <Scanner setProdutos={setProdutos} />
        <Carrinho
          produtos={produtos}
          setProdutos={setProdutos}
          total={total}
          finalizar={() => setTelaPagamento(true)}
        />
        <Balanca />
      </div>
    </div>
  );
}

export default App;