// 流星雨（meteor.js）：偶爾天空變暗、劃過一道道流星，掉下幾顆金色的流星星星
// 掉在沙地上的流星星星要自己點才撿得到（蝸牛不會撿），放 150 秒後才會消失
// 流星星星不存進存檔（重新整理就不見了），所以不放在 state.treasures 裡
let meteorT = rand(300, 600), shower = null;
const meteors = [], streaks = [];
const METEOR_LIFE = 150, SHOWER_TIME = 24;
const meteorStars = () => Math.max(2, Math.ceil(rewardStars() * .5)), meteorCoins = () => rewardCoins(45);
function startShower() {
  const n = 5 + Math.floor(Math.random() * 3), at = [];
  for (let i = 0; i < n; i++) at.push(3 + i * (SHOWER_TIME - 8) / n + rand(0, 1.5));
  shower = { t: 0, at };
  toast('🌠 流星雨來了！掉到沙地上的金色星星要自己點來撿喔！');
}
function updateMeteor(dt) {
  if (POP.on) return; // 戳泡泡時整個暫停
  if (!shower) { meteorT -= dt; if (meteorT <= 0 && !document.hidden) startShower(); }
  else {
    const S = shower; S.t += dt;
    if (Math.random() < dt * 2.2 && S.t < SHOWER_TIME - 3) { const x = rand(W * .2, W * 1.1); streaks.push({ x, y: rand(TOP - 20, TOP + 120), vx: -rand(380, 520), vy: rand(160, 240), life: rand(.6, 1) }); }
    while (S.at.length && S.t >= S.at[0]) { S.at.shift(); meteors.push({ x: rand(W * .3, W + 40), y: TOP - 30, vx: -rand(40, 80), vy: rand(120, 160), floorY: rand(FLOOR + 10, FLOOR + 38), landed: false, age: 0, spin: rand(0, 6) }); }
    if (S.t > SHOWER_TIME) { shower = null; meteorT = rand(1500, 2700); }
  }
  for (let i = streaks.length - 1; i >= 0; i--) { const s = streaks[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; if (s.life <= 0) streaks.splice(i, 1); }
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    if (!m.landed) { m.x = clamp(m.x + m.vx * dt, 30, W - 30); m.y += m.vy * dt; if (m.y >= m.floorY) { m.y = m.floorY; m.landed = true; for (let k = 0; k < 6; k++) particles.push({ x: m.x + rand(-20, 20), y: m.y - rand(0, 15), vy: -rand(20, 50), life: 1, icon: '✨' }); } }
    else if ((m.age += dt) > METEOR_LIFE) meteors.splice(i, 1);
  }
}
// 天空變暗和劃過的流星：畫在魚和寶物後面
function drawMeteorBack() {
  if (POP.on) return;
  const c = ctx;
  if (shower) { const q = Math.min(1, shower.t / 3, (SHOWER_TIME - shower.t) / 3); c.fillStyle = `rgba(10,15,60,${.22 * q})`; c.fillRect(0, 0, W, H); }
  c.lineCap = 'round';
  for (const s of streaks) {
    const a = Math.min(1, s.life * 2), len = .18;
    const g = c.createLinearGradient(s.x, s.y, s.x - s.vx * len, s.y - s.vy * len); g.addColorStop(0, `rgba(255,250,220,${a})`); g.addColorStop(1, 'rgba(255,250,220,0)');
    c.strokeStyle = g; c.lineWidth = 2.5; c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(s.x - s.vx * len, s.y - s.vy * len); c.stroke();
  }
}
// 流星星星：比一般寶物大，有往上的光柱、一閃一閃的光暈，畫在最前面，在一堆寶物裡也看得到
function drawMeteors() {
  if (POP.on) return;
  const c = ctx;
  for (const m of meteors) {
    const left = METEOR_LIFE - m.age, a = left < 15 ? .45 + .55 * Math.abs(Math.sin(T * 6)) : 1, pulse = .5 + .5 * Math.sin(T * 3 + m.spin);
    c.globalAlpha = a;
    if (!m.landed) {
      c.strokeStyle = 'rgba(255,230,140,0.7)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(m.x, m.y); c.lineTo(m.x - m.vx * .5, m.y - m.vy * .5); c.stroke();
    } else {
      const g = c.createLinearGradient(m.x, m.y, m.x, m.y - 150); g.addColorStop(0, `rgba(255,236,150,${.35 + .2 * pulse})`); g.addColorStop(1, 'rgba(255,236,150,0)');
      c.fillStyle = g; c.fillRect(m.x - 14, m.y - 150, 28, 150);
    }
    halo(c, m.x, m.y, 40 + 10 * pulse, '#ffe070', .9);
    c.save(); c.translate(m.x, m.y); c.rotate(T * .8 + m.spin);
    c.fillStyle = '#ffd040'; star4(c, 0, 0, 20 + 3 * pulse); c.rotate(Math.PI / 4); c.fillStyle = '#fff4b0'; star4(c, 0, 0, 12 + 2 * pulse);
    c.restore();
    c.fillStyle = '#ffffff'; circle(c, m.x, m.y, 4); c.fill();
    for (let k = 0; k < 3; k++) { const ang = T * 2 + k * 2.1 + m.spin; c.fillStyle = `rgba(255,255,230,${.5 + .5 * Math.sin(T * 5 + k)})`; star4(c, m.x + Math.cos(ang) * 30, m.y + Math.sin(ang) * 16 - 6, 4); }
    c.globalAlpha = 1;
  }
}
// 點到流星星星就撿起來（蝸牛和滑過去都不會撿，一定要點）
function tapMeteor(p) {
  let hit = null, hd = 44;
  for (const m of meteors) { const d = Math.hypot(m.x - p.x, m.y - p.y); if (d < hd) { hd = d; hit = m; } }
  if (!hit) return false;
  meteors.splice(meteors.indexOf(hit), 1);
  const s = meteorStars(), v = meteorCoins();
  state.stars += s; state.starEarned += s; state.coins += v; state.earned += v; bumpPill();
  floatText(hit.x, hit.y - 30, `🌠 +⭐${fmt(s)}　+💰${fmt(v)}`, '#ffe680');
  for (let k = 0; k < 10; k++) particles.push({ x: hit.x + rand(-25, 25), y: hit.y + rand(-20, 10), vy: -rand(30, 70), life: 1.4, icon: k % 2 ? '⭐' : '✨' });
  return true;
}
