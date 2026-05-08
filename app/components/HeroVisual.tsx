export default function HeroVisual() {
  return (
    <div
      style={{
        position: "relative",
        height: 450,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
      }}
    >
      {/* Spinning dashed circle behind */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          border: "1px dashed var(--border)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
          animation: "spin-slow 40s linear infinite",
        }}
      />

      {/* Floating card wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          animation: "float-visual 6s ease-in-out infinite",
        }}
      >
        <div
          className="glass"
          style={{
            borderRadius: 24,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}
        >
          {/* Title box */}
          <div
            style={{
              padding: "2.5rem 1rem",
              textAlign: "center",
              background:
                "radial-gradient(circle at center, var(--accent-soft) 0%, transparent 70%)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "3rem",
                fontWeight: 700,
                fontStyle: "italic",
                color: "var(--text)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-main)",
                  fontWeight: 300,
                  fontStyle: "normal",
                  fontSize: "2rem",
                  opacity: 0.5,
                  color: "var(--accent)",
                }}
              >
                &lt;
              </span>
              Mansi
              <span
                style={{
                  fontFamily: "var(--font-main)",
                  fontWeight: 300,
                  fontStyle: "normal",
                  fontSize: "2rem",
                  opacity: 0.5,
                  color: "var(--accent)",
                }}
              >
                &gt;
              </span>
            </div>
          </div>

          {/* Row 1 */}
          <div style={{ height: 1, background: "var(--border)" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1.5rem 2rem",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-code, monospace)",
                color: "var(--muted)",
                opacity: 0.6,
                fontSize: "1.2rem",
              }}
            >
              //
            </span>
            <div
              style={{
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                padding: "0.4rem 1.2rem",
                borderRadius: 50,
                fontSize: "0.8rem",
                fontFamily: "var(--font-code, monospace)",
                background: "var(--bg)",
              }}
            >
              Java
            </div>
            <span
              style={{
                fontFamily: "var(--font-code, monospace)",
                color: "var(--muted)",
                opacity: 0.6,
                fontSize: "1.5rem",
              }}
            >
              {"{ JS }"}
            </span>
            {/* Small triangle */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "17px solid var(--accent)",
                opacity: 0.8,
                transform: "scale(0.7)",
              }}
            />
          </div>

          {/* Row 2 */}
          <div style={{ height: 1, background: "var(--border)" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1.5rem 2rem",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                borderBottom: "25px solid var(--illus-secondary, #f45d48)",
                opacity: 0.8,
                transform: "rotate(-10deg)",
              }}
            />
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.05em",
              }}
            >
              Python
            </span>
            <div
              style={{
                width: 40,
                height: 40,
                background: "var(--accent)",
                borderRadius: "50%",
                opacity: 0.8,
              }}
            />
          </div>

          {/* Row 3 */}
          <div style={{ height: 1, background: "var(--border)" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1.5rem 2rem",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-code, monospace)",
                color: "var(--muted)",
                opacity: 0.6,
                fontSize: "0.9rem",
              }}
            >
              C++
            </span>
            {/* Ovals group */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {[false, true, false].map((filled, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 50,
                    background: filled ? "var(--accent)" : "var(--bg)",
                    border: filled ? "none" : "1px solid var(--border)",
                    borderRadius: "50%",
                    marginLeft: i === 0 ? 0 : -10,
                    opacity: filled ? 0.9 : 1,
                    zIndex: filled ? 2 : 1,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontStyle: "italic",
                fontSize: "1.2rem",
                color: "var(--text)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-code, monospace)",
                  fontSize: "2rem",
                  verticalAlign: "middle",
                  marginRight: 5,
                  opacity: 0.5,
                }}
              >
                .
              </span>
              NET
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
