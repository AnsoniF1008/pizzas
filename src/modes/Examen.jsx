import React, { useState, useEffect } from "react";
import { PIZZAS, PASTAS, fullBuild, BASE_INGS, CUP, ACCENT, DISPLAY, ICON, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle, sample } from "../lib/shuffle.js";
import { load, save } from "../lib/storage.js";
import { feedback } from "../lib/audio.js";
import { Ing, Amount, formatAmountText } from "../components/ui.jsx";

const EXAM_TOPICS = [
  ["mix", "Mixto"],
  ["cups", "Vasitos"],
  ["pizzas", "Recetas"],
  ["menu", "Menú y Cortes"],
];

const CUP_POOL = (() => {
  const map = new Map();
  PIZZAS.forEach((p) =>
    p.build.forEach(([, v10, v14]) => {
      [v10, v14].forEach((v) => {
        if (Array.isArray(v)) map.set(JSON.stringify(v), v);
      });
    })
  );
  return [...map.values()];
})();

function makeCupQuestion(c) {
  const useFourteen = Math.random() < 0.5;
  const sz = useFourteen ? '14"' : '10"';
  const correct = useFourteen ? c.f : c.t;
  const correctKey = JSON.stringify(correct);
  const others = shuffle(CUP_POOL.filter((v) => JSON.stringify(v) !== correctKey)).slice(0, 3);
  const options = shuffle([correct, ...others]).map((val) => ({
    key: JSON.stringify(val),
    label: formatAmountText(val),
    amount: val,
  }));
  return {
    q: `¿Qué vasito lleva en ${c.pizza} de ${sz}?`,
    sub: `${ES[c.ing]} (${c.ing})`,
    icon: c.ing,
    pizza: c.pizza,
    options,
    answer: correctKey,
  };
}

function makeCountQuestion(c) {
  const useFourteen = Math.random() < 0.5;
  const sz = useFourteen ? '14"' : '10"';
  const correct = useFourteen ? c.f : c.t;
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const delta = [-6, -3, -2, 2, 3, 6, c.t, c.f][Math.floor(Math.random() * 8)];
    const v = Math.max(1, correct + delta);
    if (v !== correct) opts.add(v);
  }
  return {
    q: `¿Cuántos lleva una ${c.pizza} de ${sz}?`,
    sub: `${ES[c.ing]} (${c.ing})`,
    icon: c.ing,
    pizza: c.pizza,
    options: shuffle([...opts]).map((v) => ({ key: String(v), label: `${v} piezas` })),
    answer: String(correct),
  };
}

function makeMenuCutQuestions() {
  const pool = [
    {
      q: "¿Cuántos cortes lleva una pizza PERSONAL 10\" (cuadrado)?",
      sub: "Estación de cortes",
      options: ["2 verticales y 2 horizontales", "3 verticales y 3 horizontales", "1 vertical y 1 horizontal", "6 cortes triangulares"],
      answer: "2 verticales y 2 horizontales",
    },
    {
      q: "¿Cuántos cortes lleva una pizza LARGE 14\" / XL 16\" (cuadrado)?",
      sub: "Estación de cortes",
      options: ["3 verticales y 3 horizontales", "2 verticales y 2 horizontales", "4 verticales y 4 horizontales", "8 porciones en triángulo"],
      answer: "3 verticales y 3 horizontales",
    },
    {
      q: "¿Cuántas marinaras acompañan a un Calzone Grande?",
      sub: "Calzones · 4 cortes",
      options: ["2 marinaras", "1 marinara", "3 marinaras", "Ninguna"],
      answer: "2 marinaras",
    },
    {
      q: "¿Qué aderezo lleva la GREEK SALAD?",
      sub: "Ensaladas del menú",
      options: ["Vinagreta balsámica", "Aderezo Caesar", "Ranch", "Walnut raspberry"],
      answer: "Vinagreta balsámica",
    },
    {
      q: "¿Qué aderezo lleva la HAWAIIAN SALAD?",
      sub: "Ensaladas del menú",
      options: ["Walnut raspberry", "Vinagreta balsámica", "Ranch", "Aderezo italiano"],
      answer: "Walnut raspberry",
    },
    {
      q: "¿Cómo se pasa el CHICKEN ALFREDO por el horno EDGE?",
      sub: "Pollo 3 oz antes de mezclar",
      options: ["Medio horno (½ oven)", "Horno completo (full oven)", "¾ de horno", "Sin horno"],
      answer: "Medio horno (½ oven)",
    },
    {
      q: "¿Con qué pan y decoración sale toda PASTA?",
      sub: "Regla de presentación de pastas",
      options: ["Pan de queso + parmesano y perejil", "Pan de ajo + cilantro", "Crutones + queso feta", "Sin guarnición"],
      answer: "Pan de queso + parmesano y perejil",
    },
    {
      q: "¿Cuántos corazones de alcachofa lleva la FETTUCCINE PRIMAVERA?",
      sub: "Pastas del chart",
      options: ["3 corazones", "1 corazón", "6 corazones", "2 corazones"],
      answer: "3 corazones",
    },
    {
      q: "¿Cuántos cortes lleva el GARLIC CHEESE BREAD?",
      sub: "Estación de cortes",
      options: ["7 verticales y 1 horizontal", "4 verticales y 2 horizontales", "3 verticales y 3 horizontales", "6 triángulos"],
      answer: "7 verticales y 1 horizontal",
    },
    {
      q: "¿Qué salsa lleva la MEATBALLER por encima en la segunda pasada (¾ horno)?",
      sub: "Entradas del menú",
      options: ["3 oz de marinara", "4 oz de alfredo", "2 oz de pizza sauce", "Aceite de oliva y leche"],
      answer: "3 oz de marinara",
    },
  ];
  return shuffle(pool).map((item) => ({
    q: item.q,
    sub: item.sub,
    pizza: null,
    options: shuffle(item.options).map((lbl) => ({ key: lbl, label: lbl })),
    answer: item.answer,
  }));
}

function buildQuestions(topic = "mix") {
  const counted = [];
  const cupped = [];
  PIZZAS.forEach((p) =>
    fullBuild(p).forEach(([ing, t, f]) => {
      if (typeof t === "number" && typeof f === "number") counted.push({ pizza: p.name, ing, t, f });
      else if (Array.isArray(t) && Array.isArray(f)) cupped.push({ pizza: p.name, ing, t, f });
    })
  );

  if (topic === "cups") {
    return sample(cupped, 10).map(makeCupQuestion);
  }
  if (topic === "menu") {
    return makeMenuCutQuestions().slice(0, 10);
  }

  const qs = [];

  // 1) Vasitos de colores
  sample(cupped, topic === "pizzas" ? 3 : 3).forEach((c) => qs.push(makeCupQuestion(c)));

  // 2) Piezas contadas
  sample(counted, 2).forEach((c) => qs.push(makeCountQuestion(c)));

  // 3) ¿Cuál NO va en esta pizza?
  const allTops = [...new Set(PIZZAS.flatMap((p) => fullBuild(p).map((r) => r[0])))]
    .filter((n) => ICON[n] && !BASE_INGS.includes(n));
  sample(PIZZAS, 2).forEach((p) => {
    const own = [...new Set(fullBuild(p).map((r) => r[0]))];
    const intruders = allTops.filter((n) => !own.includes(n));
    const reals = sample(own.filter((n) => !BASE_INGS.includes(n)), 3);
    if (!intruders.length || reals.length < 3) return;
    const intruder = sample(intruders, 1)[0];
    qs.push({
      q: `¿Cuál de estos NO va en la ${p.name}?`,
      sub: "Elige el ingrediente que NO pertenece.",
      pizza: p.name,
      options: shuffle([...reals, intruder]).map((n) => ({ key: n, label: `${n} (${ES[n] || n})`, icon: n })),
      answer: intruder,
    });
  });

  // 4) Identifica la pizza por sus ingredientes
  sample(PIZZAS, 2).forEach((p) => {
    const tops = [...new Set(fullBuild(p).map((r) => r[0]))]
      .filter((n) => !BASE_INGS.includes(n)).slice(0, 4);
    const others = sample(PIZZAS.filter((x) => x.name !== p.name), 3).map((x) => x.name);
    qs.push({
      q: "¿Qué pizza usa estos ingredientes?",
      iconRow: tops,
      sub: tops.map((x) => ES[x]).join(" · "),
      pizza: p.name,
      options: shuffle([p.name, ...others]).map((n) => ({ key: n, label: n })),
      answer: p.name,
    });
  });

  // 5) Post-horno o Menú/Cortes
  if (topic === "pizzas") {
    const afterPizzas = PIZZAS.filter((p) => p.afterCut?.length);
    const p = sample(afterPizzas, 1)[0];
    const ans = p.afterCut[0][0];
    const distractors = sample(["Parmesan", "Chives", "Cilantro", "Romano", "Cheddar", "Basil"].filter((x) => x !== ans), 3);
    qs.push({
      q: `¿Qué lleva DESPUÉS de hornear y cortar la ${p.name}?`,
      sub: "Toque de salida del horno",
      pizza: p.name,
      options: shuffle([ans, ...distractors]).map((n) => ({ key: n, label: `${n} (${ES[n] || n})`, icon: n })),
      answer: ans,
    });
  } else {
    qs.push(...makeMenuCutQuestions().slice(0, 2));
  }

  return shuffle(qs).slice(0, 10);
}

const TIMEOUT_PICK = "__timeout__";
const QUESTION_SECONDS = 20;

export function Examen({ soundOn, onMiss, onExamDone }) {
  const t = useT();
  const [topic, setTopic] = useState("mix");
  const [runId, setRunId] = useState(0);
  const [questions, setQuestions] = useState(() => buildQuestions("mix"));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [done, setDone] = useState(false);
  const [timerOn, setTimerOn] = useState(() => load("pt-timer", true));
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const q = questions[i];

  useEffect(() => { save("pt-timer", timerOn); }, [timerOn]);
  useEffect(() => { setTimeLeft(QUESTION_SECONDS); }, [i, timerOn, runId]);

  useEffect(() => {
    if (!timerOn || picked !== null || done || !q) return;
    if (timeLeft <= 0) {
      setPicked(TIMEOUT_PICK);
      feedback(false, soundOn);
      if (q.pizza) onMiss(q.pizza);
      setHistory((h) => [...h, { q, pickedKey: TIMEOUT_PICK, ok: false }]);
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timerOn, picked, done, timeLeft, q]);

  const startNew = (nextTopic = topic) => {
    setTopic(nextTopic);
    setQuestions(buildQuestions(nextTopic));
    setI(0);
    setPicked(null);
    setScore(0);
    setHistory([]);
    setDone(false);
    setRunId((r) => r + 1);
  };

  const choose = (optKey) => {
    if (picked !== null) return;
    setPicked(optKey);
    const ok = optKey === q.answer;
    feedback(ok, soundOn);
    if (ok) setScore((s) => s + 1);
    else if (q.pizza) onMiss(q.pizza);
    setHistory((h) => [...h, { q, pickedKey: optKey, ok }]);
  };

  const next = () => {
    if (i + 1 >= questions.length) {
      setDone(true);
      onExamDone(score, questions.length);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const msg = pct >= 80 ? "¡Te las sabes! Listo para la línea."
      : pct >= 50 ? "Vas bien. Repasa las que fallaste abajo." : "A repasar un poco más. ¡Tú puedes!";
    const missed = history.filter((h) => !h.ok);
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="text-center pt-ticket p-6 mb-4" style={{ paddingTop: 26 }}>
          <div style={{ color: ACCENT, fontFamily: DISPLAY, fontSize: 13, letterSpacing: 2 }}>RESULTADO</div>
          <div className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 64, color: t.ink, lineHeight: 1 }}>
            {score}<span style={{ color: ACCENT }}>/{questions.length}</span>
          </div>
          <p className="mb-5" style={{ color: t.muted, fontSize: 15 }}>{msg}</p>
          <button
            onClick={() => startNew(topic)}
            className="pt-btn pt-btn-primary px-7 py-3 font-bold"
            style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: 1, borderRadius: 12 }}
          >
            OTRO EXAMEN
          </button>
        </div>

        {missed.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
            <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
              Repasa tus fallos ({missed.length})
            </h3>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {missed.map(({ q: mq, pickedKey }, idx) => {
                const rightOpt = mq.options.find((o) => o.key === mq.answer);
                const yourOpt = mq.options.find((o) => o.key === pickedKey);
                return (
                  <div key={idx} className="rounded-xl p-3" style={{ background: t.ticket, border: `1px solid ${t.line}` }}>
                    <div className="font-bold mb-1" style={{ color: t.ink, fontSize: 13.5 }}>{mq.q}</div>
                    {mq.sub && <div style={{ color: t.muted, fontSize: 11.5, marginBottom: 6 }}>{mq.sub}</div>}
                    <div style={{ fontSize: 12, color: t.badFg }}>
                      Tu respuesta: {pickedKey === TIMEOUT_PICK ? "Se acabó el tiempo" : (yourOpt?.label || pickedKey)}
                    </div>
                    <div className="flex items-center mt-1" style={{ gap: 8, fontSize: 12.5, color: t.okFg, fontWeight: 700 }}>
                      <span>Correcta:</span>
                      {rightOpt?.amount ? <Amount value={rightOpt.amount} showLabel /> : <span>{rightOpt?.label || mq.answer}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const timeFrac = timeLeft / QUESTION_SECONDS;

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Selector de tema */}
      <div className="flex flex-wrap mb-3" style={{ gap: 6 }}>
        {EXAM_TOPICS.map(([key, label]) => {
          const on = topic === key;
          return (
            <button
              key={key}
              onClick={() => startNew(key)}
              className="pt-btn px-3 py-1 rounded-full font-bold"
              style={{
                fontFamily: DISPLAY,
                fontSize: 12.5,
                letterSpacing: 0.6,
                background: on ? t.ink : t.toggleBg,
                color: on ? t.onInk : t.muted,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span style={{ color: t.muted, fontSize: 13 }}>Pregunta {i + 1} de {questions.length}</span>
        <div className="flex items-center" style={{ gap: 10 }}>
          <button
            onClick={() => setTimerOn(!timerOn)}
            className="px-3 py-1 rounded-full font-semibold"
            style={{
              fontSize: 12, border: `1.5px solid ${timerOn ? ACCENT : t.line}`,
              color: timerOn ? ACCENT : t.muted, background: "transparent",
            }}
          >
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
            <div
              className="h-2 rounded-full"
              style={{
                width: `${timeFrac * 100}%`,
                background: timeLeft <= 5 ? CUP.red : timeLeft <= 10 ? CUP.orange : CUP.green,
                transition: "width 1s linear, background .3s",
              }}
            />
          </div>
          <span
            className="font-bold"
            style={{
              fontFamily: DISPLAY, fontSize: 16, minWidth: 30, textAlign: "right",
              color: timeLeft <= 5 ? CUP.red : t.ink,
            }}
          >
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
              <span
                key={k}
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 12, background: t.chip }}
              >
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
          const isAnswer = opt.key === q.answer;
          const isPicked = opt.key === picked;
          let bg = t.surface, bd = t.line, fg = t.ink;
          if (picked !== null) {
            if (isAnswer) { bg = t.okBg; bd = CUP.green; fg = t.okFg; }
            else if (isPicked) { bg = t.badBg; bd = CUP.red; fg = t.badFg; }
          }
          return (
            <button
              key={k}
              onClick={() => choose(opt.key)}
              disabled={picked !== null}
              className="flex items-center text-left rounded-xl px-4 py-3 font-semibold active:scale-[.99] transition-transform"
              style={{ background: bg, border: `1.5px solid ${bd}`, color: fg, gap: 10, fontSize: 15 }}
            >
              {opt.icon && <Ing name={opt.icon} size={22} />}
              {opt.amount ? (
                <span className="flex-1 flex items-center" style={{ gap: 8 }}>
                  <Amount value={opt.amount} big showLabel />
                </span>
              ) : (
                <span className="flex-1">{opt.label}</span>
              )}
              {picked !== null && isAnswer && <span style={{ color: CUP.green }}>✓</span>}
              {picked !== null && isPicked && !isAnswer && <span style={{ color: CUP.red }}>✕</span>}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <button
          onClick={next}
          className="w-full mt-4 py-3 rounded-full font-bold text-white active:scale-95 transition-transform"
          style={{ background: ACCENT, fontFamily: DISPLAY, fontSize: 16 }}
        >
          {i + 1 >= questions.length ? "Ver resultado" : "Siguiente"}
        </button>
      )}
    </div>
  );
}
