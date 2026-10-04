// 第 27～31 隻夢幻魚的繪製（dream-fish-3.js）

// ---- 蓮花仙后：大朵粉金蓮花水母，頭上戴著小皇冠 ----
const LOTUSQUEEN = { line: 'rgba(255,230,180,0.6)', rib: ['#ffd27a', '#ffb0d0'], glow: '#ffd0e0', bell: ['#ff8ab8', '#ffa0c8', '#ffb8d8', '#ffd8a0', '#fff0c0', '#ffd8a0', '#ffb8d8', '#ffa0c8'],
  rim: 'rgba(255,245,210,0.85)', petals: ['#ffa8cc', '#ffd0e4', '#ffe4a8', '#ffffff'], core: 'rgba(255,235,150,0.95)' };
function drawLotusQueen(c, s, w, e, f) {
  halo(c, 0, -s * .1, s * 1.8, '#ffe0f0', .5);
  drawJelly(c, s, w, e, f, LOTUSQUEEN);
  const y = -s * .55; polyFill(c, [[-s * .16, y], [-s * .13, y - s * .15], [-s * .05, y - s * .06], [0, y - s * .2], [s * .05, y - s * .06], [s * .13, y - s * .15], [s * .16, y]], '#ffd870');
  c.fillStyle = '#ff8ab8'; circle(c, 0, y - s * .06, s * .03); c.fill();
  sparkles(c, s, f, '#fff0c8', 7);
}
// ---- 星辰巨鯨：深藍的鯨魚，身上畫著星座，身後拖著極光 ----
Object.assign(MODELS, {
  starwhale: {
    L: 1.35, H: .4, seed: 557, shape: { nose: .85, hump: .35, belly: 1.0, tail: .15 }, top: '#0a1040', mid: '#1a2a70', belly: '#5a70c0', eye: [.64, 0, .05, '#e8f0ff'], nx: 10,
    paint: (c, L, Hh) => {
      const P = [[-.8, -.4], [-.5, -.6], [-.2, -.35], [.15, -.55], [.45, -.3], [-.3, .1], [.1, .2]];
      c.strokeStyle = 'rgba(220,230,255,0.5)'; c.lineWidth = 2; c.beginPath(); P.slice(0, 5).forEach(([u, v], i) => i ? c.lineTo(u * L, v * Hh) : c.moveTo(u * L, v * Hh)); c.moveTo(-.2 * L, -.35 * Hh); c.lineTo(-.3 * L, .1 * Hh); c.lineTo(.1 * L, .2 * Hh); c.stroke();
      for (const [u, v] of P) blob(c, L, Hh, u, v, .025, .06, '#fff8d8', 5);
      polyFill(c, [[L * 1.1, Hh * .4], [0, Hh * .55], [-L * 1.1, Hh * .45], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(150,180,255,0.35)');
    },
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 2, '#6a80ff', .4);
      c.save(); c.translate(-L * .1, -Hh * .6);
      for (const k of [0, 1, 2]) ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * (.3 + k * .04) * j, -s * (.05 + k * .08) * j - Math.sin(T * 1.4 + j * .8 + k * 1.3 + ph) * s * .1 * j / 5 + w * s * j * .2]), s * (.11 - k * .02), hsl(Math.round((170 + k * 50 + Math.sin(T * .5) * 30) / 10) * 10, .8, .68), .5);
      c.restore();
    },
    tail: { type: 'fluke', len: .62, spread: .52, cols: ['#1a2a70', '#5a70c0', '#a8b8ff'] },
    fins: [{ kind: 'pec', x: .35, y: .65, len: .75, cols: ['#2a3a90', '#7a90e0', '#c0c8ff'], alpha: .92 }],
    extra: (c, s, w, f, L, Hh) => { GALAXY_DOTS.forEach(([x, y, r], i) => { c.fillStyle = `rgba(255,255,240,${.4 + .6 * Math.sin(T * 2.5 + i)})`; circle(c, x * L * .9, y * Hh * .8 - Hh * .1, r * Hh * .7 + .6); c.fill(); }); sparkles(c, s, f, '#e8f0ff', 6); },
  },
});
MODELS.starwhale.id = 'starwhale';
function drawStarWhale(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.starwhale); }
// ---- 鳳凰神龍：金紅色的龍，鬃毛像火焰羽毛，捧著一顆火焰龍珠 ----
const PHOENIXDRAGON = { body: ['#c83a1a', '#ff7a2a', '#ffd070'], gold: '#fff0a0', tail: ['#ffe070', '#ff5a3a'], whisker: 'rgba(255,240,180,0.95)', belly: 'rgba(255,240,200,0.85)',
  head: ['#ffd070', '#fff0b0', '#ffb040', '#ff7a2a', '#c83a1a', '#e85a20', '#ffa040'], eye: '#3a0800', spike: 2.6, mane: ['#ff5a3a', '#ffb040', '#fff070', '#ff8ab0'], aura: '#ffb070', pearl: '#ffe8a0' };
function drawPhoenixDragon(c, s, w, e, f) { drawDragon(c, s, w, e, f, PHOENIXDRAGON); sparkles(c, s, f, '#fff0b0', 8); }
// ---- 星空天馬：身體像夜空一樣有星星，翅膀是星光色，頭上一支星光獨角 ----
const STARPEGASUS = { body: '#3a2a8a', line: 'rgba(200,180,255,0.4)', belly: 'rgba(170,150,255,0.8)', fin: ['#c8b8ff', '#8ae0ff'], crown: '#fff0b0', eye: '#fff0ff',
  head: ['#4a3aa0', '#5a48b8', '#3a2a8a', '#6a58c8', '#4a3aa0', '#3a2a8a', '#2a1a70', '#4a3aa0', '#3a2a8a'], wings: ['#e0d8ff', '#c8e8ff', '#fff4d8', '#d8c8ff', '#b8e0ff'], aura: '#a890ff' };
function drawStarPegasus(c, s, w, e, f) {
  const ph = f ? f.phase : 0, rot = Math.sin(T * 2 + ph) * .06;
  halo(c, 0, 0, s * 1.7, '#b8a0ff', .4);
  drawSeahorse(c, s, w, e, f, STARPEGASUS);
  c.save(); c.rotate(rot);
  for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(255,255,230,${.4 + .6 * Math.abs(Math.sin(T * 2 + i * 1.3))})`; circle(c, s * (.12 - (i % 3) * .06), s * (-.2 + i * .14), s * .025); c.fill(); }
  const x0 = s * .14, y0 = -s * .64, tx = s * .32, ty = -s * 1.02;
  polyFill(c, [[x0 - s * .04, y0], [tx, ty], [x0 + s * .04, y0 + s * .02]], '#fff4c8');
  const tw = (Math.sin(T * 3 + ph) + 1) / 2; c.fillStyle = `rgba(255,255,230,${.6 + .4 * tw})`; star4(c, tx, ty, s * (.08 + .06 * tw));
  c.restore();
  sparkles(c, s, f, '#e8e0ff', 7);
}
// ---- 彩虹女皇魟：彩虹漸層的大翅膀，翼尖拖著長長的彩帶，額頭閃著金光 ----
const EMPRESSMANTA = { tail: '#e0d0ff', c: ['#ffb0d0', '#ffd090', '#fff0a0', '#b0f0c8', '#a0d8ff', '#c8b0ff', '#ffc8e8', '#d0c0ff'], belly: ['rgba(255,255,255,0.85)', 'rgba(255,245,250,0.8)'], eye: '#401050', glow: '#ffe0f8' };
function drawEmpressManta(c, s, w, e, f) {
  const ph = f ? f.phase : 0, fl = Math.sin(T * 2 + ph) * s * .22;
  halo(c, -s * .2, 0, s * 2.1, '#ffe8f8', .5);
  for (const d of [-1, 1]) ['#ffb0d0', '#a0d8ff'].forEach((col, k) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .3 - s * .3 * j, d * (s * 1.2 - fl) * (1 - j * .13) + (k - .5) * s * .1 + Math.sin(T * 2.2 + j * .9 + d + k + ph) * s * .2 * j / 5]), s * .1, col, .65));
  drawManta(c, s, w, e, f, EMPRESSMANTA);
  halo(c, s * .45, 0, s * .4, '#ffd870', .6 + .2 * Math.sin(T * 2 + ph)); // 額頭一圈金色光芒
  sparkles(c, s, f, '#ffffff', 8);
}
