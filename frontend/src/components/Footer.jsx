import { useNavigate } from "react-router-dom";
import { version } from '../../package.json';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      padding: "3rem clamp(1rem, 4vw, 3rem) 1.5rem",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
        gap: "2rem", marginBottom: "2rem",
      }}>

        {/* Brand */}
        <div>
          <div style={{
            fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800,
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "0.75rem",
          }}>NexHire</div>
          <p style={{ color: "var(--text2)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "220px" }}>
            The smarter way to hire & get hired. Connecting top talent with great companies.
          </p>
        </div>

        {/* For Candidates */}
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem", color: "var(--text)" }}>
            For Candidates
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { label: "Browse Jobs", path: "/jobs" },
              { label: "My Applications", path: "/candidate" },
              { label: "Register", path: "/register" },
              { label: "Sign In", path: "/login" },
            ].map((link, i) => (
              <span key={i} onClick={() => navigate(link.path)} style={{
                color: "var(--text2)", fontSize: "0.875rem", cursor: "pointer",
                transition: "var(--transition)",
              }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--text2)"}
              >{link.label}</span>
            ))}
          </div>
        </div>

        {/* For Recruiters */}
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem", color: "var(--text)" }}>
            For Recruiters
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { label: "Post a Job", path: "/recruiter" },
              { label: "Dashboard", path: "/recruiter" },
              { label: "Register", path: "/register" },
              { label: "Sign In", path: "/login" },
            ].map((link, i) => (
              <span key={i} onClick={() => navigate(link.path)} style={{
                color: "var(--text2)", fontSize: "0.875rem", cursor: "pointer",
                transition: "var(--transition)",
              }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--text2)"}
              >{link.label}</span>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem", color: "var(--text)" }}>
            Connect
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <a href="https://www.linkedin.com/in/r0hitin" target="_blank" rel="noreferrer" style={{
              color: "var(--text2)", fontSize: "0.875rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "0.5rem", transition: "var(--transition)",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#0077b5"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text2)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/r0hitgit" target="_blank" rel="noreferrer" style={{
              color: "var(--text2)", fontSize: "0.875rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "0.5rem", transition: "var(--transition)",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text2)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: "1px solid var(--border)", paddingTop: "1.5rem",
        display: "flex", justifyContent: "center", alignItems: "center",
        flexDirection: "column", gap: "0.5rem",
        textAlign: "center",
      }}>
        <span style={{ color: "var(--text2)", fontSize: "0.825rem" }}>
          © 2026 NexHire. All rights reserved. Built with{" "}
          <span style={{ color: "#ff6584" }}>❤️</span>{" "}
          by{" "}
          <a href="https://www.linkedin.com/in/r0hitin" target="_blank" rel="noreferrer"
            style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
            Rohit Verma
          </a>
        </span>

        {/* ✅ CHANGE: Version badge added */}
        <span style={{
            color: "var(--text2)", fontSize: "0.75rem",
            background: "var(--surface2)", border: "1px solid var(--border)",
            padding: "0.2rem 0.6rem", borderRadius: "20px",
          }}>
            v{version}
          </span>
        </div>
    </footer>
  );
}