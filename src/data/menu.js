export const PASTA_NOTE = "Toda pasta se sirve con pan de queso y se decora con una pizca de parmesano y perejil.";

export const PASTAS = [
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

export const SUB_NOTE = "Todos los sándwiches se decoran con parmesano y se sirven con papitas kettle.";
