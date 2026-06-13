"use client";

import { useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ContactForm from "./components/ContactForm";
import { useScrollReveal } from "./components/useScrollReveal";

/* ─── Shared Styles ─── */
const cardStyle: React.CSSProperties = {
  padding: "2rem",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
  display: "flex",
  flexDirection: "column",
  transition: "all var(--transition)",
};

const tagStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  padding: "0.28rem 0.75rem",
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "50px",
  color: "var(--muted)",
};

/* ─── Section Title ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="reveal"
      style={{
        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        marginBottom: "3rem",
        textAlign: "center",
        fontWeight: 800,
        fontFamily: "var(--font-display)",
      }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>
        <span
          style={{
            position: "absolute",
            bottom: 2,
            left: -5,
            right: -5,
            height: 8,
            background: "var(--accent-soft)",
            zIndex: -1,
            borderRadius: 4,
            display: "block",
          }}
        />
        {children}
      </span>
    </h2>
  );
}

/* ─── Card Component ─── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`reveal glass ${className}`}
      style={cardStyle}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-8px)";
        el.style.boxShadow = "var(--shadow-hover)";
        el.style.borderColor = "var(--accent-soft)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {children}
    </div>
  );
}

/* ─── Services Data ─── */
const SERVICES = [
  {
    icon: "⚡",
    title: "Full-Stack Web Development",
    description: "End-to-end development of modern web applications using Next.js, Laravel, React, and TypeScript — from concept to deployment.",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))",
    accent: "#8b5cf6",
  },
  {
    icon: "🗄️",
    title: "Database Management",
    description: "Schema design, normalisation (3NF), query optimisation, and robust data architecture using MySQL, SQL Server, and PostgreSQL.",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.1))",
    accent: "#3b82f6",
  },
  {
    icon: "📝",
    title: "Code Documentation & Maintenance",
    description: "Clean, well-documented codebases with comprehensive technical documentation, code reviews, and long-term maintainability.",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(56,189,248,0.08))",
    accent: "#10b981",
  },
  {
    icon: "🔧",
    title: "Software Debugging & Troubleshooting",
    description: "Systematic debugging, performance profiling, and proactive issue resolution to keep applications running smoothly.",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))",
    accent: "#f59e0b",
  },
  {
    icon: "🔌",
    title: "API Development & Integration",
    description: "RESTful API design, third-party integrations, Sanctum authentication, and middleware-based authorization (CSRF/RBAC).",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.08))",
    accent: "#ec4899",
  },
];

/* ─── Projects Data ─── */
const PROJECTS = [
  {
    title: "TechStrota — IAPES Admin System",
    description:
      "A robust multi-module internal administrative system featuring expressive routing, secure authentication, Eloquent ORM, and Blade templating. Deployed live on VPS with Apache.",
    tags: ["Laravel", "PHP", "MySQL", "Blade", "VPS"],
    href: "https://techstrota.tech/",
    badge: "Experience",
    badgeClass: "badge-accent",
  },
  {
    title: "SSM Future Innovation FZE",
    description:
      "Corporate web application built for a UAE-based client. Modern Next.js architecture with TypeScript, server-side rendering, and deployed on Vercel for global performance.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    href: "https://ssmfutureinnovationfze.com/",
    badge: "Experience",
    badgeClass: "badge-accent",
  },
  {
    title: "Pearl Logistics",
    description:
      "Professional logistics and supply chain interface with clean responsive design, intuitive navigation, and optimised performance for the transportation industry.",
    tags: ["Next.js", "Tailwind CSS", "Vercel"],
    href: "https://pearllogisctics.in/",
    badge: "Project",
    badgeClass: "",
  },
];

/* ─── Skills Data ─── */
const SKILL_CATEGORIES = [
  {
    title: "Core",
    icon: "💎",
    tags: ["PHP", "Laravel", "MySQL", "TypeScript", "JavaScript", "Git"],
    accent: "#8b5cf6",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.03))",
  },
  {
    title: "Frontend",
    icon: "🎨",
    tags: ["Next.js", "React", "Tailwind CSS", "jQuery", "HTML5", "SCSS"],
    accent: "#ec4899",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(236,72,153,0.03))",
  },
  {
    title: "Backend & APIs",
    icon: "⚙️",
    tags: ["RESTful APIs", "Eloquent ORM", "Middleware Auth", "CSRF/RBAC", "ASP.NET", "C#"],
    accent: "#3b82f6",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))",
  },
  {
    title: "Databases",
    icon: "🗃️",
    tags: ["MySQL", "SQL Server", "Schema Normalisation (3NF)", "Query Optimisation", "PostgreSQL"],
    accent: "#06b6d4",
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.03))",
  },
  {
    title: "DevOps",
    icon: "🚀",
    tags: ["VPS Deployment", "Apache", "Vercel", "Git", "GitHub Actions", "Docker"],
    accent: "#f59e0b",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))",
  },
  {
    title: "AI Dev Tools",
    icon: "🤖",
    tags: ["GitHub Copilot", "ChatGPT", "Code Review", "Architectural Oversight"],
    accent: "#10b981",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.03))",
  },
];

const PROFICIENCY_BARS = [
  { name: "Frontend (Next.js / React / HTML / CSS)", level: 90, color: "var(--chart-1)" },
  { name: "Backend (PHP / Laravel / ASP.NET)", level: 88, color: "var(--chart-2)" },
  { name: "Databases (MySQL / SQL Server)", level: 85, color: "var(--chart-3)" },
  { name: "TypeScript / JavaScript", level: 87, color: "var(--chart-4)" },
  { name: "DevOps & Tools (Git / VPS / Docker)", level: 80, color: "var(--chart-5)" },
];

/* ─── Main Page ─── */
export default function Home() {
  useScrollReveal();

  useEffect(() => {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }, []);

  return (
    <>
      <div className="bg-doodle" />
      <div
        className="animate-spin-slow"
        style={{
          position: "fixed",
          inset: "-50%",
          zIndex: -1,
          background:
            "radial-gradient(circle at 20% 30%, var(--grad-1) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--grad-2) 0, transparent 40%), radial-gradient(circle at 50% 50%, var(--grad-1) 0, transparent 60%)",
          pointerEvents: "none",
          filter: "blur(60px)",
          opacity: 0.8,
        }}
      />

      <Header />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "5rem var(--page-px)" }}>
        <SectionTitle>About Me</SectionTitle>
        <div className="reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            className="glass"
            style={{
              padding: "2.5rem",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-sm)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative accent stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, var(--accent), var(--accent2), #38bdf8)",
                borderRadius: "4px 4px 0 0",
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>👋</span>
              <div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "var(--text)",
                    fontFamily: "var(--font-display)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Hi, I&apos;m Mansi Gajjar
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                  }}
                >
                  A dedicated <strong style={{ color: "var(--text)" }}>Software Developer</strong> with a passion
                  for building clean, efficient, and scalable full-stack applications. With an{" "}
                  <strong style={{ color: "var(--accent)" }}>M.Sc. in Information Technology</strong> and hands-on
                  experience in full-stack development, I specialise in turning complex requirements into seamless
                  digital experiences.
                </p>
              </div>
            </div>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.8,
                fontSize: "0.95rem",
                paddingLeft: "4rem",
              }}
            >
              Whether I&apos;m architecting internal administrative systems or optimising backend databases, I focus on
              writing maintainable code and solving technical challenges through proactive collaboration. I thrive in{" "}
              <strong style={{ color: "var(--text)" }}>agile environments</strong> and am always eager to leverage
              my skills in <span style={{ color: "var(--accent)", fontWeight: 600 }}>Next.js</span>,{" "}
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>Laravel</span>, and beyond to drive innovation.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "5rem var(--page-px)", background: "var(--bg-alt)" }}>
        <SectionTitle>Services</SectionTitle>
        <p
          className="reveal"
          style={{
            textAlign: "center",
            color: "var(--muted)",
            maxWidth: "600px",
            margin: "-2rem auto 3rem",
            fontSize: "1rem",
          }}
        >
          Turning ideas into production-ready software with expertise across the full development lifecycle.
        </p>
        <div
          className="services-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1.25rem",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                borderRadius: "var(--radius-xl)",
                background: s.gradient,
                border: `1px solid ${s.accent}33`,
                transition: "all 0.3s ease",
                animationDelay: `${i * 0.08}s`,
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-8px) scale(1.02)";
                el.style.boxShadow = `0 20px 40px ${s.accent}33`;
                el.style.borderColor = s.accent + "88";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = "none";
                el.style.borderColor = s.accent + "33";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "1.6rem",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-md)",
                    background: `${s.accent}15`,
                    border: `1px solid ${s.accent}30`,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </span>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    fontFamily: "var(--font-display)",
                    lineHeight: 1.25,
                  }}
                >
                  {s.title}
                </h3>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.65, flex: 1 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "5rem var(--page-px)" }}>
        <SectionTitle>Skills &amp; Toolbox</SectionTitle>

        {/* Proficiency Graph */}
        <div style={{ marginBottom: "3rem", maxWidth: "900px", margin: "0 auto 3rem" }}>
          <Card>
            <h3 style={{ marginBottom: "2rem", color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Proficiency Overview
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              {PROFICIENCY_BARS.map((skill) => (
                <div key={skill.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.6rem",
                      fontSize: "0.9rem",
                      color: "var(--text)",
                      fontWeight: 500,
                    }}
                  >
                    <span>{skill.name}</span>
                    <span style={{ color: skill.color, fontWeight: 700, fontFamily: "var(--font-code)" }}>
                      {skill.level}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "12px",
                      background: "var(--border)",
                      borderRadius: "6px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${skill.level}%`,
                        height: "100%",
                        background: skill.color,
                        borderRadius: "6px",
                        transition: "width 1.2s ease-in-out",
                        boxShadow: `0 0 16px ${skill.color}55, 0 2px 4px ${skill.color}33`,
                        position: "relative",
                      }}
                    >
                      {/* Shine effect on the bar */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "50%",
                          background: "linear-gradient(180deg, rgba(255,255,255,0.25), transparent)",
                          borderRadius: "6px 6px 0 0",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skill Category Cards */}
        <div
          className="skills-grid"
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(3, 1fr)",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {SKILL_CATEGORIES.map(({ title, icon, tags, accent, gradient }) => (
            <div
              key={title}
              className="reveal"
              style={{
                padding: "1.75rem",
                borderRadius: "var(--radius-xl)",
                background: gradient,
                border: `1px solid ${accent}25`,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px) scale(1.01)";
                el.style.boxShadow = `0 20px 50px ${accent}30`;
                el.style.borderColor = accent + "55";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = "none";
                el.style.borderColor = accent + "25";
              }}
            >
              {/* Top accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${accent}, ${accent}66)`,
                  borderRadius: "3px 3px 0 0",
                }}
              />
              {/* Header with icon and title */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    fontSize: "1.4rem",
                    width: "42px",
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-md)",
                    background: `${accent}12`,
                    border: `1px solid ${accent}25`,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </span>
                <h3
                  style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                  }}
                >
                  {title}
                </h3>
              </div>
              {/* Skill tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.78rem",
                      padding: "0.3rem 0.75rem",
                      background: `${accent}0a`,
                      border: `1px solid ${accent}20`,
                      borderRadius: "50px",
                      color: "var(--muted)",
                      transition: "all 0.2s ease",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "5rem var(--page-px)", background: "var(--bg-alt)" }}>
        <SectionTitle>Experience &amp; Projects</SectionTitle>
        <p
          className="reveal"
          style={{
            textAlign: "center",
            color: "var(--muted)",
            maxWidth: "600px",
            margin: "-2rem auto 3rem",
            fontSize: "1rem",
          }}
        >
          Real-world applications built with modern frameworks — deployed, maintained, and serving users in production.
        </p>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <Card key={p.title}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h3 style={{ color: "var(--text)", margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem" }}>
                  {p.title}
                </h3>
                <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
              </div>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9rem", flex: 1 }}>{p.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto", paddingTop: "1.25rem" }}>
                {p.tags.map((t) => (
                  <span key={t} style={tagStyle}>
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: "1.5rem",
                  color: "var(--accent)",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.gap = "0.7rem";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.gap = "0.4rem";
                }}
              >
                Visit Live Site
                <span>→</span>
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "5rem var(--page-px)" }}>
        <SectionTitle>Get In Touch</SectionTitle>
        <div
          className="reveal glass contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "3rem",
            borderRadius: "var(--radius-lg)",
            padding: "3rem",
            boxShadow: "var(--shadow-md)",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Let&apos;s Connect
            </h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Whether it&apos;s a collaboration opportunity, a project idea, or just a tech conversation — I&apos;d love to hear from you.
              Replies will be prompt and professional.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  ),
                  content: "gajjarmansi2808@gmail.com",
                  href: "mailto:gajjarmansi2808@gmail.com",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ),
                  content: "maan_0882",
                  href: "https://instagram.com/maan_0882",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                  content: "linkedin.com/in/2808-mansi-gajjar",
                  href: "https://www.linkedin.com/in/2808-mansi-gajjar",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>
                  ),
                  content: "github.com/Maan0882",
                  href: "https://github.com/Maan0882",
                },
              ].map(({ icon, content, href }) => (
                <a
                  key={content}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                    color: "var(--muted)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    transition: "all 0.2s ease",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "var(--bg-card)";
                    el.style.borderColor = "var(--border)";
                    el.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent";
                    el.style.borderColor = "transparent";
                    el.style.color = "var(--muted)";
                  }}
                >
                  <span style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}>{icon}</span>
                  {content}
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          textAlign: "center",
          padding: "3rem var(--page-px)",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-alt)",
          marginTop: "4rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {["About", "Services", "Skills", "Projects", "Contact"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              style={{ color: "var(--muted)", fontSize: "0.82rem", textDecoration: "none", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
            >
              {s}
            </a>
          ))}
        </div>
        <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
          Crafted with <span style={{ color: "var(--accent)" }}>code ✧ tea ✧ curiosity</span>
        </p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8, color: "var(--muted)" }}>
          © <span id="year" /> Mansi Gajjar — &quot;Debug the present | Design the future&quot;
        </p>
      </footer>

      <style>{`
        .services-row {
          grid-template-columns: repeat(5, 1fr) !important;
        }
        .projects-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 1200px) {
          .services-row { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 1024px) {
          .projects-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .services-row { grid-template-columns: repeat(2, 1fr) !important; }
          .contact-grid { grid-template-columns: 1fr !important; padding: 1.5rem !important; }
        }
        @media (max-width: 640px) {
          .services-row { grid-template-columns: 1fr !important; }
          .projects-grid { grid-template-columns: 1fr; }
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
