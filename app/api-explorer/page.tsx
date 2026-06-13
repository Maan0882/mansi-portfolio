"use client";

import { useState } from "react";
import Header from "../components/Header";
import JsonViewer from "../components/JsonViewer";
import { useScrollReveal } from "../components/useScrollReveal";
import {
  getProjects,
  getSkills,
  getAbout,
  postContact,
  ApiResponseMeta,
} from "../lib/mockApi";
import { PROJECTS, SKILLS, ABOUT } from "../lib/portfolioData";

// ─── Types ──────────────────────────────────────────────────────────────────
type EndpointId = "get-projects" | "get-skills" | "get-about" | "post-contact";

interface Endpoint {
  id: EndpointId;
  method: "GET" | "POST";
  path: string;
  description: string;
  typescript_type: string;
  color: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: "get-projects",
    method: "GET",
    path: "/api/projects",
    description: "Returns all portfolio projects as a paginated Laravel API Resource collection.",
    typescript_type: `interface ProjectResource {
  id: number;
  title: string;
  description: string;
  type: "experience" | "project";
  status: "live" | "completed" | "in-progress";
  tech_stack: string[];
  live_url?: string;
  completion_date: string;
  featured: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  links: { first: string; last: string; prev: null; next: null };
  meta: { current_page: number; total: number; per_page: number };
}`,
    color: "#10b981",
  },
  {
    id: "get-skills",
    method: "GET",
    path: "/api/skills",
    description: "Returns all skills with proficiency levels, categories, and years of experience.",
    typescript_type: `interface SkillResource {
  id: number;
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "language";
  proficiency: number; // 0-100
  years_experience: number;
}`,
    color: "#3b82f6",
  },
  {
    id: "get-about",
    method: "GET",
    path: "/api/about",
    description: "Returns full developer profile: name, bio, education, contact info, and availability status.",
    typescript_type: `interface AboutResource {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  education: { degree: string; institution: string; year: string }[];
  availability: "open" | "closed";
  location: string;
}`,
    color: "#8b5cf6",
  },
  {
    id: "post-contact",
    method: "POST",
    path: "/api/contact",
    description: "Queues a contact message via Laravel's job system. Returns 201 with queue confirmation.",
    typescript_type: `// Request body
interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// Response (201 Created)
interface ContactResponse {
  data: {
    message: string;
    queued_at: string; // ISO 8601
  };
}`,
    color: "#f59e0b",
  },
];

// ─── RenderedCard components ─────────────────────────────────────────────────
function ProjectsCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {PROJECTS.slice(0, 3).map((p) => (
        <div
          key={p.id}
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>{p.title}</span>
            <span className={`badge ${p.status === "live" ? "badge-success" : "badge-accent"}`}>{p.status}</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.6rem", lineHeight: 1.5 }}>
            {p.description.slice(0, 90)}…
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {p.tech_stack.slice(0, 3).map((t) => (
              <span key={t} className="badge" style={{ fontSize: "0.68rem" }}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {SKILLS.slice(0, 6).map((s) => (
        <div key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{s.name}</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{s.proficiency}%</span>
          </div>
          <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${s.proficiency}%`,
              background: "linear-gradient(90deg, var(--accent), var(--accent2))",
              borderRadius: "3px",
              animation: "bar-grow 1s ease forwards",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutCard() {
  return (
    <div style={{
      padding: "1.25rem",
      borderRadius: "var(--radius-md)",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{
          width: "56px", height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", fontWeight: 800, color: "#fff",
          flexShrink: 0,
        }}>
          MG
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{ABOUT.name}</div>
          <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{ABOUT.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
            <span className="status-dot" />
            <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>Available for opportunities</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {ABOUT.bio.slice(0, 150)}…
      </p>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {ABOUT.education.map((e) => (
          <span key={e.degree} className="badge badge-accent" style={{ fontSize: "0.68rem" }}>{e.degree}</span>
        ))}
        <span className="badge" style={{ fontSize: "0.68rem" }}>📍 {ABOUT.location}</span>
      </div>
    </div>
  );
}

function ContactCard() {
  return (
    <div style={{ padding: "1.25rem", borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✉️</div>
      <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.4rem" }}>Message Queued</div>
      <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        Your message has been dispatched via Laravel&apos;s job queue and will be delivered shortly.
      </div>
      <div style={{
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: "var(--radius-sm)",
        color: "#10b981",
        fontSize: "0.78rem",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
      }}>
        <span className="status-dot" /> 201 Created
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ApiExplorerPage() {
  useScrollReveal();
  const [active, setActive] = useState<EndpointId>("get-projects");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<object | null>(null);
  const [responseMeta, setResponseMeta] = useState<ApiResponseMeta | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const activeEndpoint = ENDPOINTS.find((e) => e.id === active)!;

  async function fireRequest(id: EndpointId) {
    setActive(id);
    setLoading(true);
    setResponseData(null);
    setResponseMeta(null);
    setHasFetched(false);

    let result: { response: object; meta: ApiResponseMeta };
    if (id === "get-projects") result = await getProjects();
    else if (id === "get-skills") result = await getSkills();
    else if (id === "get-about") result = await getAbout();
    else result = await postContact({ name: "Recruiter", email: "recruiter@example.com", message: "Impressive portfolio!" });

    setResponseData(result.response);
    setResponseMeta(result.meta);
    setLoading(false);
    setHasFetched(true);
  }

  const ep = ENDPOINTS.find((e) => e.id === active)!;

  return (
    <>
      <div className="bg-doodle" />
      <div
        className="animate-spin-slow"
        style={{
          position: "fixed", inset: "-50%", zIndex: -1, pointerEvents: "none",
          background: "radial-gradient(circle at 20% 30%, var(--grad-1) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--grad-2) 0, transparent 40%)",
          filter: "blur(60px)", opacity: 0.8,
        }}
      />
      <Header />

      <div className="page-wrapper">
        {/* Hero */}
        <div className="section-sm reveal" style={{ textAlign: "center", paddingBottom: "0" }}>
          <span className="badge badge-accent" style={{ marginBottom: "1rem", fontSize: "0.78rem" }}>
            🔌 Interactive API Explorer
          </span>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>
            Explore the{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Laravel API
            </span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto 2rem", fontSize: "1.05rem" }}>
            Click any endpoint below to make a live request. See real JSON responses structured exactly as Laravel API Resources + Sanctum would return them.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <span className="badge badge-success">✓ Sanctum Auth</span>
            <span className="badge badge-accent">✓ API Resources</span>
            <span className="badge">✓ Pagination Meta</span>
            <span className="badge">✓ Rate Limiting</span>
          </div>
        </div>

        {/* Main Explorer */}
        <div className="section" style={{ paddingTop: "2rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}>
            {/* Left — Endpoint List */}
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "sticky", top: "calc(var(--header-height) + 1rem)" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "0.5rem" }}>
                Available Endpoints
              </p>
              {ENDPOINTS.map((ep) => (
                <button
                  key={ep.id}
                  id={`endpoint-${ep.id}`}
                  onClick={() => fireRequest(ep.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${active === ep.id ? "var(--accent-soft)" : "var(--border)"}`,
                    background: active === ep.id ? "var(--accent-soft)" : "var(--bg-card)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-main)",
                  }}
                >
                  <span style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "var(--radius-sm)",
                    background: ep.color + "22",
                    color: ep.color,
                    fontFamily: "var(--font-code)",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                  }}>
                    {ep.method}
                  </span>
                  <span style={{
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-code)",
                    color: active === ep.id ? "var(--accent)" : "var(--text)",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {ep.path}
                  </span>
                </button>
              ))}

              {/* Auth info */}
              <div style={{
                marginTop: "1rem",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#10b981", marginBottom: "0.4rem" }}>
                  🔐 Sanctum Auth
                </p>
                <code style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-code)", wordBreak: "break-all", lineHeight: 1.5 }}>
                  Bearer eyJ0eXAiOiJK...
                </code>
              </div>
            </div>

            {/* Right — Response Panel */}
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Request bar */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
              }}>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  background: ep.color + "22",
                  color: ep.color,
                  fontFamily: "var(--font-code)",
                  letterSpacing: "0.05em",
                }}>
                  {ep.method}
                </span>
                <code style={{ flex: 1, fontSize: "0.88rem", color: "var(--text)", fontFamily: "var(--font-code)" }}>
                  https://portfolio.mansi.dev{ep.path}
                </code>
                <button
                  id="send-request-btn"
                  onClick={() => fireRequest(active)}
                  disabled={loading}
                  className="btn btn-primary btn-sm"
                >
                  {loading ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                  {loading ? "Sending…" : "Send"}
                </button>
              </div>

              {/* Response meta bar */}
              {responseMeta && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  flexWrap: "wrap",
                  animation: "slide-up 0.3s ease",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#10b981" }}>
                    <span className="status-dot" style={{ width: "6px", height: "6px" }} />
                    {responseMeta.status} {responseMeta.status_text}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-code)" }}>
                    ⚡ {responseMeta.execution_time_ms}ms
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-code)" }}>
                    Content-Type: application/json
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-code)" }}>
                    X-Powered-By: Laravel/11.x
                  </span>
                </div>
              )}

              {/* Two-column: rendered + json */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
                {/* Rendered UI */}
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "0.75rem" }}>
                    Rendered Output
                  </p>
                  {!hasFetched && !loading && (
                    <div style={{
                      padding: "3rem 1.5rem",
                      textAlign: "center",
                      borderRadius: "var(--radius-md)",
                      border: "1px dashed var(--border)",
                      color: "var(--muted2)",
                    }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔌</div>
                      <p style={{ fontSize: "0.82rem" }}>Press Send to fire a request</p>
                    </div>
                  )}
                  {loading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {[80, 65, 90].map((w, i) => (
                        <div key={i} style={{ height: "70px", borderRadius: "var(--radius-md)", opacity: 1 - i * 0.2 }} className="shimmer" />
                      ))}
                    </div>
                  )}
                  {hasFetched && !loading && (
                    <div style={{ animation: "slide-up 0.3s ease" }}>
                      {active === "get-projects" && <ProjectsCard />}
                      {active === "get-skills" && <SkillsCard />}
                      {active === "get-about" && <AboutCard />}
                      {active === "post-contact" && <ContactCard />}
                    </div>
                  )}
                </div>

                {/* JSON Response */}
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "0.75rem" }}>
                    Raw JSON Response
                  </p>
                  {!hasFetched && !loading && (
                    <div style={{
                      height: "200px",
                      borderRadius: "var(--radius-md)",
                      border: "1px dashed var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted2)",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-code)",
                    }}>
                      // response will appear here
                    </div>
                  )}
                  {loading && (
                    <div className="shimmer" style={{ height: "200px", borderRadius: "var(--radius-md)" }} />
                  )}
                  {hasFetched && responseData && !loading && (
                    <div style={{ animation: "slide-in-right 0.3s ease" }}>
                      <JsonViewer data={responseData as Parameters<typeof JsonViewer>[0]["data"]} maxHeight="380px" />
                    </div>
                  )}
                </div>
              </div>

              {/* TypeScript Interface */}
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "0.75rem" }}>
                  TypeScript Interface
                </p>
                <div className="code-block" style={{ fontSize: "0.78rem", lineHeight: 1.7 }}>
                  <pre style={{ margin: 0, color: "var(--code-string)", whiteSpace: "pre-wrap" }}>
                    {activeEndpoint.typescript_type}
                  </pre>
                </div>
              </div>

              {/* Response Headers */}
              {responseMeta && (
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "0.75rem" }}>
                    Response Headers
                  </p>
                  <div className="code-block" style={{ fontSize: "0.78rem", lineHeight: 1.9, animation: "slide-up 0.4s ease" }}>
                    {Object.entries(responseMeta.headers).map(([k, v]) => (
                      <div key={k}>
                        <span className="code-key">{k}</span>
                        <span style={{ color: "var(--code-bracket)" }}>: </span>
                        <span className="code-string">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Architecture note */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div
            className="reveal glass"
            style={{
              padding: "2rem 2.5rem",
              borderRadius: "var(--radius-lg)",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem" }}>⚙️</div>
            <div>
              <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Headless Architecture Pattern</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                In production, this Next.js frontend would call a real Laravel API via <code style={{ fontFamily: "var(--font-code)", color: "var(--accent)" }}>fetch()</code>.
                Laravel would authenticate via <strong>Sanctum bearer tokens</strong>, transform data through <strong>API Resources</strong>,
                and respond with the exact JSON structure shown above. The mock layer here is a drop-in
                replacement — swap one import and the frontend works with a real backend unchanged.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "3rem var(--page-px)", borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <p style={{ color: "var(--muted)" }}>Crafted with <span style={{ color: "var(--accent)" }}>code ✧ tea ✧ curiosity</span></p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .explorer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .response-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
