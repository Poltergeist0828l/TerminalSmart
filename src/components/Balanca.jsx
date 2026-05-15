import { useEffect, useState } from "react";

function Balanca() {
  const [peso, setPeso] = useState("0.000");
  const [status, setStatus] = useState("CONECTANDO...");

  useEffect(() => {
    let interval;

    async function iniciarBalanca() {
      try {
        const res = await fetch("http://localhost:8080/api/balanca");

        if (!res.ok) {
          setStatus("BALANÇA OFFLINE");
          return;
        }

        setStatus("BALANÇA ONLINE");

        interval = setInterval(async () => {
          try {
            const r = await fetch("http://localhost:8080/api/balanca");

            if (!r.ok) {
              setStatus("ERRO LEITURA");
              return;
            }

            const data = await r.json();

            if (data && data.peso !== undefined) {
              setPeso(parseFloat(data.peso).toFixed(3));
              setStatus("BALANÇA ONLINE");
            } else {
              setStatus("DADO INVÁLIDO");
            }

          } catch (err) {
            console.error(err);
            setStatus("ERRO CONEXÃO");
          }
        }, 1000);

      } catch (err) {
        console.error(err);
        setStatus("SEM CONEXÃO");
      }
    }

    iniciarBalanca();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="weight-box">
      <h2>PESO:</h2>

      <div className="peso-display">
        <h1 className="peso">{peso} kg</h1>
        <span className="status-balanca">{status}</span>
      </div>
    </div>
  );
}

export default Balanca;