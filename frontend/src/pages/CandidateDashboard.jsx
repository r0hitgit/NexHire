import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getMyApplications, withdrawApplication } from "../api/axios";

const STATUS_CONFIG = {
  APPLIED:              { color: "#6c63ff", bg: "rgba(108,99,255,0.12)",  icon: "📋", label: "Applied" },
  SHORTLISTED:          { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  icon: "⭐", label: "Shortlisted" },
  INTERVIEW_SCHEDULED:  { color: "#43e97b", bg: "rgba(67,233,123,0.12)",  icon: "📅", label: "Scheduled" },
  REJECTED:             { color: "#ff6584", bg: "rgba(255,101,132,0.12)", icon: "✕",  label: "Rejected" },
};

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = () => {
    getMyApplications()
      .then(res => { setApplications(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw?")) return;
    try { await withdrawApplication(appId); fetchApplications(); showToast("✅ Withdrawn"); }
    catch { showToast("❌ Failed"); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const counts = {
    APPLIED:             applications.filter(a => a.status === "APPLIED").length,
    SHORTLISTED:         applications.filter(a => a.status === "SHORTLISTED").length,
    INTERVIEW_SCHEDULED: applications.filter(a => a.status === "INTERVIEW_SCHEDULED").length,
    REJECTED:            applications.filter(a => a.status === "REJECTED").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }

        * { box-sizing: border-box; }

        .c-stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: var(--radius-lg);
          padding: clamp(0.75rem,3vw,1.5rem);
          transition: all 0.25s ease;
          animation: fadeIn 0.4s ease;
        }
        .c-stat-card:hover {
          border-color: rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.06);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(108,99,255,0.1);
        }

        .c-history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .c-app-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: var(--radius-lg);
          padding: clamp(0.9rem, 3vw, 1.25rem);
          transition: all 0.25s ease;
          animation: fadeIn 0.4s ease;
          margin-bottom: 0.75rem;
          overflow: hidden;
          width: 100%;
        }
        .c-app-card:hover {
          border-color: rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.06);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(108,99,255,0.1);
        }

        /* Top row: title left, badge right — badge NEVER overflows */
        .c-card-top {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          width: 100%;
          min-width: 0;
        }

        .c-card-left {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .c-card-title {
          font-weight: 700;
          font-size: clamp(0.88rem, 2.5vw, 1rem);
          font-family: var(--font-head);
          margin-bottom: 0.3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .c-card-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .c-card-meta span {
          color: var(--text2);
          font-size: clamp(0.72rem, 2vw, 0.8rem);
          white-space: nowrap;
        }

        /* Status badge — fixed max width, never overflows */
        .c-badge {
          flex-shrink: 0;
          padding: 0.35rem 0.7rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: clamp(0.6rem, 1.8vw, 0.72rem);
          letter-spacing: 0.3px;
          text-transform: uppercase;
          white-space: nowrap;
          backdrop-filter: blur(6px);
          max-width: min(140px, 38vw);
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        /* Interview box — always full width inside card */
        .c-interview-box {
          margin-top: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(67,233,123,0.08);
          border: 1px solid rgba(67,233,123,0.2);
          border-radius: var(--radius);
          width: 100%;
          overflow: hidden;
        }

        .c-interview-date {
          color: #43e97b;
          font-weight: 700;
          font-size: clamp(0.78rem, 2.2vw, 0.85rem);
          margin-bottom: 0.25rem;
          word-break: break-word;
        }

        .c-interview-loc {
          color: var(--text2);
          font-size: clamp(0.72rem, 2vw, 0.8rem);
          word-break: break-word;
        }

        .btn-withdraw {
          margin-top: 0.75rem;
          padding: 0.3rem 0.85rem;
          background: rgba(255,101,132,0.08);
          color: #ff6584;
          border: 1px solid rgba(255,101,132,0.22);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-withdraw:hover {
          background: rgba(255,101,132,0.18);
          border-color: rgba(255,101,132,0.45);
          color: #fff;
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
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "clamp(1rem,4vw,2.5rem) clamp(1rem,3vw,2rem)" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "clamp(1.4rem,5vw,2rem)", marginBottom: "0.4rem" }}>My Applications</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Track your job application status</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { label:"Applied",     val:counts.APPLIED,             color:"#6c63ff" },
            { label:"Shortlisted", val:counts.SHORTLISTED,         color:"#f59e0b" },
            { label:"Interview",   val:counts.INTERVIEW_SCHEDULED, color:"#43e97b" },
            { label:"Rejected",    val:counts.REJECTED,            color:"#ff6584" },
          ].map((s,i) => (
            <div key={i} className="c-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize:"clamp(1.5rem,5vw,2.5rem)", fontWeight:800, fontFamily:"var(--font-head)", color:s.color }}>{s.val}</div>
              <div style={{ color:"var(--text2)", fontSize:"clamp(0.6rem,1.8vw,0.875rem)", marginTop:"0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Application History */}
        <div className="c-history-header">
          <span style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:"1.1rem" }}>Application History</span>
          <span style={{ fontSize:"0.8rem", color:"var(--text2)" }}>{applications.length} total</span>
        </div>

        {loading ? (
          [...Array(4)].map((_,i) => (
            <div key={i} className="skeleton" style={{ height:"80px", marginBottom:"0.75rem", borderRadius:"var(--radius-lg)" }}/>
          ))
        ) : applications.length === 0 ? (
          <div style={{ padding:"4rem 1rem", textAlign:"center", color:"var(--text2)" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📭</div>
            <p>No applications yet.</p>
            <p style={{ marginTop:"0.5rem", fontSize:"0.875rem" }}>Browse jobs and start applying!</p>
          </div>
        ) : applications.map(app => {
          const cfg = STATUS_CONFIG[app.status];
          return (
            <div key={app.id} className="c-app-card">

              {/* Top row */}
              <div className="c-card-top">
                <div className="c-card-left">
                  <div className="c-card-title">{app.job?.title || "Job"}</div>
                  <div className="c-card-meta">
                    {app.job?.recruiter?.name && <span>🏢 {app.job.recruiter.name}</span>}
                    {app.job?.location && <span>📍 {app.job.location}</span>}
                    {app.job?.salary && <span>💰 ₹{(app.job.salary/100000).toFixed(1)}L</span>}
                  </div>
                </div>

                <div className="c-badge" style={{
                  background: cfg?.bg || "rgba(255,255,255,0.05)",
                  color: cfg?.color || "var(--text2)",
                  border: `1px solid ${cfg?.color || "#fff"}35`,
                }}>
                  {cfg?.icon} {cfg?.label || app.status}
                </div>
              </div>

              {/* Interview box */}
              {app.status === "INTERVIEW_SCHEDULED" && app.interviewScheduledAt && (
                <div className="c-interview-box">
                  <div className="c-interview-date">
                    📅 {app.interviewScheduledAt.replace('T',' ').slice(0,16)}
                  </div>
                  {app.interviewDetails && (
                    <div className="c-interview-loc">{app.interviewDetails}</div>
                  )}
                </div>
              )}

              {app.status === "APPLIED" && (
                <button onClick={() => handleWithdraw(app.id)} className="btn-withdraw">✕ Withdraw</button>
              )}

            </div>
          );
        })}

      </main>

      {toast && <div className="toast-glass">{toast}</div>}
    </div>
  );
}