import { useEffect } from "react";
import "../css/login.css"; 

function Boot({ irLogin }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      irLogin();
    }, 3000);

    
    return () => clearTimeout(timer);
  }, [irLogin]);

  return (
    <div className="tela-boas-vindas">
      <img src="/img/ima.png" className="ima" />
      <p className="boot-text">Inicializando sistema...</p>
    </div>
  );
}

export default Boot;