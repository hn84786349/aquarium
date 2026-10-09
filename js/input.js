// 點擊與操作（input.js）
// ====== 互動 ======
function floatText(x, y, text, color = '#ffd84d') { texts.push({ x, y, text, color, life: 1.5 }); }
let toastTimer;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1800); }
function mkPellet(x, y) { return { x, y, food: state.food, floor: 0, seed: rand(0, 6) }; }

function collectTreasure(t) {
  const i = state.treasures.indexOf(t); if (i < 0) return;
  state.treasures.splice(i, 1);
  const v = Math.round(TREASURE[t.type].value * (t.mult || 1) * B.value);
  state.coins += v; state.earned += v; taskProg('collect'); wishProg('collect');
  if (POP.on) return; // 戳泡泡時蝸牛在背後撿寶物，不顯示金幣特效
  // 寶物變成金幣：價值越高，金幣越多、顏色從銅 → 銀 → 金
  const tier = v < 40 ? 0 : v < 400 ? 1 : 2, n = [2, 3, 5][tier];
  // 金幣飛向左上角的特效（可以在設定裡關掉；關掉時左上角的金幣數字直接跳一下）
  // 同時飛行的金幣最多 COINFX_MAX 顆，超過的直接加錢、數字跳一下就好
  const room = state.coinFx !== false ? Math.min(n, COINFX_MAX - coinFx.length) : 0;
  for (let k = 0; k < room; k++) coinFx.push({ x0: t.x + rand(-10, 10), y0: t.y + rand(-6, 6), t: -k * .07, dur: .85, tier, spin: rand(0, 6) });
  if (room <= 0) bumpPill();
  // 短時間內在附近連續撿到的寶物，「+金額」合併成一個
  const near = texts.find(q => q.coinV && q.life > .9 && Math.abs(q.x - t.x) < 120);
  if (near) { near.coinV += v; near.text = `+${fmt(near.coinV)}`; near.tier = Math.max(near.tier, tier); near.color = COIN_COL[near.tier][1]; }
  else if (texts.length < 20) { floatText(t.x, t.y - 22, `+${fmt(v)}`, COIN_COL[tier][1]); Object.assign(texts[texts.length - 1], { coinV: v, tier }); }
  if (particles.length < PARTICLE_MAX) {
    particles.push({ x: t.x, y: t.y, vy: -30, life: .45, icon: TREASURE[t.type].icon });
    for (let k = 0; k < 3; k++) particles.push({ x: t.x + rand(-10, 10), y: t.y, vy: -rand(30, 60), life: .8, icon: '✨' });
  }
}
const COIN_COL = [['#a8672f', '#f0b27a'], ['#8f99aa', '#f2f5fa'], ['#d6960f', '#ffe27a']];
// 八角形的低多邊形金幣，會翻轉
function drawCoin(c, x, y, r, tier, spin) {
  const [d, l] = COIN_COL[tier], sx = Math.max(.25, Math.abs(Math.cos(spin)));
  c.save(); c.translate(x, y); c.scale(sx, 1);
  const P = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; P.push([Math.cos(a) * r, Math.sin(a) * r]); }
  P.forEach((p, i) => { const q = P[(i + 1) % 8]; c.fillStyle = i < 4 ? d : l; c.beginPath(); c.moveTo(0, 0); c.lineTo(...p); c.lineTo(...q); c.closePath(); c.fill(); });
  c.fillStyle = l; circle(c, 0, 0, r * .62); c.fill();
  c.fillStyle = d; circle(c, r * .08, r * .08, r * .45); c.fill();
  c.fillStyle = l; circle(c, 0, 0, r * .42); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.moveTo(-r * .5, -r * .2); c.lineTo(-r * .2, -r * .55); c.lineTo(-r * .05, -r * .45); c.lineTo(-r * .38, -r * .08); c.fill();
  c.restore();
}
function worldPos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
function treasureAt(p, rad = 30) {
  let best = null, bd = rad * rad;
  for (const t of state.treasures) { const d = (t.x - p.x) ** 2 + (t.y - p.y) ** 2; if (d < bd) { bd = d; best = t; } }
  return best;
}
let dragging = false;
canvas.addEventListener('pointerdown', e => {
  dragging = true; const p = worldPos(e);
  // 飼料選單打開時，點水族箱只是把選單關掉
  if (!$('#foodPop').hidden) { toggleFood(false); dragging = false; return; }
  if (POP.on) { popAt(p); return; }
  if (bottleAt(p)) { openBottle(); return; }
  if (tapMeteor(p)) return;
  if (visitorAt(p)) { tapVisitor(); return; }
  const t = treasureAt(p); if (t) { collectTreasure(t); return; }
  // 查看模式：點魚看狀態、點造景升級，不會投放飼料
  if (viewMode) {
    let hit = null, hd = 1e9;
    for (const f of [...state.fish, ...starFish]) { const s = fishScale(f) * 1.4 + 8, d = Math.hypot(f.x - p.x, f.y - p.y); if (d < s && d < hd) { hd = d; hit = f; } }
    if (hit) { if (hit.id !== selFishId) taskProg('view'); selFishId = hit.id; if (typeof hit.id === 'number') petFish(hit); updateFishCard(); return; }
    const pc = !treasureAt(p, 60) && sceneAt(p);
    if (pc) { openScene(pc.id); return; }
    followPt = { x: p.x, y: p.y, t: 2.5 };
    selFishId = null; updateFishCard(); return;
  }
  // 餵食模式：點哪裡就投放飼料（點到魚也一樣）
  const fd = FD[state.food];
  if (state.coins < fd.cost) { floatText(p.x, p.y, '金幣不足', '#ff8080'); return; }
  state.coins -= fd.cost; pellets.push(mkPellet(p.x, Math.max(TOP - 20, Math.min(p.y, FLOOR)))); taskProg('feed');
});
canvas.addEventListener('pointermove', e => {
  if (!dragging && e.pointerType !== 'mouse') return; const p = worldPos(e);
  if (POP.on) { if (dragging || e.pointerType === 'mouse') popAt(p); return; }
  if (viewMode && dragging && followPt.t > 0) followPt = { x: p.x, y: p.y, t: 2.5 };
  const t = treasureAt(p, 24); if (t && (dragging || e.buttons === 0)) collectTreasure(t);
});
window.addEventListener('pointerup', () => dragging = false);

// 右上角的「餵食」按鈕：顯示目前的飼料，按下去可以換飼料
// 右上角按鈕：可以選「查看」（點魚看狀態）或某一種飼料（點哪裡就餵到哪裡）
let viewMode = false;
function updateModeLabel() {
  const fd = FD[state.food];
  $('#modeFeed').innerHTML = viewMode ? '🔍 查看 ▾' : `🍤 餵食 <span class="lbl">${fd.name}</span> 💰${fd.cost} ▾`;
  $('#modeFeed').classList.toggle('on', !viewMode); $('#modeFeed').classList.toggle('view', viewMode);
  if (!$('#foodPop').hidden) renderFood();
}
function renderFood() {
  $('#foodPop').innerHTML = `<div class="fh">要做什麼？</div>
    <button class="food ${viewMode ? 'on' : ''}" data-food="view"><span class="fi">🔍</span><span><b>查看</b><small>點魚看狀態、賣出或放生；點造景可以升級</small></span></button>
    ${FOODS.map(fd => `<button class="food ${!viewMode && state.food === fd.id ? 'on' : ''}" data-food="${fd.id}"><span class="fi">${fd.icon}</span>
    <span><b>${fd.name}</b>　💰${fd.cost}／顆<small>飽食度 +${fd.sat}・幼魚成長 ×${fd.grow}</small></span></button>`).join('')}
    <p class="hint">選好飼料後，在水族箱點一下就會投放一顆。<br>💡 飽食度 ≥ 40 的同種成魚兩隻就會繁殖；飽食度歸零的魚不會長大、也不會產寶物。</p>`;
}
function toggleFood(show = $('#foodPop').hidden) {
  if (show) { renderFood(); if (menuOpen) closeMenu(); }
  $('#foodPop').hidden = !show; $('#modeFeed').setAttribute('aria-expanded', show);
}
$('#modeFeed').onclick = () => toggleFood();
$('#foodPop').addEventListener('click', e => {
  const b = e.target.closest('[data-food]'); if (!b) return;
  if (b.dataset.food === 'view') { viewMode = true; toast('🔍 查看模式：點魚看狀態'); }
  else { viewMode = false; state.food = b.dataset.food; selFishId = null; updateFishCard(); toast(`🍤 餵食：${FD[state.food].name}`); save(); }
  updateModeLabel(); toggleFood(false);
});
// 遊戲內的確認視窗（網頁版不支援瀏覽器的 confirm）
function ask(msg, yes = '確定', no = '取消') {
  return new Promise(res => {
    $('#askMsg').textContent = msg; $('#askYes').textContent = yes; $('#ask').hidden = false;
    $('#askNo').hidden = !no; if (no) $('#askNo').textContent = no;
    const done = v => { $('#ask').hidden = true; $('#askYes').onclick = $('#askNo').onclick = null; res(v); };
    $('#askYes').onclick = () => done(true); $('#askNo').onclick = () => done(false);
  });
}
