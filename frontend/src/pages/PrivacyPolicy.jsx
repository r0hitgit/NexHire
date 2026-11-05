import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          fontSize: "1.2rem",
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          marginBottom: "0.75rem",
          color: "var(--text-main)",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-soft)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          maxWidth: "880px",
          width: "100%",
          margin: "0 auto",
          padding: "2.5rem clamp(1rem, 3vw, 2rem) 4rem",
        }}
      >
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "0.92rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--primary-subtle)",
              color: "var(--primary-dark)",
              padding: "0.3rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            <ShieldCheck size={15} />
            Data Protection Standards
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              color: "var(--text-main)",
              marginBottom: "0.5rem",
            }}
          >
            Privacy Policy & Data Security
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Last updated: November 2026 · Effective across all NexHire platforms
          </p>
        </div>

        {/* Content Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(1.75rem, 5vw, 3rem)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <Section title="1. Introduction & Overview">
            <p>
              Welcome to NexHire. We are deeply committed to protecting candidate confidentiality, employer data integrity, and your fundamental right to privacy. This policy explains what information we collect, why we collect it, how it is secured, and your rights as a candidate or recruiter on our platform.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>When you register and interact with the platform, we collect:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.6rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Full name, contact email address, and account role (Candidate or Recruiter).</li>
              <li style={{ marginBottom: "0.4rem" }}>Cryptographically hashed passwords using enterprise BCrypt encryption.</li>
              <li style={{ marginBottom: "0.4rem" }}>Resume documents uploaded by candidates (stored privately in encrypted cloud object storage).</li>
              <li style={{ marginBottom: "0.4rem" }}>Job posting information, candidate applications, interview schedules, and direct recruiter messages.</li>
            </ul>
          </Section>

          <Section title="3. Purpose of Processing">
            <p>We process your data strictly to facilitate authentic recruitment interactions:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.6rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Delivering secure OTP verification for account authentication and password resets.</li>
              <li style={{ marginBottom: "0.4rem" }}>Allowing candidates to apply directly to verified openings.</li>
              <li style={{ marginBottom: "0.4rem" }}>Transmitting real-time application updates (Applied, Shortlisted, Interview Scheduled).</li>
              <li style={{ marginBottom: "0.4rem" }}>Enabling employers to review verified candidate credentials and coordinate interview sessions.</li>
            </ul>
          </Section>

          <Section title="4. Data Storage & Security Measures">
            <p>
              Your data is hosted on highly reliable cloud infrastructure with automated backups and SSL/TLS encryption in transit and at rest. Access to candidate resumes is restricted strictly to hiring teams for the respective jobs to which the candidate applied. We never sell or license candidate profile information to third-party ad networks.
            </p>
          </Section>

          <Section title="5. Candidate & Employer Rights">
            <p>Under our privacy guidelines, all platform users have the right to:</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.6rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>Access and export their profile data and application history.</li>
              <li style={{ marginBottom: "0.4rem" }}>Withdraw active applications at any point in the recruitment pipeline.</li>
              <li style={{ marginBottom: "0.4rem" }}>Request immediate deletion or anonymization of their account and uploaded resumes.</li>
            </ul>
          </Section>

          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              color: "var(--primary-dark)",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} color="var(--primary)" />
            <span>Questions regarding your data? Contact our team anytime at privacy@nexhire.me</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
