// 造景：資料與繪製（scene.js）
// ====== 造景：固定位置的部件，每個部件有 5 級外觀 ======
// 功能永遠取「已升級到的最高等級」，外觀可以自己選喜歡的等級（也可以先隱藏）
// layer 0 = 後排（比較遠、稍微霧化）、1 = 前排；x 是在水族箱寬度的位置比例，y 是底部站在哪裡
const SCENE = [
  { id: 'castle',   name: '海底城堡', icon: '🏰', layer: 0, x: .10, y: FLOOR + 8,  eff: 'breed',   label: '繁殖速度',   sign: '+', per: [.10, .22, .36, .55, .80], base: 30000,   mul: 9,
    lv: ['石牆遺跡', '小塔樓', '海底城堡', '童話城堡', '水晶宮殿'], box: [[40, 46], [42, 96], [56, 106], [52, 150], [56, 172]] },
  { id: 'arch',     name: '古代拱門', icon: '🏛️', layer: 0, x: .47, y: FLOOR + 6,  eff: 'all',     label: '全部加成',   sign: '+', per: [.03, .07, .12, .18, .25], base: 1000000, mul: 12,
    lv: ['岩石拱門', '青苔拱門', '古代石門', '海神神殿', '龍宮牌樓'], box: [[48, 64], [54, 82], [54, 96], [62, 122], [68, 150]] },
  { id: 'ship',     name: '沉船',     icon: '⚓', layer: 0, x: .81, y: FLOOR + 12, eff: 'offline', label: '離線收益',   sign: '+', per: [.15, .35, .60, .90, 1.30], base: 150000, mul: 10,
    lv: ['破木舟', '小帆船殘骸', '古帆船', '寶藏沉船', '幽靈海盜船'], box: [[36, 30], [44, 70], [66, 110], [70, 110], [80, 124]] },
  { id: 'coral',    name: '珊瑚礁',   icon: '🪸', layer: 1, x: .22, y: H - 24,     eff: 'value',   label: '寶物價值',   sign: '+', per: [.08, .17, .28, .40, .55], base: 400,     mul: 6,
    lv: ['小珊瑚', '珊瑚叢', '彩色珊瑚礁', '繁茂珊瑚礁', '虹彩珊瑚礁'], box: [[34, 52], [44, 64], [56, 72], [66, 84], [66, 88]] },
  { id: 'starfish', name: '海星沙灘', icon: '🐚', layer: 1, x: .43, y: H - 16, k: 1.55,     eff: 'hunger',  label: '飽食度消耗', sign: '-', per: [.08, .16, .25, .35, .45], base: 150,     mul: 5,
    lv: ['一隻海星', '海星與貝殼', '海星家族', '貝殼海灘', '黃金海星'], box: [[22, 20], [36, 22], [40, 24], [54, 26], [56, 30]] },
  { id: 'clam',     name: '硨磲貝',   icon: '🦪', layer: 1, x: .62, y: H - 20, k: 1.2,     eff: 'drop',    label: '產寶速度',   sign: '+', per: [.06, .13, .21, .30, .42], base: 6000,    mul: 8,
    lv: ['小蛤蜊', '珍珠貝', '大硨磲貝', '雙寶硨磲', '虹彩寶珠貝'], box: [[26, 26], [30, 32], [38, 44], [52, 46], [56, 54]] },
  { id: 'anemone',  name: '海葵',     icon: '🌺', layer: 1, x: .75, y: H - 22, k: 1.15,     eff: 'growth',  label: '成長速度',   sign: '+', per: [.12, .25, .40, .60, .85], base: 1500,    mul: 7,
    lv: ['小海葵', '粉紅海葵', '海葵與小丑魚', '海葵花園', '夜光海葵'], box: [[24, 34], [28, 42], [40, 56], [52, 58], [52, 60]] },
  { id: 'crystal',  name: '星之水晶', icon: '💠', layer: 1, x: 0,   y: H - 40,     eff: 'all',     label: '全部加成',   sign: '+', per: [.04, .08, .13, .19, .26], star: true, starPrices: [15, 35, 75, 150, 300],
    lv: ['小水晶', '水晶簇', '星光水晶', '閃耀水晶林', '星之聖晶'], box: [[20, 34], [24, 36], [30, 48], [34, 64], [38, 118]] },
  // 星星造景（後期）：月光貝殼放在左下角的大石頭上、彩虹噴泉在城堡和拱門中間
  { id: 'moonshell', name: '月光貝殼', icon: '🐚', layer: 1, x: 0,   y: H - 30,     eff: 'value',   label: '寶物價值',   sign: '+', per: [.05, .10, .16, .23, .32], star: true, starPrices: [40, 100, 220, 450, 900],
    lv: ['小貝殼', '珍珠貝', '月光貝', '月光寶貝', '月之珍珠'], box: [[18, 20], [22, 28], [28, 34], [36, 40], [40, 70]] },
  { id: 'fountain',  name: '彩虹噴泉', icon: '⛲', layer: 0, x: .29, y: FLOOR + 8, eff: 'all',     label: '全部加成',   sign: '+', per: [.03, .06, .10, .15, .21], star: true, starPrices: [120, 300, 700, 1500, 3000],
    lv: ['小石噴泉', '貝殼噴泉', '雙層噴泉', '彩虹噴泉', '七彩仙境噴泉'], box: [[30, 44], [34, 50], [36, 76], [52, 90], [58, 130]] },
];
const SCN = Object.fromEntries(SCENE.map(p => [p.id, p]));
const scenePrice = (p, lv) => p.star ? p.starPrices[lv - 1] : nice(p.base * Math.pow(p.mul, lv - 1));
const sceneEff = (p, lv) => `${p.label} ${p.sign}${Math.round(p.per[lv - 1] * 100)}%`;
// 星之水晶長在右下角的大石頭上、月光貝殼在左下角，其他照比例排
const scenePos = p => p.id === 'crystal' ? { x: W - 64 * sceneK(p), y: p.y } : p.id === 'moonshell' ? { x: 50 * sceneK(p), y: p.y } : { x: Math.round(W * p.x), y: p.y };
// 造景的縮放：前排大一點；螢幕比較窄時整體縮小，避免擠在一起
const sceneK = p => (p.layer ? 1.5 : 1.3) * (p.k || 1) * clamp(W / 1300, .72, 1);

// ---- 讓造景融入背景：依背景調整亮度、遠的部件混一點海水色 ----
const SC = { amb: 1, fog: [0, 0, 0], grade: [255, 255, 255], sand: [[0, 0, 0], [0, 0, 0]], rock: [0, 0, 0] };
let FOG = 0;
function sceneLight() {
  const bg = BG[state.bg], th = THEME[bg.id] || THEME.fresh, top = hex(bg.top), bot = hex(bg.bot);
  const lum = (top[0] * .3 + top[1] * .59 + top[2] * .11) / 255;
  SC.amb = clamp(.5 + .6 * lum, .58, 1); SC.fog = mixc(bot, mixc(top, bot, .45), .5); SC.grade = top;
  SC.sand = bg.sand.map(hex); SC.rock = mixc(bright(hex(th.rock), 1.25), SC.sand[1], .35);
}
const tcol = (h, k = 1) => { let c = bright(Array.isArray(h) ? h : hex(h), SC.amb * k); c = mixc(c, SC.grade, .06); return mixc(c, SC.fog, FOG); };
const tc = (h, k = 1, a = 1) => css(tcol(h, k), a);
const tpoly = (c, pts, h, k = 1, a = 1) => polyFill(c, pts, tc(h, k, a));
// 自己會發光的顏色（不受背景明暗影響）
const gcol = (h, k = 1, a = 1) => css(mixc(bright(Array.isArray(h) ? h : hex(h), k), SC.fog, FOG * .5), a);
// 柔和光暈：畫成小圖快取起來，每幀直接貼上（比每次建立漸層快）
const HALO_CV = {};
function halo(c, x, y, r, col, a = 1) {
  let cv = HALO_CV[col]; if (!cv) { cv = document.createElement('canvas'); cv.width = cv.height = 64; glowDot(cv.getContext('2d'), 32, 32, 32, col, 1); HALO_CV[col] = cv; }
  const a0 = c.globalAlpha; c.globalAlpha = a0 * clamp(a, 0, 1); c.drawImage(cv, x - r, y - r, r * 2, r * 2); c.globalAlpha = a0;
}
function glowDot(c, x, y, r, col, a = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r), b = Array.isArray(col) ? col : hex(col);
  g.addColorStop(0, css(b, a)); g.addColorStop(1, css(b, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
}
const hexPts = (x, y, r, sy = 1, rot = .5) => [0, 1, 2, 3, 4, 5].map(i => [x + Math.cos(i * Math.PI / 3 + rot) * r, y + Math.sin(i * Math.PI / 3 + rot) * r * sy]);
function twinkle(c, x, y, r, i, col = '#ffffff') { const k = Math.max(0, Math.sin(T * 2.2 + i * 2.7)); if (k < .05) return; c.fillStyle = css(hex(col), k); star4(c, x, y, r * (.5 + k * .5)); }
// 沙丘：用背景原本的沙色，造景看起來就像長在沙地上
function mound(c, w, h, seed, rocks = 2) {
  const r = mulberry(seed), n = 7, top = [], [s0, s1] = SC.sand;
  for (let i = 0; i <= n; i++) { const t = i / n; top.push([-w + 2 * w * t, -h * Math.pow(Math.sin(Math.PI * t), .8) * (i && i < n ? .85 + r() * .3 : 0)]); }
  for (let i = 0; i < n; i++) {
    const a = top[i], b = top[i + 1], m = [(a[0] + b[0]) / 2 + (r() - .5) * 6, 8];
    lpTri(c, a, b, m, css(bright(mixc(s0, s1, .2 + r() * .3), i < n / 2 ? 1.08 : .95)));
    lpTri(c, a, m, [a[0], 8], css(bright(mixc(s0, s1, .45), 1)));
    lpTri(c, b, [b[0], 8], m, css(bright(mixc(s0, s1, .45), .97)));
  }
  for (let i = 0; i < rocks; i++) lpRock(c, r, (r() - .5) * w * 1.3, 3 + r() * 3, 5 + r() * 6, SC.rock);
}
function shadowUnder(c, w, h = 5) { c.fillStyle = 'rgba(0,0,0,0.16)'; ell(c, 2, 3, w, h); c.fill(); }

// ---- 珊瑚礁 ----
function coralBranch(c, x, y, len, ang, w, depth, col, k = 1) {
  const a = ang + Math.sin(T * 1.1 + x * .05 + depth) * .04;
  const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, nx = -Math.sin(a), ny = Math.cos(a), w2 = w * .72;
  tpoly(c, [[x + nx * w / 2, y + ny * w / 2], [x, y], [x2, y2], [x2 + nx * w2 / 2, y2 + ny * w2 / 2]], col, .84 * k);
  tpoly(c, [[x, y], [x - nx * w / 2, y - ny * w / 2], [x2 - nx * w2 / 2, y2 - ny * w2 / 2], [x2, y2]], col, 1.12 * k);
  if (depth > 1) { coralBranch(c, x2, y2, len * .78, a - .42, w2, depth - 1, col, k); coralBranch(c, x2, y2, len * .72, a + .4, w2, depth - 1, col, k); }
  else tpoly(c, hexPts(x2, y2, w2 * .7), col, 1.3 * k);
  return [x2, y2];
}
function seaFan(c, x, y, w, h, col, k = 1) {
  const sk = Math.sin(T * .9 + x * .1) * w * .06, n = 8, P = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI * (1.08 + .84 * i / n); P.push([x + Math.cos(a) * w - sk * Math.sin(a), y + Math.sin(a) * h]); }
  c.strokeStyle = tc(col, .7 * k); c.lineWidth = 3; c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x, y); c.stroke();
  for (let i = 0; i < n; i++) tpoly(c, [[x, y], P[i], P[i + 1]], col, (i % 2 ? .9 : 1.06) * (1.08 - i / n * .2) * k, .94);
  c.strokeStyle = tc(col, .66 * k, .85); c.lineWidth = 1.1; c.beginPath();
  for (const p of P) { c.moveTo(x, y); c.lineTo(...p); }
  for (const f of [.45, .72]) P.forEach((p, i) => { const q = [x + (p[0] - x) * f, y + (p[1] - y) * f]; i ? c.lineTo(...q) : c.moveTo(...q); });
  c.stroke();
}
function brainCoral(c, x, y, r, col, k = 1) {
  const n = 7, P = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI + Math.PI * i / n; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .75]); }
  for (let i = 0; i < n; i++) tpoly(c, [[x, y + r * .12], P[i], P[i + 1]], col, (1.18 - i / n * .38) * k);
  c.strokeStyle = tc(col, .7 * k, .9); c.lineWidth = 1.3;
  for (let j = 1; j <= 3; j++) {
    const rr = r * j / 3.6; c.beginPath();
    for (let i = 0; i <= 12; i++) { const a = Math.PI + Math.PI * i / 12, q = rr * (1 + Math.sin(i * 2.2 + j) * .09), px = x + Math.cos(a) * q, py = y + Math.sin(a) * q * .75; i ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.stroke();
  }
}
function tubes(c, x, y, list, col, k = 1) {
  for (const [dx, h, w] of list) {
    const sw = Math.sin(T * 1.3 + dx) * 1.5, bx = x + dx;
    tpoly(c, [[bx - w, y], [bx, y], [bx + sw, y - h], [bx - w + sw, y - h]], col, 1.1 * k);
    tpoly(c, [[bx, y], [bx + w, y], [bx + w + sw, y - h], [bx + sw, y - h]], col, .84 * k);
    c.fillStyle = tc(col, .5 * k); ell(c, bx + sw, y - h, w, w * .42); c.fill();
  }
}
function scCoral(c, lv) {
  const P = Math.PI / 2, rb = lv === 5;
  const cc = k => rb ? hsl((T * 25 + k * 70) % 360, .85, .66) : null;
  const pink = '#ff7aa8', orange = '#ff9a4a', red = '#f0606a', purple = '#a878ee', teal = '#3cc8b0', yg = '#c8d860', blue = '#5a9aff', lilac = '#d49ae8';
  if (lv === 1) { mound(c, 34, 9, 11, 1); coralBranch(c, 0, -6, 20, -P, 8, 3, pink); return; }
  if (lv === 2) {
    mound(c, 44, 11, 12); seaFan(c, -14, -8, 26, 44, orange); coralBranch(c, 4, -6, 22, -P - .1, 9, 3, pink);
    tubes(c, 24, -2, [[0, 16, 4], [7, 22, 4], [13, 12, 3.5]], teal); return;
  }
  if (lv === 3) {
    mound(c, 56, 13, 13); seaFan(c, -20, -9, 30, 52, orange); coralBranch(c, 2, -8, 24, -P - .1, 10, 4, pink);
    coralBranch(c, 28, -5, 18, -P + .3, 7, 3, purple); tubes(c, 40, 0, [[0, 14, 3.5], [6, 20, 3.5]], teal); brainCoral(c, -32, 1, 16, yg); return;
  }
  // Lv4 繁茂珊瑚礁、Lv5 虹彩珊瑚礁（同樣的構圖，Lv5 顏色會流轉並發光）
  const k = rb ? 1.25 : 1;
  if (rb) glowDot(c, 0, -34, 80, hsl((T * 25) % 360, .9, .7), .35);
  mound(c, 66, 15, 14, 3);
  seaFan(c, -28, -11, 34, 60, cc(0) || orange, k); seaFan(c, 12, -11, 24, 46, cc(1) || red, k);
  coralBranch(c, -44, -3, 16, -P - .35, 7, 3, cc(2) || blue, k);
  coralBranch(c, -4, -9, 26, -P - .05, 11, 4, cc(3) || pink, k);
  coralBranch(c, 30, -6, 22, -P + .35, 8, 4, cc(4) || purple, k);
  tubes(c, 50, 2, [[0, 16, 3.5], [6, 24, 3.5], [12, 12, 3]], cc(5) || teal, k);
  brainCoral(c, -30, 3, 17, cc(6) || yg, k); brainCoral(c, 42, 5, 12, cc(7) || lilac, k);
  // 會一閃一閃的珊瑚蟲
  const r = mulberry(77);
  for (let i = 0; i < (rb ? 16 : 9); i++) {
    const x = (r() - .5) * 100, y = -8 - r() * 60, tw = .5 + .5 * Math.sin(T * 2 + i * 1.7);
    glowDot(c, x, y, 5 + tw * 3, rb ? hsl((T * 40 + i * 30) % 360, 1, .75) : '#fff0c0', rb ? .85 : .5 * tw);
  }
  if (rb) for (let i = 0; i < 5; i++) twinkle(c, -50 + i * 25, -30 - (i % 3) * 18, 6, i);
}

// ---- 海星沙灘 ----
function starfish(c, x, y, r, col, rot = 0, k = 1) {
  c.fillStyle = 'rgba(0,0,0,0.16)'; ell(c, x + 2, y + 3, r * 1.05, r * .4); c.fill();
  const P = [];
  for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .55]); }
  for (let i = 0; i < 10; i++) {
    const p = P[i], q = P[(i + 1) % 10], mx = (p[0] + q[0]) / 2 - x, my = (p[1] + q[1]) / 2 - y;
    tpoly(c, [[x, y - r * .1], p, q], col, (1 + (-mx * .4 - my * 1.3) / r * .4) * k);
  }
  c.fillStyle = tc(col, 1.4 * k, .9);
  for (let i = 0; i < 10; i += 2) for (const f of [.4, .7]) { circle(c, x + (P[i][0] - x) * f, y - r * .06 + (P[i][1] - y) * f, Math.max(1, r * .07)); c.fill(); }
}
function conch(c, x, y, r, col, dir = 1) {
  c.fillStyle = 'rgba(0,0,0,0.15)'; ell(c, x, y + 2, r * 1.1, r * .3); c.fill();
  const P = [[x + r * 1.1 * dir, y - r * .15], [x + r * .2 * dir, y - r * .75], [x - r * .6 * dir, y - r * .6], [x - r * .95 * dir, y - r * .2], [x - r * .7 * dir, y + r * .05], [x + r * .4 * dir, y + r * .05]], C = [x, y - r * .3];
  P.forEach((p, i) => tpoly(c, [C, p, P[(i + 1) % P.length]], col, [1.15, 1.2, 1.05, .9, .85, .95][i]));
  c.strokeStyle = tc('#b08060', 1, .6); c.lineWidth = 1.3;
  for (let i = 1; i <= 3; i++) { c.beginPath(); c.moveTo(x + (1.1 - i * .45) * r * dir, y - r * .12); c.quadraticCurveTo(x + (.9 - i * .45) * r * dir, y - r * .7, x + (.6 - i * .45) * r * dir, y - r * .55); c.stroke(); }
  tpoly(c, hexPts(x - r * .35 * dir, y - r * .15, r * .28, .6), '#ffb0b8', 1.1);
}
function scallop(c, x, y, r, col, k = 1) {
  const n = 9, P = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI + Math.PI * i / n; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r * .85]); }
  for (let i = 0; i < n; i++) tpoly(c, [[x, y + r * .15], P[i], P[i + 1]], col, (i % 2 ? .9 : 1.08) * (1.1 - i / n * .2) * k);
  tpoly(c, [[x - r * .3, y + r * .15], [x - r * .05, y - r * .05], [x - r * .05, y + r * .2]], col, .8 * k);
  tpoly(c, [[x + r * .3, y + r * .15], [x + r * .05, y - r * .05], [x + r * .05, y + r * .2]], col, .75 * k);
}
function sandDollar(c, x, y, r) {
  tpoly(c, hexPts(x, y, r, .45, 0), '#f0e4c8', 1.05);
  c.fillStyle = tc('#c8b48a', 1, .7);
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; ell(c, x + Math.cos(a) * r * .45, y + Math.sin(a) * r * .2, r * .22, r * .08, a); c.fill(); }
}
function pearl(c, x, y, r, glow = 0) {
  if (glow) glowDot(c, x, y, r * (3 + glow * Math.sin(T * 2.5)), '#fff4e0', .55);
  const g = c.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#f4ecf4'); g.addColorStop(1, '#d8c8e0');
  c.fillStyle = g; circle(c, x, y, r); c.fill();
}
function scStarfish(c, lv) {
  const r = mulberry(21 + lv);
  for (let i = 0; i < 2 + lv; i++) lpRock(c, r, (r() - .5) * (40 + lv * 14), 2 + r() * 4, 3 + r() * 3, SC.rock);
  if (lv >= 4) { scallop(c, -8, -3, 12, '#ff9ab8'); scallop(c, 38, 1, 9, '#c8a8f0'); }
  if (lv >= 3) { starfish(c, -26, -1, 12, '#4a8ae8', -.3); sandDollar(c, 10, 5, 10); }
  if (lv >= 2) conch(c, 24, -1, 11, '#f4e0c8', -1);
  if (lv >= 4) starfish(c, -46, 3, 10, '#ff6a8a', .5);
  if (lv === 5) {
    glowDot(c, 0, -3, 40 + Math.sin(T * 2) * 5, '#ffe070', .45);
    starfish(c, 0, -3, 17, '#ffc830', .2, 1.3);
    scallop(c, 50, 4, 11, '#ffd8e8'); pearl(c, 45, 0, 3.5, 1); pearl(c, 51, -1, 4, 1); pearl(c, 56, 1, 3, 1);
    for (let i = 0; i < 4; i++) twinkle(c, -30 + i * 20, -16 - (i % 2) * 8, 6, i, '#fff4a0');
  } else starfish(c, 0, -3, lv >= 3 ? 16 : 15, '#ff8a3a', .2);
}

// ---- 硨磲貝 ----
function clamShell(c, x, y, r, shell, mantle, open, o = {}) {
  const n = 9, lipY = y - r * .42, gap = open * r * .42, rim = [], up = [];
  for (let i = 0; i <= n; i++) { const t = i / n; rim.push([x - r + 2 * r * t, lipY + (i % 2 ? r * .1 : 0) - Math.sin(Math.PI * t) * r * .05]); }
  const sc = i => o.rainbow ? hsl((T * 30 + i * 25) % 360, .6, .82) : shell;
  // 下殼
  c.fillStyle = 'rgba(0,0,0,0.18)'; ell(c, x + 2, y + 2, r * .95, r * .22); c.fill();
  for (let i = 0; i < n; i++) tpoly(c, [[x, y], rim[i], rim[i + 1]], sc(i), (i % 2 ? .88 : 1.02) * (1.08 - i / n * .25));
  // 打開時看得到裡面的外套膜和珍珠
  if (gap > 1) {
    const top = rim.map(([px, py], i) => [px, py - gap + (i % 2 ? 0 : r * .1)]);
    polyFill(c, [...rim, ...top.slice().reverse()], o.mantleGlow ? gcol(mantle, 1) : tc(mantle));
    c.fillStyle = o.mantleGlow ? gcol('#9afcff', 1, .9) : tc(o.spot || '#ffffff', 1, .7);
    for (let i = 1; i < n; i++) { circle(c, rim[i][0], rim[i][1] - gap * .5, Math.min(gap * .18, r * .05) + .5); c.fill(); }
    if (o.pearl) pearl(c, x, lipY - gap * .45, Math.min(o.pearl, gap * .45 + 1), o.pearlGlow || 0);
  }
  // 上殼
  for (let i = 0; i <= n; i++) { const a = Math.PI + Math.PI * i / n; up.push([x + Math.cos(a) * r, lipY - gap + Math.sin(a) * r * .72]); }
  const ur = rim.map(([px, py], i) => [px, py - gap + (i % 2 ? 0 : r * .1)]);
  for (let i = 0; i < n; i++) tpoly(c, [[x, lipY - gap - r * .1], ur[i], ur[i + 1], up[i + 1], up[i]].filter(Boolean), sc(i + 3), (i % 2 ? .92 : 1.1) * (1.15 - i / n * .3));
  c.strokeStyle = tc(o.rainbow ? '#ffffff' : shell, .7, .6); c.lineWidth = 1;
  c.beginPath(); for (let i = 1; i < n; i++) { c.moveTo(x, lipY - gap - r * .55); c.lineTo(...up[i]); } c.stroke();
}
function scClam(c, lv) {
  const op = sp => clamp(.5 - .5 * Math.cos(T * sp), 0, 1);
  if (lv === 1) { mound(c, 26, 6, 31, 1); clamShell(c, 0, 0, 16, '#e0d0b8', '#c8a080', .15 + .1 * op(.7)); return; }
  if (lv === 2) { mound(c, 30, 7, 32, 2); clamShell(c, 0, 0, 20, '#f0e0d0', '#e8b0b8', op(.5), { pearl: 4.5 }); return; }
  if (lv === 3) { mound(c, 40, 8, 33, 2); clamShell(c, 0, 0, 28, '#d8d0c0', '#2ab8c8', .3 + .7 * op(.45), { pearl: 6, spot: '#9af0ff' }); return; }
  if (lv === 4) {
    mound(c, 50, 9, 34, 3); clamShell(c, 34, 3, 15, '#f0c8d0', '#ff8ab0', op(.6), { pearl: 3.5 });
    clamShell(c, -4, 0, 30, '#e0d4c4', '#3a6ae8', .3 + .7 * op(.4), { pearl: 7, pearlGlow: .8, spot: '#c8a0ff' }); return;
  }
  mound(c, 54, 10, 35, 3);
  const o = .35 + .65 * op(.4);
  glowDot(c, -4, -18, 60 + 10 * Math.sin(T * 2), '#b8f0ff', .3 * o);
  clamShell(c, 36, 4, 16, '#ffd8f0', '#ff6ad0', op(.6), { pearl: 4, pearlGlow: 1, rainbow: true, mantleGlow: true });
  clamShell(c, -4, 0, 34, '#ffffff', '#7a3ae8', o, { pearl: 8, pearlGlow: 1.5, rainbow: true, mantleGlow: true });
  for (let i = 0; i < 5; i++) twinkle(c, -40 + i * 18, -38 - (i % 2) * 12, 6, i, '#e0fbff');
}

// ---- 海葵 ----
function anemone(c, x, y, r, n, col, tip, o = {}) {
  const ph = o.ph || 0, dk = bright(hex(col), .7);
  tpoly(c, [[x - r * .5, y], [x, y], [x, y - r * .75], [x - r * .62, y - r * .75]], dk, 1.1);
  tpoly(c, [[x, y], [x + r * .5, y], [x + r * .62, y - r * .75], [x, y - r * .75]], dk, .85);
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : .5, bx = x + (t - .5) * r * 1.15, by = y - r * .72, len = r * (1.15 - Math.abs(t - .5) * .55);
    const pts = [[bx, by]]; let px = bx, py = by;
    for (let j = 1; j <= 4; j++) {
      const q = j / 4, a = -Math.PI / 2 + (t - .5) * (1.6 + q * 1.4) + Math.sin(T * 1.5 + i * .8 + ph + q * 1.5) * .28 * q;
      px += Math.cos(a) * len / 4; py += Math.sin(a) * len / 4; pts.push([px, py]);
    }
    const cl = o.rainbow ? hsl((T * 40 + i * 22 + ph * 50) % 360, .85, .68) : col;
    ribbon(c, pts, r * .12, o.rainbow ? mixc(cl, SC.fog, FOG) : tcol(cl, i % 2 ? .92 : 1.05), .95);
    if (o.glow) glowDot(c, px, py, r * .28, o.rainbow ? hsl((T * 40 + i * 22 + 180) % 360, 1, .75) : tip, .8);
    c.fillStyle = o.glow ? gcol(tip, 1.1) : tc(tip); circle(c, px, py, r * .075 + .6); c.fill();
  }
}
function miniClown(c, x, y, i) {
  const a = T * .6 + i * 3, px = x + Math.cos(a) * 22, py = y + Math.sin(a * 2) * 6, dir = -Math.sin(a) >= 0 ? 1 : -1;
  c.save(); c.translate(px, py); c.scale(dir, 1); drawClown(c, 9, Math.sin(T * 8 + i) * .15, 1, null); c.restore();
}
function scAnemone(c, lv) {
  const r = mulberry(41);
  lpRock(c, r, -4, 2, 16 + lv * 2, SC.rock);
  if (lv >= 3) lpRock(c, r, 22, 4, 12, SC.rock);
  if (lv === 1) { anemone(c, 0, -8, 14, 12, '#5ac87a', '#d8ffb8'); return; }
  if (lv === 2) { anemone(c, 0, -10, 18, 16, '#ff8ab8', '#b85ae8'); return; }
  const rb = lv === 5, g = lv >= 4;
  if (rb) glowDot(c, -2, -24, 64, hsl((T * 30) % 360, .9, .7), .3);
  if (lv >= 4) { lpRock(c, r, -32, 5, 11, SC.rock); anemone(c, -32, -3, 15, 14, '#a870e8', '#6af0ff', { glow: g, rainbow: rb, ph: 2 }); }
  anemone(c, 22, -4, 13, 12, '#ff9a4a', '#ffe08a', { glow: g, rainbow: rb, ph: 1 });
  miniClown(c, -4, -30, 0);
  anemone(c, -6, -10, 20, 18, '#ff7ab0', '#b85ae8', { glow: g, rainbow: rb });
  if (rb) { miniClown(c, 10, -20, 1); for (let i = 0; i < 4; i++) twinkle(c, -36 + i * 22, -48 - (i % 2) * 8, 5, i); }
}

// ---- 城堡 ----
function tower(c, x, y, w, h, wall, roof, o = {}) {
  tpoly(c, [[x - w / 2, y], [x, y], [x, y - h], [x - w / 2, y - h]], wall, 1.1);
  tpoly(c, [[x, y], [x + w / 2, y], [x + w / 2, y - h], [x, y - h]], wall, .82);
  c.strokeStyle = tc(wall, .62, .45); c.lineWidth = 1;
  for (let yy = y - 9, k = 0; yy > y - h + 3; yy -= 9, k++) { c.beginPath(); c.moveTo(x - w / 2, yy); c.lineTo(x + w / 2, yy); c.moveTo(x + (k % 2 ? -w / 4 : w / 4), yy); c.lineTo(x + (k % 2 ? -w / 4 : w / 4), yy + 9); c.stroke(); }
  for (const dy of o.win || []) winAt(c, x, y - dy, w * .2, o.lit);
  if (roof) {
    const rw = w * .64, rh = o.rh || w * 1.15;
    tpoly(c, [[x - rw, y - h], [x, y - h], [x, y - h - rh]], roof, 1.12); tpoly(c, [[x, y - h], [x + rw, y - h], [x, y - h - rh]], roof, .8);
    if (o.flag) flagAt(c, x, y - h - rh, o.flag);
    if (o.orb) { glowDot(c, x, y - h - rh - 6, 18, o.orb, .8); c.fillStyle = gcol(o.orb, 1.2); circle(c, x, y - h - rh - 6, 3.5); c.fill(); }
  } else for (let k = 0; k < 3; k++) { const bx = x - w / 2 + k * w / 2.5; tpoly(c, [[bx, y - h], [bx + w / 5, y - h], [bx + w / 5, y - h - 6], [bx, y - h - 6]], wall, k < 1.5 ? 1.05 : .85); }
}
function winAt(c, x, y, s, lit) {
  const P = [[x - s / 2, y], [x - s / 2, y - s], [x, y - s * 1.5], [x + s / 2, y - s], [x + s / 2, y]];
  if (lit) { glowDot(c, x, y - s * .7, s * 2.4, lit, .55); polyFill(c, P, gcol(lit, 1.1)); } else tpoly(c, P, '#162030', .9);
}
function flagAt(c, x, y, col) {
  c.strokeStyle = tc('#5a4a3a'); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 14); c.stroke();
  const wv = Math.sin(T * 3 + x) * 2;
  tpoly(c, [[x, y - 14], [x + 10, y - 12 + wv], [x + 16, y - 10 + wv * 1.5], [x, y - 7]], col, 1.05);
}
function gateAt(c, x, y, w, h) { tpoly(c, [[x - w / 2, y], [x - w / 2, y - h * .6], [x - w * .3, y - h * .9], [x, y - h], [x + w * .3, y - h * .9], [x + w / 2, y - h * .6], [x + w / 2, y]], '#1a1a28', .9); }
function scCastle(c, lv) {
  if (lv === 1) {
    mound(c, 48, 8, 51, 3);
    const P = [[-36, 0], [-36, -30], [-28, -34], [-22, -28], [-14, -40], [-4, -38], [4, -44], [12, -32], [20, -26], [28, -18], [36, -12], [36, 0]];
    tpoly(c, P, '#a8a090', 1); tpoly(c, [[4, -44], [12, -32], [20, -26], [28, -18], [36, -12], [36, 0], [4, 0]], '#a8a090', .82);
    c.strokeStyle = tc('#6a6458', 1, .5); c.lineWidth = 1; for (let y = -8; y > -40; y -= 8) { c.beginPath(); c.moveTo(-36, y); c.lineTo(Math.min(36, 30 + y * .7), y); c.stroke(); }
    winAt(c, -12, -12, 12);
    c.fillStyle = tc('#5a9a4a', 1, .9); for (const [x, y, r] of [[-30, -30, 5], [-18, -36, 4], [8, -38, 4], [26, -16, 4]]) { blob(c, 1, 1, x, y, r, r * .6, c.fillStyle, 6); }
    const r = mulberry(5); for (let i = 0; i < 4; i++) lpRock(c, r, 20 + r() * 20, 2, 3 + r() * 4, tcol('#a8a090', .9));
    return;
  }
  if (lv === 2) {
    mound(c, 50, 9, 52, 2);
    tower(c, 12, 0, 44, 30, '#b8b0a0', null, { win: [16] });
    tower(c, -18, 0, 26, 64, '#c0b8a8', '#3aa8a0', { win: [24, 46], rh: 32 });
    return;
  }
  if (lv === 3) {
    mound(c, 62, 10, 53, 3);
    tower(c, 0, 0, 48, 52, '#b8b0a0', null, { win: [36] }); gateAt(c, 0, 0, 16, 24);
    tower(c, -32, 0, 22, 74, '#c4bcac', '#3a78c8', { win: [30, 54], rh: 30 }); tower(c, 32, 0, 22, 74, '#c4bcac', '#3a78c8', { win: [30, 54], rh: 30 });
    return;
  }
  const five = lv === 5, wall = five ? '#eef0f8' : '#d8ccc0', rA = five ? '#f0c040' : '#e86a9a', rB = five ? '#ffd860' : '#b86ae8', lit = five ? '#7af0ff' : '#ffd27a';
  if (five) glowDot(c, 0, -80, 110, '#bff4ff', .25 + .08 * Math.sin(T * 1.5));
  mound(c, five ? 76 : 70, 12, 54, 4);
  tower(c, -40, 0, 22, five ? 90 : 78, wall, rA, { win: [34, 60], lit, rh: 28, flag: five ? null : '#ff5a7a' });
  tower(c, 40, 0, 22, five ? 90 : 78, wall, rA, { win: [34, 60], lit, rh: 28, flag: five ? null : '#ff5a7a' });
  tower(c, 0, 0, 64, 46, wall, null, { win: [] });
  tower(c, -20, 0, 20, five ? 112 : 98, wall, rB, { win: [50, 76], lit, rh: 30 });
  tower(c, 20, 0, 20, five ? 112 : 98, wall, rB, { win: [50, 76], lit, rh: 30 });
  tower(c, 0, 0, 26, five ? 130 : 116, wall, rA, { win: [64, 92], lit, rh: 38, flag: five ? null : '#ffd84a', orb: five ? '#aef6ff' : null });
  gateAt(c, 0, 0, 18, 28); if (five) { glowDot(c, 0, -12, 22, lit, .5); }
  if (five) for (let i = 0; i < 5; i++) { const t = (T * .35 + i / 5) % 1; c.strokeStyle = `rgba(220,250,255,${.7 * (1 - t)})`; c.lineWidth = 1; circle(c, Math.sin(T + i) * 6, -176 - t * 70, 2 + i % 2); c.stroke(); }
}

// ---- 沉船 ----
function hull(c, len, h, wood, o = {}) {
  const P = [[-len * .5, -h], [len * .42, -h * 1.05], [len * .6, -h * 1.35], [len * .44, -h * .3], [len * .26, 0], [-len * .38, 0], [-len * .52, -h * .42]];
  tpoly(c, P, wood, 1.02);
  tpoly(c, [[-len * .52, -h * .42], [len * .5, -h * .55], [len * .44, -h * .3], [len * .26, 0], [-len * .38, 0]], wood, .8);
  c.strokeStyle = tc(wood, .6, .7); c.lineWidth = 1;
  for (const f of [.25, .5, .75]) { c.beginPath(); c.moveTo(-len * .5, -h * (1 - f * .6)); c.quadraticCurveTo(0, -h * (1 - f) + 2, len * (.42 + (1 - f) * .1), -h * (1.05 - f * .8)); c.stroke(); }
  tpoly(c, [[-len * .5, -h - 3], [len * .42, -h * 1.05 - 3], [len * .42, -h * 1.05], [-len * .5, -h]], wood, 1.25);
  for (let i = 0; i < (o.ports || 0); i++) {
    const x = -len * .3 + i * len * .16, y = -h * .66;
    if (o.lit) { glowDot(c, x, y, 9, o.lit, .6); c.fillStyle = gcol(o.lit, 1.1); } else c.fillStyle = tc('#1a1410');
    circle(c, x, y, 3.2); c.fill();
  }
  if (o.cabin) { tpoly(c, [[-len * .5, -h], [-len * .5, -h - o.cabin], [-len * .22, -h - o.cabin], [-len * .22, -h * 1.02]], wood, 1.12); winAt(c, -len * .36, -h - 4, 6, o.lit); }
}
function sailAt(c, x, y, w, h, col, a, glow) {
  const sw = Math.sin(T * 1.2 + x) * w * .12, P = [[x, y], [x + w + sw, y + h * .1], [x + w * .8 + sw, y + h * .5], [x + w * .95 + sw * 1.3, y + h * .7], [x + w * .6, y + h * .78], [x + w * .45, y + h * .95], [x + w * .2, y + h * .8], [x, y + h]];
  if (glow) { glowDot(c, x + w * .5, y + h * .5, w * 1.1, col, .3); polyFill(c, P, gcol(col, 1, a)); } else tpoly(c, P, col, 1, a);
  c.strokeStyle = glow ? gcol(col, .8, .6) : tc(col, .7, .6); c.lineWidth = 1; c.beginPath(); c.moveTo(x + w * .3, y + h * .05); c.lineTo(x + w * .25, y + h * .82); c.stroke();
}
function mastAt(c, x, y, h, wood, broken) {
  tpoly(c, [[x - 2, y], [x + 2, y], [x + 2, y - h + (broken ? 6 : 0)], [x - 2, y - h]], wood, .95);
  if (!broken) tpoly(c, [[x - h * .3, y - h * .78], [x + h * .3, y - h * .8], [x + h * .3, y - h * .76], [x - h * .3, y - h * .74]], wood, .85);
}
function chest(c, x, y, glint) {
  tpoly(c, [[x - 12, y], [x + 12, y], [x + 12, y - 11], [x - 12, y - 11]], '#8a5a2a', 1);
  tpoly(c, [[x - 12, y - 11], [x + 12, y - 11], [x + 14, y - 24], [x - 10, y - 24]], '#9a6a32', 1.1);
  c.fillStyle = gcol('#ffd040', 1); for (const [dx, dy] of [[-8, -12], [-3, -14], [2, -13], [7, -12], [-5, -16], [1, -17], [5, -15]]) { circle(c, x + dx, y + dy, 2.6); c.fill(); }
  c.fillStyle = gcol('#c89020'); c.fillRect(x - 12, y - 7, 24, 2.5); c.fillRect(x - 1.5, y - 11, 3, 11);
  if (glint) { glowDot(c, x, y - 14, 22, '#ffe070', .45); for (let i = 0; i < 3; i++) twinkle(c, x - 8 + i * 8, y - 18 - (i % 2) * 5, 5, i + 3, '#fff4b0'); }
}
function scShip(c, lv) {
  const wood = lv === 5 ? '#6a4a3a' : '#8a6038';
  if (lv === 1) {
    c.save(); c.rotate(-.18); hull(c, 56, 14, wood); c.restore();
    c.strokeStyle = tc(wood, .9); c.lineWidth = 3; c.beginPath(); c.moveTo(18, -4); c.lineTo(40, -22); c.stroke(); tpoly(c, [[38, -20], [46, -28], [48, -24], [42, -18]], wood, .9);
    mound(c, 44, 8, 61, 2); return;
  }
  if (lv === 2) {
    c.save(); c.rotate(-.12); hull(c, 80, 20, wood); mastAt(c, 2, -20, 46, wood, true); sailAt(c, 4, -58, 26, 30, '#e8e0c8', .75); c.restore();
    mound(c, 52, 9, 62, 2); return;
  }
  const five = lv === 5, len = five ? 140 : 120, hh = five ? 34 : 30, lit = lv === 4 ? '#ffd27a' : five ? '#7af0e0' : null;
  if (five) glowDot(c, 0, -60, 110, '#7af0e0', .18 + .06 * Math.sin(T * 1.3));
  c.save(); c.rotate(-.1);
  hull(c, len, hh, wood, { ports: 5, lit, cabin: 16 });
  mastAt(c, 8, -hh, 86, wood); sailAt(c, 10, -hh - 78, 34, 48, five ? '#9af8ec' : '#e0d6b8', five ? .5 : .78, five);
  if (five) { mastAt(c, -34, -hh - 10, 64, wood); sailAt(c, -32, -hh - 68, 26, 36, '#9af8ec', .5, true); }
  c.strokeStyle = tc('#4a3a2a', 1, .7); c.lineWidth = 1; c.beginPath(); c.moveTo(8, -hh - 86); c.lineTo(len * .6, -hh * 1.35); c.moveTo(8, -hh - 86); c.lineTo(-len * .5, -hh - 16); c.stroke();
  if (lit) { const lx = 8, ly = -hh - 52 + Math.sin(T * 1.5) * 2; glowDot(c, lx + 6, ly, 18, lit, .7); c.fillStyle = gcol(lit, 1.2); circle(c, lx + 6, ly, 3.2); c.fill(); }
  c.restore();
  mound(c, five ? 80 : 70, 11, 63, 3);
  if (lv >= 4) chest(c, len * .3, 8, true);
  if (five) { chest(c, -len * .34, 10, true); for (let i = 0; i < 4; i++) { const t = (T * .3 + i / 4) % 1; c.strokeStyle = `rgba(200,255,245,${.7 * (1 - t)})`; c.lineWidth = 1; circle(c, -20 + i * 14 + Math.sin(T + i) * 4, -40 - t * 90, 2 + i % 2); c.stroke(); } }
}

// ---- 古代拱門 ----
function scArch(c, lv) {
  if (lv <= 2) {
    const s = lv === 2 ? 1.15 : 1;
    mound(c, 56 * s, 9, 71, 3);
    c.save(); c.scale(s, s);
    const rock = mixc(SC.rock, [150, 140, 130], .3);
    tpoly(c, [[-46, 0], [-44, -30], [-36, -52], [-22, -22], [-24, 0]], rock, 1.1);
    tpoly(c, [[-36, -52], [-16, -62], [-12, -34], [-22, -22]], rock, 1.22);
    tpoly(c, [[-16, -62], [8, -62], [30, -54], [18, -24], [6, -34], [-12, -34]], rock, 1.02);
    tpoly(c, [[30, -54], [42, -36], [46, 0], [22, 0], [18, -24]], rock, .8);
    tpoly(c, [[-44, -30], [-46, 0], [-34, 0], [-36, -20]], rock, .95);
    if (lv === 2) {
      c.fillStyle = tc('#4e9a4a'); for (const [x, y, rx] of [[-30, -52, 9], [-8, -63, 10], [16, -61, 8], [34, -48, 6], [-42, -26, 5]]) blob(c, 1, 1, x, y, rx, rx * .45, c.fillStyle, 6);
      for (let i = 0; i < 5; i++) { const x = -28 + i * 13, pts = []; for (let j = 0; j <= 3; j++) pts.push([x + Math.sin(T * 1.4 + i + j * .8) * j * 2, -60 - j * 7 + Math.abs(x) * .1]); ribbon(c, pts, 3, tcol(i % 2 ? '#5ac87a' : '#3a9a5a'), .95); }
    }
    c.restore(); return;
  }
  if (lv === 3) {
    mound(c, 62, 9, 72, 3);
    const st = '#c8bca8';
    for (const x of [-34, 34]) { tpoly(c, [[x - 9, 0], [x, 0], [x, -82], [x - 9, -82]], st, 1.1); tpoly(c, [[x, 0], [x + 9, 0], [x + 9, -82], [x, -82]], st, .82); tpoly(c, [[x - 12, -82], [x + 12, -82], [x + 12, -88], [x - 12, -88]], st, 1); }
    tpoly(c, [[-50, -88], [50, -88], [52, -100], [-52, -100]], st, 1.05); tpoly(c, [[-52, -100], [52, -100], [48, -104], [-48, -104]], st, 1.25);
    c.strokeStyle = tc(st, .6, .6); c.lineWidth = 1; for (const x of [-34, 34]) for (let y = -12; y > -80; y -= 14) { c.beginPath(); c.moveTo(x - 9, y); c.lineTo(x + 9, y); c.stroke(); }
    c.beginPath(); for (let x = -40; x <= 40; x += 10) { c.moveTo(x, -91); c.lineTo(x + 5, -97); } c.stroke();
    for (const x of [-38, 30]) { const pts = []; for (let j = 0; j <= 6; j++) pts.push([x + Math.sin(j * 1.3 + T * .8) * 4, -j * 14]); ribbon(c, pts, 3, tcol('#4e9a4a'), .95); }
    const r = mulberry(8); lpRock(c, r, 50, 4, 8, tcol(st, .9)); tpoly(c, [[42, 6], [60, 0], [64, 6], [46, 10]], st, .9);
    return;
  }
  if (lv === 4) {
    mound(c, 72, 9, 73, 2);
    const mb = '#ece6d8';
    for (let i = 0; i < 3; i++) { const w = 66 - i * 7, y = -i * 6; tpoly(c, [[-w, y], [w, y], [w, y - 6], [-w, y - 6]], mb, 1.12 - i * .05); tpoly(c, [[-w, y], [w, y], [w, y - 1.5], [-w, y - 1.5]], mb, .8); }
    for (const x of [-42, -14, 14, 42]) {
      tpoly(c, [[x - 6, -18], [x, -18], [x, -86], [x - 6, -86]], mb, 1.1); tpoly(c, [[x, -18], [x + 6, -18], [x + 6, -86], [x, -86]], mb, .82);
      c.strokeStyle = tc(mb, .7, .6); c.lineWidth = 1; c.beginPath(); c.moveTo(x - 3, -20); c.lineTo(x - 3, -84); c.moveTo(x + 3, -20); c.lineTo(x + 3, -84); c.stroke();
      tpoly(c, [[x - 9, -86], [x + 9, -86], [x + 7, -91], [x - 7, -91]], mb, 1);
    }
    tpoly(c, [[-56, -91], [56, -91], [56, -101], [-56, -101]], mb, 1.02);
    tpoly(c, [[-60, -101], [0, -124], [0, -101]], mb, 1.15); tpoly(c, [[0, -101], [0, -124], [60, -101]], mb, .88);
    const tg = .7 + .3 * Math.sin(T * 2); glowDot(c, 0, -111, 22, '#7af0ff', .6 * tg);
    c.strokeStyle = gcol('#aef8ff', 1.1); c.lineWidth = 1.8; c.beginPath(); c.moveTo(0, -104); c.lineTo(0, -120); c.moveTo(-6, -118); c.lineTo(-6, -112); c.lineTo(6, -112); c.lineTo(6, -118); c.stroke();
    return;
  }
  // Lv5 龍宮牌樓
  mound(c, 78, 10, 74, 2);
  glowDot(c, 0, -80, 120, '#ffcf70', .18 + .05 * Math.sin(T * 1.2));
  const red = '#d8342c', tile = '#2a8a6a', gold = '#f0c040';
  for (const [x, h] of [[-58, 78], [58, 78], [-24, 108], [24, 108]]) {
    tpoly(c, [[x - 6, 0], [x + 6, 0], [x + 5, -8], [x - 5, -8]], '#b8b0a0', 1);
    tpoly(c, [[x - 4, -8], [x, -8], [x, -h], [x - 4, -h]], red, 1.12); tpoly(c, [[x, -8], [x + 4, -8], [x + 4, -h], [x, -h]], red, .8);
  }
  const roof = (x, y, w, h) => {
    tpoly(c, [[x - w / 2 - 10, y - 9], [x - w / 2, y], [x, y], [x, y - h], [x - w * .34, y - h]], tile, 1.15);
    tpoly(c, [[x + w / 2 + 10, y - 9], [x + w / 2, y], [x, y], [x, y - h], [x + w * .34, y - h]], tile, .85);
    c.strokeStyle = gcol(gold, 1); c.lineWidth = 2; c.beginPath(); c.moveTo(x - w / 2 - 10, y - 9); c.lineTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2 + 10, y - 9); c.moveTo(x - w * .34, y - h); c.lineTo(x + w * .34, y - h); c.stroke();
    c.fillStyle = gcol(gold); for (const d of [-1, 1]) { c.beginPath(); c.moveTo(x + d * w * .34, y - h); c.lineTo(x + d * (w * .34 + 5), y - h - 7); c.lineTo(x + d * (w * .34 - 2), y - h - 2); c.fill(); }
  };
  tpoly(c, [[-62, -72], [62, -72], [62, -78], [-62, -78]], red, 1);
  roof(-41, -80, 40, 12); roof(41, -80, 40, 12);
  tpoly(c, [[-30, -100], [30, -100], [30, -108], [-30, -108]], red, 1.05);
  tpoly(c, [[-16, -84], [16, -84], [16, -99], [-16, -99]], '#1a2a5a', 1);
  c.strokeStyle = gcol(gold); c.lineWidth = 1.2; c.strokeRect(-16, -99, 32, 15);
  c.fillStyle = gcol(gold, 1.1); c.font = 'bold 11px "Noto Sans TC","PingFang TC",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('龍宮', 0, -91.5);
  roof(0, -110, 70, 16);
  for (const x of [-41, 41]) { const y = -64 + Math.sin(T * 1.5 + x) * 1.5; c.strokeStyle = tc('#3a2a1a'); c.lineWidth = 1; c.beginPath(); c.moveTo(x, -72); c.lineTo(x, y - 6); c.stroke(); glowDot(c, x, y, 16, '#ff7040', .7); c.fillStyle = gcol('#ff5030', 1.1); ell(c, x, y, 5, 6.5); c.fill(); c.fillStyle = gcol(gold); c.fillRect(x - 3, y - 7.5, 6, 2); c.fillRect(x - 3, y + 5.5, 6, 2); }
}

// ---- 星之水晶（長在右下角的大石頭上） ----
function shard(c, x, y, w, h, ang, col, a = .88) {
  c.save(); c.translate(x, y); c.rotate(ang);
  const b = hex(col), bl = [-w / 2, 0], br = [w / 2, 0], tl = [-w / 2, -h * .78], tr = [w / 2, -h * .78], tip = [w * .08, -h], ml = [-w * .1, 0], mt = [-w * .1, -h * .8];
  polyFill(c, [bl, ml, mt, tl], gcol(b, 1.2, a)); polyFill(c, [ml, br, tr, mt], gcol(b, .8, a));
  polyFill(c, [tl, mt, tip], gcol(b, 1.45, a)); polyFill(c, [mt, tr, tip], gcol(b, 1, a));
  c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(...mt); c.lineTo(...ml); c.moveTo(...mt); c.lineTo(...tip); c.stroke();
  c.restore();
}
function scCrystal(c, lv) {
  const r = mulberry(91);
  const S = [[0, 9, 26, .05, '#b48cff'], [-10, 7, 18, -.4, '#9ad8ff'], [10, 7, 16, .42, '#d8a8ff'], [-18, 8, 26, -.25, '#8ae8ff'], [18, 8, 30, .2, '#c090ff'],
    [-28, 7, 20, -.55, '#b0a0ff'], [26, 7, 22, .5, '#9af0ff'], [-6, 10, 40, -.12, '#e0b8ff'], [6, 9, 36, .15, '#a8e0ff']];
  const n = [1, 3, 5, 7, 9][lv - 1], sc = [1, 1.05, 1.35, 1.7, 2.05][lv - 1];
  lpRock(c, r, 0, 6, 16 + lv * 3, SC.rock);
  if (lv >= 3) glowDot(c, 0, -14 * sc, 30 * sc, '#c8a8ff', [0, 0, .35, .45, .6][lv - 1] * (.8 + .2 * Math.sin(T * 2)));
  const order = [...S.slice(0, n)].sort((a, b) => b[2] - a[2]);
  for (const [x, w, h, ang, col] of order) shard(c, x * sc * .8, 2, w * sc * .8, h * sc, ang, col);
  if (lv >= 4) for (let i = 0; i < 4; i++) { const a = T * .8 + i * Math.PI / 2; c.fillStyle = `rgba(255,255,255,${.6 + .4 * Math.sin(T * 3 + i)})`; star4(c, Math.cos(a) * 30, -30 * sc + Math.sin(a) * 10, 4); }
  if (lv === 5) {
    const y = -96 + Math.sin(T * 1.3) * 4, k = Math.cos(T * 1.1);
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(0, y); c.rotate(T * .2);
    for (let i = 0; i < 8; i++) { c.rotate(Math.PI / 4); c.fillStyle = 'rgba(200,170,255,0.12)'; c.beginPath(); c.moveTo(0, 0); c.lineTo(-4, -46); c.lineTo(4, -46); c.fill(); }
    c.restore();
    glowDot(c, 0, y, 34, '#e8d0ff', .8);
    const hw = 11 * Math.max(.25, Math.abs(k));
    polyFill(c, [[0, y - 18], [-hw, y], [0, y + 18]], gcol('#e8d0ff', k > 0 ? 1.2 : .9, .95)); polyFill(c, [[0, y - 18], [hw, y], [0, y + 18]], gcol('#b890ff', k > 0 ? .9 : 1.2, .95));
    for (let i = 0; i < 5; i++) twinkle(c, -34 + i * 17, -60 - (i % 2) * 20, 5, i, '#f0e0ff');
  }
}
// 扇形的貝殼：從鉸鏈 (x,y) 展開，深淺交錯的放射紋
function shellFan(c, x, y, r, a0, a1, cols, sy = 1, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = a0 + (a1 - a0) * i / n, b = a0 + (a1 - a0) * (i + 1) / n, m = (a + b) / 2;
    tpoly(c, [[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r * sy], [x + Math.cos(m) * r * 1.06, y + Math.sin(m) * r * 1.06 * sy], [x + Math.cos(b) * r, y + Math.sin(b) * r * sy]], cols[i % 2]);
  }
}
// 月光貝殼：Lv1 合起來的小貝殼 → Lv5 浮著一顆月之珍珠
function scMoonShell(c, lv) {
  const r = [14, 18, 22, 26, 30][lv - 1], rr = mulberry(57), lid = ['#ffe6f0', '#f4c4da'], bowl = ['#fcd8e6', '#eab0ca'];
  lpRock(c, rr, 0, 6, 14 + lv * 3, SC.rock);
  if (lv >= 4) for (const d of [-1, 1]) shellFan(c, d * r * 1.25, 2, r * .38, -Math.PI + .25, -.25, ['#fff0d8', '#f0d0a8'], 1, 6);
  if (lv === 1) { shellFan(c, 0, 0, r, -Math.PI + .25, -.25, lid); tpoly(c, [[-4, 0], [4, 0], [3, 4], [-3, 4]], '#e0a8c0'); return; }
  const pr = r * .24, py = -r * .22;
  if (lv >= 3) glowDot(c, 0, py, r * (lv >= 4 ? 1.6 : 1.1), '#fff4e0', .45 + .1 * Math.sin(T * 2));
  shellFan(c, 0, -2, r, -Math.PI + .15, -.15, lid, .95);
  c.fillStyle = tc('#fff6fa', 1, .95); ell(c, 0, -3, r * .82, r * .22); c.fill();
  const g = c.createRadialGradient(-pr * .3, py - pr * .3, 0, 0, py, pr); g.addColorStop(0, gcol('#ffffff')); g.addColorStop(1, gcol(lv >= 3 ? '#f8e8ff' : '#f0e6ea'));
  c.fillStyle = g; circle(c, 0, py, pr); c.fill();
  shellFan(c, 0, -3, r, .12, Math.PI - .12, bowl, .42);
  if (lv >= 4) for (let i = 0; i < 3; i++) twinkle(c, -r * .8 + i * r * .8, -r * 1.1 - (i % 2) * 8, 4, i, '#fff4d8');
  if (lv === 5) {
    // 浮在上方的月之珍珠：旁邊一彎新月、一圈柔光
    const y = -r * 1.75 + Math.sin(T * 1.3) * 2, R = 9;
    glowDot(c, 0, y, 34, '#fff4d0', .75);
    const mg = c.createRadialGradient(-4, y - 4, 1, 0, y, R); mg.addColorStop(0, gcol('#ffffff')); mg.addColorStop(1, gcol('#ffe8b8')); c.fillStyle = mg; circle(c, 0, y, R); c.fill();
    c.fillStyle = gcol('#fff0b0', 1, .95); c.beginPath(); c.arc(0, y, R + 7, -Math.PI * .85, Math.PI * .15); c.arc(3, y - 3, R + 4.5, Math.PI * .15, -Math.PI * .85, true); c.fill();
    for (let i = 0; i < 5; i++) { const a = T * .7 + i * 1.26; twinkle(c, Math.cos(a) * 26, y + Math.sin(a) * 10, 3.5, i + 3, '#fffbe8'); }
  }
}
// 彩虹噴泉：Lv1 小石噴泉 → Lv5 三層七彩仙境噴泉
function scFountain(c, lv) {
  const stone = lv >= 3 ? '#eceaf4' : '#b8bcc8', trim = lv >= 5 ? '#ffd870' : lv >= 3 ? '#d8d4e8' : '#9ea4b4';
  const tiers = [[34, 0, 12]]; if (lv >= 3) tiers.push([22, -32, 9]); if (lv >= 5) tiers.push([14, -56, 7]);
  const sc = [.85, 1, 1, 1.05, 1.1][lv - 1]; c.save(); c.scale(sc, sc);
  const topY = tiers[tiers.length - 1][1] - 12, spoutH = [16, 24, 26, 30, 34][lv - 1], wy = topY - spoutH;
  // 中間的柱子
  tpoly(c, [[-11, 0], [11, 0], [7, topY], [-7, topY]], stone, .82);
  // 彩虹（Lv4 起）
  if (lv >= 4) {
    c.save(); c.lineWidth = 3.5;
    ['#ff8ab0', '#ffc070', '#fff080', '#90f0b0', '#80c8ff', '#b890ff'].forEach((col, k) => { c.strokeStyle = gcol(col, 1, .45); c.beginPath(); c.arc(0, topY + 10, (lv === 5 ? 62 : 50) - k * 3.6, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); });
    c.restore();
  }
  for (const [w, y, h] of tiers) {
    // 水池：外壁 + 金邊 + 水面
    tpoly(c, [[-w, y - h], [w, y - h], [w * .8, y], [-w * .8, y]], stone, .95);
    tpoly(c, [[-w * .8, y], [w * .8, y], [w * .7, y - h * .35], [-w * .7, y - h * .35]], stone, .8);
    c.fillStyle = tc(trim); ell(c, 0, y - h, w, h * .32); c.fill();
    c.fillStyle = gcol('#9ee8ff', 1, .85); ell(c, 0, y - h, w * .88, h * .24); c.fill();
    // 從上一層溢出來的水簾
    c.fillStyle = gcol('#c8f4ff', 1, .35); c.fillRect(-w * .9, y - h + 1, 3, h - 2); c.fillRect(w * .9 - 3, y - h + 1, 3, h - 2);
  }
  // 中間往上噴的水柱與四散的水珠
  c.fillStyle = gcol('#d8f8ff', 1, .6); polyFill(c, [[-2.5, topY], [2.5, topY], [1.5, wy], [-1.5, wy]], gcol('#d8f8ff', 1, .6));
  const n = 6 + lv * 2;
  for (let i = 0; i < n; i++) {
    const q = (T * .7 + i / n) % 1, d = i % 2 ? 1 : -1, spread = 10 + (i % 3) * 6 + lv * 3, x = d * q * spread, y = wy + (1 - Math.pow(1 - 2 * q, 2)) * -8 + q * q * (topY - wy + 6);
    c.fillStyle = lv >= 4 ? css(hsl((i * 50 + T * 40) % 360, .8, .85), .9) : gcol('#e8fbff', 1, .9); circle(c, x, y, 1.6); c.fill();
  }
  if (lv === 5) {
    const y = wy - 14 + Math.sin(T * 1.6) * 3; glowDot(c, 0, y, 26, '#fff0c8', .8);
    c.fillStyle = css(hsl((T * 60) % 360, .85, .8)); circle(c, 0, y, 5); c.fill();
    for (let i = 0; i < 5; i++) twinkle(c, -40 + i * 20, -96 - (i % 2) * 16, 4.5, i, '#fff6d0');
  }
  c.restore();
}
const SCENE_DRAW = { castle: scCastle, arch: scArch, ship: scShip, coral: scCoral, starfish: scStarfish, clam: scClam, anemone: scAnemone, crystal: scCrystal, moonshell: scMoonShell, fountain: scFountain };

// 把造景畫到水族箱：layer 0 在海草後面、layer 1 在海草前面
// 造景的動畫很慢，先畫在兩張暫存畫布上、每秒更新約 15 次，每一幀只要貼上去，手機比較不會卡
let selPiece = null, sceneT = -1, sceneFlip = 0;
const SCENE_TOP = 200; // 造景最高大概到這裡（世界座標），上面不用畫
const SCENE_CV = [document.createElement('canvas'), document.createElement('canvas')];
function paintScene(c, layer) {
  for (const p of SCENE) {
    const st = state.scene[p.id]; if (p.layer !== layer || !st.look) continue;
    const { x, y } = scenePos(p), k = sceneK(p);
    FOG = layer ? .03 : .2; c.save(); c.translate(x, y); c.scale(k, k); SCENE_DRAW[p.id](c, st.look); c.restore(); FOG = 0;
  }
}
function drawScene(layer) {
  if (layer === 0 && (T - sceneT > .05 || T < sceneT)) {
    const full = sceneT < 0 || T < sceneT; sceneT = T;
    for (const L of full ? [0, 1] : [sceneFlip ^= 1]) {
      const cv = SCENE_CV[L], hh = Math.ceil((H - SCENE_TOP) * scale);
      if (cv.width !== canvas.width || cv.height !== hh) { cv.width = canvas.width; cv.height = hh; }
      const g = cv.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); g.setTransform(scale, 0, 0, scale, 0, -SCENE_TOP * scale);
      paintScene(g, L);
    }
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(SCENE_CV[layer], 0, Math.round(SCENE_TOP * scale)); ctx.restore();
  const edit = viewMode || (menuOpen && tab === 'decor');
  for (const p of SCENE) {
    if (p.layer !== layer) continue;
    const st = state.scene[p.id], { x, y } = scenePos(p);
    if (!st.look && edit) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ell(ctx, x, y - 4, 32, 10); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = .75; emoji(ctx, p.icon, x, y - 22, 24); ctx.globalAlpha = 1;
    }
    if (menuOpen && tab === 'decor' && selPiece === p.id) {
      const hw = st.look ? p.box[st.look - 1][0] * sceneK(p) : 34;
      ctx.strokeStyle = `rgba(255,201,64,${.6 + .4 * Math.sin(T * 5)})`; ctx.setLineDash([7, 5]); ctx.lineWidth = 2.5; ell(ctx, x, y - 2, hw + 6, 12); ctx.stroke(); ctx.setLineDash([]);
    }
  }
}
// 點水族箱時看看點到哪個造景
function sceneAt(pt) {
  for (const p of [...SCENE].reverse()) {
    const st = state.scene[p.id], { x, y } = scenePos(p), k = st.look ? sceneK(p) : 1, [hw, h] = (st.look ? p.box[st.look - 1] : [34, 34]).map(v => v * k);
    if (Math.abs(pt.x - x) < hw && pt.y > y - h && pt.y < y + 10) return p;
  }
  return null;
}
// 選單裡的小預覽圖（依目前背景的顏色畫，換背景會重畫）
const SCENE_THUMB = {};
function sceneThumb(p, lv) {
  const key = `${p.id}-${lv}-${state.bg}`; if (SCENE_THUMB[key]) return SCENE_THUMB[key];
  const cv = document.createElement('canvas'), W2 = 184, H2 = 110; cv.width = W2; cv.height = H2;
  const c = cv.getContext('2d'), bg = BG[state.bg];
  c.fillStyle = lg(c, 0, H2, bg.top, bg.bot); c.fillRect(0, 0, W2, H2);
  c.fillStyle = lg(c, H2 - 22, H2, bg.sand[0], bg.sand[1]); c.fillRect(0, H2 - 22, W2, 22);
  const [hw, h] = p.box[lv - 1], k = Math.min((W2 - 16) / (hw * 2), (H2 - 20) / (h + 12));
  const saveT = T; T = 1.3; FOG = 0;
  c.translate(W2 / 2, H2 - 10); c.scale(k, k); SCENE_DRAW[p.id](c, lv);
  T = saveT;
  return SCENE_THUMB[key] = cv.toDataURL();
}
const newScene = () => Object.fromEntries(SCENE.map(p => [p.id, { lv: 0, look: 0 }]));
const curIcon = star => star ? '⭐' : '💰';

const CAP_BASE = 10, CAP_STEP = 5, CAP_MAX_LV = 18; // 每級 +5 隻，最多擴充到 100 隻
// 到 50 隻以前維持輕鬆（每級 ×3.2）；50 隻以後每級 ×4.5，配合後期的魚價慢慢擴充
const capCost = lv => lv < 8 ? Math.round(200 * Math.pow(3.2, lv) / 10) * 10 : nice(200 * Math.pow(3.2, 8) * Math.pow(4.5, lv - 8));
// 自動餵食器：Lv.1 每 12 秒一顆 → Lv.5 每 4 秒 → Lv.9 每 1 秒；Lv.5 以後每級價格 ×8
const FEEDER_INT = [0, 12, 10, 8, 6, 4, 3, 2, 1.5, 1];
const FEEDER_MAX = FEEDER_INT.length - 1, feederCost = lv => lv < 5 ? 500 * Math.pow(4, lv) : nice(128000 * Math.pow(8, lv - 4)), feederInterval = lv => FEEDER_INT[lv];
const SNAIL_MAX = 5, snailCost = lv => 1500 * Math.pow(6, lv), snailSpeed = lv => 25 + 30 * lv;
// Lv.4 起有兩隻蝸牛，一隻顧左半邊、一隻顧右半邊
const snailCount = () => state.snailLv >= 4 ? 2 : state.snailLv > 0 ? 1 : 0;
// 新設備（各 3 級）：離線收集網、育嬰室、打氣機、繁殖燈
const EQUIP = {
  net:     { icon: '⏰', name: '離線收集網', costs: [8000, 400000, 20000000], desc: lv => `離開遊戲時，最多累積 ${offlineMaxH(lv)} 小時的收益` },
  nursery: { icon: '🍼', name: '育嬰室',     costs: [3000, 150000, 8000000],  desc: lv => lv ? `新生的小魚一出生就有 ${Math.round(nurseryGrowth(lv) * 100)}% 成長度` : '新生的小魚一出生就先長大一些' },
  pump:    { icon: '🫧', name: '打氣機',     costs: [2000, 80000, 3000000],   desc: lv => lv ? `魚的飽食度下降慢 ${lv * 10}%，水族箱多一串氣泡` : '讓魚比較不容易餓，還會冒出一串氣泡' },
  lamp:    { icon: '💡', name: '繁殖燈',     costs: [20000, 2000000, 200000000], desc: lv => lv ? `繁殖速度再快 ${Math.round(LAMP_BOOST[lv] * 100)}%（最高級的魚約 ${fmtTime(Math.round(21600 / (1 + LAMP_BOOST[lv]) / 60) * 60)} 生一次），水族箱上方亮起粉紅色的燈` : '讓魚更快生小魚（跟造景的繁殖加成疊加）' },
};
const LAMP_BOOST = [0, .15, .3, .5];
const offlineMaxH = (lv = state.netLv) => 2 + 2 * lv;
const nurseryGrowth = (lv = state.nurseryLv) => [0, .2, .35, .5][lv];
const NAMES = ['小橘', '泡泡', '阿福', '圓圓', '小藍', '閃閃', '豆豆', '咕嚕', '皮皮', '點點', '糖糖', '米米', '旺財', '布丁', '湯圓', '麻糬', '小白', '阿金', '飯糰', '雪球', 'Nemo', 'Bubbles', 'Lucky'];

