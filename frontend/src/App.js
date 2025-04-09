import Header from "./components/header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useState } from "react";

function App({ children, backgroundImageUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          backdropFilter: "brightness(60%)", 
        }}
      >
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main>
          <Header setIsOpen={setIsOpen} />
          {children}
        </main>
      </div>
    </div>
  );
}

export default App;
