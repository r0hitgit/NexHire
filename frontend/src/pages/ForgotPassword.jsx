import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/users/forgot-password", { email });
      setSuccess("OTP sent to your email! Please check your inbox.");
      setStep("reset");
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/users/reset-password", { email, otp, newPassword });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (err) {
      setError(err.response?.data || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem",
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
        {/* Logo */}
        <div style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(1.4rem, 5vw, 1.8rem)", fontWeight: 800,
          background: "linear-gradient(135deg, #6c63ff, #ff6584)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "0.25rem",
        }}>NexHire</div>

        {step === "email" ? (
          <>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Enter your email and we'll send you an OTP to reset your password.
            </p>

            {error && <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            {success && <div style={{ background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{success}</div>}

            <form onSubmit={handleSendOtp}>
              <label style={labelStyle}>Email</label>
              <input
                type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
                style={{ ...inputStyle, marginBottom: "1.5rem" }}
              />

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "0.85rem",
                background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
                color: "#fff", border: "none", borderRadius: "var(--radius)",
                fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
              }}>
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Enter the OTP sent to{" "}
              <strong style={{ color: "var(--text)", wordBreak: "break-all" }}>{email}</strong>{" "}
              and your new password.
            </p>

            {error && <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            {success && <div style={{ background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{success}</div>}

            <form onSubmit={handleResetPassword}>
              <label style={labelStyle}>Enter OTP</label>
              <input
                style={{ ...inputStyle, fontSize: "1.5rem", letterSpacing: "0.5rem", textAlign: "center", marginBottom: "1.2rem" }}
                type="text" placeholder="______" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value)} required
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />

              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters" value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} required
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

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "0.85rem",
                background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
                color: "#fff", border: "none", borderRadius: "var(--radius)",
                fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
              }}>
                {loading ? "Resetting..." : "Reset Password →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem", color: "var(--text2)" }}>
              Didn't receive OTP?{" "}
              <span onClick={() => setStep("email")} style={{ color: "var(--accent)", fontWeight: 500, cursor: "pointer" }}>Go back</span>
            </p>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text2)" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}