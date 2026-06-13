"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { useScrollReveal } from "../components/useScrollReveal";

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  emoji: string;
  isNew?: boolean;
}

const SEED_MESSAGES: GuestMessage[] = [
  {
    id: "seed-1",
    name: "Sarah Chen",
    message: "Really impressive architecture showcase! The API Explorer page is brilliant for demonstrating backend skills to recruiters. Would love to connect.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    emoji: "🎉",
  },
  {
    id: "seed-2",
    name: "Arjun Mehta",
    message: "The SQL Query Playground is such a creative idea. Instantly shows you understand query optimization — most devs just talk about it.",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    emoji: "🚀",
  },
  {
    id: "seed-3",
    name: "Maria Gonzalez",
    message: "Love the Laravel Coral theme! The attention to detail here is what separates good devs from great ones. Bookmarked!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    emoji: "💜",
  },
];

const EMOJIS = ["👋", "🎉", "🚀", "💜", "⭐", "🔥", "✨", "💡", "🎯", "🙌"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function MessageCard({ msg, isNew }: { msg: GuestMessage; isNew?: boolean }) {
  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-card)",
        border: `1px solid ${isNew ? "var(--accent)" : "var(--border)"}`,
        boxShadow: isNew ? "var(--shadow-hover)" : "var(--shadow-sm)",
        animation: isNew ? "toast-in 0.4s cubic-bezier(0.16,1,0.3,1)" : "slide-up 0.5s ease",
        backdropFilter: "blur(10px)",
        transition: "border-color 1s ease, box-shadow 1s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
            flexShrink: 0,
          }}>
            {msg.emoji}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>{msg.name}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted2)" }}>{timeAgo(msg.timestamp)}</div>
          </div>
        </div>
        {isNew && (
          <span className="badge badge-accent" style={{ fontSize: "0.65rem", animation: "pulse-glow 2s ease infinite" }}>
            ✨ New
          </span>
        )}
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7 }}>{msg.message}</p>
    </div>
  );
}

export default function GuestbookPage() {
  useScrollReveal();
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const feedRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("guestbook-messages");
    const parsed: GuestMessage[] = stored ? JSON.parse(stored) : [];
    setMessages([...SEED_MESSAGES, ...parsed]);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newMsg: GuestMessage = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      emoji: selectedEmoji,
    };

    setMessages((prev) => [newMsg, ...prev]);
    setNewIds((prev) => new Set([...prev, newMsg.id]));

    // Persist
    const stored = localStorage.getItem("guestbook-messages");
    const existing: GuestMessage[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem("guestbook-messages", JSON.stringify([newMsg, ...existing]));

    setName("");
    setMessage("");
    setSelectedEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setSubmitting(false);
    showToast("Your message appeared in the feed! 🎉");

    // Remove "new" highlight after 5s
    setTimeout(() => {
      setNewIds((prev) => { const n = new Set(prev); n.delete(newMsg.id); return n; });
    }, 5000);

    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const totalMessages = messages.length;

  return (
    <>
      <div className="bg-doodle" />
      <div
        className="animate-spin-slow"
        style={{
          position: "fixed", inset: "-50%", zIndex: -1, pointerEvents: "none",
          background: "radial-gradient(circle at 25% 35%, var(--grad-1) 0, transparent 40%), radial-gradient(circle at 75% 65%, var(--grad-2) 0, transparent 40%)",
          filter: "blur(60px)", opacity: 0.7,
        }}
      />
      <Header />

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
            padding: "0.85rem 1.5rem",
            borderRadius: "var(--radius-pill)",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "var(--shadow-glow)",
            animation: "toast-in 0.4s cubic-bezier(0.16,1,0.3,1)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}

      <div className="page-wrapper">
        {/* Hero */}
        <div className="section-sm" style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <span className="badge badge-success reveal" style={{ marginBottom: "1rem", fontSize: "0.78rem" }}>
            <span className="status-dot" style={{ width: "6px", height: "6px" }} /> Real-time Guestbook
          </span>
          <h1 className="reveal" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>
            Leave a{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Message
            </span>
          </h1>
          <p className="reveal" style={{ color: "var(--muted)", maxWidth: "560px", margin: "0 auto 1rem", fontSize: "1.05rem" }}>
            Drop a note — it appears instantly in the feed below. Demonstrates the WebSocket / Laravel Reverb pattern for real-time updates.
          </p>

          {/* WebSocket indicator */}
          <div className="reveal" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-pill)",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.25)",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}>
            <span className="status-dot" />
            <span style={{ color: "#10b981" }}>WebSocket Connected</span>
            <span style={{ color: "var(--muted2)" }}>·</span>
            <span style={{ color: "var(--muted)" }}>Simulated via localStorage · Pattern: Laravel Reverb</span>
          </div>
        </div>

        <div className="section" style={{ paddingTop: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "2rem", alignItems: "start" }}>
            {/* Form */}
            <div
              className="glass card reveal"
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
                position: "sticky",
                top: "calc(var(--header-height) + 1rem)",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", color: "var(--text)" }}>
                Sign the Guestbook
              </h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <label htmlFor="gb-name" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                    YOUR NAME
                  </label>
                  <input
                    id="gb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                    required
                    className="input-field"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label htmlFor="gb-message" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                    MESSAGE
                  </label>
                  <textarea
                    id="gb-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a thought, feedback, or just say hi!"
                    required
                    rows={4}
                    maxLength={300}
                    className="input-field"
                    style={{ resize: "vertical", minHeight: "100px" }}
                  />
                  <div style={{ fontSize: "0.7rem", color: "var(--muted2)", textAlign: "right", marginTop: "0.25rem" }}>
                    {message.length}/300
                  </div>
                </div>

                {/* Emoji picker */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
                    PICK AN EMOJI
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setSelectedEmoji(e)}
                        style={{
                          width: "36px", height: "36px",
                          borderRadius: "var(--radius-sm)",
                          border: `2px solid ${selectedEmoji === e ? "var(--accent)" : "var(--border)"}`,
                          background: selectedEmoji === e ? "var(--accent-soft)" : "var(--bg-card)",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  id="gb-submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.85rem" }}
                >
                  {submitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    `${selectedEmoji} Post Message`
                  )}
                </button>
              </form>

              {/* Pattern explanation */}
              <div style={{
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-code)",
                border: "1px solid var(--border)",
                fontSize: "0.72rem",
                fontFamily: "var(--font-code)",
                lineHeight: 1.8,
              }}>
                <div style={{ color: "var(--muted2)", marginBottom: "0.5rem" }}>// Production pattern:</div>
                <div><span className="code-key">broadcast</span><span style={{ color: "var(--code-bracket)" }}>(</span></div>
                <div style={{ paddingLeft: "1rem" }}>
                  <span style={{ color: "var(--code-string)" }}>new</span>{" "}
                  <span className="code-key">GuestbookMessageEvent</span>
                  <span style={{ color: "var(--code-bracket)" }}>($msg)</span>
                </div>
                <div><span style={{ color: "var(--code-bracket)" }}>)-&gt;</span><span className="code-key">toOthers</span><span style={{ color: "var(--code-bracket)" }}>();</span></div>
              </div>
            </div>

            {/* Feed */}
            <div ref={feedRef}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.1rem", color: "var(--text)", fontWeight: 700 }}>
                  Live Feed
                  <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "var(--muted2)", fontWeight: 400 }}>
                    ({totalMessages} messages)
                  </span>
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="status-dot" />
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>Live</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map((msg) => (
                  <MessageCard key={msg.id} msg={msg} isNew={newIds.has(msg.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer style={{ textAlign: "center", padding: "3rem var(--page-px)", borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <p style={{ color: "var(--muted)" }}>Crafted with <span style={{ color: "var(--accent)" }}>code ✧ tea ✧ curiosity</span></p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .gb-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
