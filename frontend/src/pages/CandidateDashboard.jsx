import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyApplications, withdrawApplication, getJobs } from "../api/axios";

import {
  ClipboardList,
  Star,
  CalendarDays,
  X,
  Building2,
  MapPin,
  IndianRupee,
  Inbox,
  Undo2,
  XCircle,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  User,
  Clock,
  Briefcase
} from "lucide-react";

const STATUS_CONFIG = {
  APPLIED: {
    color: "#177A59",
    bg: "#E8F5F0",
    border: "#BCE0D1",
    icon: ClipboardList,
    label: "Applied",
  },
  SHORTLISTED: {
    color: "#B45309",
    bg: "#FEF3C7",
    border: "#FDE68A",
    icon: Star,
    label: "Shortlisted",
  },
  INTERVIEW_SCHEDULED: {
    color: "#0C4E3A",
    bg: "#DFF264",
    border: "#CBE042",
    icon: CalendarDays,
    label: "Interview Scheduled",
  },
  REJECTED: {
    color: "#B91C1C",
    bg: "#FEE2E2",
    border: "#FECACA",
    icon: X,
    label: "Not Selected",
  },
};

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("applications"); // "applications" | "saved"
  const [savedJobsList, setSavedJobsList] = useState([]);

  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || localStorage.getItem("email") || "Candidate";

  const fetchApplications = () => {
    getMyApplications()
      .then((res) => {
        setApplications(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchSavedJobs = () => {
    try {
      const savedIds = JSON.parse(localStorage.getItem("nexhire_saved_jobs") || "[]");
      if (savedIds.length === 0) return;
      getJobs()
        .then((res) => {
          const allJobs = Array.isArray(res.data) ? res.data : res.data?.content || [];
          const filtered = allJobs.filter((j) => savedIds.includes(j.id) || savedIds.includes(Number(j.id)));
          setSavedJobsList(filtered);
        })
        .catch(() => {});
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchSavedJobs();
  }, []);

  const removeSavedJob = (jobId) => {
    try {
      const savedIds = JSON.parse(localStorage.getItem("nexhire_saved_jobs") || "[]");
      const updated = savedIds.filter((id) => id !== jobId && id !== Number(jobId));
      localStorage.setItem("nexhire_saved_jobs", JSON.stringify(updated));
      setSavedJobsList((prev) => prev.filter((j) => j.id !== jobId));
      showToast("Job removed from saved list", Bookmark);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (message, Icon) => {
    setToast({ message, Icon });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;

    try {
      await withdrawApplication(appId);
      fetchApplications();
      showToast("Application withdrawn", Undo2);
    } catch {
      showToast("Failed to withdraw application", XCircle);
    }
  };

  const counts = {
    APPLIED: applications.filter((a) => a.status === "APPLIED").length,
    SHORTLISTED: applications.filter((a) => a.status === "SHORTLISTED").length,
    INTERVIEW_SCHEDULED: applications.filter((a) => a.status === "INTERVIEW_SCHEDULED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const upcomingInterviews = applications.filter(
    (a) => a.status === "INTERVIEW_SCHEDULED" && a.interviewScheduledAt
  );

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
        .candidate-dashboard-container {
          flex: 1;
          max-width: 1140px;
          width: 100%;
          margin: 0 auto;
          padding: 2.25rem clamp(1rem, 3vw, 2rem) 4rem;
        }

        .stat-card-clean {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          box-shadow: var(--shadow-xs);
          transition: var(--transition);
        }

        .stat-card-clean:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .tab-button {
          padding: 0.65rem 1.25rem;
          font-family: var(--font-head);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: transparent;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition);
        }

        .tab-button.active {
          color: var(--primary-dark);
          border-bottom-color: var(--primary);
        }

        .app-row-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-xs);
          transition: var(--transition);
          margin-bottom: 1rem;
        }

        .app-row-card:hover {
          border-color: #BCE0D1;
          box-shadow: var(--shadow-sm);
        }

        .btn-withdraw-clean {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #DC2626;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-withdraw-clean:hover {
          background: #FEE2E2;
          color: #991B1B;
        }

        .toast-bubble {
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
      `}</style>

      <main className="candidate-dashboard-container">
        {/* Welcome Banner */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
              Candidate Workspace
            </span>
            <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginTop: "0.25rem", marginBottom: "0.3rem" }}>
              Welcome back, {userName}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Track active applications, review interview invites, and discover new openings.
            </p>
          </div>

          <button
            onClick={() => navigate("/jobs")}
            className="btn-primary"
            style={{ gap: "0.5rem" }}
          >
            <Briefcase size={17} />
            <span>Browse More Jobs</span>
          </button>
        </div>

        {/* Profile Completion Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #177A59 0%, #0C4E3A 100%)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem clamp(1.25rem, 3vw, 2rem)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 24px rgba(23, 122, 89, 0.16)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-lime)",
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>Profile 85% Complete</span>
                <span style={{ background: "var(--accent-lime)", color: "var(--primary-dark)", padding: "0.15rem 0.5rem", borderRadius: "10px", fontSize: "0.72rem", fontWeight: 800 }}>
                  Verified
                </span>
              </div>
              <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.88rem", margin: "0.2rem 0 0" }}>
                Your resume is ready for fast recruiter shortlisting. Keep applying to increase visibility!
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => navigate("/jobs")}
              style={{
                background: "var(--accent-lime)",
                color: "var(--primary-dark)",
                fontWeight: 700,
                fontSize: "0.88rem",
                padding: "0.6rem 1.15rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              View Recommended Jobs
            </button>
          </div>
        </div>

        {/* Pipeline Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.25rem",
          }}
        >
          {[
            { label: "Submitted", val: counts.APPLIED, color: "#177A59", icon: ClipboardList },
            { label: "Shortlisted", val: counts.SHORTLISTED, color: "#B45309", icon: Star },
            { label: "Interviews", val: counts.INTERVIEW_SCHEDULED, color: "#0C4E3A", icon: CalendarDays },
            { label: "Archived", val: counts.REJECTED, color: "#68736D", icon: X },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="stat-card-clean" style={{ borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    {item.label}
                  </span>
                  <Icon size={18} color={item.color} />
                </div>
                <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.4rem" }}>
                  {item.val}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Interview Alert Box (if scheduled) */}
        {upcomingInterviews.length > 0 && (
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #CBE042",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 4px 16px rgba(223, 242, 100, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-lime)", color: "var(--primary-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarDays size={18} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-dark)", margin: 0 }}>
                Upcoming Interview Scheduled!
              </h3>
            </div>

            {upcomingInterviews.map((app) => (
              <div key={app.id} style={{ background: "var(--bg-soft)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "0.75rem" }}>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                  {app.job?.title} at {app.job?.recruiter?.name || "Company"}
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.35rem", fontSize: "0.88rem", color: "var(--primary-dark)", fontWeight: 600 }}>
                  <span>Time: {app.interviewScheduledAt?.replace("T", " ").slice(0, 16)}</span>
                  {app.interviewDetails && <span>Details: {app.interviewDetails}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs Bar: Applications vs Saved Jobs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
          <button
            className={`tab-button ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            Applications ({applications.length})
          </button>
          <button
            className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Jobs ({savedJobsList.length})
          </button>
        </div>

        {/* Tab 1: Applications */}
        {activeTab === "applications" && (
          <div>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "110px", marginBottom: "1rem", borderRadius: "var(--radius-lg)" }} />
              ))
            ) : applications.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <Inbox size={26} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  No active applications yet
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
                  Explore hundreds of open jobs and start applying today!
                </p>
                <button onClick={() => navigate("/jobs")} className="btn-primary">
                  Browse Jobs →
                </button>
              </div>
            ) : (
              applications.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
                const StatusIcon = cfg.icon;

                return (
                  <div key={app.id} className="app-row-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                          <h3
                            style={{
                              fontSize: "1.15rem",
                              fontWeight: 700,
                              color: "var(--text-main)",
                              margin: 0,
                              cursor: "pointer",
                            }}
                            onClick={() => app.job?.id && navigate(`/jobs/${app.job.id}`)}
                          >
                            {app.job?.title || "Role"}
                          </h3>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap", fontSize: "0.86rem", color: "var(--text-secondary)" }}>
                          {app.job?.recruiter?.name && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: 600, color: "var(--text-main)" }}>
                              <Building2 size={14} color="var(--primary)" />
                              {app.job.recruiter.name}
                            </span>
                          )}

                          {app.job?.location && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                              <MapPin size={14} />
                              {app.job.location}
                            </span>
                          )}

                          {app.job?.salary && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                              <IndianRupee size={13} />
                              ₹{(app.job.salary / 100000).toFixed(1)}L
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                        <span
                          style={{
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                            padding: "0.38rem 0.85rem",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <StatusIcon size={14} />
                          {cfg.label}
                        </span>

                        {app.status === "APPLIED" && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="btn-withdraw-clean"
                            title="Withdraw application"
                          >
                            <Undo2 size={13} />
                            <span>Withdraw</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interview Details if available */}
                    {app.status === "INTERVIEW_SCHEDULED" && app.interviewScheduledAt && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "0.85rem 1rem",
                          background: "var(--bg-soft)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <CalendarDays size={16} color="var(--primary)" />
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-dark)" }}>
                            Interview: {app.interviewScheduledAt.replace("T", " ").slice(0, 16)}
                          </span>
                        </div>
                        {app.interviewDetails && (
                          <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                            {app.interviewDetails}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Jobs */}
        {activeTab === "saved" && (
          <div>
            {savedJobsList.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <Bookmark size={26} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  No saved jobs yet
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "1.5rem" }}>
                  Bookmark positions while browsing to review and apply anytime.
                </p>
                <button onClick={() => navigate("/jobs")} className="btn-primary">
                  Explore Open Roles →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {savedJobsList.map((job) => (
                  <div key={job.id} className="app-row-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <h3
                          style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.3rem", cursor: "pointer" }}
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          {job.title}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.86rem", color: "var(--text-secondary)" }}>
                          <span>{job.recruiter?.name || "Company"}</span>
                          {job.location && <span>• {job.location}</span>}
                          {job.salary && <span>• ₹{(job.salary / 100000).toFixed(1)}L / yr</span>}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.6rem" }}>
                        <button
                          onClick={() => removeSavedJob(job.id)}
                          className="btn-secondary"
                          style={{ padding: "0.45rem 0.85rem", fontSize: "0.84rem" }}
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="btn-primary"
                          style={{ padding: "0.45rem 1rem", fontSize: "0.84rem" }}
                        >
                          View & Apply →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Toast Alert */}
      {toast && (
        <div className="toast-bubble">
          {toast.Icon && <toast.Icon size={18} color="var(--primary)" />}
          <span>{toast.message}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
