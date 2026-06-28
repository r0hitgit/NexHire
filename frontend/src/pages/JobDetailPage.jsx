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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-back {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }
        .btn-back:hover {
          opacity: 0.75;
          transform: translateX(-2px);
        }

        .job-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-lg);
          padding: clamp(1.5rem, 4vw, 2.5rem);
          margin-bottom: 1.5rem;
        }

        .meta-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text2);
        }

        .btn-apply-now {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #d0cdff;
          border-radius: var(--radius);
          font-weight: 700;
          font-size: 1rem;
          font-family: var(--font-head);
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(108,99,255,0.15);
        }
        .btn-apply-now:hover {
          background: rgba(108,99,255,0.28);
          border-color: rgba(108,99,255,0.65);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(108,99,255,0.25);
        }

        /* Modal */
        .apply-modal {
          background: rgba(18,18,28,0.88);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-radius: var(--radius-lg);
          padding: 2rem;
          width: 100%;
          max-width: 480px;
          animation: fadeIn 0.3s ease;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1);
        }

        /* Resume upload zone — keep the dashed colored border */
        .upload-zone {
          border-radius: var(--radius);
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          margin-bottom: 1.5rem;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }
        .upload-zone:hover {
          background: rgba(108,99,255,0.08) !important;
        }

        .btn-modal-cancel {
          flex: 1; padding: 0.75rem;
          background: rgba(255,255,255,0.05);
          color: var(--text2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius);
          cursor: pointer;
          font-weight: 600;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }
        .btn-modal-cancel:hover {
          background: rgba(255,255,255,0.09);
          color: var(--text);
        }

        .btn-modal-submit-active {
          flex: 2; padding: 0.75rem;
          border: 1px solid rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.2);
          backdrop-filter: blur(12px);
          color: #d0cdff;
          border-radius: var(--radius);
          font-weight: 700;
          font-family: var(--font-head);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-modal-submit-active:hover:not(:disabled) {
          background: rgba(108,99,255,0.32);
          border-color: rgba(108,99,255,0.7);
          color: #fff;
          box-shadow: 0 4px 18px rgba(108,99,255,0.25);
        }
        .btn-modal-submit-active:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-modal-submit-inactive {
          flex: 2; padding: 0.75rem;
          background: rgba(255,255,255,0.04);
          color: var(--text2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius);
          font-weight: 700;
          font-family: var(--font-head);
          cursor: not-allowed;
          backdrop-filter: blur(8px);
        }

        .toast-glass {
          position: fixed;
          bottom: 2rem; right: 1rem; left: 1rem;
          max-width: 400px; margin: 0 auto;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 1rem 1.5rem;
          border-radius: var(--radius);
          font-size: 0.9rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          animation: fadeIn 0.3s ease;
          z-index: 1000;
        }
      `}</style>

      <Navbar />
      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)" }}>

        <button onClick={() => navigate("/jobs")} className="btn-back">← Back to Jobs</button>

        {/* Job Card */}
        <div className="job-card">

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", marginBottom: "0.4rem", fontFamily: "var(--font-head)" }}>{job.title}</h1>
              <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "1rem" }}>{job.recruiter?.name || "Company"}</div>
            </div>
            {job.salary && (
              <span style={{
                background: "rgba(67,233,123,0.1)",
                border: "1px solid rgba(67,233,123,0.25)",
                backdropFilter: "blur(8px)",
                color: "#43e97b",
                padding: "0.5rem 1.2rem", borderRadius: "20px",
                fontSize: "1rem", fontWeight: 700, whiteSpace: "nowrap",
              }}>
                ₹{(job.salary / 100000).toFixed(1)}L / year
              </span>
            )}
          </div>

          {/* Meta Pills */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {job.location && <span className="meta-pill">📍 {job.location}</span>}
            {job.jobType && <span className="meta-pill">💼 {job.jobType}</span>}
            {job.postedDate && <span className="meta-pill">📅 Posted {new Date(job.postedDate).toLocaleDateString()}</span>}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: "2rem" }} />

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
                background: "rgba(67,233,123,0.08)", color: "#43e97b",
                border: "1px solid rgba(67,233,123,0.25)",
                backdropFilter: "blur(8px)",
                borderRadius: "var(--radius)",
                fontWeight: 600, fontSize: "1rem",
              }}>
                ✓ Application Submitted!
              </div>
            ) : (
              <button onClick={() => setShowApplyModal(true)} className="btn-apply-now">
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
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "1rem",
        }}>
          <div onClick={e => e.stopPropagation()} className="apply-modal">
            <h2 style={{ marginBottom: "0.5rem", fontFamily: "var(--font-head)" }}>Apply for {job.title}</h2>
            <p style={{ color: "var(--text2)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Resume is <strong style={{ color: "#ff6584" }}>required</strong> to apply for this position.
            </p>

            {/* Resume Upload — colored dashed border preserved */}
            <div
              onClick={() => fileRef.current.click()}
              className="upload-zone"
              style={{
                border: `2px dashed ${resume ? "var(--accent)" : "rgba(255,255,255,0.2)"}`,
                background: resume ? "rgba(108,99,255,0.08)" : "rgba(255,255,255,0.03)",
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
              <button onClick={() => setShowApplyModal(false)} className="btn-modal-cancel">Cancel</button>
              {resume ? (
                <button onClick={handleApply} disabled={applying} className="btn-modal-submit-active">
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              ) : (
                <button disabled className="btn-modal-submit-inactive">
                  Upload Resume First
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-glass">{toast}</div>}
    </div>
  );
}