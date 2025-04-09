import { useNavigate } from "react-router-dom";
import landingPageVideo from "../../../src/assets/landingPageVideo.mp4"; 

export default function HomeSectionVideo({ models }) {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (models && models.length > 0) {
      navigate(`/${models[0].name.replace(/\s+/g, '').toLowerCase()}`);
    } 
  };


  return (
    <div
      className="video-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={landingPageVideo} type="video/mp4" />
        Lnading page video
      </video>

      <div
        className="overlay-text top-text"
        style={{
          position: "absolute",
          width: "100%",
          color: "white",
          textAlign: "center",
          top: "10%",
        }}
      >
        <h1>Electrify Your Drive</h1>
        <h4>Explore Our Latest EV Lineup</h4>
      </div>

      <div
        className="overlay-text bottom-text"
        style={{
          position: "absolute",
          width: "100%",
          color: "white",
          textAlign: "center",
          bottom: "10%",
        }}
      >
        <button
          onClick={handleExplore}
          style={{
            background: "none",
            border: "1px solid white",
            borderRadius: "5px",
            fontSize: "16px",
            color: "white",
            padding: "10px 60px",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "black";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "white";
          }}
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}
