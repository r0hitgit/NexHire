import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, verifyOtp } from "../api/axios";

// ✅ NEW: Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 1) return { score, label: "Very Weak", color: "#ff6584" };
  if (score === 2) return { score, label: "Weak", color: "#ff9f43" };
  if (score === 3) return { score, label: "Fair", color: "#f59e0b" };
  if (score === 4) return { score, label: "Strong", color: "#43e97b" };
  return { score: 5, label: "Very Strong", color: "#00d2ff" };
};

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ NEW: Compute strength on every keystroke
  const strength = getPasswordStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    // ✅ NEW: Block submit if password not strong enough
    if (strength.score < 5) {
      setError("Please create a stronger password meeting all requirements.");
      setLoading(false);
      return;
    }

    try {
      await register(form);
      setSuccess("OTP sent to your email! Please check your inbox.");
      setStep("verify");
    } catch (err) {
      const msg = err.response?.data;
      setError(
        msg === "Email already registered"
          ? "This email is already registered. Please sign in instead."
          : msg || "Registration failed. Try again."
      );
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
      const msg = err.response?.data;
      setError(msg || "Invalid OTP. Please try again.");
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
        }}>NexHire</div>

        {step === "register" ? (
          <>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Create your account</p>

            {error && (
              <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
                {error.includes("already registered") && (
                  <span> <Link to="/login" style={{ color: "#ff6584", fontWeight: 700, textDecoration: "underline" }}>Sign in here</Link></span>
                )}
              </div>
            )}
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
              <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                  style={{ ...inputStyle, marginBottom: 0, paddingRight: "3rem" }}
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

              {/* ✅ NEW: Password strength bar */}
              {form.password && (
                <div style={{ marginBottom: "1rem" }}>
                  {/* Strength bars */}
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.4rem" }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: "4px", borderRadius: "2px",
                        background: i <= strength.score ? strength.color : "var(--border)",
                        transition: "background 0.3s ease",
                      }} />
                    ))}
                  </div>
                  {/* Strength label */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: strength.color, fontWeight: 600 }}>
                      {strength.label}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text2)" }}>
                      {strength.score}/5
                    </span>
                  </div>
                  {/* ✅ NEW: Requirements checklist */}
                  <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {[
                      { label: "At least 8 characters", met: form.password.length >= 8 },
                      { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(form.password) },
                      { label: "One lowercase letter (a-z)", met: /[a-z]/.test(form.password) },
                      { label: "One number (0-9)", met: /[0-9]/.test(form.password) },
                      { label: "One special character (!@#$...)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
                    ].map((req, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem" }}>
                        <span style={{ color: req.met ? "#43e97b" : "var(--text2)", fontSize: "0.7rem" }}>
                          {req.met ? "✓" : "○"}
                        </span>
                        <span style={{ color: req.met ? "#43e97b" : "var(--text2)" }}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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