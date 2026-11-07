/*
 * Sofia 5D: an abstract glass body built from simple shapes, with glowing
 * organs. Dimensions 1 to 3 are space, the 4th is time (the slider moves
 * through her data), the 5th is food (a chosen food travels from the mouth
 * through the gut to the systems it is linked to by evidence).
 *
 * No 3D model is downloaded: every shape is generated here, so nothing comes
 * from another server and there is no third-party artwork to license.
 *
 * Motion is kept calm on purpose: organs breathe by a percent or two around
 * their own centre (they never move), the body turns slowly and stops while
 * something is selected, and every change eases in over about half a second.
 */
import * as THREE from "../../vendor/three.min.js";

const COLORI = { ok: 0x7be0a0, attenzione: 0xffc96b, male: 0xff7a6b, nd: 0x8f86a8 };
const PULSO = { ok: 0.5, attenzione: 0.8, male: 1.1, nd: 0.4 };
/* Frame-rate independent easing: the share of the way covered in dt seconds. */
const passo = (dt, velocita) => 1 - Math.exp(-dt * velocita);

/* Fresnel glow: bright at the rim, nearly clear in the middle. */
function vetro(colore, { alfa = 0.1, rim = 1.0, potenza = 2.2 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uColore: { value: new THREE.Color(colore) }, uAlfa: { value: alfa }, uRim: { value: rim }, uPot: { value: potenza }, uLuce: { value: 1 } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColore; uniform float uAlfa; uniform float uRim; uniform float uPot; uniform float uLuce; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - abs(dot(vN, vV)), uPot); float a = (uAlfa + f * uRim) * uLuce; gl_FragColor = vec4(uColore * (0.55 + f * 0.9) * uLuce, a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
  });
}

/* Flowing vessels: a light that travels along the tube. */
function flusso(colore) {
  return new THREE.ShaderMaterial({
    uniforms: { uColore: { value: new THREE.Color(colore) }, uT: { value: 0 }, uLuce: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uColore; uniform float uT; uniform float uLuce; varying vec2 vUv;
      void main(){ float d = fract(vUv.x * 6.0 - uT * 0.35); float g = smoothstep(0.0, 0.15, d) * (1.0 - smoothstep(0.15, 0.5, d)); gl_FragColor = vec4(uColore * (0.35 + g * 1.4) * uLuce, (0.18 + g * 0.7) * uLuce); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}

function capsula(r, l, mat) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 8, 20), mat);
}

function cervelloGeom() {
  const g = new THREE.IcosahedronGeometry(0.135, 6);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = v.clone().normalize();
    /* folds: a few crossing sine waves, a groove down the middle */
    let f = 0.005 * Math.sin(n.x * 18 + n.y * 7) + 0.004 * Math.sin(n.y * 21 - n.z * 11) + 0.003 * Math.sin(n.z * 26 + n.x * 5);
    f -= 0.022 * Math.exp(-Math.pow(n.x * 9, 2));
    v.add(n.multiplyScalar(f));
    v.set(v.x * 1.0, v.y * 0.82, v.z * 1.18);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function intestinoCurva() {
  const pts = [];
  pts.push(new THREE.Vector3(0.0, 1.06, 0.02));
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    const riga = Math.floor(t * 6);
    const u = (t * 6) % 1;
    const x = (riga % 2 ? 1 - u : u) * 0.2 - 0.1;
    const y = 1.02 - riga * 0.024 - 0.01 * Math.sin(u * Math.PI * 4);
    pts.push(new THREE.Vector3(x, y, 0.035 + 0.015 * Math.sin(t * 40)));
  }
  pts.push(new THREE.Vector3(0.0, 0.86, 0.02));
  return new THREE.CatmullRomCurve3(pts);
}

export async function creaCorpo(contenitore, { alTocco = () => {}, ridotto = false } = {}) {
  const canvas = document.createElement("canvas");
  contenitore.prepend(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) {
    canvas.remove();
    throw new Error("webgl");
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const posCorpo = new THREE.Vector3(0, 1.05, 5.4), posCervello = new THREE.Vector3(0, 1.7, 1.55);
  const mira = new THREE.Vector3(0, 1.0, 0), miraCervello = new THREE.Vector3(0, 1.7, 0);
  camera.position.copy(posCorpo);
  let obiettivoCam = posCorpo.clone(), obiettivoMira = mira.clone(), miraAtt = mira.clone();

  const corpo = new THREE.Group();
  scena.add(corpo);

  /* ------------------------------------------------------- the shell */
  const guscio = vetro(0x9d8cff, { alfa: 0.035, rim: 0.55, potenza: 2.6 });
  const parti = [];
  const aggiungi = (m, x, y, z, rz = 0, sx = 1, sy = 1, sz = 1) => { m.position.set(x, y, z); m.rotation.z = rz; m.scale.set(sx, sy, sz); corpo.add(m); parti.push(m); return m; };
  aggiungi(new THREE.Mesh(new THREE.SphereGeometry(0.2, 40, 32), guscio), 0, 1.69, 0, 0, 0.92, 1.12, 1.0);
  aggiungi(new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.16, 24), guscio), 0, 1.47, 0);
  const profilo = [[0.0, 0.84], [0.16, 0.85], [0.205, 0.9], [0.2, 0.98], [0.155, 1.08], [0.15, 1.14], [0.17, 1.24], [0.2, 1.33], [0.215, 1.38], [0.17, 1.42], [0.08, 1.45], [0.0, 1.46]].map(([r, y]) => new THREE.Vector2(r, y));
  const torso = aggiungi(new THREE.Mesh(new THREE.LatheGeometry(profilo, 48), guscio), 0, 0, 0, 0, 1, 1, 0.62);
  void torso;
  for (const s of [-1, 1]) {
    aggiungi(capsula(0.052, 0.26, guscio), s * 0.255, 1.25, 0, s * 0.16);
    aggiungi(capsula(0.042, 0.25, guscio), s * 0.3, 0.96, 0.02, s * 0.06);
    aggiungi(new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), guscio), s * 0.315, 0.78, 0.03, 0, 0.8, 1.2, 0.5);
    aggiungi(capsula(0.08, 0.36, guscio), s * 0.1, 0.6, 0, s * 0.02);
    aggiungi(capsula(0.06, 0.36, guscio), s * 0.11, 0.17, 0, 0);
    aggiungi(new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), guscio), s * 0.115, -0.07, 0.04, 0, 0.9, 0.5, 1.6);
  }

  /* -------------------------------------------------------- organs */
  const organi = {};
  /* Each organ group sits at its own centre, so breathing and emphasis scale
     it in place instead of moving it across the body. */
  const nuovo = (id, oggetti, centro) => {
    const g = new THREE.Group();
    g.position.copy(centro);
    oggetti.forEach((o) => { o.position.sub(centro); g.add(o); });
    g.userData = { id, stato: "nd", fase: Math.random() * 6 };
    corpo.add(g);
    organi[id] = { gruppo: g, centro: centro.clone(), mats: oggetti.map((o) => o.material), colore: new THREE.Color(COLORI.nd), target: new THREE.Color(COLORI.nd), evidenza: 0 };
    return g;
  };
  const sfera = (r, mat, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); return m; };

  const mCerv = vetro(COLORI.nd, { alfa: 0.12, rim: 0.85, potenza: 2.0 });
  const cerv = new THREE.Mesh(cervelloGeom(), mCerv); cerv.position.set(0, 1.715, 0.0);
  nuovo("brain", [cerv], new THREE.Vector3(0, 1.72, 0));

  const mCuore = vetro(COLORI.nd, { alfa: 0.3, rim: 1.2, potenza: 1.4 });
  nuovo("heart_vessels", [sfera(0.06, mCuore, 0.035, 1.28, 0.04, 1, 1.25, 0.95)], new THREE.Vector3(0.035, 1.28, 0.04));

  const mFeg = vetro(COLORI.nd, { alfa: 0.22, rim: 1.0, potenza: 1.6 });
  nuovo("liver", [sfera(0.1, mFeg, -0.07, 1.13, 0.03, 1.3, 0.6, 0.8)], new THREE.Vector3(-0.07, 1.13, 0.03));

  const mReni = vetro(COLORI.nd, { alfa: 0.3, rim: 1.2, potenza: 1.4 });
  nuovo("kidneys", [sfera(0.04, mReni, -0.085, 1.05, -0.05, 0.85, 1.5, 0.8), sfera(0.04, mReni, 0.085, 1.05, -0.05, 0.85, 1.5, 0.8)], new THREE.Vector3(0, 1.05, -0.05));

  const mInt = vetro(COLORI.nd, { alfa: 0.25, rim: 1.0, potenza: 1.5 });
  const curvaInt = intestinoCurva();
  nuovo("gut", [new THREE.Mesh(new THREE.TubeGeometry(curvaInt, 260, 0.014, 8, false), mInt)], new THREE.Vector3(0, 0.95, 0.03));

  const mOssa = vetro(COLORI.nd, { alfa: 0.25, rim: 0.9, potenza: 1.5 });
  const vertebre = [];
  for (let i = 0; i < 18; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.022, 0.025), mOssa); b.position.set(0, 0.88 + i * 0.032, -0.07 + 0.012 * Math.sin(i / 3)); vertebre.push(b); }
  const bacino = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 40), mOssa); bacino.position.set(0, 0.86, -0.01); bacino.rotation.x = Math.PI / 2.4;
  nuovo("bones", [...vertebre, bacino], new THREE.Vector3(0, 1.1, -0.07));

  const mArt = vetro(COLORI.nd, { alfa: 0.35, rim: 1.2, potenza: 1.3 });
  const giunti = [];
  for (const s of [-1, 1]) for (const [x, y] of [[0.215, 1.39], [0.29, 1.1], [0.31, 0.82], [0.1, 0.8], [0.11, 0.38], [0.115, -0.03]]) giunti.push(sfera(0.022, mArt, s * x, y, 0.01));
  nuovo("joints", giunti, new THREE.Vector3(0.29, 1.1, 0.01));

  const mImm = vetro(COLORI.nd, { alfa: 0.35, rim: 1.2, potenza: 1.3 });
  const linfo = [sfera(0.05, mImm, 0.08, 1.12, -0.02, 1.2, 0.7, 0.8)];
  for (const [x, y] of [[0.05, 1.47], [-0.05, 1.47], [0.16, 1.33], [-0.16, 1.33], [0.08, 0.84], [-0.08, 0.84]]) linfo.push(sfera(0.017, mImm, x, y, 0.03));
  nuovo("immune", linfo, new THREE.Vector3(0.08, 1.12, -0.02));

  const mSang = flusso(COLORI.nd);
  const vasi = [
    [[0.035, 1.3, 0.04], [0.02, 1.38, 0.0], [0.0, 1.47, 0.0], [0.0, 1.62, 0.03]],
    [[0.035, 1.26, 0.03], [0.0, 1.1, -0.04], [0.0, 0.9, -0.03], [0.09, 0.7, 0.0], [0.11, 0.3, 0.0], [0.115, 0.0, 0.02]],
    [[0.0, 0.9, -0.03], [-0.09, 0.7, 0.0], [-0.11, 0.3, 0.0], [-0.115, 0.0, 0.02]],
    [[0.035, 1.32, 0.03], [0.17, 1.36, 0.0], [0.28, 1.15, 0.01], [0.31, 0.85, 0.03]],
    [[0.035, 1.32, 0.03], [-0.17, 1.36, 0.0], [-0.28, 1.15, 0.01], [-0.31, 0.85, 0.03]],
  ].map((c) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(c.map((p) => new THREE.Vector3(...p))), 80, 0.008, 6, false), mSang));
  nuovo("blood", vasi, new THREE.Vector3(0.0, 1.0, -0.03));

  const mMusc = vetro(COLORI.nd, { alfa: 0.015, rim: 0.28, potenza: 2.6 });
  const muscoli = [];
  for (const s of [-1, 1]) { const a = capsula(0.06, 0.3, mMusc); a.position.set(s * 0.1, 0.6, 0); muscoli.push(a); const b = capsula(0.043, 0.2, mMusc); b.position.set(s * 0.255, 1.25, 0); b.rotation.z = s * 0.16; muscoli.push(b); }
  nuovo("muscle", muscoli, new THREE.Vector3(0.1, 0.6, 0));

  /* metabolism: a slow cloud of light around the middle */
  const nPunti = 220, geoP = new THREE.BufferGeometry(), posP = new Float32Array(nPunti * 3), base = [];
  for (let i = 0; i < nPunti; i++) {
    const a = Math.random() * Math.PI * 2, r = 0.26 + Math.random() * 0.2, y = 0.75 + Math.random() * 0.6;
    base.push([a, r, y, 0.2 + Math.random() * 0.6]);
    posP[i * 3] = Math.cos(a) * r; posP[i * 3 + 1] = y; posP[i * 3 + 2] = Math.sin(a) * r * 0.6;
  }
  geoP.setAttribute("position", new THREE.BufferAttribute(posP, 3));
  const mMet = new THREE.PointsMaterial({ color: COLORI.nd, size: 0.018, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
  const nuvola = new THREE.Points(geoP, mMet);
  nuovo("metabolism", [nuvola], new THREE.Vector3(0.24, 1.0, 0));

  /* skin: the shell itself */
  organi.skin = { gruppo: null, centro: new THREE.Vector3(-0.2, 1.3, 0.06), mats: [guscio], colore: new THREE.Color(0x9d8cff), target: new THREE.Color(0x9d8cff), evidenza: 0, guscio: true };

  /* ------------------------------------------------ food journey */
  /* A small stream of light follows the food step by step: mouth to
     stomach, along the gut, into the blood, then to each system it feeds.
     Each step is slow enough to follow and comes with its caption. */
  const nCibo = 90, geoC = new THREE.BufferGeometry(), posC = new Float32Array(nCibo * 3);
  geoC.setAttribute("position", new THREE.BufferAttribute(posC, 3));
  const mCibo = new THREE.PointsMaterial({ color: 0xfff1c9, size: 0.028, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const puntiCibo = new THREE.Points(geoC, mCibo);
  corpo.add(puntiCibo);
  let tCibo = -1, viaggioAtt = null;
  const bocca = new THREE.Vector3(0, 1.6, 0.17), stomaco = new THREE.Vector3(0.03, 1.08, 0.05), fegato = new THREE.Vector3(-0.07, 1.13, 0.03), cuore = new THREE.Vector3(0.035, 1.28, 0.04);
  const curva = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))));

  /* ---------------------------------------------------- interaction */
  let rotY = 0.35, rotX = 0, autoRot = !ridotto, trasc = null, pinza = null, selezionato = null, tSel = 0;
  const etichetta = document.createElement("div");
  etichetta.className = "etichetta-organo";
  etichetta.hidden = true;
  contenitore.appendChild(etichetta);
  const puntatori = new Map();
  canvas.addEventListener("pointerdown", (e) => { canvas.setPointerCapture(e.pointerId); puntatori.set(e.pointerId, { x: e.clientX, y: e.clientY }); trasc = { x: e.clientX, y: e.clientY, t: performance.now(), mosso: false }; autoRot = false; });
  canvas.addEventListener("pointermove", (e) => {
    if (!puntatori.has(e.pointerId)) return;
    const prec = puntatori.get(e.pointerId);
    puntatori.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (puntatori.size === 2) {
      const [a, b] = [...puntatori.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinza) obiettivoCam.z = THREE.MathUtils.clamp(obiettivoCam.z * (pinza / d), 1.2, 7);
      pinza = d;
      return;
    }
    rotY += (e.clientX - prec.x) * 0.008;
    rotX = THREE.MathUtils.clamp(rotX + (e.clientY - prec.y) * 0.004, -0.35, 0.35);
    if (trasc && Math.hypot(e.clientX - trasc.x, e.clientY - trasc.y) > 6) trasc.mosso = true;
  });
  const fine = (e) => {
    puntatori.delete(e.pointerId);
    if (puntatori.size < 2) pinza = null;
    if (trasc && !trasc.mosso && performance.now() - trasc.t < 400) tocca(e);
    trasc = null;
  };
  canvas.addEventListener("pointerup", fine);
  canvas.addEventListener("pointercancel", fine);
  canvas.addEventListener("wheel", (e) => { obiettivoCam.z = THREE.MathUtils.clamp(obiettivoCam.z + e.deltaY * 0.003, 1.2, 7); e.preventDefault(); }, { passive: false });

  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  function tocca(e) {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    ray.params.Points = { threshold: 0.03 };
    const oggetti = Object.values(organi).filter((o) => o.gruppo).flatMap((o) => o.gruppo.children);
    const hit = ray.intersectObjects(oggetti, false)[0];
    if (hit) { alTocco(hit.object.parent.userData.id); return; }
    /* Small or hidden organs: the nearest organ centre on screen within 44 px. */
    let vicino = null, dist = 44;
    for (const [id, o] of Object.entries(organi)) {
      if (id === "skin") continue;
      const p = schermo(o);
      const d = Math.hypot(p.x - (e.clientX - r.left), p.y - (e.clientY - r.top));
      if (d < dist) { dist = d; vicino = id; }
    }
    if (vicino) { alTocco(vicino); return; }
    if (ray.intersectObjects(parti, false)[0]) alTocco("skin");
  }
  function schermo(o) {
    const v = o.centro.clone();
    corpo.localToWorld(v);
    v.project(camera);
    const r = canvas.getBoundingClientRect();
    return { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height };
  }

  /* ------------------------------------------------------- sizing */
  function dimensiona() {
    const w = contenitore.clientWidth || 360, h = canvas.clientHeight || 480;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(dimensiona);
  ro.observe(contenitore);
  dimensiona();

  function avviaSegmento(v) {
    const sg = v.segmenti[v.i];
    if (sg.organo) { organi[sg.organo] && (organi[sg.organo].evidenza = 1.2); selezionato = sg.organo; etichetta.textContent = v.nomi[sg.organo] || ""; etichetta.hidden = !etichetta.textContent; }
    else { selezionato = null; etichetta.hidden = true; }
    v.onFase(v.i, sg.organo);
  }

  /* --------------------------------------------------------- loop */
  let attivo = true, visibile = true, ultimo = performance.now(), tempo = 0;
  const io = new IntersectionObserver((v) => { visibile = v[0].isIntersecting; });
  io.observe(canvas);
  const nascosto = () => { visibile = !document.hidden; };
  document.addEventListener("visibilitychange", nascosto);

  function loop(ora) {
    if (!attivo) return;
    requestAnimationFrame(loop);
    if (!visibile) { ultimo = ora; return; }
    const dt = Math.min(0.05, (ora - ultimo) / 1000);
    ultimo = ora;
    tempo += dt;
    if (autoRot && !selezionato && tCibo < 0) rotY += dt * 0.12;
    const k = passo(dt, 5), kc = passo(dt, 3);
    corpo.rotation.y += (rotY - corpo.rotation.y) * k;
    corpo.rotation.x += (rotX - corpo.rotation.x) * k;
    camera.position.lerp(obiettivoCam, kc);
    miraAtt.lerp(obiettivoMira, kc);
    camera.lookAt(miraAtt);
    for (const [id, o] of Object.entries(organi)) {
      o.colore.lerp(o.target, passo(dt, 3));
      const stato = o.gruppo ? o.gruppo.userData.stato : o.stato || "nd";
      const ritmo = ridotto ? 0 : PULSO[stato] || 0.5;
      const battito = id === "heart_vessels" ? 1 + 0.025 * Math.max(0, Math.sin(tempo * 6.0)) * (ridotto ? 0 : 1) : 1 + 0.012 * Math.sin(tempo * ritmo * 2 + (o.gruppo ? o.gruppo.userData.fase : 0));
      const scelto = selezionato === id ? 1 : 0;
      const enfasi = 1 + Math.min(o.evidenza + scelto, 1) * 0.05;
      o.evidenza = Math.max(0, o.evidenza - dt * 0.35);
      if (o.gruppo && id !== "metabolism") o.gruppo.scale.setScalar(battito * enfasi);
      for (const m of o.mats) {
        const luce = 1 + Math.min(o.evidenza + scelto * 0.8, 1.6) * 1.2 - (selezionato && !scelto && id !== "skin" ? 0.25 : 0);
        if (m.uniforms && m.uniforms.uColore) { m.uniforms.uColore.value.copy(o.colore); m.uniforms.uLuce.value += (luce - m.uniforms.uLuce.value) * passo(dt, 6); if (m.uniforms.uT) m.uniforms.uT.value = tempo * (ridotto ? 0 : 1); }
        else if (m.color) { m.color.copy(o.colore); m.opacity = 0.55 + 0.12 * Math.sin(tempo * 0.8) + o.evidenza * 0.3; }
      }
    }
    /* metabolism cloud breathes */
    if (!ridotto) {
      for (let i = 0; i < nPunti; i++) {
        const [a0, r, y0, v] = base[i];
        const a = a0 + tempo * v * 0.12;
        posP[i * 3] = Math.cos(a) * r; posP[i * 3 + 1] = y0 + 0.006 * Math.sin(tempo * 0.7 + i); posP[i * 3 + 2] = Math.sin(a) * r * 0.6;
      }
      geoP.attributes.position.needsUpdate = true;
    }
    /* food journey */
    if (viaggioAtt) {
      const v = viaggioAtt;
      const seg = v.segmenti[v.i];
      v.t += dt;
      const k = Math.min(1, v.t / seg.durata);
      for (let i = 0; i < nCibo; i++) {
        const kk = Math.min(1, Math.max(0, k * 1.35 - (i / nCibo) * 0.35));
        const p = seg.curva.getPoint(kk);
        posC[i * 3] = p.x + Math.sin(i * 12.9) * 0.006; posC[i * 3 + 1] = p.y + Math.cos(i * 3.1) * 0.004; posC[i * 3 + 2] = p.z + Math.cos(i * 7.3) * 0.006;
      }
      geoC.attributes.position.needsUpdate = true;
      mCibo.opacity += ((k < 0.08 ? k * 10 : 0.85) - mCibo.opacity) * passo(dt, 8);
      if (v.t >= seg.durata + seg.pausa) {
        v.i++;
        if (v.i >= v.segmenti.length) { viaggioAtt = null; tCibo = -1; mCibo.opacity = 0; v.onFase(-1, null); }
        else { v.t = 0; avviaSegmento(v); }
      }
    } else if (mCibo.opacity > 0) mCibo.opacity = Math.max(0, mCibo.opacity - dt * 2);
    /* the label follows the selected organ while the body turns */
    if (selezionato && organi[selezionato]) {
      const p = schermo(organi[selezionato]);
      etichetta.style.left = p.x + "px";
      etichetta.style.top = p.y + "px";
    }
    renderer.render(scena, camera);
  }
  requestAnimationFrame(loop);

  /* ------------------------------------------------------------ API */
  return {
    aggiorna(stati) {
      for (const [id, s] of Object.entries(stati)) {
        const o = organi[id];
        if (!o) continue;
        const st = s.stato || "nd";
        if (o.gruppo) o.gruppo.userData.stato = st;
        else o.stato = st;
        o.target.set(o.guscio && st === "nd" ? 0x9d8cff : COLORI[st]);
      }
    },
    evidenzia(ids) {
      for (const id of ids) if (organi[id]) organi[id].evidenza = 1.2;
    },
    seleziona(id, testo) {
      selezionato = organi[id] ? id : null;
      etichetta.textContent = testo || "";
      etichetta.hidden = !selezionato || !testo;
      if (selezionato) tSel = 0;
    },
    deseleziona() { selezionato = null; etichetta.hidden = true; },
    /* steps: mouth, stomach, gut, blood, then each target organ; onFase(i, organ) on each step, onFase(-1) at the end */
    viaggio(bersagli, onFase = () => {}, nomi = {}) {
      const mete = bersagli.filter((id) => organi[id] && id !== "gut" && id !== "blood");
      const segmenti = [
        { fase: 0, organo: null, durata: 2.2, pausa: 0.6, curva: curva([bocca, [0.0, 1.45, 0.08], [0.02, 1.25, 0.06], stomaco]) },
        { fase: 1, organo: "gut", durata: 3.2, pausa: 0.6, curva: curva([stomaco, ...curvaInt.getPoints(24)]) },
        { fase: 2, organo: "blood", durata: 2.2, pausa: 0.6, curva: curva([[0.0, 0.88, 0.02], [-0.02, 0.98, 0.0], fegato, cuore]) },
        ...mete.map((id) => ({ fase: 3, organo: id, durata: 1.8, pausa: 1.6, curva: curva([cuore, cuore.clone().lerp(organi[id].centro, 0.5).add(new THREE.Vector3(0, 0.03, 0.05)), organi[id].centro]) })),
      ];
      viaggioAtt = { segmenti, i: 0, t: 0, onFase, nomi };
      tCibo = 0;
      if (ridotto) {
        /* no moving lights: the steps advance on a timer and each target simply lights up */
        viaggioAtt = null;
        segmenti.forEach((sg, i) => setTimeout(() => { if (sg.organo) { this.evidenzia([sg.organo]); this.seleziona(sg.organo, nomi[sg.organo]); } onFase(i, sg.organo); if (i === segmenti.length - 1) setTimeout(() => onFase(-1, null), 2500); }, i * 2500));
        return;
      }
      avviaSegmento(viaggioAtt);
    },
    fermaViaggio() { viaggioAtt = null; tCibo = -1; },
    vista(v) {
      if (v === "cervello") { obiettivoCam = posCervello.clone(); obiettivoMira = miraCervello.clone(); }
      else { obiettivoCam = posCorpo.clone(); obiettivoMira = mira.clone(); }
    },
    mostraCibo(bersagli) { this.viaggio(bersagli); },
    posizioneSchermo(id) {
      const o = organi[id];
      if (!o) return null;
      const v = o.centro.clone();
      corpo.localToWorld(v);
      v.project(camera);
      const r = canvas.getBoundingClientRect();
      return { x: ((v.x + 1) / 2) * r.width, y: ((1 - v.y) / 2) * r.height };
    },
    distruggi() {
      attivo = false;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", nascosto);
      etichetta.remove();
      scena.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose();
      canvas.remove();
    },
  };
}
