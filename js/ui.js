// 選單與各分頁畫面（ui.js）
// ====== 側邊面板 ======
const tabEl = $('#tab');
// ====== 全螢幕 ======
// 電腦與 Android 可用瀏覽器的全螢幕；iPhone 的 Safari 不支援網頁全螢幕，改成教怎麼隱藏網址列
const isFull = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
// 從主畫面圖示打開時（App 模式）已經是全螢幕
// （用全螢幕按鈕進入全螢幕時瀏覽器也會回報 fullscreen 模式，要排除，否則「離開全螢幕」按鈕會不見）
const isAppMode = () => !!navigator.standalone || matchMedia('(display-mode: standalone)').matches || (matchMedia('(display-mode: fullscreen)').matches && !isFull());
function fsTip() {
  const ios = /iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !/iPad/.test(navigator.userAgent) && screen.width < 500);
  ask(ios
    ? 'iPhone 的 Safari 不能讓網頁直接全螢幕，可以這樣做：\n\n⭐ 最推薦：加入主畫面\n用 Safari 打開遊戲網址 →\n點下方的「分享」按鈕 → 選「加入主畫面」。\n之後從主畫面的水族箱圖示打開，就是全螢幕。\n\n或是暫時隱藏網址列：\n點網址列旁的「aA」或「⋯」→「隱藏工具列」。'
    : '這個瀏覽器不支援全螢幕。\n\n可以試試把手機橫過來，或在瀏覽器選單裡找「隱藏工具列」、「全螢幕」的選項。', '知道了', null);
}
async function toggleFullscreen() {
  const el = document.documentElement;
  try {
    if (isFull()) { await (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req) return fsTip();
    await req.call(el, { navigationUI: 'hide' });
    closeMenu();
    // Android 進入全螢幕後順便固定成橫向，不支援就略過
    try { await screen.orientation.lock('landscape'); } catch (e) { }
  } catch (e) { fsTip(); }
}
function updateFsBtn() { if (menuOpen) renderTab(); setTimeout(resize, 150); }
document.addEventListener('fullscreenchange', updateFsBtn);
document.addEventListener('webkitfullscreenchange', updateFsBtn);

// ====== 選單開關 ======
let menuOpen = false, menuOpenedAt = 0;
const applyBigText = () => document.body.classList.toggle('big', !!state.bigText);
function updateWallet() { $('#wCoin').textContent = fmt(state.coins); $('#wStar').textContent = fmt(state.stars); }
function openMenu() { updateWallet(); menuOpen = true; menuOpenedAt = performance.now(); document.body.classList.add('menu-open'); $('#menu').hidden = false; $('#menuBack').hidden = false; $('#menuBtn').classList.add('on'); renderTab(); }
function closeMenu() { menuOpen = false; document.body.classList.remove('menu-open'); $('#menu').hidden = true; $('#menuBack').hidden = true; $('#menuBtn').classList.remove('on'); }
$('#menuBtn').onclick = () => menuOpen ? closeMenu() : openMenu();
$('#menuClose').onclick = closeMenu;
// 觸控點擊後瀏覽器會補送一次 click，剛開啟時先忽略，避免選單一開就被關掉
$('#menuBack').onclick = () => { if (performance.now() - menuOpenedAt > 450) closeMenu(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
// 上層分頁：商店（魚、夢幻魚、設備・造景、背景）／我的魚
function setTab(t) {
  const top = t === 'mine' || t === 'settings' ? t : ['dex', 'ach', 'daily'].includes(t) ? 'collect' : 'store';
  tab = t; if (top === 'store') storeTab = t; if (top === 'collect') collectTab = t;
  document.querySelectorAll('#tabs button, #tabs2 button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  document.querySelectorAll('#topTabs button').forEach(b => b.classList.toggle('on', b.dataset.top === top));
  $('#tabs').hidden = top !== 'store'; $('#tabs2').hidden = top !== 'collect'; tabEl.scrollTop = 0; renderTab();
}
$('#tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setTab(b.dataset.tab); });
$('#topTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setTab(b.dataset.top === 'store' ? storeTab : b.dataset.top === 'collect' ? collectTab : b.dataset.top); });
$('#tabs2').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setTab(b.dataset.tab); });
$('#giftBtn').onclick = () => { setTab('daily'); if (!menuOpen) openMenu(); };
$('#popBtn').onclick = e => { e.stopPropagation(); startPop(); };

// 一次買很多隻：數量受空位和金幣限制，買得起幾隻就買幾隻
function buyFishN(id, want) {
  const sp = SP[id], space = capacity() - state.fish.length;
  if (space <= 0) return toast('水族箱已滿！');
  const n = Math.min(want, space, Math.floor(state.coins / sp.price));
  if (n <= 0) return toast('金幣不夠喔！');
  state.coins -= sp.price * n;
  for (let i = 0; i < n; i++) { const f = spawnFish(id, rand(100, W - 100), TOP - rand(0, 60), 0.4, 70); f.ty = rand(150, 400); }
  state.maxTier = Math.max(state.maxTier || 0, sp.tier); dexSee(id); taskProg('buy', n);
  toast(`買了 ${n} 隻${sp.name}，花費 💰${fmt(sp.price * n)}${n < want && want !== Infinity ? `（${n < space ? '金幣只夠買' : '水族箱只剩空間放'} ${n} 隻）` : ''}`);
}
function costBtn(act, arg, cost, label, extra = '', star = false) {
  return `<button data-act="${act}" data-arg="${arg}" data-cost="${cost}" ${star ? 'data-star="1" class="star"' : ''} ${extra}>${label} ${curIcon(star)}${fmt(cost)}</button>`;
}
// 說明用：平均每次、每分鐘能換到多少金幣（基本值，不含造景與背景加成）
function coinNote(pool, every, mult) {
  const per = avgTreasure(pool) * mult;
  return `💰 每 ${every} 秒產出約 ${fmt(per)} 金幣（每分鐘約 ${fmt(per * 60 / every)}）`;
}
const fmtTime = sec => sec < 60 ? `${sec} 秒` : sec < 3600 ? (sec % 60 ? `${Math.floor(sec / 60)} 分 ${sec % 60} 秒` : `${sec / 60} 分鐘`) : `${Math.floor(sec / 3600)} 小時${Math.round(sec % 3600 / 60) ? ` ${Math.round(sec % 3600 / 60)} 分` : ''}`;
function renderTab() {
  let h = '';
  if (tab === 'shop') {
    const full = state.fish.length >= capacity();
    // 目前魚的數量／上限，快滿變黃、滿了變紅
    const n = state.fish.length, cap = capacity(), capCol = full ? 'var(--bad)' : n >= cap * .8 ? 'var(--accent)' : 'var(--good)';
    h += `<div class="capBox sticky"><div class="row"><span>🐟 水族箱：<b style="color:${capCol}">${n}</b> / ${cap} 隻</span>
      ${full ? '<small style="color:var(--bad)">已滿，可到「設備・造景」擴充水族箱，或賣掉、放生一些魚</small>' : n >= cap * .8 ? '<small style="color:var(--accent)">快滿了</small>' : ''}</div>
      <div class="bar"><i style="width:${Math.min(100, n / cap * 100)}%;background:${capCol}"></i></div></div>`;
    // 只顯示到「買過最高級的魚再往後 3 種」，更後面的先保密，買到了才會出現
    const lim = shopLimit(), hidden = SPECIES.length - 1 - lim;
    for (const sp of SPECIES) {
      if (sp.tier > lim) break;
      h += `<div class="card"><img src="${PREV[sp.id]}" alt=""><div class="info"><b>${sp.name}</b><small>${sp.desc}</small>
        <small class="own">持有：<b>${state.fish.filter(f => f.sp === sp.id).length}</b> 隻　<span class="relstar">成魚放生 ⭐${sp.stars}</span></small>
        <small>產出：${sp.pool.map(([t]) => TREASURE[t].icon).join(' ')}　長大約 ${fmtTime(sp.growTime)}</small><small>${coinNote(sp.pool, sp.dropEvery, sp.mult)}</small></div>
        <div class="buyCol">${costBtn('buyFish', sp.id, sp.price, '購買', 'data-space="1"')}
        <button data-act="buyFish10" data-arg="${sp.id}" data-cost="${sp.price}" data-space="1">購買 10 隻</button>
        <button data-act="buyFishMax" data-arg="${sp.id}" data-cost="${sp.price}" data-space="1">購買到滿</button></div></div>`;
    }
    if (hidden > 0) h += `<div class="card"><div class="ico">🔒</div><div class="info"><b>還有 ${hidden} 種更稀有的魚</b><small>買到更高級的魚，就會出現新的魚種（越後面越華麗夢幻）</small></div></div>`;
  } else if (tab === 'decor') {
    const r = B.raw;
    h += `<h3>🔧 設備</h3>`;
    h += `<div class="card"><div class="ico">🫙</div><div class="info"><b>擴充水族箱</b><small>容量 ${capacity()} 隻${state.capLv < CAP_MAX_LV ? ` → ${capacity() + CAP_STEP} 隻` : '（已達上限）'}</small></div>
      ${state.capLv < CAP_MAX_LV ? costBtn('buyCap', '', capCost(state.capLv), '擴充') : '<button disabled>MAX</button>'}</div>`;
    h += `<div class="card"><div class="ico">🤖</div><div class="info"><b>自動餵食器 Lv.${state.feederLv}</b><small>${state.feederLv ? `每 ${feederInterval(state.feederLv)} 秒自動投放目前選擇的飼料` : '有魚肚子餓時自動投放飼料（會扣飼料錢）'}</small></div>
      ${state.feederLv < FEEDER_MAX ? costBtn('buyFeeder', '', feederCost(state.feederLv), state.feederLv ? '升級' : '購買') : '<button disabled>MAX</button>'}</div>`;
    h += `<div class="card"><div class="ico">🐌</div><div class="info"><b>撿寶蝸牛 Lv.${state.snailLv}</b><small>${state.snailLv ? `自動去撿沉在沙上的寶物（速度 ${snailSpeed(state.snailLv)}${snailCount() > 1 ? '，兩隻分左右邊' : ''}）` : '幫你自動撿沙地上的寶物'}</small>${state.snailLv > 0 && state.snailLv < 4 ? '<small>Lv.4 起會多一隻蝸牛</small>' : ''}</div>
      ${state.snailLv < SNAIL_MAX ? costBtn('buySnail', '', snailCost(state.snailLv), state.snailLv ? '升級' : '購買') : '<button disabled>MAX</button>'}</div>`;
    for (const k in EQUIP) {
      const e = EQUIP[k], lv = state[k + 'Lv'] || 0;
      h += `<div class="card"><div class="ico">${e.icon}</div><div class="info"><b>${e.name} Lv.${lv}</b><small>${e.desc(lv)}</small>${lv < 3 ? `<small>下一級：${e.desc(lv + 1)}</small>` : ''}</div>
        ${lv < 3 ? costBtn('buyEquip', k, e.costs[lv], lv ? '升級' : '購買') : '<button disabled>MAX</button>'}</div>`;
    }
    h += `<h3 style="margin-top:18px">🪸 功能造景</h3><div class="bonus">目前加成：寶物價值 <b>+${Math.round(r.value * 100)}%</b>　產寶速度 <b>+${Math.round(r.drop * 100)}%</b><br>
      成長速度 <b>+${Math.round(r.growth * 100)}%</b>　繁殖速度 <b>+${Math.round(r.breed * 100)}%</b>　飽食度消耗 <b>-${Math.round((1 - B.hunger) * 100)}%</b>　離線收益 <b>+${Math.round(r.offline * 100)}%</b></div>
      <p class="hint">每個造景都有固定的位置，會跟背景融為一體。升級會讓功能變強；外觀可以選自己喜歡的等級，功能一樣算最高等級。</p>`;
    for (const p of SCENE) h += sceneCard(p);
  } else if (tab === 'starshop') {
    h += renderStarShop();
  } else if (tab === 'bg') {
    h += `<p class="hint">更漂亮的背景還會提高寶物價值！</p>`;
    for (const bg of BGS) {
      const own = state.ownedBg.includes(bg.id), on = state.bg === bg.id;
      h += `<div class="card ${on ? 'sel' : ''}"><div class="swatch" style="background:linear-gradient(${bg.top},${bg.bot} 75%,${bg.sand[0]} 76%)"></div>
        <div class="info"><b>${bg.name}</b><small>寶物價值 +${Math.round(bg.bonus * 100)}%</small></div>
        ${on ? '<button class="on" disabled>使用中</button>' : own ? `<button data-act="useBg" data-arg="${bg.id}">使用</button>` : bg.starPrice ? costBtn('buyBg', bg.id, bg.starPrice, '兌換', '', true) : costBtn('buyBg', bg.id, bg.price, '購買')}</div>`;
    }
  } else if (tab === 'mine') {
    h += `<h3>🐠 我的魚（${state.fish.length}/${capacity()}）</h3><p class="hint">累計賺得 💰${fmt(state.earned)}</p>
      <div class="bonus">💞 <b>繁殖規則</b>：同一種魚有兩隻以上吃飽（飽食度 40% 以上）的成魚，就會開始繁殖倒數；倒數時間跟有幾對無關。<br>
      時間到大家一起生：<b>1～3 對生 1 隻、4～5 對生 2 隻、6～7 對生 3 隻、8～9 對生 4 隻、10 對以上生 5 隻</b>（水族箱空位不夠時會少生）。<br>
      離開遊戲時也會繼續繁殖，但每一對最多生一隻，生出來的小魚要回來餵才會長大。</div>`;
    if (!state.fish.length) h += '<p class="hint">還沒有魚，去魚店買幾隻吧！</p>';
    const full = state.fish.length >= capacity();
    for (const sp of SPECIES) {
      const list = state.fish.filter(f => f.sp === sp.id); if (!list.length) continue;
      const adults = list.filter(f => f.growth >= 1), ready = adults.filter(f => f.hunger >= 40).length;
      const prog = Math.min(1, (state.breedT[sp.id] || 0) / sp.breedTime);
      const pairs = Math.floor(ready / 2), rate = B.breed;
      const left = Math.max(1, Math.ceil((sp.breedTime - (state.breedT[sp.id] || 0)) / rate));
      const status = full ? '水族箱已滿，無法繁殖' : ready >= 2 ? `繁殖中（${pairs} 對）・約 <b>${fmtTime(left)}</b> 後生 <b>${Math.min(litterSize(pairs), capacity() - state.fish.length)}</b> 隻小魚` : adults.length >= 2 ? '成魚肚子餓，暫停繁殖（餵飽就會繼續）' : '需要兩隻成魚才能繁殖';
      h += `<div class="card" style="flex-direction:column;align-items:stretch"><div class="row"><img src="${PREV[sp.id]}" alt="" style="width:60px;height:36px">
        <div class="info"><b>${sp.name} × ${list.length}</b><small>成魚 ${adults.length}・未成年 ${list.length - adults.length}</small></div></div>
        <small style="color:var(--muted)">💞 ${status}</small><div class="bar"><i style="width:${prog * 100}%;background:#ff8fc8"></i></div>`;
      for (const f of list) {
        h += `<div class="row fishrow" style="margin-top:6px;font-size:13px"><span style="flex:1;min-width:110px">${f.shiny ? `✨${SHINY_NAME[f.shiny]}・` : ''}${f.name}・${stageName(f)}${hearts(f) ? ` ${'❤️'.repeat(hearts(f))}` : ''}${f.growth < 1 ? ` ${Math.floor(f.growth * 100)}%` : ''}
          <div class="bar"><i style="width:${f.hunger}%;background:${f.hunger < 30 ? 'var(--bad)' : 'var(--good)'}"></i></div></span>
          <button class="ghost" data-act="viewFish" data-arg="${f.id}">看</button><button data-act="sellFish" data-arg="${f.id}">賣 💰${fmt(sellPrice(f))}</button><button class="star" data-act="releaseFish" data-arg="${f.id}">放生 ⭐${releaseStars(f)}</button></div>`;
      }
      // 超過 10 隻的魚種：底下多兩個按鈕，一次賣掉或放生這一種魚（一樣要確認兩次）
      if (list.length > 10) h += `<div class="row" style="margin-top:10px;gap:8px"><button class="ghost" style="flex:1" data-act="sellAll" data-arg="${sp.id}">💰 販賣全部${sp.name}<span class="sub">（共 💰${fmt(list.reduce((a, f) => a + sellPrice(f), 0))}）</span></button>
        <button class="ghost" style="flex:1" data-act="releaseAll" data-arg="${sp.id}">🌊 放生全部${sp.name}<span class="sub">（共 ⭐${fmt(list.reduce((a, f) => a + releaseStars(f), 0))}）</span></button></div>`;
      h += `</div>`;
    }
    if (state.fish.length) h += `<div class="row" style="margin-top:16px;flex-direction:column;align-items:stretch;gap:10px"><button class="ghost" data-act="sellAll">💰 販賣全部的魚<span class="sub">（${state.fish.length} 隻，共 💰${fmt(state.fish.reduce((a, f) => a + sellPrice(f), 0))}）</span></button>
      <button class="ghost" data-act="releaseAll">🌊 放生全部的魚<span class="sub">（${state.fish.length} 隻，共 ⭐${fmt(state.fish.reduce((a, f) => a + releaseStars(f), 0))}）</span></button></div>`;
  } else if (['dex', 'ach', 'daily'].includes(tab)) {
    h += renderCollect();
  } else if (tab === 'settings') {
    const col = 'class="row" style="flex-direction:column;align-items:stretch;gap:10px;margin-top:8px"';
    h += Cloud.note().replace('<h4>', '<h4 style="margin-top:4px">');
    h += `<h4>📱 畫面</h4><div ${col}>${isAppMode() ? '' : `<button data-act="fullscreen">${isFull() ? '⛶ 離開全螢幕' : '⛶ 全螢幕'}</button>`}<button data-act="toggleCoinFx">🪙 金幣特效（撿寶物時金幣飛到左上角）：<b>${state.coinFx === false ? '關' : '開'}</b></button><button data-act="toggleBig">🔠 大字模式（選單和視窗的字放大）：<b>${state.bigText ? '開' : '關'}</b></button>
      <button data-act="cycleLite">🔋 省電模式：<b>${{ auto: `自動（魚超過 ${LITE_AUTO} 隻時開啟）`, on: '一直開啟', off: '關閉' }[liteMode()]}</b><span class="sub">目前${LITE ? '已開啟：魚鰭和彩帶畫得比較簡單、不畫光暈閃光和痕跡、畫面解析度稍低' : '沒有開啟'}・點一下切換</span></button></div>`;
    h += `<h4>🎵 背景音樂</h4><div ${col}>${Object.entries(Music.tracks).map(([id, t]) => `<button class="${Music.track() === id ? 'on' : 'ghost'}" data-act="setTrack" data-arg="${id}">${t.name}<small style="display:block;font-size:13px;${Music.track() === id ? 'opacity:.75' : 'color:var(--muted)'}">${t.desc}${Music.track() === id ? '（目前播放）' : ''}</small></button>`).join('')}</div>`;
    h += `<h4>💾 存檔備份</h4>${persistNote()}<div ${col}><button data-act="exportSave">📤 匯出存檔（換網址或換手機用）</button><button data-act="importSave">📥 匯入存檔</button></div>`;
    h += `<h4>🎮 玩法說明</h4><div class="bonus">・點水族箱投放飼料；右上角「🍤 餵食」按鈕可以換飼料，或切換成「🔍 查看」。<br>・點或滑過寶物就能撿起來換金幣。<br>・「🔍 查看」時點魚可以看狀態、賣出或放生（放生可以得到⭐星星）。<br>・同種的成魚兩隻以上吃飽（飽食度 40% 以上）就會開始繁殖倒數，時間到大家一起生：1～3 對生 1 隻、4～5 對生 2 隻、6～7 對生 3 隻、8～9 對生 4 隻、10 對以上生 5 隻（空位不夠時會少生）。倒數時間跟對數無關，城堡等造景和繁殖燈可以縮短。<br>・離線時也會繁殖，但每一對最多生一隻，小魚要回來餵才會長大。小魚吃飼料會長大。<br>・「🔍 查看」時點沙地上的造景可以升級或換外觀。<br>・星星可以在「商店 → ⭐夢幻魚」兌換夢幻生物。<br>・右上角 🎁 每天可以領禮物，還有 3 個每日任務。<br>・📸 可以幫水族箱拍照，分享給家人。<br>・偶爾會有神秘訪客游過，點牠會送禮物喔！<br>・「🔍 查看」時點魚會摸摸牠，魚會開心轉一圈。常摸、常餵的魚親密度會變高（最多 5 顆心），每顆心寶物價值 +2%；3 顆心以上的魚，在查看模式按住水族箱會游過來找你。<br>・右上角 🫧 每 10 分鐘可以玩一次「戳泡泡」，30 秒內點破泡泡拿金幣（有紅點代表可以玩）。<br>・「設定」可以換背景音樂、打開大字模式；魚很多覺得卡的時候，可以打開省電模式。</div>`;
    h += `<h4>⚠️ 重新開始</h4><div ${col}><button class="ghost" data-act="reset">↺ 重新開始（清除所有進度）</button></div>`;
  }
  else if (tab === 'star') {
    h += `<div class="bonus">把魚「放生」回大海就能獲得星星，越高階的魚星星越多（未成年的魚星星較少）。<br>
      ${SPECIES.filter(sp => sp.tier <= shopLimit()).map(sp => `${sp.name} ⭐${sp.stars}`).join('・')}<br>累計獲得 ⭐${fmt(state.starEarned)}</div>`;
    h += `<h4>🌟 夢幻魚（展示中 ${state.starShown.length}/${MAX_SHOWN}）　目前 ⭐${fmt(state.stars)}</h4><p class="hint">每種只能兌換一隻，不用餵食、不佔水族箱空間，產出的寶物更值錢。水族箱最多同時放 ${MAX_SHOWN} 隻，可以自由選擇要放哪幾隻。</p>`;
    let locked = 0;
    for (const [i, sp] of STARFISH.entries()) {
      const own = state.starOwned.includes(sp.id), shown = state.starShown.includes(sp.id);
      // 依序解鎖：要先兌換前一隻；第一隻還沒解鎖的顯示出來，後面的先藏起來
      if (!own && !starUnlocked(i)) {
        if (!locked++) h += `<div class="card locked"><img src="${PREV[sp.id]}" alt="" style="filter:brightness(0) opacity(.45)"><div class="info"><b>🔒 ${sp.name}</b><small>先兌換「${STARFISH[i - 1].name}」才能解鎖</small></div><button disabled>⭐${fmt(sp.cost)}</button></div>`;
        continue;
      }
      h += `<div class="card ${shown ? 'sel' : ''}"><img src="${PREV[sp.id]}" alt=""><div class="info"><b>${sp.name}</b><small>${sp.desc}</small>
        <small>產出：${sp.pool.map(([t]) => TREASURE[t].icon).join(' ')}　寶物價值 ×${sp.valueMult}</small><small>${coinNote(sp.pool, sp.dropEvery, sp.mult)}</small></div>
        ${!own ? costBtn('buyStarFish', sp.id, sp.cost, '兌換', '', true)
          : shown ? `<button class="on" data-act="toggleShow" data-arg="${sp.id}">收回</button>`
          : `<button data-act="toggleShow" data-arg="${sp.id}" ${state.starShown.length >= MAX_SHOWN ? `disabled title="最多放 ${MAX_SHOWN} 隻"` : ''}>放入</button>`}</div>`;
    }
    if (locked > 1) h += `<p class="hint">🔒 還有 ${locked - 1} 種更夢幻的生物等待解鎖…</p>`;
    h += `<p class="hint">✨ 用星星兌換的限定背景（星河幻境、彩虹天堂等 ${BGS.filter(b => b.starPrice).length} 種）在「背景」頁，限定造景（${SCENE.filter(p => p.star).map(p => p.name).join('、')}）在「設備・造景」頁。</p>`;
  }
  tabEl.innerHTML = h;
  refreshAfford();
}
// 造景卡片：預覽圖、目前等級與功能、下一級、外觀選擇
function sceneCard(p) {
  const st = state.scene[p.id], lv = st.lv, show = st.look || lv || 1;
  const up = lv < 5 ? costBtn('upScene', p.id, scenePrice(p, lv + 1), lv ? '升級' : '購買', '', p.star) : '<button disabled>MAX</button>';
  const looks = lv ? `<div class="looks"><span>外觀</span>${[1, 2, 3, 4, 5].map(n => n <= lv ? `<button class="chip ${st.look === n ? 'on' : ''}" data-act="lookScene" data-arg="${p.id}:${n}" aria-label="外觀 Lv.${n} ${p.lv[n - 1]}">${n}</button>` : `<button class="chip" disabled aria-label="尚未解鎖">${n}</button>`).join('')}<button class="chip ${st.look === 0 ? 'on' : ''}" data-act="lookScene" data-arg="${p.id}:0">隱藏</button></div>` : '<span></span>';
  return `<div class="card scene ${selPiece === p.id ? 'sel' : ''}" id="sc-${p.id}"><div class="row top"><img class="thumb" src="${sceneThumb(p, show)}" alt="" style="${lv ? '' : 'opacity:.55'}">
    <div class="info"><b>${p.icon} ${p.name}${lv ? ` <span class="tier">Lv.${lv}</span>` : ''}</b>
    <small>${lv ? `「${p.lv[lv - 1]}」${sceneEff(p, lv)}` : '尚未擁有'}</small>
    <small>${lv < 5 ? `下一級「${p.lv[lv]}」：${sceneEff(p, lv + 1)}` : '已經是最高等級 ✨'}</small></div></div>
    <div class="row bottom">${looks}${up}</div></div>`;
}
function openScene(id) {
  selPiece = id; setTab('decor'); openMenu();
  const el = document.getElementById('sc-' + id); if (el) el.scrollIntoView({ block: 'center' });
}
function refreshAfford() {
  const full = state.fish.length >= capacity();
  tabEl.querySelectorAll('[data-cost]').forEach(b => { b.disabled = (b.dataset.star ? state.stars : state.coins) < +b.dataset.cost || (b.dataset.space && full); });
}
let panelPressed = false;
tabEl.addEventListener('pointerdown', () => panelPressed = true);
window.addEventListener('pointerup', () => setTimeout(() => panelPressed = false, 50));

function pay(cost, star = false) {
  const key = star ? 'stars' : 'coins';
  if (state[key] < cost) { toast(star ? '星星不足！去放生一些魚吧' : '金幣不足！'); return false; }
  state[key] -= cost; return true;
}
const ACTIONS = {
  buyFish(id) {
    if (state.fish.length >= capacity()) return toast('水族箱已滿！');
    if (!pay(SP[id].price)) return;
    const f = spawnFish(id, rand(100, W - 100), TOP, 0.4, 70); f.ty = rand(150, 400);
    state.maxTier = Math.max(state.maxTier || 0, SP[id].tier); dexSee(id); taskProg('buy');
    toast(`買了一隻${SP[id].name}「${f.name}」！`);
  },
  buyFish10(id) { buyFishN(id, 10); },
  dexFlip(id) { DEX_VIEW[id] = ((DEX_VIEW[id] || 0) + 1) % DEX_KINDS.length; },
  buyFishMax(id) { buyFishN(id, Infinity); },
  buyCap() { if (state.capLv < CAP_MAX_LV && pay(capCost(state.capLv))) { state.capLv++; toast(`水族箱擴充到 ${capacity()} 隻！`); } },
  buyFeeder() { if (state.feederLv < FEEDER_MAX && pay(feederCost(state.feederLv))) { state.feederLv++; toast(`自動餵食器 Lv.${state.feederLv}`); } },
  buySnail() { if (state.snailLv < SNAIL_MAX && pay(snailCost(state.snailLv))) { state.snailLv++; if (state.snailLv === 4) snails[1].x = W * .75; toast(state.snailLv === 4 ? '🐌 撿寶蝸牛 Lv.4，多了一隻蝸牛幫忙！' : `撿寶蝸牛 Lv.${state.snailLv}`); } },
  buyEquip(k) {
    const e = EQUIP[k], key = k + 'Lv', lv = state[key] || 0;
    if (lv < 3 && pay(e.costs[lv])) { state[key] = lv + 1; calcBonus(); toast(`${e.icon} ${e.name} Lv.${lv + 1}`); }
  },
  buyBg(id) { const bg = BG[id]; if (pay(bg.starPrice || bg.price, !!bg.starPrice)) { state.ownedBg.push(id); ACTIONS.useBg(id); } },
  useBg(id) { state.bg = id; buildBg(); calcBonus(); toast(`背景換成「${BG[id].name}」`); },
  upScene(id) {
    const p = SCN[id], st = state.scene[id]; if (st.lv >= 5) return;
    if (!pay(scenePrice(p, st.lv + 1), p.star)) return;
    const wasTop = st.look === st.lv; st.lv++; if (wasTop) st.look = st.lv; selPiece = id; sceneT = -1;
    calcBonus(); toast(`${p.icon} ${p.name}升級到 Lv.${st.lv}「${p.lv[st.lv - 1]}」！`);
    const { x, y } = scenePos(p); for (let i = 0; i < 8; i++) particles.push({ x: x + rand(-30, 30), y: y - rand(10, 60), vy: -rand(15, 40), life: 1.4, icon: '✨' });
  },
  lookScene(arg) { const [id, n] = arg.split(':'), st = state.scene[id]; if (st && +n <= st.lv) { st.look = +n; selPiece = id; sceneT = -1; } },
  viewFish(id) { viewMode = true; updateModeLabel(); selFishId = +id; closeMenu(); updateFishCard(); },
  sellFish(id) { sellFish(+id); },
  sellAll(id) { sellAll(id); },
  releaseAll(id) { releaseAll(id); },
  releaseFish(id) { releaseFish(+id); },
  reset() { resetGame(); },
  exportSave() { exportSave(); },
  importSave() { importSave(); },
  fullscreen() { toggleFullscreen(); },
  cloudLogin() { Cloud.login(); },
  claimGift() { claimGift(); },
  cycleLite() { const m = { auto: 'on', on: 'off', off: 'auto' }[liteMode()]; state.lite = m; updateLite(); toast(`🔋 省電模式：${{ auto: '自動', on: '一直開啟', off: '關閉' }[m]}`); },
  toggleBig() { state.bigText = !state.bigText; applyBigText(); toast(`🔠 大字模式：${state.bigText ? '開' : '關'}`); },
  setTrack(id) { Music.setTrack(id); },
  toggleCoinFx() { state.coinFx = state.coinFx === false; if (!state.coinFx) coinFx = []; toast(`金幣特效：${state.coinFx ? '開' : '關'}`); },
  cloudLogout() { Cloud.logout(); },
  cloudRestore() { Cloud.restore(); },
  async cloudUp() { if (await Cloud.upload(true)) toast('☁️ 已備份到雲端'); },
  buyStarFish(id) {
    if (state.starOwned.includes(id) || !starUnlocked(STARFISH.indexOf(SSP[id]))) return;
    if (!pay(SSP[id].cost, true)) return;
    state.starOwned.push(id); dexSee(id);
    if (state.starShown.length < MAX_SHOWN) { state.starShown.push(id); syncStarFish(); toast(`🌟 ${SSP[id].name}來到你的水族箱了！`); }
    else toast(`🌟 兌換了${SSP[id].name}！水族箱已放 ${MAX_SHOWN} 隻，先收回一隻才能放入`);
  },
  toggleShow(id) {
    const i = state.starShown.indexOf(id);
    if (i >= 0) { state.starShown.splice(i, 1); if (selFishId === 'star-' + id) selFishId = null; updateFishCard(); }
    else if (state.starShown.length < MAX_SHOWN && state.starOwned.includes(id)) state.starShown.push(id);
    else return toast(`最多只能放 ${MAX_SHOWN} 隻夢幻魚`);
    syncStarFish();
  },
};
tabEl.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
  ACTIONS[b.dataset.act](b.dataset.arg); renderTab(); save();
});

