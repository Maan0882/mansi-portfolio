"use client";

import { useState, useEffect, useMemo, memo, useRef } from "react";
import Header from "../components/Header";
import { useScrollReveal } from "../components/useScrollReveal";
import { PROJECTS, SKILLS, GITHUB_COMMITS } from "../lib/portfolioData";

// ─── Pre-compute static derived data at module level (runs once) ──────────────
const TOTAL_COMMITS = GITHUB_COMMITS.reduce((a, c) => a + c.count, 0);

const HEATMAP_WEEKS: (typeof GITHUB_COMMITS)[] = [];
for (let i = 0; i < 52; i++) {
  HEATMAP_WEEKS.push(GITHUB_COMMITS.slice(i * 7, i * 7 + 7));
}

const ALL_TECHS = Array.from(new Set(PROJECTS.flatMap((p) => p.tech_stack))).sort();

const CATEGORY_STATS = [
  { label: "Frontend", key: "frontend", color: "var(--chart-1)" },
  { label: "Backend",  key: "backend",  color: "var(--chart-2)" },
  { label: "Database", key: "database", color: "var(--chart-3)" },
  { label: "Tools",    key: "tools",    color: "var(--chart-4)" },
  { label: "Languages",key: "language", color: "var(--chart-5)" },
].map((cat) => {
  const catSkills = SKILLS.filter((s) => s.category === cat.key);
  const avg = Math.round(catSkills.reduce((a, s) => a + s.proficiency, 0) / catSkills.length);
  const top = [...catSkills].sort((a, b) => b.proficiency - a.proficiency)[0]?.name ?? "";
  return { ...cat, avg, count: catSkills.length, top };
});

// ─── MetricCard — uses requestAnimationFrame counter (no rapid setInterval) ──
const MetricCard = memo(function MetricCard({
  label, value, sub, icon, color,
}: {
  label: string; value: number; sub: string; icon: string; color: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 900; // ms
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      setDisplayed(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <div
      className="glass card reveal"
      style={{
        padding: "1.5rem", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontSize: "1.8rem", width: "48px", height: "48px",
          borderRadius: "var(--radius-md)", background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</span>
        <span style={{
          fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.5rem",
          background: "rgba(16,185,129,0.1)", color: "#10b981",
          borderRadius: "var(--radius-pill)", border: "1px solid rgba(16,185,129,0.25)",
        }}>LIVE</span>
      </div>
      <div>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>
          {displayed.toLocaleString()}
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>{label}</div>
      </div>
      <div style={{ fontSize: "0.72rem", color, fontWeight: 500 }}>{sub}</div>
    </div>
  );
});

// ─── SkillsBreakdown — all data pre-computed at module level ─────────────────
const SkillsBreakdown = memo(function SkillsBreakdown() {
  return (
    <div className="glass card reveal" style={{ borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
      <h3 style={{ color: "var(--text)", marginBottom: "0.4rem" }}>Skills Breakdown</h3>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.75rem" }}>Proficiency by category</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {CATEGORY_STATS.map((cat) => (
          <div key={cat.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text)", fontWeight: 500 }}>{cat.label}</span>
              <span style={{ color: cat.color, fontWeight: 700 }}>{cat.avg}%</span>
            </div>
            <div style={{ height: "10px", background: "var(--border)", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${cat.avg}%`, background: cat.color,
                borderRadius: "5px", animation: "bar-grow 1.2s ease forwards",
                boxShadow: `0 0 10px ${cat.color}55`,
              }} />
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted2)", marginTop: "0.3rem" }}>
              {cat.count} skill{cat.count > 1 ? "s" : ""} · Top: {cat.top}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── HeatmapCell — tiny memo to skip re-render of unchanged cells ─────────────
const HeatmapCell = memo(function HeatmapCell({
  date, count, color,
}: { date: string; count: number; color: string }) {
  return (
    <div
      title={`${date}: ${count} commits`}
      style={{
        width: "11px", height: "11px", borderRadius: "2px",
        background: color, cursor: "default",
        transition: "transform 0.12s ease",
        willChange: "transform",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.4)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    />
  );
});

function getCommitColor(count: number) {
  if (count === 0) return "var(--border)";
  if (count <= 2) return "var(--accent-soft)";
  if (count <= 4) return "rgba(139,92,246,0.45)";
  if (count <= 6) return "rgba(139,92,246,0.7)";
  return "var(--accent)";
}

// ─── GithubHeatmap — weeks pre-computed at module level ──────────────────────
const GithubHeatmap = memo(function GithubHeatmap() {
  return (
    <div className="glass card reveal" style={{ borderRadius: "var(--radius-lg)", padding: "1.75rem", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ color: "var(--text)", marginBottom: "0.25rem" }}>GitHub Activity</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{TOTAL_COMMITS} contributions in the past year</p>
        </div>
        <span className="badge badge-success">GitHub</span>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", gap: "3px", width: "max-content" }}>
          {HEATMAP_WEEKS.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {week.map((day, di) => (
                <HeatmapCell
                  key={di}
                  date={day.date}
                  count={day.count}
                  color={getCommitColor(day.count)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", fontSize: "0.72rem", color: "var(--muted2)" }}>
        <span>Less</span>
        {["var(--border)", "var(--accent-soft)", "rgba(139,92,246,0.45)", "rgba(139,92,246,0.7)", "var(--accent)"].map((c, i) => (
          <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});

// ─── ProjectsTable — useMemo for filtered list, memo on the whole component ──
const ProjectsTable = memo(function ProjectsTable() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return PROJECTS
      .filter((p) => {
        if (s && !p.title.toLowerCase().includes(s) && !p.description.toLowerCase().includes(s)) return false;
        if (typeFilter !== "all" && p.type !== typeFilter) return false;
        if (techFilter !== "all" && !p.tech_stack.includes(techFilter)) return false;
        return true;
      })
      .sort((a, b) =>
        sortBy === "date"
          ? new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime()
          : a.title.localeCompare(b.title)
      );
  }, [search, typeFilter, techFilter, sortBy]);

  const selectStyle: React.CSSProperties = {
    padding: "0.6rem 1rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--bg-card)",
    color: "var(--text)",
    fontSize: "0.85rem",
    fontFamily: "var(--font-main)",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <div className="glass card reveal" style={{ borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h3 style={{ color: "var(--text)", marginBottom: "0.25rem" }}>Project Catalog</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            Showing {filtered.length} of {PROJECTS.length} projects
          </p>
        </div>
        <span className="badge badge-accent">Filament-style Table</span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          id="project-search"
          style={{ flex: 1, minWidth: "200px" }}
        />
        <select id="type-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Types</option>
          <option value="experience">Experience</option>
          <option value="project">Project</option>
        </select>
        <select id="tech-filter" value={techFilter} onChange={(e) => setTechFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Tech</option>
          {ALL_TECHS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "title")} style={selectStyle}>
          <option value="date">Sort: Date</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Title", "Type", "Status", "Tech Stack", "Date", ""].map((h) => (
                <th key={h} style={{
                  padding: "0.6rem 0.75rem", textAlign: "left", fontWeight: 600,
                  color: "var(--muted2)", fontSize: "0.75rem", letterSpacing: "0.06em",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s ease",
                  animation: `slide-up 0.25s ease ${i * 0.04}s both`,
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <td style={{ padding: "0.75rem", fontWeight: 600, color: "var(--text)" }}>{p.title}</td>
                <td style={{ padding: "0.75rem" }}>
                  <span className={`badge ${p.type === "experience" ? "badge-accent" : ""}`}>{p.type}</span>
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <span className={`badge ${p.status === "live" ? "badge-success" : ""}`}>{p.status}</span>
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    {p.tech_stack.slice(0, 3).map((t) => (
                      <span key={t} className="badge" style={{ fontSize: "0.68rem" }}>{t}</span>
                    ))}
                    {p.tech_stack.length > 3 && (
                      <span className="badge" style={{ fontSize: "0.68rem" }}>+{p.tech_stack.length - 3}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: "0.75rem", color: "var(--muted)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {new Date(p.completion_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "0.75rem" }}>
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm" style={{ fontSize: "0.72rem" }}>
                      Live →
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
            No projects match your filters.
          </div>
        )}
      </div>
    </div>
  );
});

// ─── DbMetrics — isolated component; setInterval only re-renders this box ────
const DbMetrics = memo(function DbMetrics() {
  const [count, setCount] = useState(1247);
  const [avgMs, setAvgMs] = useState(48);

  // 5s interval instead of 2s — feels live but causes 60% fewer re-renders
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3));
      setAvgMs(Math.floor(Math.random() * 30 + 35));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // useMemo so metrics array doesn't rebuild on unrelated re-renders
  const metrics = useMemo(() => [
    { label: "Total DB Queries",  value: count,  unit: "queries", color: "var(--chart-1)" },
    { label: "Avg Query Time",    value: avgMs,  unit: "ms",      color: "var(--chart-3)" },
    { label: "Cache Hit Rate",    value: 94,     unit: "%",       color: "var(--chart-4)" },
    { label: "API Uptime",        value: 99.9,   unit: "%",       color: "var(--chart-4)" },
  ], [count, avgMs]);

  return (
    <div className="glass card reveal" style={{ borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ color: "var(--text)", marginBottom: "0.25rem" }}>Database Metrics</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Live performance counters</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span className="status-dot" />
          <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>Live</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            padding: "1rem", borderRadius: "var(--radius-md)",
            background: "var(--bg-card)", border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: m.color, fontFamily: "var(--font-display)", lineHeight: 1 }}>
              {m.value.toLocaleString()}<span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{m.unit}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.3rem" }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  useScrollReveal();

  // Pre-computed commit total — stable reference, not recalculated on re-render
  const commitTotal = TOTAL_COMMITS;

  return (
    <>
      <div className="bg-doodle" />
      <div
        className="animate-spin-slow"
        style={{
          position: "fixed", inset: "-50%", zIndex: -1, pointerEvents: "none",
          background: "radial-gradient(circle at 30% 40%, var(--grad-1) 0, transparent 40%), radial-gradient(circle at 70% 60%, var(--grad-2) 0, transparent 40%)",
          filter: "blur(60px)", opacity: 0.7,
        }}
      />
      <Header />

      <div className="page-wrapper">
        {/* Hero */}
        <div className="section-sm" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <span className="badge badge-accent reveal" style={{ marginBottom: "1rem", fontSize: "0.78rem" }}>
            📊 Public Dashboard
          </span>
          <h1 className="reveal" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>
            Open{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Kitchen
            </span>{" "}Dashboard
          </h1>
          <p className="reveal" style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
            A Filament-style public panel showing live metrics, skill breakdowns, GitHub activity, and a fully filterable project catalog.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <MetricCard icon="🚀" label="Projects Shipped" value={5} sub="↑ 2 this year" color="var(--chart-1)" />
            <MetricCard icon="⭐" label="GitHub Stars" value={12} sub="across all repos" color="var(--chart-2)" />
            <MetricCard icon="☕" label="Commits (year)" value={commitTotal} sub="and counting" color="var(--chart-3)" />
            <MetricCard icon="🧠" label="Skills Mastered" value={15} sub="5 categories" color="var(--chart-4)" />
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <SkillsBreakdown />
            <DbMetrics />
          </div>

          {/* GitHub Heatmap */}
          <div style={{ marginBottom: "1.5rem" }}>
            <GithubHeatmap />
          </div>

          {/* Projects Table */}
          <ProjectsTable />
        </div>

        <footer style={{ textAlign: "center", padding: "3rem var(--page-px)", borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <p style={{ color: "var(--muted)" }}>Crafted with <span style={{ color: "var(--accent)" }}>code ✧ tea ✧ curiosity</span></p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dash-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
