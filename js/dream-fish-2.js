// 第 22～26 隻夢幻魚的繪製，以及「游過去留下淡淡痕跡」的效果（dream-fish-2.js）

// ---- 淡淡的游動痕跡：記錄最近幾個位置，畫成一串越來越淡的柔光 ----
// 用 WeakMap 記錄，不會被存進存檔裡
const TRAILS = new WeakMap();
function trailStep(f, dt, s) {
  if (LITE) return; // 省電模式不畫痕跡
  let tr = TRAILS.get(f); if (!tr) TRAILS.set(f, tr = { t: 0, pts: [] });
  tr.t += dt; if (tr.t < .06) return; tr.t = 0;
  tr.pts.push([f.x - f.face * s * .55, f.y]); if (tr.pts.length > 12) tr.pts.shift();
}
function drawTrail(c, f, s, col, alpha) {
  if (LITE) return;
  const tr = TRAILS.get(f); if (!tr) return;
  const n = tr.pts.length;
  tr.pts.forEach(([x, y], i) => {
    const q = (i + 1) / n; halo(c, x, y, s * (.2 + .3 * q), col, .28 * q * alpha);
    if (i % 3 === 1) { c.globalAlpha = .55 * q * alpha; c.fillStyle = '#ffffff'; star4(c, x, y + Math.sin(i * 2.1) * s * .15, s * .05 * q + 1); c.globalAlpha = alpha; }
  });
}

// ---- 月光琉璃水母：銀白色的傘蓋，中間有一顆彎彎的月亮 ----
const LUNAJELLY = { line: 'rgba(230,240,255,0.6)', rib: ['#e8f0ff', '#c8d8ff'], glow: '#e8f0ff', bell: ['#c8d0f0', '#d8e0f8', '#e8ecff', '#f4f6ff', '#ffffff', '#f4f6ff', '#e8ecff', '#d8e0f8'],
  rim: 'rgba(255,255,255,0.8)', petals: ['#e0e8ff', '#fff4d8', '#e8e0ff'], core: 'rgba(255,248,220,0.9)' };
function drawLunaJelly(c, s, w, e, f) {
  halo(c, 0, -s * .1, s * 1.6, '#e8f0ff', .45);
  drawJelly(c, s, w, e, f, LUNAJELLY);
  const y = -s * .14; c.fillStyle = '#fff0b0'; c.beginPath(); c.arc(0, y, s * .15, -Math.PI * .7, Math.PI * .7); c.arc(s * .06, y - s * .02, s * .12, Math.PI * .7, -Math.PI * .7, true); c.fill();
  sparkles(c, s, f, '#fffbe8', 6);
}
// ---- 天空之鯨：白色的鯨魚，身邊飄著小雲朵，尾巴拖著淡淡的彩虹 ----
Object.assign(MODELS, {
  skywhale: {
    L: 1.3, H: .4, seed: 499, shape: { nose: .85, hump: .35, belly: 1.0, tail: .15 }, top: '#c8e0ff', mid: '#f0f6ff', belly: '#ffffff', eye: [.64, 0, .05, '#203050'], nx: 10,
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,220,240,0.4)', 'rgba(255,255,255,0)', 'rgba(190,210,255,0.5)']); for (let i = 0; i < 6; i++) band(c, L, Hh, .5 - i * .2, .02, 0, 'rgba(180,200,240,0.35)'); },
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 2, '#ffffff', .4);
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .4);
      ['#ffb0c8', '#ffe0a0', '#b0f0c8', '#b0d0ff', '#d8b8ff'].forEach((col, k) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .38 * j, (k - 2) * s * .07 + Math.sin(T * 1.5 + j * .8 + ph) * s * .1 * j / 5 + w * s * j * .25]), s * .05, col, .55));
      c.restore();
      for (let i = 0; i < 4; i++) { const a = T * .4 + i * 1.6 + ph, x = Math.cos(a) * L * 1.2, y = -Hh * 1.3 + Math.sin(a * 1.3) * Hh * .6; for (let k = 0; k < 3; k++) { c.fillStyle = 'rgba(255,255,255,0.85)'; circle(c, x + (k - 1) * s * .12, y + (k === 1 ? -s * .05 : 0), s * (k === 1 ? .11 : .08)); c.fill(); } }
    },
    tail: { type: 'fluke', len: .6, spread: .5, cols: ['#e0ecff', '#ffe0f0', '#e0f0ff'] },
    fins: [{ kind: 'pec', x: .35, y: .65, len: .7, cols: ['#f0f6ff', '#d8e8ff', '#ffe8f4'], alpha: .92 }],
    extra: (c, s, w, f, L, Hh) => { blush(c, L * .72, Hh * .3, s * .06); sparkles(c, s, f, '#ffffff', 5); },
  },
});
MODELS.skywhale.id = 'skywhale';
function drawSkyWhale(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.skywhale); }
// ---- 水晶神龍：半透明的粉彩水晶鱗片，捧著一顆稜鏡龍珠 ----
const CRYSTALDRAGON = { body: ['#b8c8f8', '#e0e8ff', '#ffffff'], gold: '#e8d8ff', tail: ['#f0e8ff', '#c8e8ff'], whisker: 'rgba(240,240,255,0.95)', belly: 'rgba(255,240,250,0.8)',
  head: ['#f4f0ff', '#ffffff', '#e8e0ff', '#d0d8ff', '#b8c8f8', '#c8d4ff', '#e0e4ff'], eye: '#302060', spike: 2.4, mane: ['#ffd0f0', '#d0e8ff', '#e8d8ff', '#fff0d0'], aura: '#e0d8ff', pearl: '#e8f8ff' };
function drawCrystalDragon(c, s, w, e, f) {
  drawDragon(c, s, w, e, f, CRYSTALDRAGON);
  // 龍珠外面繞著一圈會變色的光
  const px = s * 1.5, py = s * .15 + Math.sin(T * 2) * s * .05; c.strokeStyle = css(hsl((T * 60) % 360, .8, .8), .8); c.lineWidth = Math.max(1, s * .025); ell(c, px, py, s * .22, s * .08, T); c.stroke();
  sparkles(c, s, f, '#f0f0ff', 7);
}
function drawPhoenixLord(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.phoenixlord); }
function drawGoddessFish(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.goddessfish); }
