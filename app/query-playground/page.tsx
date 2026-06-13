"use client";

import { useState, useMemo, memo, useCallback } from "react";
import Header from "../components/Header";
import { useScrollReveal } from "../components/useScrollReveal";
import { SQL_QUERIES, SqlQuery } from "../lib/mockApi";

// ─────────────────────────────────────────────────────────────────────────────
// Pre-built token regex — built ONCE at module level, not per render
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORDS = [
  "GROUP_CONCAT", "GROUP BY", "ORDER BY", "SELECT", "FROM", "WHERE", "INNER",
  "LEFT", "RIGHT", "JOIN", "LIMIT", "AND", "OR", "AS", "ROUND", "COUNT",
  "MAX", "AVG", "SEPARATOR", "ASC", "DESC", "ON",
];

// Single-pass tokenizer: returns array of { text, type } tokens per line
type TokenType = "keyword" | "string" | "number" | "comment" | "word" | "other";
interface Token { text: string; type: TokenType }

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const upper = line.toUpperCase();

  while (i < line.length) {
    // Comment
    if (line[i] === "-" && line[i + 1] === "-") {
      tokens.push({ text: line.slice(i), type: "comment" });
      break;
    }

    // String literal
    if (line[i] === "'") {
      let j = i + 1;
      while (j < line.length && line[j] !== "'") j++;
      tokens.push({ text: line.slice(i, j + 1), type: "string" });
      i = j + 1;
      continue;
    }

    // SQL Keywords (longest match first — already sorted by length desc above)
    let matchedKw = false;
    for (const kw of KEYWORDS) {
      if (upper.startsWith(kw, i)) {
        // Only match whole word
        const after = line[i + kw.length];
        if (!after || /[^a-zA-Z0-9_]/.test(after)) {
          tokens.push({ text: line.slice(i, i + kw.length), type: "keyword" });
          i += kw.length;
          matchedKw = true;
          break;
        }
      }
    }
    if (matchedKw) continue;

    // Number
    const numM = line.slice(i).match(/^(\d+\.?\d*)/);
    if (numM) {
      tokens.push({ text: numM[1], type: "number" });
      i += numM[1].length;
      continue;
    }

    // Identifier
    const wordM = line.slice(i).match(/^([a-zA-Z_][a-zA-Z0-9_.]*)/);
    if (wordM) {
      tokens.push({ text: wordM[1], type: "word" });
      i += wordM[1].length;
      continue;
    }

    // Single char
    tokens.push({ text: line[i], type: "other" });
    i++;
  }
  return tokens;
}

// Pre-compute highlighted lines for a SQL string — memoized per SQL string
function highlightSql(sql: string): Token[][] {
  return sql.split("\n").map(tokenizeLine);
}

// ─────────────────────────────────────────────────────────────────────────────
// SqlHighlight — useMemo so parsing only runs when `sql` prop changes
// ─────────────────────────────────────────────────────────────────────────────
const TOKEN_STYLES: Record<TokenType, React.CSSProperties> = {
  keyword: { color: "#ff79c6", fontWeight: 600 },
  string:  { color: "var(--code-string)" },
  number:  { color: "var(--code-number)" },
  comment: { color: "var(--code-null)" },
  word:    { color: "var(--code-bracket)" },
  other:   { color: "var(--muted2)" },
};

const SqlHighlight = memo(function SqlHighlight({ sql }: { sql: string }) {
  // Recalculates only when sql changes — not on parent re-renders
  const lines = useMemo(() => highlightSql(sql), [sql]);

  return (
    <div style={{ fontFamily: "var(--font-code)", fontSize: "0.85rem", lineHeight: 1.8 }}>
      {lines.map((tokens, li) => (
        <div key={li} style={{ display: "flex", gap: "1rem" }}>
          <span style={{ color: "var(--muted2)", userSelect: "none", minWidth: "20px", textAlign: "right", opacity: 0.5 }}>
            {li + 1}
          </span>
          <span>
            {tokens.map((tok, ti) => (
              <span key={ti} style={TOKEN_STYLES[tok.type]}>
                {tok.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ResultsTable — memo so it only re-renders when columns/rows change
// ─────────────────────────────────────────────────────────────────────────────
const ResultsTable = memo(function ResultsTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Record<string, string | number | null>[];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", fontFamily: "var(--font-code)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  padding: "0.6rem 0.9rem",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "var(--accent)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid var(--border)",
                animation: `slide-up 0.3s ease ${i * 0.04}s both`,
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              {columns.map((col) => {
                const val = row[col];
                return (
                  <td key={col} style={{ padding: "0.55rem 0.9rem" }}>
                    {val === null ? (
                      <span className="code-null">NULL</span>
                    ) : typeof val === "number" ? (
                      <span className="code-number">{val}</span>
                    ) : String(val).startsWith("http") ? (
                      <a href={String(val)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--code-string)", textDecoration: "underline" }}>
                        {String(val).slice(0, 40)}…
                      </a>
                    ) : (
                      <span className="code-string">{String(val)}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// QueryButton — memo to avoid re-rendering idle buttons when active changes
// ─────────────────────────────────────────────────────────────────────────────
const QueryButton = memo(function QueryButton({
  query, isActive, isRunning, onClick,
}: {
  query: SqlQuery; isActive: boolean; isRunning: boolean; onClick: () => void;
}) {
  return (
    <button
      id={`query-${query.id}`}
      onClick={onClick}
      style={{
        padding: "0.6rem 1.25rem",
        borderRadius: "var(--radius-pill)",
        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
        background: isActive ? "var(--accent-soft)" : "var(--bg-card)",
        color: isActive ? "var(--accent)" : "var(--text)",
        cursor: "pointer",
        fontSize: "0.82rem",
        fontFamily: "var(--font-code)",
        fontWeight: 500,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {isRunning && isActive ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-sql 0.8s linear infinite" }}>
          <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      )}
      {query.label}
    </button>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Database Schema — static, wrap in memo so it never re-renders
// ─────────────────────────────────────────────────────────────────────────────
const SCHEMA_TABLES = [
  {
    table: "projects",
    columns: [
      { name: "id", type: "BIGINT UNSIGNED", key: "PK" },
      { name: "title", type: "VARCHAR(255)", key: "" },
      { name: "type", type: "ENUM('experience','project')", key: "" },
      { name: "status", type: "ENUM('live','completed','in-progress')", key: "" },
      { name: "featured", type: "TINYINT(1)", key: "IDX" },
      { name: "completion_date", type: "DATE", key: "IDX" },
    ],
  },
  {
    table: "skills",
    columns: [
      { name: "id", type: "BIGINT UNSIGNED", key: "PK" },
      { name: "name", type: "VARCHAR(100)", key: "" },
      { name: "category", type: "ENUM('frontend','backend',...)", key: "IDX" },
      { name: "proficiency", type: "TINYINT UNSIGNED", key: "" },
      { name: "years_experience", type: "TINYINT UNSIGNED", key: "" },
    ],
  },
  {
    table: "project_skills",
    columns: [
      { name: "id", type: "BIGINT UNSIGNED", key: "PK" },
      { name: "project_id", type: "BIGINT UNSIGNED", key: "FK+IDX" },
      { name: "skill_id", type: "BIGINT UNSIGNED", key: "FK+IDX" },
    ],
  },
];

const DbSchema = memo(function DbSchema() {
  return (
    <div className="reveal" style={{ marginTop: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", color: "var(--text)", fontWeight: 700, marginBottom: "0.4rem" }}>Database Schema</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>The MySQL schema these queries run against</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {SCHEMA_TABLES.map(({ table, columns }) => (
          <div
            key={table}
            className="glass"
            style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}
          >
            <div style={{
              padding: "0.75rem 1rem",
              background: "var(--accent-soft)",
              borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span style={{ fontSize: "0.9rem" }}>🗄️</span>
              <span style={{ fontFamily: "var(--font-code)", fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>
                {table}
              </span>
            </div>
            <div style={{ padding: "0.75rem" }}>
              {columns.map((col) => (
                <div key={col.name} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "0.35rem 0.5rem", borderRadius: "var(--radius-sm)",
                  fontSize: "0.78rem", fontFamily: "var(--font-code)", gap: "0.5rem",
                }}>
                  <span className="code-key">{col.name}</span>
                  <span style={{ color: "var(--muted2)", fontSize: "0.72rem" }}>{col.type}</span>
                  {col.key && (
                    <span style={{
                      fontSize: "0.6rem", padding: "0.1rem 0.35rem",
                      background: col.key.includes("PK") ? "rgba(16,185,129,0.15)" : "var(--accent-soft)",
                      color: col.key.includes("PK") ? "#10b981" : "var(--accent)",
                      borderRadius: "3px", fontWeight: 700, letterSpacing: "0.04em", flexShrink: 0,
                    }}>
                      {col.key}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function QueryPlaygroundPage() {
  useScrollReveal();
  const [activeQuery, setActiveQuery] = useState<SqlQuery>(SQL_QUERIES[0]);
  const [running, setRunning] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, string | number | null>[] | null>(null);
  const [hasRun, setHasRun] = useState(false);

  // Stable callback — doesn't recreate on each render
  const runQuery = useCallback(async (q: SqlQuery) => {
    setActiveQuery(q);
    setRunning(true);
    setResults(null);
    setExecTime(null);
    setHasRun(false);

    const ms = Math.floor(Math.random() * 40 + 4);
    await new Promise((r) => setTimeout(r, ms + 300));

    setResults(q.resultGenerator());
    setExecTime(ms);
    setRunning(false);
    setHasRun(true);
  }, []);

  // Pre-compute results so ResultsTable doesn't re-run resultGenerator on re-renders
  const stableResults = useMemo(() => results, [results]);

  return (
    <>
      <div className="bg-doodle" />
      <div
        className="animate-spin-slow"
        style={{
          position: "fixed", inset: "-50%", zIndex: -1, pointerEvents: "none",
          background: "radial-gradient(circle at 15% 50%, var(--grad-1) 0, transparent 40%), radial-gradient(circle at 85% 50%, var(--grad-2) 0, transparent 40%)",
          filter: "blur(60px)", opacity: 0.7,
        }}
      />
      <Header />

      <div className="page-wrapper">
        {/* Hero */}
        <div className="section-sm" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <span className="badge badge-accent reveal" style={{ marginBottom: "1rem", fontSize: "0.78rem" }}>
            🗄️ SQL Query Playground
          </span>
          <h1 className="reveal" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>
            Live{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Database
            </span>{" "}Explorer
          </h1>
          <p className="reveal" style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
            Click a query to run it against the portfolio database schema. See real SQL, execution time, and query optimization hints.
          </p>
        </div>

        <div className="section" style={{ paddingTop: "1rem" }}>
          {/* Query Buttons */}
          <div className="reveal" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            {SQL_QUERIES.map((q) => (
              <QueryButton
                key={q.id}
                query={q}
                isActive={activeQuery.id === q.id}
                isRunning={running}
                onClick={() => runQuery(q)}
              />
            ))}
          </div>

          {/* Main Panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            {/* SQL Editor */}
            <div className="reveal">
              <div style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderBottom: "none",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted2)" }}>
                  SQL Query
                </span>
                <span className="badge" style={{ fontSize: "0.65rem", marginLeft: "auto" }}>MySQL 8.0</span>
                <span className="badge badge-accent" style={{ fontSize: "0.65rem" }}>portfolio_db</span>
              </div>
              <div className="code-block" style={{
                borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                fontSize: "0.85rem", lineHeight: 1.8, minHeight: "220px",
              }}>
                {/* SqlHighlight only re-renders when activeQuery.sql changes */}
                <SqlHighlight sql={activeQuery.sql} />
              </div>

              {/* Description + hint */}
              <div style={{
                marginTop: "1rem", padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)",
              }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 500, marginBottom: "0.4rem" }}>
                  {activeQuery.description}
                </p>
                <div style={{
                  padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)",
                  background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)",
                  fontSize: "0.78rem", color: "#fbbf24", lineHeight: 1.6, marginTop: "0.75rem",
                  display: "flex", gap: "0.5rem",
                }}>
                  <span>⚡</span>
                  <span><strong>Optimization:</strong> {activeQuery.optimization_hint}</span>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="reveal">
              <div style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderBottom: "none",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted2)" }}>
                  Results
                </span>
                {hasRun && stableResults && (
                  <>
                    <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span className="status-dot" style={{ width: "6px", height: "6px" }} />
                      <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>
                        {stableResults.length} rows
                      </span>
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-code)", fontWeight: 500 }}>
                      ⚡ {execTime}ms
                    </span>
                  </>
                )}
              </div>

              <div
                className="code-block"
                style={{
                  borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  padding: "0",
                  minHeight: "220px",
                  display: "flex", flexDirection: "column",
                  justifyContent: running || !hasRun ? "center" : "flex-start",
                  alignItems: running || !hasRun ? "center" : "stretch",
                }}
              >
                {!hasRun && !running && (
                  <div style={{ textAlign: "center", color: "var(--muted2)", padding: "2rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗄️</div>
                    <p style={{ fontSize: "0.82rem" }}>Click a query button to run it</p>
                  </div>
                )}
                {running && (
                  <div style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ animation: "spin-sql 1s linear infinite", margin: "0 auto", display: "block" }}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: "0.82rem", fontFamily: "var(--font-code)" }}>Executing query…</p>
                  </div>
                )}
                {hasRun && stableResults && !running && (
                  <div style={{ padding: "1rem", animation: "slide-up 0.3s ease" }}>
                    <ResultsTable columns={activeQuery.columns} rows={stableResults} />
                  </div>
                )}
              </div>

              {/* EXPLAIN output */}
              {hasRun && execTime !== null && (
                <div style={{
                  marginTop: "1rem", padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-md)", background: "var(--bg-code)",
                  border: "1px solid var(--border)", animation: "slide-up 0.4s ease",
                }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "0.75rem" }}>
                    EXPLAIN Output (simulated)
                  </p>
                  <div style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", lineHeight: 1.9 }}>
                    <div><span className="code-key">type</span>: <span className="code-string">ref</span></div>
                    <div><span className="code-key">possible_keys</span>: <span className="code-string">PRIMARY, idx_completion_date</span></div>
                    <div><span className="code-key">key</span>: <span className="code-string">idx_completion_date</span></div>
                    <div><span className="code-key">rows</span>: <span className="code-number">5</span></div>
                    <div><span className="code-key">filtered</span>: <span className="code-number">100.00</span></div>
                    <div><span className="code-key">Extra</span>: <span className="code-string">Using index</span></div>
                    <div style={{ marginTop: "0.4rem", color: "#10b981" }}>
                      ✓ Query time: <span style={{ fontWeight: 700 }}>{execTime}ms</span> · No full table scan
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Static DB Schema — memoized, never re-renders */}
          <DbSchema />
        </div>

        <footer style={{ textAlign: "center", padding: "3rem var(--page-px)", borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <p style={{ color: "var(--muted)" }}>Crafted with <span style={{ color: "var(--accent)" }}>code ✧ tea ✧ curiosity</span></p>
        </footer>
      </div>

      <style>{`
        @keyframes spin-sql {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .sql-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
