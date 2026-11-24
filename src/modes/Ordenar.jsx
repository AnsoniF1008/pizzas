import React, { useState, useMemo, useEffect } from "react";
import { PIZZAS, fullBuild, SECTIONS, CUP, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { feedback } from "../lib/audio.js";
import { Ing, Amount, SizeToggle } from "../components/ui.jsx";

function sectionForStep(pizza, stepIdx) {
  const buildLen = pizza.build.length;
  if (stepIdx >= buildLen) return 3;
  const [s1, s2len] = pizza.sec || [buildLen, 0];
  if (stepIdx < s1) return 0;
  if (stepIdx < s1 + s2len) return 1;
  return 2;
}

export function Ordenar({ size, setSize, soundOn, onMiss, initialPizzaIdx = null, misses = {} }) {
  const t = useT();
  const [pi, setPi] = useState(() =>
    initialPizzaIdx !== null ? initialPizzaIdx : Math.floor(Math.random() * PIZZAS.length)
  );
  const [placedCount, setPlacedCount] = useState(0);
  const [used, setUsed] = useState(() => new Set());
  const [errors, setErrors] = useState(0);
  const [wrongIdx, setWrongIdx] = useState(null);
  const [hintIdx, setHintIdx] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (initialPizzaIdx !== null && initialPizzaIdx >= 0 && initialPizzaIdx < PIZZAS.length) {
      setPi(initialPizzaIdx);
      setPlacedCount(0);
      setUsed(new Set());
      setErrors(0);
      setWrongIdx(null);
      setHintIdx(null);
    }
  }, [initialPizzaIdx]);

  const p = PIZZAS[pi];
  const steps = useMemo(() => fullBuild(p), [pi]);
  const shuffled = useMemo(() => shuffle(steps.map((_, i) => i)), [pi]);
  const done = placedCount >= steps.length;

  const valFor = (row) => JSON.stringify(size === "10" ? row[1] : row[2]);

  const selectPizza = (idx) => {
    setPi(idx);
    setPlacedCount(0);
    setUsed(new Set());
    setErrors(0);
    setWrongIdx(null);
    setHintIdx(null);
  };

  const nextPizza = () => {
    let n = Math.floor(Math.random() * PIZZAS.length);
    if (n === pi) n = (n + 1) % PIZZAS.length;
    selectPizza(n);
  };

  const practiceMissed = () => {
    const missedIdx = PIZZAS
      .map((pz, idx) => ({ idx, count: misses[pz.name] || 0 }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count);
    if (!missedIdx.length) return;
    const pick = missedIdx.find((x) => x.idx !== pi) || missedIdx[0];
    selectPizza(pick.idx);
  };

  const showHint = () => {
    if (done) return;
    const expected = steps[placedCount];
    const match = shuffled.find(
      (bi) => !used.has(bi) && (bi === placedCount || (steps[bi][0] === expected[0] && valFor(steps[bi]) === valFor(expected)))
    );
    if (match !== undefined) setHintIdx(match);
  };

  const tap = (bi) => {
    if (done || used.has(bi)) return;
    const expected = steps[placedCount];
    const cand = steps[bi];
    const ok = bi === placedCount ||
      (cand[0] === expected[0] && valFor(cand) === valFor(expected));
    if (ok) {
      feedback(true, soundOn);
      const nextCount = placedCount + 1;
      setUsed((u) => new Set(u).add(bi));
      setPlacedCount(nextCount);
      setWrongIdx(null);
      setHintIdx(null);
      if (nextCount >= steps.length && errors === 0) {
        setStreak((s) => s + 1);
      }
    } else {
      feedback(false, soundOn);
      setErrors((e) => e + 1);
      setStreak(0);
      setWrongIdx(bi);
      onMiss(p.name);
      setTimeout(() => setWrongIdx(null), 500);
    }
  };

  const currentSec = sectionForStep(p, Math.min(placedCount, steps.length - 1));
  const hasMisses = Object.values(misses).some((n) => n > 0);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between mb-3" style={{ gap: 8 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 2, color: ACCENT }}>PRACTICA EN ORDEN</div>
          <div style={{ color: t.muted, fontSize: 13 }}>
            Toca los pasos de arriba hacia abajo {streak > 0 && `· 🔥 Racha ${streak}`}
          </div>
        </div>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      {/* selector de pizza */}
      <div className="flex flex-wrap items-center mb-3" style={{ gap: 8 }}>
        <select
          value={pi}
          onChange={(e) => selectPizza(Number(e.target.value))}
          aria-label="Elegir pizza para practicar"
          className="flex-1 rounded-xl px-3 py-2 font-semibold outline-none"
          style={{
            background: t.ticket,
            border: `1.5px solid ${t.line}`,
            color: t.ink,
            fontSize: 13.5,
            minWidth: 180,
          }}
        >
          {PIZZAS.map((pz, idx) => (
            <option key={pz.name} value={idx}>
              {pz.name} ({fullBuild(pz).length} pasos)
            </option>
          ))}
        </select>
        {hasMisses && (
          <button
            onClick={practiceMissed}
            className="pt-btn px-3 py-2 rounded-xl font-bold"
            style={{
              background: t.badBg,
              color: t.badFg,
              border: `1px solid ${CUP.red}`,
              fontFamily: DISPLAY,
              fontSize: 13,
              letterSpacing: 0.6,
            }}
          >
            REPASAR FALLADAS
          </button>
        )}
      </div>

      <div className="pt-ticket p-4 mb-3" style={{ paddingTop: 20 }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 28, color: t.ink, lineHeight: 1 }}>
              {p.name}
            </h2>
            {!done && (
              <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700, marginTop: 3 }}>
                Ahora: {SECTIONS[currentSec].label} · Paso {placedCount + 1}/{steps.length}
              </div>
            )}
          </div>
          <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 15, color: errors ? CUP.red : t.muted }}>
            Errores: {errors}
          </span>
        </div>

        {/* barra de progreso */}
        <div className="h-1.5 rounded-full mb-3" style={{ background: t.toggleBg }}>
          <div
            className="h-1.5 rounded-full"
            style={{
              background: done ? CUP.green : ACCENT,
              width: `${(placedCount / steps.length) * 100}%`,
              transition: "width .25s ease",
            }}
          />
        </div>

        {/* Pizza en construcción */}
        <div className="rounded-xl p-2 mb-4" style={{ background: t.zebra, border: `1px dashed ${t.line}`, minHeight: 56 }}>
          {placedCount === 0 ? (
            <p className="text-center py-3" style={{ color: t.faint, fontSize: 12 }}>
              Masa lista. ¿Qué va primero?
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: 4 }}>
              {steps.slice(0, placedCount).map((row, i) => {
                const sec = sectionForStep(p, i);
                const prevSec = i > 0 ? sectionForStep(p, i - 1) : -1;
                return (
                  <React.Fragment key={i}>
                    {sec !== prevSec && (
                      <div style={{ fontFamily: DISPLAY, fontSize: 10.5, letterSpacing: 1, color: ACCENT, padding: "2px 4px 0" }}>
                        {SECTIONS[sec].label}
                      </div>
                    )}
                    <div className="flex items-center rounded-lg px-2 py-1" style={{ gap: 8, background: t.surface }}>
                      <span style={{ color: t.faint, fontSize: 11, width: 18 }}>{i + 1}.</span>
                      <Ing name={row[0]} size={17} />
                      <span className="flex-1 font-semibold" style={{ color: t.ink, fontSize: 13 }}>{row[0]}</span>
                      <Amount value={size === "10" ? row[1] : row[2]} />
                    </div>
                  </React.Fragment>
                );
              })}
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
            <div className="flex justify-center" style={{ gap: 10 }}>
              <button
                onClick={() => selectPizza(pi)}
                className="pt-btn px-4 py-3 font-bold"
                style={{ border: `1.5px solid ${t.ink}`, color: t.ink, fontFamily: DISPLAY, fontSize: 16, borderRadius: 12 }}
              >
                REPETIR
              </button>
              <button
                onClick={nextPizza}
                className="pt-btn pt-btn-primary px-7 py-3 font-bold"
                style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}
              >
                OTRA PIZZA ›
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shuffled.filter((bi) => !used.has(bi)).map((bi) => {
              const row = steps[bi];
              const isWrong = wrongIdx === bi;
              const isHint = hintIdx === bi;
              return (
                <button
                  key={bi}
                  onClick={() => tap(bi)}
                  className="flex items-center text-left rounded-xl px-3 py-2 active:scale-[.98] transition-transform"
                  style={{
                    gap: 8,
                    background: isWrong ? t.badBg : isHint ? t.okBg : t.surface,
                    border: `1.5px solid ${isWrong ? CUP.red : isHint ? CUP.green : t.line}`,
                  }}
                >
                  <Ing name={row[0]} size={20} />
                  <span className="flex-1 leading-tight">
                    <span className="font-semibold block" style={{ color: isWrong ? t.badFg : isHint ? t.okFg : t.ink, fontSize: 13 }}>
                      {row[0]}
                    </span>
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
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            onClick={showHint}
            className="pt-btn px-4 py-2 rounded-full font-semibold"
            style={{ background: t.okBg, border: `1.5px solid ${CUP.green}`, color: t.okFg, fontSize: 13 }}
          >
            💡 Pista
          </button>
          <button
            onClick={nextPizza}
            className="pt-btn px-4 py-2 rounded-full font-semibold"
            style={{ border: `1.5px solid ${t.ink}`, color: t.ink, fontSize: 13 }}
          >
            Saltar esta pizza
          </button>
        </div>
      )}
    </div>
  );
}
