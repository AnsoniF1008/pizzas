import React, { useState } from "react";
import { PIZZAS, fullBuild, BASE_INGS, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { MiniPizza, Ing, SizeToggle, BuildList } from "../components/ui.jsx";

export function Tarjetas({ size, setSize }) {
  const t = useT();
  const [order, setOrder] = useState(() => shuffle([...Array(PIZZAS.length).keys()]));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const p = PIZZAS[order[idx]];

  const next = () => { setRevealed(false); setIdx((idx + 1) % order.length); };
  const reshuffle = () => { setOrder(shuffle([...Array(PIZZAS.length).keys()])); setIdx(0); setRevealed(false); };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: 2, color: ACCENT }}>MEMORIA</div>
          <div style={{ color: t.muted, fontSize: 13 }}>
            Tarjeta {idx + 1} / {order.length}
          </div>
        </div>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      <div
        className="pt-ticket p-5 mb-4"
        style={{ minHeight: 340, paddingTop: 22 }}
      >
        <div className="text-center mb-2" style={{ color: t.faint, fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2 }}>
          ¿QUÉ LLEVA Y CUÁNTO?
        </div>
        <div className="flex justify-center mb-3">
          <MiniPizza pizza={p} size={72} />
        </div>
        <h2 className="text-center font-bold mb-5" style={{ fontFamily: DISPLAY, fontSize: "clamp(32px, 9vw, 40px)", color: t.ink, lineHeight: 0.95 }}>
          {p.name}
        </h2>

        {!revealed ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 160, gap: 16 }}>
            <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 260 }}>
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
            <button
              onClick={() => setRevealed(true)}
              className="pt-btn pt-btn-primary px-7 py-3 font-bold"
              style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}
            >
              REVELAR RECETA
            </button>
          </div>
        ) : (
          <BuildList pizza={p} size={size} animate show />
        )}
      </div>

      <div className="flex" style={{ gap: 10 }}>
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
