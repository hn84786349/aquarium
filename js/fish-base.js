// 魚的繪製工具（身體、魚鰭、花紋）（fish-base.js）
// ====== 魚的繪製（低多邊形 low-poly 風格） ======
// 身體切成許多三角面，每一面填單一顏色，靠光線明暗做出立體感；身體預先畫成圖片快取，魚鰭即時繪製會擺動
// 座標：魚頭朝 +x；u 從尾(-1)到頭(+1)、v 從背(-1)到腹(+1)
function ell(c, x, y, rx, ry, rot = 0) { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); }
function circle(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); }
function lg(c, y0, y1, a, b) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
function lg3(c, x0, y0, x1, y1, a, b, d) { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(.5, b); g.addColorStop(1, d); return g; }

const RGB = {};
const hex = h => RGB[h] || (RGB[h] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
const mixc = (a, b, t) => [0, 1, 2].map(i => a[i] + (b[i] - a[i]) * t);
const stops = (cols, t) => { const n = cols.length - 1, k = Math.min(n - 1, Math.floor(clamp(t, 0, 1) * n)); return mixc(hex(cols[k]), hex(cols[k + 1]), clamp(t, 0, 1) * n - k); };
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const bright = (c, k) => c.map(x => clamp(x * k, 0, 255));
function hsl(h, s, l) { const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }; return [f(0), f(8), f(4)]; }
const inEll = (u, v, cu, cv, ru, rv) => ((u - cu) / ru) ** 2 + ((v - cv) / rv) ** 2 < 1;

// 身體外形：取樣貝茲曲線成多邊形，讓輪廓也有稜角
function bodyPoly(L, Hh, o = {}) {
  const n = o.nose ?? .55, tb = o.tail ?? .28, bl = o.belly ?? 1.05, hx = o.hump ?? .15;
  const segs = [
    [[L, 0], [L, -Hh * n], [L * .6, -Hh], [L * hx, -Hh]],
    [[L * hx, -Hh], [-L * .35, -Hh], [-L * .75, -Hh * tb * 1.7], [-L, -Hh * tb]],
    [[-L, Hh * tb], [-L * .75, Hh * tb * 1.7], [-L * .35, Hh * bl], [L * hx, Hh * bl]],
    [[L * hx, Hh * bl], [L * .6, Hh * bl], [L, Hh * n], [L, 0]],
  ];
  const pts = [];
  for (const [p0, p1, p2, p3] of segs) for (const t of [.34, .67, 1]) {
    const m = 1 - t; pts.push([0, 1].map(i => m * m * m * p0[i] + 3 * m * m * t * p1[i] + 3 * m * t * t * p2[i] + t * t * t * p3[i]));
  }
  return pts;
}
// 以光線方向計算每個三角面的亮度（把身體當成橢球）
const LIGHT = (() => { const l = [.35, -.8, .55], n = Math.hypot(...l); return l.map(x => x / n); })();
function facetLight(u, v, jit) {
  const nz = Math.sqrt(Math.max(.08, 1 - u * u * .5 - v * v * .85)), n = [u * .45, v, nz], k = Math.hypot(...n);
  const d = (n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]) / k;
  return .6 + .55 * Math.max(0, d) + jit;
}
const SPR_S = 90, SPRITES = {};
// 身體的畫法（參考 AbyssRium）：1. 柔和漸層底色 → 2. 俐落的花紋 → 3. 少量大面的明暗
function bakeBody(m) {
  const L = m.L * SPR_S, Hh = m.H * SPR_S, pad = 6;
  const cv = document.createElement('canvas'); cv.width = Math.ceil(L * 2 + pad * 2); cv.height = Math.ceil(Hh * 2.3 + pad * 2);
  const c = cv.getContext('2d'), cx = L + pad, cy = Hh * 1.12 + pad; c.translate(cx, cy);
  const poly = bodyPoly(L, Hh, m.shape);
  c.beginPath(); poly.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.save(); c.clip();
  c.fillStyle = lg3(c, 0, -Hh, 0, Hh * 1.05, m.top, m.mid, m.belly); c.fillRect(-L * 1.1, -Hh * 1.3, L * 2.2, Hh * 2.6);
  if (m.paint) m.paint(c, L, Hh);
  // 大面明暗：亮面疊白、暗面疊黑，花紋保持清楚
  const r = mulberry(m.seed || 7), NX = m.nx || 7, NY = m.ny || 4, grid = [];
  for (let j = 0; j <= NY; j++) { grid.push([]); for (let i = 0; i <= NX; i++) {
    const edge = i === 0 || j === 0 || i === NX || j === NY;
    grid[j].push([-L * 1.05 + 2.1 * L * i / NX + (edge ? 0 : (r() - .5) * 1.2 * L / NX), -Hh * 1.2 + 2.4 * Hh * j / NY + (edge ? 0 : (r() - .5) * 1.1 * Hh / NY)]);
  } }
  const tri = (a, b, d) => {
    const u = clamp((a[0] + b[0] + d[0]) / 3 / L, -1, 1), v = clamp((a[1] + b[1] + d[1]) / 3 / Hh, -1.1, 1.1);
    const k = facetLight(u, v, (r() - .5) * .08) - .92;
    c.fillStyle = k > 0 ? `rgba(255,255,255,${Math.min(.3, k * 1.1)})` : `rgba(10,20,40,${Math.min(.3, -k * .75)})`;
    c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.lineTo(...d); c.closePath(); c.fill();
  };
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const a = grid[j][i], b = grid[j][i + 1], d = grid[j + 1][i], e = grid[j + 1][i + 1];
    if ((i + j) % 2) { tri(a, b, e); tri(a, e, d); } else { tri(a, b, d); tri(b, e, d); }
  }
  c.restore();
  if (m.edge) { c.beginPath(); poly.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.strokeStyle = m.edge; c.lineWidth = 2; c.stroke(); }
  return { cv, cx, cy };
}
// ---- 花紋用的小工具（座標：u 尾 -1 → 頭 +1、v 背 -1 → 腹 +1） ----
function polyFill(c, pts, col) { c.fillStyle = col; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }
// 直向條紋，bend 讓條紋往後彎
function band(c, L, Hh, uc, hw, bend, col) {
  const vs = [-1.3, -.65, 0, .65, 1.3], pts = [];
  for (const v of vs) pts.push([(uc - bend * v * v + hw) * L, v * Hh]);
  for (const v of vs.slice().reverse()) pts.push([(uc - bend * v * v - hw) * L, v * Hh]);
  polyFill(c, pts, col);
}
// 鋸齒狀的不規則條紋（雪花小丑魚）
function zigBand(c, L, Hh, uc, hw, amp, col) {
  const vs = [-1.3, -.9, -.5, -.1, .3, .7, 1.1, 1.4], pts = [];
  vs.forEach((v, i) => pts.push([(uc + hw + (i % 2 ? amp : -amp * .4)) * L, v * Hh]));
  vs.slice().reverse().forEach((v, i) => pts.push([(uc - hw + (i % 2 ? -amp : amp * .4)) * L, v * Hh]));
  polyFill(c, pts, col);
}
// 多邊形色塊（低多邊形的斑點）
function blob(c, L, Hh, u, v, ru, rv, col, n = 7, rot = 0) {
  const pts = []; for (let i = 0; i < n; i++) { const a = rot + Math.PI * 2 * i / n; pts.push([(u + Math.cos(a) * ru) * L, (v + Math.sin(a) * rv) * Hh]); }
  polyFill(c, pts, col);
}
function hGrad(c, L, Hh, cols, alpha = 1) {
  const g = c.createLinearGradient(L, 0, -L, 0); cols.forEach((col, i) => g.addColorStop(i / (cols.length - 1), col));
  c.save(); c.globalAlpha = alpha; c.fillStyle = g; c.fillRect(-L * 1.1, -Hh * 1.3, L * 2.2, Hh * 2.6); c.restore();
}
// 魚鰭：從基點展開的三角扇形，每片三角形明暗交錯，看起來像鰭條
function polyFin(c, bx, by, pts, cols, alpha, edge) {
  const n = pts.length - 1;
  for (let i = 0; i < n; i++) {
    const col = bright(stops(cols, n > 1 ? i / (n - 1) : 0), i % 2 ? 1.03 : .95);
    c.fillStyle = css(col, alpha); c.beginPath(); c.moveTo(bx, by); c.lineTo(...pts[i]); c.lineTo(...pts[i + 1]); c.closePath(); c.fill();
  }
  if (edge) { c.strokeStyle = edge; c.lineWidth = 1.4; c.lineJoin = 'round'; c.beginPath(); c.moveTo(bx, by); pts.forEach(p => c.lineTo(...p)); c.closePath(); c.stroke(); }
}
function lpTail(c, x, t, s, w) {
  const len = t.len * s, sp = t.spread * s, v = t.type === 'veil' ? w * len * .7 : 0;
  c.save(); c.translate(x, 0); c.rotate(w * .75);
  let pts;
  if (t.type === 'fork') pts = [[0, -sp * .2], [-len * .55, -sp * .65], [-len, -sp], [-len * .78, -sp * .45], [-len * .58, 0], [-len * .78, sp * .45], [-len, sp], [-len * .55, sp * .65], [0, sp * .2]];
  // 鯨豚的水平尾鰭：從側面看是向後展開的兩片，隨擺動上下拍水
  else if (t.type === 'fluke') pts = [[0, -sp * .14], [-len * .5, -sp * .3], [-len * 1.05, -sp * .9], [-len * .95, -sp * .55], [-len * .72, -sp * .08], [-len * .72, sp * .08], [-len * .95, sp * .55], [-len * 1.05, sp * .9], [-len * .5, sp * .3], [0, sp * .14]];
  else if (t.type === 'round') { pts = [[0, -sp * .2]]; for (let k = 0; k <= 6; k++) { const a = Math.PI / 180 * (260 - 160 * k / 6); pts.push([-len * .5 + len * .55 * Math.cos(a), sp * Math.sin(a)]); } pts.push([0, sp * .2]); }
  else if (t.type === 'veil') pts = [[0, -sp * .2], [-len * .4, -sp * 1.05], [-len * .9, -sp * 1.12 + v], [-len * 1.18, -sp * .55 + v], [-len * 1.28, v * 1.1], [-len * 1.18, sp * .6 + v], [-len * .88, sp * 1.18 + v], [-len * .38, sp * 1.02], [0, sp * .2]];
  else { pts = [[0, -sp * .2]]; for (let k = 0; k <= 6; k++) { const q = k / 6; pts.push([-len * (.88 + .18 * Math.sin(Math.PI * q)), -sp + 2 * sp * q]); } pts.push([0, sp * .2]); }
  polyFin(c, len * .05, 0, pts, t.cols, t.alpha ?? .96, t.edge);
  c.restore();
}
function lpTopFin(c, fin, L, Hh, s, w) {
  const d = fin.dir || -1, x0 = fin.x0 * L, x1 = fin.x1 * L, y = d * Hh * (fin.y ?? .82), h = fin.h * s;
  const tipX = x1 - h * (fin.back ?? .35) + w * h * .5;
  const pts = [[x0, y], [x0 - (x0 - x1) * .25, y + d * h * .7], [x0 - (x0 - x1) * .55, y + d * h * .95], [tipX, y + d * h], [x1 + h * .05, y + d * h * .4], [x1, y]];
  polyFin(c, (x0 + x1) / 2, y - d * h * .1, pts, fin.cols, fin.alpha ?? .96, fin.edge);
}
function lpPectoral(c, fin, L, Hh, s, w, f) {
  const len = fin.len * s;
  c.save(); c.translate(fin.x * L, fin.y * Hh); c.rotate(.45 + Math.sin(T * 7 + (f ? f.phase : 0)) * .28 + w);
  polyFin(c, 0, 0, [[-len * .2, -len * .28], [-len * .6, -len * .3], [-len, -len * .02], [-len * .7, len * .22], [-len * .25, len * .18]], fin.cols, fin.alpha ?? .95, fin.edge);
  c.restore();
}
// 眼睛：AbyssRium 風格的深色小眼睛（小多邊形），加一點反光
function lpEye(c, x, y, r, col) {
  c.fillStyle = col; c.beginPath();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.75)'; circle(c, x + r * .3, y - r * .35, r * .3); c.fill();
}
function drawModel(c, s, w, e, f, m) {
  const L = m.L * s, Hh = m.H * s;
  if (m.under) m.under(c, s, w, f, L, Hh);
  for (const fin of m.fins || []) if (fin.kind !== 'pec') lpTopFin(c, fin, L, Hh, s, w);
  if (m.tail) lpTail(c, -L + s * .02, m.tail, s, w);
  const spr = SPRITES[m.id] || (SPRITES[m.id] = bakeBody(m)), k = s / SPR_S;
  if (m.glow) { c.save(); c.shadowColor = typeof m.glow === 'function' ? m.glow() : m.glow; c.shadowBlur = 16; }
  c.drawImage(spr.cv, -spr.cx * k, -spr.cy * k, spr.cv.width * k, spr.cv.height * k);
  if (m.glow) c.restore();
  for (const fin of m.fins || []) if (fin.kind === 'pec') lpPectoral(c, fin, L, Hh, s, w, f);
  lpEye(c, m.eye[0] * L, m.eye[1] * Hh, m.eye[2] * s * e, m.eye[3]);
  if (m.extra) m.extra(c, s, w, f, L, Hh);
}
const whisker = (c, s, w, L, Hh, col, y0 = .12) => {
  c.strokeStyle = col; c.lineWidth = Math.max(1, s * .03); c.lineCap = 'round';
  c.beginPath(); c.moveTo(L * .96, Hh * y0); c.lineTo(L * 1.08, Hh * (y0 + .25)); c.lineTo(L * 1.06, Hh * (y0 + .5) + w * s * .3); c.stroke();
};
const GALAXY_DOTS = Array.from({ length: 16 }, (_, i) => [Math.cos(i * 2.4) * .75 * ((i % 5) / 5 + .2), Math.sin(i * 3.7) * .6, .05 + (i % 3) * .03]);

