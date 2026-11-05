import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileText,
  Lightbulb,
  CheckSquare,
  Award,
  Filter
} from "lucide-react";

export default function CareerResources() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGuide, setActiveGuide] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const categories = ["All", "Interview Prep", "Resume & Portfolio", "Salary & Negotiation", "Career Growth"];

  const guides = [
    {
      id: "interview-playbook",
      category: "Interview Prep",
      title: "The Modern Tech Interview Playbook",
      readTime: "8 min read",
      level: "All Engineering Levels",
      summary: "A battle-tested framework for acing algorithmic problem-solving, system design discussions, and behavioral rounds.",
      highlights: [
        "Structure behavioral answers using the STAR method (Situation, Task, Action, Result) with measurable metrics.",
        "System design roadmap: Requirements scoping, API schema, database scaling, caching, and load balancing.",
        "10 high-leverage questions to ask your interviewers to evaluate engineering culture and growth opportunities."
      ],
      content: `The modern technical interview has evolved beyond pure rote algorithm memorization. High-growth engineering teams now evaluate candidate communication, architectural tradeoffs, and ownership mindset.\n\n### 1. The STAR Behavioral Formula\nNever recite your resume chronologically. Instead, prepare 5 core stories showcasing technical complexity, cross-functional collaboration, overcoming production incidents, and mentoring peers.\n\n### 2. System Design Blueprint\nAlways spend the first 5 minutes clarifying scope: traffic expectations (QPS), read/write ratios, latency SLAs, and consistency requirements before drawing database nodes.\n\n### 3. Culture Assessment Questions\nTurn the interview into a collaborative dialogue. Ask: 'What is the team's biggest technical debt item right now?' and 'How does the team prioritize feature velocity vs reliability?'`
    },
    {
      id: "ats-resume-blueprint",
      category: "Resume & Portfolio",
      title: "The ATS-Proof High-Impact Resume Blueprint",
      readTime: "6 min read",
      level: "All Job Seekers",
      summary: "How to craft a clean, ATS-compliant resume that captures hiring managers' attention within the crucial first 6 seconds.",
      highlights: [
        "The Google X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
        "Single-column formatting guidelines to maximize parsing accuracy across modern ATS platforms.",
        "The 5 fatal resume mistakes that lead to automatic rejection and how to fix them."
      ],
      content: `Recruiters spend an average of 6 to 8 seconds scanning a resume on their initial pass. If your key achievements are buried beneath generic job descriptions, your callback rate plummets.\n\n### 1. The Power of Quantified Impact\nAvoid writing 'Worked on backend APIs'. Instead write: 'Architected microservice endpoints handling 4.2M daily requests, reducing p99 latency by 34% through Redis caching.'\n\n### 2. Formatting Principles\nUse a clean single-column layout, standard headings (Experience, Education, Technical Skills), and standard PDF export. Never use multi-column tables, progress bars for skills, or unparsed image graphics.\n\n### 3. Targeted Keyword Alignment\nAnalyze 3 to 5 job descriptions in your target tier. Align your skill tags and technical keywords with the exact terminology used by hiring teams.`
    },
    {
      id: "salary-negotiation",
      category: "Salary & Negotiation",
      title: "Tech & Product Salary Negotiation Playbook",
      readTime: "7 min read",
      level: "Mid to Senior Professionals",
      summary: "Data-driven strategies for negotiating total compensation packages including base salary, signing bonuses, and equity grants.",
      highlights: [
        "How to gracefully deflect early salary questions before an official offer is extended.",
        "Evaluating total compensation: base salary vs annual performance bonus vs stock options/RSUs.",
        "Verbatim email scripts to request a 10%–25% offer revision professionally."
      ],
      content: `Negotiating your offer is the highest-ROI conversation in your career. Most employers have a pre-approved buffer within their salary bands for candidates who advocate for themselves with market data.\n\n### 1. Delaying Early Numbers\nWhen asked for expectations in early recruiter screens, respond: 'I am focused on finding the right organizational match first. I am confident we can agree on competitive market compensation once an offer is extended.'\n\n### 2. Assessing Equity Grants\nAlways ask for: number of shares, total shares outstanding, latest 409A valuation, preferred share price, and vesting schedule (typically 4-year with 1-year cliff).\n\n### 3. The Counter-Offer Framework\nExpress genuine excitement for the role first, cite third-party benchmark data (Levels.fyi, Glassdoor), and propose a specific target number backed by your unique skill set.`
    },
    {
      id: "design-portfolio-guide",
      category: "Resume & Portfolio",
      title: "Crafting a Design & Product Case Study That Converts",
      readTime: "5 min read",
      level: "Designers & Product Managers",
      summary: "Turn UX and product case studies into compelling visual stories that demonstrate user empathy and tangible business outcomes.",
      highlights: [
        "Anatomy of a winning case study: Problem context, discovery research, iterative designs, and final outcome.",
        "Balancing aesthetics with business metrics like conversion rate, retention, and task completion time.",
        "How to showcase confidential client work ethically without violating NDAs."
      ],
      content: `Hiring directors do not just want to see polished Figma mockups. They want to understand your decision-making process, how you handle ambiguity, and how you validate design solutions with real users.\n\n### 1. Problem Statement Clarity\nStart each case study with a concise hook: Who was the target user? What pain point were they experiencing? What was the business bottleneck?\n\n### 2. Showing the Messy Middle\nInclude initial sketches, discarded concepts, and usability test feedback. Demonstrating why a specific direction was rejected proves deep product thinking.\n\n### 3. Business Impact Summary\nClose with real metrics: 'Increased mobile checkout conversion by 18% and reduced support inquiries by 26% within 60 days of launch.'`
    },
    {
      id: "career-acceleration",
      category: "Career Growth",
      title: "From Mid-Level to Staff: Strategic Career Acceleration",
      readTime: "9 min read",
      level: "Senior Engineers & Leads",
      summary: "The unwritten principles for leveling up from individual contributor to high-impact technical lead or staff engineer.",
      highlights: [
        "Developing a T-shaped profile: broad architectural breadth paired with deep domain mastery.",
        "Writing persuasive RFCs (Requests for Comment) and aligning multi-team stakeholders.",
        "Choosing high-leverage organizational projects that directly impact company objectives."
      ],
      content: `Promotions beyond senior level are rarely about writing more lines of code. They are earned through technical influence, architectural foresight, and enabling other engineers to deliver faster.\n\n### 1. The Power of Written RFCs\nStaff-plus engineers solve complex ambiguities through writing. Master the art of drafting concise 2-page proposals that outline problems, architectural alternatives, security impacts, and rollout milestones.\n\n### 2. Multiplier Effect\nMeasure your value not just by what you personally ship, but by how many blockers you remove for your peers through automated tooling, code review standards, and mentorship.\n\n### 3. Strategic Project Selection\nSeek projects that sit at the intersection of high business priority and high technical ambiguity. Delivering successfully in these zones builds unshakeable organizational trust.`
    },
    {
      id: "recruiter-screen",
      category: "Interview Prep",
      title: "How to Ace the 20-Minute Recruiter Screen",
      readTime: "4 min read",
      level: "All Job Seekers",
      summary: "What talent acquisition partners evaluate during initial screening calls and how to advance seamlessly to hiring managers.",
      highlights: [
        "The 90-second 'Tell me about yourself' formula tailored to the specific role description.",
        "Demonstrating genuine company interest and mission alignment without sounding rehearsed.",
        "Subtle green flags that recruiters look for: proactive curiosity, communication clarity, and career intentionality."
      ],
      content: `The recruiter screening call is not a casual chat — it is the initial gatekeeper conversation. Recruiters need to verify salary expectations, visa status, role relevance, and cultural communication.\n\n### 1. The 90-Second Elevator Pitch\nDivide your response into three 30-second segments: Where you started, your current key specialization and recent milestone, and why this specific opening is the exact logical next step in your trajectory.\n\n### 2. Company Research\nSpend 15 minutes before the call exploring the company's recent product launches, engineering blog posts, or executive interviews. Referencing a specific feature shows exceptional preparation.\n\n### 3. Next Steps Inquiry\nAlways conclude the call by asking: 'What does the next phase of the evaluation process look like, and when should I anticipate hearing back?'`
    }
  ];

  const filteredGuides = selectedCategory === "All"
    ? guides
    : guides.filter((g) => g.category === selectedCategory);

  const interviewChecklist = [
    { id: "c1", text: "Researched company mission, business model, and recent product launches" },
    { id: "c2", text: "Prepared 5 STAR-format stories highlighting quantifiable technical achievements" },
    { id: "c3", text: "Reviewed core data structures, algorithms, and system design fundamentals" },
    { id: "c4", text: "Formulated 4 thoughtful questions tailored to evaluate team culture & tech stack" },
    { id: "c5", text: "Checked audio, camera, lighting, and quiet environment for video interview" },
    { id: "c6", text: "Researched compensation benchmarks on Levels.fyi & market salary indexes" }
  ];

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

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
        .resources-hero {
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
          padding: clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2.5rem) 2rem;
        }

        .filter-chip {
          padding: 0.5rem 1.15rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .filter-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-chip.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(23, 122, 89, 0.22);
        }

        .guide-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          box-shadow: var(--shadow-xs);
        }

        .guide-card:hover {
          transform: translateY(-3px);
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .category-tag {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--primary-dark);
          background: var(--primary-subtle);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .checklist-item:hover {
          border-color: var(--primary);
          background: #F9FDFB;
        }

        .checklist-item.checked {
          background: var(--primary-subtle);
          border-color: #BCE0D1;
        }

        .checklist-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .checklist-item.checked .checklist-checkbox {
          background: var(--primary);
          border-color: var(--primary);
          color: #FFFFFF;
        }
      `}</style>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <div className="resources-hero">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "0.92rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              marginBottom: "1.5rem"
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#FFFFFF", border: "1px solid var(--border-color)", padding: "0.38rem 0.95rem", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", marginBottom: "1.25rem" }}>
            <Sparkles size={14} />
            <span>Career Growth & Playbooks Hub</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1rem" }}>
            Career Resources & <span style={{ color: "var(--primary)", fontStyle: "italic", fontFamily: "'DM Sans', serif" }}>Playbooks</span>
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: "clamp(1.02rem, 2vw, 1.18rem)", lineHeight: 1.6, maxWidth: "680px", marginBottom: "2rem" }}>
            Practical guides, interview frameworks, resume blueprints, and compensation negotiation playbooks to help you land your dream job and accelerate your career.
          </p>

          {/* Category Filter Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginRight: "0.4rem", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700 }}>
              <Filter size={15} />
              <span>Topics:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <section style={{ maxWidth: "1240px", margin: "0 auto", padding: "1rem clamp(1rem, 4vw, 2.5rem) 4rem", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "1.75rem", marginBottom: "4rem" }}>
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="category-tag">{guide.category}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={13} />
                    {guide.readTime}
                  </span>
                </div>

                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                    {guide.title}
                  </h2>
                  <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {guide.summary}
                  </p>
                </div>

                <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-sm)", padding: "0.95rem", border: "1px solid var(--border-color)", marginTop: "auto" }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", color: "var(--primary-dark)", letterSpacing: "0.06em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Lightbulb size={14} />
                    <span>Key Takeaway</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.5, margin: 0 }}>
                    {guide.highlights[0]}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveGuide(guide)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem 1rem",
                    color: "var(--primary-dark)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "var(--transition)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary-subtle)";
                    e.currentTarget.style.borderColor = "#BCE0D1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  <BookOpen size={16} />
                  <span>Read Full Guide</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Pre-Interview Preparation Checklist */}
          <div style={{ background: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "clamp(1.75rem, 4vw, 2.75rem)", boxShadow: "var(--shadow-sm)", marginBottom: "4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.25rem", marginBottom: "1.75rem" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--primary-subtle)", color: "var(--primary-dark)", fontSize: "0.78rem", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "var(--radius-full)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  <CheckSquare size={13} />
                  <span>Interactive Tool</span>
                </div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem" }}>
                  Pre-Interview Readiness Checklist
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", margin: 0 }}>
                  Track your preparation before any screening, technical, or hiring manager conversation.
                </p>
              </div>

              <div style={{ background: "var(--bg-soft)", border: "1px solid var(--border-color)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Award size={24} color={completedCount === interviewChecklist.length ? "var(--primary)" : "var(--text-muted)"} />
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
                    {completedCount} of {interviewChecklist.length} Complete
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                    {completedCount === interviewChecklist.length ? "Ready to interview! 🎉" : "Tap items to check off"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "0.75rem" }}>
              {interviewChecklist.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`checklist-item ${isChecked ? "checked" : ""}`}
                  >
                    <div className="checklist-checkbox">
                      {isChecked && <CheckCircle2 size={16} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: "0.9rem", color: isChecked ? "var(--primary-dark)" : "var(--text-main)", fontWeight: isChecked ? 600 : 500, textDecoration: isChecked ? "line-through" : "none", opacity: isChecked ? 0.9 : 1 }}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #0C4E3A 0%, #177A59 100%)",
              borderRadius: "24px",
              padding: "clamp(2rem, 5vw, 3.5rem)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
              boxShadow: "0 16px 36px rgba(12, 78, 58, 0.22)"
            }}
          >
            <div style={{ maxWidth: "580px" }}>
              <span style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", padding: "0.35rem 0.85rem", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", display: "inline-block", marginBottom: "1rem" }}>
                Ready to Apply?
              </span>
              <h3 style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)", fontWeight: 800, marginBottom: "0.75rem", lineHeight: 1.25 }}>
                Put these strategies to work with verified openings.
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
                Explore open roles with upfront salaries, connect directly with hiring teams, and track your applications in real time.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                style={{
                  background: "var(--accent-lime)",
                  color: "var(--primary-dark)",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  padding: "0.9rem 1.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  transition: "var(--transition)"
                }}
              >
                <span>Browse All Jobs</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Guide Detail Reader Modal */}
      {activeGuide && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(12, 30, 24, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
            zIndex: 1000
          }}
          onClick={() => setActiveGuide(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              maxWidth: "720px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "clamp(1.75rem, 4vw, 2.75rem)",
              boxShadow: "var(--shadow-xl)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <span className="category-tag">{activeGuide.category}</span>
              <button
                onClick={() => setActiveGuide(null)}
                style={{
                  background: "var(--bg-section)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "var(--text-secondary)"
                }}
              >
                ×
              </button>
            </div>

            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
              {activeGuide.title}
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Clock size={14} />
                {activeGuide.readTime}
              </span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <TrendingUp size={14} />
                {activeGuide.level}
              </span>
            </div>

            {/* Highlights Box */}
            <div style={{ background: "var(--primary-subtle)", border: "1px solid #BCE0D1", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.75rem" }}>
              <h4 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <CheckCircle2 size={16} />
                <span>Actionable Takeaways</span>
              </h4>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--primary-dark)", fontSize: "0.92rem", lineHeight: 1.7 }}>
                {activeGuide.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {/* Content formatted */}
            <div style={{ color: "var(--text-main)", lineHeight: 1.8, fontSize: "0.98rem" }}>
              {activeGuide.content.split("\n\n").map((para, i) => {
                if (para.startsWith("### ")) {
                  return (
                    <h3 key={i} style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
                      {para.replace("### ", "")}
                    </h3>
                  );
                }
                return (
                  <p key={i} style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}>
                    {para}
                  </p>
                );
              })}
            </div>

            <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="btn-primary"
                style={{ padding: "0.75rem 1.5rem" }}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

