import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProgressBar() {
  const location = useLocation();
  const [width, setWidth] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const t1 = setTimeout(() => setWidth(30), 20);
    const t2 = setTimeout(() => setWidth(100), 100);
    const t3 = setTimeout(() => setWidth(0), 700);
    timers.current.push(t1, t2, t3);

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname]);

  if (width === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 99999,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, #177A59, #0C4E3A 70%, #DFF264)",
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 10px rgba(23, 122, 89, 0.4)",
        }}
      />
    </div>
  );
}
