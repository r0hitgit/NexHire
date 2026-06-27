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
      localStorage.setItem("name", payload.name || payload.sub);
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
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
      background: "radial-gradient(ellipse at 60% 20%, rgba(108,99,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,101,132,0.07) 0%, transparent 50%), var(--bg)",
      padding: "1rem",
    }}>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: var(--radius-lg);
          padding: clamp(1.5rem, 5vw, 2.5rem);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(108,99,255,0.08);
          animation: fadeIn 0.5s ease;
        }

        .login-input:focus {
          border-color: rgba(108, 99, 255, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
        }

        .btn-signin-submit {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid rgba(108, 99, 255, 0.4);
          background: rgba(108, 99, 255, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #d0cdff;
          border-radius: var(--radius);
          font-size: 1rem;
          font-weight: 600;
          font-family: var(--font-head);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(108, 99, 255, 0.15);
        }
        .btn-signin-submit:hover:not(:disabled) {
          background: rgba(108, 99, 255, 0.32);
          border-color: rgba(108, 99, 255, 0.7);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(108, 99, 255, 0.28);
        }
        .btn-signin-submit:active:not(:disabled) {
          transform: translateY(0px);
        }
        .btn-signin-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="login-card">
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
            background: "rgba(255,101,132,0.08)", border: "1px solid rgba(255,101,132,0.25)",
            color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)",
            fontSize: "0.875rem", marginBottom: "1rem",
            backdropFilter: "blur(8px)",
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="login-input"
            style={{ ...inputStyle, marginBottom: "1.2rem" }}
          />

          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative", marginBottom: "0.75rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="login-input"
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

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <Link to="/forgot-password" style={{ color: "var(--accent)", fontSize: "0.825rem", fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-signin-submit">
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