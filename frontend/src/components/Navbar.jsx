import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const roleColors = {
  RECRUITER: { background: "rgba(108,99,255,0.15)", color: "#6c63ff" },
  CANDIDATE: { background: "rgba(67,233,123,0.15)", color: "#43e97b" },
  ADMIN:     { background: "rgba(255,101,132,0.15)", color: "#ff6584" },
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email") || "";
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Jobs", path: "/jobs" },
    ...(role === "RECRUITER" ? [{ label: "Dashboard", path: "/recruiter" }] : []),
    ...(role === "CANDIDATE" ? [{ label: "My Applications", path: "/candidate" }] : []),
  ];

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const handleNav = (path) => { navigate(path); setMenuOpen(false); };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.25rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <span
          onClick={() => navigate("/jobs")}
          style={{
            fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800,
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            cursor: "pointer", flexShrink: 0,
          }}>NexHire</span>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", gap: "0.25rem" }} className="desktop-nav">
          {links.map(link => (
            <button key={link.path} onClick={() => handleNav(link.path)} style={{
              padding: "0.4rem 1rem", borderRadius: "8px", border: "none",
              background: location.pathname === link.path ? "var(--surface2)" : "transparent",
              color: location.pathname === link.path ? "var(--text)" : "var(--text2)",
              fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
              transition: "var(--transition)",
            }}>
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{
            fontSize: "0.8rem", color: "var(--text2)",
            maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{email}</span>
          {role && (
            <span style={{
              padding: "0.25rem 0.75rem", borderRadius: "20px",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px",
              textTransform: "uppercase", flexShrink: 0, ...roleColors[role],
            }}>{role}</span>
          )}
          <button onClick={handleLogout} style={{
            padding: "0.4rem 1rem", borderRadius: "8px",
            background: "var(--surface2)", color: "var(--text2)",
            border: "1px solid var(--border)", fontSize: "0.875rem",
            transition: "var(--transition)", flexShrink: 0,
          }}>Logout</button>
        </div>

        {/* Hamburger Button - mobile only */}
        <button
          className="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", background: "none", border: "none",
            color: "var(--text)", fontSize: "1.5rem", cursor: "pointer",
            padding: "0.5rem",
          }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-nav" style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
          background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 1.25rem",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          {/* Email + Role */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{
              fontSize: "0.8rem", color: "var(--text2)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
            }}>{email}</span>
            {role && (
              <span style={{
                padding: "0.25rem 0.75rem", borderRadius: "20px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px",
                textTransform: "uppercase", flexShrink: 0, ...roleColors[role],
              }}>{role}</span>
            )}
          </div>

          {/* Nav Links */}
          {links.map(link => (
            <button key={link.path} onClick={() => handleNav(link.path)} style={{
              padding: "0.75rem 1rem", borderRadius: "8px", border: "none",
              background: location.pathname === link.path ? "var(--surface2)" : "transparent",
              color: location.pathname === link.path ? "var(--text)" : "var(--text2)",
              fontSize: "0.95rem", fontWeight: 500, cursor: "pointer",
              textAlign: "left", transition: "var(--transition)",
            }}>
              {link.label}
            </button>
          ))}

          {/* Logout */}
          <button onClick={handleLogout} style={{
            padding: "0.75rem 1rem", borderRadius: "8px", marginTop: "0.5rem",
            background: "var(--surface2)", color: "#ff6584",
            border: "1px solid var(--border)", fontSize: "0.95rem",
            textAlign: "left", transition: "var(--transition)",
          }}>Logout</button>
        </div>
      )}
    </>
  );
}