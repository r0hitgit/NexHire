import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{
        fontSize: "1.1rem", fontFamily: "var(--font-head)",
        fontWeight: 700, marginBottom: "0.75rem", color: "var(--text)",
      }}>{title}</h2>
      <div style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)" }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "var(--accent)", cursor: "pointer",
          fontSize: "0.9rem", marginBottom: "1.5rem", padding: 0,
          display: "flex", alignItems: "center", gap: "0.4rem",
        }}>← Back</button>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontFamily: "var(--font-head)",
            fontWeight: 800, marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Privacy Policy</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.875rem" }}>
            Last updated: July 28, 2026
          </p>
        </div>

        {/* Content */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "clamp(1.5rem, 4vw, 2.5rem)",
        }}>
          <Section title="1. Introduction">
            <p>Welcome to NexHire. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform at nexhire.me.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect the following information when you register and use NexHire:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Full name and email address</li>
              <li style={{ marginBottom: "0.4rem" }}>Password (stored securely using BCrypt encryption)</li>
              <li style={{ marginBottom: "0.4rem" }}>Role (Candidate or Recruiter)</li>
              <li style={{ marginBottom: "0.4rem" }}>Resume files uploaded by candidates (stored on Cloudinary)</li>
              <li style={{ marginBottom: "0.4rem" }}>Job application data and status history</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Create and manage your account</li>
              <li style={{ marginBottom: "0.4rem" }}>Send OTP verification and password reset emails</li>
              <li style={{ marginBottom: "0.4rem" }}>Notify candidates about application status updates</li>
              <li style={{ marginBottom: "0.4rem" }}>Send interview schedule notifications</li>
              <li style={{ marginBottom: "0.4rem" }}>Enable recruiters to contact candidates</li>
            </ul>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>Your data is stored securely on Clever Cloud MySQL servers located in Paris, France. Passwords are encrypted using BCrypt. Resume files are stored on Cloudinary's secure cloud storage. We use JWT (JSON Web Tokens) for secure authentication with a 7-day expiry.</p>
          </Section>

          <Section title="5. Email Communications">
            <p>We use Brevo (formerly Sendinblue) to send transactional emails including OTP verification, welcome emails, application status updates, and interview notifications. We do not send marketing emails without your consent.</p>
          </Section>

          <Section title="6. Third Party Services">
            <p>NexHire uses the following third-party services:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Clever Cloud — Database hosting</li>
              <li style={{ marginBottom: "0.4rem" }}>Cloudinary — Resume file storage</li>
              <li style={{ marginBottom: "0.4rem" }}>Brevo — Email delivery</li>
              <li style={{ marginBottom: "0.4rem" }}>Render — Backend hosting</li>
              <li style={{ marginBottom: "0.4rem" }}>Netlify — Frontend hosting</li>
            </ul>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Access your personal data</li>
              <li style={{ marginBottom: "0.4rem" }}>Request deletion of your account and data</li>
              <li style={{ marginBottom: "0.4rem" }}>Withdraw your job applications at any time</li>
              <li style={{ marginBottom: "0.4rem" }}>Update your profile information</li>
            </ul>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain your data as long as your account is active. If you wish to delete your account and all associated data, please contact us at rv87919@gmail.com.</p>
          </Section>

          <Section title="9. Contact Us">
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p style={{ marginTop: "0.5rem" }}>
              <strong style={{ color: "var(--text)" }}>Email:</strong> rv87919@gmail.com<br />
              <strong style={{ color: "var(--text)" }}>Website:</strong> nexhire.me<br />
              <strong style={{ color: "var(--text)" }}>Developer:</strong> Rohit Verma
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}