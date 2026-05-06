"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll("main[id], section[id]");
      let current = "";
      sections.forEach((section) => {
        const el = section as HTMLElement;
        if (window.pageYOffset >= el.offsetTop - 180) {
          current = el.getAttribute("id") || "";
        }
      });
      if (current) setActiveLink(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "var(--header-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8vw",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 1000,
        background: scrolled ? "var(--bg)" : "rgba(255,255,255,0.01)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background var(--transition), border-color var(--transition)",
      }}
    >
      {/* Logo */}
      <a
        href="#home"
        style={{
          fontSize: "1.25rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          textDecoration: "none",
        }}
      >
        M<span style={{ color: "var(--accent)" }}>.</span>G
      </a>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          color: "var(--text)",
          cursor: "pointer",
        }}
        className="nav-mobile-toggle"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Nav + Theme toggle */}
      <div
        className={`nav-wrapper${mobileOpen ? " open" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <nav style={{ display: "flex", gap: "2rem" }}>
          {navLinks.map(({ href, label }) => {
            const id = href.slice(1);
            const isActive = activeLink === id;
            return (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isActive ? "var(--text)" : "var(--muted)",
                  position: "relative",
                  paddingBottom: "4px",
                  textDecoration: "none",
                  transition: "color var(--transition)",
                }}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                {label}
                <span
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    width: isActive ? "100%" : 0,
                    height: 2,
                    background: "var(--accent)",
                    borderRadius: 2,
                    transition: "width var(--transition)",
                    display: "block",
                  }}
                />
              </a>
            );
          })}
        </nav>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "var(--bg-alt)",
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1.2rem",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "rotate(15deg) scale(1.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "none")
          }
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-mobile-toggle {
            display: block !important;
          }
          .nav-wrapper {
            position: fixed !important;
            top: var(--header-height) !important;
            right: -100% !important;
            width: 100% !important;
            height: calc(100vh - var(--header-height)) !important;
            background: var(--bg-alt) !important;
            flex-direction: column !important;
            justify-content: center !important;
            transition: right 0.3s ease !important;
            border-left: 1px solid var(--border) !important;
          }
          .nav-wrapper.open {
            right: 0 !important;
          }
          nav {
            flex-direction: column !important;
            align-items: center !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </header>
  );
}
