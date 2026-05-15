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
          value={search} onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
          style={{
            width: "100%", padding: "0.85rem 1.25rem", marginBottom: "1.5rem",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem",
            outline: "none", boxSizing: "border-box",
          }}
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
              <div key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "clamp(1.25rem, 3vw, 1.75rem)",
                  transition: "var(--transition)", animation: "fadeIn 0.4s ease",
                  cursor: "pointer",
                }}>

                {/* Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-head)", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
                    <div style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 500 }}>{job.recruiter?.name || "Company"}</div>
                  </div>
                  {job.salary && (
                    <span style={{ background: "rgba(67,233,123,0.12)", color: "#43e97b", padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      ₹{(job.salary / 100000).toFixed(1)}L
                    </span>
                  )}
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

                {/* View Details Button */}
                {role === "CANDIDATE" && (
                  <div style={{
                    width: "100%", padding: "0.65rem", textAlign: "center",
                    background: "linear-gradient(135deg, var(--accent), #8b85ff)",
                    color: "#fff", borderRadius: "var(--radius)",
                    fontWeight: 600, fontSize: "0.875rem", boxSizing: "border-box",
                  }}>
                    View & Apply →
                  </div>
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