import React, { useState, useMemo } from "react";
import { PIZZAS, fullBuild, BASE_INGS, CUP, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { MiniPizza, Ing, SizeToggle, BuildList } from "../components/ui.jsx";

export function Tarjetas({ size, setSize, misses = {} }) {
  const t = useT();
  const [deckMode, setDeckMode] = useState("all"); // all | after | missed
  const [hardMode, setHardMode] = useState(false);

  const missedIndices = useMemo(
    () => PIZZAS.map((p, i) => (misses[p.name] > 0 ? i : -1)).filter((i) => i !== -1),
    [misses]
  );

  const buildOrder = (modeKey) => {
    let base = [...Array(PIZZAS.length).keys()];
    if (modeKey === "after") base = base.filter((i) => Boolean(PIZZAS[i].afterCut?.length));
    else if (modeKey === "missed" && missedIndices.length > 0) base = [...missedIndices];
    return shuffle(base);
  };

  const [order, setOrder] = useState(() => buildOrder("all"));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mastered, setMastered] = useState(() => new Set());

  const p = PIZZAS[order[idx]] || PIZZAS[0];
  const deckDone = order.length > 0 && mastered.size >= order.length;

  const switchDeck = (modeKey) => {
    setDeckMode(modeKey);
    setOrder(buildOrder(modeKey));
    setIdx(0);
    setRevealed(false);
    setMastered(new Set());
  };

  const reshuffle = () => {
    setOrder(buildOrder(deckMode));
    setIdx(0);
    setRevealed(false);
    setMastered(new Set());
  };

  const next = () => {
    setRevealed(false);
    setIdx((idx + 1) % order.length);
  };

  const prev = () => {
    setRevealed(false);
    setIdx((idx - 1 + order.length) % order.length);
  };

  const markKnown = () => {
    const nextMastered = new Set(mastered);
    nextMastered.add(order[idx]);
    setMastered(nextMastered);
    setRevealed(false);
    // Advance to next unmastered if possible
    for (let step = 1; step <= order.length; step++) {
      const cand = (idx + step) % order.length;
      if (!nextMastered.has(order[cand])) {
        setIdx(cand);
        return;
      }
    }
    setIdx((idx + 1) % order.length);
  };

  const markRepeat = () => {
    const cur = order[idx];
    const nextOrder = [...order];
    if (nextOrder.length > 2) {
      nextOrder.splice(idx, 1);
      const insertAt = Math.min(nextOrder.length, idx + 2);
      nextOrder.splice(insertAt, 0, cur);
      setOrder(nextOrder);
      setIdx(idx >= nextOrder.length ? 0 : idx);
    } else {
      setIdx((idx + 1) % order.length);
    }
    setRevealed(false);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between mb-3" style={{ gap: 8 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 2, color: ACCENT }}>MEMORIA ACTIVA</div>
          <div style={{ color: t.muted, fontSize: 13 }}>
            Tarjeta {idx + 1} / {order.length} · Dominadas {mastered.size}/{order.length}
          </div>
        </div>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      {/* controles de mazo */}
      <div className="flex flex-wrap items-center justify-between mb-3" style={{ gap: 6 }}>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {[
            ["all", "Todas"],
            ["after", "Post-horno"],
            ...(missedIndices.length > 0 ? [["missed", `Falladas (${missedIndices.length})`]] : []),
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => switchDeck(key)}
              className="pt-btn px-3 py-1 rounded-full font-bold"
              style={{
                fontFamily: DISPLAY,
                fontSize: 12,
                letterSpacing: 0.6,
                background: deckMode === key ? t.ink : t.toggleBg,
                color: deckMode === key ? t.onInk : t.muted,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setHardMode(!hardMode)}
          className="pt-btn px-3 py-1 rounded-full font-semibold"
          style={{
            fontSize: 11.5,
            border: `1.5px solid ${hardMode ? ACCENT : t.line}`,
            color: hardMode ? ACCENT : t.muted,
            background: "transparent",
          }}
        >
          {hardMode ? "🙈 Sin pistas" : "👁 Con iconos"}
        </button>
      </div>

      {/* barra de dominio */}
      <div className="h-1.5 rounded-full mb-4" style={{ background: t.toggleBg }}>
        <div
          className="h-1.5 rounded-full"
          style={{
            background: CUP.green,
            width: `${order.length ? (mastered.size / order.length) * 100 : 0}%`,
            transition: "width .3s",
          }}
        />
      </div>

      {deckDone ? (
        <div className="pt-ticket p-7 text-center mb-4" style={{ paddingTop: 28 }}>
          <div style={{ color: CUP.green, fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2 }}>¡MAZO COMPLETADO!</div>
          <h2 className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 34, color: t.ink, lineHeight: 1 }}>
            Dominaste {order.length} de {order.length}
          </h2>
          <p className="mb-5" style={{ color: t.muted, fontSize: 14 }}>
            Excelente retención. Puedes barajar otra vez o probar el modo Examen.
          </p>
          <button
            onClick={reshuffle}
            className="pt-btn pt-btn-primary px-7 py-3 font-bold"
            style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}
          >
            REPASAR DE NUEVO
          </button>
        </div>
      ) : (
        <div className="pt-ticket p-5 mb-4" style={{ minHeight: 330, paddingTop: 22 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: t.faint, fontFamily: DISPLAY, fontSize: 12, letterSpacing: 1.8 }}>
              ¿QUÉ LLEVA Y CUÁNTO?
            </span>
            {mastered.has(order[idx]) && (
              <span className="font-bold rounded-full px-2 py-0.5" style={{ fontSize: 10.5, background: t.okBg, color: t.okFg }}>
                ✓ Dominada
              </span>
            )}
          </div>

          <div className="flex justify-center mb-3">
            <MiniPizza pizza={p} size={72} />
          </div>
          <h2 className="text-center font-bold mb-5" style={{ fontFamily: DISPLAY, fontSize: "clamp(32px, 9vw, 40px)", color: t.ink, lineHeight: 0.95 }}>
            {p.name}
          </h2>

          {!revealed ? (
            <div className="flex flex-col items-center justify-center" style={{ minHeight: 150, gap: 16 }}>
              {!hardMode ? (
                <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 270 }}>
                  {fullBuild(p).map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
                    .filter((n) => !BASE_INGS.includes(n)).map((n, k) => (
                      <span
                        key={k}
                        className="flex items-center justify-center"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          background: t.chip,
                          border: `1px solid ${t.line}`,
                        }}
                      >
                        <Ing name={n} size={22} />
                      </span>
                    ))}
                </div>
              ) : (
                <p style={{ color: t.muted, fontSize: 13 }}>
                  Modo sin pistas — intenta recordar los pasos y vasitos de memoria.
                </p>
              )}
              <button
                onClick={() => setRevealed(true)}
                className="pt-btn pt-btn-primary px-7 py-3 font-bold"
                style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}
              >
                REVELAR RECETA
              </button>
            </div>
          ) : (
            <div>
              <BuildList pizza={p} size={size} animate show />
              <div className="flex mt-4" style={{ gap: 8 }}>
                <button
                  onClick={markRepeat}
                  className="pt-btn flex-1 py-2.5 px-3 font-bold"
                  style={{
                    borderRadius: 12,
                    background: t.badBg,
                    color: t.badFg,
                    border: `1.5px solid ${CUP.red}`,
                    fontFamily: DISPLAY,
                    fontSize: 15,
                    letterSpacing: 0.6,
                  }}
                >
                  ↻ REPASAR OTRA VEZ
                </button>
                <button
                  onClick={markKnown}
                  className="pt-btn flex-1 py-2.5 px-3 font-bold"
                  style={{
                    borderRadius: 12,
                    background: t.okBg,
                    color: t.okFg,
                    border: `1.5px solid ${CUP.green}`,
                    fontFamily: DISPLAY,
                    fontSize: 15,
                    letterSpacing: 0.6,
                  }}
                >
                  ✓ ¡ME LA SÉ!
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex" style={{ gap: 8 }}>
        <button
          onClick={prev}
          className="pt-btn px-4 py-3 font-semibold"
          style={{
            border: `1.5px solid ${t.line}`,
            background: t.ticket,
            color: t.ink,
            fontSize: 14,
            borderRadius: 12,
            fontFamily: DISPLAY,
            letterSpacing: 0.6,
          }}
        >
          ‹ ANT.
        </button>
        <button
          onClick={reshuffle}
          className="pt-btn px-4 py-3 font-semibold"
          style={{
            border: `1.5px solid ${t.ink}`,
            color: t.ink,
            fontSize: 14,
            borderRadius: 12,
            fontFamily: DISPLAY,
            letterSpacing: 0.6,
          }}
        >
          BARAJAR
        </button>
        <button
          onClick={next}
          className="pt-btn pt-btn-primary flex-1 py-3 font-bold"
          style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}
        >
          SIGUIENTE ›
        </button>
      </div>
    </div>
  );
}
