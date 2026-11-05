import { useNavigate, Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { version } from "../../package.json";
import Logo from "./Logo";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "4rem",
        paddingBottom: "0",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 4vw, 2.5rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: "320px" }}>
            <div
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              <Logo size={28} />
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.03em",
                }}
              >
                Nex<span style={{ color: "var(--primary)" }}>Hire</span>
              </span>
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.92rem",
                lineHeight: 1.65,
                marginBottom: "1.25rem",
              }}
            >
              The modern recruitment marketplace connecting exceptional candidates with high-impact teams.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.82rem",
                color: "var(--primary-dark)",
                background: "var(--primary-subtle)",
                padding: "0.35rem 0.75rem",
                borderRadius: "20px",
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={15} />
              Verified Roles & Candidates
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: "0.95rem",
                marginBottom: "1.2rem",
                color: "var(--text-main)",
                letterSpacing: "-0.01em",
              }}
            >
              For Candidates
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Explore All Jobs", path: "/jobs" },
                { label: "Career Resources & Playbooks", path: "/career-resources" },
                { label: "My Applications", path: "/candidate" },
                { label: "Candidate Sign In", path: "/login" },
                { label: "Create Candidate Profile", path: "/register" },
              ].map((link, i) => (
                <span
                  key={i}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>

          {/* For Employers */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: "0.95rem",
                marginBottom: "1.2rem",
                color: "var(--text-main)",
                letterSpacing: "-0.01em",
              }}
            >
              For Employers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Post a Job", path: "/recruiter" },
                { label: "Recruiter Dashboard", path: "/recruiter" },
                { label: "Hiring Solutions", path: "/register" },
                { label: "Employer Sign In", path: "/login" },
              ].map((link, i) => (
                <span
                  key={i}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>

          {/* Resources & Socials */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: "0.95rem",
                marginBottom: "1.2rem",
                color: "var(--text-main)",
                letterSpacing: "-0.01em",
              }}
            >
              Company & Legal
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <Link
                to="/privacy-policy"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
              >
                Privacy & Data Security
              </Link>
              <Link
                to="/privacy-policy"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
              >
                Terms of Service
              </Link>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href="https://www.linkedin.com/in/r0hitin"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "var(--bg-section)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0077b5";
                  e.currentTarget.style.borderColor = "#0077b5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              <a
                href="https://github.com/r0hitgit"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "var(--bg-section)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-main)";
                  e.currentTarget.style.borderColor = "var(--text-main)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            © {new Date().getFullYear()} NexHire Inc. All rights reserved. Built with precision by{" "}
            <a
              href="https://www.linkedin.com/in/r0hitin"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--primary-dark)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Rohit Verma
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                background: "var(--bg-section)",
                border: "1px solid var(--border-color)",
                padding: "0.25rem 0.65rem",
                borderRadius: "20px",
                fontWeight: 600,
              }}
            >
              Platform v{version}
            </span>
          </div>
        </div>
      </div>

      {/* Blended Massive Watermark Brand Text at Webpage Base */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          userSelect: "none",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          lineHeight: 0.72,
          marginTop: "2rem",
          marginBottom: "-1.8vw",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(5.5rem, 19vw, 17.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            background: "linear-gradient(180deg, rgba(23, 122, 89, 0.16) 0%, rgba(23, 122, 89, 0.02) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "rgba(23, 122, 89, 0.12)",
          }}
        >
          NexHire.
        </span>
      </div>
    </footer>
  );
}
