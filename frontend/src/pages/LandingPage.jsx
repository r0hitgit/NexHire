import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  MapPin,
  ArrowRight,
  TrendingUp,
  Code2,
  Palette,
  Megaphone,
  Briefcase,
  Users2,
  Users,
  ShieldCheck,
  Star,
  FileCheck2
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("loc", location.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleShortcutClick = (term) => {
    navigate(`/jobs?q=${encodeURIComponent(term)}`);
  };

  const popularShortcuts = [
    "Product Designer",
    "Frontend Engineer",
    "Remote",
    "Full Stack",
    "Data Analyst",
    "Marketing Lead"
  ];

  const categories = [
    {
      title: "Design & Creative",
      roles: "240+ opportunities",
      icon: Palette,
      keyword: "Designer"
    },
    {
      title: "Engineering & Tech",
      roles: "620+ opportunities",
      icon: Code2,
      keyword: "Engineer"
    },
    {
      title: "Marketing & Growth",
      roles: "180+ opportunities",
      icon: Megaphone,
      keyword: "Marketing"
    },
    {
      title: "Finance & Accounting",
      roles: "115+ opportunities",
      icon: TrendingUp,
      keyword: "Finance"
    },
    {
      title: "People & Operations",
      roles: "90+ opportunities",
      icon: Users2,
      keyword: "HR"
    },
    {
      title: "Product Management",
      roles: "140+ opportunities",
      icon: Briefcase,
      keyword: "Product"
    }
  ];

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
        .hero-section {
          padding: clamp(3rem, 6vw, 5.5rem) clamp(1rem, 4vw, 2.5rem) clamp(3.5rem, 6vw, 5rem);
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(2.5rem, 5vw, 4.5rem);
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--white);
          border: 1px solid var(--border-color);
          padding: 0.38rem 0.95rem;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--primary-dark);
          box-shadow: var(--shadow-xs);
          margin-bottom: 1.5rem;
        }

        .hero-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(23, 122, 89, 0.2);
          animation: pulseGlow 2s infinite;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 5.2vw, 4.1rem);
          font-weight: 800;
          line-height: 1.1;
          color: var(--text-main);
          margin-bottom: 1.35rem;
          letter-spacing: -0.03em;
        }

        .hero-headline span.highlight {
          color: var(--primary);
          font-style: italic;
          font-family: 'DM Sans', serif;
          font-weight: 700;
          position: relative;
        }

        .hero-headline span.highlight::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 0;
          right: 0;
          height: 6px;
          background: rgba(223, 242, 100, 0.55);
          border-radius: 4px;
          z-index: -1;
        }

        .hero-desc {
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 2.25rem;
          max-width: 540px;
        }

        .search-panel {
          background: var(--white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.75rem;
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-panel:focus-within {
          border-color: var(--primary);
          box-shadow: var(--shadow-hover);
        }

        .search-input-group {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex: 1;
          padding: 0.45rem 0.75rem;
        }

        .search-input-field {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .search-divider {
          width: 1px;
          height: 32px;
          background: var(--border-color);
        }

        .btn-search-hero {
          background-color: var(--primary);
          color: var(--white);
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.85rem 1.75rem;
          border-radius: var(--radius-md);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 2px 6px rgba(23, 122, 89, 0.2);
          white-space: nowrap;
        }

        .btn-search-hero:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
        }

        .shortcut-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.85rem;
          background-color: var(--white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .shortcut-chip:hover {
          background-color: var(--primary-subtle);
          color: var(--primary-dark);
          border-color: #BCE0D1;
          transform: translateY(-1px);
        }

        /* Visual Composition Right (Matches screenshot) */
        .hero-stage-container {
          position: relative;
          min-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .hero-concentric-disc {
          position: absolute;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          background: #E4EFE8;
          top: 48%;
          left: 56%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-disc-ring {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1.5px solid rgba(23, 122, 89, 0.22);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .hero-accent-orb {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #DFF264;
          top: 14px;
          right: 48px;
          z-index: 1;
          box-shadow: 0 4px 16px rgba(223, 242, 100, 0.5);
        }

        .hero-peach-accent {
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(254, 205, 211, 0.7);
          bottom: 30px;
          left: 14px;
          filter: blur(8px);
          z-index: 1;
        }

        /* Top Floating Candidate Match Card */
        .hero-candidate-card {
          position: absolute;
          top: 24px;
          right: 0;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 0.75rem 1.15rem;
          box-shadow: 0 16px 36px -8px rgba(16, 50, 36, 0.12), 0 3px 10px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(223, 230, 225, 0.6);
          display: flex;
          align-items: center;
          gap: 0.95rem;
          z-index: 3;
          animation: floatSmooth 6s ease-in-out infinite;
        }

        .candidate-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #B9DCD0;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #177A59;
          border: 2px solid #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        .candidate-match-pill {
          background: #EAF5EF;
          color: #177A59;
          font-weight: 700;
          font-size: 0.82rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          white-space: nowrap;
          margin-left: 0.5rem;
        }

        /* Main Foreground Opportunity Card */
        .hero-opportunity-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 1.75rem 1.85rem;
          box-shadow: 0 24px 56px -12px rgba(16, 50, 36, 0.18), 0 4px 16px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(223, 230, 225, 0.6);
          z-index: 2;
          margin-top: 60px;
          margin-right: 40px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .hero-opportunity-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 28px 64px -12px rgba(16, 50, 36, 0.22), 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .opportunity-label {
          font-size: 0.74rem;
          font-weight: 800;
          color: #177A59;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.15rem;
        }

        .opportunity-company-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #18221E;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-family: 'DM Sans', serif;
          font-size: 1.7rem;
          font-weight: 700;
          font-style: italic;
          flex-shrink: 0;
        }

        .opportunity-btn {
          width: 100%;
          background: #18221E;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 0.88rem 1.25rem;
          font-size: 0.94rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(24, 34, 30, 0.15);
        }

        .opportunity-btn:hover {
          background: #25332E;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 34, 30, 0.25);
        }

        /* Bottom Floating Pill Card */
        .hero-hired-pill {
          position: absolute;
          bottom: 24px;
          right: 0px;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 0.68rem 1.15rem;
          box-shadow: 0 14px 32px -6px rgba(16, 50, 36, 0.14), 0 2px 8px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(223, 230, 225, 0.6);
          display: flex;
          align-items: center;
          gap: 0.65rem;
          z-index: 4;
          animation: floatSmooth 7s ease-in-out infinite 1s;
        }

        @keyframes floatSmooth {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* Category section */
        .category-section {
          padding: 5rem clamp(1rem, 4vw, 2.5rem);
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
          gap: 1.25rem;
          margin-top: 2.5rem;
        }

        .category-card {
          background: var(--white);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-xs);
        }

        .category-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
        }

        .category-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--primary-subtle);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .category-card:hover .category-icon-wrap {
          background: var(--primary);
          color: var(--white);
        }

        .category-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-section);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .category-card:hover .category-arrow {
          background: var(--primary-subtle);
          color: var(--primary);
          transform: translateX(3px);
        }

        /* Features Section */
        .features-section {
          background: var(--white);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 5rem clamp(1rem, 4vw, 2.5rem);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .feature-item {
          background: var(--bg-soft);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: var(--transition);
        }

        .feature-item:hover {
          border-color: #BCE0D1;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        /* CTA Section */
        .cta-banner {
          background: linear-gradient(135deg, #0C4E3A 0%, #177A59 100%);
          border-radius: 24px;
          padding: clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem);
          color: #FFFFFF;
          margin: 4rem auto;
          max-width: 1240px;
          width: calc(100% - 2rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
          box-shadow: 0 16px 36px rgba(12, 78, 58, 0.25);
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .hero-stage-container {
            max-width: 440px;
            margin: 0 auto;
          }
          .hero-opportunity-card {
            margin-right: 0;
            max-width: 100%;
          }
          .search-panel {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }
          .search-divider {
            display: none;
          }
          .btn-search-hero {
            justify-content: center;
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .hero-stage-container {
            min-height: auto;
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          .hero-concentric-disc,
          .hero-accent-orb,
          .hero-peach-accent {
            display: none;
          }
          .hero-candidate-card {
            position: relative;
            top: auto;
            right: auto;
            width: 100%;
            justify-content: space-between;
            animation: none;
          }
          .hero-opportunity-card {
            position: relative;
            margin-top: 0;
            margin-right: 0;
            width: 100%;
          }
          .hero-hired-pill {
            position: relative;
            bottom: auto;
            right: auto;
            width: 100%;
            justify-content: center;
            animation: none;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left Column: Copy & Search */}
          <div>
            <div className="hero-badge">
              <span className="hero-pulse-dot" />
              <span>Over 12,000 jobs added this week</span>
            </div>

            <h1 className="hero-headline">
              Find Your <span className="highlight">Dream Job</span> <br />
              or Perfect Hire
            </h1>

            <p className="hero-desc">
              NexHire connects top talent with great companies. Apply for jobs or post openings — all in one place.
            </p>

            {/* Search Panel */}
            <form onSubmit={handleSearch} className="search-panel">
              <div className="search-input-group">
                <Search size={18} color="var(--primary)" />
                <input
                  type="text"
                  placeholder="Job title, skill, or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="search-input-field"
                />
              </div>

              <div className="search-divider" />

              <div className="search-input-group">
                <MapPin size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="City, state, or 'Remote'"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input-field"
                />
              </div>

              <button type="submit" className="btn-search-hero">
                <span>Search Jobs</span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Popular Shortcuts */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginRight: "0.25rem" }}>
                Popular:
              </span>
              {popularShortcuts.map((shortcut) => (
                <button
                  key={shortcut}
                  type="button"
                  onClick={() => handleShortcutClick(shortcut)}
                  className="shortcut-chip"
                >
                  {shortcut}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Composition (Matches screenshot) */}
          <div className="hero-stage-container">
            {/* Background circular disc & rings */}
            <div className="hero-concentric-disc">
              <div className="hero-disc-ring" />
            </div>

            {/* Lime yellow-green accent orb */}
            <div className="hero-accent-orb" />

            {/* Subtle peach bottom-left glow */}
            <div className="hero-peach-accent" />

            {/* Card 1: Top Floating Candidate Match Card (Alex Morgan) */}
            <div className="hero-candidate-card">
              <div className="candidate-avatar">
                <svg viewBox="0 0 54 54" width="48" height="48" style={{ display: "block" }}>
                  <rect width="54" height="54" rx="14" fill="#B9DCD0" />
                  <path d="M11 54 C11 41, 19 36, 27 36 C35 36, 43 41, 43 54 Z" fill="#3A6D59" />
                  <rect x="23" y="29" width="8" height="8" rx="2" fill="#D89D7F" />
                  <ellipse cx="27" cy="22" rx="11" ry="11" fill="#E4A887" />
                  <path d="M16 22 C16 14, 21 11, 27 11 C33 11, 38 14, 38 22 C38 23, 36 23.5, 33 22.5 C30 23.5, 28 22, 27 22 C26 22, 24 23.5, 21 22.5 C18 23.5, 16 23, 16 22 Z" fill="#3B2E2A" />
                  <circle cx="23" cy="23" r="1.8" fill="#3B2E2A" />
                  <circle cx="31" cy="23" r="1.8" fill="#3B2E2A" />
                </svg>
                <span className="avatar-online-dot" />
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#141E19", lineHeight: 1.2 }}>
                  Aarav Sharma
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64746D", fontWeight: 500, marginTop: "2px" }}>
                  Product Designer
                </div>
              </div>

              <div className="candidate-match-pill">
                98% match
              </div>
            </div>

            {/* Card 2: Main Foreground Opportunity Card */}
            <div className="hero-opportunity-card">
              <div className="opportunity-label">
                NEW OPPORTUNITY
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.95rem", marginBottom: "1.25rem" }}>
                <div className="opportunity-company-icon">
                  A
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#141E19", lineHeight: 1.25 }}>
                    Lead Product Designer
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#64746D", fontWeight: 500, marginTop: "3px" }}>
                    Arc Studio
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", marginBottom: "1.4rem" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#52635B" }}>
                  Remote
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#52635B" }}>
                  $145k – $175k
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/jobs?q=Product+Designer")}
                className="opportunity-btn"
              >
                <span>View opportunity</span>
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Card 3: Bottom Floating Pill (2.4k people hired this month) */}
            <div className="hero-hired-pill">
              <Users size={18} color="#177A59" strokeWidth={2.4} />
              <div style={{ fontSize: "0.88rem", color: "#44534B" }}>
                <strong style={{ fontWeight: 800, color: "#141E19", marginRight: "0.3rem" }}>2.4k</strong>
                people hired this month
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="category-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Explore Opportunities
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", marginTop: "0.35rem" }}>
              Browse jobs by department
            </h2>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="btn-secondary"
            style={{ fontSize: "0.88rem" }}
          >
            <span>View All Categories</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="category-grid">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="category-card"
                onClick={() => handleShortcutClick(cat.keyword)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className="category-icon-wrap">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", margin: 0 }}>
                      {cat.roles}
                    </p>
                  </div>
                </div>
                <div className="category-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why NexHire / Platform Features */}
      <section className="features-section">
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
            <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Platform Benefits
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", marginTop: "0.35rem", marginBottom: "0.75rem" }}>
              Built for speed, accuracy, and trust
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              Say goodbye to black-hole job applications and spammy candidate pools.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: Search,
                title: "Precision Job Discovery",
                desc: "Filter by exact salary, remote preferences, role seniority, and team tech stack without friction."
              },
              {
                icon: Briefcase,
                title: "Seamless Employer Tools",
                desc: "Recruiters manage listings, review verified candidate resumes, and schedule interviews seamlessly."
              },
              {
                icon: FileCheck2,
                title: "Transparent Application Tracking",
                desc: "Candidates receive real-time updates at every stage: Applied, Shortlisted, Interviewed, or Concluded."
              },
              {
                icon: ShieldCheck,
                title: "Verified Credentials",
                desc: "Two-step authentication and secure file storage guarantee trustworthy accounts and private resumes."
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="feature-item">
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "var(--white)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)"
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: "0 1rem" }}>
        <div className="cta-banner">
          <div style={{ maxWidth: "600px" }}>
            <h2 style={{ color: "#FFFFFF", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginBottom: "0.85rem" }}>
              Ready to take the next leap in your career?
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "1.05rem", lineHeight: 1.6 }}>
              Join thousands of professionals finding roles where they can thrive, innovate, and make an impact.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                backgroundColor: "var(--accent-lime)",
                color: "var(--primary-dark)",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "0.9rem 1.85rem",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/jobs")}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.9rem 1.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(10px)"
              }}
            >
              Browse Open Roles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
