import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/axios";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
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
    width: "100%",
    padding: "0.8rem 1rem",
    background: "#FFFFFF",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-main)",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease"
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--text-secondary)",
    marginBottom: "0.45rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-soft)",
        padding: "1.5rem"
      }}
    >
      <style>{`
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: clamp(2rem, 5vw, 2.75rem);
          box-shadow: var(--shadow-md);
          animation: fadeIn 0.35s ease;
        }

        .auth-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(23, 122, 89, 0.12) !important;
        }
      `}</style>

      <div className="auth-card">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", cursor: "pointer" }}
        >
          <Logo size={30} />
          <span style={{ fontFamily: "var(--font-head)", fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
            Nex<span style={{ color: "var(--primary)" }}>Hire</span>
          </span>
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem" }}>
          Welcome back
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
          Sign in to access your jobs, applications, and hiring tools.
        </p>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              padding: "0.8rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.88rem",
              marginBottom: "1.25rem",
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                style={{ ...inputStyle, paddingRight: "3rem", marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <Link
              to="/forgot-password"
              style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary-dark)", fontWeight: 700 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
