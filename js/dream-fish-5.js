// 第 37～46 隻夢幻魚的繪製（dream-fish-5.js）

// ---- 鯨魚模板：體型跟天空之鯨一樣，換配色、彩帶和點綴 ----
function whaleModel(o) {
  return {
    L: 1.3, H: .4, seed: o.seed, shape: { nose: .85, hump: .35, belly: 1.0, tail: .15 }, top: o.c[0], mid: o.c[1], belly: o.c[2], eye: [.64, 0, .05, o.eye || '#203050'], nx: 10,
    paint: (c, L, Hh) => { hGrad(c, L, Hh, o.sheen); for (let i = 0; i < 6; i++) band(c, L, Hh, .5 - i * .2, .02, 0, o.band); },
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 2, o.glow, .45);
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .4);
      o.rib.forEach((col, k, arr) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .38 * j, (k - (arr.length - 1) / 2) * s * .07 + Math.sin(T * 1.5 + j * .8 + ph + k * .4) * s * .1 * j / 5 + w * s * j * .25]), s * .055, col, .6));
      c.restore();
      if (o.under) o.under(c, s, w, f, L, Hh);
    },
    tail: { type: 'fluke', len: .6, spread: .5, cols: o.tail },
    fins: [{ kind: 'pec', x: .35, y: .65, len: .7, cols: o.fin, alpha: .92 }],
    extra: (c, s, w, f, L, Hh) => { blush(c, L * .72, Hh * .3, s * .06); if (o.extra) o.extra(c, s, w, f, L, Hh); sparkles(c, s, f, o.spark || '#ffffff', 6); },
  };
}
// ---- 鳳凰模板：跟星河鳳凰同一個體型，五條長尾羽、三根冠羽 ----
function phoenixModel(o) {
  return {
    L: .88, H: .36, seed: o.seed, top: o.c[0], mid: o.c[1], belly: o.c[2], eye: [.72, -.15, .06, o.eye || '#3a0800'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, o.sheen); for (let i = 0; i < 4; i++) band(c, L, Hh, .3 - i * .33, .03, .25, o.band); },
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 2.1, o.glow, .5);
      if (o.sun) { c.strokeStyle = o.sun; c.lineWidth = Math.max(1, s * .03); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6 + T * .3; c.globalAlpha = .35 + .25 * Math.sin(T * 2 + k); c.beginPath(); c.moveTo(Math.cos(a) * s * .9, Math.sin(a) * s * .9); c.lineTo(Math.cos(a) * s * 1.35, Math.sin(a) * s * 1.35); c.stroke(); } c.globalAlpha = 1; }
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      o.feathers.forEach((col, k) => {
        const pts = [0, 1, 2, 3, 4, 5, 6].map(j => [-s * .34 * j, (k - 2) * s * (.04 + j * .065) + Math.sin(T * 1.6 + j * .8 + k * 1.2 + ph) * s * .12 * j / 6 + w * s * j * .25]);
        ribbon(c, pts, s * .085, col, .82); const [ex, ey] = pts[6];
        halo(c, ex, ey, s * .18, o.tipGlow, .7); c.fillStyle = o.tip; ell(c, ex, ey, s * .08, s * .05); c.fill();
      });
      c.restore();
    },
    tail: { type: 'fan', len: .95, spread: .85, cols: o.tail, alpha: .9 },
    fins: [{ x0: .35, x1: -.55, h: .75, back: .85, cols: o.fin, alpha: .9 }, { kind: 'pec', x: .35, y: .35, len: .35, cols: [o.c[2], o.fin[1]], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => {
      for (let k = 0; k < 3; k++) {
        const x0 = L * (.55 - k * .12), tip = [x0 - s * (.18 + k * .05), -Hh - s * (.48 - k * .08) + Math.sin(T * 3 + k) * s * .03];
        c.strokeStyle = o.crest; c.lineWidth = Math.max(1, s * .03); c.beginPath(); c.moveTo(x0, -Hh * .85); c.quadraticCurveTo(x0 + s * .05, tip[1] + s * .1, tip[0], tip[1]); c.stroke();
        c.fillStyle = o.tip; star4(c, tip[0], tip[1], s * (.06 + .02 * Math.sin(T * 4 + k)));
      }
      sparkles(c, s, f, o.spark || '#ffffff', 9);
    },
  };
}
// 獨角獸的角：從頭頂斜斜長出去，尖端閃著一顆星
function unicornHorn(c, s, f, col, line) {
  const ph = f ? f.phase : 0, x0 = s * .14, y0 = -s * .64, tx = s * .34, ty = -s * 1.05;
  c.save(); c.rotate(Math.sin(T * 2 + ph) * .06);
  polyFill(c, [[x0 - s * .045, y0], [tx, ty], [x0 + s * .045, y0 + s * .02]], col);
  c.strokeStyle = line; c.lineWidth = Math.max(1, s * .015); for (let k = 1; k < 4; k++) { const q = k / 4; c.beginPath(); c.moveTo(x0 + (tx - x0) * q - s * .03 * (1 - q), y0 + (ty - y0) * q); c.lineTo(x0 + (tx - x0) * q + s * .03 * (1 - q), y0 + (ty - y0) * q + s * .02); c.stroke(); }
  const tw = (Math.sin(T * 3 + ph) + 1) / 2; c.fillStyle = `rgba(255,255,240,${.6 + .4 * tw})`; star4(c, tx, ty, s * (.08 + .06 * tw));
  c.restore();
}
// 身邊慢慢飄落的雪花或花瓣
function fallingFlakes(c, s, f, n, petal) {
  const ph = f ? f.phase : 0;
  for (let i = 0; i < n; i++) {
    const q = (T * .22 + i / n + ph) % 1, x = -s * 1.3 + i * s * 2.6 / n, y = -s * 1.1 + q * s * 2.2;
    c.globalAlpha = Math.sin(q * Math.PI) * .9;
    if (petal) { c.save(); c.translate(x, y); c.rotate(T * 1.5 + i); c.fillStyle = i % 2 ? petal : '#ffffff'; ell(c, 0, 0, s * .09, s * .05); c.fill(); c.restore(); }
    else snowflake(c, x, y, s * .07, T + i);
  }
  c.globalAlpha = 1;
}

// ---- 37 雪花水母：冰藍透明的傘蓋，身邊飄著雪花 ----
const SNOWJELLY = { line: 'rgba(230,245,255,0.65)', rib: ['#e0f4ff', '#c0dcff'], glow: '#d8f0ff', bell: ['#a8d0f8', '#c0e0ff', '#d8ecff', '#eef8ff', '#ffffff', '#eef8ff', '#d8ecff', '#c0e0ff'],
  rim: 'rgba(255,255,255,0.85)', petals: ['#e8f6ff', '#ffffff', '#d8e8ff'], core: 'rgba(240,250,255,0.95)' };
function drawSnowJelly(c, s, w, e, f) {
  halo(c, 0, -s * .1, s * 1.8, '#e0f4ff', .5);
  fallingFlakes(c, s, f, 6);
  drawJelly(c, s, w, e, f, SNOWJELLY);
  snowflake(c, 0, -s * .15, s * .13, T * .5);
  sparkles(c, s, f, '#ffffff', 7);
}
// ---- 38 櫻粉巨鯨：粉紅色的大鯨魚，身邊飄著櫻花瓣 ----
MODELS.blossomwhale = whaleModel({ seed: 653, c: ['#ffb8d0', '#ffe0ec', '#fff8fb'], eye: '#401028', sheen: ['rgba(255,255,255,0.4)', 'rgba(255,200,220,0)', 'rgba(255,180,210,0.45)'], band: 'rgba(255,160,190,0.3)',
  glow: '#ffd0e4', rib: ['#ffc0d8', '#ffffff', '#ffd8a8'], tail: ['#ffd0e0', '#ffb0c8', '#fff0f6'], fin: ['#ffe0ec', '#ffc0d8', '#fff4f8'], spark: '#fff0f6',
  under: (c, s, w, f) => fallingFlakes(c, s, f, 6, '#ffb8d0') });
// ---- 43 翡翠神鯨：翡翠綠的鯨魚，身上灑著金點，拖著金、白、綠三色緞帶 ----
MODELS.jadewhale = whaleModel({ seed: 655, c: ['#2a9a78', '#6ad8b0', '#e8fff4'], eye: '#0a3020', sheen: ['rgba(255,255,220,0.4)', 'rgba(80,200,160,0)', 'rgba(200,255,230,0.5)'], band: 'rgba(255,240,170,0.35)',
  glow: '#90f0c8', rib: ['#ffe8a0', '#ffffff', '#a0f0c8'], tail: ['#2a9a78', '#8ae8c0', '#fff4c8'], fin: ['#3aa888', '#8ae8c0', '#fff0c0'], spark: '#fffbe0',
  extra: (c, s, w, f, L, Hh) => GALAXY_DOTS.forEach(([x, y, r], i) => { c.fillStyle = `rgba(255,225,120,${.45 + .5 * Math.sin(T * 2.5 + i)})`; circle(c, x * L * .9, y * Hh * .8 - Hh * .1, r * Hh * .6 + .6); c.fill(); }) });
// ---- 42 薰衣草鳳凰：淡紫色的鳳凰，尾羽是紫、粉、藍的漸層 ----
MODELS.lavenderphoenix = phoenixModel({ seed: 657, c: ['#9a70e0', '#c8a8ff', '#f4ecff'], eye: '#2a1050', sheen: ['rgba(255,220,255,0.5)', 'rgba(180,140,255,0.1)', 'rgba(150,200,255,0.45)'], band: 'rgba(255,240,255,0.45)',
  glow: '#c8a8ff', feathers: ['#c8a0ff', '#e0c0ff', '#ffb0e0', '#b0c8ff', '#f0d8ff'], tip: '#fff0ff', tipGlow: '#ffe0ff', tail: ['#f4ecff', '#c8a8ff', '#9a70e0'], fin: ['#e8d8ff', '#b890f0', '#ffb0e0'], crest: 'rgba(240,225,255,0.95)', spark: '#f8f0ff' });
// ---- 45 日輪鳳凰：金白色的鳳凰，背後有一圈慢慢轉的太陽光芒 ----
MODELS.sunphoenix = phoenixModel({ seed: 659, c: ['#ffb030', '#ffe080', '#fffbe8'], eye: '#3a1800', sheen: ['rgba(255,255,230,0.6)', 'rgba(255,200,80,0.1)', 'rgba(255,150,80,0.4)'], band: 'rgba(255,255,220,0.5)',
  glow: '#ffe070', sun: '#fff0a0', feathers: ['#fff0a0', '#ffd060', '#ffffff', '#ffb050', '#fff8d0'], tip: '#ffffff', tipGlow: '#fff4c0', tail: ['#fffbe8', '#ffe080', '#ffb030'], fin: ['#fff4c0', '#ffd060', '#ff9a40'], crest: 'rgba(255,240,170,0.95)', spark: '#fffbe0' });
for (const id of ['blossomwhale', 'jadewhale', 'lavenderphoenix', 'sunphoenix']) MODELS[id].id = id;
function drawBlossomWhale(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.blossomwhale); }
function drawJadeWhale(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.jadewhale); }
function drawLavenderPhoenix(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.lavenderphoenix); }
function drawSunPhoenix(c, s, w, e, f) { drawModel(c, s, w, e, f, MODELS.sunphoenix); }

// ---- 39 冰雪神龍：冰藍和雪白的龍，捧著冰晶龍珠，身邊飄雪 ----
const FROSTDRAGON = { body: ['#7ab8f0', '#c0e0ff', '#ffffff'], gold: '#e8f8ff', tail: ['#ffffff', '#a8d8ff'], whisker: 'rgba(240,250,255,0.95)', belly: 'rgba(255,255,255,0.85)',
  head: ['#d8f0ff', '#ffffff', '#b8e0ff', '#a0d0f8', '#7ab8f0', '#90c8f8', '#c0e4ff'], eye: '#103060', spike: 2.6, mane: ['#ffffff', '#d8f0ff', '#b8e0ff', '#f0f8ff'], aura: '#c8ecff', pearl: '#f0fbff' };
function drawFrostDragon(c, s, w, e, f) { fallingFlakes(c, s, f, 7); drawDragon(c, s, w, e, f, FROSTDRAGON); sparkles(c, s, f, '#f0fbff', 8); }
// ---- 40 彩虹獨角獸：白色的身體、彩虹翅膀，頭上一支金色獨角 ----
const RAINBOWUNICORN = { body: '#fff4fa', line: 'rgba(255,190,220,0.45)', belly: 'rgba(255,255,255,0.9)', fin: ['#ffd0e8', '#c8e8ff'], crown: '#ffe8a0', eye: '#401050',
  head: ['#fff0f8', '#ffffff', '#ffe8f4', '#fff8fc', '#fff0f8', '#ffe8f4', '#ffd8ec', '#fff0f8', '#ffe8f4'], wings: ['#ffb0c8', '#ffe0a0', '#b0f0c8', '#a8d0ff', '#d8b8ff'], aura: '#ffe0f4' };
function drawRainbowUnicorn(c, s, w, e, f) {
  halo(c, 0, 0, s * 1.8, '#ffe8f8', .45);
  drawSeahorse(c, s, w, e, f, RAINBOWUNICORN);
  unicornHorn(c, s, f, '#ffe8a0', 'rgba(220,160,60,0.8)');
  sparkles(c, s, f, '#fff8fc', 8);
}
// ---- 41 日輪金魟：金色的大翅膀，翼尖拖著金紅彩帶，背後一圈陽光 ----
const SUNMANTA = { tail: '#fff0b0', c: ['#ffc040', '#ffd060', '#ffe080', '#ffb030', '#fff0a0', '#ffb030', '#ffd060', '#ffc040'], belly: ['rgba(255,250,220,0.85)', 'rgba(255,240,200,0.8)'], eye: '#3a1800', glow: '#ffe070' };
function drawSunManta(c, s, w, e, f) {
  const ph = f ? f.phase : 0, fl = Math.sin(T * 2 + ph) * s * .22;
  halo(c, -s * .2, 0, s * 2.1, '#ffe080', .5);
  for (const d of [-1, 1]) ['#ffd060', '#ff8a50'].forEach((col, k) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .3 - s * .3 * j, d * (s * 1.2 - fl) * (1 - j * .13) + (k - .5) * s * .1 + Math.sin(T * 2.2 + j * .9 + d + k + ph) * s * .2 * j / 5]), s * .1, col, .6));
  drawManta(c, s, w, e, f, SUNMANTA);
  halo(c, s * .3, 0, s * .5, '#fff4c0', .55 + .2 * Math.sin(T * 2 + ph));
  sparkles(c, s, f, '#fff8d0', 8);
}
// ---- 44 天使魟：雪白的翅膀拖著羽毛般的白紗，頭上一圈金色光環 ----
const ANGELMANTA = { tail: '#fff0c0', c: ['#ffffff', '#f4f6ff', '#fffaf0', '#eef2ff', '#ffffff', '#eef2ff', '#f4f6ff', '#ffffff'], belly: ['rgba(255,240,200,0.6)', 'rgba(220,230,255,0.6)'], eye: '#302050', glow: '#ffffff' };
function drawAngelManta(c, s, w, e, f) {
  const ph = f ? f.phase : 0, fl = Math.sin(T * 2 + ph) * s * .22;
  halo(c, -s * .2, 0, s * 2.1, '#fff8e8', .55);
  for (const d of [-1, 1]) ['#ffffff', '#fff0d0', '#e8ecff'].forEach((col, k) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .3 - s * .32 * j, d * (s * 1.2 - fl) * (1 - j * .13) + (k - 1) * s * .09 + Math.sin(T * 1.8 + j * .9 + d + k + ph) * s * .2 * j / 5]), s * .09, col, .6));
  drawManta(c, s, w, e, f, ANGELMANTA);
  c.strokeStyle = 'rgba(255,220,120,0.95)'; c.lineWidth = Math.max(1.2, s * .035); ell(c, s * .75, Math.sin(T * 2 + ph) * s * .03, s * .1, s * .26); c.stroke();
  sparkles(c, s, f, '#fffbe8', 9);
}
// ---- 46 星宇神龍：夜空色的龍，鱗片閃著星光，身邊繞著三顆彩色星珠；最後一隻也是最耀眼的一隻 ----
const COSMOSDRAGON = { body: ['#1a1450', '#3a2a90', '#7a60d0'], gold: '#fff0b0', tail: ['#ffe0a0', '#c8a0ff'], whisker: 'rgba(255,245,200,0.95)', belly: 'rgba(200,180,255,0.75)',
  head: ['#5a48c0', '#7a60d0', '#3a2a90', '#2a1a70', '#1a1450', '#3a2a90', '#5a48c0'], eye: '#fff8ff', spike: 2.8, mane: ['#ff9ad8', '#8ad0ff', '#fff0a0', '#c8a0ff', '#a0f0d0'], aura: '#a890ff', pearl: '#fff4ff' };
function drawCosmosDragon(c, s, w, e, f) {
  const ph = f ? f.phase : 0;
  halo(c, 0, 0, s * 2.3, '#8a70ff', .5);
  drawDragon(c, s, w, e, f, COSMOSDRAGON);
  for (let i = 0; i < 9; i++) { c.fillStyle = `rgba(255,255,230,${.4 + .6 * Math.abs(Math.sin(T * 2.5 + i * 1.7))})`; star4(c, s * (1.1 - i * .3), Math.sin(T * 2 + i * .7 + ph) * s * .12, s * .05); }
  ['#ff9ad8', '#8ad0ff', '#fff0a0'].forEach((col, k) => { const a = T * 1.2 + k * 2.1 + ph, x = Math.cos(a) * s * 1.2, y = Math.sin(a) * s * .55; halo(c, x, y, s * .28, col, .8); c.fillStyle = '#ffffff'; circle(c, x, y, s * .05); c.fill(); });
  sparkles(c, s, f, '#fff8ff', 11);
}
