import React, { useState, useEffect } from "react";
import { PIZZAS, fullBuild, BASE_INGS, CUP, ACCENT, DISPLAY, ICON, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle, sample } from "../lib/shuffle.js";
import { load, save } from "../lib/storage.js";
import { feedback } from "../lib/audio.js";
import { Ing } from "../components/ui.jsx";

function buildQuestions() {
  const qs = [];

  // 1) preguntas de número (item contado)
  const counted = [];
  PIZZAS.forEach((p) => fullBuild(p).forEach(([ing, t, f]) => {
    if (typeof t === "number" && typeof f === "number") counted.push({ pizza: p.name, ing, t, f });
  }));
  sample(counted, 4).forEach((c) => {
    const useFourteen = Math.random() < 0.5;
    const sz = useFourteen ? '14"' : '10"';
    const correct = useFourteen ? c.f : c.t;
    const opts = new Set([correct]);
    while (opts.size < 4) {
      const delta = [-6, -3, -2, 2, 3, 6, c.t, c.f][Math.floor(Math.random() * 8)];
      const v = Math.max(1, correct + delta);
      if (v !== correct) opts.add(v);
    }
    qs.push({
      q: `¿Cuántos lleva una ${c.pizza} de ${sz}?`,
      sub: `${ES[c.ing]} (${c.ing})`, icon: c.ing, pizza: c.pizza,
      options: shuffle([...opts]).map(String), answer: String(correct),
    });
  });

  // 2) ¿cuál NO va en esta pizza?
  const allTops = [...new Set(PIZZAS.flatMap((p) => fullBuild(p).map((r) => r[0])))]
    .filter((n) => ICON[n] && !BASE_INGS.includes(n));
  sample(PIZZAS, 3).forEach((p) => {
    const own = [...new Set(fullBuild(p).map((r) => r[0]))];
    const intruders = allTops.filter((n) => !own.includes(n));
    if (intruders.length === 0) return;
    const intruder = sample(intruders, 1)[0];
    const reals = sample(own.filter((n) => !BASE_INGS.includes(n)), 3);
    if (reals.length < 3) return;
    qs.push({
      q: `¿Cuál de estos NO va en la ${p.name}?`,
      sub: "Elige el ingrediente que NO pertenece.", pizza: p.name,
      options: shuffle([...reals, intruder]), answer: intruder, withIcons: true,
    });
  });

  // 3) identifica la pizza por sus ingredientes
  sample(PIZZAS, 3).forEach((p) => {
    const tops = [...new Set(fullBuild(p).map((r) => r[0]))]
      .filter((n) => !BASE_INGS.includes(n)).slice(0, 4);
    const others = sample(PIZZAS.filter((x) => x.name !== p.name), 3).map((x) => x.name);
    qs.push({
      q: "¿Qué pizza usa estos ingredientes?",
      iconRow: tops, sub: tops.map((t) => ES[t]).join(" · "), pizza: p.name,
      options: shuffle([p.name, ...others]), answer: p.name,
    });
  });

  return shuffle(qs).slice(0, 10);
}

const TIMEOUT_PICK = "__timeout__";
const QUESTION_SECONDS = 20;

export function Examen({ soundOn, onMiss, onExamDone }) {
  const t = useT();
  const [questions, setQuestions] = useState(buildQuestions);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timerOn, setTimerOn] = useState(() => load("pt-timer", true));
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const q = questions[i];

  useEffect(() => { save("pt-timer", timerOn); }, [timerOn]);
  useEffect(() => { setTimeLeft(QUESTION_SECONDS); }, [i, timerOn]);

  useEffect(() => {
    if (!timerOn || picked !== null || done) return;
    if (timeLeft <= 0) {
      setPicked(TIMEOUT_PICK);
      feedback(false, soundOn);
      onMiss(q.pizza);
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timerOn, picked, done, timeLeft]);

  const choose = (opt) => {
    if (picked !== null) return;
    setPicked(opt);
    const ok = opt === q.answer;
    feedback(ok, soundOn);
    if (ok) setScore((s) => s + 1);
    else onMiss(q.pizza);
  };
  const next = () => {
    if (i + 1 >= questions.length) {
      setDone(true);
      onExamDone(score, questions.length);
      return;
    }
    setI(i + 1); setPicked(null);
  };
  const restart = () => {
    setQuestions(buildQuestions()); setI(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const msg = pct >= 80 ? "¡Te las sabes! Listo para la línea."
      : pct >= 50 ? "Vas bien. Repasa las que fallaste." : "A repasar un poco más. ¡Tú puedes!";
    return (
      <div className="mx-auto w-full max-w-xl text-center pt-ticket p-7" style={{ paddingTop: 28 }}>
        <div style={{ color: ACCENT, fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2 }}>RESULTADO</div>
        <div className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 64, color: t.ink, lineHeight: 1 }}>
          {score}<span style={{ color: ACCENT }}>/{questions.length}</span>
        </div>
        <p className="mb-6" style={{ color: t.muted, fontSize: 15 }}>{msg}</p>
        <button onClick={restart}
          className="pt-btn pt-btn-primary px-7 py-3 font-bold"
          style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}>
          OTRO EXAMEN
        </button>
      </div>
    );
  }

  const timeFrac = timeLeft / QUESTION_SECONDS;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: t.muted, fontSize: 13 }}>Pregunta {i + 1} de {questions.length}</span>
        <div className="flex items-center" style={{ gap: 10 }}>
          <button onClick={() => setTimerOn(!timerOn)}
            className="px-3 py-1 rounded-full font-semibold"
            style={{
              fontSize: 12, border: `1.5px solid ${timerOn ? ACCENT : t.line}`,
              color: timerOn ? ACCENT : t.muted, background: "transparent",
            }}>
            ⏱ {timerOn ? "Con tiempo" : "Sin tiempo"}
          </button>
          <span className="font-bold" style={{ fontFamily: DISPLAY, color: ACCENT, fontSize: 15 }}>
            Puntos: {score}
          </span>
        </div>
      </div>

      {/* barra de progreso */}
      <div className="h-1.5 rounded-full mb-2" style={{ background: t.toggleBg }}>
        <div className="h-1.5 rounded-full" style={{ background: ACCENT, width: `${(i / questions.length) * 100}%`, transition: "width .3s" }} />
      </div>

      {/* cronómetro */}
      {timerOn && picked === null && (
        <div className="flex items-center mb-3" style={{ gap: 8 }}>
          <div className="h-2 rounded-full flex-1" style={{ background: t.toggleBg }}>
            <div className="h-2 rounded-full" style={{
              width: `${timeFrac * 100}%`,
              background: timeLeft <= 5 ? CUP.red : timeLeft <= 10 ? CUP.orange : CUP.green,
              transition: "width 1s linear, background .3s",
            }} />
          </div>
          <span className="font-bold" style={{
            fontFamily: DISPLAY, fontSize: 16, minWidth: 30, textAlign: "right",
            color: timeLeft <= 5 ? CUP.red : t.ink,
          }}>
            {timeLeft}s
          </span>
        </div>
      )}

      <div className="rounded-2xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
        <h2 className="font-bold mb-1" style={{ fontFamily: DISPLAY, fontSize: 21, color: t.ink, lineHeight: 1.1 }}>
          {q.q}
        </h2>
        {q.icon && (
          <div className="flex items-center my-2" style={{ gap: 8 }}>
            <Ing name={q.icon} size={26} />
            <span className="font-semibold" style={{ color: t.ink, fontSize: 15 }}>{q.sub}</span>
          </div>
        )}
        {q.iconRow && (
          <div className="flex flex-wrap my-3" style={{ gap: 8 }}>
            {q.iconRow.map((n, k) => (
              <span key={k} className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 12, background: t.chip }}>
                <Ing name={n} size={26} />
              </span>
            ))}
          </div>
        )}
        {q.sub && !q.icon && (
          <p style={{ color: t.muted, fontSize: 12 }}>{q.sub}</p>
        )}
      </div>

      {picked === TIMEOUT_PICK && (
        <p className="text-center font-semibold mb-3" style={{ color: CUP.red, fontSize: 14 }}>
          ⏱ ¡Se acabó el tiempo!
        </p>
      )}

      <div className="flex flex-col" style={{ gap: 10 }}>
        {q.options.map((opt, k) => {
          const isAnswer = opt === q.answer;
          const isPicked = opt === picked;
          let bg = t.surface, bd = t.line, fg = t.ink;
          if (picked !== null) {
            if (isAnswer) { bg = t.okBg; bd = CUP.green; fg = t.okFg; }
            else if (isPicked) { bg = t.badBg; bd = CUP.red; fg = t.badFg; }
          }
          return (
            <button key={k} onClick={() => choose(opt)} disabled={picked !== null}
              className="flex items-center text-left rounded-xl px-4 py-3 font-semibold active:scale-[.99] transition-transform"
              style={{ background: bg, border: `1.5px solid ${bd}`, color: fg, gap: 10, fontSize: 15 }}>
              {q.withIcons && <Ing name={opt} size={22} />}
              <span className="flex-1">{opt}</span>
              {picked !== null && isAnswer && <span style={{ color: CUP.green }}>✓</span>}
              {picked !== null && isPicked && !isAnswer && <span style={{ color: CUP.red }}>✕</span>}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <button onClick={next}
          className="w-full mt-4 py-3 rounded-full font-bold text-white active:scale-95 transition-transform"
          style={{ background: ACCENT, fontFamily: DISPLAY, fontSize: 16 }}>
          {i + 1 >= questions.length ? "Ver resultado" : "Siguiente"}
        </button>
      )}
    </div>
  );
}
