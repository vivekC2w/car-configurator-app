import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModels } from "../../context/ModelsContext";
import SearchBar from "../../components/Search/SearchBar";

export default function Header({ setIsOpen }) {
  const navigate = useNavigate();
  const { models = [], loading, error } = useModels();
  const [showSearchExpanded, setShowSearchExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchContainerRef = useRef(null);
  const searchTriggerRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Closing search panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target) &&
        searchTriggerRef.current &&
        !searchTriggerRef.current.contains(event.target)
      ) {
        setShowSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navElements = [
    { label: "CARCONFIG", route: "/", style: { marginRight: "auto" } },
    ...models.map(model => ({
      label: model.name,
      route: `/${model.name.replace(/\s+/g, '').toLowerCase()}`
    }))
  ];

  if (loading) return <div style={{ color: 'white', padding: '10px' }}>Loading models...</div>;
  if (error) return <div style={{ color: 'red', padding: '10px' }}>Error: {error.message}</div>;

  const isMobile = windowWidth < 768;

  return (
    <nav>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "10px",
          margin: 0,
          listStyle: "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(5px)",
        }}
      >
        {/* Logo - Always visible */}
        <li
          onClick={() => navigate(navElements[0].route)}
          style={{
            cursor: "pointer",
            padding: "10px",
            transition: "all 0.3s",
            borderRadius: "10px",
            fontSize: "clamp(18px, 4vw, 26px)",
            fontWeight: "bold",
            fontFamily: "'Segoe UI', sans-serif",
            marginRight: "auto",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          {navElements[0].label}
        </li>

        {/* Main Navigation Links - Hidden on mobile */}
        {!isMobile && navElements.slice(1).map((element, index) => (
          <li
            key={index}
            onClick={() => navigate(element.route)}
            style={{
              cursor: "pointer",
              padding: "10px",
              transition: "all 0.3s",
              borderRadius: "10px",
              ...element.style,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            {element.label}
          </li>
        ))}

        {/* Search Trigger */}
        <li 
          ref={searchTriggerRef}
          style={{ 
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginLeft: isMobile ? "auto" : "0",
          }}
        >
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: showSearchExpanded ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "8px 15px",
              transition: "all 0.3s",
              cursor: "pointer",
              minWidth: isMobile ? "40px" : "200px",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
            onClick={() => setShowSearchExpanded(!showSearchExpanded)}
          >
            <span style={{ marginRight: isMobile ? 0 : "8px", color: "#ccc" }}>🔍</span>
            {!isMobile && <span style={{ color: "#aaa" }}>Search...</span>}
          </div>
        </li>

        {/* Mobile Menu Button - Only shown on mobile */}
        {isMobile && (
          <li
            onClick={() => setIsOpen(true)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderRadius: "10px",
              marginLeft: "10px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ☰
          </li>
        )}

        {/* Expanded Search Panel */}
        {showSearchExpanded && (
          <li
            ref={searchContainerRef}
            style={{
              position: "absolute",
              top: "60px",
              right: isMobile ? "10px" : "20px",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              padding: "20px",
              borderRadius: "8px",
              width: isMobile ? "calc(100% - 20px)" : "400px",
              zIndex: 101,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              listStyle: "none"
            }}
          >
            <SearchBar onSearch={() => setShowSearchExpanded(false)} />
          </li>
        )}
      </ul>
    </nav>
  );
}