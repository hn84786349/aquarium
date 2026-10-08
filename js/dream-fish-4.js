// 第 32～36 隻夢幻魚的繪製（dream-fish-4.js）

// 光暈的顏色會變，取整到每 10 度一種，避免快取的光暈圖越存越多
// ---- 極光水母后：傘蓋是綠、藍、紫的極光色，外圈一道會變色的光環 ----
const AURORAJELLY = { line: 'rgba(200,255,240,0.6)', rib: ['#8affd0', '#b090ff'], glow: '#a0ffe0', bell: ['#5ae0b0', '#6ad8d0', '#7ac8f0', '#9ab0ff', '#c0a0ff', '#9ab0ff', '#7ac8f0', '#6ad8d0'],
  rim: 'rgba(230,255,250,0.85)', petals: ['#c8fff0', '#d8d0ff', '#ffffff'], core: 'rgba(240,255,250,0.95)' };
function drawAuroraJelly(c, s, w, e, f) {
  const ph = f ? f.phase : 0;
  halo(c, 0, -s * .1, s * 1.9, hexOf(hsl(Math.round((T * 30 + ph * 40) / 10) * 10 % 360, .7, .8)), .45);
  drawJelly(c, s, w, e, f, AURORAJELLY);
  c.strokeStyle = css(hsl((T * 60 + ph * 40) % 360, .85, .78), .75); c.lineWidth = Math.max(1, s * .03); ell(c, 0, -s * .2, s * .75, s * .16, Math.sin(T + ph) * .1); c.stroke();
  sparkles(c, s, f, '#e8fff8', 8);
}
// ---- 櫻花神龍：粉白色的龍，身邊不停飄落櫻花瓣 ----
const SAKURADRAGON = { body: ['#f08ab0', '#ffc0d8', '#fff0f6'], gold: '#fff4f8', tail: ['#ffd8e8', '#ff9ac0'], whisker: 'rgba(255,230,240,0.95)', belly: 'rgba(255,250,252,0.9)',
  head: ['#ffd0e0', '#fff0f6', '#ffb8d0', '#ff9ac0', '#f08ab0', '#ffa8c8', '#ffc8dc'], eye: '#501030', spike: 2.4, mane: ['#ffffff', '#ffd0e4', '#ffb0cc', '#fff0f6'], aura: '#ffc8dc', pearl: '#fff0f8' };
function drawSakuraDragon(c, s, w, e, f) {
  const ph = f ? f.phase : 0;
  for (let i = 0; i < 7; i++) {
    const q = (T * .25 + i / 7 + ph) % 1; c.save(); c.translate(-s * (1.6 - i * .45) + Math.sin(T + i) * s * .2, -s * .9 + q * s * 1.8); c.rotate(T * 1.5 + i);
    c.globalAlpha = Math.sin(q * Math.PI) * .9; c.fillStyle = i % 2 ? '#ffc8dc' : '#ffffff'; ell(c, 0, 0, s * .09, s * .05); c.fill(); c.restore();
  }
  drawDragon(c, s, w, e, f, SAKURADRAGON); sparkles(c, s, f, '#fff0f6', 8);
}
// ---- 銀河魔鬼魟：深紫色的翅膀裡灑滿星星，翼尖拖著星雲彩帶 ----
const GALAXYMANTA = { tail: '#c8b0ff', c: ['#4a2a9a', '#3a2088', '#5a38b0', '#2a1870', '#6a48c8', '#2a1870', '#3a2088', '#4a2a9a'], belly: ['rgba(255,170,230,0.55)', 'rgba(150,210,255,0.55)'], eye: '#fff0ff', glow: '#b090ff', stars: true };
function drawGalaxyManta(c, s, w, e, f) {
  const ph = f ? f.phase : 0, fl = Math.sin(T * 2 + ph) * s * .22;
  halo(c, -s * .2, 0, s * 2.1, '#8a70ff', .45);
  for (const d of [-1, 1]) ['#ff9ad8', '#8ad0ff', '#c8a0ff'].forEach((col, k) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .3 - s * .32 * j, d * (s * 1.2 - fl) * (1 - j * .13) + (k - 1) * s * .09 + Math.sin(T * 2 + j * .9 + d + k + ph) * s * .2 * j / 5]), s * .08, col, .55));
  drawManta(c, s, w, e, f, GALAXYMANTA);
  for (let i = 0; i < 3; i++) { const a = T * .9 + i * 2.1 + ph; c.fillStyle = `rgba(255,255,230,${.5 + .5 * Math.sin(T * 3 + i)})`; star4(c, Math.cos(a) * s * 1.1, Math.sin(a) * s * 1.3, s * .07); }
  sparkles(c, s, f, '#f0e8ff', 8);
}
// ---- 冰晶天馬：冰藍色的身體、雪白的翅膀，頭上一支冰晶獨角，身邊飄著雪花 ----
const ICEPEGASUS = { body: '#a8d8ff', line: 'rgba(255,255,255,0.55)', belly: 'rgba(240,250,255,0.9)', fin: ['#e8f8ff', '#b8e8ff'], crown: '#e8f8ff', eye: '#103060',
  head: ['#b8e0ff', '#d0ecff', '#a8d8ff', '#e0f4ff', '#b8e0ff', '#a8d8ff', '#90c8f0', '#b8e0ff', '#a8d8ff'], wings: ['#ffffff', '#e8f8ff', '#d8f0ff', '#f4fbff', '#c8ecff'], aura: '#c8f0ff' };
function drawIcePegasus(c, s, w, e, f) {
  const ph = f ? f.phase : 0, rot = Math.sin(T * 2 + ph) * .06;
  halo(c, 0, 0, s * 1.8, '#d0f4ff', .45);
  drawSeahorse(c, s, w, e, f, ICEPEGASUS);
  c.save(); c.rotate(rot);
  const x0 = s * .14, y0 = -s * .64, tx = s * .34, ty = -s * 1.05;
  polyFill(c, [[x0 - s * .045, y0], [tx, ty], [x0 + s * .045, y0 + s * .02]], '#e8fbff');
  c.strokeStyle = 'rgba(160,220,255,0.9)'; c.lineWidth = Math.max(1, s * .015); c.beginPath(); c.moveTo(x0, y0); c.lineTo(tx, ty); c.stroke();
  const tw = (Math.sin(T * 3 + ph) + 1) / 2; c.fillStyle = `rgba(240,252,255,${.6 + .4 * tw})`; star4(c, tx, ty, s * (.08 + .06 * tw));
  c.restore();
  // 雪花：六條線的小星星，慢慢轉
  c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = Math.max(1, s * .015);
  for (let i = 0; i < 5; i++) {
    const q = (T * .2 + i / 5 + ph) % 1, x = -s * 1.2 + i * s * .55, y = -s * 1.1 + q * s * 2.2, r = s * .07;
    c.save(); c.translate(x, y); c.rotate(T + i); c.globalAlpha = Math.sin(q * Math.PI);
    c.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.moveTo(-Math.cos(a) * r, -Math.sin(a) * r); c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke(); c.restore();
  }
  sparkles(c, s, f, '#ffffff', 7);
}
// ---- 星河鳳凰：夜空色的鳳凰，五條銀河尾羽的尾端是發亮的星星，頭上三根星光冠羽；最後一隻也是最耀眼的一隻 ----
Object.assign(MODELS, {
  galaxyphoenix: {
    L: .88, H: .36, seed: 591, top: '#2a1a70', mid: '#5a48c0', belly: '#e8e0ff', eye: [.72, -.15, .06, '#fff8ff'],
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['rgba(255,170,230,0.45)', 'rgba(120,140,255,0.1)', 'rgba(140,220,255,0.5)']);
      for (let i = 0; i < 4; i++) band(c, L, Hh, .3 - i * .33, .03, .25, 'rgba(230,220,255,0.45)');
      const r = mulberry(591); for (let i = 0; i < 16; i++) blob(c, L, Hh, -.9 + r() * 1.7, -.8 + r() * 1.4, .025, .045, 'rgba(255,250,220,0.95)', 5, r());
    },
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 2.1, '#a890ff', .5);
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      ['#ff9ad8', '#c8a0ff', '#8ad0ff', '#a0f0d0', '#ffe0a0'].forEach((col, k) => {
        const pts = [0, 1, 2, 3, 4, 5, 6].map(j => [-s * .34 * j, (k - 2) * s * (.04 + j * .065) + Math.sin(T * 1.6 + j * .8 + k * 1.2 + ph) * s * .12 * j / 6 + w * s * j * .25]);
        ribbon(c, pts, s * .085, col, .8); const [ex, ey] = pts[6];
        halo(c, ex, ey, s * .2, '#fff8e0', .7); c.fillStyle = `rgba(255,255,240,${.7 + .3 * Math.sin(T * 3 + k)})`; star4(c, ex, ey, s * .07);
      });
      c.restore();
    },
    tail: { type: 'fan', len: .95, spread: .85, cols: ['#e8e0ff', '#a890ff', '#5a48c0'], alpha: .9 },
    fins: [{ x0: .35, x1: -.55, h: .75, back: .85, cols: ['#d8c8ff', '#9a80f0', '#ff9ad8'], alpha: .9 }, { kind: 'pec', x: .35, y: .35, len: .35, cols: ['#ffffff', '#a890ff'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => {
      for (let k = 0; k < 3; k++) {
        const x0 = L * (.55 - k * .12), tip = [x0 - s * (.18 + k * .05), -Hh - s * (.48 - k * .08) + Math.sin(T * 3 + k) * s * .03];
        c.strokeStyle = 'rgba(230,220,255,0.95)'; c.lineWidth = Math.max(1, s * .03); c.beginPath(); c.moveTo(x0, -Hh * .85); c.quadraticCurveTo(x0 + s * .05, tip[1] + s * .1, tip[0], tip[1]); c.stroke();
        c.fillStyle = '#fff4c8'; star4(c, tip[0], tip[1], s * (.06 + .02 * Math.sin(T * 4 + k)));
      }
      GALAXY_DOTS.forEach(([x, y, r], i) => { c.fillStyle = `rgba(255,255,240,${.4 + .6 * Math.sin(T * 2.5 + i)})`; circle(c, x * L * .8, y * Hh * .7, r * Hh * .5 + .5); c.fill(); });
      sparkles(c, s, f, '#f4f0ff', 10);
    },
  },
});
MODELS.galaxyphoenix.id = 'galaxyphoenix';
function drawGalaxyPhoenix(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.galaxyphoenix); }
