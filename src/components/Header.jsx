import "../css/header.css";

function Header() {
  return (
    <div className="header">
      <img src="/img/ima.png" className="ima" />
      <div>
        <div className="clock">
          {new Date().toLocaleTimeString("pt-BR")}
        </div>
        <div className="status">SISTEMA ONLINE</div>
      </div>
    </div>
  );
}

export default Header;