import { useNavigate } from "react-router-dom";
import { useModels } from "../../context/ModelsContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { models } = useModels();

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      {/* Background overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Sidebar panel */}
      <nav
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "300px",
          height: "100%",
          backgroundColor: "#fff",
          padding: "20px",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
          zIndex: 1001,
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            float: "right",
          }}
        >
          ✕
        </button>

        <ul style={{ listStyle: "none", padding: "20px 0" }}>
          {models.map((model) => {
            const route = `/${model.name.replace(/\s+/g, "").toLowerCase()}`;
            return (
              <li
                key={model._id}
                onClick={() => {
                  navigate(route);
                  setIsOpen(false);
                }}
                style={{
                  padding: "10px 0",
                  cursor: "pointer",
                  borderRadius: "10%",
                  transition: "all 0.3s",
                  color: "black",
                }}
                onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "rgb(242, 242, 242)")
                }
                onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
              >
                {model.name}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
