import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, verifyOtp } from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await register(form);
      setSuccess("OTP sent to your email! Please check your inbox.");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await verifyOtp({ email: form.email, otp });
      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem", marginBottom: "1.2rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem",
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "var(--text2)", marginBottom: "0.4rem",
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 40% 80%, rgba(255,101,132,0.07) 0%, transparent 60%), var(--bg)",
      padding: "1rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "440px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "clamp(1.25rem, 5vw, 2.5rem)",
        boxShadow: "var(--shadow)", animation: "fadeIn 0.5s ease",
      }}>
        <div style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(1.4rem, 5vw, 1.8rem)", fontWeight: 800,
          background: "linear-gradient(135deg, #6c63ff, #ff6584)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.25rem",
        }}>JobPortal</div>

        {step === "register" ? (
          <>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Create your account</p>

            {error && <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            {success && <div style={{ background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{success}</div>}

            <form onSubmit={handleRegister}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} type="text" placeholder="Your Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />

              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />

              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />

              <label style={labelStyle}>I am a...</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {["CANDIDATE", "RECRUITER"].map(r => (
                  <button key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    style={{
                      padding: "0.75rem 0.5rem", borderRadius: "var(--radius)",
                      border: `2px solid ${form.role === r ? "var(--accent)" : "var(--border)"}`,
                      background: form.role === r ? "rgba(108,99,255,0.1)" : "var(--surface2)",
                      color: form.role === r ? "var(--accent)" : "var(--text2)",
                      fontWeight: 600, fontSize: "clamp(0.75rem, 3vw, 0.875rem)",
                      cursor: "pointer", transition: "var(--transition)",
                    }}>
                    {r === "CANDIDATE" ? "👤 Candidate" : "🏢 Recruiter"}
                  </button>
                ))}
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "0.85rem",
                background: "linear-gradient(135deg, #ff6584, #ff8fa3)",
                color: "#fff", border: "none", borderRadius: "var(--radius)",
                fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(255,101,132,0.35)",
              }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text2)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Enter the 6-digit OTP sent to{" "}
              <strong style={{ color: "var(--text)", wordBreak: "break-all" }}>{form.email}</strong>
            </p>

            {error && <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            {success && <div style={{ background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{success}</div>}

            <form onSubmit={handleVerifyOtp}>
              <label style={labelStyle}>Enter OTP</label>
              <input
                style={{ ...inputStyle, fontSize: "1.5rem", letterSpacing: "0.5rem", textAlign: "center" }}
                type="text" placeholder="______" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value)} required
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "0.85rem",
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                color: "#fff", border: "none", borderRadius: "var(--radius)",
                fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(108,99,255,0.35)",
              }}>
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text2)" }}>
              Didn't receive OTP?{" "}
              <span onClick={() => setStep("register")} style={{ color: "var(--accent)", fontWeight: 500, cursor: "pointer" }}>Go back</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}