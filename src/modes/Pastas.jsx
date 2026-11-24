import React, { useState } from "react";
import { PASTAS, PASTA_NOTE, SUB_NOTE, CUP, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle, sample } from "../lib/shuffle.js";
import { feedback } from "../lib/audio.js";
import { Ing } from "../components/ui.jsx";

const TIPO_COLOR = { Pasta: "#FF6600", Ensalada: "#27AE45", "Sándwich": "#2E86DE", Entrada: "#F39C12" };
const TIPOS = ["Todo", "Pasta", "Ensalada", "Sándwich", "Entrada"];

function buildMenuQuiz() {
  const qs = [];
  sample(PASTAS, Math.min(8, PASTAS.length)).forEach((dish) => {
    const others = sample(PASTAS.filter((d) => d.name !== dish.name), 3);
    const previewIngs = dish.ings.slice(0, 4).map(([n]) => n);
    qs.push({
      q: `¿Qué plato del menú (${dish.tipo}) se prepara con estos ingredientes?`,
      ings: previewIngs,
      sub: previewIngs.map((n) => ES[n] || n).join(" · "),
      options: shuffle([dish.name, ...others.map((o) => o.name)]),
      answer: dish.name,
    });
  });
  return qs;
}

export function Pastas({ soundOn = true }) {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [tipo, setTipo] = useState("Todo");
  const [query, setQuery] = useState("");
  const [quizOn, setQuizOn] = useState(false);
  const [quizQs, setQuizQs] = useState(() => buildMenuQuiz());
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [qScore, setQScore] = useState(0);

  if (quizOn) {
    const finished = qi >= quizQs.length;
    if (finished) {
      return (
        <div className="mx-auto w-full max-w-xl text-center pt-ticket p-6" style={{ paddingTop: 26 }}>
          <div style={{ color: ACCENT, fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2 }}>QUIZ DE MENÚ</div>
          <div className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 56, color: t.ink, lineHeight: 1 }}>
            {qScore}<span style={{ color: ACCENT }}>/{quizQs.length}</span>
          </div>
          <p className="mb-5" style={{ color: t.muted, fontSize: 14 }}>
            {qScore >= 6 ? "¡Dominas pastas, ensaladas y sándwiches!" : "Sigue repasando las tarjetas del menú."}
          </p>
          <div className="flex justify-center" style={{ gap: 10 }}>
            <button
              onClick={() => setQuizOn(false)}
              className="pt-btn px-4 py-3 font-bold"
              style={{ border: `1.5px solid ${t.ink}`, color: t.ink, borderRadius: 12, fontFamily: DISPLAY, fontSize: 16 }}
            >
              VER MENÚ
            </button>
            <button
              onClick={() => { setQuizQs(buildMenuQuiz()); setQi(0); setPicked(null); setQScore(0); }}
              className="pt-btn pt-btn-primary px-6 py-3 font-bold"
              style={{ borderRadius: 12, fontFamily: DISPLAY, fontSize: 16 }}
            >
              OTRO QUIZ
            </button>
          </div>
        </div>
      );
    }

    const q = quizQs[qi];
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setQuizOn(false)}
            className="pt-btn text-sm font-semibold"
            style={{ color: ACCENT, fontFamily: DISPLAY, fontSize: 15 }}
          >
            ‹ VOLVER AL MENÚ
          </button>
          <span style={{ color: t.muted, fontSize: 13 }}>
            {qi + 1}/{quizQs.length} · Puntos: <b style={{ color: ACCENT }}>{qScore}</b>
          </span>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
          <h2 className="font-bold mb-2" style={{ fontFamily: DISPLAY, fontSize: 21, color: t.ink, lineHeight: 1.15 }}>
            {q.q}
          </h2>
          <div className="flex flex-wrap my-2" style={{ gap: 8 }}>
            {q.ings.map((n, k) => (
              <span key={k} className="inline-flex items-center rounded-xl px-2.5 py-1.5" style={{ gap: 6, background: t.chip }}>
                <Ing name={n} size={18} />
                <span style={{ fontSize: 12, fontWeight: 600, color: t.ink }}>{n}</span>
              </span>
            ))}
          </div>
          <p style={{ color: t.muted, fontSize: 12 }}>{q.sub}</p>
        </div>

        <div className="flex flex-col" style={{ gap: 9 }}>
          {q.options.map((opt) => {
            const isAns = opt === q.answer;
            const isPick = opt === picked;
            let bg = t.surface, bd = t.line, fg = t.ink;
            if (picked !== null) {
              if (isAns) { bg = t.okBg; bd = CUP.green; fg = t.okFg; }
              else if (isPick) { bg = t.badBg; bd = CUP.red; fg = t.badFg; }
            }
            return (
              <button
                key={opt}
                disabled={picked !== null}
                onClick={() => {
                  setPicked(opt);
                  const ok = opt === q.answer;
                  feedback(ok, soundOn);
                  if (ok) setQScore((s) => s + 1);
                }}
                className="flex items-center justify-between text-left rounded-xl px-4 py-3 font-semibold"
                style={{ background: bg, border: `1.5px solid ${bd}`, color: fg, fontSize: 14.5 }}
              >
                <span>{opt}</span>
                {picked !== null && isAns && <span style={{ color: CUP.green }}>✓</span>}
                {picked !== null && isPick && !isAns && <span style={{ color: CUP.red }}>✕</span>}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <button
            onClick={() => { setQi(qi + 1); setPicked(null); }}
            className="w-full mt-4 py-3 rounded-full font-bold text-white"
            style={{ background: ACCENT, fontFamily: DISPLAY, fontSize: 16 }}
          >
            {qi + 1 >= quizQs.length ? "Ver resultado" : "Siguiente"}
          </button>
        )}
      </div>
    );
  }

  if (open !== null) {
    const p = PASTAS[open];
    const prevIdx = (open - 1 + PASTAS.length) % PASTAS.length;
    const nextIdx = (open + 1) % PASTAS.length;
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between mb-3" style={{ gap: 8 }}>
          <button
            onClick={() => setOpen(null)}
            className="pt-btn flex items-center text-sm font-semibold"
            style={{ color: ACCENT, gap: 4, fontFamily: DISPLAY, fontSize: 15 }}
          >
            ‹ TODO EL MENÚ
          </button>
          <div className="flex items-center" style={{ gap: 6 }}>
            <button
              onClick={() => setOpen(prevIdx)}
              className="pt-btn px-3 py-1 rounded-lg font-bold"
              style={{ border: `1px solid ${t.line}`, background: t.ticket, color: t.ink, fontFamily: DISPLAY, fontSize: 13 }}
            >
              ‹ Ant.
            </button>
            <button
              onClick={() => setOpen(nextIdx)}
              className="pt-btn px-3 py-1 rounded-lg font-bold"
              style={{ border: `1px solid ${t.line}`, background: t.ticket, color: t.ink, fontFamily: DISPLAY, fontSize: 13 }}
            >
              Sig. ›
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-1" style={{ gap: 10 }}>
          <h2 className="font-bold tracking-tight" style={{ fontFamily: DISPLAY, fontSize: 26, color: t.ink }}>
            {p.name}
          </h2>
          <span
            className="rounded-full px-3 py-1 font-bold flex-shrink-0"
            style={{ fontFamily: DISPLAY, fontSize: 12, background: TIPO_COLOR[p.tipo] || ACCENT, color: "#fff" }}
          >
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
            <div
              key={i}
              className="flex items-center rounded-xl"
              style={{ gap: 10, padding: "7px 10px", background: i % 2 ? t.zebra : t.surface, border: `1px solid ${t.line}` }}
            >
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
            <div
              key={i}
              className="flex items-start rounded-xl"
              style={{ gap: 10, padding: "8px 10px", background: t.surface, border: `1px solid ${t.line}` }}
            >
              <span
                className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
                style={{ width: 22, height: 22, fontFamily: DISPLAY, fontSize: 12, background: ACCENT, color: "#fff" }}
              >
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

  const q = query.trim().toLowerCase();
  const items = PASTAS.map((p, i) => ({ p, i })).filter(({ p }) => {
    if (tipo !== "Todo" && p.tipo !== tipo) return false;
    if (!q) return true;
    const inName = p.name.toLowerCase().includes(q);
    const inIngs = p.ings.some(([ing]) => ing.toLowerCase().includes(q) || (ES[ing] || "").toLowerCase().includes(q));
    return inName || inIngs;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-3" style={{ gap: 8 }}>
        <div className="flex flex-wrap items-center" style={{ gap: 6 }}>
          {TIPOS.map((tp) => (
            <button
              key={tp}
              onClick={() => setTipo(tp)}
              className="px-3 py-1 rounded-full font-bold transition-colors"
              style={{
                fontFamily: DISPLAY, fontSize: 12.5,
                background: tipo === tp ? (TIPO_COLOR[tp] || t.ink) : t.toggleBg,
                color: tipo === tp ? "#fff" : t.muted,
              }}
            >
              {tp === "Todo" ? "Todo" : `${tp}s`}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setQuizQs(buildMenuQuiz()); setQi(0); setPicked(null); setQScore(0); setQuizOn(true); }}
          className="pt-btn pt-btn-primary px-3.5 py-1.5 rounded-full font-bold"
          style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: 0.7 }}
        >
          ⚡ PRACTICAR MENÚ
        </button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar plato o ingrediente del menú…"
        className="pt-search w-full px-4 py-2.5 mb-3 outline-none"
        style={{
          background: t.ticket,
          border: `1.5px solid ${t.line}`,
          color: t.ink,
          fontSize: 14,
          borderRadius: 12,
        }}
      />

      <p className="mb-3" style={{ color: t.muted, fontSize: 13 }}>
        Toca un plato para ver sus cantidades y cómo se arma.
      </p>

      <a
        href="/line/index.html"
        className="block rounded-2xl p-3.5 mb-4 text-left"
        style={{
          background: t.ticket,
          border: `1.5px solid ${ACCENT}`,
          textDecoration: "none",
          color: t.ink,
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 1.4, color: ACCENT }}>JUEGO 3D · SIMULADOR EN VIVO</div>
        <div className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 19 }}>Línea pasta · ensaladas · entradas · sándwiches ›</div>
        <div style={{ color: t.muted, fontSize: 12, marginTop: 2 }}>Rail frío + baño maría + pasta + horno EDGE con las mismas recetas del chart.</div>
      </a>

      {items.length === 0 ? (
        <p className="text-center py-10" style={{ color: t.muted, fontSize: 14 }}>
          Ningún plato coincide con “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(({ p, i }) => (
            <button
              key={i}
              onClick={() => setOpen(i)}
              className="pt-card text-left p-3.5"
              style={{ background: t.ticket, border: `1px solid ${t.line}`, borderRadius: 16 }}
            >
              <div className="h-1.5 w-8 rounded-full mb-2" style={{ background: TIPO_COLOR[p.tipo] || ACCENT }} />
              <div className="font-bold leading-tight mb-1" style={{ fontFamily: DISPLAY, fontSize: 15, color: t.ink }}>
                {p.name}
              </div>
              <div className="mb-2" style={{ color: t.faint, fontSize: 10.5, letterSpacing: 0.5 }}>
                {p.tipo.toUpperCase()}
              </div>
              <div className="flex" style={{ gap: 4 }}>
                {p.ings.slice(0, 4).map(([n], k) => (
                  <span
                    key={k}
                    className="flex items-center justify-center"
                    style={{ width: 24, height: 24, borderRadius: 8, background: t.chip }}
                  >
                    <Ing name={n} size={17} />
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
