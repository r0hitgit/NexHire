import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/users/forgot-password", { email });
      setSuccess("OTP sent to your email! Please check your inbox.");
      setStep("reset");
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/users/reset-password", { email, otp, newPassword });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data || "Failed to reset password. Please check code.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem 1rem",
    marginBottom: "1rem",
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
        .forgot-card {
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

      <div className="forgot-card">
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

        {step === "email" ? (
          <>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem" }}>
              Reset your password
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
              Enter your verified email and we'll send a 6-digit verification code.
            </p>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: "var(--primary-subtle)", border: "1px solid #BCE0D1", color: "var(--primary-dark)", padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSendOtp}>
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", marginTop: "0.5rem" }}
              >
                <span>{loading ? "Sending Code..." : "Send Verification Code"}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <Link
                to="/login"
                style={{ color: "var(--primary-dark)", fontSize: "0.88rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
              >
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem" }}>
              Create new password
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
              Enter the code sent to <strong style={{ color: "var(--text-main)" }}>{email}</strong> and pick a new password.
            </p>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: "var(--primary-subtle)", border: "1px solid #BCE0D1", color: "var(--primary-dark)", padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                {success}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <label style={labelStyle}>6-digit OTP Code</label>
              <input
                type="text"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="auth-input"
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.35rem", fontSize: "1.3rem", fontWeight: 700 }}
              />

              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
              >
                <span>{loading ? "Resetting..." : "Reset Password"}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <span
                onClick={() => setStep("email")}
                style={{ color: "var(--primary-dark)", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" }}
              >
                ← Resend code or change email
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
