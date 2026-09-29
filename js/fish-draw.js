// 特殊造型的魚與夢幻生物繪製（fish-draw.js）
function drawGuppy(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.guppy); }
function drawNeon(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.neon); }
function drawClown(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.clown); }
function drawAngel(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.angel); }
function drawBetta(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.betta); }
function drawArowana(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.arowana); }
function drawKoi(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.koi); }
function draw_blueclown(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.blueclown); }
function draw_jewel(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.jewel); }
function draw_dottyback(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.dottyback); }
function draw_snowclown(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.snowclown); }
function draw_clowntang(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.clowntang); }
function draw_peppermint(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.peppermint); }
function draw_bluetang(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.bluetang); }
function draw_parrot(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.parrot); }
function draw_grouper(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.grouper); }
function draw_moorish(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.moorish); }
function draw_french(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.french); }
function draw_queen(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.queen); }
function draw_mahi(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.mahi); }
function drawPhoenix(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.phoenix); }
function drawRainbow(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.rainbow); }
function drawGalaxy(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.galaxy); }
function drawMoon(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.moon); }
function blush(c, x, y, r) { c.fillStyle = 'rgba(255,150,170,0.35)'; ell(c, x, y, r, r * .55); c.fill(); }
// 沿著一串點畫出由粗到細的多邊形彩帶，左右兩片深淺不同
function ribbon(c, pts, w0, col, alpha = .9) {
  const n = pts.length - 1, L = [], R = [];
  for (let i = 0; i <= n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = w0 * (1 - i / n * .85);
    L.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); R.push([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]);
  }
  const base = Array.isArray(col) ? col : hex(col);
  for (let i = 0; i < n; i++) {
    polyFill(c, [pts[i], L[i], L[i + 1], pts[i + 1]], css(bright(base, .88), alpha));
    polyFill(c, [pts[i], R[i], R[i + 1], pts[i + 1]], css(bright(base, 1.08), alpha));
  }
}
// ---- 新增的夢幻生物 ----
// 葉形海龍：長吻、彎曲的黃色身體、隨水擺動的綠色葉狀附肢
function drawLeafy(c, s, w, e, f) {
  const sw = k => Math.sin(T * 1.6 + k) * s * .06;
  const body = [[s * .55, -s * .05], [s * .3, -s * .02], [0, s * .08], [-s * .35, s * .12 + sw(0)], [-s * .7, s * .02 + sw(.6)], [-s * 1.0, s * .25 + sw(1.2)], [-s * 1.05, s * .6 + sw(1.8)], [-s * .85, s * .75 + sw(2.4)]];
  const leaf = (x, y, ang, len, col) => {
    c.save(); c.translate(x, y); c.rotate(ang + Math.sin(T * 2 + x) * .25);
    polyFill(c, [[0, 0], [len * .35, -len * .22], [len, -len * .08], [len * .55, len * .1]], css(hex(col), .95));
    polyFill(c, [[0, 0], [len * .55, len * .1], [len, -len * .08]], css(bright(hex(col), .82), .95));
    c.restore();
  };
  const leafs = [[.25, -.1, -2.1, .55], [.05, -.02, -1.6, .45], [-.3, .05, -2.3, .6], [-.55, .02, -1.2, .5], [-.3, .18, 1.9, .5], [-.75, .15, 2.2, .45], [-1.0, .35, -2.7, .4], [-.95, .7, 2.6, .35], [0, .15, 1.4, .4]];
  for (const [x, y, a, l] of leafs) leaf(s * x, s * y, a, s * l, '#62b86a');
  ribbon(c, body, s * .16, '#e6dc4a', 1);
  for (let i = 1; i < body.length - 1; i += 2) { const [x, y] = body[i]; blob(c, 1, 1, x, y, s * .06, s * .1, '#f0a038', 5); }
  polyFill(c, [[s * .45, -s * .12], [s * 1.35, -s * .06], [s * 1.38, s * .0], [s * .45, s * .06]], '#e8d848');
  polyFill(c, [[s * .35, -s * .2], [s * .7, -s * .14], [s * .72, s * .05], [s * .35, s * .1]], '#f0e25a');
  leaf(s * .5, -s * .15, -1.2, s * .3, '#74c878'); leaf(s * 1.0, s * .02, 1.4, s * .2, '#74c878');
  lpEye(c, s * .58, -s * .06, s * .055 * e, '#1a1a08');
}
// 夜光水母：會一縮一放的多邊形傘蓋、飄動的口腕與觸手
// 水母（P 可以換顏色做出不同的水母）
const JELLY0 = { line: 'rgba(255,190,240,0.55)', rib: ['#ff9ad8', '#c88cff'], glow: '#ff8ae0', bell: ['#b07ae8', '#c68cf0', '#e0a0f4', '#f4b8f0', '#ffc8e8', '#f4b8f0', '#e0a0f4', '#c68cf0'], rim: 'rgba(255,210,245,0.75)' };
function drawJelly(c, s, w, e, f, P = JELLY0) {
  const p = 1 + Math.sin(T * 2.4 + (f ? f.phase : 0)) * .08, ph = f ? f.phase : 0;
  c.save();
  c.strokeStyle = P.line; c.lineWidth = Math.max(1, s * .03); c.lineCap = 'round';
  for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * s * .16, s * .15); for (let j = 1; j <= 5; j++) c.lineTo(k * s * .16 + Math.sin(T * 2 + j + k + ph) * s * .08, s * .15 + j * s * .22); c.stroke(); }
  for (const k of [-1, 0, 1]) ribbon(c, [0, 1, 2, 3, 4].map(j => [k * s * .1 + Math.sin(T * 1.5 + j * .8 + k + ph) * s * .1, s * .1 + j * s * .2]), s * .09, k ? P.rib[1] : P.rib[0], .85);
  if (P.petals) for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + .9 * i / 6); c.save(); c.rotate(a + Math.PI / 2); polyFill(c, [[0, -s * .1], [-s * .12, -s * .5 * p], [0, -s * .72 * p], [s * .12, -s * .5 * p]], css(hex(P.petals[i % P.petals.length]), .8)); c.restore(); }
  c.save(); c.shadowColor = P.glow; c.shadowBlur = 18;
  const Q = []; for (let i = 0; i <= 8; i++) { const a = Math.PI + Math.PI * i / 8; Q.push([Math.cos(a) * s * .55 * p, Math.sin(a) * s * .5 / p]); }
  for (let i = 0; i < 8; i++) polyFill(c, [[0, s * .05], Q[i], Q[i + 1]], css(hex(P.bell[i]), .82));
  c.restore();
  polyFill(c, [[-s * .55 * p, 0], [s * .55 * p, 0], [s * .4 * p, s * .12], [-s * .4 * p, s * .12]], P.rim);
  for (let i = 0; i < 4; i++) blob(c, 1, 1, (i - 1.5) * s * .2, -s * .18, s * .06, s * .06, 'rgba(255,255,255,0.45)', 5);
  if (P.core) { const g = c.createRadialGradient(0, -s * .12, 0, 0, -s * .12, s * .28); g.addColorStop(0, P.core); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; circle(c, 0, -s * .12, s * .28); c.fill(); }
  c.restore();
}
// 鬼蝠魟：從上方看的大翅膀，會上下拍動
const MANTA0 = { tail: '#34446a', c: ['#6a7eaa', '#4a5c86', '#5a6d98', '#4a5c86', '#3e4e76', '#34446a', '#56699a', '#3a4a72'], belly: ['rgba(240,244,252,0.9)', 'rgba(225,232,248,0.75)'], eye: '#0a0e18' };
function drawManta(c, s, w, e, f, P = MANTA0) {
  const fl = Math.sin(T * 2 + (f ? f.phase : 0)) * s * .22, C = P.c;
  c.strokeStyle = P.tail; c.lineWidth = Math.max(1, s * .045); c.lineCap = 'round';
  c.beginPath(); c.moveTo(-s * .5, 0); c.lineTo(-s * 1.1, w * s * .5); c.lineTo(-s * 1.7, w * s); c.stroke();
  const nose = [s * .6, 0], back = [-s * .55, 0], fl1 = [s * .2, -s * .45], fr1 = [s * .2, s * .45], lt = [-s * .3, -s * 1.25 + fl], rt = [-s * .3, s * 1.25 - fl], lr = [-s * .5, -s * .32], rr = [-s * .5, s * .32];
  if (P.glow) { c.save(); c.shadowColor = P.glow; c.shadowBlur = 16; polyFill(c, [nose, fl1, lt, lr, back, rr, rt, fr1], P.c[1]); c.restore(); }
  polyFill(c, [nose, fl1, [0, 0]], C[0]); polyFill(c, [nose, fr1, [0, 0]], C[1]);
  polyFill(c, [fl1, lt, [-s * .05, -s * .2]], C[2]); polyFill(c, [[-s * .05, -s * .2], lt, lr], C[3]);
  polyFill(c, [fr1, rt, [-s * .05, s * .2]], C[4]); polyFill(c, [[-s * .05, s * .2], rt, rr], C[5]);
  polyFill(c, [[0, 0], [-s * .05, -s * .2], lr, back], C[6]); polyFill(c, [[0, 0], [-s * .05, s * .2], rr, back], C[7]);
  polyFill(c, [[s * .12, -s * .38], [-s * .2, -s * .78 + fl * .5], [-s * .15, -s * .32]], P.belly[0]);
  polyFill(c, [[s * .12, s * .38], [-s * .2, s * .78 - fl * .5], [-s * .15, s * .32]], P.belly[1]);
  if (P.stars) GALAXY_DOTS.forEach(([x, y, r], i) => { c.fillStyle = `rgba(255,255,255,${.4 + .6 * Math.sin(T * 3 + i)})`; circle(c, -s * .15 + x * s * .5, y * s * 1.4 * (i % 2 ? 1 : -1) * .8, r * s * .5 + .6); c.fill(); });
  for (const d of [-1, 1]) polyFill(c, [[s * .55, d * s * .08], [s * .85, d * s * .16], [s * .8, d * s * .28], [s * .5, d * s * .22]], P.tail);
  lpEye(c, s * .45, -s * .22, s * .05 * e, P.eye);
}
// 撿寶蝸牛：用程式畫（不用表情符號，各家手機的蝸牛圖案朝向不同，會變成倒退走）
function drawSnail(c, x, y, s, dir, moving) {
  const k = moving ? Math.sin(T * 7) * .08 : 0;
  c.save(); c.translate(x, y); c.scale(dir, 1);
  c.fillStyle = 'rgba(0,0,0,0.18)'; ell(c, 0, s * .45, s * 1.3, s * .18); c.fill();
  // 身體（會伸縮）與觸角
  polyFill(c, [[-s * 1.15, s * .4], [s * (1.15 + k), s * .4], [s * (1.3 + k), s * .08], [s * (1.05 + k), -s * .22], [s * .55, -s * .1], [-s * .9, s * .12]], '#eccb9f');
  polyFill(c, [[-s * 1.15, s * .4], [s * (1.15 + k), s * .4], [s * .9, s * .22], [-s * .95, s * .28]], '#c9a07a');
  c.strokeStyle = '#dcb88c'; c.lineWidth = s * .13; c.lineCap = 'round';
  const wig = Math.sin(T * 3) * s * .06;
  c.beginPath(); c.moveTo(s * (1.05 + k), -s * .12); c.lineTo(s * (1.35 + k) + wig, -s * .8);
  c.moveTo(s * (.85 + k), -s * .1); c.lineTo(s * (.98 + k) - wig, -s * .72); c.stroke();
  c.fillStyle = '#2a1a10'; circle(c, s * (1.35 + k) + wig, -s * .82, s * .12); c.fill(); circle(c, s * (.98 + k) - wig, -s * .74, s * .1); c.fill();
  // 多邊形殼＋螺旋紋
  const cx = -s * .2, cy = -s * .42, R = s * .82, cols = ['#d9793a', '#b95a26', '#e8934a', '#c86a30', '#f0a458', '#b95a26', '#dd8240', '#c86a30'];
  for (let i = 0; i < 8; i++) { const a0 = i * Math.PI / 4, a1 = a0 + Math.PI / 4; polyFill(c, [[cx, cy], [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R]], cols[i]); }
  c.strokeStyle = '#ffd89a'; c.lineWidth = Math.max(1.2, s * .1); c.lineJoin = 'round'; c.beginPath();
  for (let i = 0; i <= 20; i++) { const a = i * .55, r = R * (.85 - i * .038); c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  c.stroke();
  c.restore();
}
function drawBeluga(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.beluga); }

// 水晶魚：本身就是切面造型
function drawCrystal(c, s, w, e, f) {
  c.save(); c.shadowColor = '#7ff'; c.shadowBlur = 18;
  lpTail(c, -s * .68, { type: 'fan', len: .7, spread: .5, cols: ['#aaffff', '#c8aaff'], alpha: .55 }, s, w);
  const P = [[s, 0], [s * .45, -s * .42], [s * .25, -s * .58], [-s * .3, -s * .45], [-s * .72, -s * .25], [-s * .72, s * .25], [-s * .3, s * .45], [s * .25, s * .58], [s * .45, s * .42]], C = [-s * .1, 0];
  const cols = ['#b4f0ff', '#e2fbff', '#8cdcff', '#f0d8ff', '#a8e8ff', '#d8c8ff', '#c8f4ff', '#9ad8ff', '#e8f8ff'];
  P.forEach((p, i) => { const q = P[(i + 1) % P.length]; c.fillStyle = css(hex(cols[i]), .72); c.beginPath(); c.moveTo(...C); c.lineTo(...p); c.lineTo(...q); c.closePath(); c.fill(); });
  c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 1.4; c.beginPath(); P.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath(); c.stroke();
  c.restore();
  c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 1; c.beginPath(); P.forEach(p => { c.moveTo(...C); c.lineTo(...p); }); c.stroke();
  const hg = c.createRadialGradient(-s * .1, s * .1, 0, -s * .1, s * .1, s * .26); hg.addColorStop(0, 'rgba(255,140,210,0.9)'); hg.addColorStop(1, 'rgba(255,140,210,0)');
  c.fillStyle = hg; circle(c, -s * .1, s * .1, s * .26); c.fill();
  const k = (Math.sin(T * 4) + 1) / 2 * s * .18 + s * .05;
  c.fillStyle = '#fff'; c.beginPath(); c.moveTo(s * .05, -s * .3 - k); c.lineTo(s * .08, -s * .33); c.lineTo(s * .05 + k, -s * .3); c.lineTo(s * .08, -s * .27); c.lineTo(s * .05, -s * .3 + k); c.lineTo(s * .02, -s * .27); c.lineTo(s * .05 - k, -s * .3); c.lineTo(s * .02, -s * .33); c.fill();
  lpEye(c, s * .62, -s * .1, s * .07 * e, '#0a2a5a');
}
// 龍：由多邊形節點組成的身體（P 換顏色可以做出不同的龍）
const DRAGON0 = { body: ['#1b8a5a', '#34c080', '#9af0c4'], gold: '#ffd24a', tail: ['#ffd24a', '#ffa028'], whisker: 'rgba(255,230,150,0.95)', belly: 'rgba(255,240,190,0.75)',
  head: ['#9af0c4', '#b8ffd8', '#6ee0a4', '#34c080', '#1b8a5a', '#2aa870', '#58d496'], eye: '#062a18' };
function drawDragon(c, s, w, e, f, P = DRAGON0) {
  const n = 20, pts = [];
  for (let i = 0; i < n; i++) { const u = i / (n - 1); pts.push([s * .8 - u * s * 2.5, Math.sin(T * 4 - u * 5) * s * .28 * u, s * (.3 - u * .19)]); }
  if (P.aura) glowDot(c, -s * .3, 0, s * 1.9, P.aura, .35 + .1 * Math.sin(T * 2));
  const [tx, ty] = pts[n - 1];
  c.save(); c.translate(tx, ty); lpTail(c, 0, { type: 'fan', len: .5, spread: .38, cols: P.tail }, s, w); c.restore();
  c.fillStyle = P.gold;
  for (let i = 3; i < n - 2; i += 3) { const [x, y, r] = pts[i]; c.beginPath(); c.moveTo(x - r * .7, y - r * .7); c.lineTo(x - r * .3, y - r * (P.spike || 1.7)); c.lineTo(x + r * .6, y - r * .75); c.fill(); }
  if (P.mane) for (let i = 1; i < n - 4; i += 2) { const [x, y, r] = pts[i]; c.fillStyle = css(hex(P.mane[i % P.mane.length]), .8); c.beginPath(); c.moveTo(x, y - r * .6); c.lineTo(x - r * 1.4, y - r * (2.2 + Math.sin(T * 3 + i) * .4)); c.lineTo(x - r * .9, y - r * .5); c.fill(); }
  const hexa = (x, y, r) => { const q = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; q.push([x + r * Math.cos(a), y + r * Math.sin(a)]); } return q; };
  for (let i = n - 1; i >= 0; i--) {
    const [x, y, r] = pts[i], q = hexa(x, y, r * 1.08), hc = P.rainbow !== undefined ? hsl((P.rainbow + i * 18) % 360, .8, .68) : null;
    [[hc ? css(bright(hc, .75)) : P.body[0], 0, 2], [hc ? css(hc) : P.body[1], 2, 4], [hc ? css(bright(hc, 1.3)) : P.body[2], 4, 6]].forEach(([col, a, b]) => {
      c.fillStyle = col; c.beginPath(); c.moveTo(x, y); for (let k = a; k <= b; k++) c.lineTo(...q[k % 6]); c.closePath(); c.fill();
    });
    c.fillStyle = P.belly; c.beginPath(); c.moveTo(...q[0]); c.lineTo(...q[1]); c.lineTo(...q[2]); c.lineTo(x, y + r * .3); c.closePath(); c.fill();
  }
  c.strokeStyle = P.gold; c.lineWidth = s * .07; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(s * .72, -s * .2); c.lineTo(s * .52, -s * .45); c.lineTo(s * .4, -s * .6); c.moveTo(s * .62, -s * .22); c.lineTo(s * .44, -s * .38); c.lineTo(s * .3, -s * .48); c.stroke();
  c.lineWidth = s * .03; c.strokeStyle = P.whisker;
  c.beginPath(); c.moveTo(s * 1.1, s * .08); c.lineTo(s * 1.3, s * .3 + w * s * .5); c.lineTo(s * 1.45, s * .6 + w * s); c.moveTo(s * 1.1, 0); c.lineTo(s * 1.32, s * .05 - w * s * .5); c.lineTo(s * 1.55, s * .25 - w * s); c.stroke();
  const H = [[s * 1.2, s * .02], [s * 1.05, -s * .22], [s * .75, -s * .28], [s * .5, -s * .1], [s * .55, s * .2], [s * .85, s * .27], [s * 1.12, s * .15]], HC = [s * .85, 0];
  H.forEach((p, i) => { const q = H[(i + 1) % H.length]; c.fillStyle = P.head[i]; c.beginPath(); c.moveTo(...HC); c.lineTo(...p); c.lineTo(...q); c.closePath(); c.fill(); });
  lpEye(c, s * .95, -s * .08, s * .065 * e, P.eye);
  // 龍珠：在嘴前面發光
  if (P.pearl) { const px = s * 1.5, py = s * .15 + Math.sin(T * 2) * s * .05; glowDot(c, px, py, s * .45, P.pearl, .8); const g = c.createRadialGradient(px - s * .04, py - s * .05, 0, px, py, s * .15); g.addColorStop(0, '#ffffff'); g.addColorStop(1, P.pearl); c.fillStyle = g; circle(c, px, py, s * .14); c.fill(); }
}

// 四角星形的閃光
function star4(c, x, y, r) {
  c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r * .28, y - r * .28); c.lineTo(x + r, y); c.lineTo(x + r * .28, y + r * .28);
  c.lineTo(x, y + r); c.lineTo(x - r * .28, y + r * .28); c.lineTo(x - r, y); c.lineTo(x - r * .28, y - r * .28); c.closePath(); c.fill();
}
// 沿著一串點、依每一點的寬度畫出管狀身體（左右兩片深淺不同）
function tube(c, pts, ws, col, alpha = 1) {
  const n = pts.length - 1, L = [], R = [], base = Array.isArray(col) ? col : hex(col);
  for (let i = 0; i <= n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = ws[i];
    L.push([pts[i][0] - dy / d * w, pts[i][1] + dx / d * w]); R.push([pts[i][0] + dy / d * w, pts[i][1] - dx / d * w]);
  }
  for (let i = 0; i < n; i++) {
    polyFill(c, [pts[i], L[i], L[i + 1], pts[i + 1]], css(bright(base, .86), alpha));
    polyFill(c, [pts[i], R[i], R[i + 1], pts[i + 1]], css(bright(base, 1.1), alpha));
  }
  return { L, R };
}
// 海馬：直立的身體、捲起來的尾巴、長長的嘴和頭冠
const HORSE0 = { body: '#f4a634', line: 'rgba(160,80,10,0.45)', belly: 'rgba(255,230,170,0.85)', fin: ['#ffe08a', '#ffc860'], crown: '#ffd070', eye: '#1a0e04',
  head: ['#f0a030', '#ffc050', '#ffd070', '#f8b040', '#e89020', '#f09a28', '#e08818', '#ea9624', '#f4a634'] };
function drawSeahorse(c, s, w, e, f, P = HORSE0) {
  const ph = f ? f.phase : 0, bob = Math.sin(T * 2 + ph) * .06;
  c.save(); c.rotate(bob);
  // 背鰭（快速拍動的小扇子）
  const fl = Math.sin(T * 9 + ph) * .22;
  if (P.aura) glowDot(c, s * .1, 0, s * 1.2, P.aura, .4);
  // 天馬的羽毛翅膀
  if (P.wings) for (const k of [0, 1]) {
    const flap = Math.sin(T * 4 + ph + k) * .35;
    c.save(); c.translate(-s * .02, -s * .12); c.rotate(-2.3 + flap - k * .35);
    for (let i = 0; i < 6; i++) { const len = s * (1.05 - i * .12), a = i * .22; polyFill(c, [[0, 0], [Math.cos(a) * len, Math.sin(a) * len - s * .08], [Math.cos(a + .2) * len * .9, Math.sin(a + .2) * len * .9]], css(hex(P.wings[i % P.wings.length]), k ? .75 : .92)); }
    c.restore();
  }
  c.save(); c.translate(-s * .02, s * .1); c.rotate(-.3 + fl);
  polyFin(c, 0, 0, [[0, -s * .12], [-s * .22, -s * .1], [-s * .26, s * .02], [-s * .2, s * .12], [0, s * .1]], P.fin, .8);
  c.restore();
  const spine = [[s * .14, -s * .42], [s * .06, -s * .2], [s * .1, s * .04], [s * .06, s * .28], [-s * .04, s * .48], [-s * .1, s * .64], [-s * .06, s * .8], [s * .06, s * .86], [s * .15, s * .8], [s * .14, s * .7], [s * .06, s * .68]];
  const ws = [s * .12, s * .15, s * .18, s * .15, s * .11, s * .08, s * .06, s * .05, s * .04, s * .03, s * .02];
  const { L, R } = tube(c, spine, ws, P.body);
  c.strokeStyle = P.line; c.lineWidth = Math.max(1, s * .02);
  for (let i = 1; i < spine.length - 1; i++) { c.beginPath(); c.moveTo(...L[i]); c.lineTo(...R[i]); c.stroke(); }
  // 肚子比較淺
  polyFill(c, [[s * .2, -s * .18], [s * .26, s * .05], [s * .2, s * .28], [s * .12, s * .3], [s * .16, s * .05], [s * .12, -s * .16]], P.belly);
  // 頭：往前伸的長嘴
  const HD = [[s * .02, -s * .5], [s * .1, -s * .66], [s * .24, -s * .66], [s * .34, -s * .56], [s * .62, -s * .54], [s * .64, -s * .46], [s * .32, -s * .44], [s * .22, -s * .34], [s * .06, -s * .36]], HC = [s * .2, -s * .5];
  HD.forEach((p, i) => { const q = HD[(i + 1) % HD.length]; lpTri(c, HC, p, q, P.head[i]); });
  // 頭冠
  c.fillStyle = P.crown;
  for (let k = 0; k < 3; k++) { const x = s * (.08 + k * .06); c.beginPath(); c.moveTo(x, -s * .63); c.lineTo(x + s * .02, -s * (.76 - k * .02)); c.lineTo(x + s * .05, -s * .64); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,0.7)'; for (const [x, y] of [[.1, -.1], [.02, .15], [-.02, .4], [.16, -.3]]) { circle(c, x * s, y * s, s * .025); c.fill(); }
  lpEye(c, s * .24, -s * .54, s * .06 * e, P.eye);
  blush(c, s * .3, -s * .45, s * .05);
  c.restore();
}
// ---- 更高級的夢幻生物（用現有的造型換成更夢幻的配色，再加上光暈與星光） ----
function sparkles(c, s, f, col, n = 5) {
  const ph = f ? f.phase : 0;
  for (let i = 0; i < n; i++) {
    const k = Math.max(0, Math.sin(T * 3 + i * 1.7 + ph)); if (k < .1) continue;
    const a = T * .9 + i * 2.4 + ph; c.fillStyle = css(hex(col), k); star4(c, Math.cos(a) * s * 1.1, Math.sin(a * 1.3) * s * .8, s * .07 * (.5 + k));
  }
}
const PEGASUS = { body: '#f4eefc', line: 'rgba(170,140,220,0.4)', belly: 'rgba(255,240,250,0.9)', fin: ['#ffe8a0', '#ffc8f0'], crown: '#ffd860', eye: '#302050',
  head: ['#fff8ff', '#f4e8ff', '#ffffff', '#ece0fa', '#e2d4f6', '#f0e6fc', '#dccbf2', '#e8dcf8', '#f4eefc'], wings: ['#ffffff', '#fff0fa', '#e8f4ff', '#fff6d8', '#f4e8ff'], aura: '#fff0c0' };
function drawPegasus(c, s, w, e, f) { drawSeahorse(c, s, w, e, f, PEGASUS); sparkles(c, s, f, '#fff6c0'); }
const LOTUS = { line: 'rgba(255,220,160,0.6)', rib: ['#ffd27a', '#ffb0d0'], glow: '#ffcf70', bell: ['#ff9ac8', '#ffb0d4', '#ffc8dc', '#ffe0b0', '#fff0c8', '#ffe0b0', '#ffc8dc', '#ffb0d4'],
  rim: 'rgba(255,240,200,0.8)', petals: ['#ffb8d8', '#ffd0e4', '#ffe4a8'], core: 'rgba(255,230,140,0.9)' };
function drawLotusJelly(c, s, w, e, f) { drawJelly(c, s, w, e, f, LOTUS); sparkles(c, s, f, '#ffe8a0'); }
const STARMANTA = { tail: '#2a1a5a', c: ['#5a3ab8', '#3a2490', '#4a30a8', '#3a2490', '#2e1c78', '#241664', '#4a34a8', '#2e1e80'], belly: ['rgba(140,220,255,0.85)', 'rgba(200,150,255,0.75)'], eye: '#e8f0ff', stars: true, glow: '#7ae0ff' };
function drawStarManta(c, s, w, e, f) { drawManta(c, s, w, e, f, STARMANTA); sparkles(c, s, f, '#bff4ff', 6); }
const ICEDRAGON = { body: ['#3a78c8', '#7ab8f0', '#e0f4ff'], gold: '#bff4ff', tail: ['#e0f8ff', '#9ad8ff'], whisker: 'rgba(220,250,255,0.95)', belly: 'rgba(255,255,255,0.8)',
  head: ['#e0f4ff', '#ffffff', '#b8e0ff', '#7ab8f0', '#3a78c8', '#5a98e0', '#9ad0f8'], eye: '#0a2050', spike: 2.4, mane: ['#9af8e0', '#b8a8ff', '#ffffff'], aura: '#aef0ff' };
function drawIceDragon(c, s, w, e, f) { drawDragon(c, s, w, e, f, ICEDRAGON); sparkles(c, s, f, '#e8fbff', 6); }
function drawRainbowWhale(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.rainbowwhale); }
const DRAGONKING = { body: ['#c8781a', '#f0b030', '#fff0a0'], gold: '#ff5a3a', tail: ['#ffe070', '#ff7a3a'], whisker: 'rgba(255,240,180,0.95)', belly: 'rgba(255,250,220,0.85)',
  head: ['#fff0a0', '#ffffc8', '#ffd860', '#f0b030', '#c8781a', '#e0a028', '#f8c848'], eye: '#3a0a00', spike: 2.2, mane: ['#ff5a3a', '#ff8a4a', '#ffd040'], aura: '#ffd070', pearl: '#bff0ff' };
function drawDragonKing(c, s, w, e, f) { drawDragon(c, s, w, e, f, DRAGONKING); sparkles(c, s, f, '#fff4b0', 7); }
// ---- 新增的五種夢幻魚（依序解鎖，越後面越華麗） ----
function drawSkyKoi(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.skykoi); }
// 七彩琉璃水母：傘蓋顏色不停流轉（色相取 10 度一階，顏色快取才不會無限增加）
const hexOf = a => '#' + a.map(x => clamp(x | 0, 0, 255).toString(16).padStart(2, '0')).join('');
function drawPrismJelly(c, s, w, e, f) {
  const h0 = Math.round((T * 40 + (f ? f.phase * 60 : 0)) / 10) * 10, H = k => (h0 + k) % 360;
  halo(c, 0, -s * .1, s * 1.6, '#ffd8ff', .45);
  drawJelly(c, s, w, e, f, {
    line: 'rgba(255,255,255,0.55)', rib: [hexOf(hsl(H(0), .9, .75)), hexOf(hsl(H(180), .9, .75))], glow: hexOf(hsl(H(90), .9, .7)),
    bell: [0, 45, 90, 135, 180, 225, 270, 315].map(k => hexOf(hsl(H(k), .85, .78))), rim: 'rgba(255,255,255,0.8)',
    petals: [hexOf(hsl(H(30), .9, .82)), hexOf(hsl(H(150), .9, .82)), hexOf(hsl(H(270), .9, .82))], core: 'rgba(255,255,255,0.95)',
  });
  for (let i = 0; i < 8; i++) { const a = Math.PI + Math.PI * (i + .5) / 8, k = .5 + .5 * Math.sin(T * 4 + i); c.fillStyle = css(hsl(H(i * 45), .9, .85), .6 + .4 * k); star4(c, Math.cos(a) * s * .62, Math.sin(a) * s * .56, s * .06 * (.6 + k * .6)); }
  sparkles(c, s, f, '#ffffff', 8);
}
// 獨角夢幻天馬：彩虹鬃毛、彩虹翅膀、金色螺旋獨角
const UNICORN = { body: '#fdf6ff', line: 'rgba(200,160,230,0.4)', belly: 'rgba(255,245,252,0.9)', fin: ['#ffd8f0', '#c8e8ff'], crown: '#ffe890', eye: '#402060',
  head: ['#fffaff', '#f8eeff', '#ffffff', '#f2e6fc', '#eadcf8', '#f6ecfe', '#e6d6f6', '#f0e4fa', '#fdf6ff'], wings: ['#ffb8d8', '#ffe0a8', '#fff6b0', '#b8f0d0', '#b8d8ff', '#dcc0ff'], aura: '#ffd8f8' };
function drawUnicorn(c, s, w, e, f) {
  const ph = f ? f.phase : 0, rot = Math.sin(T * 2 + ph) * .06, h = T * 30;
  halo(c, 0, 0, s * 1.7, '#fff0ff', .4);
  c.save(); c.rotate(rot);
  for (let k = 0; k < 4; k++) ribbon(c, [[s * .06, -s * .62], [-s * .1, -s * .52], [-s * .2, -s * .34], [-s * .28, -s * .12], [-s * .32, s * .1]].map(([x, y], j) => [x - k * s * .03, y + Math.sin(T * 2.5 + j + k + ph) * s * .03 * j]), s * .06, hsl(Math.round((h + k * 70) / 10) * 10 % 360, .85, .75), .9);
  c.restore();
  drawSeahorse(c, s, w, e, f, UNICORN);
  c.save(); c.rotate(rot);
  const x0 = s * .14, y0 = -s * .64, tx = s * .34, ty = -s * 1.06;
  c.save(); c.shadowColor = '#fff0a0'; c.shadowBlur = 12; polyFill(c, [[x0 - s * .05, y0], [tx, ty], [x0 + s * .05, y0 + s * .02]], '#ffe89a'); c.restore();
  c.strokeStyle = 'rgba(210,160,70,0.9)'; c.lineWidth = 1.2;
  for (let k = 1; k < 6; k++) { const t = k / 6, x = x0 + (tx - x0) * t, y = y0 + (ty - y0) * t, hw = s * .045 * (1 - t); c.beginPath(); c.moveTo(x - hw, y + hw * .3); c.lineTo(x + hw, y - hw * .6); c.stroke(); }
  const tw = (Math.sin(T * 3 + ph) + 1) / 2; c.fillStyle = `rgba(255,255,225,${.6 + .4 * tw})`; star4(c, tx, ty, s * (.08 + .07 * tw));
  c.restore();
  sparkles(c, s, f, '#ffe8fa', 7);
}
// 星雲魔鬼魟：紫紅星雲翅膀，翼尖拖出兩道極光
const NEBULA = { tail: '#3a1a80', c: ['#8a3ad8', '#5a1aa8', '#b04ae0', '#6a2ab8', '#3a1a90', '#2a1070', '#c060e8', '#4a2098'], belly: ['rgba(255,170,240,0.85)', 'rgba(140,230,255,0.8)'], eye: '#fff0ff', stars: true, glow: '#ff8af0' };
function drawNebulaManta(c, s, w, e, f) {
  const ph = f ? f.phase : 0, fl = Math.sin(T * 2 + ph) * s * .22;
  halo(c, -s * .2, 0, s * 2, '#c890ff', .45);
  for (const d of [-1, 1]) ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .3 - s * .3 * j, d * (s * 1.2 - fl) * (1 - j * .13) + Math.sin(T * 2.2 + j * .9 + d + ph) * s * .2 * j / 5]), s * .16, hsl(Math.round((250 + Math.sin(T * .5 + d * 1.5) * 70) / 10) * 10, .9, .78), .75);
  drawManta(c, s, w, e, f, NEBULA);
  sparkles(c, s, f, '#ffd8ff', 8);
}
// 七彩神龍：每一節身體都是不同的顏色，整條龍的彩虹會緩緩流動
const RAINBOWDRAGON = { body: ['#c8a0ff', '#e8d0ff', '#ffffff'], gold: '#fff4c0', tail: ['#ffb0e0', '#b0e0ff'], whisker: 'rgba(255,255,255,0.95)', belly: 'rgba(255,255,255,0.7)',
  head: ['#fff8ff', '#ffffff', '#ffe8f8', '#f0e0ff', '#e0d0ff', '#e8f0ff', '#fff0f8'], eye: '#301050', spike: 2.5, mane: ['#ff9ac8', '#ffd080', '#fff0a0', '#a0f0c0', '#a0d0ff', '#c8a0ff'], aura: '#ffe0ff', pearl: '#fff0a8' };
function drawRainbowDragon(c, s, w, e, f) {
  drawDragon(c, s, w, e, f, Object.assign({}, RAINBOWDRAGON, { rainbow: Math.round((T * 40 + (f ? f.phase * 40 : 0)) / 10) * 10 }));
  sparkles(c, s, f, '#ffffff', 8);
}

// 海龜：多邊形龜殼、左右划動的鰭狀腳
function drawTurtle(c, s, w, e, f) {
  const fl = Math.sin(T * 2.2 + (f ? f.phase : 0));
  const flip = (x, y, len, wid, ang, col) => {
    c.save(); c.translate(x, y); c.rotate(ang);
    polyFill(c, [[0, -wid * .5], [-len * .5, -wid * .6], [-len, 0], [-len * .45, wid * .4], [0, wid * .5]], col);
    polyFill(c, [[0, 0], [-len, 0], [-len * .45, wid * .4], [0, wid * .5]], css(bright(hex(col), .85)));
    c.restore();
  };
  // 遠側的鰭（顏色較深）
  flip(-s * .45, s * .1, s * .32, s * .16, 2.6 + fl * .25, '#4e7040');
  flip(s * .3, s * .08, s * .55, s * .22, 2.2 - fl * .45, '#4e7040');
  // 頭
  const HD = [[s * .58, -s * .1], [s * .8, -s * .16], [s * .98, -s * .08], [s * 1.0, s * .06], [s * .82, s * .12], [s * .6, s * .1]];
  polyFill(c, HD, '#8ab06a'); polyFill(c, [[s * .6, s * .02], [s * 1.0, s * .02], [s * .82, s * .12], [s * .6, s * .1]], '#6e9452');
  c.fillStyle = 'rgba(60,90,40,0.5)'; for (const [x, y] of [[.72, -.1], [.82, -.04], [.7, 0]]) { circle(c, x * s, y * s, s * .025); c.fill(); }
  // 龜殼：外框 + 中間一排六角形紋
  const SH = [[-s * .72, s * .06], [-s * .6, -s * .24], [-s * .3, -s * .42], [s * .1, -s * .46], [s * .45, -s * .32], [s * .64, -s * .06], [s * .6, s * .12], [-s * .6, s * .14]], SC0 = [0, -s * .12];
  const sc = ['#7a5a2a', '#9a7236', '#b08440', '#a07a38', '#8a6630', '#6e5024', '#5e4420', '#6a4c22'];
  SH.forEach((p, i) => { const q = SH[(i + 1) % SH.length]; lpTri(c, SC0, p, q, sc[i]); });
  polyFill(c, [[-s * .66, s * .1], [s * .62, s * .08], [s * .56, s * .18], [-s * .58, s * .2]], '#e8d49a');
  const hexa = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * .75); } c.closePath(); c.fill(); };
  for (const [x, y, r] of [[-.36, -.14, .14], [0, -.22, .16], [.34, -.14, .13]]) { hexa(x * s, y * s, r * s, 'rgba(60,40,15,0.35)'); hexa(x * s, y * s, r * s * .78, 'rgba(210,170,90,0.5)'); }
  // 近側的鰭
  flip(-s * .4, s * .16, s * .32, s * .16, 2.3 - fl * .25, '#6e9452');
  flip(s * .36, s * .16, s * .62, s * .24, 1.9 + fl * .45, '#7aa05c');
  lpEye(c, s * .84, -s * .04, s * .05 * e, '#10180a');
  blush(c, s * .88, s * .05, s * .04);
}
// 皇帶魚：長長的銀色身體像彩帶一樣擺動，紅色背鰭一路延伸，頭上有紅色冠羽
function drawOarfish(c, s, w, e, f) {
  const ph = f ? f.phase : 0, n = 16, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push([s * .9 - u * s * 3.4, Math.sin(T * 2.5 - u * 6 + ph) * s * .22 * (.15 + u)]); }
  for (let i = 1; i < n; i++) {
    const [x, y] = pts[i], [x2, y2] = pts[i + 1], k = 1 - i / n * .6;
    polyFill(c, [[x, y - s * .09 * k], [x2, y2 - s * .09 * k], [x - s * .06, y - s * .26 * k]], i % 2 ? 'rgba(255,60,80,0.9)' : 'rgba(255,120,100,0.9)');
  }
  const ws = pts.map((_, i) => s * (.15 - .12 * i / n));
  const { L, R } = tube(c, pts, ws, '#e4eaf2');
  c.strokeStyle = 'rgba(120,150,200,0.45)'; c.lineWidth = Math.max(1, s * .02);
  c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y + s * .03) : c.moveTo(x, y + s * .03)); c.stroke();
  for (let i = 2; i < n; i += 2) { c.fillStyle = `rgba(255,255,255,${.4 + .4 * Math.sin(T * 3 + i)})`; star4(c, pts[i][0], pts[i][1] - s * .04, s * .05); }
  // 頭與冠羽
  const [hx, hy] = pts[0];
  polyFill(c, [[hx - s * .1, hy - s * .15], [hx + s * .25, hy - s * .08], [hx + s * .3, hy + s * .04], [hx - s * .1, hy + s * .15]], '#f0f4fa');
  c.lineCap = 'round';
  for (let k = 0; k < 4; k++) {
    const sw = Math.sin(T * 3 + k + ph) * s * .1;
    c.strokeStyle = k % 2 ? 'rgba(255,90,100,0.95)' : 'rgba(255,50,70,0.95)'; c.lineWidth = Math.max(1.5, s * (.05 - k * .008));
    c.beginPath(); c.moveTo(hx + s * .05 - k * s * .05, hy - s * .12); c.quadraticCurveTo(hx - s * (.1 + k * .1), hy - s * (.6 + k * .05) + sw, hx - s * (.45 + k * .12), hy - s * (.5 - k * .05) + sw * 1.4); c.stroke();
  }
  lpEye(c, hx + s * .14, hy - s * .03, s * .055 * e, '#1a1a30');
}
// 海天使：透明的身體、拍動的小翅膀、裡面有一顆發光的橘紅色心
function drawSeaAngel(c, s, w, e, f) {
  const ph = f ? f.phase : 0, fl = Math.sin(T * 5 + ph);
  c.save(); c.shadowColor = '#bfe8ff'; c.shadowBlur = 16;
  for (const d of [-1, 1]) {
    const tip = d * (s * .55 + fl * s * .2 * d);
    polyFill(c, [[s * .28, d * s * .05], [s * .2, tip * .7], [s * .02, tip], [-s * .1, tip * .8], [s * .05, d * s * .08]], 'rgba(205,235,255,0.6)');
  }
  const B = [[s * .62, 0], [s * .5, -s * .2], [s * .25, -s * .24], [-s * .1, -s * .18], [-s * .45, -s * .08], [-s * .62, 0], [-s * .45, s * .08], [-s * .1, s * .18], [s * .25, s * .24], [s * .5, s * .2]], BC = [s * .05, 0];
  B.forEach((p, i) => { const q = B[(i + 1) % B.length]; polyFill(c, [BC, p, q], `rgba(${215 + i * 4},${238 + (i % 3) * 5},255,${.5 + (i % 2) * .12})`); });
  c.restore();
  // 頭上兩個小角
  c.fillStyle = 'rgba(225,245,255,0.8)';
  for (const d of [-1, 1]) { c.beginPath(); c.moveTo(s * .5, d * s * .12); c.lineTo(s * .7, d * s * .22); c.lineTo(s * .58, d * s * .04); c.fill(); }
  // 發光的心
  const pulse = 1 + Math.sin(T * 3 + ph) * .12, hg = c.createRadialGradient(s * .05, 0, 0, s * .05, 0, s * .3 * pulse);
  hg.addColorStop(0, 'rgba(255,120,60,0.95)'); hg.addColorStop(.45, 'rgba(255,90,90,0.55)'); hg.addColorStop(1, 'rgba(255,90,90,0)');
  c.fillStyle = hg; circle(c, s * .05, 0, s * .3 * pulse); c.fill();
  c.fillStyle = 'rgba(255,140,90,0.95)'; blob(c, 1, 1, s * .05, 0, s * .1, s * .07, 'rgba(255,130,80,0.95)', 6);
  lpEye(c, s * .45, -s * .06, s * .035 * e, '#40202a'); lpEye(c, s * .45, s * .06, s * .035 * e, '#40202a');
}

function fishScale(f) { return getSp(f.sp).size * 1.4 * (0.45 + 0.55 * f.growth); }
function drawFish(c, f, t, alpha = 1) {
  const sp = getSp(f.sp), s = fishScale(f);
  // 沙地上的影子：離地越近越清楚
  const hgt = clamp((FLOOR - f.y) / (FLOOR - TOP), 0, 1);
  c.fillStyle = `rgba(0,0,0,${(.16 - hgt * .1) * alpha})`; ell(c, f.x, FLOOR + 14, s * (1.3 - hgt * .4), s * .18); c.fill();
  c.globalAlpha = alpha;
  if (sp.star) {
    const g = c.createRadialGradient(f.x, f.y, 0, f.x, f.y, s * 2.2); g.addColorStop(0, `rgba(255,245,200,${.22 + .08 * Math.sin(t * 2 + f.phase)})`); g.addColorStop(1, 'rgba(255,245,200,0)');
    c.fillStyle = g; c.fillRect(f.x - s * 2.2, f.y - s * 2.2, s * 4.4, s * 4.4);
  }
  const spd = Math.hypot(f.vx, f.vy);
  // 擺尾的節奏：每隻魚自己累積（swim），速度改變時只會平順地加快或變慢，不會突然跳動
  const w = Math.sin(f.swim ?? (t * 5 + f.phase)) * (0.12 + Math.min(.15, spd / 600));
  c.save(); c.translate(f.x, f.y); c.scale(f.face, 1);
  c.rotate(clamp(Math.atan2(f.vy, Math.abs(f.vx) + 20), -.45, .45));
  if (f.spinT > 0) { const q = 1 - f.spinT / .8; c.rotate(q * Math.PI * 2); c.scale(1 + Math.sin(q * Math.PI) * .15, 1 + Math.sin(q * Math.PI) * .15); } // 被摸的時候開心轉一圈
  if (f.hunger <= 0) c.globalAlpha = alpha * .75;
  if (f.shiny) shinyDraw(c, sp, s, w, f); else sp.draw(c, s, w, f.growth < .35 ? 1.35 : 1, f);
  c.restore(); c.globalAlpha = 1;
  if (alpha < 1) return;
  if (sp.star) { if (f.id === selFishId) { c.strokeStyle = '#ffc940'; c.setLineDash([5, 4]); c.lineWidth = 2; ell(c, f.x, f.y, s * 1.8 + 6, s + 10); c.stroke(); c.setLineDash([]); } return; }
  if (f.hunger < 30 || f.id === selFishId) {
    const bw = 26; c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(f.x - bw / 2, f.y - s - 12, bw, 4);
    c.fillStyle = f.hunger < 30 ? '#ff6b6b' : '#4cd98b'; c.fillRect(f.x - bw / 2, f.y - s - 12, bw * f.hunger / 100, 4);
  }
  if (f.id === selFishId) { c.strokeStyle = '#ffc940'; c.setLineDash([5, 4]); c.lineWidth = 2; ell(c, f.x, f.y, s * 1.5 + 6, s + 6); c.stroke(); c.setLineDash([]); }
}

// 商店預覽圖
const PREV = {};
function buildPreviews() {
  // 先畫在大畫布上，再依實際圖案範圍裁切、縮放置中
  const big = document.createElement('canvas'); big.width = 480; big.height = 320;
  const bc = big.getContext('2d');
  for (const sp of [...SPECIES, ...STARFISH]) {
    bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(0, 0, 480, 320); bc.translate(260, 160);
    sp.draw(bc, 60, .06, 1);
    PREV[sp.id] = cropPreview(big);
  }
}
// 依實際圖案範圍裁切、縮放置中成 168×100 的小圖；glow 有給就在後面加一圈柔光
function cropPreview(big, glow) {
  const d = big.getContext('2d').getImageData(0, 0, 480, 320).data;
  let x0 = 480, y0 = 320, x1 = 0, y1 = 0;
  for (let y = 0; y < 320; y += 2) for (let x = 0; x < 480; x += 2) if (d[(y * 480 + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const cv = document.createElement('canvas'); cv.width = 168; cv.height = 100; const c = cv.getContext('2d');
  const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0), k = Math.min(156 / bw, 90 / bh);
  if (glow) glowDot(c, 84, 50, 60, glow, .45);
  c.drawImage(big, x0, y0, bw, bh, 84 - bw * k / 2, 50 - bh * k / 2, bw * k, bh * k);
  return cv.toDataURL();
}

