import { useEffect } from "react";

function Boot({ irLogin }) {
  useEffect(() => {
    setTimeout(irLogin, 3000);
  }, []);

  return (
    <div className="tela-boas-vindas">
      <img src="/img/ima.png" className="ima" />
      <p>Inicializando sistema...</p>
    </div>
  );
}

export default Boot;