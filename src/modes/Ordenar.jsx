import React, { useState, useMemo } from "react";
import { PIZZAS, fullBuild, CUP, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { feedback } from "../lib/audio.js";
import { Ing, Amount, SizeToggle } from "../components/ui.jsx";

export function Ordenar({ size, setSize, soundOn, onMiss }) {
  const t = useT();
  const [pi, setPi] = useState(() => Math.floor(Math.random() * PIZZAS.length));
  const [placedCount, setPlacedCount] = useState(0);
  const [used, setUsed] = useState(() => new Set());
  const [errors, setErrors] = useState(0);
  const [wrongIdx, setWrongIdx] = useState(null);

  const p = PIZZAS[pi];
  const steps = useMemo(() => fullBuild(p), [pi]);
  const shuffled = useMemo(() => shuffle(steps.map((_, i) => i)), [pi]);
  const done = placedCount >= steps.length;

  const valFor = (row) => JSON.stringify(size === "10" ? row[1] : row[2]);

  const nextPizza = () => {
    let n = Math.floor(Math.random() * PIZZAS.length);
    if (n === pi) n = (n + 1) % PIZZAS.length;
    setPi(n); setPlacedCount(0); setUsed(new Set()); setErrors(0); setWrongIdx(null);
  };

  const tap = (bi) => {
    if (done || used.has(bi)) return;
    const expected = steps[placedCount];
    const cand = steps[bi];
    const ok = bi === placedCount ||
      (cand[0] === expected[0] && valFor(cand) === valFor(expected));
    if (ok) {
      feedback(true, soundOn);
      setUsed((u) => new Set(u).add(bi));
      setPlacedCount((c) => c + 1);
      setWrongIdx(null);
    } else {
      feedback(false, soundOn);
      setErrors((e) => e + 1);
      setWrongIdx(bi);
      onMiss(p.name);
      setTimeout(() => setWrongIdx(null), 500);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 2, color: ACCENT }}>PRACTICA</div>
          <div style={{ color: t.muted, fontSize: 13 }}>Toca los pasos en orden</div>
        </div>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      <div className="pt-ticket p-4 mb-3" style={{ paddingTop: 20 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink, lineHeight: 1 }}>
            {p.name}
          </h2>
          <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 15, color: errors ? CUP.red : t.muted }}>
            Errores: {errors}
          </span>
        </div>

        {/* Pizza en construcción */}
        <div className="rounded-xl p-2 mb-4" style={{ background: t.zebra, border: `1px dashed ${t.line}`, minHeight: 56 }}>
          {placedCount === 0 ? (
            <p className="text-center py-3" style={{ color: t.faint, fontSize: 12 }}>
              Masa lista. ¿Qué va primero?
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: 4 }}>
              {steps.slice(0, placedCount).map((row, i) => (
                <div key={i} className="flex items-center rounded-lg px-2 py-1" style={{ gap: 8, background: t.surface }}>
                  <span style={{ color: t.faint, fontSize: 11, width: 18 }}>{i + 1}.</span>
                  <Ing name={row[0]} size={17} />
                  <span className="flex-1 font-semibold" style={{ color: t.ink, fontSize: 13 }}>{row[0]}</span>
                  <Amount value={size === "10" ? row[1] : row[2]} />
                </div>
              ))}
            </div>
          )}
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="font-bold mb-1" style={{ fontFamily: DISPLAY, fontSize: 30, color: errors === 0 ? CUP.green : ACCENT }}>
              {errors === 0 ? "¡Perfecta!" : "¡Lista!"}
            </div>
            <p className="mb-4" style={{ color: t.muted, fontSize: 14 }}>
              {errors === 0 ? "La armaste sin un solo error." : `La armaste con ${errors} ${errors === 1 ? "error" : "errores"}.`}
            </p>
            <button onClick={nextPizza}
              className="pt-btn pt-btn-primary px-7 py-3 font-bold"
              style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}>
              OTRA PIZZA ›
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shuffled.filter((bi) => !used.has(bi)).map((bi) => {
              const row = steps[bi];
              const isWrong = wrongIdx === bi;
              return (
                <button key={bi} onClick={() => tap(bi)}
                  className="flex items-center text-left rounded-xl px-3 py-2 active:scale-[.98] transition-transform"
                  style={{
                    gap: 8,
                    background: isWrong ? t.badBg : t.surface,
                    border: `1.5px solid ${isWrong ? CUP.red : t.line}`,
                  }}>
                  <Ing name={row[0]} size={20} />
                  <span className="flex-1 leading-tight">
                    <span className="font-semibold block" style={{ color: isWrong ? t.badFg : t.ink, fontSize: 13 }}>{row[0]}</span>
                    <span style={{ color: t.muted, fontSize: 11 }}>{ES[row[0]]}</span>
                  </span>
                  <Amount value={size === "10" ? row[1] : row[2]} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!done && (
        <button onClick={nextPizza}
          className="px-4 py-2 rounded-full font-semibold active:scale-95 transition-transform"
          style={{ border: `1.5px solid ${t.ink}`, color: t.ink, fontSize: 13 }}>
          Saltar esta pizza
        </button>
      )}
    </div>
  );
}
