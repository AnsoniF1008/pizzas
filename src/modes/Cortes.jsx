import React, { useState } from "react";
import { ACCENT, CUP, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { feedback } from "../lib/audio.js";

function CutDiagram({ kind, size = 110, highlight = false }) {
  const t = useT();
  const stroke = highlight ? ACCENT : t.ink;
  const dash = { stroke, strokeWidth: 1.8, strokeDasharray: "5 4", fill: "none" };
  const solid = { stroke: t.ink, strokeWidth: 3.5, fill: "none" };
  const R = 46, C = 55;

  if (kind === "calzone-p" || kind === "calzone-l") {
    return (
      <svg width={size} height={size * 0.62} viewBox="0 0 110 68">
        <path d={`M 9 60 A ${R} ${R} 0 0 1 101 60 Z`} {...solid} />
        {kind === "calzone-p" ? (
          <>
            <line x1="40" y1="20" x2="40" y2="60" {...dash} />
            <line x1="47" y1="17" x2="74" y2="60" {...dash} />
          </>
        ) : (
          <>
            <line x1="34" y1="24" x2="34" y2="60" {...dash} />
            <line x1="41" y1="20" x2="55" y2="60" {...dash} />
            <line x1="69" y1="20" x2="55" y2="60" {...dash} />
            <line x1="76" y1="24" x2="76" y2="60" {...dash} />
          </>
        )}
      </svg>
    );
  }

  const lines = [];
  if (kind === "square-1") {
    lines.push([C, C - R, C, C + R], [C - R, C, C + R, C]);
  } else if (kind === "square-2") {
    [-15, 15].forEach((o) => {
      lines.push([C + o, C - R, C + o, C + R], [C - R, C + o, C + R, C + o]);
    });
  } else if (kind === "square-3") {
    [-23, 0, 23].forEach((o) => {
      lines.push([C + o, C - R, C + o, C + R], [C - R, C + o, C + R, C + o]);
    });
  } else if (kind === "bread") {
    for (let i = 1; i <= 7; i++) {
      const x = C - R + (i * 2 * R) / 8;
      lines.push([x, C - R, x, C + R]);
    }
    lines.push([C - R, C, C + R, C]);
  } else if (kind === "triangle-6") {
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6;
      lines.push([C - R * Math.cos(a), C - R * Math.sin(a), C + R * Math.cos(a), C + R * Math.sin(a)]);
    }
  } else if (kind === "triangle-8") {
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 4;
      lines.push([C - R * Math.cos(a), C - R * Math.sin(a), C + R * Math.cos(a), C + R * Math.sin(a)]);
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 110 110">
      <defs>
        <clipPath id={`clip-${kind}-${size}`}><circle cx={C} cy={C} r={R - 1} /></clipPath>
      </defs>
      <circle cx={C} cy={C} r={R} {...solid} />
      <g clipPath={`url(#clip-${kind}-${size})`}>
        {lines.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...dash} />
        ))}
      </g>
    </svg>
  );
}

const CUTS = [
  { kind: "square-1", title: 'KIDS · 6"', desc: "Corte cuadrado: 1 corte vertical y 1 horizontal." },
  { kind: "square-2", title: 'PERSONAL · 10"', desc: "Corte cuadrado: 2 cortes verticales y 2 horizontales." },
  { kind: "square-3", title: 'LARGE 14" / XL 16"', desc: "Corte cuadrado: 3 cortes verticales y 3 horizontales." },
  { kind: "calzone-p", title: "CALZONE PERSONAL", desc: "2 cortes. Se sirve con 1 marinara." },
  { kind: "calzone-l", title: "CALZONE GRANDE", desc: "4 cortes. Se sirve con 2 marinaras." },
  { kind: "bread", title: "GARLIC CHEESE BREAD", desc: "7 cortes verticales y 1 horizontal." },
  { kind: "triangle-6", title: "TRIÁNGULO · PERSONAL", desc: "Corte de triángulo (stuffed crust): 6 porciones." },
  { kind: "triangle-8", title: "TRIÁNGULO · LARGE", desc: "Corte de triángulo (stuffed crust): 8 porciones." },
];

function makeCutQuiz() {
  return shuffle(CUTS).slice(0, 6).map((target) => {
    const others = shuffle(CUTS.filter((c) => c.kind !== target.kind)).slice(0, 3);
    return {
      target,
      options: shuffle([target, ...others]),
    };
  });
}

export function Cortes({ soundOn = true }) {
  const t = useT();
  const [selected, setSelected] = useState(null);
  const [drillOn, setDrillOn] = useState(false);
  const [qs, setQs] = useState(makeCutQuiz);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  if (drillOn) {
    const done = qi >= qs.length;
    if (done) {
      return (
        <div className="mx-auto w-full max-w-xl text-center pt-ticket p-6" style={{ paddingTop: 26 }}>
          <div style={{ color: ACCENT, fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2 }}>PRÁCTICA DE CORTES</div>
          <div className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 56, color: t.ink, lineHeight: 1 }}>
            {score}<span style={{ color: ACCENT }}>/{qs.length}</span>
          </div>
          <p className="mb-5" style={{ color: t.muted, fontSize: 14 }}>
            {score >= 5 ? "¡Tienes dominados los cortes del horno!" : "Repasa los diagramas de corte e intenta otra vez."}
          </p>
          <div className="flex justify-center" style={{ gap: 10 }}>
            <button
              onClick={() => setDrillOn(false)}
              className="pt-btn px-4 py-3 font-bold"
              style={{ border: `1.5px solid ${t.ink}`, color: t.ink, borderRadius: 12, fontFamily: DISPLAY, fontSize: 16 }}
            >
              VER DIAGRAMAS
            </button>
            <button
              onClick={() => { setQs(makeCutQuiz()); setQi(0); setPicked(null); setScore(0); }}
              className="pt-btn pt-btn-primary px-6 py-3 font-bold"
              style={{ borderRadius: 12, fontFamily: DISPLAY, fontSize: 16 }}
            >
              OTRA RONDA
            </button>
          </div>
        </div>
      );
    }

    const q = qs[qi];
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setDrillOn(false)}
            className="pt-btn text-sm font-semibold"
            style={{ color: ACCENT, fontFamily: DISPLAY, fontSize: 15 }}
          >
            ‹ VOLVER A CORTES
          </button>
          <span style={{ color: t.muted, fontSize: 13 }}>
            {qi + 1}/{qs.length} · Puntos: <b style={{ color: ACCENT }}>{score}</b>
          </span>
        </div>

        <div className="pt-ticket p-4 mb-4 text-center" style={{ paddingTop: 22 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 1.5, color: ACCENT }}>
            ¿QUÉ DIAGRAMA CORRESPONDE?
          </div>
          <h2 className="font-bold mt-1" style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink }}>
            {q.target.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt) => {
            const isAns = opt.kind === q.target.kind;
            const isPick = opt.kind === picked;
            let bg = t.ticket, bd = t.line;
            if (picked !== null) {
              if (isAns) { bg = t.okBg; bd = CUP.green; }
              else if (isPick) { bg = t.badBg; bd = CUP.red; }
            }
            return (
              <button
                key={opt.kind}
                disabled={picked !== null}
                onClick={() => {
                  setPicked(opt.kind);
                  const ok = opt.kind === q.target.kind;
                  feedback(ok, soundOn);
                  if (ok) setScore((s) => s + 1);
                }}
                className="rounded-2xl p-3 flex flex-col items-center justify-center"
                style={{ background: bg, border: `2px solid ${bd}`, minHeight: 135 }}
              >
                <CutDiagram kind={opt.kind} size={96} highlight={picked !== null && isAns} />
                {picked !== null && (
                  <span className="mt-1 font-semibold" style={{ fontSize: 11, color: isAns ? t.okFg : t.badFg }}>
                    {opt.desc}
                  </span>
                )}
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
            {qi + 1 >= qs.length ? "Ver resultado" : "Siguiente"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-wrap items-center justify-between mb-3" style={{ gap: 8 }}>
        <p style={{ color: t.muted, fontSize: 13 }}>
          Cómo se corta cada producto al salir del horno. Toca una tarjeta para resaltar las líneas.
        </p>
        <button
          onClick={() => { setQs(makeCutQuiz()); setQi(0); setPicked(null); setScore(0); setDrillOn(true); }}
          className="pt-btn pt-btn-primary px-4 py-2 rounded-full font-bold"
          style={{ fontFamily: DISPLAY, fontSize: 13.5, letterSpacing: 0.7 }}
        >
          🔪 PRACTICAR CORTES
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {CUTS.map((c, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(active ? null : i)}
              className="pt-card rounded-2xl p-3 text-center flex flex-col items-center"
              style={{
                background: t.ticket,
                border: `1.5px solid ${active ? ACCENT : t.line}`,
              }}
            >
              <CutDiagram kind={c.kind} highlight={active} />
              <div className="font-bold mt-1" style={{ fontFamily: DISPLAY, fontSize: 14, color: active ? ACCENT : t.ink }}>
                {c.title}
              </div>
              <div style={{ color: t.muted, fontSize: 11.5, lineHeight: 1.3 }}>{c.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-4" style={{ background: t.ticket, border: `1px solid ${t.line}` }}>
        <h3 className="font-bold mb-2" style={{ fontFamily: DISPLAY, fontSize: 16, color: t.ink }}>
          Toques al salir del horno
        </h3>
        <ul className="flex flex-col" style={{ gap: 8, color: t.ink, fontSize: 13.5, lineHeight: 1.4 }}>
          <li>🧀 <b>Parmesano encima:</b> Big Cheesy, Blanco, Margherita, Tuscany y Veggie.</li>
          <li>🌿 <b>Cebollín (chives) encima:</b> Potato Head.</li>
          <li>🌿 <b>Cilantro encima:</b> Smokin' Luau.</li>
          <li>🌮 <b>Taco Pizza post-corte:</b> Lechuga rallada, tomate picado, cheddar y ranch drizzle.</li>
          <li>🥣 <b>Calzones:</b> personal con 1 marinara, grande con 2 marinaras.</li>
          <li>🧄 <b>Garlic knots, cheese bread y stuffed crust:</b> espolvorear queso parmesano con perejil.</li>
        </ul>
      </div>
    </div>
  );
}
