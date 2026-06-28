import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobs } from "../api/axios";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    getJobs().then(res => {
      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
      setJobs(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase()) ||
    j.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .search-input {
          width: 100%;
          padding: 0.85rem 1.25rem;
          margin-bottom: 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: var(--radius);
          color: var(--text);
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .search-input:focus {
          border-color: rgba(108,99,255,0.6);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.1);
        }

        .job-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: var(--radius-lg);
          padding: clamp(1.25rem, 3vw, 1.75rem);
          transition: all 0.25s ease;
          animation: fadeIn 0.4s ease;
          cursor: pointer;
        }
        .job-card:hover {
          border-color: rgba(108,99,255,0.4);
          background: rgba(108,99,255,0.06);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(108,99,255,0.1);
        }

        .salary-badge {
          background: rgba(67,233,123,0.1);
          border: 1px solid rgba(67,233,123,0.22);
          backdrop-filter: blur(6px);
          color: #43e97b;
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-view-apply {
          width: 100%;
          padding: 0.65rem;
          text-align: center;
          border: 1px solid rgba(108,99,255,0.35);
          background: rgba(108,99,255,0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #c4c0ff;
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.875rem;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }
        .job-card:hover .btn-view-apply {
          background: rgba(108,99,255,0.25);
          border-color: rgba(108,99,255,0.6);
          color: #fff;
        }
      `}</style>

      <Navbar />
      <main style={{ flex: 1, maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", marginBottom: "0.5rem" }}>Find Your Next Role</h1>
          <p style={{ color: "var(--text2)" }}>{jobs.length} opportunities available</p>
        </div>

        {/* Search */}
        <input
          placeholder="🔍  Search by title, location, or keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "1.25rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "220px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text2)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p>No jobs found matching your search</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "1.25rem" }}>
            {filtered.map(job => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>

                {/* Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-head)", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
                    <div style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 500 }}>{job.recruiter?.name || "Company"}</div>
                  </div>
                  {job.salary && <span className="salary-badge">₹{(job.salary / 100000).toFixed(1)}L</span>}
                </div>

                {/* Description */}
                <p style={{ color: "var(--text2)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {job.description?.substring(0, 100)}{job.description?.length > 100 ? "..." : ""}
                </p>

                {/* Meta */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {job.location && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>📍 {job.location}</span>}
                  {job.postedDate && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>📅 {new Date(job.postedDate).toLocaleDateString()}</span>}
                </div>

                {/* View & Apply Button */}
                {role === "CANDIDATE" && (
                  <div className="btn-view-apply">View & Apply →</div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}