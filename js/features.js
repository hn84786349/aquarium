// 圖鑑、成就、每日任務、拍照、改名、訪客、節日（features.js）
// ====== 收藏：圖鑑、成就、每日禮物與任務 ======
const todayStr = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const ALL_DEX = () => [...SPECIES, ...STARFISH];
function dexSee(id, shiny) {
  const d = state.dex; if (!d.seen[id]) { d.seen[id] = 1; toast(`📖 圖鑑新增：${getSp(id).name}`); }
  if (shiny && !d.shiny[id]) d.shiny[id] = shiny;
}
// 星星獎勵依進度成長：大約是目前最高級魚放生星星的一成
const rewardStars = () => Math.max(3, Math.round((SPECIES[Math.min(SPECIES.length - 1, state.maxTier || 0)].stars || 1) * .1));
const rewardCoins = sec => Math.max(200, Math.round(incomePerSec() * sec));
function grant(coins, stars, title) {
  if (coins) { state.coins += coins; state.earned += coins; }
  if (stars) { state.stars += stars; state.starEarned += stars; }
  toast(`${title}${coins ? `　💰${fmt(coins)}` : ''}${stars ? `　⭐${stars}` : ''}`);
  for (let i = 0; i < 10; i++) particles.push({ x: W / 2 + rand(-120, 120), y: H * .45 + rand(-40, 40), vy: -rand(20, 60), life: 1.5, icon: i % 2 ? '✨' : '⭐' });
}
// 圖鑑收集獎勵
const DEX_GOALS = [[10, 10], [20, 30], [30, 80], [40, 150], [50, 300], [60, 600], [75, 1000], [SPECIES.length + STARFISH.length, 1500]];
function checkDex() {
  const n = Object.keys(state.dex.seen).length;
  for (const [goal, st] of DEX_GOALS) if (n >= goal && !state.dex.claimed.includes(goal)) { state.dex.claimed.push(goal); grant(0, st, `📖 圖鑑收集 ${goal} 種！`); }
}
// 成就：達成就自動發獎
const ACHS = [
  { id: 'earn1', icon: '💰', name: '小有積蓄', desc: '累計賺到 1 萬金幣', test: () => state.earned >= 1e4, stars: 5 },
  { id: 'earn2', icon: '💰', name: '小富翁', desc: '累計賺到 100 萬金幣', test: () => state.earned >= 1e6, stars: 15 },
  { id: 'earn3', icon: '💰', name: '大富翁', desc: '累計賺到 1 億金幣', test: () => state.earned >= 1e8, stars: 40 },
  { id: 'earn4', icon: '💎', name: '海洋首富', desc: '累計賺到 100 億金幣', test: () => state.earned >= 1e10, stars: 100 },
  { id: 'earn5', icon: '👑', name: '龍宮財神', desc: '累計賺到 1 兆金幣', test: () => state.earned >= 1e12, stars: 300 },
  { id: 'fish20', icon: '🐟', name: '熱鬧的水族箱', desc: '水族箱養到 20 隻魚', test: () => state.fish.length >= 20, stars: 10 },
  { id: 'fish50', icon: '🐠', name: '滿滿的水族箱', desc: '水族箱養滿 50 隻魚', test: () => state.fish.length >= 50, stars: 50 },
  { id: 'born10', icon: '🍼', name: '育兒新手', desc: '累計生出 10 隻小魚', test: () => state.stats.born >= 10, stars: 10 },
  { id: 'born100', icon: '🍼', name: '育兒達人', desc: '累計生出 100 隻小魚', test: () => state.stats.born >= 100, stars: 60 },
  { id: 'rel10', icon: '🌊', name: '回歸大海', desc: '累計放生 10 隻魚', test: () => state.stats.released >= 10, stars: 10 },
  { id: 'rel100', icon: '🌊', name: '海洋守護者', desc: '累計放生 100 隻魚', test: () => state.stats.released >= 100, stars: 60 },
  { id: 'love5', icon: '💕', name: '心心相印', desc: '任一隻魚的親密度達到 5 顆心', test: () => state.fish.some(f => hearts(f) >= 5), stars: 30 },
  { id: 'pop1', icon: '🫧', name: '泡泡高手', desc: '一次戳泡泡戳破 40 顆以上', test: () => (state.stats.popBest || 0) >= 40, stars: 20 },
  { id: 'shiny', icon: '🌈', name: '閃閃發亮', desc: '得到第一隻稀有色的魚', test: () => Object.keys(state.dex.shiny).length > 0, stars: 20 },
  { id: 'visit10', icon: '🐋', name: '好客的主人', desc: '招待神秘訪客 10 次', test: () => state.stats.visitors >= 10, stars: 20 },
  { id: 'scene1', icon: '🪸', name: '造景入門', desc: `${SCENE.length} 種造景都擁有`, test: () => SCENE.every(p => state.scene[p.id].lv >= 1), stars: 30 },
  { id: 'scene5', icon: '🏰', name: '夢幻造景', desc: '任一造景升到 Lv.5', test: () => SCENE.some(p => state.scene[p.id].lv >= 5), stars: 30 },
  { id: 'sceneAll', icon: '🏯', name: '造景大師', desc: '全部造景升到 Lv.5', test: () => SCENE.every(p => state.scene[p.id].lv >= 5), stars: 300 },
  { id: 'bg5', icon: '🖼️', name: '背景收藏家', desc: '擁有 5 種背景', test: () => state.ownedBg.length >= 5, stars: 20 },
  { id: 'dream5', icon: '🌟', name: '夢幻家族', desc: '兌換 5 種夢幻生物', test: () => state.starOwned.length >= 5, stars: 50 },
  { id: 'streak7', icon: '📅', name: '天天見面', desc: '連續 7 天領取每日禮物', test: () => state.daily.streak >= 7, stars: 30 },
];
function checkAch() {
  for (const a of ACHS) if (!state.ach[a.id] && a.test()) { state.ach[a.id] = 1; grant(0, a.stars, `🏆 達成成就「${a.name}」！`); }
  checkDex();
}
// 每日任務
const TASKS = {
  feed:    { name: n => `餵食 ${n} 次`, n: 20, icon: '🍤' },
  collect: { name: n => `撿 ${n} 個寶物`, n: 40, icon: '🐚' },
  breed:   { name: n => `生出 ${n} 隻小魚`, n: 1, icon: '🍼' },
  buy:     { name: n => `買 ${n} 隻魚`, n: 1, icon: '🛒' },
  release: { name: n => `放生 ${n} 隻魚`, n: 1, icon: '🌊' },
  visitor: { name: n => `招待 ${n} 次神秘訪客`, n: 1, icon: '🐋' },
  view:    { name: n => `查看 ${n} 隻魚的狀態`, n: 3, icon: '🔍' },
};
function newDay() {
  const d = state.daily, ids = Object.keys(TASKS), r = mulberry(Date.now() / 864e5 | 0), pickd = [];
  while (pickd.length < 3) { const id = ids[Math.floor(r() * ids.length)]; if (!pickd.includes(id)) pickd.push(id); }
  d.date = todayStr(); d.gift = false;
  d.tasks = pickd.map(id => ({ id, n: TASKS[id].n, p: 0, done: false }));
  if (menuOpen && tab === 'daily') renderTab();
  updateGiftDot();
}
// 地上寶物的「光暈＋圖示」先畫成小圖存起來，之後每幀直接貼上（每幀重畫漸層和表情符號很慢）
const TREASURE_CV = {};
function treasureSprite(icon) {
  if (TREASURE_CV[icon]) return TREASURE_CV[icon];
  const R = 3, cv = document.createElement('canvas'); cv.width = cv.height = 44 * R;
  const c = cv.getContext('2d'); c.scale(R, R);
  const g = c.createRadialGradient(22, 22, 2, 22, 22, 22); g.addColorStop(0, 'rgba(255,230,120,0.55)'); g.addColorStop(1, 'rgba(255,230,120,0)');
  c.fillStyle = g; c.fillRect(0, 0, 44, 44);
  emoji(c, icon, 22, 22, 30);
  return TREASURE_CV[icon] = cv;
}
// 飄在空中的小圖示（✨💗⭐ 等）也先畫成小圖，每幀直接貼上
const EMOJI_CV = {};
function emojiSprite(ch) {
  if (EMOJI_CV[ch]) return EMOJI_CV[ch];
  const R = 3, cv = document.createElement('canvas'); cv.width = cv.height = 32 * R;
  const c = cv.getContext('2d'); c.scale(R, R); emoji(c, ch, 16, 16, 22);
  return EMOJI_CV[ch] = cv;
}
const COINFX_MAX = 40, PARTICLE_MAX = 150;
// 左上角金幣數字跳一下：最多每 0.3 秒一次，用 Web Animations 播放，不必強制瀏覽器重新排版
let bumpAt = 0, coinPillEl = null;
function bumpPill() {
  const now = performance.now(); if (now - bumpAt < 300) return; bumpAt = now;
  const el = coinPillEl || (coinPillEl = $('#coinPill'));
  if (el.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches)
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)', offset: .4 }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' });
}
let dailyDirty = false; // 每日任務頁有進度變化，等下一次 0.5 秒的刷新再重畫
function taskProg(id, k = 1) {
  if (!state.daily || state.daily.date !== todayStr()) return;
  for (const t of state.daily.tasks) if (t.id === id && !t.done) {
    t.p = Math.min(t.n, t.p + k);
    if (t.p >= t.n) { t.done = true; grant(rewardCoins(300), rewardStars(), `📅 完成每日任務「${TASKS[id].name(t.n)}」！`); if (menuOpen && tab === 'daily' && !panelPressed) renderTab(); }
    else dailyDirty = true;
  }
}
function claimGift() {
  const d = state.daily; if (d.gift) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  d.streak = d.last === todayStr(y) ? (d.streak || 0) + 1 : 1; d.last = todayStr(); d.gift = true;
  const k = 1 + Math.min(d.streak, 7) * .15;
  grant(rewardCoins(600 * k), rewardStars() * (d.streak % 7 === 0 ? 3 : 1), `🎁 每日禮物（連續 ${d.streak} 天）`);
  updateGiftDot();
}
const updateGiftDot = () => $('#giftBtn').classList.toggle('dot', !!state.daily && !state.daily.gift);
// 圖鑑裡點魚可以切換外觀：一般 → 金色 → 白色 → 一般（不存檔，只是看看）
const DEX_VIEW = {}, DEX_KINDS = ['', 'gold', 'white'];
function dexCard(sp) {
  const seen = state.dex.seen[sp.id], sh = state.dex.shiny[sp.id], canFlip = seen && !sp.star, kind = canFlip ? DEX_KINDS[DEX_VIEW[sp.id] || 0] : '';
  return `<div class="dex ${seen ? '' : 'unk'} ${kind ? 'shinyView' : ''}" ${canFlip ? `data-act="dexFlip" data-arg="${sp.id}" role="button"` : ''}><img src="${kind ? shinyPrev(sp, kind) : PREV[sp.id]}" alt="">
    <b>${seen ? (kind ? SHINY_NAME[kind] : '') + sp.name : '？？？'}</b>${sh ? `<i title="看過稀有色">✨</i>` : ''}</div>`;
}
// 稀有色的預覽圖：跟一般預覽圖一樣的裁切，再疊上金色／白色（第一次看的時候才畫）
const PREV_SHINY = {};
function shinyPrev(sp, kind) {
  const key = sp.id + ':' + kind; if (PREV_SHINY[key]) return PREV_SHINY[key];
  const big = document.createElement('canvas'); big.width = 480; big.height = 320;
  const bc = big.getContext('2d'); bc.translate(260, 160); sp.draw(bc, 60, .06, 1);
  bc.setTransform(1, 0, 0, 1, 0, 0); bc.globalCompositeOperation = 'source-atop';
  bc.fillStyle = kind === 'gold' ? 'rgba(255,196,40,0.55)' : 'rgba(255,255,255,0.62)'; bc.fillRect(0, 0, 480, 320);
  return PREV_SHINY[key] = cropPreview(big, kind === 'gold' ? '#ffd860' : '#e8f4ff');
}
function renderCollect() {
  let h = '';
  if (tab === 'dex') {
    const n = Object.keys(state.dex.seen).length, all = ALL_DEX().length, next = DEX_GOALS.find(([g]) => !state.dex.claimed.includes(g));
    h += `<div class="bonus">收集進度：<b>${n} / ${all}</b> 種　${next ? `（收集 ${next[0]} 種可以得到 ⭐${next[1]}）` : '🎉 全部收集完成！'}<div class="bar"><i style="width:${n / all * 100}%;background:var(--accent)"></i></div>
      ✨ 代表看過這種魚的稀有色（金色或白色），稀有色的小魚偶爾會在繁殖時出生。<br>👆 點一下收集到的魚，可以切換看金色、白色的稀有外觀，再點一下換回一般外觀。</div>`;
    h += `<h4>🐟 魚（${SPECIES.filter(s => state.dex.seen[s.id]).length}/${SPECIES.length}）</h4><div class="dexGrid">${SPECIES.map(dexCard).join('')}</div>`;
    h += `<h4>🌟 夢幻生物（${STARFISH.filter(s => state.dex.seen[s.id]).length}/${STARFISH.length}）</h4><div class="dexGrid">${STARFISH.map(dexCard).join('')}</div>`;
  } else if (tab === 'ach') {
    const n = ACHS.filter(a => state.ach[a.id]).length;
    h += `<div class="bonus">已達成 <b>${n} / ${ACHS.length}</b> 個成就，達成時會自動得到星星。</div>`;
    for (const a of ACHS) {
      const ok = state.ach[a.id];
      h += `<div class="card ach ${ok ? 'sel' : ''}"><div class="ico" style="${ok ? '' : 'filter:grayscale(1);opacity:.45'}">${a.icon}</div><div class="info"><b>${a.name}</b><small>${a.desc}</small></div>
        <span class="achR">${ok ? '✅ 已達成' : `⭐${a.stars}`}</span></div>`;
    }
  } else if (tab === 'daily') {
    const d = state.daily;
    h += `<div class="card gift ${d.gift ? '' : 'sel'}"><div class="ico">🎁</div><div class="info"><b>今日禮物</b><small>${d.gift ? `今天已經領過了，明天再來喔！（已連續 ${d.streak} 天）` : `連續天數越多禮物越大，每連續 7 天有 3 倍星星！（目前連續 ${d.streak || 0} 天）`}</small></div>
      ${d.gift ? '<button disabled>已領取</button>' : '<button class="on" data-act="claimGift">領取</button>'}</div>`;
    h += `<h4>📅 今日任務（每天更新，完成自動得到獎勵）</h4>`;
    for (const t of d.tasks) {
      const T0 = TASKS[t.id];
      h += `<div class="card ${t.done ? 'sel' : ''}"><div class="ico">${T0.icon}</div><div class="info"><b>${T0.name(t.n)}</b><small>${t.done ? '✅ 完成！' : `進度 ${t.p} / ${t.n}`}　獎勵 💰${fmt(rewardCoins(300))} ⭐${rewardStars()}</small>
        <div class="bar"><i style="width:${t.p / t.n * 100}%;background:${t.done ? 'var(--good)' : '#4aa8ff'}"></i></div></div></div>`;
    }
  }
  return h;
}

// ====== 拍照分享 ======
let photoFile = null;
function takePhoto() {
  const cv = document.createElement('canvas'); cv.width = canvas.width; cv.height = canvas.height;
  const c = cv.getContext('2d'); c.drawImage(canvas, 0, 0);
  const k = canvas.width / W, d = new Date(), label = `🐠 夢幻水族箱　${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  c.font = `bold ${Math.round(20 * k)}px "Noto Sans TC","PingFang TC",sans-serif`; c.textAlign = 'right'; c.textBaseline = 'bottom';
  c.lineWidth = 5 * k; c.strokeStyle = 'rgba(0,0,0,0.45)'; c.strokeText(label, cv.width - 14 * k, cv.height - 10 * k);
  c.fillStyle = '#ffffff'; c.fillText(label, cv.width - 14 * k, cv.height - 10 * k);
  const url = cv.toDataURL('image/jpeg', .9);
  $('#flash').classList.remove('go'); void $('#flash').offsetWidth; $('#flash').classList.add('go');
  $('#photoImg').src = url; $('#photoBox').hidden = false; photoFile = null;
  $('#photoShare').textContent = navigator.share ? '分享' : '下載照片';
  cv.toBlob(b => { photoFile = new File([b], `水族箱-${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}.jpg`, { type: 'image/jpeg' }); }, 'image/jpeg', .9);
}
$('#photoBtn').onclick = takePhoto;
$('#photoClose').onclick = () => { $('#photoBox').hidden = true; };
$('#photoShare').onclick = async () => {
  try {
    if (photoFile && navigator.canShare && navigator.canShare({ files: [photoFile] })) await navigator.share({ files: [photoFile], title: '我的水族箱' });
    else { const a = document.createElement('a'); a.href = $('#photoImg').src; a.download = '水族箱.jpg'; a.click(); }
  } catch (e) { if (e.name !== 'AbortError') toast('分享失敗，可以長按照片儲存'); }
};

// ====== 幫魚改名 ======
let renameId = null;
function openRename(id) {
  const f = state.fish.find(x => x.id === id); if (!f) return;
  renameId = id; $('#nameInput').value = f.name; $('#nameBox').hidden = false; setTimeout(() => $('#nameInput').focus(), 50);
}
$('#nameCancel').onclick = () => { $('#nameBox').hidden = true; };
$('#nameOk').onclick = () => {
  const f = state.fish.find(x => x.id === renameId), v = $('#nameInput').value.trim().slice(0, 8);
  if (f && v) { f.name = v; toast(`改名為「${v}」`); save(); updateFishCard(); if (menuOpen) renderTab(); }
  $('#nameBox').hidden = true;
};
$('#nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#nameOk').click(); });

// ====== 稀有色小魚（金色／白色） ======
const SHINY_RATE = 1 / 25;
const SHINY_NAME = { gold: '金色', white: '白色' };
const SHC = document.createElement('canvas'), shx = SHC.getContext('2d');
function shinyDraw(c, sp, s, w, f) {
  const k = scale * 1.2, bw = s * 5, bh = s * 3.8, pw = Math.ceil(bw * k), ph = Math.ceil(bh * k);
  if (SHC.width < pw || SHC.height < ph) { SHC.width = Math.max(SHC.width, pw); SHC.height = Math.max(SHC.height, ph); }
  shx.setTransform(1, 0, 0, 1, 0, 0); shx.clearRect(0, 0, pw, ph);
  shx.setTransform(k, 0, 0, k, pw / 2, ph / 2); sp.draw(shx, s, w, f.growth < .35 ? 1.35 : 1, f);
  shx.setTransform(1, 0, 0, 1, 0, 0); shx.globalCompositeOperation = 'source-atop';
  shx.fillStyle = f.shiny === 'gold' ? 'rgba(255,196,40,0.55)' : 'rgba(255,255,255,0.62)'; shx.fillRect(0, 0, pw, ph);
  shx.globalCompositeOperation = 'source-over';
  glowDot(c, 0, 0, s * 1.8, f.shiny === 'gold' ? '#ffd860' : '#e8f4ff', .3 + .15 * Math.sin(T * 3 + f.phase));
  c.drawImage(SHC, 0, 0, pw, ph, -bw / 2, -bh / 2, bw, bh);
}

// ====== 神秘訪客：偶爾游過水族箱，點牠會送禮物 ======
let visitor = null, visitorT = rand(90, 200);
const VISITORS = [
  { id: 'whale', name: '大鯨魚', size: 90, speed: 50, w: 1.5, h: .5 },
  { id: 'turtle', name: '金色海龜', size: 50, speed: 42, w: 1.1, h: .5 },
  { id: 'school', name: '小魚群', size: 14, speed: 85, w: 5, h: 2.6 },
];
function spawnVisitor() {
  const v = pick(VISITORS), dir = Math.random() < .5 ? 1 : -1;
  visitor = { v, dir, x: dir > 0 ? -v.size * 3 : W + v.size * 3, y: rand(TOP + 90, FLOOR - 170), t: 0, tapped: false };
  toast(`👀 有${v.name}游過來了，點牠看看！`);
}
function updateVisitor(dt) {
  if (!visitor) { visitorT -= dt; if (visitorT <= 0 && !document.hidden) spawnVisitor(); return; }
  const V = visitor; V.t += dt; V.x += V.dir * V.v.speed * (V.tapped ? 2.4 : 1) * dt;
  if (V.x < -V.v.size * 4 || V.x > W + V.v.size * 4) { visitor = null; visitorT = rand(180, 360); }
}
function drawVisitor() {
  if (!visitor) return;
  const V = visitor, s = V.v.size, y = V.y + Math.sin(V.t * .8) * 14, w = Math.sin(V.t * 3) * .12;
  ctx.save(); ctx.translate(V.x, y); ctx.scale(V.dir, 1);
  if (!V.tapped) glowDot(ctx, 0, 0, s * (V.v.id === 'school' ? 5 : 1.9), '#fff6c0', .25 + .12 * Math.sin(T * 3));
  if (V.v.id === 'whale') { ctx.globalAlpha = .9; drawModel(ctx, s, w, 1, null, MODELS.humpback); }
  else if (V.v.id === 'turtle') shinyDraw(ctx, { draw: drawTurtle }, s, w, { shiny: 'gold', phase: 0, growth: 1 });
  else for (let i = 0; i < 12; i++) { ctx.save(); ctx.translate(Math.cos(i * 2.4) * s * 3.2 + Math.sin(T + i) * 4, Math.sin(i * 1.7) * s * 1.8); drawNeon(ctx, s, Math.sin(T * 8 + i) * .15, 1, null); ctx.restore(); }
  ctx.restore(); ctx.globalAlpha = 1;
  if (!V.tapped && Math.random() < .08) particles.push({ x: V.x + rand(-s, s), y: y + rand(-s * .5, s * .5), vy: -15, life: 1, icon: '✨' });
}
function visitorAt(p) {
  if (!visitor || visitor.tapped) return false;
  const V = visitor, s = V.v.size;
  return Math.abs(p.x - V.x) < s * V.v.w + 20 && Math.abs(p.y - V.y) < s * V.v.h + 30;
}
function tapVisitor() {
  const V = visitor; V.tapped = true; state.stats.visitors++; taskProg('visitor');
  for (let i = 0; i < 8; i++) particles.push({ x: V.x + rand(-40, 40), y: V.y + rand(-20, 20), vy: -rand(20, 50), life: 1.4, icon: '💗' });
  if (V.v.id === 'turtle') { grant(0, rewardStars() * 2, `🐢 ${V.v.name}送你星星！`); return; }
  // 大鯨魚、小魚群：撒下一把寶物
  const total = rewardCoins(V.v.id === 'whale' ? 180 : 100), n = 6;
  for (let i = 0; i < n; i++) state.treasures.push({ x: clamp(V.x + rand(-80, 80), 30, W - 30), y: V.y + rand(-20, 20), type: 'diamond', mult: total / n / TREASURE.diamond.value / B.value, vy: 0, landed: false, age: 0, bob: rand(0, 6) });
  toast(`${V.v.id === 'whale' ? '🐋' : '🐟'} ${V.v.name}留下了一些寶物！`);
}

// ====== 節日活動：依日期自動出現 ======
const LNY = { 2026: '2-17', 2027: '2-6', 2028: '1-26', 2029: '2-13', 2030: '2-3', 2031: '1-23', 2032: '2-11' };
const MOON = { 2026: '9-25', 2027: '9-15', 2028: '10-3', 2029: '9-22', 2030: '9-12', 2031: '10-1', 2032: '9-19' };
const EVENTS = {
  lny:  { id: 'lny',  name: '春節', treasure: 'redpacket', msg: '🧧 新年快樂！春節期間魚兒會掉出紅包喔！' },
  mom:  { id: 'mom',  name: '母親節', treasure: 'bouquet', msg: '💐 母親節快樂！謝謝媽媽，這幾天魚兒會送上花束喔！' },
  moon: { id: 'moon', name: '中秋節', treasure: 'mooncake', msg: '🥮 中秋節快樂！月亮出來了，魚兒會掉出月餅喔！' },
  xmas: { id: 'xmas', name: '聖誕節', treasure: 'xmasgift', msg: '🎄 聖誕快樂！下雪囉，魚兒會送上聖誕禮物！' },
};
function currentEvent(d = new Date()) {
  const y = d.getFullYear(), day0 = new Date(y, d.getMonth(), d.getDate());
  const diff = s => { if (!s) return 1e9; const [m, dd] = s.split('-').map(Number); return Math.round((day0 - new Date(y, m - 1, dd)) / 864e5); };
  const a = diff(LNY[y]); if (a >= -3 && a <= 14) return EVENTS.lny;
  const may1 = new Date(y, 4, 1), sun2 = 1 + (7 - may1.getDay()) % 7 + 7, md = Math.round((day0 - new Date(y, 4, sun2)) / 864e5);
  if (md >= -6 && md <= 0) return EVENTS.mom;
  const b = diff(MOON[y]); if (b >= -5 && b <= 3) return EVENTS.moon;
  if (d.getMonth() === 11 && d.getDate() >= 15) return EVENTS.xmas;
  return null;
}
let EV = null;
function updateEvent() {
  EV = currentEvent();
  if (EV && state.eventSeen !== EV.id + todayStr()) setTimeout(showEventMsg, 800);
}
// 節日問候：等其他視窗關掉再跳出來，避免蓋掉別的訊息
function showEventMsg() {
  if (!EV || state.eventSeen === EV.id + todayStr()) return;
  if (!$('#ask').hidden || !$('#welcome').hidden || !$('#photoBox').hidden) return setTimeout(showEventMsg, 1500);
  state.eventSeen = EV.id + todayStr(); ask(EV.msg, '好', null);
}
// 活動期間：魚掉寶時有 8% 機率換成節日寶物（價值是平常的 3 倍）
function eventTreasure(sp) { return EV && Math.random() < .08 ? { type: EV.treasure, mult: avgTreasure(sp.pool) * sp.mult * 3 } : null; }
function drawEventBack() {
  if (!EV) return;
  if (EV.id === 'moon') {
    const x = W * .82, y = 120; glowDot(ctx, x, y, 150, '#fff2c0', .45);
    ctx.fillStyle = '#fff4d0'; circle(ctx, x, y, 46); ctx.fill();
    ctx.fillStyle = 'rgba(230,210,160,0.5)'; for (const [dx, dy, r] of [[-14, -8, 9], [12, 10, 7], [6, -18, 5], [-6, 16, 6]]) { circle(ctx, x + dx, y + dy, r); ctx.fill(); }
  }
}
function drawEventFront() {
  if (!EV) return;
  if (EV.id === 'lny') {
    for (let i = 0; i < 5; i++) {
      const x = W * (.1 + i * .2), sw = Math.sin(T * 1.2 + i) * 4, y = 34 + (i % 2) * 18;
      ctx.strokeStyle = 'rgba(120,60,20,0.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + sw, y - 14); ctx.stroke();
      glowDot(ctx, x + sw, y, 30, '#ff6030', .5); ctx.fillStyle = '#e8302a'; ell(ctx, x + sw, y, 14, 17); ctx.fill();
      ctx.fillStyle = '#ffcf40'; ctx.fillRect(x + sw - 8, y - 18, 16, 4); ctx.fillRect(x + sw - 8, y + 14, 16, 4);
      ctx.fillStyle = '#ffd860'; ctx.font = 'bold 13px "Noto Sans TC",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('福', x + sw, y + 1);
    }
  } else if (EV.id === 'xmas') {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 60; i++) { const x = ((i * 173.3 + Math.sin(T * .6 + i) * 30) % W + W) % W, y = (i * 61.7 + T * (14 + i % 5 * 4)) % (H + 10) - 5; circle(ctx, x, y, 1.5 + i % 3); ctx.fill(); }
  } else if (EV.id === 'mom') {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 10; i++) { const x = (i * 131.7) % W + Math.sin(T + i) * 20, y = H - ((T * (18 + i % 4 * 5) + i * 70) % (H + 40)); ctx.globalAlpha = .55; emoji(ctx, i % 3 ? '💗' : '🌸', x, y, 20 + i % 3 * 6); }
    ctx.globalAlpha = 1;
  }
}

