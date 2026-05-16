import "../css/pagamento.css";
function Pagamento({ total, finalizar, voltar }) {
  return (
    <div className="tela-boas-vindas">
      <div className="boot-card">
        <h2>METODO PAGAMENTO:</h2>

        <h1>R$ {total.toFixed(2)}</h1>

        <button className="btn-primary" onClick={finalizar}>
          PIX
        </button>

        <button className="btn-primary" onClick={finalizar}>
          CARTÃO
        </button>

        <button className="btn-secondary" onClick={voltar}>
          VOLTAR
        </button>
      </div>
    </div>
  );
}

export default Pagamento;