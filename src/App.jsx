import React, { useState, useEffect } from "react";
import { ACCENT, CHEESE, DISPLAY, BODY } from "./data/index.js";
import { THEMES, ThemeCtx } from "./theme.js";
import { load, save } from "./lib/storage.js";
import { Repaso } from "./modes/Repaso.jsx";
import { Tarjetas } from "./modes/Tarjetas.jsx";
import { Ordenar } from "./modes/Ordenar.jsx";
import { Examen } from "./modes/Examen.jsx";
import { Pastas } from "./modes/Pastas.jsx";
import { Cortes } from "./modes/Cortes.jsx";
import { Progreso } from "./modes/Progreso.jsx";

function IconSound({ on }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10v4h3l4 3V7L7 10H4z" fill="currentColor" />
      {on ? (
        <path d="M15 9.5a4 4 0 010 5M17.5 7a7 7 0 010 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

function IconTheme({ light }) {
  return light ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 14.5A8.5 8.5 0 1110.5 3 7 7 0 0021 14.5z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [mode, setMode] = useState("repaso");
  const [size, setSize] = useState("10");
  const [themeName, setThemeName] = useState(() => load("pt-theme", "light"));
  const [soundOn, setSoundOn] = useState(() => load("pt-sound", true));
  const [stats, setStats] = useState(() => load("pt-stats", { exams: [], misses: {} }));

  const t = THEMES[themeName] || THEMES.light;

  useEffect(() => { save("pt-theme", themeName); }, [themeName]);
  useEffect(() => { save("pt-sound", soundOn); }, [soundOn]);
  useEffect(() => { save("pt-stats", stats); }, [stats]);

  const recordMiss = (pizzaName) => setStats((s) => ({
    ...s,
    misses: { ...s.misses, [pizzaName]: (s.misses[pizzaName] || 0) + 1 },
  }));
  const recordExam = (score, total) => setStats((s) => ({
    ...s,
    exams: [...s.exams, { date: Date.now(), score, total }].slice(-50),
  }));
  const clearStats = () => setStats({ exams: [], misses: {} });

  const tabs = [
    ["repaso", "Repaso"],
    ["tarjetas", "Tarjetas"],
    ["orden", "Orden"],
    ["examen", "Examen"],
    ["pastas", "Menú"],
    ["cortes", "Cortes"],
    ["progreso", "Progreso"],
  ];

  return (
    <ThemeCtx.Provider value={t}>
      <div
        className="pt-shell"
        style={{
          "--pt-heat": t.heat,
          "--pt-surface": t.surface,
          "--pt-line": t.line,
          "--pt-ticket": t.ticket,
          "--pt-accent": ACCENT,
          background: t.paper,
          fontFamily: BODY,
          color: t.ink,
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
          button:focus-visible, a:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
        `}</style>

        <div className="mx-auto w-full max-w-[480px] md:max-w-4xl md:py-10 md:px-6">
          <div className="pt-stage" style={{ background: t.surface, borderColor: t.line }}>
            <header style={{
              background: `
                radial-gradient(80% 120% at 100% 0%, ${t.heat}, transparent 55%),
                linear-gradient(165deg, #1c1815 0%, ${t.header} 48%, #0a0908 100%)
              `,
              padding: "22px 20px 18px",
            }}>
              <div className="flex items-start justify-between" style={{ gap: 12 }}>
                <div className="pt-brand" style={{ minWidth: 0 }}>
                  <div style={{
                    color: CHEESE,
                    fontFamily: DISPLAY,
                    fontSize: 13,
                    letterSpacing: 3.2,
                    lineHeight: 1,
                  }}>
                    LINEA DE ENSAMBLE
                  </div>
                  <div style={{
                    fontFamily: DISPLAY,
                    fontSize: "clamp(40px, 11vw, 56px)",
                    lineHeight: 0.92,
                    color: "#FFF6EC",
                    marginTop: 8,
                    letterSpacing: "0.04em",
                  }}>
                    PIZZA
                    <span style={{ color: ACCENT }}> TRAINER</span>
                  </div>
                  <div className="flex items-center flex-wrap" style={{ gap: 8, marginTop: 10 }}>
                    <span style={{
                      fontFamily: DISPLAY,
                      fontSize: 14,
                      letterSpacing: 1.5,
                      color: t.header,
                      background: CHEESE,
                      padding: "3px 9px",
                      borderRadius: 4,
                    }}>
                      S1
                    </span>
                    <span style={{ color: t.headerSub, fontSize: 13 }}>
                      building chart · cortes · menú
                    </span>
                  </div>
                </div>

                <div className="flex items-center" style={{ gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setSoundOn(!soundOn)}
                    aria-label={soundOn ? "Silenciar" : "Activar sonido"}
                    className="pt-btn flex items-center justify-center"
                    style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: "rgba(255,246,236,.08)",
                      border: "1px solid rgba(255,246,236,.14)",
                      color: "#FFF6EC",
                    }}
                  >
                    <IconSound on={soundOn} />
                  </button>
                  <button
                    onClick={() => setThemeName(themeName === "light" ? "dark" : "light")}
                    aria-label={themeName === "light" ? "Modo oscuro" : "Modo claro"}
                    className="pt-btn flex items-center justify-center"
                    style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: "rgba(255,246,236,.08)",
                      border: "1px solid rgba(255,246,236,.14)",
                      color: "#FFF6EC",
                    }}
                  >
                    <IconTheme light={themeName === "light"} />
                  </button>
                </div>
              </div>
            </header>

            <div className="pt-heatbar" />

            <nav
              className="flex overflow-x-auto"
              role="tablist"
              aria-label="Secciones"
              style={{
                background: t.tabBar,
                borderBottom: `1px solid ${t.line}`,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {tabs.map(([key, label]) => {
                const active = mode === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMode(key)}
                    className="pt-tab flex-1 py-3.5 px-2.5 font-bold whitespace-nowrap"
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 15,
                      letterSpacing: 0.8,
                      minWidth: 72,
                      minHeight: 48,
                      color: active ? "#FFF6EC" : t.tabIdle,
                      background: active ? "rgba(255,77,26,.16)" : "transparent",
                      borderBottom: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              <a
                href="/3d/"
                className="pt-tab flex-1 py-3.5 px-2.5 font-bold whitespace-nowrap text-center"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 15,
                  letterSpacing: 0.8,
                  minWidth: 78,
                  minHeight: 48,
                  color: CHEESE,
                  borderBottom: "3px solid transparent",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Pizza 3D
              </a>
              <a
                href="/line/"
                className="pt-tab flex-1 py-3.5 px-2.5 font-bold whitespace-nowrap text-center"
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 15,
                  letterSpacing: 0.8,
                  minWidth: 78,
                  minHeight: 48,
                  color: CHEESE,
                  borderBottom: "3px solid transparent",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Línea 3D
              </a>
            </nav>

            <main className="p-4 pb-12 md:p-7 md:pb-14" key={mode}>
              <div className="pt-mode">
                {mode === "repaso" && <Repaso size={size} setSize={setSize} />}
                {mode === "tarjetas" && <Tarjetas size={size} setSize={setSize} />}
                {mode === "orden" && <Ordenar size={size} setSize={setSize} soundOn={soundOn} onMiss={recordMiss} />}
                {mode === "examen" && <Examen soundOn={soundOn} onMiss={recordMiss} onExamDone={recordExam} />}
                {mode === "pastas" && <Pastas />}
                {mode === "cortes" && <Cortes />}
                {mode === "progreso" && <Progreso stats={stats} onClear={clearStats} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
