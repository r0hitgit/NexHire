import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  getMyJobs, createJob, deleteJob, updateJob,
  getApplicationsForJob, updateApplicationStatus,
  scheduleInterview, contactCandidate
} from "../api/axios";

const STATUS_COLORS = {
  APPLIED:              "#6c63ff",
  SHORTLISTED:          "#f59e0b",
  INTERVIEW_SCHEDULED:  "#43e97b",
  REJECTED:             "#ff6584",
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
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", location: "", salary: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [interviewModal, setInterviewModal] = useState(null);
  const [interviewAt, setInterviewAt] = useState("");
  const [interviewDetails, setInterviewDetails] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [contactModal, setContactModal] = useState(null);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    const res = await getMyJobs();
    setJobs(Array.isArray(res.data) ? res.data : []);
  };

  const fetchApplications = async (jobId) => {
    try { const res = await getApplicationsForJob(jobId); setApplications(res.data); }
    catch { setApplications([]); }
  };

  const handleSelectJob = (job) => { setSelectedJob(job); fetchApplications(job.id); setShowApplicants(true); };

  const handleCreateJob = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await createJob({ ...form, salary: parseFloat(form.salary) || 0 });
      setShowModal(false); setForm({ title: "", description: "", location: "", salary: "" });
      fetchJobs(); showToast("✅ Job posted successfully!");
    } catch { showToast("❌ Failed to create job"); } finally { setLoading(false); }
  };

  const handleOpenEdit = (e, job) => {
    e.stopPropagation(); setEditModal(job);
    setEditForm({ title: job.title||"", description: job.description||"", location: job.location||"", salary: job.salary||"" });
  };

  const handleEditJob = async (e) => {
    e.preventDefault(); setEditLoading(true);
    try {
      await updateJob(editModal.id, { ...editForm, salary: parseFloat(editForm.salary)||0 });
      setEditModal(null); fetchJobs(); showToast("✅ Job updated successfully!");
    } catch { showToast("❌ Failed to update job"); } finally { setEditLoading(false); }
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this job posting?")) return;
    await deleteJob(jobId);
    if (selectedJob?.id === jobId) { setSelectedJob(null); setApplications([]); }
    fetchJobs(); showToast("🗑️ Job deleted");
  };

  const handleStatus = async (appId, status) => {
    try { await updateApplicationStatus(appId, status); fetchApplications(selectedJob.id); showToast("✅ Status updated"); }
    catch { showToast("❌ Failed to update status"); }
  };

  const handleScheduleInterview = async () => {
    if (!interviewAt) return showToast("❌ Please select a date and time");
    setInterviewLoading(true);
    try {
      await scheduleInterview(interviewModal, interviewAt.slice(0,19), interviewDetails);
      fetchApplications(selectedJob.id); setInterviewModal(null); setInterviewAt(""); setInterviewDetails("");
      showToast("✅ Interview scheduled & email sent!");
    } catch { showToast("❌ Failed to schedule interview"); } finally { setInterviewLoading(false); }
  };

  const handleContact = async () => {
    if (!contactSubject || !contactMessage) return showToast("❌ Please fill subject and message");
    setContactLoading(true);
    try {
      await contactCandidate(contactModal, contactSubject, contactMessage);
      setContactModal(null); setContactSubject(""); setContactMessage(""); showToast("✅ Message sent!");
    } catch { showToast("❌ Failed to send message"); } finally { setContactLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const inputStyle = {
    width: "100%", padding: "0.65rem 0.9rem", marginBottom: "0.85rem",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        .btn-post-job {
          padding: 0.6rem 1.4rem;
          border: 1px solid rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.18);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          color: #c4c0ff; border-radius: var(--radius);
          font-weight: 600; font-family: var(--font-head);
          cursor: pointer; white-space: nowrap;
          transition: all 0.25s ease;
          box-shadow: 0 2px 10px rgba(108,99,255,0.12);
        }
        .btn-post-job:hover {
          background: rgba(108,99,255,0.28); border-color: rgba(108,99,255,0.65);
          color: #fff; transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(108,99,255,0.25);
        }
        .stat-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-lg); padding: clamp(0.75rem,3vw,1.5rem);
          transition: all 0.25s ease;
        }
        .stat-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(108,99,255,0.2); transform: translateY(-2px); }
        .glass-panel {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-lg); overflow: hidden;
        }
        .job-item {
          padding: 1rem; border-radius: var(--radius); margin-bottom: 0.75rem;
          cursor: pointer; transition: all 0.25s ease;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
        }
        .job-item:hover { background: rgba(108,99,255,0.06); border-color: rgba(108,99,255,0.25); }
        .job-item.selected { background: rgba(108,99,255,0.1); border-color: rgba(108,99,255,0.45); box-shadow: 0 0 0 1px rgba(108,99,255,0.15); }
        .app-card {
          padding: 1.25rem; border-radius: var(--radius); margin-bottom: 0.75rem;
          border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03);
          backdrop-filter: blur(8px); animation: fadeIn 0.3s ease;
        }
        .glass-modal {
          background: rgba(12,12,20,0.9); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1);
        }
        .btn-modal-primary {
          flex: 2; padding: 0.75rem;
          border: 1px solid rgba(108,99,255,0.4); background: rgba(108,99,255,0.2);
          backdrop-filter: blur(12px); color: #d0cdff;
          border-radius: var(--radius); font-weight: 600; font-family: var(--font-head);
          cursor: pointer; transition: all 0.25s ease;
        }
        .btn-modal-primary:hover:not(:disabled) {
          background: rgba(108,99,255,0.32); border-color: rgba(108,99,255,0.7);
          color: #fff; box-shadow: 0 4px 18px rgba(108,99,255,0.25);
        }
        .btn-modal-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-modal-cancel {
          flex: 1; padding: 0.75rem;
          background: rgba(255,255,255,0.05); color: var(--text2);
          border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius);
          cursor: pointer; transition: all 0.25s ease; backdrop-filter: blur(8px);
        }
        .btn-modal-cancel:hover { background: rgba(255,255,255,0.09); color: var(--text); }
        .btn-interview-primary {
          flex: 2; padding: 0.75rem;
          border: 1px solid rgba(67,233,123,0.35); background: rgba(67,233,123,0.12);
          backdrop-filter: blur(12px); color: #43e97b;
          border-radius: var(--radius); font-weight: 700; cursor: pointer; transition: all 0.25s ease;
        }
        .btn-interview-primary:hover:not(:disabled) {
          background: rgba(67,233,123,0.22); border-color: rgba(67,233,123,0.6);
          color: #fff; box-shadow: 0 4px 18px rgba(67,233,123,0.2);
        }
        .btn-interview-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-contact-primary {
          flex: 2; padding: 0.75rem;
          border: 1px solid rgba(245,158,11,0.35); background: rgba(245,158,11,0.12);
          backdrop-filter: blur(12px); color: #f59e0b;
          border-radius: var(--radius); font-weight: 700; cursor: pointer; transition: all 0.25s ease;
        }
        .btn-contact-primary:hover:not(:disabled) {
          background: rgba(245,158,11,0.22); border-color: rgba(245,158,11,0.6);
          color: #fff; box-shadow: 0 4px 18px rgba(245,158,11,0.2);
        }
        .btn-contact-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .dash-input:focus {
          border-color: rgba(108,99,255,0.6) !important;
          box-shadow: 0 0 0 3px rgba(108,99,255,0.1) !important; outline: none;
        }
        .toast-glass {
          position: fixed; bottom: 2rem; right: 1rem; left: 1rem;
          max-width: 400px; margin: 0 auto;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          padding: 1rem 1.5rem; border-radius: var(--radius); font-size: 0.9rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease; z-index: 1000;
        }
      `}</style>

      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(1rem,4vw,2.5rem) clamp(1rem,3vw,2rem)" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
          <h1 style={{ fontSize:"clamp(1.4rem,5vw,2rem)" }}>Recruiter Dashboard</h1>
          <button onClick={() => setShowModal(true)} className="btn-post-job">+ Post a Job</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.75rem", marginBottom:"1.5rem" }}>
          {[
            { val: jobs.length, label: "Jobs Posted", color: "#6c63ff" },
            { val: applications.length, label: "Applications", color: "#43e97b" },
            { val: applications.filter(a => a.status==="SHORTLISTED").length, label: "Shortlisted", color: "#f59e0b" },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:"clamp(1.5rem,5vw,2.5rem)", fontWeight:800, fontFamily:"var(--font-head)", color:s.color }}>{s.val}</div>
              <div style={{ color:"var(--text2)", fontSize:"clamp(0.7rem,2vw,0.875rem)", marginTop:"0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mobile-tabs" style={{ display:"none", marginBottom:"1rem", borderRadius:"var(--radius)", overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setShowApplicants(false)} style={{ flex:1, padding:"0.75rem", border:"none", cursor:"pointer", background:!showApplicants?"rgba(108,99,255,0.2)":"rgba(255,255,255,0.03)", color:!showApplicants?"#c4c0ff":"var(--text2)", fontWeight:600, fontSize:"0.875rem" }}>My Jobs</button>
          <button onClick={() => setShowApplicants(true)} style={{ flex:1, padding:"0.75rem", border:"none", cursor:"pointer", background:showApplicants?"rgba(108,99,255,0.2)":"rgba(255,255,255,0.03)", color:showApplicants?"#c4c0ff":"var(--text2)", fontWeight:600, fontSize:"0.875rem" }}>Applicants</button>
        </div>

        <div className="dashboard-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"1.5rem", alignItems:"start" }}>

          <div className={`panel-jobs glass-panel ${showApplicants?"hide-mobile":""}`}>
            <div style={{ padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"var(--font-head)", fontWeight:700 }}>My Jobs</span>
              <span style={{ fontSize:"0.8rem", color:"var(--text2)" }}>{jobs.length} total</span>
            </div>
            <div style={{ padding:"1rem" }}>
              {jobs.length === 0 ? (
                <div style={{ padding:"2rem", textAlign:"center", color:"var(--text2)", fontSize:"0.875rem" }}>No jobs posted yet.<br/>Click "Post a Job" to start.</div>
              ) : jobs.map(job => (
                <div key={job.id} onClick={() => handleSelectJob(job)} className={`job-item ${selectedJob?.id===job.id?"selected":""}`}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem" }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:"0.95rem", marginBottom:"0.2rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{job.title}</div>
                      <div style={{ color:"var(--text2)", fontSize:"0.8rem", display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
                        <span>📍 {job.location||"Remote"}</span>
                        {job.salary && <span>₹{(job.salary/100000).toFixed(1)}L</span>}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:"0.4rem", flexShrink:0 }}>
                      <button onClick={(e) => handleOpenEdit(e,job)} style={{ padding:"0.3rem 0.65rem", background:"rgba(108,99,255,0.1)", color:"#a09aff", border:"1px solid rgba(108,99,255,0.25)", borderRadius:"6px", fontSize:"0.75rem", cursor:"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(108,99,255,0.22)"; e.currentTarget.style.color="#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="rgba(108,99,255,0.1)"; e.currentTarget.style.color="#a09aff"; }}>Edit</button>
                      <button onClick={(e) => handleDelete(e,job.id)} style={{ padding:"0.3rem 0.65rem", background:"rgba(255,101,132,0.08)", color:"#ff6584", border:"1px solid rgba(255,101,132,0.22)", borderRadius:"6px", fontSize:"0.75rem", cursor:"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(255,101,132,0.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="rgba(255,101,132,0.08)"; }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`panel-applicants glass-panel ${!showApplicants?"hide-mobile":""}`}>
            <div style={{ padding:"1.25rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:"clamp(0.85rem,2.5vw,1rem)" }}>
                {selectedJob ? `Applicants — ${selectedJob.title}` : "Select a job to view applicants"}
              </span>
              {selectedJob && <span style={{ fontSize:"0.8rem", color:"var(--text2)", flexShrink:0 }}>{applications.length} total</span>}
            </div>
            <div style={{ padding:"1rem" }}>
              {!selectedJob ? (
                <div style={{ padding:"3rem", textAlign:"center", color:"var(--text2)", fontSize:"0.875rem" }}>👈 Click a job to see its applicants</div>
              ) : applications.length === 0 ? (
                <div style={{ padding:"3rem", textAlign:"center", color:"var(--text2)", fontSize:"0.875rem" }}>No applications yet for this job</div>
              ) : applications.map(app => (
                <div key={app.id} className="app-card">
                  <div style={{ fontWeight:700, marginBottom:"0.15rem" }}>{app.candidate?.name||"Candidate"}</div>
                  <div style={{ color:"var(--text2)", fontSize:"0.8rem", marginBottom:"0.75rem" }}>{app.candidate?.email}</div>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", padding:"0.3rem 0.85rem", marginBottom:"0.75rem", background:"rgba(108,99,255,0.1)", color:"#a09aff", border:"1px solid rgba(108,99,255,0.25)", borderRadius:"20px", fontSize:"0.78rem", fontWeight:600, textDecoration:"none", backdropFilter:"blur(8px)" }}>📄 View Resume</a>
                  )}
                  <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>
                    {["APPLIED","SHORTLISTED","REJECTED"].map(st => (
                      <button key={st} onClick={() => handleStatus(app.id,st)} style={{ padding:"0.3rem 0.75rem", borderRadius:"20px", cursor:"pointer", border:`1px solid ${STATUS_COLORS[st]}35`, background:app.status===st?`${STATUS_COLORS[st]}18`:"rgba(255,255,255,0.03)", color:app.status===st?STATUS_COLORS[st]:"var(--text2)", fontSize:"0.72rem", fontWeight:600, transition:"all 0.2s ease", backdropFilter:"blur(6px)" }}>{st}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                    <button onClick={() => setInterviewModal(app.id)} style={{ padding:"0.35rem 0.85rem", borderRadius:"var(--radius)", background:"rgba(67,233,123,0.08)", color:"#43e97b", border:"1px solid rgba(67,233,123,0.25)", fontSize:"0.78rem", fontWeight:600, cursor:"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(67,233,123,0.18)"; e.currentTarget.style.borderColor="rgba(67,233,123,0.5)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(67,233,123,0.08)"; e.currentTarget.style.borderColor="rgba(67,233,123,0.25)"; }}>📅 Schedule Interview</button>
                    <button onClick={() => setContactModal(app.id)} style={{ padding:"0.35rem 0.85rem", borderRadius:"var(--radius)", background:"rgba(245,158,11,0.08)", color:"#f59e0b", border:"1px solid rgba(245,158,11,0.25)", fontSize:"0.78rem", fontWeight:600, cursor:"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(245,158,11,0.18)"; e.currentTarget.style.borderColor="rgba(245,158,11,0.5)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(245,158,11,0.08)"; e.currentTarget.style.borderColor="rgba(245,158,11,0.25)"; }}>✉️ Contact</button>
                  </div>
                  {app.status==="INTERVIEW_SCHEDULED" && app.interviewScheduledAt && (
                    <div style={{ marginTop:"0.75rem", padding:"0.6rem 0.85rem", background:"rgba(67,233,123,0.06)", border:"1px solid rgba(67,233,123,0.18)", borderRadius:"var(--radius)", fontSize:"0.8rem", color:"#43e97b", backdropFilter:"blur(6px)" }}>
                      📅 {app.interviewScheduledAt.replace('T',' ').slice(0,16)}
                      {app.interviewDetails && <div style={{ color:"var(--text2)", marginTop:"0.2rem" }}>{app.interviewDetails}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Post Job Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} className="glass-modal" style={{ padding:"clamp(1.25rem,4vw,2rem)", width:"100%", maxWidth:"480px", animation:"fadeIn 0.3s ease", maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ marginBottom:"1.5rem", fontSize:"clamp(1.2rem,4vw,1.5rem)" }}>Post a New Job</h2>
            <form onSubmit={handleCreateJob}>
              {[{label:"Job Title",key:"title",type:"text",placeholder:"e.g. Senior React Developer"},{label:"Location",key:"location",type:"text",placeholder:"e.g. Bangalore / Remote"},{label:"Salary (₹/year)",key:"salary",type:"number",placeholder:"e.g. 1200000"}].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>{f.label}</label>
                  <input className="dash-input" style={inputStyle} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} required={f.key==="title"} />
                </div>
              ))}
              <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>Description</label>
              <textarea className="dash-input" style={{ ...inputStyle, minHeight:"80px", resize:"vertical" }} placeholder="Describe the role..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
              <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-modal-cancel">Cancel</button>
                <button type="submit" disabled={loading} className="btn-modal-primary">{loading?"Posting...":"Post Job"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editModal && (
        <div onClick={() => setEditModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} className="glass-modal" style={{ padding:"clamp(1.25rem,4vw,2rem)", width:"100%", maxWidth:"480px", animation:"fadeIn 0.3s ease", maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ marginBottom:"1.5rem", fontSize:"clamp(1.2rem,4vw,1.5rem)" }}>✏️ Edit Job</h2>
            <form onSubmit={handleEditJob}>
              {[{label:"Job Title",key:"title",type:"text",placeholder:"e.g. Senior React Developer"},{label:"Location",key:"location",type:"text",placeholder:"e.g. Bangalore / Remote"},{label:"Salary (₹/year)",key:"salary",type:"number",placeholder:"e.g. 1200000"}].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>{f.label}</label>
                  <input className="dash-input" style={inputStyle} type={f.type} placeholder={f.placeholder} value={editForm[f.key]} onChange={e => setEditForm({...editForm,[f.key]:e.target.value})} required={f.key==="title"} />
                </div>
              ))}
              <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>Description</label>
              <textarea className="dash-input" style={{ ...inputStyle, minHeight:"80px", resize:"vertical" }} placeholder="Describe the role..." value={editForm.description} onChange={e => setEditForm({...editForm,description:e.target.value})} />
              <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
                <button type="button" onClick={() => setEditModal(null)} className="btn-modal-cancel">Cancel</button>
                <button type="submit" disabled={editLoading} className="btn-modal-primary">{editLoading?"Saving...":"Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {interviewModal && (
        <div onClick={() => setInterviewModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} className="glass-modal" style={{ padding:"2rem", width:"100%", maxWidth:"440px", animation:"fadeIn 0.3s ease" }}>
            <h2 style={{ marginBottom:"1.5rem", fontFamily:"var(--font-head)" }}>📅 Schedule Interview</h2>
            <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>Date & Time</label>
            <input type="datetime-local" value={interviewAt} onChange={e => setInterviewAt(e.target.value)} className="dash-input" style={inputStyle} />
            <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>Details</label>
            <textarea value={interviewDetails} onChange={e => setInterviewDetails(e.target.value)} placeholder="e.g. Google Meet link, office address..." className="dash-input" style={{ ...inputStyle, minHeight:"80px", resize:"vertical" }} />
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button onClick={() => setInterviewModal(null)} className="btn-modal-cancel">Cancel</button>
              <button onClick={handleScheduleInterview} disabled={interviewLoading} className="btn-interview-primary">{interviewLoading?"Scheduling...":"Schedule & Notify"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModal && (
        <div onClick={() => setContactModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} className="glass-modal" style={{ padding:"2rem", width:"100%", maxWidth:"440px", animation:"fadeIn 0.3s ease" }}>
            <h2 style={{ marginBottom:"1.5rem", fontFamily:"var(--font-head)" }}>✉️ Contact Candidate</h2>
            <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>Subject</label>
            <input value={contactSubject} onChange={e => setContactSubject(e.target.value)} placeholder="e.g. Next Steps..." className="dash-input" style={inputStyle} />
            <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"var(--text2)", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.5px" }}>Message</label>
            <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)} placeholder="Write your message..." className="dash-input" style={{ ...inputStyle, minHeight:"100px", resize:"vertical" }} />
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button onClick={() => setContactModal(null)} className="btn-modal-cancel">Cancel</button>
              <button onClick={handleContact} disabled={contactLoading} className="btn-contact-primary">{contactLoading?"Sending...":"Send Message"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-glass">{toast}</div>}
    </div>
  );
}