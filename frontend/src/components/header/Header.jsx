import { useNavigate } from "react-router-dom";
import { useModels } from "../../context/ModelsContext";

export default function Header({setIsOpen}) {
  const navigate = useNavigate();
  const { models = [], loading, error } = useModels();

  if (loading) return <div style={{ color: 'white', padding: '10px' }}>Loading models...</div>;
  if (error) return <div style={{ color: 'red', padding: '10px' }}>Error: {error}</div>;

  const navElements = [
    { label: "CARCONFIG", route: "/", style: { marginRight: "auto" } },
    ...models.map(model => ({
      label: model.name,
      route: `/${model.name.replace(/\s+/g, '').toLowerCase()}`
    })),
    { label: "SearchBar", route: null, style: { marginLeft: "auto" } },
    { label: "Menu", route: null },
  ];

  return (
    <>
      <nav>
        <ul
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            margin: "0",
            listStyle: "none",
          }}
        >
          {navElements.map((element, index) => (
            <li
              key={index}
              onClick={() => {
                if(element.label === "Menu") {
                    setIsOpen(true);
                } else {
                    element.route && navigate(element.route)
                }
            }}
              style={{
                cursor: element.route ? "pointer" : "default",
                padding: "10px",
                transition: "all 0.3s",
                borderRadius: "10%",
                ...element.style,
                ...(index === 0 ? { fontSize: "26px" } : {}),
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#444")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              {element.label === "SearchBar" ? (
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              ) : (
                element.label
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
