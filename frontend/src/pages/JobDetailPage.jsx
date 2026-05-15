import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobById, applyForJob } from "../api/axios";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [toast, setToast] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const fileRef = useRef();
  const role = localStorage.getItem("role");

  useEffect(() => {
    getJobById(id)
      .then(res => { setJob(res.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate("/jobs"); });
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleApply = async () => {
    // ✅ CHANGE 1: Resume is now mandatory
    if (!resume) return showToast("❌ Please upload your resume before applying");
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      await applyForJob(id, formData);
      setApplied(true);
      setShowApplyModal(false);
      showToast("✅ Application submitted successfully!");
    } catch (err) {
      showToast("❌ " + (err.response?.data || "Already applied or error occurred"));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
        <div className="skeleton" style={{ height: "400px", borderRadius: "var(--radius-lg)" }} />
      </div>
    </div>
  );

  if (!job) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)" }}>

        {/* Back */}
        <button onClick={() => navigate("/jobs")} style={{
          background: "none", border: "none", color: "var(--accent)", cursor: "pointer",
          fontSize: "0.9rem", marginBottom: "1.5rem", padding: 0, display: "flex", alignItems: "center", gap: "0.4rem"
        }}>← Back to Jobs</button>

        {/* Job Card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "1.5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", marginBottom: "0.4rem", fontFamily: "var(--font-head)" }}>{job.title}</h1>
              <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "1rem" }}>{job.recruiter?.name || "Company"}</div>
            </div>
            {job.salary && (
              <span style={{ background: "rgba(67,233,123,0.12)", color: "#43e97b", padding: "0.5rem 1.2rem", borderRadius: "20px", fontSize: "1rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                ₹{(job.salary / 100000).toFixed(1)}L / year
              </span>
            )}
          </div>

          {/* Meta Pills */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {job.location && (
              <span style={{ background: "var(--surface2)", border: "1px solid var(--border)", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text2)" }}>
                📍 {job.location}
              </span>
            )}
            {job.jobType && (
              <span style={{ background: "var(--surface2)", border: "1px solid var(--border)", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text2)" }}>
                💼 {job.jobType}
              </span>
            )}
            {job.postedDate && (
              <span style={{ background: "var(--surface2)", border: "1px solid var(--border)", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text2)" }}>
                📅 Posted {new Date(job.postedDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)", marginBottom: "2rem" }} />

          {/* Description */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontFamily: "var(--font-head)", marginBottom: "1rem" }}>Job Description</h2>
            <p style={{ color: "var(--text2)", lineHeight: 1.8, whiteSpace: "pre-wrap", fontSize: "0.95rem" }}>
              {job.description || "No description provided."}
            </p>
          </div>

          {/* Apply Button */}
          {role === "CANDIDATE" && (
            applied ? (
              <div style={{
                padding: "1rem", textAlign: "center",
                background: "rgba(67,233,123,0.1)", color: "#43e97b",
                border: "1px solid rgba(67,233,123,0.3)", borderRadius: "var(--radius)",
                fontWeight: 600, fontSize: "1rem",
              }}>
                ✓ Application Submitted!
              </div>
            ) : (
              <button onClick={() => setShowApplyModal(true)} style={{
                width: "100%", padding: "0.85rem",
                background: "linear-gradient(135deg, var(--accent), #8b85ff)",
                color: "#fff", border: "none", borderRadius: "var(--radius)",
                fontWeight: 700, fontSize: "1rem", fontFamily: "var(--font-head)",
                cursor: "pointer", transition: "var(--transition)",
              }}
                onMouseEnter={e => e.target.style.opacity = "0.85"}
                onMouseLeave={e => e.target.style.opacity = "1"}>
                Apply Now
              </button>
            )
          )}
        </div>
      </main>

      <Footer />

      {/* Apply Modal */}
      {showApplyModal && (
        <div onClick={() => setShowApplyModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "2rem",
            width: "100%", maxWidth: "480px", animation: "fadeIn 0.3s ease",
          }}>
            <h2 style={{ marginBottom: "0.5rem", fontFamily: "var(--font-head)" }}>Apply for {job.title}</h2>

            {/* ✅ CHANGE 2: Updated subtitle to make resume mandatory clear */}
            <p style={{ color: "var(--text2)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Resume is <strong style={{ color: "#ff6584" }}>required</strong> to apply for this position.
            </p>

            {/* Resume Upload */}
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${resume ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius)", padding: "2rem", textAlign: "center",
                cursor: "pointer", marginBottom: "1.5rem", transition: "var(--transition)",
                background: resume ? "rgba(108,99,255,0.05)" : "var(--surface2)",
              }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
              {resume ? (
                <div>
                  <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>{resume.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Click to change</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Upload Resume (PDF) *</div>
                  <div style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Click to browse or drag & drop</div>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }}
                onChange={e => setResume(e.target.files[0])} />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowApplyModal(false)} style={{
                flex: 1, padding: "0.75rem", background: "var(--surface2)",
                color: "var(--text2)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", cursor: "pointer", fontWeight: 600,
              }}>Cancel</button>

              {/* ✅ CHANGE 3: Button disabled and greyed out until resume uploaded */}
              <button onClick={handleApply} disabled={applying || !resume} style={{
                flex: 2, padding: "0.75rem",
                background: resume
                  ? "linear-gradient(135deg, var(--accent), #8b85ff)"
                  : "var(--surface2)",
                color: resume ? "#fff" : "var(--text2)",
                border: "none", borderRadius: "var(--radius)",
                fontWeight: 700, fontFamily: "var(--font-head)",
                cursor: resume ? "pointer" : "not-allowed",
                transition: "var(--transition)",
              }}>
                {applying ? "Submitting..." : resume ? "Submit Application" : "Upload Resume First"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "1rem", left: "1rem",
          maxWidth: "400px", margin: "0 auto",
          background: "var(--surface2)", border: "1px solid var(--border)",
          padding: "1rem 1.5rem", borderRadius: "var(--radius)",
          fontSize: "0.9rem", boxShadow: "var(--shadow)", animation: "fadeIn 0.3s ease", zIndex: 1000,
        }}>{toast}</div>
      )}
    </div>
  );
}