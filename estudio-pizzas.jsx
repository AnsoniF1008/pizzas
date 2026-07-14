import React, {
  useState, useMemo, useEffect, createContext, useContext,
} from "react";

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
  yellow: "#F5D410",
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
  "Dough": "🫓",
  "Garlicky Greengo": "🥣",
  "Taco Meat": "🌮",
  "Shredded Lettuce": "🥬",
  "Diced Tomato": "🍅",
  "Ranch Drizzle": "🥣",
  "Old World Pepperoni": "PEP",
  "Pineapple Salsa": "🍍",
  "Penne": "🍝",
  "Fettuccine": "🍝",
  "Spaghetti": "🍝",
  "Meatballs": "🧆",
  "Marinara": "🍅",
  "Milk": "🥛",
  "Italian Breadcrumbs": "🍞",
  "Blackened Ckn": "🍗",
  "Mixed Greens": "🥬",
  "Romaine Lettuce": "🥬",
  "Croutons": "🍞",
  "Kalamata Olive": "🫒",
  "Sundried Tomato": "🍅",
  "Cucumber": "🥒",
  "Parmesan": "🧀",
  "Walnuts": "🥜",
  "Sundried Cranberries": "🫐",
  "Goat Cheese": "🧀",
  "Ham": "🥓",
  "Salami/Pepp/Ham": "🍖",
  "Ranch": "🥣",
  "Italian Dressing": "🥣",
  "Chives": "🌿",
  "Roma Tomato": "🍅",
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
  "Dough": "Masa", "Garlicky Greengo": "Salsa greengo con ajo", "Taco Meat": "Carne de taco",
  "Shredded Lettuce": "Lechuga rallada", "Diced Tomato": "Tomate picado",
  "Ranch Drizzle": "Ranch o ranch de jalapeño", "Old World Pepperoni": "Pepperoni old world",
  "Pineapple Salsa": "Salsa de piña", "Penne": "Penne", "Fettuccine": "Fetuchini",
  "Spaghetti": "Espagueti", "Meatballs": "Albóndigas", "Marinara": "Salsa marinara",
  "Milk": "Leche", "Italian Breadcrumbs": "Pan rallado italiano",
  "Blackened Ckn": "Pollo ennegrecido",
  "Mixed Greens": "Mezcla de lechugas", "Romaine Lettuce": "Lechuga romana",
  "Croutons": "Crutones", "Kalamata Olive": "Aceitunas kalamata",
  "Sundried Tomato": "Tomate deshidratado", "Cucumber": "Pepino",
  "Parmesan": "Parmesano", "Walnuts": "Nueces",
  "Sundried Cranberries": "Arándanos deshidratados", "Goat Cheese": "Queso de cabra empanizado",
  "Ham": "Jamón", "Salami/Pepp/Ham": "Kit de salami, pepperoni y jamón",
  "Ranch": "Aderezo ranch", "Italian Dressing": "Aderezo italiano con parmesano",
  "Chives": "Cebollín", "Roma Tomato": "Tomate roma",
};

// Ingredientes que no se muestran en las vistas previas ni se usan como opciones del examen.
const BASE_INGS = ["Pizza Sauce", "Mozzarella", "Dough"];

const B = null;
// sec: [n1, n2] -> las primeras n1 filas son Sección 1 (base), las n2 siguientes
// Sección 2 (ingredientes) y el resto Sección 3 (terminado). afterCut: pasos
// que van DESPUÉS de hornear y cortar.
const PIZZAS = [
  { name: "CARL'S KING", sec: [5, 4], build: [
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
  { name: "BIG DON'S", sec: [4, 0], build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Canad. Bacon", 3, 5],
    ["Pepperonis", 9, 18],
    ["Big Don's Mix", ["white",1], ["white",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "BUFFALO CHICKEN", sec: [3, 1], build: [
    ["Buffalo Ranch", B, B],
    ["Smoked Mozz.", ["green",1], ["green",2]],
    ["Chicken", ["green",1], ["green",2]],
    ["Cilantro", B, B],
    ["Caram. Onions", B, B],
    ["Garlic", B, B],
    ["Buffalo Ranch", B, B],
  ]},
  { name: "WYATT'S BBQ", sec: [3, 2], build: [
    ["BBQ Sauce", B, B],
    ["Smoked Mozz.", ["green",1], ["green",2]],
    ["Chicken", ["green",1], ["green",2]],
    ["Cilantro", B, B],
    ["Red Onions", ["red",1], ["red",2]],
    ["Bacon", ["orange",1], ["orange",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
    ["BBQ Drizzle", B, B],
  ]},
  { name: "HAWAIIAN", sec: [3, 3], build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Canad. Bacon", 8, 16],
    ["Pineapple", ["red",1], ["red",2]],
    ["Cranberries", ["red",1], ["red",2]],
    ["Cashews", ["red",1], ["red",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "VEGGIE", sec: [3, 5], build: [
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
  ], afterCut: [["Parmesan", "pizca", "pizca"]]},
  { name: "PEPPERONI SUPREME", sec: [3, 2], build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Pepperonis", 20, 38],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Mushrooms", ["red",1], ["red",2]],
    ["Smoked Mozz.", ["white",1], ["white",2]],
  ]},
  { name: "BIG CHEESY", sec: [4, 0], build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Gouda", ["white",1], ["white",2]],
    ["Smoked Mozz.", ["green",1], ["green",1]],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Romano", ["orange",1], ["orange",1]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ], afterCut: [["Parmesan", "pizca", "pizca"]]},
  { name: "MARGHERITA", sec: [2, 2], build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["blue",1], ["blue",2]],
    ["Basil", ["orange",1], ["orange",1]],
    ["Tomatoes", ["white",1], ["white",2]],
    ["Garlic", B, B],
    ["Romano", ["orange",1], ["orange",1]],
    ["Olive Oil", B, B],
  ], afterCut: [["Parmesan", "pizca", "pizca"]]},
  { name: "BLANCO", sec: [5, 2], build: [
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
  ], afterCut: [["Parmesan", "pizca", "pizca"]]},
  { name: "MADELYN'S ALFREDO", sec: [4, 1], build: [
    ["Alfredo Sauce", B, B],
    ["Spinach", B, B],
    ["Mozzarella", ["green",1], ["blue",1]],
    ["Chicken", ["green",1], ["green",2]],
    ["Mushrooms", ["red",1], ["red",2]],
    ["Mozzarella", ["white",1], ["white",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ]},
  { name: "TUSCANY", sec: [3, 5], build: [
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
  ], afterCut: [["Parmesan", "pizca", "pizca"]]},
  { name: "PEPPERONI", sec: [3, 0], build: [
    ["Pizza Sauce", ["blue",1], ["blue",2]],
    ["Mozzarella", ["blue",1], ["blue",2]],
    ["Pepperonis", 12, 24],
  ]},
  { name: "POTATO HEAD", sec: [2, 1], build: [
    ["Alfredo Sauce", B, B],
    ["Mozzarella", ["blue",1], ["blue",2]],
    ["Potatoes", 13, 27],
    ["Bacon", ["orange",1], ["orange",2]],
    ["Cheddar", ["orange",1], ["orange",2]],
  ], afterCut: [["Chives", "pizca", "pizca"]]},
  { name: "TACO PIZZA", sec: [3, 1],
    note: "Carne de taco: mezcla 2.5 lb de carne molida cocida con 1 oz de sazón de taco, revuelve bien y guárdala en una bandeja ⅓ honda, etiquetada.",
    build: [
      ["Dough", "6.5 oz", "12 oz"],
      ["Garlicky Greengo", "2 oz", "4 oz"],
      ["Mozzarella", ["green",1], ["blue",1]],
      ["Taco Meat", ["green",1], [["green",1],["red",1]]],
    ],
    afterCut: [
      ["Shredded Lettuce", "1 oz", "2 oz"],
      ["Diced Tomato", "1½ oz · ~3 rodajas", "2.5 oz · 4-5 rodajas"],
      ["Cheddar", ["yellow",1], ["yellow",2]],
      ["Ranch Drizzle", "4-5 líneas", "6-8 líneas"],
    ],
  },
  { name: "SMOKIN' LUAU", sec: [3, 3],
    note: "Pasa por el horno y termina con una pizca de cilantro.",
    build: [
      ["Dough", "6.5 oz", "12 oz"],
      ["Pizza Sauce", "2 oz", "4 oz"],
      ["Mozzarella", ["green",1], ["blue",1]],
      ["Old World Pepperoni", 12, 24],
      ["Bacon", ["yellow",1], ["yellow",2]],
      ["Pineapple Salsa", ["red",1], ["red",2]],
      ["Mozzarella", ["white",1], ["white",2]],
    ],
    afterCut: [
      ["Cilantro", "pizca", "pizca"],
    ],
  },
];

const fullBuild = (p) => (p.afterCut ? [...p.build, ...p.afterCut] : p.build);

const SECTIONS = [
  { label: "SECCIÓN 1", desc: "Primera estación de la línea: salsa o base, queso y proteínas principales." },
  { label: "SECCIÓN 2", desc: "Segunda estación: vegetales y toppings del medio." },
  { label: "SECCIÓN 3", desc: "Tercera estación: los toques finales. De aquí la pizza entra al horno." },
  { label: "DESPUÉS DE HORNEAR Y CORTAR", desc: "Se agrega fuera del horno, con la pizza ya cortada." },
];

/* ============================ PASTAS Y ENTRADAS ============================ */
const PASTA_NOTE = "Toda pasta se sirve con pan de queso y se decora con una pizca de parmesano y perejil.";

const PASTAS = [
  {
    name: "BAKED MAC & CHEESE", tipo: "Pasta",
    ings: [
      ["Penne", "6 oz tibio"],
      ["Cheddar", "⅛ taza"],
      ["Smoked Mozz.", "⅛ taza"],
      ["Gouda", "⅛ taza"],
      ["Ital. Sausage", "1.5 oz"],
      ["Alfredo Sauce", "3 oz"],
      ["Italian Breadcrumbs", "para cubrir"],
    ],
    como: [
      "Mezcla el penne tibio, los 3 quesos y la salchicha con 3 oz de salsa alfredo.",
      "Pasa la mezcla a una cazuela (casserole).",
      "Cubre por encima con pan rallado italiano.",
      "Horno completo (full oven).",
    ],
  },
  {
    name: "FETTUCCINE PRIMAVERA", tipo: "Pasta",
    ings: [
      ["Spinach", "1 puñado"],
      ["Artichoke", "3 corazones"],
      ["Mushrooms", "½ taza"],
      ["Garlic", "1 pizca"],
      ["Olive Oil", "poquito"],
      ["Marinara", "2 oz"],
      ["Alfredo Sauce", "2 oz"],
      ["Fettuccine", "6 oz tibio"],
    ],
    como: [
      "Pon espinaca, alcachofa, champiñones y ajo con un poquito de aceite de oliva.",
      "Horno completo (full oven) para saltear los vegetales.",
      "Mezcla con 2 oz de marinara, 2 oz de alfredo y el fetuchini tibio.",
    ],
  },
  {
    name: "CHICKEN ALFREDO", tipo: "Pasta",
    ings: [
      ["Chicken", "porción de 3 oz"],
      ["Fettuccine", "6 oz tibio"],
      ["Alfredo Sauce", "4 oz"],
    ],
    como: [
      "Pasa el pollo por medio horno (½ oven).",
      "Mezcla con el fetuchini tibio y 4 oz de salsa alfredo.",
    ],
  },
  {
    name: "SPAGHETTI: MEATBALLS O MARINARA", tipo: "Pasta",
    ings: [
      ["Meatballs", "3 (si es con albóndigas)"],
      ["Spaghetti", "6 oz tibio"],
      ["Marinara", "4 oz"],
    ],
    como: [
      "Con albóndigas: pasa las 3 albóndigas por horno completo.",
      "Sirve el espagueti tibio con 4 oz de marinara (y las albóndigas encima).",
      "Solo marinara: espagueti tibio + 4 oz de marinara, sin albóndigas.",
    ],
  },
  {
    name: "BLACKENED CHICKEN CAPRI", tipo: "Pasta",
    ings: [
      ["Blackened Ckn", "3 oz"],
      ["Artichoke", "3 corazones"],
      ["Mushrooms", "¼ taza"],
      ["Olive Oil", "poquito"],
      ["Fettuccine", "6 oz tibio"],
      ["Alfredo Sauce", "4 oz"],
      ["Spinach", "cama para servir"],
    ],
    como: [
      "Pon el pollo ennegrecido, alcachofa y champiñones con aceite de oliva.",
      "Horno completo (full oven).",
      "Mezcla con el fetuchini tibio y 4 oz de salsa alfredo.",
      "Sirve sobre una cama de espinaca.",
    ],
  },
  {
    name: "TOMATO BASIL SOUP", tipo: "Entrada",
    ings: [
      ["Marinara", "4 oz"],
      ["Alfredo Sauce", "4 oz"],
      ["Romano", "⅛ taza"],
      ["Milk", "2 oz"],
      ["Basil", "¼ taza"],
    ],
    como: [
      "Mezcla marinara, alfredo, romano, leche y albahaca.",
      "Pasa por ¾ de horno.",
      "Decora con una flor de albahaca y una pizca de romano.",
      "Se sirve con pan de queso.",
    ],
  },
  {
    name: "MEATBALLER", tipo: "Entrada",
    ings: [
      ["Meatballs", "4"],
      ["Olive Oil", "1 cdta para cubrir"],
      ["Romano", "para cubrir"],
      ["Marinara", "3 oz encima"],
    ],
    como: [
      "Cubre las 4 albóndigas con aceite de oliva y luego con romano.",
      "Horno completo en cazuela (casserole).",
      "Ponles 3 oz de marinara encima y pasa por ¾ de horno.",
      "Decora con flor de albahaca y pizca de parmesano. Se sirve con pan de ajo.",
    ],
  },
  {
    name: "HOUSE SALAD", tipo: "Ensalada", note: "Aderezo: a elección del cliente.",
    ings: [
      ["Mixed Greens", "base"],
      ["Roma Tomato", "6 · lunch 3"],
      ["Cucumber", "6 · lunch 3"],
      ["Black Olives", "6 · lunch 3"],
      ["Croutons", "6 · lunch 3"],
    ],
    como: [
      "Base de mezcla de lechugas en el bowl.",
      "Agrega 6 piezas de cada topping (en tamaño lunch van 3 de cada uno).",
      "Sirve con el aderezo que elija el cliente.",
    ],
  },
  {
    name: "CAESAR SALAD", tipo: "Ensalada", note: "Aderezo: Caesar.",
    ings: [
      ["Romaine Lettuce", "base"],
      ["Parmesan", "¼ taza"],
      ["Croutons", "6 · lunch 3"],
    ],
    como: [
      "Base de lechuga romana en el bowl.",
      "Agrega ¼ de taza de parmesano y 6 crutones (lunch: 3).",
      "Sirve con aderezo Caesar.",
    ],
  },
  {
    name: "GREEK SALAD", tipo: "Ensalada", note: "Aderezo: vinagreta balsámica.",
    ings: [
      ["Romaine Lettuce", "base"],
      ["Roma Tomato", "6"],
      ["Cucumber", "6"],
      ["Kalamata Olive", "6"],
      ["Sundried Tomato", "¼ taza"],
      ["Feta", "⅛ taza"],
    ],
    como: [
      "Base de lechuga romana en el bowl.",
      "Agrega 6 tomates, 6 pepinos y 6 aceitunas kalamata.",
      "Termina con ¼ taza de tomate deshidratado y ⅛ taza de feta.",
      "Sirve con vinagreta balsámica.",
    ],
  },
  {
    name: "HAWAIIAN SALAD", tipo: "Ensalada", note: "Aderezo: walnut raspberry (nuez y frambuesa).",
    ings: [
      ["Mixed Greens", "base"],
      ["Sundried Tomato", "¼ taza"],
      ["Pineapple", "¼ taza"],
      ["Cashews", "¼ taza"],
      ["Sundried Cranberries", "¼ taza"],
    ],
    como: [
      "Base de mezcla de lechugas en el bowl.",
      "Agrega ¼ de taza de cada topping: tomate deshidratado, piña, marañón y arándanos deshidratados.",
      "Sirve con aderezo walnut raspberry.",
    ],
  },
  {
    name: "CRUSTED GOAT CHEESE SALAD", tipo: "Ensalada", note: "Aderezo: vinagreta balsámica.",
    ings: [
      ["Spinach", "base"],
      ["Sundried Cranberries", "¼ taza"],
      ["Walnuts", "¼ taza"],
      ["Bacon", "¼ taza"],
      ["Goat Cheese", "1 pieza"],
    ],
    como: [
      "1º En el bowl: espinaca, ¼ taza de arándanos, ¼ taza de nueces y ¼ taza de tocineta.",
      "2º Pasa el queso de cabra empanizado por horno completo.",
      "Colócalo encima y sirve con vinagreta balsámica.",
    ],
  },
  {
    name: "CRUST SALAD", tipo: "Ensalada", note: "Aderezo: ranch.",
    ings: [
      ["Mixed Greens", "base"],
      ["Roma Tomato", "6"],
      ["Artichoke", "3 corazones"],
      ["Bacon", "¼ taza"],
      ["Chicken", "3 oz"],
      ["Feta", "¼ taza"],
    ],
    como: [
      "1º En el bowl: mezcla de lechugas, 6 tomates, 3 corazones de alcachofa y ¼ taza de tocineta.",
      "2º Pasa el pollo (3 oz) por medio horno y agrégalo.",
      "3º Termina con ¼ taza de feta encima. Sirve con ranch.",
    ],
  },
  {
    name: "CHICKEN CLUB", tipo: "Sándwich",
    ings: [
      ["Mozzarella", "¼ taza por lado"],
      ["Chicken", "porción de 3 oz"],
      ["Bacon", "¼ taza"],
      ["Cheddar", "⅛ taza"],
      ["Shredded Lettuce", "al gusto"],
      ["Tomatoes", "4 rodajas"],
      ["Ranch", "ligero (lt)"],
    ],
    como: [
      "Pon ¼ taza de mozzarella en cada lado del pan plano.",
      "Agrega el pollo, la tocineta y el cheddar.",
      "Pasa por medio horno (½ oven).",
      "Al salir: lechuga rallada, 4 rodajas de tomate y un toque de ranch.",
    ],
  },
  {
    name: "BAKED ITALIAN", tipo: "Sándwich",
    ings: [
      ["Mozzarella", "¼ taza por lado"],
      ["Salami/Pepp/Ham", "1 kit"],
      ["Shredded Lettuce", "al gusto"],
      ["Tomatoes", "4 rodajas"],
      ["Italian Dressing", "al gusto"],
    ],
    como: [
      "Pon ¼ taza de mozzarella en cada lado del pan plano.",
      "Agrega el kit de salami, pepperoni y jamón.",
      "Pasa por medio horno (½ oven).",
      "Al salir: lechuga rallada, 4 rodajas de tomate y aderezo italiano con parmesano.",
    ],
  },
  {
    name: "BAKED HAM & CHEESE", tipo: "Sándwich",
    ings: [
      ["Mozzarella", "¼ taza por lado"],
      ["Ham", "5 piezas"],
      ["Cheddar", "¼ taza"],
      ["Shredded Lettuce", "al gusto"],
      ["Tomatoes", "4 rodajas"],
      ["Ranch", "al gusto"],
    ],
    como: [
      "Pon ¼ taza de mozzarella en cada lado del pan plano.",
      "Agrega 5 piezas de jamón y ¼ taza de cheddar.",
      "Pasa por medio horno (½ oven).",
      "Al salir: lechuga rallada, 4 rodajas de tomate y ranch.",
    ],
  },
  {
    name: "MEATBALL SUB", tipo: "Sándwich",
    ings: [
      ["Meatballs", "4"],
      ["Pizza Sauce", "2 oz"],
      ["Mozzarella", "¼ taza por lado"],
      ["Romano", "encima al final"],
    ],
    como: [
      "Pasa las 4 albóndigas con 2 oz de salsa de pizza por horno completo.",
      "Pon ¼ taza de mozzarella en cada lado del pan plano.",
      "Arma el sub y pásalo por medio horno (½ oven).",
      "Termina con romano encima.",
    ],
  },
];

const SUB_NOTE = "Todos los sándwiches se decoran con parmesano y se sirven con papitas kettle.";

const ACCENT = "#FF6600";
const DISPLAY = "'Oswald','Arial Narrow','Helvetica Neue',sans-serif";

/* ============================ TEMAS ============================ */
const THEMES = {
  light: {
    ink: "#161616", onInk: "#FFFFFF",
    paper: "#F4F1EA", surface: "#FFFFFF", line: "#E3DDD0",
    zebra: "#FAF8F3", chip: "#F4F1EA", toggleBg: "#E7E2D7",
    muted: "#8a8478", subtle: "#9b958a", faint: "#a39c8e",
    header: "#161616", headerSub: "#bdb6a8", tabBar: "#262421", tabIdle: "#8b857a",
    okBg: "#E7F6EA", okFg: "#1c6b2e", badBg: "#FBE9E7", badFg: "#9b2c20",
  },
  dark: {
    ink: "#F2EFE8", onInk: "#161616",
    paper: "#171614", surface: "#242220", line: "#3A3732",
    zebra: "#2A2825", chip: "#33302B", toggleBg: "#3A3732",
    muted: "#A29A8C", subtle: "#8D867A", faint: "#7E786D",
    header: "#0E0D0C", headerSub: "#8d867a", tabBar: "#0A0908", tabIdle: "#6f695f",
    okBg: "#1E3A26", okFg: "#7FD695", badBg: "#43201C", badFg: "#F1998D",
  },
};
const ThemeCtx = createContext(THEMES.light);
const useT = () => useContext(ThemeCtx);

/* ===================== PERSISTENCIA (localStorage) ===================== */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin espacio o modo privado */ }
}

/* ===================== SONIDO Y VIBRACIÓN ===================== */
let audioCtx = null;
function tone(freq, start, dur, type, vol) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, audioCtx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(audioCtx.currentTime + start);
  o.stop(audioCtx.currentTime + start + dur);
}
function feedback(ok, soundOn) {
  if (soundOn) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      if (ok) { tone(660, 0, 0.09, "sine", 0.12); tone(880, 0.09, 0.14, "sine", 0.12); }
      else { tone(180, 0, 0.22, "square", 0.08); }
    } catch { /* sin soporte de audio */ }
  }
  if (navigator.vibrate) navigator.vibrate(ok ? 25 : [90, 50, 90]);
}

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
  const t = useT();
  if (value === null || value === undefined) {
    return <span className="italic" style={{ color: t.subtle, fontSize: big ? 13 : 11 }}>base</span>;
  }
  if (typeof value === "number") {
    return (
      <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: big ? 22 : 17, color: t.ink }}>
        {value}
      </span>
    );
  }
  if (typeof value === "string") {
    return (
      <span className="font-semibold text-right leading-tight" style={{ color: t.ink, fontSize: big ? 14 : 12 }}>
        {value}
      </span>
    );
  }
  // [color, n] o mezcla de vasitos: [[color, n], [color, n]]
  const groups = Array.isArray(value[0]) ? value : [value];
  const r = big ? 9 : 7;
  return (
    <span className="inline-flex items-center" style={{ gap: 4 }}>
      {groups.map(([color, n], gi) => (
        <span key={gi} className="inline-flex items-center" style={{ gap: 3 }}>
          {gi > 0 && <span style={{ color: t.muted, fontSize: 11 }}>+</span>}
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} style={{
              width: r, height: r, borderRadius: "50%", background: CUP[color],
              border: color === "white" ? "1.5px solid #b9b9b9" : "1px solid rgba(0,0,0,.15)",
              display: "inline-block",
            }} />
          ))}
        </span>
      ))}
    </span>
  );
}

/* ===================== CONTROL DE TAMAÑO ===================== */
function SizeToggle({ size, setSize }) {
  const t = useT();
  return (
    <div className="inline-flex rounded-full p-1" style={{ background: t.toggleBg }}>
      {["10", "14"].map((s) => (
        <button key={s} onClick={() => setSize(s)}
          className="px-4 py-1 rounded-full text-sm font-bold transition-colors"
          style={{
            fontFamily: DISPLAY,
            background: size === s ? t.ink : "transparent",
            color: size === s ? t.onInk : t.muted,
          }}>
          {s}"
        </button>
      ))}
    </div>
  );
}

/* ===================== TARJETA DE CONSTRUCCIÓN ===================== */
function SectionHeader({ idx }) {
  const t = useT();
  const s = SECTIONS[idx];
  const colors = [CUP.blue, CUP.green, ACCENT, CUP.red];
  return (
    <div className="flex items-center mt-2" style={{ gap: 8 }}>
      <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: colors[idx] }} />
      <span className="leading-tight">
        <span className="block font-bold" style={{ fontFamily: DISPLAY, fontSize: 12.5, letterSpacing: 0.8, color: t.ink }}>
          {s.label}
        </span>
        <span className="block" style={{ color: t.muted, fontSize: 10.5 }}>{s.desc}</span>
      </span>
    </div>
  );
}

function BuildList({ pizza, size, animate = false, show = true, sections = true }) {
  const t = useT();
  const [s1, s2len] = pizza.sec || [pizza.build.length, 0];
  const boundary2 = s1 + s2len;

  const renderRow = (row, i, delayIdx) => {
    const [ing, tt, f] = row;
    const val = size === "10" ? tt : f;
    return (
      <div key={`r${i}`}
        className="flex items-center rounded-xl"
        style={{
          gap: 10, padding: "7px 10px",
          background: i % 2 ? t.zebra : t.surface,
          border: `1px solid ${t.line}`,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(8px)",
          transition: animate ? "opacity .35s ease, transform .35s ease" : "none",
          transitionDelay: animate ? `${delayIdx * 55}ms` : "0ms",
        }}>
        <span className="flex items-center justify-center"
          style={{ width: 26, height: 26, flexShrink: 0 }}>
          <Ing name={ing} size={22} />
        </span>
        <span className="flex-1 leading-tight">
          <span className="font-semibold" style={{ color: t.ink, fontSize: 14 }}>{ing}</span>
          <span className="block" style={{ color: t.muted, fontSize: 11 }}>{ES[ing]}</span>
        </span>
        <span className="flex items-center justify-end" style={{ minWidth: 54, maxWidth: 130 }}>
          <Amount value={val} />
        </span>
      </div>
    );
  };

  const items = [];
  let delayIdx = 0;
  pizza.build.forEach((row, i) => {
    if (sections) {
      if (i === 0) items.push(<SectionHeader key="h0" idx={0} />);
      if (i === s1 && s2len > 0) items.push(<SectionHeader key="h1" idx={1} />);
      if (i === boundary2 && i < pizza.build.length) items.push(<SectionHeader key="h2" idx={2} />);
    }
    items.push(renderRow(row, i, delayIdx++));
  });
  if (sections && pizza.afterCut) {
    items.push(<SectionHeader key="h3" idx={3} />);
    pizza.afterCut.forEach((row, i) => items.push(renderRow(row, pizza.build.length + i, delayIdx++)));
  }

  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      {items}
      {sections && pizza.note && (
        <p className="rounded-xl px-3 py-2 mt-1" style={{ background: t.zebra, border: `1px dashed ${t.line}`, color: t.muted, fontSize: 12 }}>
          💡 {pizza.note}
        </p>
      )}
    </div>
  );
}

/* ============================ REPASO ============================ */
function Repaso({ size, setSize }) {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");

  const preview = (p) =>
    fullBuild(p).map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
      .filter((n) => !BASE_INGS.includes(n)).slice(0, 4);

  const q = query.trim().toLowerCase();
  const results = q === "" ? PIZZAS.map((_, i) => i) : PIZZAS.map((p, i) => {
    const inName = p.name.toLowerCase().includes(q);
    const inIngs = fullBuild(p).some(([ing]) =>
      ing.toLowerCase().includes(q) || (ES[ing] || "").toLowerCase().includes(q));
    return inName || inIngs ? i : -1;
  }).filter((i) => i !== -1);

  if (open !== null) {
    const p = PIZZAS[open];
    return (
      <div className="mx-auto w-full max-w-xl">
        <button onClick={() => setOpen(null)}
          className="flex items-center text-sm font-semibold mb-3" style={{ color: ACCENT, gap: 4 }}>
          ‹ Todas las pizzas
        </button>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold tracking-tight" style={{ fontFamily: DISPLAY, fontSize: 26, color: t.ink }}>
            {p.name}
          </h2>
          <SizeToggle size={size} setSize={setSize} />
        </div>
        <p className="mb-3" style={{ color: t.muted, fontSize: 12 }}>
          Arma en este orden, de arriba hacia abajo. Cada pizza pasa por las 3 secciones de la línea antes de entrar al horno.
        </p>
        <BuildList pizza={p} size={size} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3" style={{ gap: 10 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pizza o ingrediente…"
          className="flex-1 rounded-full px-4 py-2 outline-none"
          style={{
            background: t.surface, border: `1.5px solid ${t.line}`,
            color: t.ink, fontSize: 14,
          }}
        />
        <SizeToggle size={size} setSize={setSize} />
      </div>
      {results.length === 0 ? (
        <p className="text-center py-10" style={{ color: t.muted, fontSize: 14 }}>
          Ninguna pizza lleva "{query}".
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map((i) => {
            const p = PIZZAS[i];
            return (
              <button key={i} onClick={() => setOpen(i)}
                className="text-left rounded-2xl p-3 active:scale-95 transition-transform"
                style={{ background: t.surface, border: `1px solid ${t.line}` }}>
                <div className="h-1.5 w-8 rounded-full mb-2" style={{ background: ACCENT }} />
                <div className="font-bold leading-tight mb-2" style={{ fontFamily: DISPLAY, fontSize: 16, color: t.ink }}>
                  {p.name}
                </div>
                <div className="flex" style={{ gap: 4 }}>
                  {preview(p).map((n, k) => (
                    <span key={k} className="flex items-center justify-center"
                      style={{ width: 24, height: 24, borderRadius: 8, background: t.chip }}>
                      <Ing name={n} size={17} />
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================ TARJETAS ============================ */
function Tarjetas({ size, setSize }) {
  const t = useT();
  const [order, setOrder] = useState(() => shuffle([...Array(PIZZAS.length).keys()]));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const p = PIZZAS[order[idx]];

  const next = () => { setRevealed(false); setIdx((idx + 1) % order.length); };
  const reshuffle = () => { setOrder(shuffle([...Array(PIZZAS.length).keys()])); setIdx(0); setRevealed(false); };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: t.muted, fontSize: 13 }}>
          Tarjeta {idx + 1} de {order.length}
        </span>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{ background: t.surface, border: `1px solid ${t.line}`, minHeight: 320 }}>
        <div className="text-center mb-1" style={{ color: t.faint, fontSize: 11, letterSpacing: 1 }}>
          ¿QUÉ LLEVA Y CUÁNTO?
        </div>
        <h2 className="text-center font-bold mb-4" style={{ fontFamily: DISPLAY, fontSize: 30, color: t.ink }}>
          {p.name}
        </h2>

        {!revealed ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 200, gap: 14 }}>
            <div className="flex flex-wrap justify-center" style={{ gap: 8, maxWidth: 240 }}>
              {fullBuild(p).map((r) => r[0]).filter((n, i, a) => a.indexOf(n) === i)
                .filter((n) => !BASE_INGS.includes(n)).map((n, k) => (
                  <span key={k} className="flex items-center justify-center"
                    style={{ width: 34, height: 34, borderRadius: 10, background: t.chip }}>
                    <Ing name={n} size={22} />
                  </span>
                ))}
            </div>
            <button onClick={() => setRevealed(true)}
              className="px-6 py-2.5 rounded-full font-bold active:scale-95 transition-transform"
              style={{ background: t.ink, color: t.onInk, fontFamily: DISPLAY, fontSize: 16 }}>
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
          style={{ border: `1.5px solid ${t.ink}`, color: t.ink, fontSize: 14 }}>
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

/* ===================== ORDENAR PASOS ===================== */
function Ordenar({ size, setSize, soundOn, onMiss }) {
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
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: t.muted, fontSize: 13 }}>
          Toca los pasos en el orden correcto.
        </span>
        <SizeToggle size={size} setSize={setSize} />
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 24, color: t.ink }}>
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
              className="px-6 py-2.5 rounded-full font-bold text-white active:scale-95 transition-transform"
              style={{ background: ACCENT, fontFamily: DISPLAY, fontSize: 16 }}>
              Otra pizza ›
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

function Examen({ soundOn, onMiss, onExamDone }) {
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
      <div className="mx-auto w-full max-w-xl text-center rounded-2xl p-6" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
        <div style={{ color: t.faint, fontSize: 12, letterSpacing: 1 }}>RESULTADO</div>
        <div className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 52, color: ACCENT }}>
          {score}/{questions.length}
        </div>
        <p className="mb-5" style={{ color: t.ink, fontSize: 15 }}>{msg}</p>
        <button onClick={restart}
          className="px-6 py-2.5 rounded-full font-bold active:scale-95 transition-transform"
          style={{ background: t.ink, color: t.onInk, fontFamily: DISPLAY, fontSize: 16 }}>
          Otro examen
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

/* ============================ MENÚ (pastas, ensaladas, sándwiches) ============================ */
const TIPO_COLOR = { Pasta: "#FF6600", Ensalada: "#27AE45", "Sándwich": "#2E86DE", Entrada: "#F39C12" };
const TIPOS = ["Todo", "Pasta", "Ensalada", "Sándwich", "Entrada"];

function Pastas() {
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
            💡 {PASTA_NOTE}
          </p>
        )}
        {p.tipo === "Sándwich" && (
          <p className="rounded-xl px-3 py-2 mt-3" style={{ background: t.zebra, border: `1px dashed ${t.line}`, color: t.muted, fontSize: 12 }}>
            💡 {SUB_NOTE}
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

/* ============================ CORTES ============================ */
function CutDiagram({ kind, size = 110 }) {
  const t = useT();
  const stroke = t.ink;
  const dash = { stroke, strokeWidth: 1.6, strokeDasharray: "5 4", fill: "none" };
  const solid = { stroke, strokeWidth: 3.5, fill: "none" };
  const R = 46, C = 55;

  if (kind === "calzone-p" || kind === "calzone-l") {
    // media luna
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
    lines.push([C, C - R, C, C + R, true], [C - R, C, C + R, C, true]);
  } else if (kind === "square-2") {
    [-15, 15].forEach((o) => {
      lines.push([C + o, C - R, C + o, C + R, true], [C - R, C + o, C + R, C + o, true]);
    });
  } else if (kind === "square-3") {
    [-23, 0, 23].forEach((o) => {
      lines.push([C + o, C - R, C + o, C + R, true], [C - R, C + o, C + R, C + o, true]);
    });
  } else if (kind === "bread") {
    for (let i = 1; i <= 7; i++) {
      const x = C - R + (i * 2 * R) / 8;
      lines.push([x, C - R, x, C + R, true]);
    }
    lines.push([C - R, C, C + R, C, true]);
  } else if (kind === "triangle-6") {
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6;
      lines.push([C - R * Math.cos(a), C - R * Math.sin(a), C + R * Math.cos(a), C + R * Math.sin(a), true]);
    }
  } else if (kind === "triangle-8") {
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 4;
      lines.push([C - R * Math.cos(a), C - R * Math.sin(a), C + R * Math.cos(a), C + R * Math.sin(a), true]);
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 110 110">
      <defs>
        <clipPath id={`clip-${kind}`}><circle cx={C} cy={C} r={R - 1} /></clipPath>
      </defs>
      <circle cx={C} cy={C} r={R} {...solid} />
      <g clipPath={`url(#clip-${kind})`}>
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

function Cortes() {
  const t = useT();
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="mb-3" style={{ color: t.muted, fontSize: 13 }}>
        Cómo se corta cada producto al salir del horno.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {CUTS.map((c, i) => (
          <div key={i} className="rounded-2xl p-3 text-center flex flex-col items-center"
            style={{ background: t.surface, border: `1px solid ${t.line}` }}>
            <CutDiagram kind={c.kind} />
            <div className="font-bold mt-1" style={{ fontFamily: DISPLAY, fontSize: 14, color: t.ink }}>
              {c.title}
            </div>
            <div style={{ color: t.muted, fontSize: 11.5, lineHeight: 1.3 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
        <h3 className="font-bold mb-2" style={{ fontFamily: DISPLAY, fontSize: 16, color: t.ink }}>
          Toques al salir del horno
        </h3>
        <ul className="flex flex-col" style={{ gap: 8, color: t.ink, fontSize: 13.5, lineHeight: 1.4 }}>
          <li>🧀 <b>Parmesano encima:</b> Big Cheesy, Blanco, Margherita, Tuscany, Veggie y Green Goat.</li>
          <li>🌿 <b>Cebollín (chives) encima:</b> Mr. Potato Head.</li>
          <li>🥣 <b>Calzones:</b> personal con 1 marinara, grande con 2 marinaras.</li>
          <li>🧄 <b>Garlic knots, cheese bread y stuffed crust:</b> espolvorear queso parmesano con perejil.</li>
        </ul>
      </div>
    </div>
  );
}

/* ============================ PROGRESO ============================ */
function Progreso({ stats, onClear }) {
  const t = useT();
  const exams = [...stats.exams].reverse();
  const misses = Object.entries(stats.misses).sort((a, b) => b[1] - a[1]);
  const best = stats.exams.reduce((m, e) => Math.max(m, Math.round((e.score / e.total) * 100)), 0);
  const avg = stats.exams.length
    ? Math.round(stats.exams.reduce((s, e) => s + (e.score / e.total) * 100, 0) / stats.exams.length)
    : 0;

  const fmt = (ts) => new Date(ts).toLocaleDateString("es", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  if (stats.exams.length === 0 && misses.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl text-center rounded-2xl p-8" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
        <div style={{ fontSize: 40 }}>📊</div>
        <h2 className="font-bold my-2" style={{ fontFamily: DISPLAY, fontSize: 22, color: t.ink }}>
          Aún no hay progreso
        </h2>
        <p style={{ color: t.muted, fontSize: 14 }}>
          Haz un examen o practica en "Orden" y aquí verás tu historial y las pizzas que más fallas.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* resumen */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          ["Exámenes", stats.exams.length],
          ["Mejor", `${best}%`],
          ["Promedio", `${avg}%`],
        ].map(([label, val], k) => (
          <div key={k} className="rounded-2xl p-3 text-center" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
            <div className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 26, color: ACCENT }}>{val}</div>
            <div style={{ color: t.muted, fontSize: 11, letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* pizzas más falladas */}
      {misses.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
            Pizzas que más fallas
          </h3>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {misses.slice(0, 6).map(([name, n]) => {
              const max = misses[0][1];
              return (
                <div key={name} className="flex items-center" style={{ gap: 10 }}>
                  <span className="font-semibold" style={{ color: t.ink, fontSize: 13, width: 150, flexShrink: 0 }}>{name}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: t.toggleBg }}>
                    <div className="h-2.5 rounded-full" style={{ background: CUP.red, width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="font-bold" style={{ fontFamily: DISPLAY, color: t.ink, fontSize: 14, width: 24, textAlign: "right" }}>{n}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3" style={{ color: t.faint, fontSize: 11 }}>
            Cuenta los fallos en el examen y en el modo Orden. Repasa esas recetas.
          </p>
        </div>
      )}

      {/* historial */}
      {exams.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: t.ink }}>
            Últimos exámenes
          </h3>
          <div className="flex flex-col" style={{ gap: 6 }}>
            {exams.slice(0, 10).map((e, k) => {
              const pct = Math.round((e.score / e.total) * 100);
              return (
                <div key={k} className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: k % 2 ? t.zebra : "transparent" }}>
                  <span style={{ color: t.muted, fontSize: 12 }}>{fmt(e.date)}</span>
                  <span className="font-bold" style={{
                    fontFamily: DISPLAY, fontSize: 16,
                    color: pct >= 80 ? CUP.green : pct >= 50 ? CUP.orange : CUP.red,
                  }}>
                    {e.score}/{e.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={() => {
        if (window.confirm("¿Borrar todo tu progreso? Esto no se puede deshacer.")) onClear();
      }}
        className="px-4 py-2 rounded-full font-semibold active:scale-95 transition-transform"
        style={{ border: `1.5px solid ${CUP.red}`, color: CUP.red, fontSize: 13 }}>
        Borrar progreso
      </button>
    </div>
  );
}

/* ============================ APP ============================ */
export default function App() {
  const [mode, setMode] = useState("repaso");
  const [size, setSize] = useState("10");
  const [themeName, setThemeName] = useState(() => load("pt-theme", "light"));
  const [soundOn, setSoundOn] = useState(() => load("pt-sound", true));
  const [stats, setStats] = useState(() => load("pt-stats", { exams: [], misses: {} }));

  const t = THEMES[themeName] || THEMES.light;

  useEffect(() => { save("pt-theme", themeName); }, [themeName]);
  useEffect(() => { save("pt-sound", soundOn); }, [soundOn]);
  useEffect(() => { save("pt-stats", stats); }, [stats]);

  const recordMiss = (pizzaName) => setStats((s) => ({
    ...s,
    misses: { ...s.misses, [pizzaName]: (s.misses[pizzaName] || 0) + 1 },
  }));
  const recordExam = (score, total) => setStats((s) => ({
    ...s,
    exams: [...s.exams, { date: Date.now(), score, total }].slice(-50),
  }));
  const clearStats = () => setStats({ exams: [], misses: {} });

  const tabs = [
    ["repaso", "Repaso"],
    ["tarjetas", "Tarjetas"],
    ["orden", "Orden"],
    ["examen", "Examen"],
    ["pastas", "Menú"],
    ["cortes", "Cortes"],
    ["progreso", "Progreso"],
  ];

  return (
    <ThemeCtx.Provider value={t}>
      <div style={{ background: t.paper, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');`}</style>

        <div className="mx-auto w-full max-w-[480px] md:max-w-4xl md:py-8 md:px-6">
          <div className="md:rounded-2xl md:overflow-hidden md:shadow-xl" style={{ background: t.paper }}>
            {/* Cabecera estilo carta de cocina */}
            <header className="flex items-center justify-between" style={{ background: t.header, padding: "14px 18px" }}>
              <div>
                <div className="flex items-baseline" style={{ gap: 8 }}>
                  <span className="font-bold text-white" style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: 0.5 }}>
                    PIZZA TRAINER
                  </span>
                  <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: 22, color: ACCENT }}>
                    SECTION 1
                  </span>
                </div>
                <div style={{ color: t.headerSub, fontSize: 11 }}>pizzas · pastas · ensaladas · sándwiches · cortes</div>
              </div>
              <div className="flex items-center" style={{ gap: 6 }}>
                <button onClick={() => setSoundOn(!soundOn)}
                  aria-label={soundOn ? "Silenciar" : "Activar sonido"}
                  className="flex items-center justify-center rounded-full active:scale-90 transition-transform"
                  style={{ width: 36, height: 36, fontSize: 17, background: "rgba(255,255,255,.1)" }}>
                  {soundOn ? "🔊" : "🔇"}
                </button>
                <button onClick={() => setThemeName(themeName === "light" ? "dark" : "light")}
                  aria-label={themeName === "light" ? "Modo oscuro" : "Modo claro"}
                  className="flex items-center justify-center rounded-full active:scale-90 transition-transform"
                  style={{ width: 36, height: 36, fontSize: 17, background: "rgba(255,255,255,.1)" }}>
                  {themeName === "light" ? "🌙" : "☀️"}
                </button>
              </div>
            </header>

            {/* Pestañas */}
            <div className="flex overflow-x-auto" style={{ background: t.tabBar }}>
              {tabs.map(([key, label]) => (
                <button key={key} onClick={() => setMode(key)}
                  className="flex-1 py-3 px-2 font-bold transition-colors whitespace-nowrap"
                  style={{
                    fontFamily: DISPLAY, fontSize: 13, letterSpacing: 0.3, minWidth: 64,
                    color: mode === key ? "#fff" : t.tabIdle,
                    borderBottom: mode === key ? `3px solid ${ACCENT}` : "3px solid transparent",
                  }}>
                  {label}
                </button>
              ))}
              <a href="/3d/"
                className="flex-1 py-3 px-2 font-bold whitespace-nowrap text-center"
                style={{
                  fontFamily: DISPLAY, fontSize: 13, letterSpacing: 0.3, minWidth: 64,
                  color: ACCENT, borderBottom: "3px solid transparent", textDecoration: "none",
                }}>
                Juego 3D
              </a>
            </div>

            <main className="p-4 pb-10 md:p-6 md:pb-12">
              {mode === "repaso" && <Repaso size={size} setSize={setSize} />}
              {mode === "tarjetas" && <Tarjetas size={size} setSize={setSize} />}
              {mode === "orden" && <Ordenar size={size} setSize={setSize} soundOn={soundOn} onMiss={recordMiss} />}
              {mode === "examen" && <Examen soundOn={soundOn} onMiss={recordMiss} onExamDone={recordExam} />}
              {mode === "pastas" && <Pastas />}
              {mode === "cortes" && <Cortes />}
              {mode === "progreso" && <Progreso stats={stats} onClear={clearStats} />}
            </main>
          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
