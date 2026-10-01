// 遊戲狀態、存檔、畫布與背景（state.js）
// ====== 狀態 ======
let state;
function newState() {
  return {
    coins: 100, capLv: 0, feederLv: 0, snailLv: 0, netLv: 0, nurseryLv: 0, pumpLv: 0, lampLv: 0, food: 'basic',
    bg: 'fresh', ownedBg: ['fresh'], scene: newScene(),
    breedT: {}, fish: [], treasures: [], nextId: 1, earned: 0, maxTier: 0,
    dex: { seen: {}, shiny: {}, claimed: [] }, ach: {}, stats: { born: 0, released: 0, visitors: 0 },
    daily: { date: '', gift: false, streak: 0, last: '', tasks: [] },
    stars: 0, starEarned: 0, starOwned: [], starShown: [],
  };
}
let pellets = [], particles = [], texts = [], bubbles = [], starFish = [], releasing = [], coinFx = [];
let tab = 'shop', storeTab = 'shop', collectTab = 'dex', selFishId = null, B = {};
let snails = [{ x: 500, dir: 1 }, { x: 900, dir: -1 }], feederT = 0, T = 0;
const capacity = () => CAP_BASE + CAP_STEP * state.capLv;
// 魚店顯示到哪一種：曾經擁有過的最高級魚往後 3 種
const shopLimit = () => Math.min(SPECIES.length - 1, Math.max(state.maxTier || 0, ...state.fish.map(f => SP[f.sp].tier)) + 3);

function spawnFish(sp, x, y, growth, hunger = 70) {
  const f = {
    id: state.nextId++, sp, name: pick(NAMES), x, y, vx: 0, vy: 0, tx: x, ty: y,
    hunger, growth, foodMult: 1, dropT: SP[sp].dropEvery * rand(0.5, 1), face: Math.random() < .5 ? 1 : -1,
    phase: rand(0, 6.28), wanderT: 0,
  };
  state.fish.push(f);
  return f;
}

function calcBonus() {
  const b = { value: BG[state.bg].bonus, drop: 0, hunger: 0, breed: 0, growth: 0, offline: 0 };
  // 造景的功能取最高等級（跟目前選的外觀無關）
  for (const p of SCENE) {
    const lv = state.scene[p.id].lv; if (!lv) continue;
    const amt = p.per[lv - 1];
    if (p.eff === 'all') for (const k in b) b[k] += amt; else b[p.eff] += amt;
  }
  B = { value: 1 + b.value, drop: 1 + b.drop, breed: (1 + b.breed) * (1 + LAMP_BOOST[state.lampLv || 0]), growth: 1 + b.growth, offline: 1 + b.offline, hunger: Math.max(0.3, 1 - b.hunger) * (1 - .1 * (state.pumpLv || 0)), raw: b };
  applyPotions(B); // 星星小舖的限時藥水
}

// ====== 存檔 ======
function save() {
  state.lastSeen = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { }
}
function load(fromCode) {
  state = newState();
  try {
    const raw = fromCode || localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      Object.assign(state, s);
      state.fish = (s.fish || []).filter(f => SP[f.sp]);
      state.treasures = (s.treasures || []).filter(t => TREASURE[t.type]);
      state.scene = newScene();
      for (const id in s.scene || {}) if (SCN[id]) { const lv = clamp(s.scene[id].lv | 0, 0, 5); state.scene[id] = { lv, look: clamp(s.scene[id].look | 0, 0, lv) }; }
      if (s.decorItems) migrateDecor(s.decorItems);
      delete state.decorItems; delete state.slots;
      state.starOwned = (state.starOwned || []).filter(id => SSP[id]);
      state.starShown = (state.starShown || []).filter(id => state.starOwned.includes(id)).slice(0, MAX_SHOWN);
      state.ownedBg = (state.ownedBg || ['fresh']).filter(id => BG[id]);
      // 圖鑑：把現在擁有的魚都記進去
      state.maxTier = Math.max(state.maxTier || 0, ...state.fish.map(f => SP[f.sp].tier));
      for (const f of state.fish) { state.dex.seen[f.sp] = 1; if (f.shiny && !state.dex.shiny[f.sp]) state.dex.shiny[f.sp] = f.shiny; }
      for (const id of state.starOwned) state.dex.seen[id] = 1;
      if (!BG[state.bg]) state.bg = 'fresh';
      if (!FD[state.food]) state.food = 'basic';
      // 超過容量上限的等級退還金幣（上限曾經從 100 改回 50，現在又開放到 100）
      for (; state.capLv > CAP_MAX_LV; state.capLv--) state.coins += nice(200 * Math.pow(3.2, 8) * Math.pow(2.5, state.capLv - 9));
      return;
    }
  } catch (e) { state = newState(); }
  // 新遊戲：送兩隻孔雀魚
  spawnFish('guppy', 400, 250, 1, 80);
  spawnFish('guppy', 600, 300, 1, 80);
  state.dex.seen.guppy = 1;
}

// 舊版「擺飾」轉成新版「造景」：同類效果的擺飾換成對應的造景（取最高等級），重複的依原本賣價退還
const OLD_DECOR = { plant: ['starfish', 100], mushroom: ['anemone', 200], moai: ['anemone', 800], coral: ['coral', 400], fountain: ['coral', 25000], anchor: ['ship', 1500],
  castle: ['castle', 3000], ship: ['clam', 6000], temple: ['clam', 12000], torii: ['arch', 50000], starcrystal: ['crystal', 0] };
let migrateNote = '';
function migrateDecor(items) {
  const best = {}, OLD_STAR = [15, 35, 75, 150, 300];
  let coins = 0, stars = 0;
  for (const it of items) { const m = OLD_DECOR[it.type]; if (!m) continue; const lv = clamp(it.lv | 0, 1, 5); if (!best[m[0]] || best[m[0]].lv < lv) best[m[0]] = { lv, it }; }
  for (const it of items) {
    const m = OLD_DECOR[it.type]; if (!m || (best[m[0]] && best[m[0]].it === it)) continue;
    const lv = clamp(it.lv | 0, 1, 5);
    if (m[0] === 'crystal') stars += Math.floor(OLD_STAR[lv - 1] / 2); else coins += Math.floor(m[1] * Math.pow(4, lv - 1) / 2);
  }
  const names = [];
  for (const id in best) { const lv = Math.max(state.scene[id].lv, best[id].lv); state.scene[id] = { lv, look: lv }; names.push(`${SCN[id].name} Lv.${lv}`); }
  state.coins += coins; state.stars += stars;
  if (names.length || coins || stars) migrateNote = `🪸 「擺飾」改版成「造景」了！
每個造景都有固定的位置，會跟背景融為一體。

你原本的擺飾已經換成：
${names.join('、') || '（無）'}${coins || stars ? `

重複的擺飾退還：${coins ? '💰' + fmt(coins) : ''}${stars ? ' ⭐' + stars : ''}` : ''}`;
}

// ====== 畫布 ======
const canvas = $('#tank'), ctx = canvas.getContext('2d');
let scale = 1, bgCanvas = document.createElement('canvas');
function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  W = Math.round(clamp(H * vw / vh, 720, 1600));
  // 螢幕比例超出範圍時（例如手機直拿），水族箱等比縮放置中
  let cw = vw, ch = vw * H / W;
  if (ch > vh) { ch = vh; cw = vh * W / H; }
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  // 畫布解析度最多約 230 萬像素：手機維持清晰，大螢幕電腦不會畫太多像素而變卡
  const dpr = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(2.3e6 / (cw * ch)));
  canvas.width = Math.max(1, Math.round(cw * dpr));
  canvas.height = Math.max(1, Math.round(ch * dpr));
  scale = canvas.width / W;
  if (state) {
    for (const f of [...state.fish, ...starFish]) { f.x = clamp(f.x, 30, W - 30); f.tx = clamp(f.tx, 40, W - 40); }
    for (const t of state.treasures) t.x = clamp(t.x, 20, W - 20);
    for (const sn of snails) sn.x = clamp(sn.x, 20, W - 20);
  }
  buildBg();
}
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// 每種背景的細節設定：遠景岩石色、海草兩種顏色、沙地光紋強度、海中微粒是否發光
const THEME = {
  fresh:  { rock: '#4b7f93', plant: ['#237a47', '#5cc47c'], caus: .13, snowGlow: false },
  reef:   { rock: '#5f8c99', plant: ['#e8577f', '#ffae6b'], caus: .14, snowGlow: false },
  sunset: { rock: '#5a3968', plant: ['#7a3f8e', '#d27aa6'], caus: .1,  snowGlow: false },
  deep:   { rock: '#1b293d', plant: ['#15485a', '#38d6c4'], caus: .03, snowGlow: true },
  jelly:  { rock: '#2a1d4a', plant: ['#33256e', '#6af0d0'], caus: .03, snowGlow: true },
  palace: { rock: '#6b1e2b', plant: ['#a52a28', '#e8a33e'], caus: .08, snowGlow: false },
  kelp:   { rock: '#2e5a4c', plant: ['#3c6e22', '#9ac44a'], caus: .12, snowGlow: false },
  sakura: { rock: '#8c5c7c', plant: ['#c0609a', '#ffb4d2'], caus: .12, snowGlow: false },
  arctic: { rock: '#9cc2d8', plant: ['#4f98b4', '#c4ecf6'], caus: .13, snowGlow: false },
  volcano:{ rock: '#3a1a16', plant: ['#5e2418', '#ff8a3a'], caus: .05, snowGlow: true },
  galaxy: { rock: '#2a1f57', plant: ['#43279a', '#b06aff'], caus: .03, snowGlow: true },
  bubblepink:  { rock: '#b87aa8', plant: ['#e070b0', '#8af0d8'], caus: .12, snowGlow: false },
  moonsea:     { rock: '#2a3468', plant: ['#2a4a8a', '#a8c8ff'], caus: .1,  snowGlow: true },
  lantern:     { rock: '#3a2046', plant: ['#5a2a5a', '#ffb060'], caus: .06, snowGlow: true },
  lotuspond:   { rock: '#4a8a88', plant: ['#2a8a5a', '#7ae0a0'], caus: .14, snowGlow: false },
  crystalhall: { rock: '#6a78c0', plant: ['#7a8ae0', '#c8f0ff'], caus: .13, snowGlow: false },
  heaven:      { rock: '#b8b0e8', plant: ['#f0a8d0', '#fff0a0'], caus: .14, snowGlow: false },
};
let PLANTS = [];
function buildBg() {
  sceneLight(); sceneT = -1;
  bgCanvas.width = canvas.width; bgCanvas.height = canvas.height;
  const c = bgCanvas.getContext('2d'); c.setTransform(scale, 0, 0, scale, 0, 0);
  drawBgStatic(c, BG[state.bg]);
  // 會擺動的海草（位置固定，每次畫面即時繪製）
  const r = mulberry(state.bg.length * 131 + 7); PLANTS = [];
  const kelp = state.bg === 'kelp', n = kelp ? 14 : 11;
  for (let i = 0; i < n; i++) PLANTS.push({ x: 20 + (i + r() * .8) * (W - 40) / n, h: kelp ? 200 + r() * 230 : 70 + r() * 140, w: kelp ? 14 + r() * 8 : 11 + r() * 8, ph: r() * 6, k: r() < .5 ? 0 : 1, bend: (r() - .5) * 30 });
}
// 低多邊形三角形填色
function lpTri(c, a, b, d, col) { c.fillStyle = col; c.strokeStyle = col; c.lineWidth = .7; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.lineTo(...d); c.closePath(); c.fill(); c.stroke(); }
// 起伏的低多邊形岩壁：越遠的層混入越多海水色，做出景深霧化
function lpRidge(c, r, y0, amp, step, col, fog, fogA) {
  const pts = [], base = hex(col), fg = hex(fog), bot = y0 + 40;
  for (let x = -60; x <= W + 60; x += step * (.7 + r() * .6)) pts.push([x, y0 - amp * (.25 + r() * .75)]);
  const shade = k => css(mixc(bright(base, k), fg, fogA));
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], m = [(a[0] + b[0]) / 2 + (r() - .5) * step * .3, Math.max(a[1], b[1]) + amp * (.15 + r() * .3)];
    const slope = (b[1] - a[1]) / (b[0] - a[0]);
    lpTri(c, a, b, m, shade(1.2 - slope * .4));
    lpTri(c, a, m, [a[0], bot], shade(.98));
    lpTri(c, m, b, [b[0], bot], shade(.82));
    lpTri(c, m, [a[0], bot], [b[0], bot], shade(.9));
  }
}
// 前景的多邊形大石頭，上方受光
function lpRock(c, r, cx, cy, rad, col) {
  const base = col, n = 8, pts = [];
  for (let i = 0; i < n; i++) { const a = Math.PI * 2 * i / n + (r() - .5) * .4; pts.push([cx + Math.cos(a) * rad * (.8 + r() * .35), cy + Math.sin(a) * rad * .7 * (.8 + r() * .35)]); }
  const ctr = [cx + (r() - .5) * rad * .3, cy - rad * .2];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % n], ang = Math.atan2((p[1] + q[1]) / 2 - cy, (p[0] + q[0]) / 2 - cx);
    lpTri(c, ctr, p, q, css(bright(base, .7 + .5 * Math.max(0, -Math.sin(ang)) + .15 * Math.max(0, Math.cos(ang + .8)))));
  });
}
function drawBgStatic(c, bg) {
  const r = mulberry(bg.id.length * 977 + bg.id.charCodeAt(0)), th = THEME[bg.id] || THEME.fresh;
  const midCol = css(mixc(hex(bg.top), hex(bg.bot), .45));
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, bg.top); g.addColorStop(.45, midCol); g.addColorStop(1, bg.bot);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // 水面透進來的光
  const sun = c.createRadialGradient(W * .5, -80, 20, W * .5, -80, 620); sun.addColorStop(0, 'rgba(255,255,255,0.28)'); sun.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = sun; c.fillRect(0, 0, W, H);
  c.lineCap = 'round';
  if (bg.id === 'sunset') {
    const sg = c.createRadialGradient(W * .7, 40, 10, W * .7, 40, 260); sg.addColorStop(0, 'rgba(255,240,180,0.7)'); sg.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = sg; c.fillRect(0, 0, W, H);
  } else if (bg.id === 'galaxy') {
    for (const [x, y, rr, col] of [[W * .25, 180, 260, '150,80,255'], [W * .72, 260, 300, '255,80,200'], [W * .5, 90, 200, '80,200,255']]) {
      const gg = c.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, `rgba(${col},0.28)`); gg.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gg; c.fillRect(0, 0, W, H);
    }
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255,255,255,${.2 + r() * .7})`; const rr = r() < .08 ? 2 : 1; c.fillRect(r() * W, r() * (FLOOR - 120), rr, rr); }
    c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 60; c.beginPath(); c.moveTo(-50, 380); c.quadraticCurveTo(W / 2, 100, W + 50, 260); c.stroke();
  }
  if (bg.id === 'arctic') {
    // 極光：幾條半透明的彩帶
    for (const [y0, col, a] of [[70, '120,255,200', .32], [110, '150,160,255', .24], [50, '200,140,255', .18]]) {
      c.fillStyle = `rgba(${col},${a})`; c.beginPath(); c.moveTo(0, y0);
      for (let x = 0; x <= W; x += W / 12) c.lineTo(x, y0 + Math.sin(x * .008 + y0) * 26);
      for (let x = W; x >= 0; x -= W / 12) c.lineTo(x, y0 + 38 + Math.sin(x * .011 + y0) * 18);
      c.closePath(); c.fill();
    }
    // 從水面倒掛下來的多邊形冰山
    for (let i = 0; i < 5; i++) {
      const x = W * (.08 + i * .21) + (r() - .5) * 60, w = 70 + r() * 90, h = 60 + r() * 110;
      lpTri(c, [x - w, 0], [x, 0], [x - w * .3, h], 'rgba(235,248,255,0.9)'); lpTri(c, [x, 0], [x + w * .8, 0], [x - w * .3, h], 'rgba(200,230,245,0.9)');
      lpTri(c, [x - w * .3, h], [x + w * .8, 0], [x + w * .2, h * .6], 'rgba(170,210,235,0.9)');
    }
  } else if (bg.id === 'sakura') {
    const sg = c.createRadialGradient(W * .3, 30, 10, W * .3, 30, 300); sg.addColorStop(0, 'rgba(255,245,250,0.7)'); sg.addColorStop(1, 'rgba(255,200,225,0)');
    c.fillStyle = sg; c.fillRect(0, 0, W, H);
  } else if (bg.id === 'volcano') {
    // 遠方火山與岩漿
    const vx = W * .62, top = FLOOR - 300;
    lpTri(c, [vx - 330, FLOOR], [vx - 50, top], [vx, FLOOR], '#2c0f0c'); lpTri(c, [vx, FLOOR], [vx + 50, top], [vx + 330, FLOOR], '#1e0906');
    lpTri(c, [vx - 50, top], [vx + 50, top], [vx, FLOOR], '#240b08');
    const gl = c.createRadialGradient(vx, top, 5, vx, top, 220); gl.addColorStop(0, 'rgba(255,140,40,0.75)'); gl.addColorStop(1, 'rgba(255,80,20,0)');
    c.fillStyle = gl; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(255,120,40,0.8)'; c.lineWidth = 5; c.lineJoin = 'round';
    for (const d of [-1, 1, .3]) { c.beginPath(); c.moveTo(vx + d * 30, top + 5); c.lineTo(vx + d * 70, top + 90); c.lineTo(vx + d * 120, top + 170); c.lineTo(vx + d * 150, top + 260); c.stroke(); }
    const bgl = c.createLinearGradient(0, FLOOR - 120, 0, H); bgl.addColorStop(0, 'rgba(255,90,30,0)'); bgl.addColorStop(1, 'rgba(255,90,30,0.25)');
    c.fillStyle = bgl; c.fillRect(0, FLOOR - 120, W, H);
  }
  if (bg.starPrice) drawStarBgStatic(c, bg, r, 'sky');
  // 遠景岩壁（兩層，越遠越朦朧）
  lpRidge(c, r, FLOOR - 70, 170, 110, th.rock, bg.bot, .55);
  if (bg.starPrice) drawStarBgStatic(c, bg, r, 'far');
  // 主題遠景
  if (bg.id === 'kelp') {
    for (let i = 0; i < 16; i++) {
      const x = r() * W, h = 260 + r() * 260; c.strokeStyle = `rgba(20,70,40,${.3 + r() * .2})`; c.lineWidth = 10 + r() * 8;
      c.beginPath(); c.moveTo(x, FLOOR); for (let k = 1; k <= 6; k++) c.lineTo(x + Math.sin(k * 1.3 + x) * 22, FLOOR - h * k / 6); c.stroke();
    }
  } else if (bg.id === 'sakura') {
    // 遠方岸邊的櫻花樹剪影（多邊形樹冠）
    for (const tx of [W * .15, W * .8]) {
      c.fillStyle = 'rgba(120,60,90,0.35)'; c.fillRect(tx - 8, FLOOR - 160, 16, 170);
      for (let k = 0; k < 9; k++) { const cx = tx + (r() - .5) * 160, cy = FLOOR - 170 - r() * 90, rr = 40 + r() * 40; blob(c, 1, 1, cx, cy, rr, rr * .8, `rgba(255,${160 + (r() * 40 | 0)},${200 + (r() * 30 | 0)},0.45)`, 7, r()); }
    }
  } else if (bg.id === 'reef') {
    const cols = ['255,120,150', '255,170,80', '190,110,255', '255,90,90', '120,220,200'];
    const branch = (x, y, len, ang, w, depth, col) => {
      if (depth <= 0) return; const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      c.strokeStyle = `rgba(${col},0.5)`; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke();
      branch(x2, y2, len * .75, ang - .4 - r() * .3, w * .75, depth - 1, col); branch(x2, y2, len * .75, ang + .4 + r() * .3, w * .75, depth - 1, col);
    };
    for (let i = 0; i < 12; i++) branch(r() * W, FLOOR - 10, 26 + r() * 26, -Math.PI / 2 + (r() - .5) * .5, 9, 4, cols[Math.floor(r() * cols.length)]);
  } else if (bg.id === 'deep') {
    for (let i = 0; i < 7; i++) { const x = r() * W, w = 18 + r() * 30, h = 90 + r() * 180; lpTri(c, [x - w, FLOOR], [x - w * .1, FLOOR - h], [x + w, FLOOR], 'rgba(5,12,24,0.55)'); }
  }
  if (bg.id === 'jelly' || bg.id === 'deep') {
    for (let i = 0; i < 18; i++) { const x = r() * W, y = FLOOR - r() * 60; const gg = c.createRadialGradient(x, y, 0, x, y, 12); gg.addColorStop(0, 'rgba(120,255,220,0.8)'); gg.addColorStop(1, 'rgba(120,255,220,0)'); c.fillStyle = gg; c.fillRect(x - 12, y - 12, 24, 24); }
  } else if (bg.id === 'palace') {
    c.fillStyle = 'rgba(40,0,12,0.42)';
    const px = W / 2;
    for (let k = 0; k < 4; k++) { const y = FLOOR - 70 - k * 70, w = 230 - k * 45; c.beginPath(); c.moveTo(px - w, y + 18); c.lineTo(px - w * .55, y); c.lineTo(px, y - 20); c.lineTo(px + w * .55, y); c.lineTo(px + w, y + 18); c.lineTo(px + w * .8, y + 24); c.lineTo(px - w * .8, y + 24); c.fill(); c.fillRect(px - w * .6, y + 24, w * 1.2, 50); }
    c.fillRect(px - 140, FLOOR - 50, 280, 60);
    for (const sx of [W * .15, W * .85]) { c.fillRect(sx - 12, FLOOR - 220, 24, 230); c.fillRect(sx - 60, FLOOR - 230, 120, 16); }
    for (let i = 0; i < 12; i++) { const x = 60 + r() * (W - 120), y = 80 + r() * 250; const gg = c.createRadialGradient(x, y, 0, x, y, 18); gg.addColorStop(0, 'rgba(255,210,100,0.8)'); gg.addColorStop(1, 'rgba(255,150,50,0)'); c.fillStyle = gg; c.fillRect(x - 18, y - 18, 36, 36); }
  }
  // 近景岩壁與霧化
  lpRidge(c, r, FLOOR - 5, 75, 80, th.rock, bg.bot, .22);
  const fog = c.createLinearGradient(0, FLOOR - 260, 0, FLOOR); fog.addColorStop(0, 'rgba(0,0,0,0)'); fog.addColorStop(1, css(hex(bg.bot), .28));
  c.fillStyle = fog; c.fillRect(0, FLOOR - 260, W, 260);
  // 低多邊形沙地
  const s0 = hex(bg.sand[0]), s1 = hex(bg.sand[1]), rows = [];
  for (let j = 0; j <= 4; j++) {
    const row = [];
    for (let i = 0; i <= 20; i++) {
      const x = i * W / 20 + (i && i < 20 ? (r() - .5) * 26 : 0);
      const top = FLOOR + Math.sin(x * .02) * 4 + Math.sin(x * .053 + 1) * 3;
      row.push([x, j === 0 ? top : top + (H - top) * j / 4 + (j < 4 ? (r() - .5) * 10 : 6)]);
    }
    rows.push(row);
  }
  for (let j = 0; j < 4; j++) for (let i = 0; i < 20; i++) {
    const a = rows[j][i], b = rows[j][i + 1], d = rows[j + 1][i], e = rows[j + 1][i + 1], base = mixc(s0, s1, (j + .5) / 4);
    lpTri(c, a, b, d, css(bright(base, (j === 0 ? 1.08 : 1) + (r() - .5) * .1)));
    lpTri(c, b, e, d, css(bright(base, .95 + (r() - .5) * .1)));
  }
  c.strokeStyle = 'rgba(255,255,255,0.13)'; c.lineWidth = 1.5;
  for (let i = 0; i < 9; i++) { const y = FLOOR + 14 + r() * (H - FLOOR - 20), x = r() * W; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 30, y - 4, x + 60 + r() * 40, y); c.stroke(); }
  // 前景石頭（放在造景之間，不擋住造景）
  const rockCol = mixc(bright(hex(th.rock), 1.25), s1, .35);
  lpRock(c, r, 18, H - 8, 50, rockCol); lpRock(c, r, W - 14, H - 4, 60, rockCol);
  lpRock(c, r, W * .335, H - 10, 12, rockCol); lpRock(c, r, W * .535, H - 8, 10, rockCol);
  // 四周微暗，視線集中在中間
  const vg = c.createRadialGradient(W / 2, H * .45, H * .35, W / 2, H * .45, W * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,10,25,0.35)');
  c.fillStyle = vg; c.fillRect(0, 0, W, H);
}

