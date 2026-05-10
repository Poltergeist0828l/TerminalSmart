import "./style.css";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState("SISTEMA ONLINE");
  const [hora, setHora] = useState("");
  const [ultimaLeitura, setUltimaLeitura] = useState("");

  const scannerRef = useRef(null);
  const lidandoComLeitura = useRef(false);

  useEffect(() => {
    atualizarHora();
    const relogio = setInterval(atualizarHora, 1000);

    
    const html5Qrcode = new Html5Qrcode("reader");
    scannerRef.current = html5Qrcode;

    const config = {
      fps: 20, 
      
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        return {
          width: Math.min(viewfinderWidth * 0.7, 300),
          height: Math.min(viewfinderHeight * 0.6, 200)
        };
      }
    };

    
    html5Qrcode.start(
      { facingMode: "environment" },
      {
        ...config,
        videoConstraints: {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          aspectRatio: { ideal: 1.7777777778 }
        }
      },
      (decodedText) => {
        
        if (lidandoComLeitura.current) return;
        lidandoComLeitura.current = true;

        setUltimaLeitura(decodedText);
        setStatus("🔎 PROCESSANDO PRODUTO...");

        fetch(`http://localhost:8080/api/produtos/${decodedText}`)
          .then((res) => {
            if (!res.ok) throw new Error("Não encontrado");
            return res.json();
          })
          .then((p) => {
            setProdutos((prev) => [
              { ...p, id: Date.now(), preco: p.preco || 0 },
              ...prev,
            ]);
            setStatus("PRODUTO ADICIONADO");
          })
          .catch(() => {
            setStatus("PRODUTO NÃO ENCONTRADO");
          })
          .finally(() => {
            setTimeout(() => {
              setStatus("SISTEMA ONLINE");
              lidandoComLeitura.current = false;
            }, 1500); 
          });
      },
      () => {
        
      }
    ).catch((err) => {
      console.error("Erro ao iniciar câmara:", err);
      setStatus("❌ ERRO AO INICIAR CÂMARA");
    });

    return () => {
      clearInterval(relogio);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .then(() => scannerRef.current.clear())
          .catch((err) => console.error("Erro ao limpar câmara:", err));
      }
    };
  }, []);

  function atualizarHora() {
    const agora = new Date();
    setHora(
      agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }

  function removerProduto(id) {
    setProdutos(produtos.filter((p) => p.id !== id));
  }

  function novaVenda() {
    setProdutos([]);
    setUltimaLeitura("");
    setStatus("🛒 NOVA VENDA INICIADA");
    setTimeout(() => {
      setStatus("SISTEMA ONLINE");
    }, 2000);
  }

  const total = produtos.reduce((acc, p) => acc + (p.preco || 0), 0);

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1 className="logo">
            SMART<span>CART</span>
          </h1>
          <p className="subtitle">
            Terminal inteligente de autoatendimento
          </p>
        </div>
        <div className="header-right">
          <div className="clock">{hora}</div>
          <div className="status">{status}</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* CAMERA */}
        <div className="camera-box">
          <div className="camera-top">
            <h2>📷 LEITOR DE CÓDIGOS</h2>
          </div>
          <div id="reader"></div>
          <div className="camera-footer">
            <p>Aponte o código de barras ou QR Code para a câmara</p>
            <small>
              Último código: <span className="codigo">{ultimaLeitura || "Nenhum"}</span>
            </small>
          </div>
        </div>

        {/* CARRINHO */}
        <div className="cart-box">
          <div className="cart-top">
            <h2>🛒 CARRINHO</h2>
            <div className="badge">{produtos.length}</div>
          </div>

          <div className="products">
            {produtos.length === 0 && (
              <div className="empty">Nenhum produto escaneado</div>
            )}
            {produtos.map((p) => (
              <div className="product" key={p.id}>
                <div>
                  <div className="product-name">{p.nome || "Produto Sem Nome"}</div>
                  <div className="product-price">
                    R$ {(p.preco || 0).toFixed(2)}
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removerProduto(p.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="total-box">
            <small>TOTAL DA COMPRA</small>
            <h1>R$ {total.toFixed(2)}</h1>
            <button className="finish-btn" onClick={novaVenda}>
              NOVA VENDA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
