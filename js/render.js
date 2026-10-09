// 每一幀的繪製、星星背景、戳泡泡小遊戲（render.js）
// ====== 繪製 ======
function drawDynamicBg() {
  const bg = BG[state.bg], th = THEME[bg.id] || THEME.fresh;
  // 水面的光帶
  const sb = ctx.createLinearGradient(0, 0, 0, 60); sb.addColorStop(0, 'rgba(255,255,255,0.22)'); sb.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sb; ctx.fillRect(0, 0, W, 60);
  // 光束：寬窄不一、緩慢飄移與明滅
  if (bg.ray > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const x = W * (.04 + i * .15) + Math.sin(T * .25 + i * 1.7) * 45, wd = 22 + (i % 3) * 18, a = bg.ray * (.55 + .45 * Math.sin(T * .6 + i * 2.1));
      const g = ctx.createLinearGradient(0, 0, 0, FLOOR + 20); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.7, `rgba(255,255,255,${a * .35})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - wd * .5, 0); ctx.lineTo(x + wd * .5, 0); ctx.lineTo(x + wd * 2.2 + 90, FLOOR + 20); ctx.lineTo(x + wd * .4 + 60, FLOOR + 20); ctx.fill();
    }
    ctx.restore();
  }
  // 沙地上晃動的水光紋
  if (th.caus > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,255,255,${th.caus})`; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 25) { const y = FLOOR + 10 + i * 7 + Math.sin(x * .025 + T * 1.1 + i * 1.7) * 5 + Math.sin(x * .061 - T * .8 + i) * 3; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    ctx.restore();
  }
  // 繁殖燈：水面上吊著一盞燈，往下灑出粉紅色的光
  if (state.lampLv > 0) {
    const lx = W * .45, a = [0, .08, .12, .17][state.lampLv] * (.85 + .15 * Math.sin(T * 1.5));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, 10, 0, FLOOR); g.addColorStop(0, `rgba(255,150,200,${a * 1.6})`); g.addColorStop(1, 'rgba(255,150,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(lx - 14, 14); ctx.lineTo(lx + 14, 14); ctx.lineTo(lx + 170, FLOOR); ctx.lineTo(lx - 170, FLOOR); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(60,40,60,0.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, 8); ctx.stroke();
    ctx.fillStyle = '#6a4a6a'; ctx.beginPath(); ctx.moveTo(lx - 13, 16); ctx.lineTo(lx - 6, 7); ctx.lineTo(lx + 6, 7); ctx.lineTo(lx + 13, 16); ctx.fill();
    halo(ctx, lx, 17, 22, '#ffb0d8', .9); ctx.fillStyle = '#fff0f8'; ell(ctx, lx, 16, 8, 3); ctx.fill();
  }
  // 後排的造景（城堡、拱門、沉船）在海草後面
  drawScene(0);
  // 擺動的低多邊形海草：每一節分成深淺兩片三角形
  const [pc0, pc1] = th.plant.map(hex);
  // 後排有擺出來的造景時，前面的海草先移開，才看得清楚
  const back = SCENE.filter(p => !p.layer && state.scene[p.id].look).map(p => [scenePos(p).x, p.box[state.scene[p.id].look - 1][0] * sceneK(p) * .8]);
  for (const p of PLANTS) {
    if (back.some(([x, hw]) => Math.abs(p.x - x) < hw)) continue;
    const n = 6, L = [], R = [];
    for (let k = 0; k <= n; k++) {
      const q = k / n, sway = Math.sin(T * 1.1 + p.ph + q * 1.8) * q * 26 + p.bend * q * q, x = p.x + sway, y = FLOOR + 6 - p.h * q, hw = p.w * Math.sin(Math.PI * (.18 + q * .72)) * (1 - q * .35);
      L.push([x - hw, y]); R.push([x + hw, y]);
    }
    const dark = css(bright(p.k ? pc1 : pc0, .75), .9), lite = css(p.k ? pc1 : pc0, .9);
    for (let k = 0; k < n; k++) {
      const mid = [(L[k + 1][0] + R[k + 1][0]) / 2, (L[k + 1][1] + R[k + 1][1]) / 2];
      lpTri(ctx, L[k], R[k], mid, k % 2 ? lite : dark); lpTri(ctx, L[k], mid, L[k + 1], dark); lpTri(ctx, R[k], R[k + 1], mid, lite);
    }
    if (th.snowGlow) {
      const [tx, ty] = L[n], gg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 14); gg.addColorStop(0, css(pc1, .9)); gg.addColorStop(1, css(pc1, 0));
      ctx.fillStyle = gg; ctx.fillRect(tx - 14, ty - 14, 28, 28);
    }
  }
  if (bg.id === 'sakura') {
    for (let i = 0; i < 28; i++) {
      const x = ((i * 211.7 + T * (12 + i % 5 * 4) + Math.sin(T * .8 + i) * 30) % (W + 40) + W + 40) % (W + 40) - 20, y = (i * 97.1 + T * (14 + i % 4 * 5)) % (FLOOR + 20) - 10;
      ctx.save(); ctx.translate(x, y); ctx.rotate(T * (1 + i % 3) + i);
      ctx.fillStyle = i % 3 ? 'rgba(255,190,215,0.9)' : 'rgba(255,225,238,0.9)'; ell(ctx, 0, 0, 5, 3); ctx.fill(); ctx.restore();
    }
  } else if (bg.id === 'volcano') {
    for (let i = 0; i < 30; i++) {
      const x = W * .62 + Math.sin(T * .7 + i * 2.3) * (40 + i * 9), y = FLOOR - 280 - ((T * (22 + i % 6 * 6) + i * 53) % 260) + 260 - 20;
      ctx.fillStyle = `rgba(255,${120 + (i % 4) * 30},40,${.5 + .4 * Math.sin(T * 3 + i)})`; circle(ctx, x, y, 1.5 + (i % 3)); ctx.fill();
    }
  }
  if (bg.starPrice) drawStarBgDynamic(bg);
  // 海中微粒（海雪），深色背景會發光
  for (let i = 0; i < 46; i++) {
    const x = ((i * 157.3 + T * (4 + i % 5) * (i % 2 ? 1 : -1)) % W + W) % W, y = (i * 83.7 + T * (6 + i % 4)) % (FLOOR - 20) + 10;
    const glowS = th.snowGlow, a = glowS ? .35 + .35 * Math.sin(T * 2 + i) : .28 + .12 * Math.sin(T + i);
    ctx.fillStyle = glowS ? `rgba(150,255,235,${a})` : `rgba(255,255,255,${a})`;
    circle(ctx, x, y, 1 + (i % 3) * .6); ctx.fill();
  }
  if (bg.id === 'galaxy' && Math.sin(T * .7) > .995) {
    const x = (T * 97) % W; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x - 60, 80); ctx.stroke();
  }
  if (bg.id === 'jelly') {
    for (let i = 0; i < 5; i++) {
      const x = (i * 230 + T * 8) % (W + 100) - 50, y = 120 + i * 60 % 250 + Math.sin(T * .8 + i) * 25, pulse = 1 + Math.sin(T * 2 + i) * .1;
      const col = ['255,120,220', '120,200,255', '180,140,255'][i % 3];
      ctx.save(); ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 20; ctx.fillStyle = `rgba(${col},0.35)`;
      ctx.beginPath(); ctx.ellipse(x, y, 26 * pulse, 20, 0, Math.PI, 0); ctx.fill(); ctx.restore();
      ctx.strokeStyle = `rgba(${col},0.35)`; ctx.lineWidth = 2;
      for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(x + k * 9, y); ctx.quadraticCurveTo(x + k * 9 + Math.sin(T * 2 + k) * 8, y + 30, x + k * 7, y + 55); ctx.stroke(); }
    }
  }
}

// ====== 星星兌換的限定背景：越貴越夢幻 ======
// 小圖快取：同一個圖案只畫一次，之後每幀直接貼上
const SPR_CACHE = {};
function cachedSprite(key, size, draw) {
  if (SPR_CACHE[key]) return SPR_CACHE[key];
  const R = 2, cv = document.createElement('canvas'); cv.width = cv.height = size * R;
  const c = cv.getContext('2d'); c.scale(R, R); draw(c, size);
  return SPR_CACHE[key] = cv;
}
const bubbleSpr = () => cachedSprite('bubble', 40, (c, S) => {
  const g = c.createRadialGradient(S * .5, S * .5, S * .3, S * .5, S * .5, S * .48); g.addColorStop(0, 'rgba(255,255,255,0.05)'); g.addColorStop(.75, 'rgba(255,190,240,0.35)'); g.addColorStop(.9, 'rgba(160,240,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; circle(c, S / 2, S / 2, S * .48); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.85)'; ell(c, S * .36, S * .32, S * .09, S * .05, -.6); c.fill();
});
const lanternSpr = () => cachedSprite('lantern', 60, (c, S) => {
  glowDot(c, S / 2, S * .55, S * .5, '#ffa040', .55);
  const g = c.createLinearGradient(0, S * .3, 0, S * .78); g.addColorStop(0, '#fff0b0'); g.addColorStop(1, '#ff7a3a');
  c.fillStyle = g; c.beginPath(); c.moveTo(S * .36, S * .3); c.lineTo(S * .64, S * .3); c.lineTo(S * .68, S * .72); c.quadraticCurveTo(S * .5, S * .8, S * .32, S * .72); c.closePath(); c.fill();
  c.fillStyle = 'rgba(120,40,20,0.8)'; c.fillRect(S * .35, S * .27, S * .3, S * .04);
  glowDot(c, S / 2, S * .66, S * .12, '#fffbe0', .9);
});
const glowSpr = col => cachedSprite('glow' + col, 32, (c, S) => { glowDot(c, S / 2, S / 2, S / 2, col, .9); c.fillStyle = '#ffffff'; circle(c, S / 2, S / 2, S * .07); c.fill(); });
let CRYSTAL_TIPS = [];
function drawStarBgStatic(c, bg, r, stage) {
  const id = bg.id;
  if (stage === 'sky') {
    if (id === 'bubblepink') {
      // 粉彩的柔焦光點
      for (let i = 0; i < 16; i++) glowDot(c, r() * W, 40 + r() * (FLOOR - 200), 30 + r() * 70, ['#ffc0e8', '#d8c0ff', '#b8fff0', '#fff0c0'][i % 4], .35);
    } else if (id === 'moonsea') {
      const mx = W * .3, my = 95;
      for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(255,255,240,${.2 + r() * .6})`; const rr = r() < .1 ? 2 : 1; c.fillRect(r() * W, r() * 300, rr, rr); }
      glowDot(c, mx, my, 280, '#fffadc', .35); glowDot(c, mx, my, 90, '#fffadc', .6);
      const mg = c.createRadialGradient(mx - 12, my - 12, 4, mx, my, 46); mg.addColorStop(0, '#fffef4'); mg.addColorStop(1, '#e8e2c0');
      c.fillStyle = mg; circle(c, mx, my, 46); c.fill();
      c.fillStyle = 'rgba(200,190,150,0.35)'; for (const [dx, dy, rr] of [[-14, -8, 9], [12, 10, 7], [6, -18, 5], [-4, 18, 6]]) { circle(c, mx + dx, my + dy, rr); c.fill(); }
      // 月光灑下來的光柱
      const col = c.createLinearGradient(0, 140, 0, FLOOR); col.addColorStop(0, 'rgba(255,250,220,0.16)'); col.addColorStop(1, 'rgba(255,250,220,0.02)');
      c.fillStyle = col; c.beginPath(); c.moveTo(mx - 40, 140); c.lineTo(mx + 40, 140); c.lineTo(mx + 110, FLOOR); c.lineTo(mx - 110, FLOOR); c.fill();
    } else if (id === 'lantern') {
      glowDot(c, W * .15, 0, 320, '#ff9a50', .35); glowDot(c, W * .85, 30, 300, '#ff7ab0', .3);
      // 遠方已經飄遠的天燈
      for (let i = 0; i < 34; i++) { const x = r() * W, y = 20 + r() * 260, rr = 3 + r() * 5; glowDot(c, x, y, rr * 4, '#ffb060', .5); c.fillStyle = 'rgba(255,230,160,0.9)'; c.fillRect(x - rr * .4, y - rr * .5, rr * .8, rr); }
    } else if (id === 'lotuspond') {
      glowDot(c, W * .5, -40, 420, '#fff0c0', .45);
      // 水面上的荷葉（從水裡往上看是一片片影子）
      for (let i = 0; i < 9; i++) {
        const x = (i + .3 + r() * .4) * W / 9, rr = 45 + r() * 30;
        c.fillStyle = 'rgba(40,120,80,0.55)'; ell(c, x, 8, rr, 12); c.fill(); c.fillStyle = 'rgba(120,200,140,0.35)'; ell(c, x - rr * .2, 6, rr * .5, 5); c.fill();
      }
    } else if (id === 'crystalhall') {
      for (const [x, y, rr, col] of [[W * .2, 150, 260, '#ffc8f0'], [W * .55, 90, 300, '#c8e8ff'], [W * .85, 200, 240, '#e0d0ff']]) glowDot(c, x, y, rr, col, .4);
    } else if (id === 'heaven') {
      glowDot(c, W * .5, 0, 460, '#fff4c8', .6);
      // 大彩虹
      c.lineWidth = 16; c.lineCap = 'butt'; const rb = Math.min(W * .4, 400);
      ['#ff7aa8', '#ffb060', '#ffe870', '#80e8a0', '#70c0ff', '#a080ff'].forEach((col, k) => { c.strokeStyle = css(hex(col), .38); c.beginPath(); c.arc(W * .5, 470, rb - k * 15, Math.PI * 1.08, Math.PI * 1.92); c.stroke(); });
      // 雲朵（低多邊形）
      for (const [cx, cy, sc] of [[W * .12, 90, 1.1], [W * .88, 70, 1.2], [W * .35, 40, .8], [W * .66, 130, .9]])
        for (let k = 0; k < 7; k++) blob(c, 1, 1, cx + (k - 3) * 26 * sc, cy + Math.abs(k - 3) * 6 * sc - (k % 2) * 10 * sc, 30 * sc, 22 * sc, `rgba(255,255,255,${.75 + r() * .2})`, 8, r());
    }
  } else if (stage === 'far') {
    if (id === 'lotuspond') {
      // 長長的荷花莖，水中還有幾朵花苞
      for (let i = 0; i < 9; i++) {
        const x0 = (i + .5) * W / 9 + (r() - .5) * 40; c.strokeStyle = 'rgba(40,110,80,0.5)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x0, FLOOR); c.quadraticCurveTo(x0 + (r() - .5) * 80, FLOOR / 2, x0 + (r() - .5) * 40, 12); c.stroke();
        if (i % 3 === 1) { const bx = x0 + (r() - .5) * 30, by = 180 + r() * 150; c.strokeStyle = 'rgba(40,110,80,0.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(bx, FLOOR); c.lineTo(bx, by); c.stroke();
          for (let k = 0; k < 5; k++) { c.save(); c.translate(bx, by); c.rotate((k - 2) * .35); polyFill(c, [[0, 0], [-9, -18], [0, -34], [9, -18]], k % 2 ? 'rgba(255,170,205,0.75)' : 'rgba(255,215,230,0.75)'); c.restore(); } }
      }
    } else if (id === 'crystalhall') {
      // 水晶宮殿：中間一群高聳的水晶塔，兩側有水晶叢
      const crystal = (x, h, wd, col) => {
        const b = hex(col); lpTri(c, [x - wd, FLOOR], [x, FLOOR - h], [x, FLOOR], css(bright(b, 1.15), .72)); lpTri(c, [x, FLOOR], [x, FLOOR - h], [x + wd, FLOOR], css(bright(b, .85), .72));
        lpTri(c, [x - wd * .5, FLOOR - h * .5], [x, FLOOR - h], [x - wd * .15, FLOOR - h * .55], 'rgba(255,255,255,0.35)');
        CRYSTAL_TIPS.push([x, FLOOR - h]);
      };
      CRYSTAL_TIPS = [];
      const cols = ['#d8c8ff', '#b8e8ff', '#ffd0ec', '#c8f8f0'];
      [[0, 330, 34], [-60, 250, 28], [60, 260, 28], [-115, 180, 24], [115, 190, 24], [-165, 120, 20], [165, 125, 20]].forEach(([dx, h, wd], i) => crystal(W * .5 + dx, h, wd, cols[i % 4]));
      for (const sx of [W * .12, W * .88]) for (let k = 0; k < 4; k++) crystal(sx + (k - 1.5) * 26 + (r() - .5) * 10, 60 + r() * 90, 12 + r() * 8, cols[(k + 1) % 4]);
    } else if (id === 'heaven') {
      // 遠方雲上的天空之城
      const px = W * .22, py = FLOOR - 190;
      for (let k = 0; k < 6; k++) blob(c, 1, 1, px + (k - 2.5) * 34, py + 40 + (k % 2) * 8, 38, 20, 'rgba(255,255,255,0.8)', 8, k);
      c.fillStyle = 'rgba(255,250,240,0.85)'; c.fillRect(px - 50, py - 20, 100, 55); c.fillRect(px - 16, py - 70, 32, 55);
      c.fillStyle = 'rgba(255,215,110,0.9)';
      for (const [x, y, rr] of [[px, py - 70, 20], [px - 38, py - 20, 14], [px + 38, py - 20, 14]]) { c.beginPath(); c.arc(x, y, rr, Math.PI, 0); c.fill(); polyFill(c, [[x - 2, y - rr], [x, y - rr - 14], [x + 2, y - rr]], 'rgba(255,215,110,0.9)'); }
    }
  }
}
function drawStarBgDynamic(bg) {
  const id = bg.id, c = ctx;
  if (id === 'bubblepink') {
    const sp = bubbleSpr();
    for (let i = 0; i < 18; i++) { const rr = 5 + (i % 4) * 3, x = ((i * 173.3 + Math.sin(T * .8 + i) * 20) % W + W) % W, y = FLOOR - ((T * (18 + i % 5 * 6) + i * 97) % (FLOOR - 30)); c.drawImage(sp, x - rr, y - rr, rr * 2, rr * 2); }
  } else if (id === 'moonsea') {
    // 月光在水中閃爍
    c.fillStyle = 'rgba(255,250,220,0.7)';
    for (let i = 0; i < 14; i++) { const k = Math.sin(T * 2 + i * 1.9); if (k < .3) continue; const y = 160 + i * 26, x = W * .3 + Math.sin(i * 2.7) * (30 + i * 5); c.globalAlpha = k; c.fillRect(x - 8, y, 16, 1.5); }
    c.globalAlpha = 1; const tw = (Math.sin(T * 1.3) + 1) / 2; c.fillStyle = `rgba(255,255,240,${.4 + .5 * tw})`; star4(c, W * .3 + 40, 60, 5 + tw * 5);
  } else if (id === 'lantern') {
    const sp = lanternSpr();
    for (let i = 0; i < 9; i++) {
      const sz = 34 + (i % 3) * 8, x = W * (i + .5) / 9 + Math.sin(T * .3 + i) * 30, y = FLOOR + 40 - ((T * (9 + i % 3 * 4) + i * 131) % (FLOOR + 80));
      c.globalAlpha = .85 + .15 * Math.sin(T * 5 + i * 2); c.drawImage(sp, x - sz / 2, y - sz / 2, sz, sz);
    }
    c.globalAlpha = 1;
  } else if (id === 'lotuspond') {
    for (let i = 0; i < 14; i++) {
      const x = ((i * 191.3 + T * (8 + i % 4 * 3) + Math.sin(T * .6 + i) * 25) % (W + 40) + W + 40) % (W + 40) - 20, y = (i * 71.3 + T * (9 + i % 3 * 3)) % (FLOOR + 20) - 10;
      c.save(); c.translate(x, y); c.rotate(T * .8 + i); c.fillStyle = i % 2 ? 'rgba(255,180,210,0.85)' : 'rgba(255,230,240,0.85)'; ell(c, 0, 0, 6, 3.5); c.fill(); c.restore();
    }
    const sp = glowSpr('#fff0a0');
    for (let i = 0; i < 12; i++) { const x = (i * 137 + Math.sin(T * .5 + i * 2) * 60 + W) % W, y = 120 + (i * 53) % 330 + Math.sin(T * .7 + i) * 25, a = .4 + .6 * Math.max(0, Math.sin(T * 1.5 + i * 1.3)); c.globalAlpha = a; c.drawImage(sp, x - 12, y - 12, 24, 24); }
    c.globalAlpha = 1;
  } else if (id === 'crystalhall') {
    // 水晶尖端輪流閃光，還有彩色的稜鏡光束
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const x = W * (.25 + i * .25) + Math.sin(T * .3 + i * 2) * 60, col = hsl(Math.round((T * 25 + i * 120) / 10) * 10 % 360, .9, .7);
      const g = c.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, css(col, .14)); g.addColorStop(1, css(col, 0));
      c.fillStyle = g; c.beginPath(); c.moveTo(x - 14, 0); c.lineTo(x + 14, 0); c.lineTo(x + 110, FLOOR); c.lineTo(x + 50, FLOOR); c.fill();
    }
    c.restore();
    CRYSTAL_TIPS.forEach(([x, y], i) => twinkle(c, x, y, 9, i));
  } else if (id === 'heaven') {
    for (let i = 0; i < 18; i++) {
      const x = ((i * 151.7 + Math.sin(T * .5 + i) * 30) % W + W) % W, y = (i * 67.3 + T * (10 + i % 4 * 4)) % (FLOOR - 20) + 10, k = Math.max(0, Math.sin(T * 2.5 + i * 1.7));
      if (k > .1) { c.fillStyle = `rgba(255,230,140,${k})`; star4(c, x, y, 3 + k * 4); }
    }
    for (let i = 0; i < 5; i++) {
      const x = ((i * 263 + T * 12) % (W + 60) + W + 60) % (W + 60) - 30, y = (i * 113 + T * 16) % (FLOOR + 20) - 10;
      c.save(); c.translate(x, y); c.rotate(Math.sin(T * 1.5 + i) * .8); c.fillStyle = 'rgba(255,255,255,0.9)'; ell(c, 0, 0, 9, 3); c.fill(); c.strokeStyle = 'rgba(220,200,160,0.8)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-10, 0); c.lineTo(9, 0); c.stroke(); c.restore();
    }
  }
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(bgCanvas, 0, 0);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  drawEventBack();
  drawDynamicBg();
  drawScene(1);
  for (const p of pellets) {
    const fd = FD[p.food]; ctx.globalAlpha = p.floor > 9 ? (12 - p.floor) / 3 : 1;
    const pc = hex(fd.color), P = []; for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + p.seed; P.push([p.x + Math.cos(a) * fd.r, p.y + Math.sin(a) * fd.r]); }
    P.forEach((q, k) => lpTri(ctx, [p.x, p.y], q, P[(k + 1) % 6], css(bright(pc, .8 + .45 * Math.max(0, -Math.sin(k * Math.PI / 3 + p.seed + .5))))));
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; circle(ctx, p.x - fd.r * .3, p.y - fd.r * .35, fd.r * .28); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  // 戳泡泡時畫面只留泡泡：寶物、魚、訪客、蝸牛和飛向左上角的金幣都先不畫（背後一樣照常運作）
  drawMeteorBack();
  if (!POP.on) for (const t of state.treasures) {
    const y = t.y + (t.landed ? Math.sin(T * 2 + t.bob) * 1.5 : 0);
    ctx.globalAlpha = t.age > 110 ? (120 - t.age) / 10 : 1;
    ctx.drawImage(treasureSprite(TREASURE[t.type].icon), t.x - 22, y - 22, 44, 44);
    ctx.globalAlpha = 1;
  }
  if (!POP.on) {
    const sorted = state.fish.slice().sort((a, b) => a.growth - b.growth);
    for (const f of sorted) drawFish(ctx, f, T);
    for (const f of starFish) drawFish(ctx, f, T);
    for (const r of releasing) drawFish(ctx, r.f, T, clamp(r.life / 1.6, 0, 1));
  }
  if (!POP.on) drawVisitor();
  if (!POP.on) for (let i = 0; i < snailCount(); i++) {
    const sn = snails[i]; drawSnail(ctx, sn.x, FLOOR + 34 + i * 6, 11 + Math.min(3, state.snailLv) * 3, sn.dir, sn.moving);
  }
  drawMeteors(); drawBottle();
  if (state.feederLv > 0 && !state.feederOff) emoji(ctx, '🤖', W - 30, 26, 26);
  if (!POP.on) for (const f of coinFx) {
    if (f.t < 0) continue;
    const q = f.t / f.dur, e = q * q * (3 - 2 * q), x = f.x0 + (40 - f.x0) * e, y = f.y0 + (-10 - f.y0) * e - Math.sin(Math.PI * q) * 90;
    drawCoin(ctx, x, y, 11 + f.tier * 2, f.tier, f.spin);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1;
  for (const b of bubbles) { ell(ctx, b.x, b.y, b.r, b.r); ctx.stroke(); }
  drawEventFront();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const p of particles) { ctx.globalAlpha = Math.min(1, p.life); ctx.drawImage(emojiSprite(p.icon), p.x - 16, p.y - 16, 32, 32); }
  ctx.globalAlpha = 1;
  for (const t of texts) {
    ctx.globalAlpha = Math.min(1, t.life); ctx.font = 'bold 28px "Noto Sans TC","PingFang TC",sans-serif';
    ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.strokeText(t.text, t.x, t.y); ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y);
  }
  ctx.globalAlpha = 1;
  // 水面
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 10 + Math.sin(x * .03 + T * 1.5) * 3);
  ctx.stroke();
  drawPop();
}

// ====== 戳泡泡小遊戲：30 秒內點破或滑過泡泡拿金幣，每 10 分鐘可以玩一次 ======
const POP_CD = 10 * 60 * 1000, POP_TIME = 30;
const POP = { on: false, t: 0, spawn: 0, list: [], n: 0, coins: 0, stars: 0 };
const popLeft = () => Math.max(0, POP_CD - (Date.now() - (state.popAt || 0)));
const updatePopDot = () => $('#popBtn').classList.toggle('dot', !POP.on && popLeft() <= 0);
async function startPop() {
  if (POP.on) return;
  const left = popLeft(); if (left > 0) return toast(`🫧 泡泡還在準備中，約 ${Math.ceil(left / 60000)} 分鐘後可以再玩`);
  if (menuOpen) closeMenu(); if (!$('#foodPop').hidden) toggleFood(false);
  if (!await ask(`🫧 戳泡泡小遊戲\n\n${POP_TIME} 秒內點破（或手指滑過）泡泡就能拿金幣！\n金色泡泡金幣比較多，偶爾還有⭐星星泡泡。`, '開始！', '等一下')) return;
  Object.assign(POP, { on: true, t: POP_TIME, spawn: 0, list: [], n: 0, coins: 0, stars: 0 }); state.popAt = Date.now(); updatePopDot(); save();
}
function updatePop(dt) {
  if (!POP.on) return;
  POP.t -= dt; POP.spawn -= dt;
  if (POP.spawn <= 0 && POP.t > .8) {
    POP.spawn = rand(.28, .5) * (POP.t < 10 ? .7 : 1); // 最後 10 秒泡泡變多
    const r = Math.random(), kind = r < .04 ? 'star' : r < .15 ? 'gold' : 'coin';
    POP.list.push({ x: rand(60, W - 60), y: FLOOR + 30, r: kind === 'coin' ? rand(22, 30) : 32, vy: rand(55, 95), ph: rand(0, 6), kind });
  }
  for (let i = POP.list.length - 1; i >= 0; i--) { const b = POP.list[i]; b.y -= b.vy * dt; b.x += Math.sin(T * 2 + b.ph) * 22 * dt; if (b.y < -40) POP.list.splice(i, 1); }
  if (POP.t <= 0) endPop();
}
function popAt(p) {
  for (let i = POP.list.length - 1; i >= 0; i--) {
    const b = POP.list[i]; if (Math.hypot(b.x - p.x, b.y - p.y) > b.r + 10) continue;
    POP.list.splice(i, 1); POP.n++;
    for (let k = 0; k < 4; k++) particles.push({ x: b.x + rand(-12, 12), y: b.y + rand(-12, 12), vy: -rand(20, 50), life: .6, icon: '✨' });
    if (b.kind === 'star') { const st = Math.max(1, Math.round(rewardStars() * .3)); state.stars += st; state.starEarned += st; POP.stars += st; floatText(b.x, b.y - 20, `+⭐${st}`, '#fff27a'); }
    else { const v = Math.max(5, Math.round(incomePerSec() * 3)) * (b.kind === 'gold' ? 5 : 1); state.coins += v; state.earned += v; POP.coins += v; floatText(b.x, b.y - 20, `+${fmt(v)}`, b.kind === 'gold' ? '#ffd84d' : '#fff'); bumpPill(); }
    return true;
  }
  return false;
}
function endPop() {
  POP.on = false; POP.list = []; wishProg('pop'); state.stats.popBest = Math.max(state.stats.popBest || 0, POP.n); updatePopDot(); save();
  ask(`🫧 時間到！\n\n戳破了 ${POP.n} 顆泡泡\n獲得 💰${fmt(POP.coins)}${POP.stars ? `　⭐${POP.stars}` : ''}\n\n10 分鐘後可以再玩一次喔！`, '好', null);
}
function drawPop() {
  if (!POP.on) return;
  const sp = bubbleSpr();
  for (const b of POP.list) {
    if (b.kind !== 'coin') halo(ctx, b.x, b.y, b.r * 1.5, b.kind === 'gold' ? '#ffd860' : '#fff0a0', .7);
    ctx.drawImage(sp, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    const ic = emojiSprite(b.kind === 'star' ? '⭐' : '💰'), z = b.r * (b.kind === 'coin' ? .9 : 1.1); ctx.globalAlpha = b.kind === 'coin' ? .8 : 1; ctx.drawImage(ic, b.x - z / 2, b.y - z / 2, z, z); ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = 'bold 26px "Noto Sans TC","PingFang TC",sans-serif';
  const txt = `🫧 戳泡泡！剩 ${Math.ceil(POP.t)} 秒　💰${fmt(POP.coins)}${POP.stars ? `　⭐${POP.stars}` : ''}`;
  ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.strokeText(txt, W / 2, 128); ctx.fillStyle = '#fff'; ctx.fillText(txt, W / 2, 128);
}

