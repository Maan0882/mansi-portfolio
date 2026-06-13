"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <section id="home" className="hero-section">
      {/* ─── Full-viewport Video Background ─── */}
      <div className="hero-video-wrapper">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/webvideo.mp4" type="video/mp4" />
        </video>
        {/* Video overlay gradient — blends video into the site */}
        <div className="hero-video-overlay" />
      </div>

      {/* ─── Animated Background Effects ─── */}
      <div className="hero-particles">
        {Array.from({ length: 20 }).map((_, i) => {
          // Deterministic pseudo-random values based on index to avoid hydration mismatch
          const seed = (i * 137.5) % 100;
          const seed2 = (i * 97.3 + 31) % 100;
          const seed3 = (i * 53.7 + 17) % 8;
          const seed4 = 6 + (i * 73.1 + 11) % 8;
          const size = 2 + (i * 41.3 + 7) % 4;
          return (
            <div
              key={i}
              className="hero-particle"
              style={{
                left: `${seed}%`,
                top: `${seed2}%`,
                animationDelay: `${seed3}s`,
                animationDuration: `${seed4}s`,
                width: `${size}px`,
                height: `${size}px`,
              }}
            />
          );
        })}
      </div>

      {/* ─── Scan Line Effect ─── */}
      <div className="hero-scanlines" />

      {/* ─── Main Content Grid ─── */}
      <div className={`hero-content ${loaded ? "hero-loaded" : ""}`}>
        {/* LEFT — Text Content */}
        <div className="hero-text-side">
          {/* Status Badge */}
          <div
            className="hero-status-badge"
            style={{ transitionDelay: "0.3s" }}
          >
            <span className="hero-status-dot" />
            <span className="hero-status-text">Open to Opportunities</span>
          </div>

          {/* Name */}
          <h1
            className="hero-name"
            style={{ transitionDelay: "0.5s" }}
          >
            <span className="hero-greeting">Hello, I&apos;m</span>
            <span className="hero-name-gradient">Mansi Gajjar</span>
          </h1>

          {/* Role */}
          <div
            className="hero-role"
            style={{ transitionDelay: "0.7s" }}
          >
            <span className="hero-role-bracket">&lt;</span>
            <span className="hero-role-text">Software &amp; Full Stack Developer</span>
            <span className="hero-role-bracket">/&gt;</span>
          </div>

          {/* Description */}
          <p
            className="hero-description"
            style={{ transitionDelay: "0.9s" }}
          >
            A dedicated Software Developer with a passion for building{" "}
            <span className="hero-highlight">clean, efficient, and scalable</span>{" "}
            full-stack applications. Whether architecting{" "}
            <span className="hero-highlight">internal admin systems</span> or optimizing{" "}
            <span className="hero-highlight">backend databases</span>, I focus on
            writing maintainable code and solving technical challenges through{" "}
            <span className="hero-highlight-accent">proactive collaboration</span>.
          </p>

          {/* CTA Buttons */}
          <div
            className="hero-buttons"
            style={{ transitionDelay: "1.1s" }}
          >
            <Link href="#projects" className="hero-btn-primary" id="hero-portfolio-btn">
              <span className="hero-btn-icon">◈</span>
              View Projects
              <span className="hero-btn-shine" />
            </Link>
            <Link href="#contact" className="hero-btn-outline" id="hero-contact-btn">
              <span className="hero-btn-icon">✦</span>
              Get In Touch
            </Link>
          </div>

          {/* Tech Stack Pills */}
          <div
            className="hero-tech-strip"
            style={{ transitionDelay: "1.3s" }}
          >
            {["Next.js", "Laravel", "TypeScript", "PHP", "MySQL", "React"].map(
              (tech, i) => (
                <span
                  key={tech}
                  className="hero-tech-pill"
                  style={{ animationDelay: `${1.5 + i * 0.1}s` }}
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>

        {/* RIGHT — Avatar */}
        <div className="hero-avatar-side">
          <div className="hero-avatar-container">
            {/* Glowing rings behind avatar */}
            <div className="hero-avatar-ring hero-avatar-ring-1" />
            <div className="hero-avatar-ring hero-avatar-ring-2" />
            <div className="hero-avatar-ring hero-avatar-ring-3" />

            {/* Avatar image */}
            <div className="hero-avatar-img-wrapper">
              <Image
                src="/avatar.png"
                alt="Mansi Gajjar — Software & Full Stack Developer"
                width={420}
                height={420}
                priority
                className="hero-avatar-img"
              />
            </div>

            {/* Floating info cards around avatar */}
            <div className="hero-float-card hero-float-card-1">
              <span className="hero-float-emoji">⚡</span>
              <span>Full Stack</span>
            </div>
            <div className="hero-float-card hero-float-card-2">
              <span className="hero-float-emoji">🎓</span>
              <span>M.Sc. IT</span>
            </div>
            <div className="hero-float-card hero-float-card-3">
              <span className="hero-float-emoji">🚀</span>
              <span>Problem Solver</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <div className="hero-scroll-indicator">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
        <span className="hero-scroll-text">Scroll to explore</span>
      </div>

      {/* ─── Styles ─── */}
      <style>{`
        /* ── HERO SECTION CONTAINER ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── VIDEO BACKGROUND ── */
        .hero-video-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-video-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(9,9,11,0.7) 0%,
              rgba(9,9,11,0.5) 30%,
              rgba(9,9,11,0.5) 60%,
              rgba(9,9,11,0.92) 100%
            ),
            linear-gradient(
              90deg,
              rgba(9,9,11,0.82) 0%,
              rgba(9,9,11,0.35) 55%,
              rgba(9,9,11,0.5) 100%
            );
          pointer-events: none;
        }

        [data-theme="light"] .hero-video-overlay {
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.65) 0%,
              rgba(255,255,255,0.35) 30%,
              rgba(255,255,255,0.4) 60%,
              rgba(255,255,255,0.9) 100%
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.75) 0%,
              rgba(255,255,255,0.15) 50%,
              rgba(255,255,255,0.5) 100%
            );
        }

        /* ── PARTICLES ── */
        .hero-particles {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .hero-particle {
          position: absolute;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0;
          animation: hero-particle-float ease-in-out infinite;
        }

        @keyframes hero-particle-float {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; transform: translateY(-60px) scale(1); }
        }

        /* ── SCANLINES ── */
        .hero-scanlines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.008) 2px,
            rgba(255,255,255,0.008) 4px
          );
        }

        /* ── CONTENT GRID ── */
        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1400px;
          padding: calc(var(--header-height) + 2rem) var(--page-px) 4rem;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 3rem;
        }

        /* ── TEXT SIDE ── */
        .hero-text-side > * {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }

        .hero-loaded .hero-text-side > * {
          opacity: 1;
          transform: translateY(0);
        }

        /* Status Badge */
        .hero-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.45rem 1.2rem;
          border-radius: var(--radius-pill);
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          margin-bottom: 1.8rem;
          backdrop-filter: blur(12px);
        }

        .hero-status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 12px #10b981, 0 0 24px rgba(16,185,129,0.4);
          animation: hero-pulse-dot 2s ease-in-out infinite;
        }

        @keyframes hero-pulse-dot {
          0%, 100% { box-shadow: 0 0 8px #10b981, 0 0 16px rgba(16,185,129,0.3); }
          50% { box-shadow: 0 0 16px #10b981, 0 0 32px rgba(16,185,129,0.5); }
        }

        .hero-status-text {
          font-size: 0.82rem;
          color: #10b981;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        /* Name */
        .hero-name {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-bottom: 1rem;
        }

        .hero-greeting {
          font-size: clamp(1rem, 2vw, 1.3rem);
          font-weight: 400;
          color: var(--muted);
          font-family: var(--font-code);
          letter-spacing: 0.05em;
        }

        .hero-name-gradient {
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight: 900;
          font-family: var(--font-display);
          letter-spacing: -0.03em;
          line-height: 1.05;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, #38bdf8 100%);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: hero-gradient-shift 6s ease-in-out infinite;
        }

        @keyframes hero-gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Role */
        .hero-role {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1.2rem;
          border-radius: var(--radius-sm);
          background: rgba(139,92,246,0.06);
          border: 1px solid rgba(139,92,246,0.15);
          backdrop-filter: blur(8px);
        }

        .hero-role-bracket {
          font-family: var(--font-code);
          color: var(--accent);
          font-weight: 300;
          font-size: 1.1rem;
          opacity: 0.6;
        }

        .hero-role-text {
          font-size: clamp(0.95rem, 1.5vw, 1.2rem);
          font-weight: 600;
          color: var(--text);
          letter-spacing: 0.01em;
        }

        /* Description */
        .hero-description {
          font-size: clamp(0.88rem, 1.2vw, 1rem);
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 2rem;
          max-width: 580px;
        }

        .hero-highlight {
          color: var(--text);
          font-weight: 600;
        }

        .hero-highlight-accent {
          color: var(--accent);
          font-weight: 700;
          position: relative;
        }

        .hero-highlight-accent::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          border-radius: 1px;
          opacity: 0.6;
        }

        /* Buttons */
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .hero-btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2.2rem;
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-main);
          color: #fff;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border: none;
          border-radius: var(--radius-pill);
          cursor: pointer;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 4px 24px rgba(139,92,246,0.35);
        }

        .hero-btn-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 40px rgba(139,92,246,0.5),
                      0 0 60px rgba(139,92,246,0.2);
        }

        .hero-btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.2),
            transparent
          );
          animation: hero-btn-shine-anim 3s ease-in-out infinite;
        }

        @keyframes hero-btn-shine-anim {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }

        .hero-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2.2rem;
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-main);
          color: var(--accent);
          background: transparent;
          border: 1.5px solid rgba(139,92,246,0.35);
          border-radius: var(--radius-pill);
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
        }

        .hero-btn-outline:hover {
          background: rgba(139,92,246,0.1);
          border-color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 4px 24px rgba(139,92,246,0.2);
        }

        .hero-btn-icon {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Tech Strip */
        .hero-tech-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hero-tech-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.9rem;
          border-radius: var(--radius-pill);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          color: var(--muted);
          backdrop-filter: blur(6px);
          opacity: 0;
          animation: hero-pill-in 0.5s ease forwards;
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
        }

        .hero-tech-pill:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(139,92,246,0.08);
          transform: translateY(-2px);
        }

        @keyframes hero-pill-in {
          from { opacity: 0; transform: translateY(10px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── AVATAR SIDE ── */
        .hero-avatar-side {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .hero-avatar-container {
          position: relative;
          width: 420px;
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Glowing Rings */
        .hero-avatar-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid;
        }

        .hero-avatar-ring-1 {
          width: 100%;
          height: 100%;
          border-color: rgba(139,92,246,0.15);
          animation: hero-ring-pulse 4s ease-in-out infinite;
        }

        .hero-avatar-ring-2 {
          width: 115%;
          height: 115%;
          border-color: rgba(236,72,153,0.1);
          animation: hero-ring-pulse 4s ease-in-out infinite 1s;
          border-style: dashed;
        }

        .hero-avatar-ring-3 {
          width: 130%;
          height: 130%;
          border-color: rgba(56,189,248,0.06);
          animation: hero-ring-pulse 4s ease-in-out infinite 2s;
        }

        @keyframes hero-ring-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.03) rotate(3deg); }
        }

        /* Avatar Image */
        .hero-avatar-img-wrapper {
          position: relative;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow:
            0 0 40px rgba(139,92,246,0.2),
            0 0 80px rgba(236,72,153,0.1),
            inset 0 0 30px rgba(0,0,0,0.3);
          border: 2px solid rgba(139,92,246,0.25);
          animation: hero-avatar-float 6s ease-in-out infinite;
          z-index: 2;
        }

        .hero-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @keyframes hero-avatar-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        /* Floating Cards */
        .hero-float-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border-radius: var(--radius-pill);
          background: rgba(9,9,11,0.7);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          z-index: 3;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        [data-theme="light"] .hero-float-card {
          background: rgba(255,255,255,0.85);
        }

        .hero-float-emoji {
          font-size: 1rem;
        }

        .hero-float-card-1 {
          top: 8%;
          right: -8%;
          animation: hero-float-card-anim 5s ease-in-out infinite;
        }

        .hero-float-card-2 {
          bottom: 18%;
          left: -10%;
          animation: hero-float-card-anim 5s ease-in-out infinite 1.5s;
        }

        .hero-float-card-3 {
          bottom: 5%;
          right: -5%;
          animation: hero-float-card-anim 5s ease-in-out infinite 3s;
        }

        @keyframes hero-float-card-anim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* ── SCROLL INDICATOR ── */
        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          z-index: 3;
          opacity: 0;
          animation: hero-fade-in-up 0.8s ease forwards 2s;
        }

        .hero-scroll-mouse {
          width: 24px;
          height: 38px;
          border: 2px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          display: flex;
          justify-content: center;
          padding-top: 8px;
        }

        [data-theme="light"] .hero-scroll-mouse {
          border-color: rgba(0,0,0,0.2);
        }

        .hero-scroll-wheel {
          width: 3px;
          height: 8px;
          border-radius: 2px;
          background: var(--accent);
          animation: hero-scroll-wheel-anim 1.8s ease-in-out infinite;
        }

        @keyframes hero-scroll-wheel-anim {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(12px); }
        }

        .hero-scroll-text {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--muted2);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @keyframes hero-fade-in-up {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: calc(var(--header-height) + 1rem);
          }

          .hero-text-side {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-description {
            text-align: center;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-tech-strip {
            justify-content: center;
          }

          .hero-avatar-side {
            order: -1;
          }

          .hero-avatar-container {
            width: 280px;
            height: 280px;
          }

          .hero-avatar-img-wrapper {
            width: 220px;
            height: 220px;
          }

          .hero-float-card {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-content {
            padding-top: calc(var(--header-height) + 0.5rem);
            padding-bottom: 5rem;
            gap: 1.5rem;
          }

          .hero-avatar-container {
            width: 200px;
            height: 200px;
          }

          .hero-avatar-img-wrapper {
            width: 160px;
            height: 160px;
          }

          .hero-buttons {
            flex-direction: column;
            width: 100%;
            align-items: center;
          }

          .hero-btn-primary,
          .hero-btn-outline {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }

          .hero-name-gradient {
            font-size: clamp(2.2rem, 8vw, 3rem);
          }

          .hero-scroll-indicator {
            bottom: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
