import React, { useState, useMemo, useEffect } from "react";

/* ============================ DATOS ============================ */
// Valor de celda:
//   número            -> piezas que se cuentan
//   [color, cantidad] -> vasitos de porción de ese color
//   null              -> "base" (salsa/capa para cubrir, sin medir)
const CUP = {
  blue: "#2E86DE",
  green: "#27AE45",
  red: "#E03A2F",
  orange: "#F39C12",
  white: "#FFFFFF",
};

const ICON = {
  "Pizza Sauce": "🍅",
  "Mozzarella": "🧀",
  "Smoked Mozz.": "🧀",
  "Gouda": "🧀",
  "Romano": "🧀",
  "Cheddar": "🧀",
  "Feta": "🧀",
  "Big Don's Mix": "🧀",
  "Canad. Bacon": "🥓",
  "Bacon": "🥓",
  "Pepperonis": "PEP",
  "Ital. Sausage": "🍖",
  "Chicken": "🍗",
  "Black Olives": "🫒",
  "Green Olives": "🫒",
  "Red Onions": "🧅",
  "Caram. Onions": "🧅",
  "Bell Peppers": "🫑",
  "Mushrooms": "🍄",
  "Pineapple": "🍍",
  "Cranberries": "🫐",
  "Cashews": "🥜",
  "Spinach": "🥬",
  "Tomatoes": "🍅",
  "Basil": "🌿",
  "Cilantro": "🌿",
  "Garlic": "🧄",
  "Olive Oil": "🫒",
  "Potatoes": "🥔",
  "Artichoke": "ART",
  "Alfredo Sauce": "🥣",
  "BBQ Sauce": "🥣",
  "BBQ Drizzle": "🥣",
  "Buffalo Ranch": "🥣",
};

const ES = {
  "Pizza Sauce": "Salsa de pizza", "Mozzarella": "Mozzarella",
  "Smoked Mozz.": "Mozzarella ahumada", "Gouda": "Gouda", "Romano": "Queso romano",
  "Cheddar": "Cheddar", "Feta": "Queso feta", "Big Don's Mix": "Mezcla Big Don's",
  "Canad. Bacon": "Tocino canadiense", "Bacon": "Tocineta", "Pepperonis": "Pepperoni",
  "Ital. Sausage": "Salchicha italiana", "Chicken": "Pollo", "Black Olives": "Aceitunas negras",
  "Green Olives": "Aceitunas verdes", "Red Onions": "Cebolla morada",
  "Caram. Onions": "Cebolla caramelizada", "Bell Peppers": "Pimentón",
  "Mushrooms": "Champiñones", "Pineapple": "Piña", "Cranberries": "Arándanos",
  "Cashews": "Marañón", "Spinach": "Espinaca", "Tomatoes": "Tomate", "Basil": "Albahaca",
  "Cilantro": "Cilantro", "Garlic": "Ajo", "Olive Oil": "Aceite de oliva",
  "Potatoes": "Papas", "Artichoke": "Alcachofa", "Alfredo Sauce": "Salsa alfredo",
  "BBQ Sauce": "Salsa BBQ", "BBQ Drizzle": "Chorrito de BBQ", "Buffalo Ranch": "Búfalo ranch",
};

const B = null;
const PIZZAS = [
  { name: "CARL'S KING", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Canad. Bacon", 3, 5],
    ["Pepperonis", 9, 18],
    ["Ital. Sausage", ["red",1], ["red",2]],
    ["Black Olives", ["orange",1], ["orange",2]],
    ["Red Onions", ["red",1], ["red",2]],
    ["Bell Peppers", ["red",1], ["red",2]],
    ["Mushrooms", ["red",1], ["red",2]],
    ["Mozzarella", ["white",1], ["white",2]],
  ]},
  { name: "BIG DON'S", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Canad. Bacon", 3, 5],
    ["Pepperonis", 9, 18],
    ["Big Don's Mix", ["white",1], ["white",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "BUFFALO CHICKEN", build: [
    ["Buffalo Ranch", B, B],
    ["Smoked Mozz.", ["green",1], ["green",2]],
    ["Chicken", ["green",1], ["green",2]],
    ["Cilantro", B, B],
    ["Caram. Onions", B, B],
    ["Garlic", B, B],
    ["Buffalo Ranch", B, B],
  ]},
  { name: "WYATT'S BBQ", build: [
    ["BBQ Sauce", B, B],
    ["Smoked Mozz.", ["green",1], ["green",2]],
    ["Chicken", ["green",1], ["green",2]],
    ["Cilantro", B, B],
    ["Red Onions", ["red",1], ["red",2]],
    ["Bacon", ["orange",1], ["orange",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
    ["BBQ Drizzle", B, B],
  ]},
  { name: "HAWAIIAN", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Canad. Bacon", 8, 16],
    ["Pineapple", ["red",1], ["red",2]],
    ["Cranberries", ["red",1], ["red",2]],
    ["Cashews", ["red",1], ["red",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "VEGGIE", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Spinach", B, B],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Black Olives", ["orange",1], ["orange",2]],
    ["Red Onions", ["red",1], ["red",2]],
    ["Bell Peppers", ["red",1], ["red",2]],
    ["Mushrooms", ["red",1], ["red",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Romano", ["orange",1], ["orange",1]],
  ]},
  { name: "PEPPERONI SUPREME", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Pepperonis", 20, 38],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Mushrooms", ["red",1], ["red",2]],
    ["Smoked Mozz.", ["white",1], ["white",2]],
  ]},
  { name: "BIG CHEESY", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Gouda", ["white",1], ["white",2]],
    ["Smoked Mozz.", ["green",1], ["green",1]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Romano", ["orange",1], ["orange",1]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "MARGHERITA", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["blue",1], ["blue",2]],
    ["Basil", ["orange",1], ["orange",1]],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Garlic", B, B],
    ["Romano", ["orange",1], ["orange",1]],
    ["Olive Oil", B, B],
  ]},
  { name: "BLANCO", build: [
    ["Olive Oil", B, B],
    ["Garlic", B, B],
    ["Romano", B, B],
    ["Spinach", ["green",1], ["blue",1]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Red Onions", ["red",1], ["red",2]],
    ["Mozzarella", ["red",1], ["red",2]],
    ["Bacon", ["orange",1], ["orange",1]],
    ["Romano", B, B],
    ["Olive Oil", B, B],
  ]},
  { name: "MADELYN'S ALFREDO", build: [
    ["Alfredo Sauce", B, B],
    ["Spinach", B, B],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Chicken", ["green",1], ["green",2]],
    ["Mushrooms", ["red",1], ["red",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "TUSCANY", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Spinach", B, B],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Red Onions", ["red",1], ["red",2]],
    ["Black Olives", ["orange",1], ["orange",2]],
    ["Green Olives", ["orange",1], ["orange",2]],
    ["Artichoke", 3, 6],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Feta", ["orange",1], ["orange",2]],
  ]},
  { name: "PEPPERONI", build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["blue",1], ["blue",2]],
    ["Pepperonis", 12, 24],
  ]},
  { name: "POTATO HEAD", build: [
    ["Alfredo Sauce", B, B],
    ["Mozzarella", ["blue",1], ["blue",2]],
    ["Potatoes", 13, 27],
    ["Bacon", ["orange",1], ["orange",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
];

const INK = "#161616";
const ACCENT = "#FF6600";
const PAPER = "#F4F1EA";
const SURFACE = "#FFFFFF";
const LINE = "#E3DDD0";
const DISPLAY = "'Oswald','Arial Narrow','Helvetica Neue',sans-serif";

/* ============================ ÍCONOS ============================ */
function Ing({ name, size = 22 }) {
  const ic = ICON[name] || "•";
  if (ic === "PEP") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#C0392B" stroke="#8E2A20" strokeWidth="1.2" />
        {[[8,9],[15,8],[12,13],[8,16],[16,15]].map((p,i)=>(
          <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill="#7B1E16" />
        ))}
      </svg>
    );
  }
  if (ic === "ART") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3c4 2 6 6 6 10 0 4-3 7-6 7s-6-3-6-7c0-4 2-8 6-10z" fill="#6E8B3D" stroke="#4F6429" strokeWidth="1"/>
        <path d="M12 7v12M8 11l4 3 4-3M8 15l4 3 4-3" stroke="#3f521f" strokeWidth="1" fill="none"/>
      </svg>
    );
  }
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{ic}</span>;
}

/* ===================== PUNTOS DE PORCIÓN ===================== */
function Amount({ value, big = false }) {
  if (value === null || value === undefined) {
    return <span className="italic" style={{ color: "#9b958a", fontSize: big ? 13 : 11 }}>base</span>;
  }
  if (typeof value === "number") {
    return (
      <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: big ? 22 : 17, color: INK }}>
        {value}
      </span>
    );
  }
  const [color, n] = value;
  const r = big ? 9 : 7;
  return (
    <span className="inline-flex items-center" style={{ gap: 3 }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{
          width: r, height: r, borderRadius: "50%", background: CUP[color],
          border: color === "white" ? "1.5px solid #b9b9b9" : "1px solid rgba(0,0,0,.15)",
          display: "inline-block",
        }} />
      ))}
    </span>
  );
}

/* ===================== CONTROL DE TAMAÑO ===================== */
function SizeToggle({ size, setSize }) {
  return (
    <div className="inline-flex rounded-full p-1" style={{ background: "#E7E2D7" }}>
      {["10", "14"].map((s) => (
        <button key={s} onClick={() => setSize(s)}
          className="px-4 py-1 rounded-full text-sm font-bold transition-colors"
          style={{
            fontFamily: DISPLAY,
            background: size === s ? INK : "transparent",
            color: size === s ? "#fff" : "#6b6459",
          }}>
          {s}"
        </button>
      ))}
    </div>
  );
}

/* ===================== TARJETA DE CONSTRUCCIÓN ===================== */
function BuildList({ pizza, size, animate = false, show = true }) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      {pizza.build.map((row, i) => {
        const [ing, t, f] = row;
        const val = size === "10" ? t : f;
        return (
          <div key={i}
            className="flex items-center rounded-xl"
            style={{
              gap: 10, padding: "7px 10px",
              background: i % 2 ? "#FAF8F3" : "#fff",
              border: `1px solid ${LINE}`,
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(8px)",
              transition: animate ? "opacity .35s ease, transform .35s ease" : "none",
              transitionDelay: animate ? `${i * 55}ms` : "0ms",
            }}>
            <span className="flex items-center justify-center"
              style={{ width: 26, height: 26, flexShrink: 0 }}>
              <Ing name={ing} size={22} />
            </span>
            <span className="flex-1 leading-tight">
              <span className="font-semibold" style={{ color: INK, fontSize: 14 }}>{ing}</span>
              <span className="block" style={{ color: "#9a9488", fontSize: 11 }}>{ES[ing]}</span>
            </span>
            <span className="flex items-center justify-end" style={{ minWidth: 54 }}>
              <Amount value={val} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================ REPASO ============================ */
function Repaso({ size, setSize }) {
  const [open, setOpen] = useState(null);
  const preview = (p) =>
    p.build.map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
      .filter((n) => !["Pizza Sauce", "Mozzarella"].includes(n)).slice(0, 4);

  if (open !== null) {
    const p = PIZZAS[open];
    return (
      <div>
        <button onClick={() => setOpen(null)}
          className="flex items-center text-sm font-semibold mb-3" style={{ color: ACCENT, gap: 4 }}>
          ‹ Todas las pizzas
        </button>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold tracking-tight" style={{ fontFamily: DISPLAY, fontSize: 26, color: INK }}>
            {p.name}
          </h2>
          <SizeToggle size={size} setSize={setSize} />
        </div>
        <p className="mb-3" style={{ color: "#8a8478", fontSize: 12 }}>
          Arma en este orden, de arriba (la base) hacia abajo.
        </p>
        <BuildList pizza={p} size={size} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p style={{ color: "#8a8478", fontSize: 13 }}>Toca una pizza para ver cómo se arma.</p>
        <SizeToggle size={size} setSize={setSize} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PIZZAS.map((p, i) => (
          <button key={i} onClick={() => setOpen(i)}
            className="text-left rounded-2xl p-3 active:scale-95 transition-transform"
            style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
            <div className="h-1.5 w-8 rounded-full mb-2" style={{ background: ACCENT }} />
            <div className="font-bold leading-tight mb-2" style={{ fontFamily: DISPLAY, fontSize: 16, color: INK }}>
              {p.name}
            </div>
            <div className="flex" style={{ gap: 4 }}>
              {preview(p).map((n, k) => (
                <span key={k} className="flex items-center justify-center"
                  style={{ width: 24, height: 24, borderRadius: 8, background: "#F4F1EA" }}>
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

/* ============================ TARJETAS ============================ */
function Tarjetas({ size, setSize }) {
  const [order, setOrder] = useState(() => shuffle([...Array(PIZZAS.length).keys()]));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const p = PIZZAS[order[idx]];

  const next = () => { setRevealed(false); setIdx((idx + 1) % order.length); };
  const reshuffle = () => { setOrder(shuffle([...Array(PIZZAS.length).keys()])); setIdx(0); setRevealed(false); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#8a8478", fontSize: 13 }}>
          Tarjeta {idx + 1} de {order.length}
        </span>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{ background: SURFACE, border: `1px solid ${LINE}`, minHeight: 320 }}>
        <div className="text-center mb-1" style={{ color: "#a39c8e", fontSize: 11, letterSpacing: 1 }}>
          ¿QUÉ LLEVA Y CUÁNTO?
        </div>
        <h2 className="text-center font-bold mb-4" style={{ fontFamily: DISPLAY, fontSize: 30, color: INK }}>
          {p.name}
        </h2>

        {!revealed ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 200, gap: 14 }}>
            <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 240 }}>
              {p.build.map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
                .filter((n) => !["Pizza Sauce", "Mozzarella"].includes(n)).map((n, k) => (
                  <span key={k} className="flex items-center justify-center"
                    style={{ width: 34, height: 34, borderRadius: 10, background: "#F4F1EA" }}>
                    <Ing name={n} size={22} />
                  </span>
                ))}
            </div>
            <button onClick={() => setRevealed(true)}
              className="px-6 py-2.5 rounded-full font-bold text-white active:scale-95 transition-transform"
              style={{ background: INK, fontFamily: DISPLAY, fontSize: 16 }}>
              Revelar receta
            </button>
          </div>
        ) : (
          <BuildList pizza={p} size={size} animate show />
        )}
      </div>

      <div className="flex" style={{ gap: 10 }}>
        <button onClick={reshuffle}
          className="px-4 py-2.5 rounded-full font-semibold active:scale-95 transition-transform"
          style={{ border: `1.5px solid ${INK}`, color: INK, fontSize: 14 }}>
          Barajar
        </button>
        <button onClick={next}
          className="flex-1 py-2.5 rounded-full font-bold text-white active:scale-95 transition-transform"
          style={{ background: ACCENT, fontFamily: DISPLAY, fontSize: 16 }}>
          Siguiente ›
        </button>
      </div>
    </div>
  );
}

/* ============================ EXAMEN ============================ */
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function sample(a, n) { return shuffle(a).slice(0, n); }

function buildQuestions() {
  const qs = [];

  // 1) preguntas de número (item contado)
  const counted = [];
  PIZZAS.forEach((p) => p.build.forEach(([ing, t, f]) => {
    if (typeof t === "number") counted.push({ pizza: p.name, ing, t, f });
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
      sub: `${ES[c.ing]} (${c.ing})`, icon: c.ing,
      options: shuffle([...opts]).map(String), answer: String(correct),
    });
  });

  // 2) ¿cuál NO va en esta pizza?
  const allTops = [...new Set(PIZZAS.flatMap((p) => p.build.map((r) => r[0])))]
    .filter((n) => ICON[n]);
  sample(PIZZAS, 3).forEach((p) => {
    const own = [...new Set(p.build.map((r) => r[0]))];
    const intruders = allTops.filter((n) => !own.includes(n));
    if (intruders.length === 0) return;
    const intruder = sample(intruders, 1)[0];
    const reals = sample(own.filter((n) => !["Pizza Sauce", "Mozzarella"].includes(n)), 3);
    if (reals.length < 3) return;
    qs.push({
      q: `¿Cuál de estos NO va en la ${p.name}?`,
      sub: "Elige el ingrediente que NO pertenece.",
      options: shuffle([...reals, intruder]), answer: intruder, withIcons: true,
    });
  });

  // 3) identifica la pizza por sus ingredientes
  sample(PIZZAS, 3).forEach((p) => {
    const tops = [...new Set(p.build.map((r) => r[0]))]
      .filter((n) => !["Pizza Sauce", "Mozzarella"].includes(n)).slice(0, 4);
    const others = sample(PIZZAS.filter((x) => x.name !== p.name), 3).map((x) => x.name);
    qs.push({
      q: "¿Qué pizza usa estos ingredientes?",
      iconRow: tops, sub: tops.map((t) => ES[t]).join(" · "),
      options: shuffle([p.name, ...others]), answer: p.name,
    });
  });

  return shuffle(qs).slice(0, 10);
}

function Examen() {
  const [questions, setQuestions] = useState(buildQuestions);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  const choose = (opt) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= questions.length) { setDone(true); return; }
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
      <div className="text-center rounded-2xl p-6" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
        <div style={{ color: "#a39c8e", fontSize: 12, letterSpacing: 1 }}>RESULTADO</div>
        <div className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 52, color: ACCENT }}>
          {score}/{questions.length}
        </div>
        <p className="mb-5" style={{ color: INK, fontSize: 15 }}>{msg}</p>
        <button onClick={restart}
          className="px-6 py-2.5 rounded-full font-bold text-white active:scale-95 transition-transform"
          style={{ background: INK, fontFamily: DISPLAY, fontSize: 16 }}>
          Otro examen
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#8a8478", fontSize: 13 }}>Pregunta {i + 1} de {questions.length}</span>
        <span className="font-bold" style={{ fontFamily: DISPLAY, color: ACCENT, fontSize: 15 }}>
          Puntos: {score}
        </span>
      </div>
      {/* barra de progreso */}
      <div className="h-1.5 rounded-full mb-4" style={{ background: "#E7E2D7" }}>
        <div className="h-1.5 rounded-full" style={{ background: ACCENT, width: `${(i / questions.length) * 100}%`, transition: "width .3s" }} />
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
        <h2 className="font-bold mb-1" style={{ fontFamily: DISPLAY, fontSize: 21, color: INK, lineHeight: 1.1 }}>
          {q.q}
        </h2>
        {q.icon && (
          <div className="flex items-center my-2" style={{ gap: 8 }}>
            <Ing name={q.icon} size={26} />
            <span className="font-semibold" style={{ color: INK, fontSize: 15 }}>{q.sub}</span>
          </div>
        )}
        {q.iconRow && (
          <div className="flex flex-wrap my-3" style={{ gap: 8 }}>
            {q.iconRow.map((n, k) => (
              <span key={k} className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 12, background: "#F4F1EA" }}>
                <Ing name={n} size={26} />
              </span>
            ))}
          </div>
        )}
        {q.sub && !q.icon && (
          <p style={{ color: "#8a8478", fontSize: 12 }}>{q.sub}</p>
        )}
      </div>

      <div className="flex flex-col" style={{ gap: 10 }}>
        {q.options.map((opt, k) => {
          const isAnswer = opt === q.answer;
          const isPicked = opt === picked;
          let bg = SURFACE, bd = LINE, fg = INK;
          if (picked !== null) {
            if (isAnswer) { bg = "#E7F6EA"; bd = CUP.green; fg = "#1c6b2e"; }
            else if (isPicked) { bg = "#FBE9E7"; bd = CUP.red; fg = "#9b2c20"; }
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

/* ============================ APP ============================ */
export default function App() {
  const [mode, setMode] = useState("repaso");
  const [size, setSize] = useState("10");

  const tabs = [
    ["repaso", "Repaso"],
    ["tarjetas", "Tarjetas"],
    ["examen", "Examen"],
  ];

  return (
    <div style={{ background: PAPER, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');`}</style>

      <div className="mx-auto" style={{ maxWidth: 480 }}>
        {/* Cabecera estilo carta de cocina */}
        <header style={{ background: INK, padding: "14px 18px" }}>
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span className="font-bold text-white" style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: 0.5 }}>
              PIZZA TRAINER
            </span>
            <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 22, color: ACCENT }}>
              SECTION 1
            </span>
          </div>
          <div style={{ color: "#bdb6a8", fontSize: 11 }}>14 pizzas · arma sin equivocarte</div>
        </header>

        {/* Pestañas */}
        <div className="flex" style={{ background: "#262421" }}>
          {tabs.map(([key, label]) => (
            <button key={key} onClick={() => setMode(key)}
              className="flex-1 py-3 font-bold transition-colors"
              style={{
                fontFamily: DISPLAY, fontSize: 15, letterSpacing: 0.5,
                color: mode === key ? "#fff" : "#8b857a",
                borderBottom: mode === key ? `3px solid ${ACCENT}` : "3px solid transparent",
              }}>
              {label}
            </button>
          ))}
        </div>

        <main className="p-4 pb-10">
          {mode === "repaso" && <Repaso size={size} setSize={setSize} />}
          {mode === "tarjetas" && <Tarjetas size={size} setSize={setSize} />}
          {mode === "examen" && <Examen />}
        </main>
      </div>
    </div>
  );
}
