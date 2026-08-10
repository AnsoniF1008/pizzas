import React, { useState } from "react";
import { PIZZAS, fullBuild, BASE_INGS, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { MiniPizza, Ing, SizeToggle, BuildList } from "../components/ui.jsx";

export function Repaso({ size, setSize }) {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");

  const preview = (p) =>
    fullBuild(p).map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
      .filter((n) => !BASE_INGS.includes(n)).slice(0, 4);

  const q = query.trim().toLowerCase();
  const results = q === "" ? PIZZAS.map((_, i) => i) : PIZZAS.map((p, i) => {
    const inName = p.name.toLowerCase().includes(q);
    const inIngs = fullBuild(p).some(([ing]) =>
      ing.toLowerCase().includes(q) || (ES[ing] || "").toLowerCase().includes(q));
    return inName || inIngs ? i : -1;
  }).filter((i) => i !== -1);

  if (open !== null) {
    const p = PIZZAS[open];
    return (
      <div className="mx-auto w-full max-w-xl">
        <button
          onClick={() => setOpen(null)}
          className="pt-btn flex items-center text-sm font-semibold mb-4"
          style={{ color: ACCENT, gap: 6, fontFamily: DISPLAY, letterSpacing: 0.8, fontSize: 15 }}
        >
          ‹ TODAS LAS PIZZAS
        </button>
        <div className="flex items-start justify-between mb-2" style={{ gap: 12 }}>
          <div className="flex items-center" style={{ gap: 12, minWidth: 0 }}>
            <MiniPizza pizza={p} size={64} />
            <h2 className="font-bold tracking-tight" style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 8vw, 36px)", color: t.ink, lineHeight: 0.95 }}>
              {p.name}
            </h2>
          </div>
          <SizeToggle size={size} setSize={setSize} />
        </div>
        <p className="mb-4" style={{ color: t.muted, fontSize: 13, lineHeight: 1.45 }}>
          Arma de arriba hacia abajo. Tres secciones de línea, luego horno.
        </p>
        <BuildList pizza={p} size={size} animate show />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2, color: ACCENT }}>
          ESTACION 1
        </div>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink, lineHeight: 1, marginTop: 2 }}>
          CHART DE ARMADO
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4" style={{ gap: 10 }}>
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

      {results.length === 0 ? (
        <p className="text-center py-12" style={{ color: t.muted, fontSize: 14 }}>
          Ninguna pizza lleva “{query}”.
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
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: ACCENT,
                    marginTop: 4,
                  }} />
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
