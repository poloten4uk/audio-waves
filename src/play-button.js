import { useCallback } from "react";
import "./play-button.css";

const PlayButton = ({ isPlaying, onClick, width = 30, height = 30 }) => {
  const handleClick = useCallback(() => {
    if (!onClick) return;
    setTimeout(onClick, 50);
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      style={{ width, height }}
      className={`play-button ${isPlaying ? "playing" : ""}`}
    >
      <div className="play">
        <div className="pause"></div>
      </div>
    </button>
  );
};

export default PlayButton;
