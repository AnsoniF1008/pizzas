/* Shared WebGL Photorealism Kit: Poly Haven HDRI, PBR Surface Maps & Studio Food Normal/Roughness Generator */
(function (global) {
  const TEX_LOADER = new THREE.TextureLoader();
  const PHOTO_CACHE = {};
  const PBR_SURFACE_CACHE = {};

  function tuneTex(tex, encoding, rx, ry) {
    tex.encoding = encoding;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    if (rx || ry) tex.repeat.set(rx || 1, ry || 1);
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }

  function addUv2(geo) {
    if (geo && geo.attributes && geo.attributes.uv && !geo.attributes.uv2) {
      geo.setAttribute('uv2', geo.attributes.uv);
    }
    return geo;
  }

  /* Loads real Poly Haven 1K equirectangular .hdr and generates PMREM environment lighting */
  function loadHDRI(renderer, scene, url) {
    const hdrUrl = url || '/assets/hdri/warm_restaurant_1k.hdr';
    try {
      if (typeof THREE.RGBELoader !== 'function') return;
      const loader = new THREE.RGBELoader();
      if (THREE.UnsignedByteType) loader.setDataType(THREE.UnsignedByteType);
      loader.load(hdrUrl, function (hdr) {
        try {
          const pmrem = new THREE.PMREMGenerator(renderer);
          pmrem.compileEquirectangularShader();
          const rt = pmrem.fromEquirectangular(hdr);
          scene.environment = rt.texture;
          hdr.dispose();
          pmrem.dispose();
        } catch (err) {
          console.warn('HDRI PMREM fallback:', err);
        }
      });
    } catch (e) {
      console.warn('HDRI load skipped:', e);
    }
  }

  /* Binds Poly Haven PBR set (diff, nor, rough, ao) to an existing MeshStandard/PhysicalMaterial */
  function applyPolyHavenSet(material, folder, rx, ry, opts) {
    if (!material || !folder) return material;
    opts = opts || {};
    const key = folder + '|' + (rx || 1) + '|' + (ry || 1);
    let entry = PBR_SURFACE_CACHE[key];
    if (!entry) {
      const base = '/assets/pbr/' + folder + '/';
      entry = {
        diff: tuneTex(TEX_LOADER.load(base + 'diff.jpg'), THREE.sRGBEncoding, rx, ry),
        nor: tuneTex(TEX_LOADER.load(base + 'nor.jpg'), THREE.LinearEncoding, rx, ry),
        rough: tuneTex(TEX_LOADER.load(base + 'rough.jpg'), THREE.LinearEncoding, rx, ry),
        ao: tuneTex(TEX_LOADER.load(base + 'ao.jpg'), THREE.LinearEncoding, rx, ry),
      };
      PBR_SURFACE_CACHE[key] = entry;
    }
    material.map = entry.diff;
    material.normalMap = entry.nor;
    material.normalScale = new THREE.Vector2(opts.normalScale || 0.85, opts.normalScale || 0.85);
    material.roughnessMap = entry.rough;
    if (opts.ao !== false) {
      material.aoMap = entry.ao;
      material.aoMapIntensity = opts.aoIntensity != null ? opts.aoIntensity : 0.7;
    }
    material.needsUpdate = true;
    return material;
  }

  /* Builds Sobel normal map + specular roughness map from a loaded studio food photo */
  function bakeDerivedMaps(img, norTex, roughTex, bumpStrength, minRough, maxRough) {
    const size = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    g.drawImage(img, 0, 0, size, size);
    const src = g.getImageData(0, 0, size, size).data;

    const lum = new Float32Array(size * size);
    for (let i = 0; i < lum.length; i++) {
      const o = i * 4;
      lum[i] = (0.299 * src[o] + 0.587 * src[o + 1] + 0.114 * src[o + 2]) / 255;
    }

    const nData = g.createImageData(size, size);
    const nd = nData.data;
    const str = bumpStrength || 2.8;
    const sample = (x, y) => lum[((y + size) % size) * size + ((x + size) % size)];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const tl = sample(x - 1, y - 1), t = sample(x, y - 1), tr = sample(x + 1, y - 1);
        const l = sample(x - 1, y), r = sample(x + 1, y);
        const bl = sample(x - 1, y + 1), b = sample(x, y + 1), br = sample(x + 1, y + 1);
        const dx = (tr + 2 * r + br) - (tl + 2 * l + bl);
        const dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
        let nx = -dx * str, ny = -dy * str, nz = 1.0;
        const inv = 1 / Math.hypot(nx, ny, nz);
        nx *= inv; ny *= inv; nz *= inv;
        const o = (y * size + x) * 4;
        nd[o] = (nx * 0.5 + 0.5) * 255;
        nd[o + 1] = (ny * 0.5 + 0.5) * 255;
        nd[o + 2] = (nz * 0.5 + 0.5) * 255;
        nd[o + 3] = 255;
      }
    }
    const nCv = document.createElement('canvas');
    nCv.width = nCv.height = size;
    nCv.getContext('2d').putImageData(nData, 0, 0);
    norTex.image = nCv;
    norTex.encoding = THREE.LinearEncoding;
    norTex.wrapS = norTex.wrapT = THREE.RepeatWrapping;
    norTex.needsUpdate = true;

    const rCv = document.createElement('canvas');
    rCv.width = rCv.height = size;
    const rg = rCv.getContext('2d');
    const rData = rg.createImageData(size, size);
    const rd = rData.data;
    const rMin = minRough != null ? minRough : 0.14;
    const rMax = maxRough != null ? maxRough : 0.86;
    for (let i = 0; i < lum.length; i++) {
      const val = Math.round((rMax - lum[i] * (rMax - rMin)) * 255);
      const o = i * 4;
      rd[o] = rd[o + 1] = rd[o + 2] = val;
      rd[o + 3] = 255;
    }
    rg.putImageData(rData, 0, 0);
    roughTex.image = rCv;
    roughTex.encoding = THREE.LinearEncoding;
    roughTex.wrapS = roughTex.wrapT = THREE.RepeatWrapping;
    roughTex.needsUpdate = true;
  }

  function makeFallbackCanvas(colorHex) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 8;
    const g = cv.getContext('2d');
    g.fillStyle = colorHex || '#d8c8a8';
    g.fillRect(0, 0, 8, 8);
    return cv;
  }

  /* Returns cached { map, normalMap, roughnessMap } backed by studio food photography */
  function foodMaps(file, opts) {
    opts = opts || {};
    const key = file + '|' + (opts.bump || 2.8);
    if (PHOTO_CACHE[key]) return PHOTO_CACHE[key];

    const norTex = new THREE.CanvasTexture(makeFallbackCanvas('#8080ff'));
    norTex.encoding = THREE.LinearEncoding;
    const roughTex = new THREE.CanvasTexture(makeFallbackCanvas('#999999'));
    roughTex.encoding = THREE.LinearEncoding;

    const mapTex = TEX_LOADER.load('/assets/food/' + file, function (loaded) {
      try {
        bakeDerivedMaps(loaded.image, norTex, roughTex, opts.bump || 2.8, opts.minRough, opts.maxRough);
      } catch (e) {
        console.warn('PBR derive err', file, e);
      }
    });
    mapTex.encoding = THREE.sRGBEncoding;
    mapTex.wrapS = mapTex.wrapT = THREE.RepeatWrapping;
    mapTex.anisotropy = 8;

    const bundle = { map: mapTex, normalMap: norTex, roughnessMap: roughTex };
    PHOTO_CACHE[key] = bundle;
    return bundle;
  }

  /* Catalog of food photography file + PBR tuning per ingredient/surface id */
  const FOOD_SPEC = {
    crust:          { f:'crust.jpg',      c:0xffffff, r:0.86, cc:0.06, ccr:0.75, n:1.05, b:3.2, minR:0.55, maxR:0.95 },
    pizza_sauce:    { f:'marinara.jpg',   c:0xffffff, r:0.16, cc:0.88, ccr:0.12, n:0.75, b:2.2, minR:0.08, maxR:0.35 },
    marinara:       { f:'marinara.jpg',   c:0xffffff, r:0.16, cc:0.88, ccr:0.12, n:0.75, b:2.2, minR:0.08, maxR:0.35 },
    bbq_sauce:      { f:'marinara.jpg',   c:0x5e2510, r:0.15, cc:0.92, ccr:0.10, n:0.60, b:1.8, minR:0.06, maxR:0.30 },
    bbq_driz:       { f:'marinara.jpg',   c:0x521e0c, r:0.14, cc:0.92, ccr:0.10, n:0.50 },
    alfredo:        { f:'alfredo.jpg',    c:0xffffff, r:0.20, cc:0.76, ccr:0.18, n:0.65, b:2.0, minR:0.10, maxR:0.42 },
    buffalo_ranch:  { f:'alfredo.jpg',    c:0xe86424, r:0.18, cc:0.82, ccr:0.15, n:0.65, minR:0.10, maxR:0.40 },
    buffalo_driz:   { f:'alfredo.jpg',    c:0xdf5618, r:0.16, cc:0.86, ccr:0.14, n:0.50 },
    greengo:        { f:'alfredo.jpg',    c:0x76aa34, r:0.20, cc:0.78, ccr:0.18, n:0.65 },
    olive_oil:      { f:'alfredo.jpg',    c:0xd8c23c, r:0.10, cc:0.95, ccr:0.06, n:0.40, op:0.62 },
    milk:           { f:'alfredo.jpg',    c:0xfbf9f4, r:0.12, cc:0.85, ccr:0.10, n:0.25 },
    ranch:          { f:'alfredo.jpg',    c:0xf8f3e4, r:0.18, cc:0.78, ccr:0.16, n:0.45 },
    ranch_driz:     { f:'alfredo.jpg',    c:0xf6f0de, r:0.16, cc:0.80, ccr:0.14, n:0.40 },
    caesar:         { f:'alfredo.jpg',    c:0xf0e4c0, r:0.18, cc:0.76, ccr:0.16, n:0.50 },
    italian_dress:  { f:'alfredo.jpg',    c:0xd6b458, r:0.14, cc:0.85, ccr:0.12, n:0.45 },
    balsamic:       { f:'marinara.jpg',   c:0x4a1d10, r:0.12, cc:0.92, ccr:0.08, n:0.45 },
    walnut_rasp:    { f:'marinara.jpg',   c:0x922448, r:0.14, cc:0.88, ccr:0.12, n:0.45 },
    guest_dress:    { f:'alfredo.jpg',    c:0xe4d6b8, r:0.18, cc:0.76, ccr:0.16, n:0.45 },

    mozzarella:     { f:'mozzarella.jpg', c:0xffffff, r:0.44, cc:0.32, ccr:0.35, n:0.95, b:3.0, minR:0.22, maxR:0.72 },
    smoked_mozz:    { f:'cheddar.jpg',    c:0xe8bc80, r:0.44, cc:0.32, ccr:0.35, n:0.95, b:2.8, minR:0.22, maxR:0.72 },
    cheddar:        { f:'cheddar.jpg',    c:0xffffff, r:0.45, cc:0.30, ccr:0.38, n:0.95, b:2.8, minR:0.22, maxR:0.72 },
    gouda:          { f:'cheddar.jpg',    c:0xf4d272, r:0.42, cc:0.34, ccr:0.34, n:0.95, b:2.8 },
    feta:           { f:'mozzarella.jpg', c:0xf8f6f0, r:0.65, cc:0.12, ccr:0.55, n:0.90, b:3.0 },
    romano:         { f:'mozzarella.jpg', c:0xf2ead2, r:0.68, cc:0.10, ccr:0.58, n:0.85, b:2.8 },
    parmesan:       { f:'mozzarella.jpg', c:0xf6efd8, r:0.68, cc:0.10, ccr:0.58, n:0.85, b:2.8 },
    goat:           { f:'bread.jpg',      c:0xfaf2de, r:0.62, cc:0.15, ccr:0.50, n:0.95, b:3.0 },

    pepperoni:      { f:'pepperoni.jpg',  c:0xffffff, r:0.34, cc:0.52, ccr:0.22, n:1.05, b:3.2, minR:0.12, maxR:0.62 },
    canad_bacon:    { f:'ham.jpg',        c:0xffffff, r:0.42, cc:0.36, ccr:0.28, n:0.85, b:2.6, minR:0.18, maxR:0.68 },
    ham:            { f:'ham.jpg',        c:0xffffff, r:0.42, cc:0.36, ccr:0.28, n:0.85, b:2.6 },
    salami_kit:     { f:'ham.jpg',        c:0xd87a7a, r:0.38, cc:0.42, ccr:0.25, n:0.90 },
    bacon:          { f:'bacon.jpg',      c:0xffffff, r:0.36, cc:0.48, ccr:0.24, n:1.10, b:3.2, minR:0.14, maxR:0.64 },
    sausage:        { f:'sausage.jpg',    c:0xffffff, r:0.46, cc:0.35, ccr:0.30, n:1.15, b:3.4, minR:0.20, maxR:0.78 },
    taco_meat:      { f:'sausage.jpg',    c:0xc47e62, r:0.48, cc:0.32, ccr:0.34, n:1.15, b:3.4 },
    bigdons_mix:    { f:'sausage.jpg',    c:0xd88e74, r:0.46, cc:0.34, ccr:0.30, n:1.15, b:3.2 },
    meatballs:      { f:'meatballs.jpg',  c:0xffffff, r:0.42, cc:0.42, ccr:0.26, n:1.10, b:3.4, minR:0.16, maxR:0.74 },
    chicken:        { f:'chicken.jpg',    c:0xffffff, r:0.48, cc:0.28, ccr:0.35, n:1.05, b:3.2, minR:0.22, maxR:0.76 },
    blackened:      { f:'chicken.jpg',    c:0x82543e, r:0.52, cc:0.24, ccr:0.38, n:1.10, b:3.4 },

    spinach:        { f:'greens.jpg',     c:0xc2e6ae, r:0.56, cc:0.22, ccr:0.40, n:0.85, b:2.6, ds:true },
    basil:          { f:'greens.jpg',     c:0xd8f4be, r:0.52, cc:0.26, ccr:0.36, n:0.85, b:2.6, ds:true },
    cilantro:       { f:'greens.jpg',     c:0xe4fac8, r:0.54, cc:0.24, ccr:0.38, n:0.80, ds:true },
    parsley:        { f:'greens.jpg',     c:0xd4f0b6, r:0.56, cc:0.22, ccr:0.40, n:0.80, ds:true },
    chives:         { f:'greens.jpg',     c:0xcce8a8, r:0.56, cc:0.22, ccr:0.40, n:0.80, ds:true },
    mixed_greens:   { f:'greens.jpg',     c:0xd4f2ba, r:0.54, cc:0.24, ccr:0.38, n:0.85, ds:true },
    romaine:        { f:'greens.jpg',     c:0xe8fcc8, r:0.50, cc:0.28, ccr:0.34, n:0.85, ds:true },
    shred_lettuce:  { f:'greens.jpg',     c:0xf4ffda, r:0.48, cc:0.30, ccr:0.32, n:0.80, ds:true },
    lettuce:        { f:'greens.jpg',     c:0xf4ffda, r:0.48, cc:0.30, ccr:0.32, n:0.80, ds:true },

    tomatoes:       { f:'tomatoes.jpg',   c:0xffffff, r:0.26, cc:0.64, ccr:0.18, n:0.95, b:2.8, minR:0.10, maxR:0.55 },
    roma:           { f:'tomatoes.jpg',   c:0xffffff, r:0.26, cc:0.64, ccr:0.18, n:0.95, b:2.8 },
    sundried:       { f:'tomatoes.jpg',   c:0x9e2c1e, r:0.44, cc:0.36, ccr:0.32, n:1.05, b:3.2 },
    black_olives:   { f:'olives.jpg',     c:0x4a4a50, r:0.24, cc:0.66, ccr:0.18, n:0.90, b:2.8, minR:0.08, maxR:0.48 },
    kalamata:       { f:'olives.jpg',     c:0xffffff, r:0.24, cc:0.66, ccr:0.18, n:0.90, b:2.8 },
    green_olives:   { f:'olives.jpg',     c:0xb2c85c, r:0.26, cc:0.62, ccr:0.20, n:0.90 },
    mushrooms:      { f:'mushrooms.jpg',  c:0xffffff, r:0.68, cc:0.08, ccr:0.60, n:0.95, b:2.8, minR:0.45, maxR:0.90 },
    pineapple:      { f:'pineapple.jpg',  c:0xffffff, r:0.34, cc:0.48, ccr:0.24, n:0.95, b:2.6, minR:0.14, maxR:0.60 },
    pineapple_salsa:{ f:'pineapple.jpg',  c:0xf8ca58, r:0.30, cc:0.54, ccr:0.22, n:0.90 },
    potatoes:       { f:'pineapple.jpg',  c:0xeedca0, r:0.64, cc:0.12, ccr:0.55, n:0.95, b:2.8 },
    jalapenos:      { f:'peppers.jpg',    c:0x78c448, r:0.28, cc:0.56, ccr:0.20, n:0.85, b:2.6 },
    bell_peppers:   { f:'peppers.jpg',    c:0x66cc4a, r:0.28, cc:0.56, ccr:0.20, n:0.85, b:2.6 },
    cucumber:       { f:'peppers.jpg',    c:0xb8e688, r:0.26, cc:0.58, ccr:0.20, n:0.85 },
    red_onions:     { f:'red_onions.jpg', c:0xffffff, r:0.36, cc:0.42, ccr:0.28, n:0.90, b:2.6, ds:true },
    caram_onions:   { f:'red_onions.jpg', c:0x9e5e22, r:0.28, cc:0.56, ccr:0.22, n:0.90, ds:true },
    artichoke:      { f:'greens.jpg',     c:0xbcc480, r:0.52, cc:0.22, ccr:0.42, n:0.90 },

    penne:          { f:'pasta.jpg',      c:0xffffff, r:0.40, cc:0.38, ccr:0.28, n:0.90, b:2.8, minR:0.18, maxR:0.68 },
    fettuccine:     { f:'pasta.jpg',      c:0xffffff, r:0.38, cc:0.42, ccr:0.26, n:0.88, b:2.6 },
    spaghetti:      { f:'pasta.jpg',      c:0xffffff, r:0.38, cc:0.42, ccr:0.26, n:0.88, b:2.6 },
    garlic_bread:   { f:'bread.jpg',      c:0xffffff, r:0.62, cc:0.20, ccr:0.48, n:1.05, b:3.2, minR:0.30, maxR:0.88 },
    cheese_bread:   { f:'bread.jpg',      c:0xfae2a8, r:0.54, cc:0.30, ccr:0.38, n:1.05, b:3.2 },
    croutons:       { f:'bread.jpg',      c:0xf0d29c, r:0.72, cc:0.08, ccr:0.62, n:1.00, b:3.0 },
    breadcrumbs:    { f:'bread.jpg',      c:0xe4c68e, r:0.82, cc:0.04, ccr:0.70, n:0.95 },
    kettle_chips:   { f:'bread.jpg',      c:0xfad87c, r:0.46, cc:0.32, ccr:0.34, n:0.95, b:2.8 },
    garlic:         { f:'alfredo.jpg',    c:0xeee2be, r:0.52, cc:0.22, ccr:0.40, n:0.85 },
    cashews:        { f:'bread.jpg',      c:0xe6cc9c, r:0.54, cc:0.22, ccr:0.42, n:0.85 },
    walnuts:        { f:'meatballs.jpg',  c:0xb88c58, r:0.66, cc:0.12, ccr:0.55, n:1.05 },
    cranberries:    { f:'tomatoes.jpg',   c:0x90142a, r:0.28, cc:0.62, ccr:0.20, n:0.80 },
  };

  function foodPhysicalMat(id, extra) {
    const sp = FOOD_SPEC[id];
    if (!sp) {
      return new THREE.MeshPhysicalMaterial(Object.assign({ roughness: 0.55, metalness: 0.02, envMapIntensity: 0.85 }, extra || {}));
    }
    const maps = foodMaps(sp.f, { bump: sp.b, minRough: sp.minR, maxRough: sp.maxR });
    const params = Object.assign({
      color: sp.c,
      map: maps.map,
      normalMap: maps.normalMap,
      normalScale: new THREE.Vector2(sp.n, sp.n),
      roughnessMap: maps.roughnessMap,
      roughness: sp.r,
      metalness: 0.02,
      clearcoat: sp.cc,
      clearcoatRoughness: sp.ccr,
      reflectivity: 0.55,
      envMapIntensity: 1.05,
    }, extra || {});
    if (sp.ds) params.side = THREE.DoubleSide;
    if (sp.op != null && params.transparent === undefined) {
      params.transparent = true;
      params.opacity = sp.op;
    }
    return new THREE.MeshPhysicalMaterial(params);
  }

  /* Organic procedural geometries to replace flat boxes/blocks */
  function organicChunkGeo(rx, ry, rz, detail, seed) {
    const g = new THREE.IcosahedronGeometry(1, detail || 1);
    const pos = g.attributes.position;
    const s = seed || 1.7;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = 1 + 0.22 * Math.sin(x * 5.3 + s) * Math.cos(z * 4.7 - s) + 0.14 * Math.sin(y * 6.1 + x * 3.1);
      pos.setXYZ(i, x * rx * n, y * ry * n, z * rz * n);
    }
    g.computeVertexNormals();
    return g;
  }

  function curvedLeafGeo(w, h) {
    const g = new THREE.PlaneGeometry(w, h, 3, 4);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const nx = x / (w * 0.5), nz = z / (h * 0.5);
      // Taper tip/stem + subtle midrib V fold & gentle arch
      const pinch = Math.max(0.28, 1 - nz * nz * 0.65);
      const arch = (1 - nz * nz) * 0.014 + Math.abs(nx) * 0.008;
      pos.setX(i, x * pinch);
      pos.setY(i, arch);
    }
    g.computeVertexNormals();
    return g;
  }

  function crinkleStripGeo(len, thick, wid) {
    const g = new THREE.BoxGeometry(len, thick, wid, 6, 1, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setY(i, pos.getY(i) + Math.sin((x / len) * Math.PI * 3.2) * thick * 0.45);
    }
    g.computeVertexNormals();
    return g;
  }

  global.PT_PBR = {
    loadHDRI,
    applyPolyHavenSet,
    addUv2,
    foodMaps,
    foodPhysicalMat,
    FOOD_SPEC,
    organicChunkGeo,
    curvedLeafGeo,
    crinkleStripGeo,
  };
})(window);
