import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await login({ email, password });
      const token = response.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("role", payload.role?.replace("ROLE_", ""));
      localStorage.setItem("email", payload.sub);
      if (payload.role?.includes("RECRUITER")) navigate("/recruiter");
      else if (payload.role?.includes("CANDIDATE")) navigate("/candidate");
      else navigate("/jobs");
    } catch (err) {
      setError(err.response?.data || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "var(--text2)", marginBottom: "0.4rem",
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 60% 20%, rgba(108,99,255,0.08) 0%, transparent 60%), var(--bg)",
      padding: "1rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "clamp(1.5rem, 5vw, 2.5rem)",
        boxShadow: "var(--shadow), var(--shadow-accent)",
        animation: "fadeIn 0.5s ease",
      }}>
        <div style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(1.4rem, 5vw, 1.8rem)", fontWeight: 800,
          background: "linear-gradient(135deg, #6c63ff, #ff6584)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "0.25rem",
        }}>NexHire</div>
        <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)",
            color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)",
            fontSize: "0.875rem", marginBottom: "1rem",
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
            style={{ ...inputStyle, marginBottom: "1.2rem" }}
          />

          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative", marginBottom: "0.75rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
              style={{ ...inputStyle, paddingRight: "3rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "0.75rem", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text2)", padding: "0.25rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <Link to="/forgot-password" style={{ color: "var(--accent)", fontSize: "0.825rem", fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.85rem",
            background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
            color: "#fff", border: "none", borderRadius: "var(--radius)",
            fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
          }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text2)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}