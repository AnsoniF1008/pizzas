import React, { useState } from "react";
import { PIZZAS, fullBuild, BASE_INGS, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { MiniPizza, Ing, SizeToggle, BuildList, CupLegend } from "../components/ui.jsx";

const FILTERS = [
  ["all", "Todas"],
  ["after", "Con post-horno"],
  ["special", "Salsa especial"],
  ["counted", "Con piezas"],
];

export function Repaso({ size, setSize, onPracticePizza }) {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showLegend, setShowLegend] = useState(false);

  const preview = (p) =>
    fullBuild(p).map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
      .filter((n) => !BASE_INGS.includes(n)).slice(0, 4);

  const matchesFilter = (p) => {
    if (filter === "after") return Boolean(p.afterCut?.length);
    if (filter === "special") return p.build[0][0] !== "Pizza Sauce" && !(p.build[0][0] === "Dough" && p.build[1]?.[0] === "Pizza Sauce");
    if (filter === "counted") return p.build.some(([, tt]) => typeof tt === "number");
    return true;
  };

  const q = query.trim().toLowerCase();
  const results = PIZZAS.map((p, i) => {
    if (!matchesFilter(p)) return -1;
    if (q === "") return i;
    const inName = p.name.toLowerCase().includes(q);
    const inIngs = fullBuild(p).some(([ing]) =>
      ing.toLowerCase().includes(q) || (ES[ing] || "").toLowerCase().includes(q));
    return inName || inIngs ? i : -1;
  }).filter((i) => i !== -1);

  if (open !== null) {
    const p = PIZZAS[open];
    const prevIdx = (open - 1 + PIZZAS.length) % PIZZAS.length;
    const nextIdx = (open + 1) % PIZZAS.length;
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between mb-4" style={{ gap: 8 }}>
          <button
            onClick={() => setOpen(null)}
            className="pt-btn flex items-center text-sm font-semibold"
            style={{ color: ACCENT, gap: 6, fontFamily: DISPLAY, letterSpacing: 0.8, fontSize: 15 }}
          >
            ‹ TODAS LAS PIZZAS
          </button>
          <div className="flex items-center" style={{ gap: 6 }}>
            <button
              onClick={() => setOpen(prevIdx)}
              className="pt-btn px-3 py-1 rounded-lg font-bold"
              style={{ border: `1px solid ${t.line}`, background: t.ticket, color: t.ink, fontFamily: DISPLAY, fontSize: 13 }}
              aria-label={`Anterior: ${PIZZAS[prevIdx].name}`}
            >
              ‹ Ant.
            </button>
            <button
              onClick={() => setOpen(nextIdx)}
              className="pt-btn px-3 py-1 rounded-lg font-bold"
              style={{ border: `1px solid ${t.line}`, background: t.ticket, color: t.ink, fontFamily: DISPLAY, fontSize: 13 }}
              aria-label={`Siguiente: ${PIZZAS[nextIdx].name}`}
            >
              Sig. ›
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between mb-2" style={{ gap: 12 }}>
          <div className="flex items-center" style={{ gap: 12, minWidth: 0 }}>
            <MiniPizza pizza={p} size={64} />
            <div>
              <h2 className="font-bold tracking-tight" style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 8vw, 36px)", color: t.ink, lineHeight: 0.95 }}>
                {p.name}
              </h2>
              <div style={{ color: t.muted, fontSize: 11.5, marginTop: 4 }}>
                {fullBuild(p).length} pasos · {p.afterCut ? "con toque post-horno" : "lista al salir del horno"}
              </div>
            </div>
          </div>
          <SizeToggle size={size} setSize={setSize} />
        </div>

        <p className="mb-3" style={{ color: t.muted, fontSize: 13, lineHeight: 1.45 }}>
          Arma de arriba hacia abajo. Tres secciones de línea, luego horno.
        </p>

        <CupLegend />
        <BuildList pizza={p} size={size} animate show />

        <div className="flex flex-wrap mt-5" style={{ gap: 10 }}>
          {onPracticePizza && (
            <button
              onClick={() => onPracticePizza(open)}
              className="pt-btn pt-btn-primary flex-1 py-3 px-4 font-bold"
              style={{ fontFamily: DISPLAY, fontSize: 16, letterSpacing: 0.8, borderRadius: 12, minWidth: 160 }}
            >
              PRACTICAR EN ORDEN ›
            </button>
          )}
          <a
            href="/3d/index.html"
            className="pt-btn flex items-center justify-center py-3 px-4 font-bold"
            style={{
              fontFamily: DISPLAY,
              fontSize: 16,
              letterSpacing: 0.8,
              borderRadius: 12,
              border: `1.5px solid ${t.ink}`,
              color: t.ink,
              textDecoration: "none",
            }}
          >
            ARMAR EN 3D ›
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-3" style={{ gap: 10 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2, color: ACCENT }}>
            ESTACION 1 · {PIZZAS.length} RECETAS
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink, lineHeight: 1, marginTop: 2 }}>
            CHART DE ARMADO
          </h2>
        </div>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="pt-btn px-3 py-1.5 rounded-full font-semibold"
          style={{
            fontSize: 12,
            background: showLegend ? ACCENT : t.toggleBg,
            color: showLegend ? "#FFF6EC" : t.ink,
            border: `1px solid ${showLegend ? ACCENT : t.line}`,
          }}
        >
          {showLegend ? "Ocultar vasitos" : "Guía de vasitos"}
        </button>
      </div>

      {showLegend && <CupLegend />}

      <div className="flex items-center justify-between mb-3" style={{ gap: 10 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pizza o ingrediente…"
          className="pt-search flex-1 px-4 py-2.5 outline-none"
          style={{
            background: t.ticket,
            border: `1.5px solid ${t.line}`,
            color: t.ink,
            fontSize: 14,
            borderRadius: 12,
          }}
        />
        <SizeToggle size={size} setSize={setSize} />
      </div>

      <div className="flex flex-wrap mb-4" style={{ gap: 6 }}>
        {FILTERS.map(([key, label]) => {
          const on = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="pt-btn px-3 py-1 rounded-full font-bold"
              style={{
                fontFamily: DISPLAY,
                fontSize: 12.5,
                letterSpacing: 0.6,
                background: on ? t.ink : t.toggleBg,
                color: on ? t.onInk : t.muted,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {results.length === 0 ? (
        <p className="text-center py-12" style={{ color: t.muted, fontSize: 14 }}>
          Ninguna pizza coincide con “{query || FILTERS.find(([k]) => k === filter)?.[1]}”.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map((i) => {
            const p = PIZZAS[i];
            return (
              <button
                key={i}
                onClick={() => setOpen(i)}
                className="pt-card text-left p-3.5"
                style={{
                  background: t.ticket,
                  border: `1px solid ${t.line}`,
                  borderRadius: 16,
                }}
              >
                <div className="flex items-start justify-between mb-3" style={{ gap: 8 }}>
                  <MiniPizza pizza={p} size={54} />
                  <div className="flex flex-col items-end" style={{ gap: 4 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: ACCENT,
                      marginTop: 4,
                    }} />
                    {p.afterCut && (
                      <span
                        className="font-bold rounded px-1.5 py-0.5"
                        style={{
                          fontFamily: DISPLAY,
                          fontSize: 9.5,
                          letterSpacing: 0.5,
                          background: t.chip,
                          color: ACCENT,
                        }}
                      >
                        +POST
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-bold leading-tight mb-2.5" style={{ fontFamily: DISPLAY, fontSize: 17, letterSpacing: 0.4, color: t.ink }}>
                  {p.name}
                </div>
                <div className="flex" style={{ gap: 5 }}>
                  {preview(p).map((n, k) => (
                    <span
                      key={k}
                      className="flex items-center justify-center"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: t.chip,
                        border: `1px solid ${t.line}`,
                      }}
                    >
                      <Ing name={n} size={16} />
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
