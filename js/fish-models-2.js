// 第 51～65 種魚的外觀設定（fish-models-2.js）：體型小巧、更夢幻，特效輕柔不浮誇
// 游過去會留下淡淡痕跡的效果，在 data.js 每種魚的 trail 設定顏色（畫法在 dream-fish-2.js）
Object.assign(MODELS, {
  dewdrop: {
    L: .5, H: .34, seed: 401, shape: { nose: .7, hump: .3, tail: .3 }, top: 'rgba(190,240,255,0.7)', mid: 'rgba(240,252,255,0.6)', belly: 'rgba(255,255,255,0.7)', edge: 'rgba(255,255,255,0.8)', eye: [.66, -.12, .09, '#1a3a5a'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,190,230,0.35)', 'rgba(190,255,230,0.3)', 'rgba(180,200,255,0.4)']); blob(c, L, Hh, .25, -.4, .2, .18, 'rgba(255,255,255,0.8)', 6); },
    under: (c, s) => halo(c, 0, 0, s * 1.1, '#bff0ff', .3),
    tail: { type: 'round', len: .6, spread: .5, cols: ['#e8fbff', '#c8ecff', '#f0e0ff'], alpha: .6, edge: 'rgba(255,255,255,0.6)' },
    fins: [{ x0: .1, x1: -.4, h: .3, back: .6, cols: ['#e8fbff', '#d8e8ff'], alpha: .55 }, { kind: 'pec', x: .3, y: .4, len: .26, cols: ['#ffffff', '#d0f0ff'], alpha: .6 }],
    extra: (c, s, w, f, L, Hh) => { const ph = f ? f.phase : 0; twinkle(c, L * .1, -Hh * .3, s * .08, ph); c.fillStyle = 'rgba(255,255,255,0.85)'; circle(c, L * .3, -Hh * .45, s * .04); c.fill(); },
  },
  moonmoth: {
    L: .48, H: .26, seed: 409, top: '#d8f4e0', mid: '#f4fff6', belly: '#ffffff', eye: [.7, -.1, .08, '#20402a'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['rgba(255,240,180,0.5)', 'rgba(170,240,200,0.3)', 'rgba(150,220,210,0.5)']),
    // 背上一對像月蛾的淡綠翅膀，翅尖拖著長長的尾帶
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0, fl = .6 + .4 * Math.abs(Math.sin(T * 4 + ph)), a0 = c.globalAlpha;
      c.save(); c.translate(0, -Hh * .5); c.scale(1, fl); c.globalAlpha = a0 * .85;
      polyFill(c, [[s * .15, 0], [s * .1, -s * .55], [-s * .25, -s * .7], [-s * .35, -s * .3], [-s * .1, 0]], '#c8f4d8');
      polyFill(c, [[-s * .1, 0], [-s * .35, -s * .3], [-s * .7, -s * .5 + Math.sin(T * 3 + ph) * s * .05], [-s * .45, -s * .1]], '#a8e8c8');
      c.fillStyle = 'rgba(255,230,150,0.9)'; circle(c, -s * .08, -s * .38, s * .06); c.fill();
      c.restore(); c.globalAlpha = a0;
    },
    tail: { type: 'fork', len: .55, spread: .45, cols: ['#d8f4e0', '#a8e8c8'], alpha: .9 },
    fins: [{ kind: 'pec', x: .3, y: .4, len: .26, cols: ['#ffffff', '#c8f4d8'], alpha: .85 }],
  },
  snowflake: {
    L: .55, H: .28, seed: 419, top: '#e0f0ff', mid: '#ffffff', belly: '#ffffff', eye: [.72, -.12, .075, '#1a2a50'],
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['rgba(200,230,255,0.4)', 'rgba(255,255,255,0)', 'rgba(170,200,255,0.5)']);
      c.strokeStyle = 'rgba(150,190,255,0.7)'; c.lineWidth = 1.5;
      for (const [u, v] of [[-.2, -.2], [-.55, .15], [.15, .25]]) for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3, x = u * L, y = v * Hh, r = Hh * .2; c.beginPath(); c.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.stroke(); }
    },
    under: (c, s) => halo(c, 0, 0, s * 1.2, '#d8ecff', .3),
    tail: { type: 'veil', len: 1.2, spread: 1, cols: ['#ffffff', '#d8ecff', '#b8d4ff', '#e8f4ff'], alpha: .82 },
    fins: [{ x0: .15, x1: -.8, h: .7, back: 1, cols: ['#ffffff', '#c8e0ff'], alpha: .8 }, { dir: 1, x0: .25, x1: -.8, h: .75, back: 1.1, cols: ['#ffffff', '#d0e4ff'], alpha: .8 },
      { kind: 'pec', x: .35, y: .35, len: .3, cols: ['#ffffff', '#d8ecff'], alpha: .85 }],
  },
  blossomkoi: {
    L: .6, H: .27, seed: 421, shape: { nose: .6, tail: .3 }, top: '#ffffff', mid: '#ffffff', belly: '#fff8fa', eye: [.74, -.16, .07, '#401020'],
    paint: (c, L, Hh) => { blob(c, L, Hh, .35, -.4, .22, .5, '#ff9ab8', 8); blob(c, L, Hh, -.25, -.5, .25, .4, '#ffb8cc', 7); blob(c, L, Hh, -.65, -.1, .12, .3, '#ffd0dc', 6); },
    tail: { type: 'veil', len: .95, spread: .8, cols: ['#fff0f4', '#ffc8d8', '#ffe0ea'], alpha: .85 },
    // 胸鰭和背鰭像一片片花瓣
    fins: [{ x0: .25, x1: -.5, h: .35, back: .5, cols: ['#fff0f4', '#ffb8cc'], alpha: .9 }, { kind: 'pec', x: .4, y: .5, len: .4, cols: ['#ffffff', '#ffc0d4'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => whisker(c, s, w, L, Hh, 'rgba(255,160,190,0.8)'),
  },
  aurorafin: {
    L: .55, H: .27, seed: 431, top: '#1a3a6a', mid: '#2a6aa0', belly: '#9ae0e8', eye: [.72, -.12, .08, '#e8fbff'],
    paint: (c, L, Hh) => { for (const [v, col] of [[-.5, 'rgba(90,255,200,0.5)'], [-.2, 'rgba(150,170,255,0.45)']]) polyFill(c, [[L, (v - .08) * Hh], [-L * 1.1, (v + .02) * Hh], [-L * 1.1, (v + .14) * Hh], [L, (v + .05) * Hh]], col); },
    // 身後兩條淡淡的極光綾帶，顏色在綠、藍、紫之間慢慢變化
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      for (const k of [0, 1]) ribbon(c, [0, 1, 2, 3, 4].map(j => [-s * .38 * j, (k - .5) * s * (.05 + j * .08) + Math.sin(T * 1.8 + j * .8 + k * 2 + ph) * s * .1 * j / 4 + w * s * j * .25]), s * .06, hsl(Math.round((150 + Math.sin(T * .6 + k * 2 + ph) * 60) / 10) * 10, .8, .7), .6);
      c.restore();
    },
    tail: { type: 'veil', len: 1, spread: .8, cols: ['#2a6aa0', '#5ae8c8', '#a890ff'], alpha: .82 },
    fins: [{ x0: .1, x1: -.7, h: .55, back: .9, cols: ['#2a6aa0', '#5ae8c8'], alpha: .82 }, { kind: 'pec', x: .35, y: .4, len: .28, cols: ['#9ae0e8', '#a890ff'], alpha: .85 }],
  },
  honeyfairy: {
    L: .5, H: .3, seed: 433, shape: { nose: .6, hump: .25 }, top: '#ffc860', mid: '#ffe8a8', belly: '#fff8e0', eye: [.7, -.12, .085, '#3a2000'],
    paint: (c, L, Hh) => { for (let i = 0; i < 3; i++) band(c, L, Hh, .2 - i * .35, .05, .1, 'rgba(255,170,60,0.45)'); },
    under: (c, s) => halo(c, 0, 0, s * 1.2, '#ffd870', .4),
    tail: { type: 'round', len: .55, spread: .5, cols: ['#ffe8a8', '#ffc860'], alpha: .9 },
    fins: [{ kind: 'pec', x: .3, y: .4, len: .26, cols: ['#fff8e0', '#ffd870'], alpha: .9 }],
    // 背上一對透明的小翅膀，拍得很快
    extra: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0, fl = Math.sin(T * 16 + ph) * .35;
      for (const k of [0, 1]) { c.save(); c.translate(-L * .05, -Hh * .85); c.rotate(-1.9 + fl + k * .45); polyFill(c, [[0, 0], [s * .45, -s * .1], [s * .5, s * .05], [s * .1, s * .08]], `rgba(255,255,255,${k ? .45 : .6})`); c.restore(); }
    },
  },
  mermaidfin: {
    L: .58, H: .26, seed: 439, top: '#b8e8e0', mid: '#f0fffc', belly: '#ffffff', eye: [.72, -.12, .075, '#10303a'],
    paint: (c, L, Hh) => { const r = mulberry(55); for (let i = 0; i < 22; i++) blob(c, L, Hh, -.9 + (i % 8) * .2, -.6 + Math.floor(i / 8) * .4 + (i % 2) * .1, .07, .12, `rgba(${i % 2 ? '160,220,255' : '255,200,230'},0.45)`, 5, r()); },
    under: (c, s) => halo(c, 0, 0, s * 1.2, '#c8fff0', .3),
    // 人魚一樣的長尾紗
    tail: { type: 'veil', len: 1.5, spread: .75, cols: ['#b8f0e8', '#a8d8ff', '#e0c8ff', '#fff0f8'], alpha: .8 },
    fins: [{ x0: .1, x1: -.6, h: .4, back: .9, cols: ['#b8f0e8', '#e0c8ff'], alpha: .8 }, { kind: 'pec', x: .35, y: .4, len: .3, cols: ['#ffffff', '#b8f0e8'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { c.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 3; i++) { circle(c, -L * (.1 + i * .3), -Hh * .7 + i * Hh * .15, s * .025); c.fill(); } },
  },
  starlitbetta: {
    L: .55, H: .28, seed: 443, top: '#0e1850', mid: '#28348a', belly: '#6a70c8', eye: [.72, -.12, .08, '#f0f0ff'],
    paint: (c, L, Hh) => { const r = mulberry(66); for (let i = 0; i < 16; i++) blob(c, L, Hh, -.9 + r() * 1.7, -.8 + r() * 1.5, .03, .05, 'rgba(255,250,210,0.9)', 5, r()); },
    under: (c, s) => halo(c, 0, 0, s * 1.2, '#6a70ff', .35),
    tail: { type: 'veil', len: 1.3, spread: 1.05, cols: ['#28348a', '#4a58c8', '#8a90ff', '#d0d8ff'], alpha: .85 },
    fins: [{ x0: .15, x1: -.8, h: .75, back: 1, cols: ['#28348a', '#6a70c8', '#b0b8ff'], alpha: .85 }, { dir: 1, x0: .25, x1: -.8, h: .8, back: 1.1, cols: ['#28348a', '#6a70c8'], alpha: .85 },
      { kind: 'pec', x: .35, y: .35, len: .3, cols: ['#b0b8ff', '#28348a'], alpha: .85 }],
    // 尾紗上的星星一閃一閃
    extra: (c, s, w, f, L) => { const ph = f ? f.phase : 0; for (let i = 0; i < 4; i++) twinkle(c, -L - s * (.3 + i * .22), Math.sin(i * 2.3) * s * .4 * (i + 1) / 4, s * .06, i + ph, '#fff8d0'); },
  },
  rosequartz: {
    L: .5, H: .32, seed: 449, shape: { nose: .55, hump: .2 }, top: '#ffc8dc', mid: '#ffe8f0', belly: '#fff4f8', eye: [.68, -.14, .085, '#401020'], nx: 5, ny: 3,
    paint: (c, L, Hh) => { for (const [a, b, d, col] of [[[L * .6, -Hh], [0, -Hh * .2], [L * .1, -Hh * 1.2], 'rgba(255,255,255,0.5)'], [[-L * .2, Hh], [-L, 0], [-L * .4, -Hh * .3], 'rgba(255,170,200,0.4)'], [[L, 0], [L * .3, Hh], [0, Hh * .2], 'rgba(230,160,255,0.35)']]) polyFill(c, [a, b, d], col); },
    under: (c, s) => halo(c, 0, 0, s * 1.2, '#ffc0e0', .4),
    tail: { type: 'fork', len: .6, spread: .55, cols: ['#ffd8e8', '#ffa8c8', '#e8b8ff'], alpha: .85, edge: 'rgba(255,255,255,0.5)' },
    fins: [{ x0: .1, x1: -.5, h: .4, back: .6, cols: ['#ffe0ec', '#ffa8c8'], alpha: .85, edge: 'rgba(255,255,255,0.5)' }, { kind: 'pec', x: .3, y: .4, len: .28, cols: ['#ffffff', '#ffc8dc'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { const ph = f ? f.phase * 2 : 0; twinkle(c, L * .3, -Hh * .6, s * .09, ph, '#ffffff'); twinkle(c, -L * .4, Hh * .1, s * .07, ph + 2, '#ffe0f0'); },
  },
  cloudfish: {
    L: .5, H: .32, seed: 457, shape: { nose: .75, hump: .3, belly: 1.1 }, top: '#f4f8ff', mid: '#ffffff', belly: '#ffffff', eye: [.66, -.1, .085, '#304060'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['rgba(255,220,240,0.35)', 'rgba(255,255,255,0)', 'rgba(200,220,255,0.4)']),
    // 身體周圍像棉花一樣的雲朵鰭
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + T * .3 + ph, r = s * (.12 + (i % 3) * .03); c.fillStyle = 'rgba(255,255,255,0.8)'; circle(c, -L * .2 + Math.cos(a) * L * .9, Math.sin(a) * Hh * 1.2, r); c.fill(); }
    },
    tail: { type: 'round', len: .6, spread: .55, cols: ['#ffffff', '#e8f0ff'], alpha: .9 },
    fins: [{ kind: 'pec', x: .3, y: .4, len: .26, cols: ['#ffffff', '#e8f0ff'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => blush(c, L * .55, Hh * .25, s * .06),
  },
  rainbowguppy: {
    L: .5, H: .24, seed: 461, top: '#e8e0ff', mid: '#ffffff', belly: '#ffffff', eye: [.72, -.1, .085, '#201040'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['rgba(255,200,120,0.5)', 'rgba(255,255,255,0)', 'rgba(180,160,255,0.5)']),
    // 大扇尾的顏色像彩虹一樣慢慢流轉
    under: (c, s, w, f, L) => {
      const h0 = Math.round((T * 30 + (f ? f.phase * 60 : 0)) / 10) * 10; c.save(); c.translate(-L + 2, 0); c.rotate(w * .75);
      for (let k = 0; k < 7; k++) { const a0 = -.75 + k * .214, a1 = a0 + .214, len = s * 1.35; polyFill(c, [[0, 0], [-Math.cos(a0) * len, Math.sin(a0) * len], [-Math.cos(a1) * len, Math.sin(a1) * len]], css(hsl((h0 + k * 40) % 360, .85, .75), .85)); }
      c.restore();
    },
    fins: [{ x0: .1, x1: -.6, h: .45, back: .8, cols: ['#ffd0f0', '#c8b8ff'], alpha: .85 }, { kind: 'pec', x: .35, y: .4, len: .26, cols: ['#ffffff', '#e0d8ff'], alpha: .85 }],
  },
  celestia: {
    L: .55, H: .3, seed: 463, top: '#1a1440', mid: '#3a2a80', belly: '#8a78d0', eye: [.72, -.12, .08, '#f0e8ff'],
    // 身上畫著星座連線
    paint: (c, L, Hh) => {
      const P = [[-.7, -.3], [-.4, -.55], [-.1, -.25], [.2, -.5], [.45, -.2], [-.3, .25], [.1, .35]];
      c.strokeStyle = 'rgba(220,230,255,0.55)'; c.lineWidth = 1.2; c.beginPath(); P.slice(0, 5).forEach(([u, v], i) => i ? c.lineTo(u * L, v * Hh) : c.moveTo(u * L, v * Hh)); c.moveTo(-.1 * L, -.25 * Hh); c.lineTo(-.3 * L, .25 * Hh); c.lineTo(.1 * L, .35 * Hh); c.stroke();
      for (const [u, v] of P) blob(c, L, Hh, u, v, .04, .07, '#fff8d8', 5);
    },
    under: (c, s) => halo(c, 0, 0, s * 1.3, '#9a88ff', .4),
    tail: { type: 'veil', len: 1.15, spread: .9, cols: ['#3a2a80', '#7a68d8', '#c8b8ff', '#fff0ff'], alpha: .85 },
    fins: [{ x0: .15, x1: -.7, h: .6, back: .9, cols: ['#3a2a80', '#9a88ff'], alpha: .85 }, { kind: 'pec', x: .35, y: .4, len: .3, cols: ['#c8b8ff', '#3a2a80'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { const ph = f ? f.phase : 0; twinkle(c, .45 * L, -.2 * Hh, s * .08, ph, '#fff8d8'); twinkle(c, -.4 * L, -.55 * Hh, s * .07, ph + 1.5, '#fff8d8'); },
  },
  sunbird: {
    L: .55, H: .27, seed: 467, top: '#ff8a5a', mid: '#ffc070', belly: '#fff0c0', eye: [.72, -.12, .08, '#401000'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['rgba(255,240,150,0.6)', 'rgba(255,150,100,0.2)', 'rgba(255,110,150,0.55)']),
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 1.3, '#ffc070', .35);
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      [['#ffd870', -1], ['#ff9ab0', 1]].forEach(([col, d], k) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .34 * j, d * s * (.04 + j * .07) + Math.sin(T * 1.8 + j * .8 + k * 2 + ph) * s * .1 * j / 5 + w * s * j * .25]), s * .07, col, .75));
      c.restore();
    },
    tail: { type: 'fan', len: .8, spread: .7, cols: ['#fff0b0', '#ffb070', '#ff8aa0'], alpha: .88 },
    fins: [{ x0: .15, x1: -.6, h: .55, back: .9, cols: ['#ffd870', '#ff8a5a'], alpha: .88 }, { kind: 'pec', x: .35, y: .4, len: .3, cols: ['#fff0c0', '#ffb070'], alpha: .9 }],
  },
  mermaidangel: {
    L: .46, H: .5, seed: 473, shape: { nose: .45, hump: .05, tail: .3 }, top: '#fff4f8', mid: '#ffffff', belly: '#fffaf4', eye: [.66, -.2, .08, '#302030'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,220,235,0.5)', 'rgba(230,240,255,0.3)', 'rgba(255,240,220,0.5)']); for (let i = 0; i < 3; i++) band(c, L, Hh, .4 - i * .4, .05, -.15, 'rgba(255,255,255,0.55)'); },
    under: (c, s) => halo(c, 0, 0, s * 1.4, '#fff0f8', .45),
    tail: { type: 'veil', len: .9, spread: .8, cols: ['#ffffff', '#ffe8f0', '#f0e8ff'], alpha: .85 },
    // 上下長鰭像天使的翅膀，邊緣帶一點金色
    fins: [{ x0: .3, x1: -.45, h: 1.1, back: 1.25, cols: ['#ffffff', '#fff0f4', '#ffe8b8'], alpha: .85, edge: 'rgba(255,215,140,0.6)' }, { dir: 1, x0: .3, x1: -.45, h: 1.1, back: 1.25, cols: ['#ffffff', '#f0f0ff', '#ffe8b8'], alpha: .85, edge: 'rgba(255,215,140,0.6)' },
      { kind: 'pec', x: .3, y: .25, len: .3, cols: ['#ffffff', '#ffe8f0'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { c.fillStyle = 'rgba(255,255,255,0.95)'; for (let i = 0; i < 3; i++) { circle(c, L * (.1 - i * .25), Hh * (.55 - i * .05), s * .03); c.fill(); } twinkle(c, L * .2, -Hh * .5, s * .08, f ? f.phase : 0); },
  },
  galaxyangel: {
    L: .48, H: .5, seed: 479, shape: { nose: .45, hump: .05, tail: .3 }, top: '#140a3a', mid: '#3a1a8a', belly: '#8a5ad8', eye: [.66, -.2, .08, '#f0e8ff'],
    paint: (c, L, Hh) => { blob(c, L, Hh, -.1, .2, .5, .7, 'rgba(255,90,200,0.35)', 7); blob(c, L, Hh, .3, -.3, .3, .4, 'rgba(90,220,255,0.3)', 6); },
    under: (c, s) => halo(c, 0, 0, s * 1.5, '#b890ff', .45),
    tail: { type: 'veil', len: .95, spread: .85, cols: ['#3a1a8a', '#8a6aff', '#ff9ae8', '#fff0ff'], alpha: .85 },
    fins: [{ x0: .3, x1: -.45, h: 1.0, back: 1.15, cols: ['#3a1a8a', '#8a6aff', '#ffc8f0'], alpha: .85 }, { dir: 1, x0: .3, x1: -.45, h: 1.0, back: 1.15, cols: ['#3a1a8a', '#6ad0ff', '#fff0ff'], alpha: .85 },
      { kind: 'pec', x: .3, y: .25, len: .3, cols: ['#ffffff', '#c8b0ff'], alpha: .85 }],
    // 身上的星空＋頭頂一圈淡金色光環
    extra: (c, s, w, f, L, Hh) => {
      GALAXY_DOTS.forEach(([x, y, r], i) => { if (i % 2) return; c.fillStyle = `rgba(255,255,255,${.45 + .55 * Math.sin(T * 3 + i)})`; circle(c, x * L * .8, y * Hh * .8, r * Hh * .5 + .5); c.fill(); });
      c.strokeStyle = 'rgba(255,230,150,0.85)'; c.lineWidth = Math.max(1.2, s * .03); ell(c, L * .35, -Hh * 1.3 + Math.sin(T * 2 + (f ? f.phase : 0)) * s * .03, s * .14, s * .04); c.stroke();
    },
  },
  // ---- 新夢幻魚：不死鳥、海之女神（其他三種用水母、鯨魚、龍的造型，在 dream-fish-2.js） ----
  phoenixlord: {
    L: .85, H: .36, seed: 487, top: '#ff6a3a', mid: '#ffb050', belly: '#fff0b0', eye: [.72, -.15, .06, '#3a0800'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,250,200,0.6)', 'rgba(255,160,80,0.1)', 'rgba(255,80,120,0.5)']); for (let i = 0; i < 4; i++) band(c, L, Hh, .3 - i * .33, .03, .25, 'rgba(255,245,190,0.5)'); },
    // 金紅色的長尾羽，羽尖有火焰般的眼斑
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 1.8, '#ffb060', .45);
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      [['#ffd860', '#ff5a3a'], ['#ff9a5a', '#ffd860'], ['#ff6a8a', '#ffe0a0'], ['#ffc040', '#ff7a3a']].forEach(([col, eye], k) => {
        const pts = [0, 1, 2, 3, 4, 5, 6].map(j => [-s * .32 * j, (k - 1.5) * s * (.04 + j * .07) + Math.sin(T * 1.7 + j * .8 + k * 1.3 + ph) * s * .12 * j / 6 + w * s * j * .25]);
        ribbon(c, pts, s * .09, col, .85); const [ex, ey] = pts[6]; c.fillStyle = eye; ell(c, ex, ey, s * .08, s * .05); c.fill();
      });
      c.restore();
    },
    tail: { type: 'fan', len: .9, spread: .8, cols: ['#fff0a0', '#ffb050', '#ff6a3a'], alpha: .9 },
    fins: [{ x0: .35, x1: -.55, h: .7, back: .8, cols: ['#ffe070', '#ff9a4a', '#ff5a3a'], alpha: .9 }, { kind: 'pec', x: .35, y: .35, len: .35, cols: ['#fff0b0', '#ff8a4a'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => {
      for (let k = 0; k < 3; k++) { const x0 = L * (.55 - k * .12), tip = [x0 - s * (.18 + k * .05), -Hh - s * (.45 - k * .08) + Math.sin(T * 3 + k) * s * .03]; c.strokeStyle = 'rgba(255,215,110,0.95)'; c.lineWidth = Math.max(1, s * .03); c.beginPath(); c.moveTo(x0, -Hh * .85); c.quadraticCurveTo(x0 + s * .05, tip[1] + s * .1, tip[0], tip[1]); c.stroke(); c.fillStyle = '#ff7a3a'; circle(c, tip[0], tip[1], s * .045); c.fill(); }
      sparkles(c, s, f, '#fff0b0', 6);
    },
  },
  goddessfish: {
    L: .75, H: .34, seed: 491, top: '#fff4fa', mid: '#ffffff', belly: '#ffffff', eye: [.74, -.14, .06, '#301040'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,220,240,0.55)', 'rgba(220,230,255,0.3)', 'rgba(230,210,255,0.55)']); for (let i = 0; i < 5; i++) band(c, L, Hh, .4 - i * .3, .018, .3, 'rgba(255,215,130,0.6)'); },
    // 女神的羽衣：好幾層半透明的長紗，頭上戴著金色小皇冠
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 2, '#fff0d8', .5);
      c.save(); c.translate(-L * .1, 0);
      ['#ffd8f0', '#d8e0ff', '#fff0c8', '#e0d0ff'].forEach((col, k) => ribbon(c, [0, 1, 2, 3, 4, 5, 6, 7].map(j => [-s * .36 * j, (k - 1.5) * s * (.1 + j * .07) + Math.sin(T * 1.4 + j * .7 + k * 1.6 + ph) * s * .14 * j / 7 + w * s * j * .25]), s * .1, col, .55));
      c.restore();
    },
    tail: { type: 'veil', len: 1.5, spread: 1.2, cols: ['#ffffff', '#ffe0f0', '#e0e8ff', '#fff4d8'], alpha: .8 },
    fins: [{ x0: .2, x1: -.8, h: .95, back: 1.1, cols: ['#ffffff', '#ffe0f4', '#e0e0ff'], alpha: .8 }, { dir: 1, x0: .3, x1: -.8, h: 1.0, back: 1.2, cols: ['#ffffff', '#e8e0ff', '#fff0d8'], alpha: .8 },
      { kind: 'pec', x: .4, y: .4, len: .45, cols: ['#ffffff', '#ffe8f4'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => {
      const x = L * .5, y = -Hh * 1.02;
      polyFill(c, [[x - s * .14, y], [x - s * .12, y - s * .14], [x - s * .05, y - s * .06], [x, y - s * .18], [x + s * .05, y - s * .06], [x + s * .12, y - s * .14], [x + s * .14, y]], '#ffd870');
      c.fillStyle = '#ff8ab8'; circle(c, x, y - s * .05, s * .025); c.fill();
      sparkles(c, s, f, '#fff6e0', 6);
    },
  },
});
for (const id in MODELS) MODELS[id].id = id;
