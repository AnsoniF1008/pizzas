import React, { useState } from "react";
import { PASTAS, PASTA_NOTE, SUB_NOTE, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { Ing } from "../components/ui.jsx";

const TIPO_COLOR = { Pasta: "#FF6600", Ensalada: "#27AE45", "Sándwich": "#2E86DE", Entrada: "#F39C12" };
const TIPOS = ["Todo", "Pasta", "Ensalada", "Sándwich", "Entrada"];

export function Pastas() {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [tipo, setTipo] = useState("Todo");

  if (open !== null) {
    const p = PASTAS[open];
    return (
      <div className="mx-auto w-full max-w-xl">
        <button onClick={() => setOpen(null)}
          className="flex items-center text-sm font-semibold mb-3" style={{ color: ACCENT, gap: 4 }}>
          ‹ Todo el menú
        </button>
        <div className="flex items-center justify-between mb-1" style={{ gap: 10 }}>
          <h2 className="font-bold tracking-tight" style={{ fontFamily: DISPLAY, fontSize: 24, color: t.ink }}>
            {p.name}
          </h2>
          <span className="rounded-full px-3 py-1 font-bold flex-shrink-0"
            style={{ fontFamily: DISPLAY, fontSize: 12, background: TIPO_COLOR[p.tipo] || ACCENT, color: "#fff" }}>
            {p.tipo.toUpperCase()}
          </span>
        </div>
        {p.note && (
          <p className="mb-2 font-semibold" style={{ color: ACCENT, fontSize: 13 }}>{p.note}</p>
        )}

        <h3 className="font-bold mt-3 mb-2" style={{ fontFamily: DISPLAY, fontSize: 14, letterSpacing: 0.8, color: t.muted }}>
          INGREDIENTES
        </h3>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {p.ings.map(([ing, qty], i) => (
            <div key={i} className="flex items-center rounded-xl"
              style={{ gap: 10, padding: "7px 10px", background: i % 2 ? t.zebra : t.surface, border: `1px solid ${t.line}` }}>
              <span className="flex items-center justify-center" style={{ width: 26, height: 26, flexShrink: 0 }}>
                <Ing name={ing} size={22} />
              </span>
              <span className="flex-1 leading-tight">
                <span className="font-semibold" style={{ color: t.ink, fontSize: 14 }}>{ing}</span>
                <span className="block" style={{ color: t.muted, fontSize: 11 }}>{ES[ing]}</span>
              </span>
              <span className="font-semibold text-right" style={{ color: t.ink, fontSize: 12, maxWidth: 140 }}>{qty}</span>
            </div>
          ))}
        </div>

        <h3 className="font-bold mt-4 mb-2" style={{ fontFamily: DISPLAY, fontSize: 14, letterSpacing: 0.8, color: t.muted }}>
          CÓMO SE ARMA
        </h3>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {p.como.map((paso, i) => (
            <div key={i} className="flex items-start rounded-xl"
              style={{ gap: 10, padding: "8px 10px", background: t.surface, border: `1px solid ${t.line}` }}>
              <span className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
                style={{ width: 22, height: 22, fontFamily: DISPLAY, fontSize: 12, background: ACCENT, color: "#fff" }}>
                {i + 1}
              </span>
              <span style={{ color: t.ink, fontSize: 13.5, lineHeight: 1.35 }}>{paso}</span>
            </div>
          ))}
        </div>

        {p.tipo === "Pasta" && (
          <p className="rounded-xl px-3 py-2 mt-3" style={{ background: t.zebra, border: `1px dashed ${t.line}`, color: t.muted, fontSize: 12 }}>
            <span style={{ color: ACCENT, fontFamily: DISPLAY, letterSpacing: 1, marginRight: 6 }}>TIP</span>
            {PASTA_NOTE}
          </p>
        )}
        {p.tipo === "Sándwich" && (
          <p className="rounded-xl px-3 py-2 mt-3" style={{ background: t.zebra, border: `1px dashed ${t.line}`, color: t.muted, fontSize: 12 }}>
            <span style={{ color: ACCENT, fontFamily: DISPLAY, letterSpacing: 1, marginRight: 6 }}>TIP</span>
            {SUB_NOTE}
          </p>
        )}
      </div>
    );
  }

  const items = PASTAS.map((p, i) => ({ p, i })).filter(({ p }) => tipo === "Todo" || p.tipo === tipo);

  return (
    <div>
      <div className="flex flex-wrap items-center mb-3" style={{ gap: 6 }}>
        {TIPOS.map((tp) => (
          <button key={tp} onClick={() => setTipo(tp)}
            className="px-3 py-1 rounded-full font-bold transition-colors"
            style={{
              fontFamily: DISPLAY, fontSize: 12.5,
              background: tipo === tp ? (TIPO_COLOR[tp] || t.ink) : t.toggleBg,
              color: tipo === tp ? "#fff" : t.muted,
            }}>
            {tp === "Todo" ? "Todo" : `${tp}s`}
          </button>
        ))}
      </div>
      <p className="mb-3" style={{ color: t.muted, fontSize: 13 }}>
        Toca un plato para ver sus cantidades y cómo se arma.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map(({ p, i }) => (
          <button key={i} onClick={() => setOpen(i)}
            className="text-left rounded-2xl p-3 active:scale-95 transition-transform"
            style={{ background: t.surface, border: `1px solid ${t.line}` }}>
            <div className="h-1.5 w-8 rounded-full mb-2"
              style={{ background: TIPO_COLOR[p.tipo] || ACCENT }} />
            <div className="font-bold leading-tight mb-1" style={{ fontFamily: DISPLAY, fontSize: 15, color: t.ink }}>
              {p.name}
            </div>
            <div className="mb-2" style={{ color: t.faint, fontSize: 10.5, letterSpacing: 0.5 }}>
              {p.tipo.toUpperCase()}
            </div>
            <div className="flex" style={{ gap: 4 }}>
              {p.ings.slice(0, 4).map(([n], k) => (
                <span key={k} className="flex items-center justify-center"
                  style={{ width: 24, height: 24, borderRadius: 8, background: t.chip }}>
                  <Ing name={n} size={17} />
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
