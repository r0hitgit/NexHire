import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut, User, Compass, Building, BookOpen } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email") || "";
  const name = localStorage.getItem("name") || email.split("@")[0] || "User";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate(token ? "/jobs" : "/");
  };

  const roleStyles = {
    RECRUITER: {
      bg: "#E8F5F0",
      text: "#0C4E3A",
      border: "#BCE0D1",
      label: "Recruiter"
    },
    CANDIDATE: {
      bg: "#F0FDF4",
      text: "#15803D",
      border: "#BBF7D0",
      label: "Candidate"
    },
    ADMIN: {
      bg: "#FEF2F2",
      text: "#B91C1C",
      border: "#FECACA",
      label: "Admin"
    }
  };

  const currentRoleStyle = roleStyles[role] || {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#E2E8F0",
    label: role
  };

  return (
    <>
      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          height: 70px;
          display: flex;
          align-items: center;
          padding: 0 clamp(1rem, 4vw, 2.5rem);
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .navbar-inner {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
        }

        .nav-logo:hover svg {
          transform: scale(1.06);
        }

        .logo-text {
          font-family: var(--font-head);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
        }

        .logo-text span {
          color: var(--primary);
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-link-item {
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
        }

        .nav-link-item:hover {
          color: var(--primary);
          background: var(--bg-soft);
        }

        .nav-link-item.active {
          color: var(--primary-dark);
          background: var(--primary-subtle);
        }

        .btn-employer-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: var(--accent-lime);
          color: var(--primary-dark);
          font-weight: 700;
          font-size: 0.88rem;
          padding: 0.52rem 1.05rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(12, 78, 58, 0.12);
          box-shadow: 0 2px 4px rgba(23, 122, 89, 0.08);
          transition: var(--transition);
        }

        .btn-employer-cta:hover {
          background: #d4e857;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(23, 122, 89, 0.12);
        }

        .btn-nav-signin {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
          padding: 0.52rem 1.1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          box-shadow: var(--shadow-xs);
          transition: var(--transition);
        }

        .btn-nav-signin:hover {
          background: var(--bg-soft);
          border-color: #CBD5E1;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.35rem 0.6rem 0.35rem 0.4rem;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          background: var(--bg-section);
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .btn-nav-logout {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #DC2626;
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .btn-nav-logout:hover {
          background: #FEE2E2;
          color: #B91C1C;
        }

        .hamburger-btn {
          display: none;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          cursor: pointer;
        }

        @media (max-width: 860px) {
          .nav-links-desktop,
          .nav-actions-desktop {
            display: none !important;
          }
          .hamburger-btn {
            display: inline-flex !important;
          }
        }
      `}</style>

      <nav className="navbar-container">
        <div className="navbar-inner">
          {/* Brand Logo & Name */}
          <div className="nav-logo" onClick={handleLogoClick}>
            <Logo size={28} />
            <span className="logo-text">
              Nex<span>Hire</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            <button
              onClick={() => navigate("/jobs")}
              className={`nav-link-item ${location.pathname === "/jobs" ? "active" : ""}`}
            >
              <Compass size={16} />
              Find Jobs
            </button>

            <button
              onClick={() => navigate("/jobs")}
              className="nav-link-item"
            >
              <Building size={16} />
              Companies
            </button>

            <button
              onClick={() => navigate("/career-resources")}
              className={`nav-link-item ${location.pathname === "/career-resources" ? "active" : ""}`}
            >
              <BookOpen size={16} />
              Career Resources
            </button>

            {role === "CANDIDATE" && (
              <button
                onClick={() => navigate("/candidate")}
                className={`nav-link-item ${location.pathname === "/candidate" ? "active" : ""}`}
              >
                My Applications
              </button>
            )}

            {role === "RECRUITER" && (
              <button
                onClick={() => navigate("/recruiter")}
                className={`nav-link-item ${location.pathname === "/recruiter" ? "active" : ""}`}
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="nav-actions-desktop" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* For Employers CTA */}
            {role !== "RECRUITER" && (
              <button
                onClick={() => navigate(token ? "/recruiter" : "/register")}
                className="btn-employer-cta"
              >
                For Employers
              </button>
            )}

            {token ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="user-profile-badge">
                  <div className="user-avatar">
                    {name.charAt(0) || "U"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-main)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name}
                    </span>
                    {role && (
                      <span style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: currentRoleStyle.text,
                        textTransform: "uppercase"
                      }}>
                        {currentRoleStyle.label}
                      </span>
                    )}
                  </div>
                </div>

                <button onClick={handleLogout} className="btn-nav-logout" title="Sign out">
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button onClick={() => navigate("/login")} className="btn-nav-signin">
                  Sign In
                </button>
                <button onClick={() => navigate("/register")} className="btn-primary" style={{ padding: "0.52rem 1.15rem", fontSize: "0.88rem" }}>
                  Join Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(23, 33, 29, 0.4)",
            zIndex: 99,
            display: "flex",
            justifyContent: "flex-end",
            animation: "fadeIn 0.2s ease"
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "320px",
              background: "#FFFFFF",
              height: "100%",
              padding: "1.5rem",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User card if logged in */}
            {token ? (
              <div style={{
                padding: "0.9rem",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-soft)",
                border: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <div className="user-avatar" style={{ width: "38px", height: "38px", fontSize: "1rem" }}>
                  {name.charAt(0) || "U"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {name}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: currentRoleStyle.text, fontWeight: 600 }}>
                    {currentRoleStyle.label}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Navigation links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <button
                onClick={() => { navigate("/jobs"); setMenuOpen(false); }}
                className={`nav-link-item ${location.pathname === "/jobs" ? "active" : ""}`}
                style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem", minHeight: "44px" }}
              >
                <Compass size={18} />
                Find Jobs
              </button>

              <button
                onClick={() => { navigate("/jobs"); setMenuOpen(false); }}
                className="nav-link-item"
                style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem", minHeight: "44px" }}
              >
                <Building size={18} />
                Companies
              </button>

              <button
                onClick={() => { navigate("/career-resources"); setMenuOpen(false); }}
                className={`nav-link-item ${location.pathname === "/career-resources" ? "active" : ""}`}
                style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem", minHeight: "44px" }}
              >
                <BookOpen size={18} />
                Career Resources
              </button>

              {role === "CANDIDATE" && (
                <button
                  onClick={() => { navigate("/candidate"); setMenuOpen(false); }}
                  className={`nav-link-item ${location.pathname === "/candidate" ? "active" : ""}`}
                  style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem", minHeight: "44px" }}
                >
                  My Applications
                </button>
              )}

              {role === "RECRUITER" && (
                <button
                  onClick={() => { navigate("/recruiter"); setMenuOpen(false); }}
                  className={`nav-link-item ${location.pathname === "/recruiter" ? "active" : ""}`}
                  style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "1rem", minHeight: "44px" }}
                >
                  Dashboard
                </button>
              )}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "0.5rem 0" }} />

            {/* Mobile Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
              {role !== "RECRUITER" && (
                <button
                  onClick={() => { navigate(token ? "/recruiter" : "/register"); setMenuOpen(false); }}
                  className="btn-employer-cta"
                  style={{ justifyContent: "center", minHeight: "44px" }}
                >
                  For Employers
                </button>
              )}

              {token ? (
                <button
                  onClick={handleLogout}
                  className="btn-nav-logout"
                  style={{ justifyContent: "center", minHeight: "44px", width: "100%" }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { navigate("/login"); setMenuOpen(false); }}
                    className="btn-secondary"
                    style={{ width: "100%", minHeight: "44px" }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setMenuOpen(false); }}
                    className="btn-primary"
                    style={{ width: "100%", minHeight: "44px" }}
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
