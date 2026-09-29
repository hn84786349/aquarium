// 主迴圈與離線收益（loop.js）
// ====== 主迴圈 ======
let last = performance.now(), hudT = 0, saveT = 0, cloudT = 0, secT = 0, lastCoins = -1, lastFishN = -1, lastStars = -1;
let lastFrame = 0;
function frame(now) {
  // 電腦的高更新率螢幕會每秒呼叫 120～165 次，限制在約 60～80 張，畫面一樣順但負擔少一半
  if (now - lastFrame < 12) { requestAnimationFrame(frame); return; }
  lastFrame = now;
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  update(dt); render();
  hudT += dt; saveT += dt;
  if (state.coins !== lastCoins || state.fish.length !== lastFishN || state.stars !== lastStars) {
    if (state.fish.length !== lastFishN && menuOpen && tab === 'shop' && !panelPressed) setTimeout(renderTab, 0);
    lastCoins = state.coins; lastFishN = state.fish.length; lastStars = state.stars;
    $('#starPill').textContent = `⭐ ${fmt(state.stars)}`; updateWallet();
    $('#coinPill').textContent = `💰 ${fmt(state.coins)}`; $('#fishPill').textContent = `🐟 ${state.fish.length}/${capacity()}`;
  }
  if (hudT > .5) {
    hudT = 0; refreshAfford(); if (selFishId) updateFishCard();
    if (dailyDirty && menuOpen && tab === 'daily' && !panelPressed) renderTab();
    dailyDirty = false;
    if (menuOpen && tab === 'mine' && !panelPressed && (T | 0) % 2 === 0) renderTab();
  }
  secT += dt;
  if (secT > 1) {
    secT = 0; checkAch(); updatePopDot();
    if (state.daily.date !== todayStr()) { newDay(); updateEvent(); }
  }
  if (saveT > 5) { saveT = 0; save(); }
  cloudT += dt; if (cloudT > 120) { cloudT = 0; Cloud.upload(); }
  requestAnimationFrame(frame);
}

// ====== 離線收益 ======
// 離開期間魚兒照樣產寶，但只算正常速度的 30%，最多累積 2 小時（升級離線收集網可到 8 小時）；離開時不會肚子餓
const OFFLINE_RATE = 0.3;
function incomePerSec() {
  let v = 0;
  for (const f of state.fish) if (f.growth >= 1) { const sp = SP[f.sp]; v += avgTreasure(sp.pool) * sp.mult / sp.dropEvery * (f.shiny ? 3 : 1); }
  for (const id of state.starShown) { const sp = SSP[id]; v += avgTreasure(sp.pool) * sp.mult / sp.dropEvery; }
  return v * B.value * B.drop;
}
function fmtDur(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60);
  return h ? `${h} 小時${m ? ` ${m} 分鐘` : ''}` : `${Math.max(1, m)} 分鐘`;
}
let offlineShown = false;
// 離線繁殖：離開期間成魚一樣會繁殖，但每一對最多只生一隻；小魚在離線時不會長大，回來後才開始成長
function offlineBreed(sec) {
  const born = [];
  for (const sp of SPECIES) {
    const el = state.fish.filter(f => f.sp === sp.id && f.growth >= 1 && f.hunger >= 40), pairs = Math.floor(el.length / 2);
    if (pairs < 1) continue;
    // 跟線上一樣的倒數與每次生的數量，但離線期間每一對最多只生一隻
    const prog = (state.breedT[sp.id] || 0) + sec * B.breed, rounds = Math.floor(prog / sp.breedTime);
    let n = Math.min(pairs, rounds * litterSize(pairs), capacity() - state.fish.length);
    if (n <= 0) { state.breedT[sp.id] = Math.min(prog, sp.breedTime * .99); continue; }
    state.breedT[sp.id] = Math.min(prog - rounds * sp.breedTime, sp.breedTime * .99);
    for (let i = 0; i < n; i++) {
      const a = el[i * 2], baby = spawnFish(sp.id, a.x + rand(-20, 20), a.y + rand(-15, 15), nurseryGrowth(), 60);
      if (Math.random() < SHINY_RATE) baby.shiny = Math.random() < .5 ? 'gold' : 'white';
      dexSee(sp.id, baby.shiny); state.stats.born++; born.push(baby);
    }
  }
  if (born.length) taskProg('breed', born.length);
  return born;
}
function checkOffline() {
  const now = Date.now(), away = state.lastSeen ? (now - state.lastSeen) / 1000 : 0;
  state.lastSeen = now;
  if (away < 60 || offlineShown) return;
  const sec = Math.min(away, offlineMaxH() * 3600), amt = Math.floor(incomePerSec() * sec * OFFLINE_RATE * B.offline);
  const born = offlineBreed(sec);
  if (amt < 1 && !born.length) return;
  offlineShown = true;
  // 整理出生的小魚：孔雀魚 ×2、✨金色小丑魚 …
  const cnt = {}; for (const f of born) { const k = (f.shiny ? `✨${SHINY_NAME[f.shiny]}` : '') + SP[f.sp].name; cnt[k] = (cnt[k] || 0) + 1; }
  const bornTxt = born.length ? `🍼 這段時間生了 ${born.length} 隻小魚：\n${Object.entries(cnt).map(([k, n]) => `${k} ×${n}`).join('、')}` : '';
  $('#welcomeMsg').textContent = `歡迎回來！\n你離開了 ${fmtDur(away)}${amt >= 1 ? `，魚兒們找到的寶物已經換成金幣${away > sec ? `\n（最多只能累積 ${offlineMaxH()} 小時，可以升級「離線收集網」）` : ''}：` : '。'}`;
  $('#welcomeBorn').textContent = bornTxt; $('#welcomeBorn').hidden = !born.length;
  $('#welcomeAmt').textContent = amt >= 1 ? `💰 ${fmt(amt)}` : '';
  $('#welcomeOk').textContent = amt >= 1 ? '收下金幣' : '好';
  $('#welcome').hidden = false;
  $('#welcomeOk').onclick = () => {
    $('#welcome').hidden = true; offlineShown = false;
    if (amt >= 1) { state.coins += amt; state.earned += amt; toast(`收下了 💰${fmt(amt)}`); }
    save(); Music.start();
  };
}

