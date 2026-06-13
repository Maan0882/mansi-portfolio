"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, Theme } from "./ThemeProvider";

const THEMES: { id: Theme; label: string; emoji: string; sub: string }[] = [
  { id: "dark",       label: "Midnight Dark",    emoji: "🌑", sub: "Default" },
  { id: "light",      label: "Clean Light",      emoji: "☀️", sub: "Minimal" },
  { id: "typescript", label: "TypeScript Blue",  emoji: "🔷", sub: "#3178C6" },
];

const NAV_LINKS = [
  { href: "/#about",         label: "About",        id: "nav-about" },
  { href: "/#services",      label: "Services",     id: "nav-services" },
  { href: "/#skills",        label: "Skills",       id: "nav-skills" },
  { href: "/#projects",      label: "Projects",     id: "nav-projects" },
  { href: "/#contact",       label: "Contact",      id: "nav-contact" },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close theme dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentTheme = THEMES.find((t) => t.id === theme)!;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--page-px)",
          transition: "all 0.4s ease",
          background: scrolled
            ? "rgba(9,9,11,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="header-logo"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "1.35rem",
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginRight: "auto",
            flexShrink: 0,
          }}
        >
          MG<span style={{ WebkitTextFillColor: "var(--accent)", fontWeight: 400 }}>.</span>dev
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            marginRight: "1rem",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={link.id}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent)" : "var(--muted)",
                  background: active ? "var(--accent-soft)" : "transparent",
                  transition: "all 0.2s ease",
                  border: active ? "1px solid var(--accent-soft)" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
                {link.badge && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      padding: "0.1rem 0.4rem",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--accent)",
                      color: "#fff",
                      letterSpacing: "0.05em",
                      lineHeight: 1.6,
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Switcher */}
        <div ref={themeRef} style={{ position: "relative" }}>
          <button
            id="theme-switcher-btn"
            onClick={() => setThemeOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 0.9rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border-strong)",
              background: "var(--bg-card)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
              fontFamily: "var(--font-main)",
            }}
          >
            <span style={{ fontSize: "1rem" }}>{currentTheme.emoji}</span>
            <span className="theme-label">{currentTheme.label}</span>
            <svg
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{
                transition: "transform 0.2s ease",
                transform: themeOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "var(--muted)",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {themeOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "220px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-strong)",
                background: "var(--bg)",
                backdropFilter: "blur(20px)",
                boxShadow: "var(--shadow-md)",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                animation: "slide-up 0.2s ease",
              }}
            >
              <p style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "var(--muted2)",
                padding: "0.3rem 0.75rem",
                textTransform: "uppercase",
              }}>
                Select Theme
              </p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  id={`theme-${t.id}`}
                  onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: theme === t.id ? "var(--accent-soft)" : "transparent",
                    color: theme === t.id ? "var(--accent)" : "var(--text)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    fontFamily: "var(--font-main)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (theme !== t.id) (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                  }}
                  onMouseLeave={(e) => {
                    if (theme !== t.id) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{t.emoji}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600 }}>{t.label}</span>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--muted)", opacity: 0.8 }}>{t.sub}</span>
                  </span>
                  {theme === t.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          id="mobile-menu-btn"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "none",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text)",
            cursor: "pointer",
            padding: "0.5rem",
            marginLeft: "0.75rem",
          }}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            zIndex: 999,
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem var(--page-px)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            animation: "slide-up 0.2s ease",
          }}
          className="mobile-nav"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              id={`mobile-${link.id}`}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm)",
                color: pathname === link.href ? "var(--accent)" : "var(--muted)",
                background: pathname === link.href ? "var(--accent-soft)" : "transparent",
                fontWeight: pathname === link.href ? 600 : 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {link.label}
              {link.badge && (
                <span style={{
                  fontSize: "0.65rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 700,
                }}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .theme-label { display: none; }
        }
        @media (max-width: 600px) {
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
