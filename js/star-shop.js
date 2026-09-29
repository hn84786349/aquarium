// 星星小舖（star-shop.js）：限時加成藥水、蝸牛造型

// ====== 限時加成藥水：效果 30 分鐘，重複兌換會延長（最多 3 小時）；離線收益不算藥水 ======
const POTIONS = {
  value:  { icon: '💰', name: '寶物藥水', desc: '寶物價值 ×2', mul: 2, base: 100, k: 20 },
  drop:   { icon: '⚡', name: '產寶藥水', desc: '魚產寶物的速度 ×2', mul: 2, base: 100, k: 20 },
  breed:  { icon: '💞', name: '繁殖藥水', desc: '繁殖速度 ×2', mul: 2, base: 80, k: 15 },
  growth: { icon: '🌱', name: '成長藥水', desc: '小魚長大的速度 ×3', mul: 3, base: 50, k: 10 },
};
const POTION_TIME = 30 * 60 * 1000, POTION_MAX = 3 * 3600 * 1000;
// 價格跟著進度變：大約是「最高級的魚放生星星」的 2 成（最便宜 50～100 顆）
const potionPrice = id => Math.max(POTIONS[id].base, Math.round(rewardStars() * POTIONS[id].k / 10) * 10);
const potionLeft = id => Math.max(0, ((state.potions || {})[id] || 0) - Date.now());
let potionPause = false, potionActive = '';
// calcBonus 會呼叫：把生效中的藥水乘進加成
function applyPotions(B) {
  if (potionPause) return;
  for (const id in POTIONS) if (potionLeft(id) > 0) B[id] *= POTIONS[id].mul;
}
const mmss = ms => { const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${m}:${String(ss).padStart(2, '0')}`; };
// 每秒更新左上角的藥水倒數；有藥水到期時重新計算加成
function potionTick() {
  const on = Object.keys(POTIONS).filter(id => potionLeft(id) > 0), key = on.join();
  if (key !== potionActive) {
    const ended = potionActive.split(',').filter(id => id && !on.includes(id));
    potionActive = key; calcBonus();
    if (ended.length) toast(`🧪 ${ended.map(id => POTIONS[id].name).join('、')}的效果結束了`);
  }
  const pill = $('#potionPill'); pill.hidden = !on.length;
  if (on.length) pill.textContent = on.map(id => `${POTIONS[id].icon}×${POTIONS[id].mul} ${mmss(potionLeft(id))}`).join('　');
}

// ====== 魚的特效（已取消）：之前兌換過的會把星星退還 ======
const OLD_FX_COST = { hearts: 500, stardust: 1000, bubbles: 1500, halo: 2000, sparkle: 3000, aura: 5000 };
function refundFishFx() {
  const own = state.fxOwned || []; delete state.fxOwned; for (const f of state.fish) delete f.fx;
  const st = own.reduce((a, id) => a + (OLD_FX_COST[id] || 0), 0);
  if (st) { state.stars += st; setTimeout(() => toast(`✨ 魚的特效已取消，退還 ⭐${fmt(st)}`), 1500); }
}

// ====== 蝸牛造型：只換外觀 ======
const SNAIL_SKINS = {
  normal:  { name: '🐌 原本的蝸牛', cost: 0,    body: ['#eccb9f', '#c9a07a', '#dcb88c'], shell: ['#d9793a', '#b95a26', '#e8934a', '#c86a30', '#f0a458', '#b95a26', '#dd8240', '#c86a30'], line: '#ffd89a' },
  gold:    { name: '🌟 金色蝸牛', cost: 300,  body: ['#f4dca8', '#d8b478', '#e8c890'], shell: ['#ffd24a', '#d8a020', '#ffe070', '#e8b030', '#fff090', '#d8a020', '#ffd850', '#e8b030'], line: '#fffbe0', glow: '#ffe890' },
  sakura:  { name: '🌸 櫻花蝸牛', cost: 600,  body: ['#ffe4ea', '#f0bcc8', '#ffd0dc'], shell: ['#ff9ab8', '#f07aa0', '#ffb8cc', '#f890b0', '#ffd0dc', '#f07aa0', '#ffa8c4', '#f890b0'], line: '#ffffff' },
  crystal: { name: '💎 水晶蝸牛', cost: 1500, body: ['#e8f4ff', '#b8d4f0', '#d0e8ff'], shell: ['#a8e0ff', '#80c0f0', '#c8f0ff', '#90d0f8', '#e0f8ff', '#80c0f0', '#b8e8ff', '#90d0f8'], line: '#ffffff', glow: '#c8f0ff', twinkle: true },
  rainbow: { name: '🌈 彩虹蝸牛', cost: 3000, body: ['#fff4f8', '#e8d0e0', '#f8e4f0'], shell: 'rainbow', line: '#ffffff', twinkle: true },
  galaxy:  { name: '🌌 星空蝸牛', cost: 6000, body: ['#d8d0f0', '#a898d0', '#c0b4e8'], shell: ['#3a1a8a', '#28126a', '#5a2ab0', '#30187a', '#6a3ac8', '#28126a', '#4a22a0', '#30187a'], line: '#ffd8ff', glow: '#b890ff', stars: true },
};
const snailSkin = () => SNAIL_SKINS[state.snailSkin] || SNAIL_SKINS.normal;

// ====== 星星小舖頁面 ======
function renderStarShop() {
  let h = `<p class="hint">用星星兌換各種好東西！放生魚、完成任務、戳泡泡都能拿到星星。</p>`;
  h += `<h4>🧪 限時加成藥水</h4><p class="hint">每瓶效果 30 分鐘，重複兌換會延長時間（最多 3 小時）。離開遊戲時藥水一樣會倒數，但離線收益不算藥水的效果。價格會跟著你的進度調整。</p>`;
  for (const id in POTIONS) {
    const p = POTIONS[id], left = potionLeft(id);
    h += `<div class="card"><div class="ico">${p.icon}</div><div class="info"><b>${p.name}</b><small>${p.desc}・30 分鐘</small>${left ? `<small style="color:var(--good)">生效中，還剩 ${mmss(left)}</small>` : ''}</div>
      ${left > POTION_MAX - POTION_TIME ? '<button disabled>已達上限</button>' : costBtn('buyPotion', id, potionPrice(id), left ? '延長' : '兌換', '', true)}</div>`;
  }
  h += `<h4>🐌 蝸牛造型</h4>${state.snailLv ? '' : '<p class="hint">先在「設備・造景」買撿寶蝸牛，才看得到造型喔。</p>'}`;
  for (const id in SNAIL_SKINS) {
    const k = SNAIL_SKINS[id], own = id === 'normal' || (state.ownedSkins || []).includes(id), on = (state.snailSkin || 'normal') === id;
    h += `<div class="card ${on ? 'sel' : ''}"><img src="${snailPrev(id)}" alt="" style="width:66px;height:44px;object-fit:contain"><div class="info"><b>${k.name.split(' ')[1]}</b><small>${id === 'normal' ? '預設造型' : '只換外觀，撿寶速度不變'}</small></div>
      ${on ? '<button class="on" disabled>使用中</button>' : own ? `<button data-act="useSkin" data-arg="${id}">使用</button>` : costBtn('buySkin', id, k.cost, '兌換', '', true)}</div>`;
  }
  return h;
}
// 蝸牛造型的小預覽圖
const SNAIL_PREV = {};
function snailPrev(id) {
  if (SNAIL_PREV[id]) return SNAIL_PREV[id];
  const cv = document.createElement('canvas'); cv.width = 132; cv.height = 88; const c = cv.getContext('2d'), old = state.snailSkin;
  state.snailSkin = id; drawSnail(c, 62, 58, 24, 1, false); state.snailSkin = old;
  return SNAIL_PREV[id] = cv.toDataURL();
}

Object.assign(ACTIONS, {
  buyPotion(id) {
    const left = potionLeft(id); if (left > POTION_MAX - POTION_TIME) return toast('已經是最長的 3 小時了');
    if (!pay(potionPrice(id), true)) return;
    (state.potions || (state.potions = {}))[id] = Date.now() + left + POTION_TIME; potionTick(); calcBonus();
    toast(`🧪 ${POTIONS[id].name}：${POTIONS[id].desc}，還有 ${mmss(potionLeft(id))}`);
  },
  buySkin(id) {
    const own = state.ownedSkins || (state.ownedSkins = []);
    if (own.includes(id) || !pay(SNAIL_SKINS[id].cost, true)) return; own.push(id); ACTIONS.useSkin(id);
  },
  useSkin(id) { state.snailSkin = id; toast(`🐌 蝸牛換成「${SNAIL_SKINS[id].name.split(' ')[1]}」`); },
});
