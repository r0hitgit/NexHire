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
  const name = localStorage.getItem("name") || email;
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Jobs", path: "/jobs" },
    ...(role === "RECRUITER" ? [{ label: "Dashboard", path: "/recruiter" }] : []),
    ...(role === "CANDIDATE" ? [{ label: "My Applications", path: "/candidate" }] : []),
  ];

  const handleLogout = () => { localStorage.clear(); navigate("/"); };
  const handleNav = (path) => { navigate(path); setMenuOpen(false); };
  const handleLogoClick = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/jobs" : "/");
  };

  return (
    <>
      <style>{`
        .btn-logout-desktop {
          padding: 0.4rem 1rem;
          border-radius: 8px;
          background: rgba(255, 101, 132, 0.08);
          color: #ff6584;
          border: 1px solid rgba(255, 101, 132, 0.22);
          font-size: 0.875rem;
          cursor: pointer;
          flex-shrink: 0;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.25s ease;
        }
        .btn-logout-desktop:hover {
          background: rgba(255, 101, 132, 0.16);
          border-color: rgba(255, 101, 132, 0.45);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(255, 101, 132, 0.2);
        }

        .btn-logout-mobile {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-top: 0.5rem;
          background: rgba(255, 101, 132, 0.08);
          color: #ff6584;
          border: 1px solid rgba(255, 101, 132, 0.22);
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.25s ease;
          width: 100%;
        }
        .btn-logout-mobile:hover {
          background: rgba(255, 101, 132, 0.16);
          border-color: rgba(255, 101, 132, 0.45);
          color: #fff;
        }

        .nav-link-btn {
          padding: 0.4rem 1rem;
          border-radius: 8px;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-link-btn:hover {
          background: rgba(255,255,255,0.06) !important;
          color: var(--text) !important;
        }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 1.25rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <span
          onClick={handleLogoClick}
          style={{
            fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800,
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            cursor: "pointer", flexShrink: 0,
          }}>NexHire</span>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", gap: "0.25rem" }} className="desktop-nav">
          {links.map(link => (
            <button key={link.path} onClick={() => handleNav(link.path)}
              className="nav-link-btn"
              style={{
                background: location.pathname === link.path ? "rgba(255,255,255,0.08)" : "transparent",
                color: location.pathname === link.path ? "var(--text)" : "var(--text2)",
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
          }}>{name}</span>
          {role && (
            <span style={{
              padding: "0.25rem 0.75rem", borderRadius: "20px",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px",
              textTransform: "uppercase", flexShrink: 0,
              backdropFilter: "blur(8px)",
              ...roleColors[role],
            }}>{role}</span>
          )}
          <button onClick={handleLogout} className="btn-logout-desktop">
            Logout
          </button>
        </div>

        {/* Hamburger - mobile only */}
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

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="mobile-nav" style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "1rem 1.25rem",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{
              fontSize: "0.8rem", color: "var(--text2)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
            }}>{name}</span>
            {role && (
              <span style={{
                padding: "0.25rem 0.75rem", borderRadius: "20px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px",
                textTransform: "uppercase", flexShrink: 0, ...roleColors[role],
              }}>{role}</span>
            )}
          </div>

          {links.map(link => (
            <button key={link.path} onClick={() => handleNav(link.path)} style={{
              padding: "0.75rem 1rem", borderRadius: "8px", border: "none",
              background: location.pathname === link.path ? "rgba(255,255,255,0.08)" : "transparent",
              color: location.pathname === link.path ? "var(--text)" : "var(--text2)",
              fontSize: "0.95rem", fontWeight: 500, cursor: "pointer",
              textAlign: "left", transition: "all 0.2s ease",
            }}>
              {link.label}
            </button>
          ))}

          <button onClick={handleLogout} className="btn-logout-mobile">
            Logout
          </button>
        </div>
      )}
    </>
  );
}