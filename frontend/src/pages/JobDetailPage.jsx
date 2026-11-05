import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobById, applyForJob } from "../api/axios";

import {
  ArrowLeft,
  MapPin,
  Briefcase,
  CalendarDays,
  IndianRupee,
  CheckCircle2,
  FileText,
  CircleX,
  CircleCheck,
  Bookmark,
  Share2,
  Building2,
  ShieldCheck,
  Clock,
  Sparkles,
  UploadCloud,
  X,
  Lock
} from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [toast, setToast] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Saved job persistence
  const [isSaved, setIsSaved] = useState(false);

  const fileRef = useRef();
  const role = localStorage.getItem("role");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nexhire_saved_jobs") || "[]");
      setIsSaved(saved.includes(Number(id)) || saved.includes(id));
    } catch {
      setIsSaved(false);
    }

    getJobById(id)
      .then((res) => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/jobs");
      });
  }, [id, navigate]);

  const showToast = (message, Icon) => {
    setToast({ message, Icon });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const toggleSaveJob = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("nexhire_saved_jobs") || "[]");
      let updated;
      const numericId = Number(id);
      if (saved.includes(numericId) || saved.includes(id)) {
        updated = saved.filter((item) => item !== numericId && item !== id);
        setIsSaved(false);
        showToast("Removed from saved jobs", Bookmark);
      } else {
        updated = [...saved, numericId];
        setIsSaved(true);
        showToast("Saved to your profile", Bookmark);
      }
      localStorage.setItem("nexhire_saved_jobs", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Job link copied to clipboard!", Share2);
    }
  };

  const handleApply = async () => {
    if (!resume) {
      return showToast("Please upload your resume before applying", CircleX);
    }

    setApplying(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      await applyForJob(id, formData);

      setApplied(true);
      setShowApplyModal(false);
      showToast("Application submitted successfully!", CircleCheck);
    } catch (err) {
      showToast(err.response?.data || "Already applied or error occurred", CircleX);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-soft)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ maxWidth: "1140px", margin: "3rem auto", width: "100%", padding: "0 1.5rem" }}>
          <div className="skeleton" style={{ height: "450px", borderRadius: "var(--radius-lg)" }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) return null;

  const companyName = job.recruiter?.name || "Verified Organization";

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

      <style>{`
        .detail-page-container {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem clamp(1rem, 3vw, 2rem) 4rem;
        }

        .btn-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--text-secondary);
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          margin-bottom: 1.5rem;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .btn-back-link:hover {
          color: var(--primary);
          transform: translateX(-3px);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          align-items: flex-start;
        }

        .main-content-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: clamp(1.5rem, 4vw, 2.5rem);
          box-shadow: var(--shadow-sm);
        }

        .sticky-apply-sidebar {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .company-header-logo {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background: linear-gradient(135deg, #177A59 0%, #0C4E3A 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-head);
          font-size: 1.5rem;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(23, 122, 89, 0.2);
        }

        .meta-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-soft);
          border: 1px solid var(--border-color);
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          font-size: 0.86rem;
          color: var(--text-main);
          font-weight: 600;
        }

        .highlight-spec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.85rem;
          margin: 1.75rem 0;
          padding: 1.25rem;
          background: var(--bg-soft);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .spec-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .spec-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .content-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .content-section h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 1rem;
        }

        .content-prose {
          color: var(--text-secondary);
          font-size: 0.98rem;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .upload-dropzone {
          border: 2px dashed var(--border-color);
          background: var(--bg-soft);
          border-radius: var(--radius-md);
          padding: 2.25rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-dropzone:hover {
          border-color: var(--primary);
          background: var(--primary-subtle);
        }

        .upload-dropzone.has-file {
          border-color: var(--primary);
          background: var(--primary-subtle);
        }

        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--text-main);
        }

        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
          .sticky-apply-sidebar {
            position: static;
          }
        }
      `}</style>

      <main className="detail-page-container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate("/jobs")} className="btn-back-link">
          <ArrowLeft size={17} />
          <span>Back to All Jobs</span>
        </button>

        <div className="detail-grid">
          {/* Main Left Column */}
          <div className="main-content-card">
            {/* Header / Title */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <div className="company-header-logo">
                {companyName.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                  <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                    {job.title}
                  </h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem", color: "var(--primary-dark)", fontWeight: 700 }}>
                  <Building2 size={16} />
                  <span>{companyName}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--primary)", fontSize: "0.85rem" }}>
                    <ShieldCheck size={15} /> Verified Employer
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Badges Row */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {job.location && (
                <span className="meta-tag-pill">
                  <MapPin size={15} color="var(--primary)" />
                  {job.location}
                </span>
              )}

              {job.jobType && (
                <span className="meta-tag-pill">
                  <Briefcase size={15} />
                  {job.jobType}
                </span>
              )}

              {job.postedDate && (
                <span className="meta-tag-pill">
                  <CalendarDays size={15} />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Specifications Grid */}
            <div className="highlight-spec-grid">
              <div className="spec-item">
                <span className="spec-label">Compensation</span>
                <span className="spec-val" style={{ color: "var(--primary-dark)" }}>
                  {job.salary ? `₹${(job.salary / 100000).toFixed(1)}L / yr` : "Competitive"}
                </span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Workplace Type</span>
                <span className="spec-val">
                  {job.location?.toLowerCase().includes("remote") ? "Remote" : "On-site / Hybrid"}
                </span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Employment</span>
                <span className="spec-val">
                  {job.jobType || "Full-time"}
                </span>
              </div>

              <div className="spec-item">
                <span className="spec-label">Status</span>
                <span className="spec-val" style={{ color: "var(--primary)" }}>
                  Actively Hiring
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="content-section" style={{ borderTop: "none", paddingTop: 0 }}>
              <h2>About the Role</h2>
              <div className="content-prose">
                {job.description || "No extensive description provided for this opening. Please contact the hiring team or apply with your resume."}
              </div>
            </div>

            {/* Responsibilities & Qualifications */}
            <div className="content-section">
              <h2>Key Responsibilities & Scope</h2>
              <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Collaborate with cross-functional partners across engineering, product design, and operations.</li>
                <li style={{ marginBottom: "0.5rem" }}>Design, build, and optimize high-leverage workflows and features aligned with company milestones.</li>
                <li style={{ marginBottom: "0.5rem" }}>Maintain strong standards for code quality, architectural durability, and documentation.</li>
                <li style={{ marginBottom: "0.5rem" }}>Contribute to peer design discussions, code reviews, and mentorship within the department.</li>
              </ul>
            </div>

            {/* Benefits & Perks */}
            <div className="content-section">
              <h2>Benefits & Culture</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { title: "Health & Wellness", desc: "Comprehensive health coverage for you and your dependents." },
                  { title: "Learning Budget", desc: "Annual stipend for courses, conferences, and books." },
                  { title: "Flexible Schedule", desc: "Focus on outcomes and trust rather than rigid hours." },
                  { title: "Growth Pathways", desc: "Clear career progression frameworks and performance bonuses." }
                ].map((b, i) => (
                  <div key={i} style={{ background: "var(--bg-soft)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "0.25rem" }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {b.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter / Organization Section */}
            <div className="content-section">
              <h2>Hiring Organization</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-soft)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary-subtle)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                    {companyName}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Verified recruitment team on NexHire · Direct application pipeline
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Right Application Panel */}
          <aside className="sticky-apply-sidebar">
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Annual Compensation
              </span>
              <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--primary-dark)", margin: "0.2rem 0" }}>
                {job.salary ? `₹${(job.salary / 100000).toFixed(1)} Lakhs` : "Competitive"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Full-time role · Based in {job.location || "Multiple locations"}
              </div>
            </div>

            {/* Apply Action */}
            {role === "CANDIDATE" ? (
              applied ? (
                <div
                  style={{
                    background: "var(--primary-subtle)",
                    color: "var(--primary-dark)",
                    border: "1px solid #BCE0D1",
                    padding: "0.85rem",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontWeight: 700,
                    fontSize: "0.95rem"
                  }}
                >
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>Application Submitted!</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.9rem", fontSize: "1rem", minHeight: "46px" }}
                >
                  Apply Now →
                </button>
              )
            ) : role === "RECRUITER" ? (
              <div style={{ background: "var(--bg-soft)", padding: "0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.88rem", color: "var(--text-secondary)", textAlign: "center" }}>
                Logged in as Recruiter. Switch to candidate account to submit applications.
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary"
                style={{ width: "100%", padding: "0.9rem", fontSize: "1rem" }}
              >
                Sign In to Apply →
              </button>
            )}

            {/* Bookmark & Share Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={toggleSaveJob}
                className="btn-secondary"
                style={{
                  padding: "0.6rem",
                  fontSize: "0.88rem",
                  color: isSaved ? "var(--primary)" : "var(--text-main)",
                  borderColor: isSaved ? "var(--primary)" : "var(--border-color)",
                  background: isSaved ? "var(--primary-subtle)" : "#FFFFFF"
                }}
              >
                <Bookmark size={16} fill={isSaved ? "var(--primary)" : "none"} />
                <span>{isSaved ? "Saved" : "Save Job"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="btn-secondary"
                style={{ padding: "0.6rem", fontSize: "0.88rem" }}
              >
                <Share2 size={16} />
                <span>Share Role</span>
              </button>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

            {/* Trust badge */}
            <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
              <Lock size={16} color="var(--primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Your resume and personal details are strictly shared with the hiring team of this job posting.
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 33, 29, 0.5)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem",
            animation: "fadeIn 0.2s ease"
          }}
          onClick={() => setShowApplyModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                  Apply for {job.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0 }}>
                  at {companyName}
                </p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
              Please attach your updated resume (PDF format). The recruiter will review your profile directly.
            </p>

            {/* Resume Dropzone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`upload-dropzone ${resume ? "has-file" : ""}`}
            >
              <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center", color: "var(--primary)" }}>
                {resume ? <FileText size={38} /> : <UploadCloud size={40} />}
              </div>

              {resume ? (
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--primary-dark)" }}>
                    {resume.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    {(resume.size / (1024 * 1024)).toFixed(2)} MB · Click to choose different file
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "0.3rem" }}>
                    Upload Resume (PDF only)
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Click here to browse your files
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => setResume(e.target.files[0])}
              />
            </div>

            {/* Modal Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={applying || !resume}
                className="btn-primary"
                style={{ flex: 2, opacity: !resume ? 0.6 : 1 }}
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-notification">
          {toast.Icon && <toast.Icon size={18} color="var(--primary)" />}
          <span>{toast.message}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
