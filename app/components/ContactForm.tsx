"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendEmail = (provider: "gmail" | "outlook" | "yahoo" | "default") => {
    const recipient = "gajjarmansi2808@gmail.com";
    const subject = `Portfolio Contact: ${form.name}`;
    const body = `Hi Mansi,\n\n${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`;
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(subject);

    let url = "";
    if (provider === "gmail") {
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodedSubject}&body=${encodedBody}`;
    } else if (provider === "outlook") {
      url = `https://outlook.live.com/default.aspx?rru=compose&to=${recipient}&subject=${encodedSubject}&body=${encodedBody}`;
    } else if (provider === "yahoo") {
      url = `https://compose.mail.yahoo.com/?to=${recipient}&subject=${encodedSubject}&body=${encodedBody}`;
    } else {
      url = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
    }

    window.open(url, "_blank");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "inherit",
    fontSize: "1rem",
    transition: "var(--transition)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--text)",
  };

  const providers: {
    id: "gmail" | "outlook" | "yahoo" | "default";
    label: string;
    icon: string;
    hoverColor: string;
    hoverBg: string;
  }[] = [
    {
      id: "gmail",
      label: "Gmail",
      icon: "M",
      hoverColor: "#EA4335",
      hoverBg: "rgba(234,67,53,0.05)",
    },
    {
      id: "outlook",
      label: "Outlook",
      icon: "O",
      hoverColor: "#0078D4",
      hoverBg: "rgba(0,120,212,0.05)",
    },
    {
      id: "yahoo",
      label: "Yahoo",
      icon: "Y",
      hoverColor: "#6001D2",
      hoverBg: "rgba(96,1,210,0.05)",
    },
    {
      id: "default",
      label: "Mail App",
      icon: "✉",
      hoverColor: "var(--accent)",
      hoverBg: "var(--accent-soft)",
    },
  ];

  return (
    <div>
      {/* Name */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="name" style={labelStyle}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="email" style={labelStyle}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Message */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="message" style={labelStyle}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="How can I help you?"
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Primary send button */}
      <button
        type="button"
        onClick={() => sendEmail("default")}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.7rem 1.4rem",
          borderRadius: "50px",
          fontWeight: 600,
          cursor: "pointer",
          border: "1px solid transparent",
          background: "var(--accent)",
          color: "var(--btn-text)",
          fontSize: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "var(--transition)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-2px)";
          el.style.filter = "brightness(1.05)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "none";
          el.style.filter = "none";
        }}
      >
        Send Message (Default App)
      </button>

      {/* Email providers */}
      <div
        style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px dashed var(--border)",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "var(--muted)",
          }}
        >
          Or open directly in:
        </p>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          {providers.map(({ id, label, icon, hoverColor, hoverBg }) => (
            <button
              key={id}
              type="button"
              onClick={() => sendEmail(id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-2px)";
                el.style.borderColor = hoverColor;
                el.style.color = hoverColor;
                el.style.background = hoverBg;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--text)";
                el.style.background = "var(--bg)";
              }}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
