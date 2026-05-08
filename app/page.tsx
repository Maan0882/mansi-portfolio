"use client";

import { useEffect } from "react";
import Header from "./components/Header";
import HeroVisual from "./components/HeroVisual";
import ContactForm from "./components/ContactForm";
import { useScrollReveal } from "./components/useScrollReveal";

const cardStyle: React.CSSProperties = {
  padding: "2rem",
  borderRadius: "var(--radius-lg, 24px)",
  boxShadow: "var(--shadow-sm)",
  display: "flex",
  flexDirection: "column",
  transition: "all var(--transition)",
};

const tagStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  padding: "0.3rem 0.8rem",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "50px",
  color: "var(--muted)",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="reveal"
      style={{
        fontSize: "2rem",
        marginBottom: "3rem",
        textAlign: "center",
        fontWeight: 700,
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

      {/* HERO */}
      <main
        id="home"
        style={{
          minHeight: "100vh",
          padding: "6rem 8vw 2rem",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          alignItems: "center",
          gap: "3rem",
        }}
      >
        <div className="reveal">
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", marginBottom: "1.5rem", fontWeight: 500 }}>
            Turning ideas into interactive experiences.
          </p>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Hi, I&apos;m{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--illus-secondary, #f45d48))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mansi Gajjar
            </span>
          </h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--muted)", marginBottom: "1rem" }}>
            Aspiring Full Stack Developer
          </h2>
          <p style={{ color: "var(--muted)" }}>
            Completed Master's degree in{" "}
            <span style={{ color: "#f7cc65", fontWeight: 600 }}>Masters of Science in Information Technology </span>
             with hands-on experience in web apps, problem solving, and clean user experiences.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <a
              href="#projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.6rem 1.4rem",
                borderRadius: "50px",
                fontWeight: 600,
                background: "var(--accent)",
                color: "var(--btn-text)",
                border: "1px solid transparent",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.filter = "brightness(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.filter = "none";
              }}
            >
              View My Projects
            </a>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.6rem 1.4rem",
                borderRadius: "50px",
                fontWeight: 600,
                background: "transparent",
                color: "var(--accent)",
                border: "1px solid var(--accent-soft)",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--accent-soft)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="reveal">
          <HeroVisual />
        </div>
      </main>

      {/* ABOUT */}
      <section id="about" style={{ padding: "5rem 8vw" }}>
        <SectionTitle>About Me</SectionTitle>
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <Card>
            <h3 style={{ marginBottom: "1rem", color: "var(--text)" }}>Who I Am</h3>
            <p style={{ color: "var(--muted)" }}>
              Highly motivated IT student from Dharmaj, Anand, passionate about building real-world
              software and web experiences that feel smooth and intuitive.
            </p>
          </Card>
          <Card>
            <h3 style={{ marginBottom: "1rem", color: "var(--text)" }}>Education</h3>
            <p style={{ color: "var(--muted)" }}>
              Completed Master's degree in Information Technology at Shree P. M. Patel Institute, Anand in April 2026.
              Completed BCA in 2024 with a strong academic record.
            </p>
          </Card>
          <Card>
            <h3 style={{ marginBottom: "1rem", color: "var(--text)" }}>What I Bring</h3>
            <p style={{ color: "var(--muted)" }}>
              Strong foundation in programming, databases, and web technologies, with a focus on clean UI,
              responsive design, and reliable backends.
            </p>
          </Card>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: "5rem 8vw" }}>
        <SectionTitle>Skills &amp; Toolbox</SectionTitle>
        
        <div style={{ marginBottom: "3rem" }}>
          <Card>
            <h3 style={{ marginBottom: "2rem", color: "var(--text)" }}>Proficiency Graph</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { name: "Frontend (HTML/CSS/JS)", level: 90 },
                { name: "Backend (PHP/.NET/Java)", level: 85 },
                { name: "Databases (MySQL/SQL Server)", level: 80 },
                { name: "Python", level: 75 },
                { name: "Tools & Git", level: 85 },
              ].map((skill) => (
                <div key={skill.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text)", fontWeight: 500 }}>
                    <span>{skill.name}</span>
                    <span style={{ color: "var(--accent)" }}>{skill.level}%</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${skill.level}%`, height: "100%", background: "var(--accent)", borderRadius: "4px", transition: "width 1s ease-in-out" }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {[
            { title: "Programming", tags: ["Java", "Python", "C", "PHP", ".NET"] },
            { title: "Web & Mobile", tags: ["HTML5", "CSS3", "JavaScript", "Responsive UI", "Android Basics"] },
            { title: "Tools & Data", tags: ["MySQL", "SQL Server", "VS Code", "Git", "Problem Solving"] },
          ].map(({ title, tags }) => (
            <Card key={title}>
              <h3 style={{ marginBottom: "1rem", color: "var(--text)" }}>{title}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
                {tags.map((tag) => <span key={tag} style={tagStyle}>{tag}</span>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* EXPERIENCE & PROJECTS */}
      <section id="projects" style={{ padding: "5rem 8vw" }}>
        <SectionTitle>Experience &amp; Projects</SectionTitle>
        <div className="projects-grid">
          
          {/* Experience Card */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
               <h3 style={{ color: "var(--text)", margin: 0 }}>SSM Future Innovation FZE</h3>
               <span style={{ fontSize: "0.75rem", color: "var(--accent)", padding: "0.2rem 0.6rem", border: "1px solid var(--accent)", borderRadius: "50px", fontWeight: 600 }}>Experience</span>
            </div>
            <p style={{ color: "var(--muted)" }}>
              Worked on the <strong>SSM Future Innovation FZE</strong>, a modern Next.js web application built with TypeScript. Handled implementation logic ensuring robust and scalable performance.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto", paddingTop: "1rem" }}>
              {["Next.js", "TypeScript", "TailwindCSS"].map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
            <a href="https://ssmfutureinnovationfze.com/" target="_blank" rel="noopener noreferrer" style={{
                marginTop: "1.5rem",
                color: "var(--accent)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                transition: "gap 0.3s ease",
                textDecoration: "none",
              }}>
              Live Demo <span>→</span>
            </a>
          </Card>

          {/* IAPES System (TechStrota) */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
               <h3 style={{ color: "var(--text)", margin: 0 }}>IAPES System</h3>
               <span style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "0.2rem 0.6rem", border: "1px solid var(--border)", borderRadius: "50px", fontWeight: 600 }}>Project</span>
            </div>
            <p style={{ color: "var(--muted)" }}>
              A robust web application built using the Laravel framework. It leverages an expressive routing engine, secure architecture, and a powerful ORM for scalable database management.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto", paddingTop: "1rem" }}>
              {["Laravel", "PHP", "Blade"].map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
            <a href="https://techstrota.tech/" target="_blank" rel="noopener noreferrer" style={{
                marginTop: "1.5rem",
                color: "var(--accent)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                transition: "gap 0.3s ease",
                textDecoration: "none",
              }}>
              Live Demo <span>→</span>
            </a>
          </Card>

          {/* Project 1 */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
               <h3 style={{ color: "var(--text)", margin: 0 }}>Quiz Up</h3>
               <span style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "0.2rem 0.6rem", border: "1px solid var(--border)", borderRadius: "50px", fontWeight: 600 }}>Project</span>
            </div>
            <p style={{ color: "var(--muted)" }}>
              Interactive quiz platform with user registration, quiz creation, scoring, and result tracking
              using ASP.NET (C#) and SQL Server.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
              {["ASP.NET", "C#", "SQL Server"].map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
          </Card>

          {/* Project 2 */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
               <h3 style={{ color: "var(--text)", margin: 0 }}>Real-time Chat App</h3>
               <span style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "0.2rem 0.6rem", border: "1px solid var(--border)", borderRadius: "50px", fontWeight: 600 }}>Project</span>
            </div>
            <p style={{ color: "var(--muted)" }}>
              Web-based chatting platform with authentication, messaging, and logout features.
              Built for seamless communication.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
              {["PHP", "MySQL", "JS"].map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
            <a
              href="https://mg2808.free.nf/Chat App/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "1.5rem",
                color: "var(--accent)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                transition: "gap 0.3s ease",
                textDecoration: "none",
              }}
            >
              Live Demo <span>→</span>
            </a>
          </Card>

          {/* Project 3 */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
               <h3 style={{ color: "var(--text)", margin: 0 }}>Attendance System</h3>
               <span style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "0.2rem 0.6rem", border: "1px solid var(--border)", borderRadius: "50px", fontWeight: 600 }}>Project</span>
            </div>
            <p style={{ color: "var(--muted)" }}>
              Comprehensive attendance management system featuring role-based dashboards
              (Admin, Teacher, Student), real-time reporting, and secure authentication.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
              {["PHP", "MySQL", "Dashboard UI"].map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
            <a
              href="https://mg2808.free.nf/Attendance%20System/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "1.5rem",
                color: "var(--accent)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                textDecoration: "none",
              }}
            >
              Live Demo <span>→</span>
            </a>
          </Card>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "5rem 8vw" }}>
        <SectionTitle>Get In Touch</SectionTitle>
        <div
          className="reveal glass contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "3rem",
            borderRadius: "var(--radius-lg, 24px)",
            padding: "3rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "var(--text)" }}>
              Let&apos;s Connect
            </h3>
            <p style={{ color: "var(--muted)" }}>
              Whether it is an internship opportunity or a project idea, feel free to reach out.
              Replies will be prompt and professional.
            </p>
            <div style={{ marginTop: "2rem" }}>
              {[
                { icon: "✉", content: "gajjarmansi2808@gmail.com", href: undefined },
                { icon: "in", content: "linkedin.com/in/2808-mansi-gajjar", href: "https://www.linkedin.com/in/2808-mansi-gajjar" },
                { icon: "💬", content: "Chat App Demo", href: "https://mg2808.free.nf/Chat App/" },
              ].map(({ icon, content, href }) => (
                <div key={content} style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--muted)" }}>
                  <span style={{ color: "var(--accent)", fontSize: "1.2rem" }}>{icon}</span>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>{content}</a>
                  ) : (
                    <span>{content}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "3rem 8vw", borderTop: "1px solid var(--border)", background: "var(--bg-alt)", marginTop: "4rem" }}>
        <p style={{ color: "var(--muted)" }}>
          Crafted with <span style={{ color: "var(--accent)" }}>code ✧ tea ✧ curiosity</span>
        </p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8, color: "var(--muted)" }}>
          © <span id="year"/>_Mansi Gajjar — &quot;Debug the present | Design the future&quot;
        </p>
      </footer>

      <style jsx global>{`
        .projects-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
        
        @media (max-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          main#home {
            grid-template-columns: 1fr !important;
            padding-top: 8rem !important;
            text-align: center;
          }
          main#home .reveal:last-child {
            display: none;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
            padding: 1.5rem !important;
          }
        }

        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
