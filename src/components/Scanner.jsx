import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Scanner({ setProdutos }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");
    scannerRef.current = html5Qrcode;

    html5Qrcode.start(
      { facingMode: "environment" },
      { fps: 20 },
      (decodedText) => {
        fetch(`http://localhost:8080/api/produtos/${decodedText}`)
          .then((r) => r.json())
          .then((p) => {
            setProdutos((prev) => [
              { ...p, id: Date.now(), preco: p.preco || 0 },
              ...prev,
            ]);
          });
      }
    );
  }, []);

  return (
    <div className="camera-box">
      <h2>📷 LEITOR</h2>
      <div id="reader"></div>
    </div>
  );
}

export default Scanner;