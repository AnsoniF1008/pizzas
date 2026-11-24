import React from "react";
import { PIZZAS, CUP, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
import { load } from "../lib/storage.js";

export function Progreso({ stats, onClear, onPracticePizza }) {
  const t = useT();
  const exams = [...stats.exams].reverse();
  const misses = Object.entries(stats.misses).sort((a, b) => b[1] - a[1]);
  const best = stats.exams.reduce((m, e) => Math.max(m, Math.round((e.score / e.total) * 100)), 0);
  const avg = stats.exams.length
    ? Math.round(stats.exams.reduce((s, e) => s + (e.score / e.total) * 100, 0) / stats.exams.length)
    : 0;

  const pizza3d = load("pizza3d_records_v1", {});
  const line3d = load("pizzaline3d_records_v1", {});
  const has3d = Boolean(pizza3d.bestScore || pizza3d.games || line3d.bestScore || line3d.games);

  const fmt = (ts) => new Date(ts).toLocaleDateString("es", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  if (stats.exams.length === 0 && misses.length === 0 && !has3d) {
    return (
      <div className="mx-auto w-full max-w-xl text-center pt-ticket p-8" style={{ paddingTop: 28 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2, color: ACCENT }}>PROGRESO</div>
        <h2 className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink, lineHeight: 1 }}>
          Aún no hay datos
        </h2>
        <p className="mb-5" style={{ color: t.muted, fontSize: 14, lineHeight: 1.45 }}>
          Haz un examen, practica en Orden o juega un turno en los simuladores 3D y aquí verás tus récords y las pizzas que más fallas.
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: 10 }}>
          <a
            href="/3d/index.html"
            className="pt-btn pt-btn-primary px-5 py-2.5 font-bold"
            style={{ fontFamily: DISPLAY, fontSize: 15, letterSpacing: 0.8, borderRadius: 12, textDecoration: "none" }}
          >
            🍕 PIZZA 3D
          </a>
          <a
            href="/line/index.html"
            className="pt-btn px-5 py-2.5 font-bold"
            style={{ fontFamily: DISPLAY, fontSize: 15, letterSpacing: 0.8, borderRadius: 12, border: `1.5px solid ${t.ink}`, color: t.ink, textDecoration: "none" }}
          >
            🥗 LÍNEA 3D
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* resumen estudio */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          ["Exámenes", stats.exams.length],
          ["Mejor", `${best}%`],
          ["Promedio", `${avg}%`],
        ].map(([label, val], k) => (
          <div key={k} className="rounded-2xl p-3 text-center" style={{ background: t.ticket, border: `1px solid ${t.line}` }}>
            <div className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 26, color: ACCENT }}>{val}</div>
            <div style={{ color: t.muted, fontSize: 11, letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Récords de los 2 juegos 3D */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <a
          href="/3d/index.html"
          className="rounded-2xl p-3.5 block"
          style={{ background: t.ticket, border: `1px solid ${t.line}`, textDecoration: "none", color: t.ink }}
        >
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 1.4, color: ACCENT }}>JUEGO 1 · PIZZAS 3D</span>
            <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700 }}>Jugar ›</span>
          </div>
          <div className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 22 }}>
            {pizza3d.bestScore || 0} <span style={{ fontSize: 13, color: t.muted }}>pts récord</span>
          </div>
          <div style={{ color: t.muted, fontSize: 11.5, marginTop: 2 }}>
            Racha: {pizza3d.bestStreak || 0} · Pizzas: {pizza3d.mostServed || 0} · Turnos: {pizza3d.games || 0}
          </div>
        </a>

        <a
          href="/line/index.html"
          className="rounded-2xl p-3.5 block"
          style={{ background: t.ticket, border: `1px solid ${t.line}`, textDecoration: "none", color: t.ink }}
        >
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 1.4, color: CUP.green }}>JUEGO 2 · LÍNEA 3D</span>
            <span style={{ fontSize: 11, color: CUP.green, fontWeight: 700 }}>Jugar ›</span>
          </div>
          <div className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 22 }}>
            {line3d.bestScore || 0} <span style={{ fontSize: 13, color: t.muted }}>pts récord</span>
          </div>
          <div style={{ color: t.muted, fontSize: 11.5, marginTop: 2 }}>
            Racha: {line3d.bestStreak || 0} · Platos: {line3d.mostServed || 0} · Turnos: {line3d.games || 0}
          </div>
        </a>
      </div>

      {/* pizzas más falladas */}
      {misses.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: t.ticket, border: `1px solid ${t.line}` }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
            Pizzas que más fallas
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {misses.slice(0, 6).map(([name, n]) => {
              const max = misses[0][1];
              const pIdx = PIZZAS.findIndex((p) => p.name === name);
              return (
                <div key={name} className="flex items-center" style={{ gap: 10 }}>
                  <span className="font-semibold truncate" style={{ color: t.ink, fontSize: 13, width: 140, flexShrink: 0 }}>{name}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: t.toggleBg }}>
                    <div className="h-2.5 rounded-full" style={{ background: CUP.red, width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="font-bold" style={{ fontFamily: DISPLAY, color: t.ink, fontSize: 14, width: 22, textAlign: "right" }}>{n}</span>
                  {pIdx !== -1 && onPracticePizza && (
                    <button
                      onClick={() => onPracticePizza(pIdx)}
                      className="pt-btn px-2.5 py-1 rounded-lg font-bold"
                      style={{ fontFamily: DISPLAY, fontSize: 11.5, background: ACCENT, color: "#fff" }}
                    >
                      ORDEN
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3" style={{ color: t.faint, fontSize: 11 }}>
            Cuenta los fallos en el examen y en el modo Orden. Toca ORDEN para practicar esa receta.
          </p>
        </div>
      )}

      {/* historial */}
      {exams.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: t.ticket, border: `1px solid ${t.line}` }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
            Últimos exámenes
          </h3>
          <div className="flex flex-col" style={{ gap: 6 }}>
            {exams.slice(0, 10).map((e, k) => {
              const pct = Math.round((e.score / e.total) * 100);
              return (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: k % 2 ? t.zebra : "transparent" }}
                >
                  <span style={{ color: t.muted, fontSize: 12 }}>{fmt(e.date)}</span>
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: DISPLAY, fontSize: 16,
                      color: pct >= 80 ? CUP.green : pct >= 50 ? CUP.orange : CUP.red,
                    }}
                  >
                    {e.score}/{e.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(stats.exams.length > 0 || misses.length > 0) && (
        <button
          onClick={() => {
            if (window.confirm("¿Borrar todo tu progreso de estudio? Esto no se puede deshacer.")) onClear();
          }}
          className="px-4 py-2 rounded-full font-semibold active:scale-95 transition-transform"
          style={{ border: `1.5px solid ${CUP.red}`, color: CUP.red, fontSize: 13 }}
        >
          Borrar progreso
        </button>
      )}
    </div>
  );
}
