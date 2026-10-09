// 每一幀的更新：魚、繁殖、寶物、蝸牛（update.js）
// ====== 更新 ======
function nearestPellet(f) {
  let best = null, bd = 1e9;
  for (const p of pellets) { const d = (p.x - f.x) ** 2 + (p.y - f.y) ** 2; if (d < bd) { bd = d; best = p; } }
  return best;
}
// 依目前速度累積擺尾的角度（泳速越快擺得越快，最多約每秒 1.8 下）
function swimStep(f, dt) { const spd = Math.hypot(f.vx, f.vy); f.swim = ((f.swim ?? f.phase) + dt * Math.min(11, 5 + spd * .05)) % 628.3; }
function updateStarFish(f, dt) {
  swimStep(f, dt);
  const sp = SSP[f.sp];
  if (sp.trail) trailStep(f, dt, fishScale(f));
  f.wanderT -= dt;
  if (f.wanderT <= 0 || Math.hypot(f.tx - f.x, f.ty - f.y) < 15) { f.tx = rand(60, W - 60); f.ty = rand(TOP + 20, FLOOR - 40); f.wanderT = rand(4, 9); }
  const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1, k = Math.min(1, dt * 1.8);
  f.vx += (dx / d * sp.speed - f.vx) * k; f.vy += (dy / d * sp.speed * .6 - f.vy) * k;
  f.x = clamp(f.x + f.vx * dt, 40, W - 40); f.y = clamp(f.y + f.vy * dt, TOP + 10, FLOOR - 30);
  if (f.vx > 8) f.face = 1; else if (f.vx < -8) f.face = -1;
  if (!POP.on && Math.random() < dt * 1.5) particles.push({ x: f.x + rand(-20, 20), y: f.y + rand(-15, 15), vy: -rand(8, 20), life: 1, icon: '✨' });
  f.dropT -= dt * B.drop;
  if (f.dropT <= 0) {
    f.dropT = sp.dropEvery * rand(.8, 1.2);
    state.treasures.push({ x: f.x, y: f.y + 10, type: weighted(sp.pool), mult: sp.mult, vy: 0, landed: false, age: 0, bob: rand(0, 6) });
  }
}
function syncStarFish() {
  starFish = state.starShown.map(id => starFish.find(f => f.sp === id) || {
    id: 'star-' + id, sp: id, name: SSP[id].name, x: rand(100, W - 100), y: TOP, vx: 0, vy: 0, tx: rand(100, W - 100), ty: rand(150, 400),
    hunger: 100, growth: 1, foodMult: 1, dropT: SSP[id].dropEvery * rand(.3, .8), face: 1, phase: rand(0, 6.28), wanderT: 0,
  });
}
// ---- 摸摸魚與親密度（0～100，每 20 點一顆心，最多 5 顆心） ----
const hearts = f => Math.min(5, Math.floor((f.love || 0) / 20));
const heartStr = f => { const n = hearts(f); return n ? '❤️'.repeat(n) + '🤍'.repeat(5 - n) : '🤍'.repeat(5); };
let followPt = { x: 0, y: 0, t: 0 };
function petFish(f) {
  f.spinT = .8; for (let i = 0; i < 5; i++) particles.push({ x: f.x + rand(-15, 15), y: f.y + rand(-10, 5), vy: -rand(20, 45), life: 1.2, icon: '💗' });
  const now = performance.now(); if (f.petAt && now - f.petAt < 3000) return; // 同一隻魚 3 秒內重複摸不加親密度
  f.petAt = now; const before = hearts(f); f.love = Math.min(100, (f.love || 0) + 2); wishProg('pet');
  if (hearts(f) > before) { floatText(f.x, f.y - 28, `${f.name}更喜歡你了！${'❤️'.repeat(hearts(f))}`, '#ffb3d9'); if (hearts(f) === 3) toast(`💕 ${f.name}有 3 顆心了，在「查看」模式按住水族箱，牠會游過來找你！`); }
}
function updateFish(f, dt) {
  swimStep(f, dt); if (f.spinT > 0) f.spinT = Math.max(0, f.spinT - dt);
  const sp = SP[f.sp], s = fishScale(f);
  if (sp.trail) trailStep(f, dt, s);
  f.hunger = Math.max(0, f.hunger - sp.hungerRate * B.hunger * dt);
  let speed = sp.speed * (f.growth < .35 ? 1.15 : 1), target = null;
  if (f.hunger < 85 && pellets.length) { target = nearestPellet(f); }
  if (target) { f.tx = target.x; f.ty = target.y; speed *= 1.8; }
  // 3 顆心以上的魚：查看模式按住水族箱時，會游到手指旁邊
  else if (followPt.t > 0 && hearts(f) >= 3) { f.tx = followPt.x + Math.cos(f.phase * 7) * 40; f.ty = followPt.y + Math.sin(f.phase * 5) * 25; speed *= 2; }
  else {
    f.wanderT -= dt;
    if (f.wanderT <= 0 || Math.hypot(f.tx - f.x, f.ty - f.y) < 15) {
      f.tx = rand(40, W - 40); f.ty = rand(TOP + 10, FLOOR - 25); f.wanderT = rand(3, 8);
    }
    if (f.hunger <= 0) speed *= .45;
  }
  const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, dt * 2.2);
  f.vx += (dx / d * speed - f.vx) * k; f.vy += (dy / d * speed * .7 - f.vy) * k;
  f.x = clamp(f.x + f.vx * dt, 30, W - 30); f.y = clamp(f.y + f.vy * dt, TOP, FLOOR - 15);
  if (f.vx > 8) f.face = 1; else if (f.vx < -8) f.face = -1;
  if (target && Math.hypot(target.x - f.x, target.y - f.y) < s * .8 + 8) {
    const fd = FD[target.food];
    f.hunger = Math.min(100, f.hunger + fd.sat); f.foodMult = fd.grow; f.love = Math.min(100, (f.love || 0) + .5);
    pellets.splice(pellets.indexOf(target), 1); wishProg('eat');
    for (let i = 0; i < 3; i++) bubbles.push({ x: f.x + rand(-5, 5), y: f.y, r: rand(1.5, 3), vy: rand(30, 60) });
  }
  if (f.hunger > 0) {
    if (f.growth < 1) {
      const before = f.growth;
      f.growth = Math.min(1, f.growth + dt / sp.growTime * f.foodMult * B.growth);
      if (before < 1 && f.growth >= 1) floatText(f.x, f.y - 20, `${f.name}長大了！`, '#9ff');
    } else {
      f.dropT -= dt * B.drop;
      if (f.dropT <= 0) {
        f.dropT = sp.dropEvery * rand(.8, 1.2);
        const ev = eventTreasure(sp), type = ev ? ev.type : weighted(sp.pool);
        // 親密度每一顆心寶物價值 +2%（最多 +10%）
        state.treasures.push({ x: f.x, y: f.y + s * .3, type, mult: (ev ? ev.mult : sp.mult) * (f.shiny ? 3 : 1) * (1 + .02 * hearts(f)) * seriesMul(sp.id), vy: 0, landed: false, age: 0, bob: rand(0, 6) });
      }
    }
  }
}

// 一次生幾隻：1～3 對生 1 隻、4～5 對 2 隻、6～7 對 3 隻、8～9 對 4 隻、10 對以上 5 隻
const litterSize = pairs => Math.min(5, Math.max(1, Math.floor(pairs / 2)));
function updateBreeding(dt) {
  for (const sp of SPECIES) {
    const el = state.fish.filter(f => f.sp === sp.id && f.growth >= 1 && f.hunger >= 40);
    const pairs = Math.floor(el.length / 2);
    if (pairs < 1 || state.fish.length >= capacity()) continue;
    // 繁殖倒數（跟幾對無關）；時間到依對數一起生：每 2 對生 1 隻，至少 1 隻、最多 5 隻
    state.breedT[sp.id] = (state.breedT[sp.id] || 0) + dt * B.breed;
    if (state.breedT[sp.id] >= sp.breedTime) {
      state.breedT[sp.id] = 0;
      const n = Math.min(litterSize(pairs), capacity() - state.fish.length), shinies = [];
      for (let i = 0; i < n; i++) {
        const a = pick(el); let b = pick(el); if (b === a) b = el.find(x => x !== a);
        const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
        const baby = spawnFish(sp.id, x, y, nurseryGrowth(), 60);
        for (let k = 0; k < 6; k++) particles.push({ x: x + rand(-20, 20), y: y + rand(-10, 10), vy: -rand(20, 45), life: 1.6, icon: '💗' });
        if (n === 1) floatText(x, y - 25, `${sp.name}寶寶「${baby.name}」誕生了！`, '#ffb3d9');
        // 小機率生出稀有色（金色／白色）的小魚
        if (Math.random() < shinyRate(sp.id)) { // 系列收集的稀有色階段會提高機率
          baby.shiny = Math.random() < .5 ? 'gold' : 'white'; shinies.push(baby);
          for (let k = 0; k < 12; k++) particles.push({ x: x + rand(-30, 30), y: y + rand(-20, 20), vy: -rand(20, 60), life: 2, icon: '✨' });
        }
        dexSee(sp.id, baby.shiny); state.stats.born++;
      }
      toast(n > 1 ? `🎉 ${sp.name}一起生了 ${n} 隻小魚！` : `🎉 ${sp.name}生了小魚！`); taskProg('breed', n); wishProg('breed', n);
      if (shinies.length) setTimeout(() => ask(`✨ 太幸運了！\n生出了稀有的「${shinies.map(b => SHINY_NAME[b.shiny] + sp.name).join('」、「')}」！\n\n稀有色的魚寶物價值 3 倍，賣出和放生也是 3 倍。`, '好棒！', null), 400);
      if (menuOpen && tab === 'mine') renderTab();
    }
  }
}

function update(dt) {
  T += dt;
  updatePop(dt); if (followPt.t > 0) followPt.t = dragging && viewMode ? 2.5 : followPt.t - dt; // 手指按住不放時一直跟著
  updateVisitor(dt); updateMeteor(dt); updateBottle(dt);
  for (const f of state.fish) updateFish(f, dt);
  for (const f of starFish) updateStarFish(f, dt);
  for (let i = releasing.length - 1; i >= 0; i--) {
    const r = releasing[i]; r.life -= dt; swimStep(r.f, dt); r.f.y -= 70 * dt; r.f.x += r.f.vx * dt * .5; r.f.vy = -60;
    if (Math.random() < dt * 8) particles.push({ x: r.f.x + rand(-15, 15), y: r.f.y + rand(-10, 10), vy: -rand(10, 30), life: .8, icon: '⭐' });
    if (r.life <= 0) releasing.splice(i, 1);
  }
  updateBreeding(dt);
  // 飼料
  for (let i = pellets.length - 1; i >= 0; i--) {
    const p = pellets[i];
    if (p.y < FLOOR + 5) { p.y += 38 * dt; p.x += Math.sin(T * 2 + p.seed) * 12 * dt; }
    else { p.floor += dt; if (p.floor > 12) pellets.splice(i, 1); }
  }
  // 寶物
  for (let i = state.treasures.length - 1; i >= 0; i--) {
    const t = state.treasures[i];
    if (!t.landed) { t.vy = Math.min(90, t.vy + 80 * dt); t.y += t.vy * dt; if (t.y >= (t.floorY || (t.floorY = rand(FLOOR + 8, FLOOR + 45)))) { t.y = t.floorY; t.landed = true; } }
    else { t.age += dt; if (t.age > 120) state.treasures.splice(i, 1); }
  }
  // 自動餵食器
  if (state.feederLv > 0 && !state.feederOff) { // 可以在設備頁暫時關閉
    feederT += dt;
    if (feederT >= feederInterval(state.feederLv)) {
      feederT = 0; const fd = FD[state.food];
      if (state.fish.some(f => f.hunger < 70) && state.coins >= fd.cost) { state.coins -= fd.cost; pellets.push(mkPellet(rand(60, W - 60), TOP - 20)); }
    }
  }
  // 蝸牛
  // 蝸牛：兩隻的時候各自負責半邊
  const nS = snailCount();
  for (let i = 0; i < nS; i++) {
    const sn = snails[i], lo = nS > 1 && i === 1 ? W / 2 : 0, hi = nS > 1 && i === 0 ? W / 2 : W;
    let best = null, bd = 1e9;
    for (const t of state.treasures) if (t.landed && t.x >= lo && t.x < hi) { const d = Math.abs(t.x - sn.x); if (d < bd) { bd = d; best = t; } }
    if (best) {
      const dx = best.x - sn.x; sn.dir = dx > 0 ? 1 : -1; sn.moving = Math.abs(dx) > 1;
      sn.x += sn.dir * Math.min(Math.abs(dx), snailSpeed(state.snailLv) * dt);
      if (Math.abs(best.x - sn.x) < 6) collectTreasure(best);
    } else sn.moving = false;
  }
  // 打氣機：從右邊石頭冒出一串氣泡
  if (state.pumpLv > 0 && Math.random() < dt * (5 + state.pumpLv * 4)) bubbles.push({ x: W * .535 + rand(-3, 3), y: H - 16, r: rand(2, 4.5), vy: rand(60, 100) });
  // 金幣飛向左上角的金幣數
  for (let i = coinFx.length - 1; i >= 0; i--) {
    const f = coinFx[i]; f.t += dt; f.spin += dt * 9;
    if (f.t >= f.dur) { coinFx.splice(i, 1); bumpPill(); }
  }
  // 粒子
  for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.y += p.vy * dt; p.life -= dt; if (p.life <= 0) particles.splice(i, 1); }
  for (let i = texts.length - 1; i >= 0; i--) { const t = texts[i]; t.y -= 30 * dt; t.life -= dt; if (t.life <= 0) texts.splice(i, 1); }
  if (Math.random() < dt * 3) bubbles.push({ x: rand(20, W - 20), y: FLOOR, r: rand(1.5, 4), vy: rand(30, 70) });
  for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; b.y -= b.vy * dt; b.x += Math.sin(T * 3 + b.r * 10) * 10 * dt; if (b.y < 5) bubbles.splice(i, 1); }
}

