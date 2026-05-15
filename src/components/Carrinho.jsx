function Carrinho({ produtos, setProdutos, total, finalizar }) {
  function remover(id) {
    setProdutos(produtos.filter((p) => p.id !== id));
  }

  return (
    <div className="cart-box">
      <h2>🛒 CARRINHO ({produtos.length})</h2>

      <div className="products">
        {produtos.map((p) => (
          <div className="product" key={p.id}>
            <span>{p.nome}</span>
            <span>R$ {p.preco.toFixed(2)}</span>
            <button onClick={() => remover(p.id)}>✕</button>
          </div>
        ))}
      </div>

      <h1>R$ {total.toFixed(2)}</h1>

      <button className="finish-btn" onClick={finalizar}>
        FINALIZAR VENDA
      </button>
    </div>
  );
}

export default Carrinho;