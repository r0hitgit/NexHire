import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJobs } from "../api/axios";

import {
  Search,
  MapPin,
  CalendarDays,
  IndianRupee,
  Briefcase,
  Bookmark,
  SlidersHorizontal,
  X,
  ArrowRight,
  Sparkles,
  Building2,
  Check,
  ChevronDown,
  RotateCcw
} from "lucide-react";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from query params if available
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("loc") || "");
  const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
  const [salaryFilter, setSalaryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Saved jobs persistence
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nexhire_saved_jobs") || "[]");
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    getJobs()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const toggleSaveJob = (e, jobId) => {
    e.stopPropagation();
    let updated;
    if (savedJobs.includes(jobId)) {
      updated = savedJobs.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobs, jobId];
    }
    setSavedJobs(updated);
    localStorage.setItem("nexhire_saved_jobs", JSON.stringify(updated));
  };

  const handleResetFilters = () => {
    setKeyword("");
    setLocationFilter("");
    setJobTypeFilter("ALL");
    setSalaryFilter("ALL");
    setSortBy("newest");
    setSearchParams({});
  };

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        const matchesKeyword =
          !keyword ||
          j.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          j.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          j.recruiter?.name?.toLowerCase().includes(keyword.toLowerCase());

        const matchesLocation =
          !locationFilter ||
          j.location?.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesType =
          jobTypeFilter === "ALL" ||
          (j.jobType && j.jobType.toLowerCase().includes(jobTypeFilter.toLowerCase())) ||
          (jobTypeFilter === "REMOTE" && j.location?.toLowerCase().includes("remote"));

        let matchesSalary = true;
        if (salaryFilter === "UNDER_10L") {
          matchesSalary = j.salary && j.salary < 1000000;
        } else if (salaryFilter === "10L_20L") {
          matchesSalary = j.salary && j.salary >= 1000000 && j.salary <= 2000000;
        } else if (salaryFilter === "OVER_20L") {
          matchesSalary = j.salary && j.salary > 2000000;
        }

        return matchesKeyword && matchesLocation && matchesType && matchesSalary;
      })
      .sort((a, b) => {
        if (sortBy === "highest_salary") {
          return (b.salary || 0) - (a.salary || 0);
        }
        if (sortBy === "lowest_salary") {
          return (a.salary || 0) - (b.salary || 0);
        }
        if (sortBy === "title_asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        // newest default
        const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
        const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
        return dateB - dateA;
      });
  }, [jobs, keyword, locationFilter, jobTypeFilter, salaryFilter, sortBy]);

  const activeFiltersCount = [
    keyword ? 1 : 0,
    locationFilter ? 1 : 0,
    jobTypeFilter !== "ALL" ? 1 : 0,
    salaryFilter !== "ALL" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

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
        .jobs-page-container {
          flex: 1;
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: 2.25rem clamp(1rem, 3vw, 2rem) 4rem;
        }

        .search-hero-bar {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.65rem 0.85rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-hero-bar:focus-within {
          border-color: var(--primary);
          box-shadow: var(--shadow-hover);
        }

        .jobs-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: flex-start;
        }

        .filters-sidebar {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-xs);
          position: sticky;
          top: 90px;
        }

        .filter-group {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-group:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .filter-label {
          font-family: var(--font-head);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.35rem 0;
          font-size: 0.88rem;
          color: var(--text-secondary);
          cursor: pointer;
          user-select: none;
          transition: color 0.15s ease;
        }

        .filter-option:hover {
          color: var(--primary);
        }

        .filter-option input[type="radio"],
        .filter-option input[type="checkbox"] {
          accent-color: var(--primary);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        /* Job Cards */
        .job-card-premium {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-xs);
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .job-card-premium:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }

        .job-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #E8F5F0 0%, #D8EDE5 100%);
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-head);
          font-size: 1.15rem;
          font-weight: 800;
          flex-shrink: 0;
          border: 1px solid rgba(23, 122, 89, 0.1);
        }

        .salary-pill {
          background-color: var(--primary-subtle);
          color: var(--primary-dark);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          white-space: nowrap;
        }

        .tag-pill {
          background-color: var(--bg-section);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
        }

        .btn-save-bookmark {
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .btn-save-bookmark:hover {
          background: var(--bg-section);
          color: var(--primary);
          border-color: #BCE0D1;
        }

        .btn-save-bookmark.saved {
          background: var(--primary-subtle);
          color: var(--primary);
          border-color: var(--primary);
        }

        .active-filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--primary-subtle);
          color: var(--primary-dark);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .jobs-layout {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            display: none;
          }
          .mobile-filter-trigger {
            display: inline-flex !important;
          }
        }
      `}</style>

      <main className="jobs-page-container">
        {/* Header Title & Subtitle */}
        <div style={{ marginBottom: "1.75rem" }}>
          <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Explore Verified Careers
          </span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginTop: "0.25rem", marginBottom: "0.4rem" }}>
            Find Your Next Opportunity
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Discover and apply to top engineering, design, marketing, and leadership openings.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="search-hero-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1 }}>
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search by job title, keyword, or company..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.95rem",
                color: "var(--text-main)",
                fontWeight: 500
              }}
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                style={{ background: "none", color: "var(--text-muted)", padding: "0.2rem" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ width: "1px", height: "28px", background: "var(--border-color)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: "0.8" }}>
            <MapPin size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Location or 'Remote'..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.95rem",
                color: "var(--text-main)",
                fontWeight: 500
              }}
            />
            {locationFilter && (
              <button
                type="button"
                onClick={() => setLocationFilter("")}
                style={{ background: "none", color: "var(--text-muted)", padding: "0.2rem" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="btn-secondary mobile-filter-trigger"
            style={{ display: "none", padding: "0.6rem 0.85rem", gap: "0.4rem" }}
          >
            <SlidersHorizontal size={16} />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          </button>
        </div>

        {/* Results Bar: Active Chips & Sort */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
              {loading ? "Searching..." : `${filteredJobs.length} opportunities`}
            </span>

            {activeFiltersCount > 0 && (
              <>
                <span style={{ color: "var(--border-color)" }}>|</span>
                {keyword && (
                  <span className="active-filter-tag">
                    "{keyword}"
                    <X size={13} style={{ cursor: "pointer" }} onClick={() => setKeyword("")} />
                  </span>
                )}
                {locationFilter && (
                  <span className="active-filter-tag">
                    {locationFilter}
                    <X size={13} style={{ cursor: "pointer" }} onClick={() => setLocationFilter("")} />
                  </span>
                )}
                {jobTypeFilter !== "ALL" && (
                  <span className="active-filter-tag">
                    {jobTypeFilter}
                    <X size={13} style={{ cursor: "pointer" }} onClick={() => setJobTypeFilter("ALL")} />
                  </span>
                )}
                {salaryFilter !== "ALL" && (
                  <span className="active-filter-tag">
                    {salaryFilter.replace("_", " ")}
                    <X size={13} style={{ cursor: "pointer" }} onClick={() => setSalaryFilter("ALL")} />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  Clear all
                </button>
              </>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "0.45rem 0.85rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "var(--text-main)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="highest_salary">Highest Salary</option>
              <option value="lowest_salary">Lowest Salary</option>
              <option value="title_asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="jobs-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="filters-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <SlidersHorizontal size={16} color="var(--primary)" />
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-main)" }}>
                  Filter Jobs
                </span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  style={{ background: "none", color: "var(--primary)", fontSize: "0.8rem", fontWeight: 700 }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Employment Type */}
            <div className="filter-group">
              <div className="filter-label">Work Type</div>
              {[
                { label: "All Opportunities", value: "ALL" },
                { label: "Remote", value: "REMOTE" },
                { label: "Full Time", value: "Full-time" },
                { label: "Contract", value: "Contract" },
                { label: "Internship", value: "Internship" }
              ].map((opt) => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="radio"
                    name="jobType"
                    checked={jobTypeFilter === opt.value}
                    onChange={() => setJobTypeFilter(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Salary Range */}
            <div className="filter-group">
              <div className="filter-label">Compensation</div>
              {[
                { label: "Any Salary", value: "ALL" },
                { label: "Up to ₹10 Lakhs", value: "UNDER_10L" },
                { label: "₹10L – ₹20 Lakhs", value: "10L_20L" },
                { label: "₹20+ Lakhs", value: "OVER_20L" }
              ].map((opt) => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="radio"
                    name="salaryFilter"
                    checked={salaryFilter === opt.value}
                    onChange={() => setSalaryFilter(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Quick Tips */}
            <div style={{ background: "var(--bg-soft)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, fontSize: "0.82rem", color: "var(--primary-dark)", marginBottom: "0.3rem" }}>
                <Sparkles size={14} />
                <span>Job Seeker Tip</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                Upload an updated PDF resume on your profile to accelerate recruiter shortlists.
              </p>
            </div>
          </aside>

          {/* Job Listings Column */}
          <div style={{ minWidth: 0 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: "180px", borderRadius: "var(--radius-lg)" }}
                  />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  boxShadow: "var(--shadow-xs)"
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--primary-subtle)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem"
                  }}
                >
                  <Search size={26} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  No open roles match your current criteria
                </h3>
                <p style={{ color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto 1.5rem", fontSize: "0.92rem" }}>
                  Try removing some filters, adjusting your location query, or clearing search keywords.
                </p>
                <button onClick={handleResetFilters} className="btn-secondary" style={{ gap: "0.5rem" }}>
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredJobs.map((job) => {
                  const companyName = job.recruiter?.name || "Verified Employer";
                  const isSaved = savedJobs.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className="job-card-premium"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      {/* Top Header Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", minWidth: 0 }}>
                          <div className="job-avatar">
                            {companyName.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                              <h2
                                style={{
                                  fontSize: "1.18rem",
                                  fontWeight: 700,
                                  color: "var(--text-main)",
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {job.title}
                              </h2>
                              {job.salary && job.salary > 2000000 && (
                                <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "var(--accent-lime)", color: "var(--primary-dark)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                                  Featured
                                </span>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.88rem" }}>
                              <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                                {companyName}
                              </span>
                              {job.location && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--text-secondary)" }}>
                                  <MapPin size={14} color="var(--primary)" />
                                  {job.location}
                                </span>
                              )}
                              {job.jobType && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--text-secondary)" }}>
                                  <Briefcase size={14} />
                                  {job.jobType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Top Right: Salary & Bookmark */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                          {job.salary && (
                            <span className="salary-pill">
                              <IndianRupee size={13} strokeWidth={2.4} />
                              {(job.salary / 100000).toFixed(1)}L / year
                            </span>
                          )}

                          <button
                            type="button"
                            className={`btn-save-bookmark ${isSaved ? "saved" : ""}`}
                            onClick={(e) => toggleSaveJob(e, job.id)}
                            title={isSaved ? "Remove bookmark" : "Save job"}
                          >
                            <Bookmark size={17} fill={isSaved ? "var(--primary)" : "none"} />
                          </button>
                        </div>
                      </div>

                      {/* Job Description Excerpt */}
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.92rem",
                          lineHeight: 1.6,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {job.description || "No detailed description provided for this opening."}
                      </p>

                      {/* Footer Metadata & CTA */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "0.85rem",
                          borderTop: "1px solid var(--border-color)",
                          flexWrap: "wrap",
                          gap: "0.75rem"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          {job.postedDate && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                              <CalendarDays size={13} />
                              Posted {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className="tag-pill">Actively Recruiting</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span
                            style={{
                              fontSize: "0.88rem",
                              fontWeight: 700,
                              color: "var(--primary)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem"
                            }}
                          >
                            View Role & Apply
                            <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 33, 29, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end"
          }}
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "340px",
              background: "#FFFFFF",
              height: "100%",
              padding: "1.5rem",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-main)" }}>
                Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{ background: "none", color: "var(--text-main)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Work Type */}
            <div className="filter-group">
              <div className="filter-label">Work Type</div>
              {[
                { label: "All Opportunities", value: "ALL" },
                { label: "Remote", value: "REMOTE" },
                { label: "Full Time", value: "Full-time" },
                { label: "Contract", value: "Contract" },
                { label: "Internship", value: "Internship" }
              ].map((opt) => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="radio"
                    name="mJobType"
                    checked={jobTypeFilter === opt.value}
                    onChange={() => setJobTypeFilter(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Compensation */}
            <div className="filter-group">
              <div className="filter-label">Compensation</div>
              {[
                { label: "Any Salary", value: "ALL" },
                { label: "Up to ₹10 Lakhs", value: "UNDER_10L" },
                { label: "₹10L – ₹20 Lakhs", value: "10L_20L" },
                { label: "₹20+ Lakhs", value: "OVER_20L" }
              ].map((opt) => (
                <label key={opt.value} className="filter-option">
                  <input
                    type="radio"
                    name="mSalaryFilter"
                    checked={salaryFilter === opt.value}
                    onChange={() => setSalaryFilter(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleResetFilters}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
