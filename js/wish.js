// 漂流瓶心願（wish.js）：每天水面上漂來一個瓶子，點開是一個小心願，完成可以拿獎勵
// state.wish = { date, id, n, p, done, opened, base }；base 是「賺金幣」心願開始時的累計金幣
const WISHES = {
  pet:     { icon: '💗', name: n => `摸摸魚 ${n} 次`, n: () => 10, note: '最近有點寂寞，好想被摸摸頭……' },
  eat:     { icon: '🍤', name: n => `讓魚吃掉 ${n} 顆飼料`, n: () => 80, note: '肚子好餓，想吃一頓大餐！' },
  breed:   { icon: '🍼', name: n => `生出 ${n} 隻小魚`, n: () => 5, note: '好想要多一點弟弟妹妹一起玩。' },
  collect: { icon: '🐚', name: n => `撿 ${n} 個寶物`, n: () => 150, note: '沙地上的寶物快要堆成小山了！' },
  pop:     { icon: '🫧', name: n => `玩 ${n} 次戳泡泡`, n: () => 1, note: '想看你戳泡泡的樣子，一定很好玩！' },
  variety: { icon: '🌈', name: n => `水族箱同時有 ${n} 種不同的魚`, n: () => (state.maxTier || 0) >= 12 ? 8 : 4, note: '想要認識更多不同的新朋友！', check: () => new Set(state.fish.map(f => f.sp)).size },
  earn:    { icon: '💰', name: n => `今天再賺到 💰${fmt(n)}`, n: () => nice(Math.max(1000, incomePerSec() * 1200)), note: '聽說認真工作的魚，運氣會變好喔！', check: w => state.earned - w.base },
};
// 獎勵比每日任務多一些：約 20 分鐘的收益和 3 倍星星
const wishCoins = () => rewardCoins(1200), wishStars = () => rewardStars() * 3;
function newWish() {
  const ids = Object.keys(WISHES), r = mulberry((Date.now() / 864e5 | 0) + 7), id = ids[Math.floor(r() * ids.length)];
  state.wish = { date: todayStr(), id, n: WISHES[id].n(), p: 0, done: false, opened: false, base: state.earned };
  bottle = null; updateGiftDot();
}
// 打開瓶子前也會記進度，打開時一看可能已經完成了
function wishProg(id, k = 1) {
  const w = state.wish; if (!w || w.done || w.id !== id || w.date !== todayStr()) return;
  w.p = Math.min(w.n, w.p + k); if (w.p >= w.n) wishDone();
}
function wishDone() {
  const w = state.wish; w.done = true; w.p = w.n;
  if (!w.opened) return; // 還沒打開瓶子，等打開時再發獎勵
  grant(wishCoins(), wishStars(), `🍾 漂流瓶的心願完成了！`);
  if (menuOpen && tab === 'daily') renderTab();
}
// 每秒檢查：換日、和「看狀態」類的心願
function wishTick() {
  if (!state.wish || state.wish.date !== todayStr()) newWish();
  const w = state.wish, W0 = WISHES[w.id];
  if (W0.check && !w.done) { w.p = Math.min(w.n, Math.max(0, W0.check(w))); if (w.p >= w.n) wishDone(); else if (w.opened) dailyDirty = true; }
}
async function openBottle() {
  const w = state.wish; if (!w || w.opened) return;
  w.opened = true; bottle = null; updateGiftDot(); save();
  for (let i = 0; i < 10; i++) particles.push({ x: W / 2 + rand(-100, 100), y: H * .4 + rand(-30, 30), vy: -rand(20, 50), life: 1.4, icon: i % 2 ? '✨' : '💌' });
  const W0 = WISHES[w.id];
  await ask(`🍾 撈到一個漂流瓶！\n裡面有一張小紙條：\n\n「${W0.note}」\n\n今天的心願：${W0.icon} ${W0.name(w.n)}\n完成可以得到 💰${fmt(wishCoins())}　⭐${fmt(wishStars())}\n\n（進度可以在 🎁 每日禮物裡查看）`, '好！', null);
  if (w.done) grant(wishCoins(), wishStars(), `🍾 漂流瓶的心願已經完成了！`);
  if (menuOpen && tab === 'daily') renderTab();
}

// ---- 水面上漂的瓶子 ----
let bottle = null;
function updateBottle(dt) {
  const w = state.wish; if (!w || w.opened) { bottle = null; return; }
  if (!bottle) bottle = { x: rand(80, W - 80), dir: Math.random() < .5 ? 1 : -1 };
  bottle.x += bottle.dir * 14 * dt;
  if (bottle.x < 50) bottle.dir = 1; else if (bottle.x > W - 50) bottle.dir = -1;
}
// 圓角長方形（舊版 iPhone 沒有 roundRect，自己畫）
function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
const bottleY = () => TOP + 34 + Math.sin(T * 1.6) * 5;
function bottleAt(p) { return bottle && Math.abs(p.x - bottle.x) < 42 && Math.abs(p.y - bottleY()) < 36; }
function drawBottle() {
  if (!bottle || POP.on) return;
  const x = bottle.x, y = bottleY(), c = ctx;
  halo(c, x, y, 46 + Math.sin(T * 3) * 4, '#fff0b0', .55);
  c.save(); c.translate(x, y); c.rotate(-.35 + Math.sin(T * 1.6) * .12);
  c.fillStyle = 'rgba(190,240,230,0.55)'; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.5;
  rrect(c, -22, -10, 30, 20, 8); c.fill(); c.stroke();               // 瓶身
  rrect(c, 6, -5, 12, 10, 3); c.fill(); c.stroke();                  // 瓶頸
  c.fillStyle = '#b07a48'; rrect(c, 17, -4.5, 7, 9, 2); c.fill();     // 軟木塞
  c.fillStyle = '#fff4d8'; rrect(c, -16, -5, 18, 10, 4); c.fill();    // 捲起來的紙條
  c.fillStyle = '#ff7a8a'; c.fillRect(-8, -5.5, 2.5, 11);                               // 紅色綁線
  c.fillStyle = 'rgba(255,255,255,0.8)'; c.fillRect(-18, -7, 12, 2.5);                  // 玻璃反光
  c.restore();
  c.fillStyle = `rgba(255,255,240,${.5 + .5 * Math.sin(T * 4)})`; star4(c, x + 26, y - 18, 6);
}

Object.assign(ACTIONS, { openBottle() { openBottle(); } });
