import React from "react";
import { PIZZAS, CUP, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";

export function Progreso({ stats, onClear }) {
  const t = useT();
  const exams = [...stats.exams].reverse();
  const misses = Object.entries(stats.misses).sort((a, b) => b[1] - a[1]);
  const best = stats.exams.reduce((m, e) => Math.max(m, Math.round((e.score / e.total) * 100)), 0);
  const avg = stats.exams.length
    ? Math.round(stats.exams.reduce((s, e) => s + (e.score / e.total) * 100, 0) / stats.exams.length)
    : 0;

  const fmt = (ts) => new Date(ts).toLocaleDateString("es", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  if (stats.exams.length === 0 && misses.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl text-center pt-ticket p-8" style={{ paddingTop: 28 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2, color: ACCENT }}>PROGRESO</div>
        <h2 className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink, lineHeight: 1 }}>
          Aún no hay datos
        </h2>
        <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.45 }}>
          Haz un examen o practica en Orden y aquí verás tu historial y las pizzas que más fallas.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* resumen */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          ["Exámenes", stats.exams.length],
          ["Mejor", `${best}%`],
          ["Promedio", `${avg}%`],
        ].map(([label, val], k) => (
          <div key={k} className="rounded-2xl p-3 text-center" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
            <div className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 26, color: ACCENT }}>{val}</div>
            <div style={{ color: t.muted, fontSize: 11, letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* pizzas más falladas */}
      {misses.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
            Pizzas que más fallas
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {misses.slice(0, 6).map(([name, n]) => {
              const max = misses[0][1];
              return (
                <div key={name} className="flex items-center" style={{ gap: 10 }}>
                  <span className="font-semibold" style={{ color: t.ink, fontSize: 13, width: 150, flexShrink: 0 }}>{name}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: t.toggleBg }}>
                    <div className="h-2.5 rounded-full" style={{ background: CUP.red, width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="font-bold" style={{ fontFamily: DISPLAY, color: t.ink, fontSize: 14, width: 24, textAlign: "right" }}>{n}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3" style={{ color: t.faint, fontSize: 11 }}>
            Cuenta los fallos en el examen y en el modo Orden. Repasa esas recetas.
          </p>
        </div>
      )}

      {/* historial */}
      {exams.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
            Últimos exámenes
          </h3>
          <div className="flex flex-col" style={{ gap: 6 }}>
            {exams.slice(0, 10).map((e, k) => {
              const pct = Math.round((e.score / e.total) * 100);
              return (
                <div key={k} className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: k % 2 ? t.zebra : "transparent" }}>
                  <span style={{ color: t.muted, fontSize: 12 }}>{fmt(e.date)}</span>
                  <span className="font-bold" style={{
                    fontFamily: DISPLAY, fontSize: 16,
                    color: pct >= 80 ? CUP.green : pct >= 50 ? CUP.orange : CUP.red,
                  }}>
                    {e.score}/{e.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={() => {
        if (window.confirm("¿Borrar todo tu progreso? Esto no se puede deshacer.")) onClear();
      }}
        className="px-4 py-2 rounded-full font-semibold active:scale-95 transition-transform"
        style={{ border: `1.5px solid ${CUP.red}`, color: CUP.red, fontSize: 13 }}>
        Borrar progreso
      </button>
    </div>
  );
}
