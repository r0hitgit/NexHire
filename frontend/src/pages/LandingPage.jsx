import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100dvh", background: "var(--bg)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Navbar */}
      <nav style={{
        padding: "0 clamp(1rem, 4vw, 3rem)", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,10,15,0.88)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <span
          onClick={() => navigate("/")}
          style={{
            fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800,
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            cursor: "pointer",
          }}>NexHire</span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "0.4rem 1.2rem", borderRadius: "8px", border: "1px solid var(--border)",
            background: "transparent", color: "var(--text2)", fontSize: "0.875rem",
            cursor: "pointer", transition: "var(--transition)",
          }}>Sign In</button>
          <button onClick={() => navigate("/register")} style={{
            padding: "0.4rem 1.2rem", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
            color: "#fff", fontSize: "0.875rem", fontWeight: 600,
            cursor: "pointer", transition: "var(--transition)",
          }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)",
        textAlign: "center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255,101,132,0.08) 0%, transparent 50%), var(--bg)",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)",
          padding: "0.35rem 1rem", borderRadius: "20px",
          fontSize: "0.8rem", color: "#8b85ff", fontWeight: 600,
          marginBottom: "2rem", animation: "fadeIn 0.5s ease",
        }}>
          🚀 The smarter way to hire & get hired
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-head)", fontWeight: 800,
          fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
          lineHeight: 1.1, marginBottom: "1.5rem",
          animation: "fadeIn 0.6s ease",
        }}>
          Find Your{" "}
          <span style={{
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Dream Job</span>
          <br />or Perfect Hire
        </h1>

        {/* Subtitle */}
        <p style={{
          color: "var(--text2)", fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          maxWidth: "580px", lineHeight: 1.7, marginBottom: "2.5rem",
          animation: "fadeIn 0.7s ease",
        }}>
          NexHire connects top talent with great companies. Apply for jobs or post openings — all in one place.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center",
          marginBottom: "4rem", animation: "fadeIn 0.8s ease",
        }}>
          <button onClick={() => navigate("/register")} style={{
            padding: "0.9rem 2rem", borderRadius: "var(--radius)",
            background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
            color: "#fff", border: "none", fontSize: "1rem", fontWeight: 700,
            fontFamily: "var(--font-head)", cursor: "pointer",
            boxShadow: "0 4px 24px rgba(108,99,255,0.4)",
            transition: "var(--transition)",
          }}>
            Get Started Free →
          </button>
          <button onClick={() => navigate("/login")} style={{
            padding: "0.9rem 2rem", borderRadius: "var(--radius)",
            background: "var(--surface)", color: "var(--text)",
            border: "1px solid var(--border)", fontSize: "1rem", fontWeight: 600,
            fontFamily: "var(--font-head)", cursor: "pointer",
            transition: "var(--transition)",
          }}>
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "clamp(2rem, 5vw, 4rem)", flexWrap: "wrap",
          justifyContent: "center", marginBottom: "5rem",
          animation: "fadeIn 0.9s ease",
        }}>
          {[
            { val: "500+", label: "Jobs Posted" },
            { val: "1K+", label: "Candidates" },
            { val: "200+", label: "Companies" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, fontFamily: "var(--font-head)", background: "linear-gradient(135deg, #6c63ff, #ff6584)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
              <div style={{ color: "var(--text2)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: "1.25rem", width: "100%", maxWidth: "900px",
          animation: "fadeIn 1s ease",
        }}>
          {[
            { icon: "🔍", title: "Smart Job Search", desc: "Search and filter jobs by title, location, and salary. Find the perfect match instantly." },
            { icon: "🏢", title: "Post Jobs Easily", desc: "Recruiters can post jobs, manage applicants, and shortlist candidates — all in one dashboard." },
            { icon: "📊", title: "Track Applications", desc: "Candidates can track their application status in real time — Applied, Shortlisted, or Rejected." },
            { icon: "🔒", title: "Secure & Verified", desc: "Email OTP verification ensures every account is genuine and your data stays safe." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "1.75rem",
              textAlign: "left", transition: "var(--transition)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>{f.title}</div>
              <div style={{ color: "var(--text2)", fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Full Footer */}
      <Footer />
    </div>
  );
}