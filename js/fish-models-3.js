// 第 66～85 種魚的外觀設定（fish-models-3.js）
// 用同一套「夢幻魚模板」組出來：每種魚換配色、體型、花紋和點綴，品質一致又各有特色
// 參數：c 身體三色、fin 鰭與尾的顏色、glow 光暈色、shape 體型、tail 尾型、long 長鰭、pattern 花紋、acc 點綴（可多個，第 101 種起多了 snow 雪花、hearts 愛心）
function dreamModel(o) {
  const seed = o.seed, [top, mid, belly] = o.c, fin = o.fin, P = o.pattern, A = o.acc || [];
  const tall = o.shape === 'angel', round = o.shape === 'round';
  return {
    L: o.L || (tall ? .46 : round ? .45 : .55), H: o.H || (tall ? .5 : round ? .38 : .28), seed,
    shape: tall ? { nose: .45, hump: .05, tail: .3 } : round ? { nose: .75, hump: .3, belly: 1.1 } : o.koi ? { nose: .6, tail: .3 } : undefined,
    top, mid, belly, eye: [tall ? .66 : .72, tall ? -.2 : -.12, round ? .09 : .08, o.eye || '#201030'],
    paint: (c, L, Hh) => {
      if (o.sheen) hGrad(c, L, Hh, o.sheen, .55);
      const r = mulberry(seed);
      if (P === 'scales') for (let i = 0; i < 20; i++) blob(c, L, Hh, -.9 + (i % 7) * .27, -.6 + Math.floor(i / 7) * .45 + (i % 2) * .12, .07, .11, o.pc || 'rgba(255,255,255,0.4)', 5, r());
      else if (P === 'spots') for (let i = 0; i < 7; i++) blob(c, L, Hh, -.7 + r() * 1.3, -.6 + r() * .9, .12 + r() * .1, .2 + r() * .12, o.pc, 7, r());
      else if (P === 'stripes') for (let i = 0; i < 3; i++) band(c, L, Hh, .35 - i * .35, .05, .2, o.pc);
      else if (P === 'stars') for (let i = 0; i < 14; i++) blob(c, L, Hh, -.9 + r() * 1.7, -.8 + r() * 1.5, .03, .05, o.pc || 'rgba(255,250,210,0.9)', 5, r());
      else if (P === 'band') polyFill(c, [[L * 1.1, -Hh * .2], [-L * 1.1, -Hh * .1], [-L * 1.1, Hh * .12], [L * 1.1, Hh * .05]], o.pc);
      else if (P === 'flecks') for (let i = 0; i < 26; i++) blob(c, L, Hh, -.9 + r() * 1.8, -.8 + r() * 1.6, .025, .04, o.pc, 4, r());
    },
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      if (o.glow) halo(c, 0, 0, s * (o.koi ? 1.6 : 1.35), o.glow, .4);
      if (A.includes('ribbons')) { c.save(); c.translate(-L + 2, 0); c.rotate(w * .5); (o.rib || [fin[1], fin[2] || fin[0]]).forEach((col, k, arr) => ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .34 * j, (k - (arr.length - 1) / 2) * s * (.05 + j * .07) + Math.sin(T * 1.8 + j * .8 + k * 1.7 + ph) * s * .1 * j / 5 + w * s * j * .25]), s * .07, col, .75)); c.restore(); }
      if (A.includes('wings')) {
        const fl = .6 + .4 * Math.abs(Math.sin(T * 5 + ph)), a0 = c.globalAlpha;
        for (const k of [0, 1]) { c.save(); c.translate(-L * .05, -Hh * .7); c.scale(1, fl); c.rotate(-.35 - k * .45); c.globalAlpha = a0 * (k ? .55 : .8); polyFill(c, [[0, 0], [-s * .15, -s * .55], [-s * .5, -s * .6], [-s * .4, -s * .2]], o.wing || '#ffffff'); c.restore(); }
        c.globalAlpha = a0;
      }
      if (A.includes('petals')) for (let i = 0; i < 4; i++) { const a = T * .8 + i * 1.57 + ph; c.save(); c.translate(-L * 1.3 + Math.cos(a) * s * .55, Math.sin(a * 1.3) * s * .6); c.rotate(T * 2 + i); c.fillStyle = o.petal || '#ffc8dc'; ell(c, 0, 0, s * .08, s * .045); c.fill(); c.restore(); }
      if (A.includes('bubbles')) { const sp = bubbleSpr(); for (let i = 0; i < 3; i++) { const q = (T * .4 + i / 3 + ph) % 1, r = s * .12 * (.6 + q * .5); c.globalAlpha = (1 - q) * .9; c.drawImage(sp, -L * .2 + Math.sin(q * 6 + i) * s * .2 - r, -Hh - q * s * 1.5 - r, r * 2, r * 2); } c.globalAlpha = 1; }
    },
    tail: { type: o.tail || 'veil', len: o.tl || (o.tail === 'fork' || o.tail === 'round' ? .6 : 1.15), spread: o.ts || (o.tail === 'fork' || o.tail === 'round' ? .5 : .95), cols: fin, alpha: o.fa || .85, edge: o.edge },
    fins: [
      o.long ? { x0: tall ? .3 : .15, x1: tall ? -.45 : -.8, h: tall ? 1.0 : .75, back: tall ? 1.15 : 1, cols: fin, alpha: o.fa || .85, edge: o.edge } : { x0: .1, x1: -.5, h: .4, back: .6, cols: fin, alpha: o.fa || .85, edge: o.edge },
      ...(o.long ? [{ dir: 1, x0: tall ? .3 : .25, x1: tall ? -.45 : -.8, h: tall ? 1.0 : .8, back: tall ? 1.15 : 1.1, cols: fin.slice().reverse(), alpha: o.fa || .85, edge: o.edge }] : []),
      { kind: 'pec', x: .35, y: .4, len: .3, cols: [belly.startsWith('#') ? belly : '#ffffff', fin[0]], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      if (o.koi) whisker(c, s, w, L, Hh, o.whisker || 'rgba(255,215,110,0.9)');
      if (A.includes('ring')) { c.strokeStyle = 'rgba(255,225,140,0.9)'; c.lineWidth = Math.max(1.2, s * .03); ell(c, L * .35, -Hh * (tall ? 1.3 : 1.6) + Math.sin(T * 2 + ph) * s * .03, s * .14, s * .04); c.stroke(); }
      if (A.includes('crown')) { const x = L * .45, y = -Hh * .98; polyFill(c, [[x - s * .12, y], [x - s * .1, y - s * .12], [x - s * .04, y - s * .05], [x, y - s * .15], [x + s * .04, y - s * .05], [x + s * .1, y - s * .12], [x + s * .12, y]], o.crown || '#ffd870'); }
      if (A.includes('orb')) { const a = T * 1.3 + ph, x = Math.cos(a) * s * .9, y = Math.sin(a) * s * .5; halo(c, x, y, s * .25, o.orb || '#fff4d0', .8); c.fillStyle = '#ffffff'; circle(c, x, y, s * .05); c.fill(); }
      if (A.includes('antenna')) { const bx = L * 1.15, by = -Hh * 1.5 + Math.sin(T * 2 + ph) * s * .04; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = Math.max(1, s * .02); c.beginPath(); c.moveTo(L * .55, -Hh * .8); c.quadraticCurveTo(L * .9, -Hh * 1.8, bx, by); c.stroke(); halo(c, bx, by, s * .3, o.orb || '#fff0b0', .8); }
      if (A.includes('twinkle')) { twinkle(c, L * .2, -Hh * .45, s * .09, ph, '#ffffff'); twinkle(c, -L * .4, Hh * .2, s * .07, ph + 2, '#ffffff'); }
      if (A.includes('sparkle')) sparkles(c, s, f, o.spark || '#ffffff', 4);
      if (A.includes('snow')) for (let i = 0; i < 3; i++) { const q = (T * .22 + i / 3 + ph) % 1; c.globalAlpha = Math.sin(q * Math.PI) * .9; snowflake(c, -L * .9 + i * L * .7, -Hh * 2.2 + q * Hh * 4.4, s * .07, T + i); c.globalAlpha = 1; }
      if (A.includes('hearts')) for (let i = 0; i < 2; i++) { const q = (T * .35 + i / 2 + ph) % 1; c.globalAlpha = (1 - q) * .85; c.fillStyle = o.heart || '#ff9ac0'; heartShape(c, L * (.1 - i * .4) + Math.sin(T * 2 + i) * s * .08, -Hh * 1.2 - q * s * .9, s * (.05 + q * .03)); c.globalAlpha = 1; }
    },
  };
}
Object.assign(MODELS, {
  mistveil:      dreamModel({ seed: 501, c: ['#d8d0e8', '#f4f0fa', '#ffffff'], fin: ['#f0ecf8', '#d8d0f0', '#c0c8e8'], glow: '#e0d8f0', sheen: ['rgba(255,240,250,0.4)', 'rgba(220,220,255,0.3)', 'rgba(200,210,240,0.5)'], pattern: 'scales', long: true, fa: .7, acc: ['twinkle'] }),
  lilyfin:       dreamModel({ seed: 503, c: ['#fff4d0', '#fffcf0', '#ffffff'], fin: ['#ffffff', '#fff4d8', '#ffe8a0'], glow: '#fff0c0', sheen: ['rgba(255,230,140,0.5)', 'rgba(255,255,255,0)', 'rgba(255,250,220,0.4)'], tail: 'fan', long: true, acc: ['petals'], petal: '#fffbe8' }),
  jadekoi:       dreamModel({ seed: 507, koi: true, L: .6, H: .27, c: ['#e8fff0', '#ffffff', '#f8fff8'], fin: ['#f0fff4', '#b8f0cc', '#e8fff0'], glow: '#c8f4d8', pattern: 'spots', pc: '#58c890', acc: ['sparkle'], spark: '#e0ffe8' }),
  twilightbetta: dreamModel({ seed: 509, c: ['#6a3a8a', '#c86a8a', '#ffc090'], fin: ['#ff9a70', '#d86aa8', '#7a5ad8', '#3a3a9a'], glow: '#d88ab0', sheen: ['rgba(255,200,120,0.5)', 'rgba(200,100,180,0.2)', 'rgba(90,80,200,0.5)'], long: true, acc: ['twinkle'] }),
  bubblepuff:    dreamModel({ seed: 511, shape: 'round', c: ['#ffc8e0', '#ffe4f0', '#fff4fa'], fin: ['#ffd8ec', '#ffb0d0'], glow: '#ffd0e8', tail: 'round', pattern: 'spots', pc: 'rgba(255,255,255,0.6)', acc: ['bubbles'] }),
  feathertail:   dreamModel({ seed: 513, c: ['#c8f0ff', '#f0fcff', '#ffffff'], fin: ['#e8fbff', '#9ae0ff', '#c8b8ff'], glow: '#c8f0ff', tail: 'fan', acc: ['ribbons'], rib: ['#9ae8ff', '#ffffff', '#c8b8ff'] }),
  lavenderangel: dreamModel({ seed: 517, shape: 'angel', c: ['#c8b0f0', '#ece0ff', '#fff4ff'], fin: ['#e8d8ff', '#c0a0f0', '#fff0ff'], glow: '#d8c0ff', pattern: 'stripes', pc: 'rgba(255,255,255,0.5)', long: true, acc: ['twinkle'] }),
  prismtetra:    dreamModel({ seed: 519, L: .5, H: .22, c: ['#304060', '#5a70a0', '#d0e0ff'], fin: ['#a0b8ff', '#e0e8ff'], glow: '#a0c8ff', tail: 'fork', pattern: 'band', pc: 'rgba(120,255,230,0.9)', acc: ['sparkle'], spark: '#c0fff0' }),
  frostwing:     dreamModel({ seed: 521, c: ['#d0ecff', '#f0faff', '#ffffff'], fin: ['#ffffff', '#c8e8ff', '#a8d0ff'], glow: '#d8f0ff', pattern: 'flecks', pc: 'rgba(255,255,255,0.9)', acc: ['wings'], wing: '#e8f6ff' }),
  peachblossom:  dreamModel({ seed: 523, c: ['#ffb8a0', '#ffe0d0', '#fff6f0'], fin: ['#fff0e8', '#ffc0b0', '#ff98a8', '#ffd8d0'], glow: '#ffc8b8', long: true, acc: ['petals'], petal: '#ffb8c8' }),
  auroraneon:    dreamModel({ seed: 527, L: .5, H: .22, c: ['#182848', '#2a4a7a', '#a0c8e8'], fin: ['#5ae8c8', '#8a90ff', '#ff9ae0'], glow: '#7af0d8', tail: 'fork', pattern: 'band', pc: 'rgba(160,255,220,0.85)', acc: ['ribbons'], rib: ['#5ae8c8', '#b090ff'] }),
  pearlmoon:     dreamModel({ seed: 529, c: ['#f0ecf4', '#ffffff', '#ffffff'], fin: ['#ffffff', '#f0e8f8', '#e8f0ff'], glow: '#fff8f0', sheen: ['rgba(255,230,240,0.4)', 'rgba(230,240,255,0.3)', 'rgba(255,245,220,0.4)'], long: true, acc: ['orb'], orb: '#fff4e0' }),
  sapphire:      dreamModel({ seed: 531, c: ['#0a2a7a', '#2a5ad0', '#90c0ff'], fin: ['#3a6ae0', '#80b0ff', '#d0e4ff'], glow: '#5a90ff', pattern: 'flecks', pc: 'rgba(200,230,255,0.9)', edge: 'rgba(255,255,255,0.4)', acc: ['sparkle'], spark: '#d8ecff' }),
  goldleaf:      dreamModel({ seed: 533, c: ['#3a0a14', '#7a1a28', '#c84a50'], fin: ['#a01a30', '#d84050', '#ffc860'], glow: '#ffb060', pattern: 'flecks', pc: 'rgba(255,215,100,0.95)', long: true, acc: ['sparkle'], spark: '#ffe8a0' }),
  cherubfish:    dreamModel({ seed: 537, shape: 'round', c: ['#fff4f8', '#ffffff', '#ffffff'], fin: ['#ffffff', '#ffe8f0'], glow: '#fff4e0', tail: 'round', acc: ['wings', 'ring'], wing: '#ffffff' }),
  starbloom:     dreamModel({ seed: 539, c: ['#ffd8f0', '#fff0fa', '#ffffff'], fin: ['#ffe0f4', '#ffb8e0', '#e0c8ff', '#fff0b0'], glow: '#ffd0f0', pattern: 'stars', pc: 'rgba(255,220,120,0.95)', long: true, acc: ['petals', 'twinkle'], petal: '#fff0b0' }),
  opalveil:      dreamModel({ seed: 541, c: ['#f0f0ff', '#ffffff', '#fffaf4'], fin: ['#ffd0e8', '#d0e8ff', '#d8ffe8', '#fff0c8'], glow: '#e8e0ff', sheen: ['#ffd0e8', '#d0f0ff', '#e8d8ff', '#d8ffe8'], long: true, acc: ['ribbons'], rib: ['#ffc0e0', '#b8e0ff', '#c8ffd8'] }),
  moonveil:      dreamModel({ seed: 543, c: ['#b8c0e0', '#e8ecff', '#ffffff'], fin: ['#e8ecff', '#c0c8f0', '#fff4d0'], glow: '#e0e8ff', pattern: 'scales', pc: 'rgba(255,255,255,0.45)', long: true, acc: ['crown', 'orb'], crown: '#fff0b0', orb: '#fff8e0' }),
  starkoi:       dreamModel({ seed: 547, koi: true, L: .62, H: .28, c: ['#141a50', '#283880', '#6a78c8'], fin: ['#283880', '#8a90ff', '#e8e0ff'], glow: '#8a90ff', pattern: 'stars', acc: ['ribbons', 'sparkle'], rib: ['#a0b0ff', '#ffe0a0'], whisker: 'rgba(255,240,180,0.9)', spark: '#fff8d8' }),
  empress:       dreamModel({ seed: 551, c: ['#fff0d8', '#ffffff', '#fff8f0'], fin: ['#fff0b0', '#ffc8d8', '#e0c0ff', '#ffffff'], glow: '#ffe0a0', sheen: ['rgba(255,210,120,0.55)', 'rgba(255,180,210,0.3)', 'rgba(210,180,255,0.5)'], pattern: 'flecks', pc: 'rgba(255,215,110,0.8)', long: true, acc: ['ribbons', 'crown', 'sparkle'], rib: ['#ffd870', '#ff9ac8', '#c8a0ff'], spark: '#fff4c0' }),
});
for (const id in MODELS) MODELS[id].id = id;

// 小雪花：三條交叉的線，慢慢轉
function snowflake(c, x, y, r, rot) {
  c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = Math.max(1, r * .22); c.beginPath();
  for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.moveTo(-Math.cos(a) * r, -Math.sin(a) * r); c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  c.stroke(); c.restore();
}
// 小愛心
function heartShape(c, x, y, r) {
  c.beginPath(); c.moveTo(x, y + r * .9); c.bezierCurveTo(x - r * 1.4, y - r * .1, x - r * .6, y - r * 1.1, x, y - r * .35); c.bezierCurveTo(x + r * .6, y - r * 1.1, x + r * 1.4, y - r * .1, x, y + r * .9); c.fill();
}
