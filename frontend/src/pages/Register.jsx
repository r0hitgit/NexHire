import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { register, verifyOtp } from "../api/axios";

import {
  Check,
  Circle,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import Logo from "../components/Logo";

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  if (score <= 1) {
    return { score, label: "Needs Improvement", color: "#DC2626" };
  }
  if (score === 2) {
    return { score, label: "Weak", color: "#EA580C" };
  }
  if (score === 3) {
    return { score, label: "Fair", color: "#D97706" };
  }
  if (score === 4) {
    return { score, label: "Good", color: "#16A34A" };
  }
  return { score: 5, label: "Strong & Secure", color: "#177A59" };
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "RECRUITER" ? "RECRUITER" : "CANDIDATE";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const strength = getPasswordStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (strength.score < 5) {
      setError("Please create a strong password meeting all five security criteria below.");
      setLoading(false);
      return;
    }

    try {
      await register(form);
      setSuccess("A 6-digit verification code has been sent to your email!");
      setStep("verify");
    } catch (err) {
      const msg = err.response?.data;
      setError(
        msg === "Email already registered"
          ? "This email is already registered. Please sign in instead."
          : msg || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOtp({
        email: form.email,
        otp,
      });

      setSuccess("Account successfully verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      const msg = err.response?.data;
      setError(msg || "Invalid verification code. Please check and try again.");
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
        .register-card {
          width: 100%;
          max-width: 460px;
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

        .role-btn {
          flex: 1;
          padding: 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .role-btn.active {
          border-color: var(--primary);
          background: var(--primary-subtle);
          color: var(--primary-dark);
          box-shadow: 0 2px 6px rgba(23, 122, 89, 0.1);
        }
      `}</style>

      <div className="register-card">
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

        {step === "register" ? (
          <>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem" }}>
              Create your account
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
              Join thousands of job seekers and verified hiring teams.
            </p>

            {/* Error banner */}
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
                {error.includes("already registered") && (
                  <span>
                    {" "}
                    <Link to="/login" style={{ color: "var(--primary-dark)", fontWeight: 700, textDecoration: "underline" }}>
                      Sign in here
                    </Link>
                  </span>
                )}
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div
                style={{
                  background: "var(--primary-subtle)",
                  border: "1px solid #BCE0D1",
                  color: "var(--primary-dark)",
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.88rem",
                  marginBottom: "1.25rem",
                  fontWeight: 600
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Role Selection */}
              <label style={labelStyle}>I want to...</label>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <button
                  type="button"
                  className={`role-btn ${form.role === "CANDIDATE" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: "CANDIDATE" })}
                >
                  <User size={18} />
                  <span>Find a Job</span>
                </button>

                <button
                  type="button"
                  className={`role-btn ${form.role === "RECRUITER" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: "RECRUITER" })}
                >
                  <Building2 size={18} />
                  <span>Hire Talent</span>
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="auth-input"
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="auth-input"
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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

              {/* Password Strength Checklist */}
              {form.password && (
                <div style={{ background: "var(--bg-soft)", padding: "0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.4rem" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "4px",
                          borderRadius: "2px",
                          background: i <= strength.score ? strength.color : "#CBD5E1",
                          transition: "background 0.3s ease"
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", fontWeight: 700, color: strength.color, marginBottom: "0.5rem" }}>
                    <span>{strength.label}</span>
                    <span>{strength.score}/5</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {[
                      { label: "At least 8 characters", met: form.password.length >= 8 },
                      { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(form.password) },
                      { label: "One lowercase letter (a-z)", met: /[a-z]/.test(form.password) },
                      { label: "One number (0-9)", met: /[0-9]/.test(form.password) },
                      { label: "One special character (!@#$...)", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password) }
                    ].map((req, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.76rem", color: req.met ? "var(--primary)" : "var(--text-muted)" }}>
                        {req.met ? <Check size={12} strokeWidth={3} /> : <Circle size={8} />}
                        <span style={{ fontWeight: req.met ? 600 : 400 }}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", marginTop: "0.5rem" }}
              >
                <span>{loading ? "Creating account..." : "Create Free Account"}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary-dark)", fontWeight: 700 }}>
                Sign in
              </Link>
            </p>
          </>
        ) : (
          /* Step 2: OTP Verification */
          <>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem" }}>
              Verify your email
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.75rem" }}>
              We've emailed a 6-digit confirmation code to <strong style={{ color: "var(--text-main)" }}>{form.email}</strong>.
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

            <form onSubmit={handleVerifyOtp}>
              <label style={labelStyle}>Enter 6-digit Code</label>
              <input
                style={{
                  ...inputStyle,
                  fontSize: "1.6rem",
                  letterSpacing: "0.5rem",
                  textAlign: "center",
                  fontWeight: 700
                }}
                type="text"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="auth-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", marginTop: "0.5rem" }}
              >
                <span>{loading ? "Verifying..." : "Verify & Get Started"}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              Didn't receive code?{" "}
              <span
                onClick={() => setStep("register")}
                style={{ color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}
              >
                Go back to re-enter email
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
