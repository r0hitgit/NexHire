import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getMyJobs,
  createJob,
  deleteJob,
  updateJob,
  getApplicationsForJob,
  updateApplicationStatus,
  scheduleInterview,
  contactCandidate
} from "../api/axios";

import {
  MapPin,
  FileText,
  CalendarDays,
  Mail,
  Pencil,
  ArrowLeft,
  Trash2,
  CircleCheck,
  CircleX,
  Plus,
  Users,
  Briefcase,
  ExternalLink,
  Clock,
  X,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const STATUS_CONFIG = {
  APPLIED: {
    color: "#177A59",
    bg: "#E8F5F0",
    border: "#BCE0D1",
    label: "Applied"
  },
  SHORTLISTED: {
    color: "#B45309",
    bg: "#FEF3C7",
    border: "#FDE68A",
    label: "Shortlisted"
  },
  INTERVIEW_SCHEDULED: {
    color: "#0C4E3A",
    bg: "#DFF264",
    border: "#CBE042",
    label: "Interview Scheduled"
  },
  REJECTED: {
    color: "#B91C1C",
    bg: "#FEE2E2",
    border: "#FECACA",
    label: "Not Selected"
  }
};

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);

  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });
  const [editLoading, setEditLoading] = useState(false);

  const [interviewModal, setInterviewModal] = useState(null);
  const [interviewAt, setInterviewAt] = useState("");
  const [interviewDetails, setInterviewDetails] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  const [contactModal, setContactModal] = useState(null);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  const fetchApplications = async (jobId) => {
    try {
      const res = await getApplicationsForJob(jobId);
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch {
      setApplications([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await getMyJobs();
      const list = Array.isArray(res.data) ? res.data : [];
      setJobs(list);
      // Auto-select first job if none selected
      if (list.length > 0 && !selectedJob) {
        setSelectedJob(list[0]);
        fetchApplications(list[0].id);
      }
    } catch {
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    fetchApplications(job.id);
    setShowApplicants(true);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createJob({
        ...form,
        salary: parseFloat(form.salary) || 0
      });

      setShowModal(false);
      setForm({
        title: "",
        description: "",
        location: "",
        salary: ""
      });
      await fetchJobs();
      showToast("New job posted successfully!", CircleCheck);
    } catch {
      showToast("Failed to create job posting", CircleX);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (e, job) => {
    e.stopPropagation();
    setEditModal(job);
    setEditForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || ""
    });
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      await updateJob(editModal.id, {
        ...editForm,
        salary: parseFloat(editForm.salary) || 0
      });

      setEditModal(null);
      await fetchJobs();
      if (selectedJob?.id === editModal.id) {
        setSelectedJob((prev) => ({ ...prev, ...editForm, salary: parseFloat(editForm.salary) || 0 }));
      }
      showToast("Job details updated!", CircleCheck);
    } catch {
      showToast("Failed to update job", CircleX);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;

    try {
      await deleteJob(jobId);
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }
      await fetchJobs();
      showToast("Job posting removed", Trash2);
    } catch {
      showToast("Failed to delete job", CircleX);
    }
  };

  const handleStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      fetchApplications(selectedJob.id);
      showToast(`Status updated to ${status}`, CircleCheck);
    } catch {
      showToast("Failed to update status", CircleX);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewAt) {
      return showToast("Please select date and time", CircleX);
    }

    setInterviewLoading(true);

    try {
      await scheduleInterview(interviewModal, interviewAt.slice(0, 19), interviewDetails);
      fetchApplications(selectedJob.id);
      setInterviewModal(null);
      setInterviewAt("");
      setInterviewDetails("");
      showToast("Interview scheduled and candidate notified!", CircleCheck);
    } catch {
      showToast("Failed to schedule interview", CircleX);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleContact = async () => {
    if (!contactSubject || !contactMessage) {
      return showToast("Please fill in both subject and message", CircleX);
    }

    setContactLoading(true);

    try {
      await contactCandidate(contactModal, contactSubject, contactMessage);
      setContactModal(null);
      setContactSubject("");
      setContactMessage("");
      showToast("Message sent to candidate!", CircleCheck);
    } catch {
      showToast("Failed to send message", CircleX);
    } finally {
      setContactLoading(false);
    }
  };

  const showToast = (message, Icon) => {
    setToast({ message, Icon });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    background: "#FFFFFF",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-main)",
    fontSize: "0.92rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-soft)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Navbar />

      <style>{`
        .recruiter-container {
          flex: 1;
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: 2.25rem clamp(1rem, 3vw, 2rem) 4rem;
        }

        .recruiter-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.75rem;
          align-items: flex-start;
        }

        .stat-card-recruiter {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          box-shadow: var(--shadow-xs);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: var(--transition);
        }

        .stat-card-recruiter:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .r-panel-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xs);
          overflow: hidden;
        }

        .r-panel-header {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .r-job-card-item {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.15rem;
          margin-bottom: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .r-job-card-item:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .r-job-card-item.selected {
          border-color: var(--primary);
          background: var(--primary-subtle);
          box-shadow: 0 2px 8px rgba(23, 122, 89, 0.12);
        }

        .r-applicant-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: var(--shadow-xs);
          transition: var(--transition);
        }

        .r-applicant-card:hover {
          border-color: #BCE0D1;
          box-shadow: var(--shadow-sm);
        }

        .status-chip-btn {
          padding: 0.32rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          border: 1px solid transparent;
        }

        .modal-clean {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 2rem;
          width: 100%;
          max-width: 480px;
          animation: fadeIn 0.25s ease;
        }

        .toast-float {
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
          .recruiter-grid {
            grid-template-columns: 1fr;
          }
          .mobile-tabs-recruiter {
            display: flex !important;
          }
          .hide-on-mobile-tab {
            display: none !important;
          }
        }
      `}</style>

      <main className="recruiter-container">
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginBottom: "2rem"
          }}
        >
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
              Employer Operations
            </span>
            <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginTop: "0.25rem", marginBottom: "0.3rem" }}>
              Recruiter Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Manage your company's active openings, review candidate resumes, and coordinate interviews.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ padding: "0.75rem 1.4rem", fontSize: "0.95rem", gap: "0.5rem" }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Post a New Job</span>
          </button>
        </div>

        {/* Overview Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}
        >
          <div className="stat-card-recruiter">
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Active Job Postings
              </span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.25rem" }}>
                {jobs.length}
              </div>
            </div>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "var(--primary-subtle)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={22} />
            </div>
          </div>

          <div className="stat-card-recruiter">
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Selected Job Applicants
              </span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.25rem" }}>
                {applications.length}
              </div>
            </div>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={22} />
            </div>
          </div>

          <div className="stat-card-recruiter">
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Shortlisted
              </span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.25rem" }}>
                {applications.filter((a) => a.status === "SHORTLISTED").length}
              </div>
            </div>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#FEF3C7", color: "#B45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={22} />
            </div>
          </div>
        </div>

        {/* Mobile Switcher Tab (visible only on mobile) */}
        <div
          className="mobile-tabs-recruiter"
          style={{
            display: "none",
            marginBottom: "1.25rem",
            background: "#FFFFFF",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden"
          }}
        >
          <button
            onClick={() => setShowApplicants(false)}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: !showApplicants ? "var(--primary-subtle)" : "transparent",
              color: !showApplicants ? "var(--primary-dark)" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.9rem"
            }}
          >
            My Job Postings ({jobs.length})
          </button>
          <button
            onClick={() => setShowApplicants(true)}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: showApplicants ? "var(--primary-subtle)" : "transparent",
              color: showApplicants ? "var(--primary-dark)" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.9rem"
            }}
          >
            Applicants ({applications.length})
          </button>
        </div>

        {/* Two-Column Management Layout */}
        <div className="recruiter-grid">
          {/* Left Column: My Jobs */}
          <div className={`r-panel-card ${showApplicants ? "hide-on-mobile-tab" : ""}`}>
            <div className="r-panel-header">
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-main)" }}>
                My Job Postings
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                {jobs.length} listed
              </span>
            </div>

            <div style={{ padding: "1.25rem" }}>
              {jobs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-secondary)" }}>
                  <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>No job postings created yet.</p>
                  <button onClick={() => setShowModal(true)} className="btn-secondary" style={{ fontSize: "0.85rem" }}>
                    + Post First Job
                  </button>
                </div>
              ) : (
                jobs.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      className={`r-job-card-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectJob(job)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {job.title}
                          </h3>
                          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                              <MapPin size={13} color="var(--primary)" />
                              {job.location || "Remote"}
                            </span>
                            {job.salary && (
                              <span>• ₹{(job.salary / 100000).toFixed(1)}L / yr</span>
                            )}
                          </div>
                        </div>

                        {/* Edit & Delete Actions */}
                        <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(e, job)}
                            style={{
                              padding: "0.3rem 0.55rem",
                              background: "#FFFFFF",
                              border: "1px solid var(--border-color)",
                              borderRadius: "6px",
                              color: "var(--text-main)",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem"
                            }}
                            title="Edit job"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, job.id)}
                            style={{
                              padding: "0.3rem 0.55rem",
                              background: "#FEF2F2",
                              border: "1px solid #FECACA",
                              borderRadius: "6px",
                              color: "#DC2626",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center"
                            }}
                            title="Delete job"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Applicants for Selected Job */}
          <div className={`r-panel-card ${!showApplicants ? "hide-on-mobile-tab" : ""}`}>
            <div className="r-panel-header">
              <div>
                <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-main)" }}>
                  {selectedJob ? `Applicants for ${selectedJob.title}` : "Candidate Applicants"}
                </span>
                {selectedJob && (
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    {applications.length} candidates applied to this position
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: "1.25rem" }}>
              {!selectedJob ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  <ArrowLeft size={24} style={{ display: "block", margin: "0 auto 0.75rem", color: "var(--primary)" }} />
                  <p style={{ fontSize: "0.95rem" }}>Select a job from the left panel to review its applicants.</p>
                </div>
              ) : applications.length === 0 ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  <Users size={32} style={{ display: "block", margin: "0 auto 0.75rem", color: "var(--text-muted)" }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    No candidates have applied yet
                  </h3>
                  <p style={{ fontSize: "0.88rem" }}>
                    Your posting is live on the marketplace. Qualified candidates will appear here as soon as they apply.
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="r-applicant-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.2rem" }}>
                          {app.candidate?.name || "Candidate"}
                        </h4>
                        <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                          {app.candidate?.email}
                        </div>
                      </div>

                      {/* View Resume Button */}
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-subtle"
                          style={{ padding: "0.38rem 0.85rem", fontSize: "0.8rem", gap: "0.35rem" }}
                        >
                          <FileText size={15} />
                          <span>View Resume</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>

                    {/* Status Changer Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", margin: "0.85rem 0" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginRight: "0.25rem" }}>
                        Status:
                      </span>
                      {["APPLIED", "SHORTLISTED", "REJECTED"].map((st) => {
                        const cfg = STATUS_CONFIG[st];
                        const isCurrent = app.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatus(app.id, st)}
                            className="status-chip-btn"
                            style={{
                              background: isCurrent ? cfg.bg : "#FFFFFF",
                              color: isCurrent ? cfg.color : "var(--text-secondary)",
                              borderColor: isCurrent ? cfg.border : "var(--border-color)"
                            }}
                          >
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Interview Details if Scheduled */}
                    {app.status === "INTERVIEW_SCHEDULED" && app.interviewScheduledAt && (
                      <div
                        style={{
                          background: "var(--bg-soft)",
                          border: "1px solid var(--border-color)",
                          padding: "0.75rem 1rem",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "0.85rem",
                          fontSize: "0.84rem"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--primary-dark)" }}>
                          <CalendarDays size={15} color="var(--primary)" />
                          Interview: {app.interviewScheduledAt.replace("T", " ").slice(0, 16)}
                        </div>
                        {app.interviewDetails && (
                          <div style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                            {app.interviewDetails}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons: Schedule Interview & Contact */}
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
                      <button
                        type="button"
                        onClick={() => setInterviewModal(app.id)}
                        className="btn-secondary"
                        style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", gap: "0.35rem" }}
                      >
                        <CalendarDays size={14} color="var(--primary)" />
                        <span>Schedule Interview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactModal(app.id)}
                        className="btn-secondary"
                        style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", gap: "0.35rem" }}
                      >
                        <Mail size={14} />
                        <span>Contact Candidate</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Post a Job Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 33, 29, 0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem"
          }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                Post a New Opportunity
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateJob}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Job Title *
              </label>
              <input
                style={inputStyle}
                placeholder="e.g. Senior Frontend Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Location
              </label>
              <input
                style={inputStyle}
                placeholder="e.g. Bangalore / Remote"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Annual Compensation (₹/year)
              </label>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 1800000"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Job Description
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                placeholder="Outline team mission, responsibilities, and requirements..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2 }}>
                  {loading ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 33, 29, 0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem"
          }}
          onClick={() => setEditModal(null)}
        >
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                Edit Job Details
              </h2>
              <button onClick={() => setEditModal(null)} style={{ background: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditJob}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Job Title *
              </label>
              <input
                style={inputStyle}
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Location
              </label>
              <input
                style={inputStyle}
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Annual Compensation (₹/year)
              </label>
              <input
                style={inputStyle}
                type="number"
                value={editForm.salary}
                onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
              />

              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                Description
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setEditModal(null)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="btn-primary" style={{ flex: 2 }}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 33, 29, 0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem"
          }}
          onClick={() => setInterviewModal(null)}
        >
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CalendarDays size={20} color="var(--primary)" />
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                  Schedule Interview
                </h2>
              </div>
              <button onClick={() => setInterviewModal(null)} style={{ background: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
              Interview Date & Time *
            </label>
            <input
              type="datetime-local"
              value={interviewAt}
              onChange={(e) => setInterviewAt(e.target.value)}
              style={inputStyle}
            />

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
              Meeting Details & Instructions
            </label>
            <textarea
              value={interviewDetails}
              onChange={(e) => setInterviewDetails(e.target.value)}
              placeholder="e.g. Google Meet link, interviewers, preparation topics..."
              style={{ ...inputStyle, minHeight: "85px", resize: "vertical" }}
            />

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button type="button" onClick={() => setInterviewModal(null)} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleInterview}
                disabled={interviewLoading}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                {interviewLoading ? "Scheduling..." : "Schedule & Notify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Candidate Modal */}
      {contactModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 33, 29, 0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem"
          }}
          onClick={() => setContactModal(null)}
        >
          <div className="modal-clean" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail size={20} color="var(--primary)" />
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                  Message Candidate
                </h2>
              </div>
              <button onClick={() => setContactModal(null)} style={{ background: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
              Subject *
            </label>
            <input
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="e.g. Next steps in our interview process"
              style={inputStyle}
            />

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
              Message Content *
            </label>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Write your direct message to the candidate..."
              style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }}
            />

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button type="button" onClick={() => setContactModal(null)} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContact}
                disabled={contactLoading}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                {contactLoading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-float">
          {toast.Icon && <toast.Icon size={18} color="var(--primary)" />}
          <span>{toast.message}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
