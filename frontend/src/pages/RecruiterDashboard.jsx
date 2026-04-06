import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getMyJobs, createJob, deleteJob, getApplicationsForJob, updateApplicationStatus } from "../api/axios";

const STATUS_COLORS = {
  APPLIED:     "#6c63ff",
  SHORTLISTED: "#f59e0b",
  REJECTED:    "#ff6584",
};

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showApplicants, setShowApplicants] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    const res = await getMyJobs();
    setJobs(Array.isArray(res.data) ? res.data : []);
  };

  const fetchApplications = async (jobId) => {
    try {
      const res = await getApplicationsForJob(jobId);
      setApplications(res.data);
    } catch { setApplications([]); }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    fetchApplications(job.id);
    setShowApplicants(true); // on mobile, switch to applicants view
  };

  const handleCreateJob = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await createJob({ ...form, salary: parseFloat(form.salary) || 0 });
      setShowModal(false);
      setForm({ title: "", description: "", location: "", salary: "" });
      fetchJobs();
      showToast("✅ Job posted successfully!");
    } catch { showToast("❌ Failed to create job"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this job posting?")) return;
    await deleteJob(jobId);
    if (selectedJob?.id === jobId) { setSelectedJob(null); setApplications([]); }
    fetchJobs();
    showToast("🗑️ Job deleted");
  };

  const handleStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      fetchApplications(selectedJob.id);
      showToast("✅ Status updated");
    } catch { showToast("❌ Failed to update status"); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const inputStyle = {
    width: "100%", padding: "0.65rem 0.9rem", marginBottom: "0.85rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.9rem", outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)" }}>Recruiter Dashboard</h1>
          <button onClick={() => setShowModal(true)} style={{
            padding: "0.6rem 1.4rem", background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: "var(--radius)", fontWeight: 600,
            fontFamily: "var(--font-head)", cursor: "pointer", whiteSpace: "nowrap",
          }}>+ Post a Job</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { val: jobs.length, label: "Jobs Posted", color: "#6c63ff" },
            { val: applications.length, label: "Applications Received", color: "#43e97b" },
            { val: applications.filter(a => a.status === "SHORTLISTED").length, label: "Shortlisted", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "clamp(0.75rem, 3vw, 1.5rem)",
            }}>
              <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", fontWeight: 800, fontFamily: "var(--font-head)", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text2)", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile Tab Switch */}
        <div className="mobile-tabs" style={{ display: "none", marginBottom: "1rem", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowApplicants(false)}
            style={{
              flex: 1, padding: "0.75rem", border: "none", cursor: "pointer",
              background: !showApplicants ? "var(--accent)" : "var(--surface2)",
              color: !showApplicants ? "#fff" : "var(--text2)",
              fontWeight: 600, fontSize: "0.875rem",
            }}>My Jobs</button>
          <button
            onClick={() => setShowApplicants(true)}
            style={{
              flex: 1, padding: "0.75rem", border: "none", cursor: "pointer",
              background: showApplicants ? "var(--accent)" : "var(--surface2)",
              color: showApplicants ? "#fff" : "var(--text2)",
              fontWeight: 600, fontSize: "0.875rem",
            }}>Applicants</button>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Jobs Panel */}
          <div className={`panel-jobs ${showApplicants ? "hide-mobile" : ""}`}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>My Jobs</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text2)" }}>{jobs.length} total</span>
            </div>
            <div style={{ padding: "1rem" }}>
              {jobs.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text2)", fontSize: "0.875rem" }}>
                  No jobs posted yet.<br />Click "Post a Job" to start.
                </div>
              ) : jobs.map(job => (
                <div key={job.id} onClick={() => handleSelectJob(job)}
                  style={{
                    padding: "1rem", borderRadius: "var(--radius)", marginBottom: "0.75rem",
                    border: `1px solid ${selectedJob?.id === job.id ? "var(--accent)" : "var(--border)"}`,
                    background: selectedJob?.id === job.id ? "rgba(108,99,255,0.08)" : "var(--surface2)",
                    cursor: "pointer", transition: "var(--transition)",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
                      <div style={{ color: "var(--text2)", fontSize: "0.8rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        <span>📍 {job.location || "Remote"}</span>
                        {job.salary && <span>₹{(job.salary / 100000).toFixed(1)}L</span>}
                      </div>
                    </div>
                    <button onClick={(e) => handleDelete(e, job.id)} style={{
                      padding: "0.3rem 0.65rem", background: "rgba(255,101,132,0.1)",
                      color: "#ff6584", border: "1px solid rgba(255,101,132,0.3)",
                      borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", flexShrink: 0,
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicants Panel */}
          <div className={`panel-applicants ${!showApplicants ? "hide-mobile" : ""}`}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "clamp(0.85rem, 2.5vw, 1rem)" }}>
                {selectedJob ? `Applicants — ${selectedJob.title}` : "Select a job to view applicants"}
              </span>
              {selectedJob && <span style={{ fontSize: "0.8rem", color: "var(--text2)", flexShrink: 0 }}>{applications.length} total</span>}
            </div>
            <div style={{ padding: "1rem" }}>
              {!selectedJob ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--text2)", fontSize: "0.875rem" }}>
                  👈 Click a job to see its applicants
                </div>
              ) : applications.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--text2)", fontSize: "0.875rem" }}>
                  No applications yet for this job
                </div>
              ) : applications.map(app => (
                <div key={app.id} style={{
                  padding: "1.25rem", borderRadius: "var(--radius)", marginBottom: "0.75rem",
                  border: "1px solid var(--border)", background: "var(--surface2)", animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.15rem" }}>{app.candidate?.name || "Candidate"}</div>
                  <div style={{ color: "var(--text2)", fontSize: "0.8rem", marginBottom: "0.85rem", wordBreak: "break-all" }}>{app.candidate?.email}</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {["APPLIED", "SHORTLISTED", "REJECTED"].map(st => (
                      <button key={st} onClick={() => handleStatus(app.id, st)} style={{
                        padding: "0.3rem 0.85rem", borderRadius: "20px", cursor: "pointer",
                        border: `1px solid ${STATUS_COLORS[st]}40`,
                        background: app.status === st ? `${STATUS_COLORS[st]}20` : "transparent",
                        color: app.status === st ? STATUS_COLORS[st] : "var(--text2)",
                        fontSize: "0.75rem", fontWeight: 600, transition: "var(--transition)",
                      }}>{st}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Post Job Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "clamp(1.25rem, 4vw, 2rem)",
            width: "100%", maxWidth: "480px", animation: "fadeIn 0.3s ease",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "clamp(1.2rem, 4vw, 1.5rem)" }}>Post a New Job</h2>
            <form onSubmit={handleCreateJob}>
              {[
                { label: "Job Title", key: "title", type: "text", placeholder: "e.g. Senior React Developer" },
                { label: "Location", key: "location", type: "text", placeholder: "e.g. Bangalore / Remote" },
                { label: "Salary (₹/year)", key: "salary", type: "number", placeholder: "e.g. 1200000" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</label>
                  <input style={inputStyle} type={f.type} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.key === "title"}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
              ))}
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                placeholder="Describe the role and requirements..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"} />
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "0.75rem", background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: "0.75rem", background: "linear-gradient(135deg, var(--accent), #8b85ff)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 600, fontFamily: "var(--font-head)", cursor: "pointer" }}>
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: "2rem", right: "1rem", left: "1rem", maxWidth: "400px", margin: "0 auto", background: "var(--surface2)", border: "1px solid var(--border)", padding: "1rem 1.5rem", borderRadius: "var(--radius)", fontSize: "0.9rem", boxShadow: "var(--shadow)", animation: "fadeIn 0.3s ease", zIndex: 1000 }}>
          {toast}
        </div>
      )}
    </div>
  );
}