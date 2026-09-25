import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProgressBar() {
  const location = useLocation();
  const [width, setWidth] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setWidth(0);
    timers.current.push(setTimeout(() => setWidth(100), 50));

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "6px",
      zIndex: 99999,
      background: "#1a1a2e",
    }}>
      <div style={{
        height: "100%",
        width: `${width}%`,
        background: "linear-gradient(90deg, #6c63ff, #ff6584)",
        transition: "width 1s ease",
      }} />
    </div>
  );
}