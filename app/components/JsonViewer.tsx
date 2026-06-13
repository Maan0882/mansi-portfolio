"use client";

import { useState, memo, useCallback } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// ─── JsonNode — memo so siblings don't re-render when one node collapses ─────
const JsonNode = memo(function JsonNode({ value, depth = 0 }: { value: JsonValue; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  if (value === null) return <span className="code-null">null</span>;
  if (typeof value === "boolean") return <span className="code-bool">{value ? "true" : "false"}</span>;
  if (typeof value === "number") return <span className="code-number">{value}</span>;
  if (typeof value === "string") return <span className="code-string">&quot;{value}&quot;</span>;

  const TOGGLE_BTN_STYLE: React.CSSProperties = {
    background: "none", border: "none", color: "var(--code-bracket)",
    cursor: "pointer", padding: "0 2px", fontSize: "inherit", fontFamily: "inherit",
    lineHeight: 1,
  };

  const COLLAPSED_BADGE_STYLE: React.CSSProperties = {
    color: "var(--code-null)", cursor: "pointer", padding: "0 4px",
    borderRadius: "3px", background: "var(--accent-soft)", fontSize: "0.78rem",
  };

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: "var(--code-bracket)" }}>[]</span>;
    return (
      <span>
        <button onClick={toggle} style={TOGGLE_BTN_STYLE}>{collapsed ? "▶" : "▼"}</button>
        <span style={{ color: "var(--code-bracket)" }}>[</span>
        {collapsed ? (
          <span style={COLLAPSED_BADGE_STYLE} onClick={toggle}>{value.length} items</span>
        ) : (
          <>
            <br />
            {value.map((item, i) => (
              <span key={i}>
                <span style={{ color: "var(--muted2)", userSelect: "none" }}>{"  ".repeat(depth + 1)}</span>
                <JsonNode value={item} depth={depth + 1} />
                {i < value.length - 1 && <span style={{ color: "var(--code-bracket)" }}>,</span>}
                <br />
              </span>
            ))}
            <span style={{ color: "var(--muted2)", userSelect: "none" }}>{"  ".repeat(depth)}</span>
          </>
        )}
        <span style={{ color: "var(--code-bracket)" }}>]</span>
      </span>
    );
  }

  // Object
  const entries = Object.entries(value as Record<string, JsonValue>);
  if (entries.length === 0) return <span style={{ color: "var(--code-bracket)" }}>{"{}"}</span>;

  return (
    <span>
      <button onClick={toggle} style={TOGGLE_BTN_STYLE}>{collapsed ? "▶" : "▼"}</button>
      <span style={{ color: "var(--code-bracket)" }}>{"{"}</span>
      {collapsed ? (
        <span style={COLLAPSED_BADGE_STYLE} onClick={toggle}>{entries.length} keys</span>
      ) : (
        <>
          <br />
          {entries.map(([k, v], i) => (
            <span key={k}>
              <span style={{ color: "var(--muted2)", userSelect: "none" }}>{"  ".repeat(depth + 1)}</span>
              <span className="code-key">&quot;{k}&quot;</span>
              <span style={{ color: "var(--code-bracket)" }}>: </span>
              <JsonNode value={v} depth={depth + 1} />
              {i < entries.length - 1 && <span style={{ color: "var(--code-bracket)" }}>,</span>}
              <br />
            </span>
          ))}
          <span style={{ color: "var(--muted2)", userSelect: "none" }}>{"  ".repeat(depth)}</span>
        </>
      )}
      <span style={{ color: "var(--code-bracket)" }}>{"}"}</span>
    </span>
  );
});

interface JsonViewerProps {
  data: JsonValue;
  maxHeight?: string;
}

export default memo(function JsonViewer({ data, maxHeight = "480px" }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      {/* Copy button */}
      <button
        onClick={copy}
        style={{
          position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 2,
          background: copied ? "var(--accent-soft)" : "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
          color: copied ? "var(--accent)" : "var(--muted)",
          padding: "0.3rem 0.65rem", fontSize: "0.72rem", fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem",
          transition: "all 0.2s ease", fontFamily: "var(--font-main)",
        }}
      >
        {copied ? (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
        ) : (
          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
        )}
      </button>

      {/* JSON Tree */}
      <div
        className="code-block"
        style={{ maxHeight, overflowY: "auto", fontSize: "0.8rem", lineHeight: 1.8, paddingTop: "2.5rem" }}
      >
        <JsonNode value={data} depth={0} />
      </div>
    </div>
  );
});
