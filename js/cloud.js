// 存檔保護、雲端存檔、匯出匯入（cloud.js）
// ====== 存檔保護 ======
// 向瀏覽器申請「持久儲存」，請它不要自動清除這個網站的資料（iPhone 從主畫面圖示打開、常玩時較容易被同意）
let persistState = 'unknown';
async function requestPersist() {
  try {
    if (!navigator.storage || !navigator.storage.persist) persistState = 'unsupported';
    else if (await navigator.storage.persisted()) persistState = 'granted';
    else persistState = (await navigator.storage.persist()) ? 'granted' : 'denied';
  } catch (e) { persistState = 'unsupported'; }
  if (menuOpen && tab === 'mine') renderTab();
}
function persistNote() {
  if (persistState === 'granted') return '<div class="bonus">🛡️ 存檔保護：<b>已開啟</b>，瀏覽器會盡量保留你的進度。</div>';
  if (persistState === 'denied') return `<div class="bonus">🛡️ 存檔保護：瀏覽器暫時還沒同意。${/iPhone|iPad|iPod/.test(navigator.userAgent) && !isAppMode() ? '建議改從主畫面的遊戲圖示打開，' : ''}常常打開來玩，通常就會自動同意。也建議偶爾「📤 匯出存檔」備份。</div>`;
  if (persistState === 'unsupported') return '<div class="bonus">🛡️ 存檔保護：這個瀏覽器不支援，建議偶爾「📤 匯出存檔」備份。</div>';
  return '';
}

// ====== 雲端存檔（Google 帳號登入，資料放在 Firebase） ======
// 把 Firebase 專案「網頁應用程式」的設定（firebaseConfig）貼在這裡；留 null 就不會顯示雲端存檔功能
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDVGYs8cBXTxDk_TJTSrF9O2aAaQpfuT-Y',
  authDomain: 'aquarium-kai.firebaseapp.com',
  projectId: 'aquarium-kai',
  storageBucket: 'aquarium-kai.firebasestorage.app',
  messagingSenderId: '1096455825999',
  appId: '1:1096455825999:web:f48012780af03f3559583a',
};
const Cloud = (() => {
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  let ready = null, user = null, db = null, lastUp = 0, lastSig = '', status = '', busy = false;
  // 只在正式網站（GitHub Pages）啟用；Claude 預覽頁不能連外部服務
  const enabled = () => !!FIREBASE_CONFIG && (/github\.io$|^localhost$|^127\./.test(location.hostname) || window.CLOUD_TEST);
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('script')); document.head.appendChild(s); });
  const refresh = () => { if (menuOpen && tab === 'settings' && !panelPressed) renderTab(); };
  const docRef = () => db.collection('saves').doc(user.uid);
  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!window.firebase) {
        await loadScript(SDK + 'firebase-app-compat.js');
        await Promise.all([loadScript(SDK + 'firebase-auth-compat.js'), loadScript(SDK + 'firebase-firestore-compat.js')]);
      }
      firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.firestore();
      firebase.auth().onAuthStateChanged(u => { user = u; if (u) onLogin(); refresh(); });
      try { await firebase.auth().getRedirectResult(); } catch (e) { report(e); }
    })().catch(e => { ready = null; status = '雲端服務暫時連不上，請確認網路'; refresh(); throw e; });
    return ready;
  }
  // 自動備份：內容有變才上傳
  async function upload(force) {
    if (!user || busy) return false;
    const sig = `${Math.floor(state.earned)}|${state.fish.length}|${Math.floor(state.coins)}|${state.stars}`;
    if (!force && sig === lastSig) return true;
    busy = true; state.lastSeen = Date.now();
    try { await docRef().set({ data: JSON.stringify(state), earned: state.earned || 0, at: Date.now() }); lastSig = sig; lastUp = Date.now(); status = ''; }
    catch (e) { status = '⚠️ 雲端備份失敗，稍後會自動再試'; }
    busy = false; refresh(); return !status;
  }
  function applyCloud(data) {
    pellets = []; particles = []; texts = []; releasing = []; starFish = []; selFishId = null;
    data.lastSeen = Date.now();
    load(JSON.stringify(data)); syncStarFish(); calcBonus(); buildBg(); save();
    updateFishCard(); updateModeLabel(); renderTab(); lastSig = '';
    toast('☁️ 已載入雲端的進度');
  }
  // 登入後：雲端沒有資料就上傳；雲端進度比較多就問要不要載入
  async function onLogin() {
    try {
      const snap = await docRef().get();
      if (snap.exists) {
        const d = snap.data();
        if ((d.earned || 0) > (state.earned || 0) + 1 &&
          await ask(`雲端有比較多的進度：\n☁️ 雲端：累計賺得 💰${fmt(d.earned)}\n　　（${new Date(d.at).toLocaleString('zh-TW')}）\n📱 這台：累計賺得 💰${fmt(state.earned || 0)}\n\n要載入雲端的進度嗎？`, '載入雲端', '用這台的')) return applyCloud(JSON.parse(d.data));
      } else toast('☁️ 已開啟雲端備份');
      await upload(true);
    } catch (e) { status = '⚠️ 讀取雲端資料失敗'; refresh(); }
  }
  function report(e) {
    if (!e || ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(e.code)) return;
    ask(`Google 登入沒有成功（${e.code || e.message}）。\n\n可以再試一次；如果是從主畫面圖示打開，也可以改用 Safari 打開遊戲網址登入一次。`, '知道了', null);
  }
  async function login() {
    try {
      await init();
      const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
      try { await firebase.auth().signInWithPopup(p); }
      catch (e) { if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) await firebase.auth().signInWithRedirect(p); else throw e; }
    } catch (e) { report(e); }
  }
  async function logout() {
    if (!await ask('要登出 Google 帳號嗎？\n登出後就不會自動備份到雲端（這台手機上的進度還在）。', '登出')) return;
    await upload(true); await firebase.auth().signOut(); lastUp = 0; toast('已登出');
  }
  async function restore() {
    try {
      const snap = await docRef().get();
      if (!snap.exists) return ask('雲端還沒有存檔。', '知道了', null);
      const d = snap.data();
      if (await ask(`要載入雲端的進度嗎？\n☁️ 累計賺得 💰${fmt(d.earned || 0)}（${new Date(d.at).toLocaleString('zh-TW')}）\n\n這台手機目前的進度會被取代。`, '載入')) applyCloud(JSON.parse(d.data));
    } catch (e) { ask('讀取雲端資料失敗，請確認網路後再試。', '知道了', null); }
  }
  const esc = t => String(t || '').replace(/[<>&"]/g, c => `&#${c.charCodeAt(0)};`);
  function note() {
    if (!enabled()) return '';
    if (!user) return `<h4>☁️ 雲端存檔</h4><div class="bonus">用 Google 帳號登入後，進度會自動備份到雲端；換手機、或資料被清掉時，登入同一個帳號就能找回來。${status ? `<br>${status}` : ''}</div>
      <div class="row" style="margin-top:8px"><button data-act="cloudLogin">☁️ 用 Google 帳號登入</button></div>`;
    const t = lastUp ? new Date(lastUp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) : '';
    return `<h4>☁️ 雲端存檔</h4><div class="bonus">已登入：<b>${esc(user.email)}</b><br>進度會自動備份${t ? `（上次：${t}）` : '…'}${status ? `<br>${status}` : ''}</div>
      <div class="row" style="margin-top:8px"><button data-act="cloudUp">立即備份</button><button data-act="cloudRestore">從雲端載入</button><button class="ghost" data-act="cloudLogout">登出</button></div>`;
  }
  return { enabled, init, login, logout, upload, restore, note, get user() { return user; } };
})();

// ====== 匯出／匯入存檔 ======
// 存檔碼格式：AQ2:<長度>:<base64>。記下長度，才能判斷是不是只複製到一部分
// 匯出時會把沙地上還沒撿的寶物直接換成金幣、拿掉游動方向等暫時資料、數字四捨五入，讓存檔碼短一點比較好複製
function saveCode() {
  save();
  const d = JSON.parse(JSON.stringify(state));
  d.coins += d.treasures.reduce((a, t) => a + Math.round(TREASURE[t.type].value * (t.mult || 1) * B.value), 0);
  d.treasures = [];
  d.fish = d.fish.map(f => ({ id: f.id, sp: f.sp, name: f.name, x: f.x, y: f.y, hunger: f.hunger, growth: f.growth, foodMult: f.foodMult, dropT: f.dropT }));
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(d, (k, v) => typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 100) / 100 : v))));
  return `AQ2:${b64.length}:${b64}`;
}
// 盡量容錯：忽略空白與看不見的字元、全形冒號、前後多餘的文字
function parseCode(code) {
  const t = String(code || '').replace(/[\s ​-‍﻿]+/g, '').replace(/：/g, ':');
  if (!t) return { err: '還沒有貼上存檔碼。請長按輸入框，選「貼上」。' };
  const m = t.match(/AQ([12]):(?:(\d+):)?([A-Za-z0-9+/=_-]*)/);
  if (!m) return { err: '找不到存檔碼。請確認貼上的是「AQ」開頭的那一整串文字。' };
  let b = m[3].replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  const want = m[2] ? +m[2] : 0;
  if (want && m[3].length < want) return { err: `存檔碼不完整，只複製到大約 ${Math.max(1, Math.floor(m[3].length / want * 100))}%。\n請回到原本的遊戲，按「📋 複製」重新複製一次。` };
  while (b.length % 4) b += '=';
  try {
    const d = JSON.parse(decodeURIComponent(escape(atob(b))));
    if (d && typeof d.coins === 'number' && Array.isArray(d.fish)) return { data: d };
  } catch (e) { }
  return { err: '存檔碼看起來有缺字或多了字，沒辦法讀取。\n請回到原本的遊戲，按「📋 複製」重新複製一次。' };
}
function openSaveBox(title, text, okLabel, onOk, readOnly) {
  const box = $('#saveBox'), ta = $('#saveText');
  $('#saveTitle').textContent = title; ta.value = text; ta.readOnly = readOnly; $('#saveOk').textContent = okLabel; $('#saveLink').hidden = true;
  box.hidden = false; if (!readOnly) ta.focus();
  $('#saveCancel').onclick = () => { box.hidden = true; };
  $('#saveOk').onclick = () => onOk(ta, () => { box.hidden = true; });
}
function selectAllText(ta) {
  // iPhone 上唯讀的輸入框選不起來，先暫時解除唯讀再全選
  ta.readOnly = false; ta.focus(); ta.setSelectionRange(0, ta.value.length); ta.select(); ta.readOnly = true;
}
const NEW_SITE = 'https://hn84786349.github.io/aquarium/';
const onNewSite = () => location.hostname === 'hn84786349.github.io';
function exportSave() {
  const code = saveCode();
  openSaveBox(onNewSite()
    ? `這是你的存檔碼（共 ${code.length} 個字）。\n按「📋 複製」後，到另一支手機或另一個地方的「📥 匯入存檔」貼上，就能接著玩。`
    : `搬到新網站：直接按下面的黃色按鈕，新網站會自動帶入進度。\n\n或是按「📋 複製」存檔碼（共 ${code.length} 個字），到新網站的「📥 匯入存檔」貼上。`, code, '📋 複製', async ta => {
    selectAllText(ta);
    try { await navigator.clipboard.writeText(ta.value); toast('✅ 已複製存檔碼'); }
    catch (e) { toast('請在反白的文字上點「拷貝」'); }
  }, true);
  // 不在新網站時，提供把存檔放在網址裡直接帶過去的連結（避開 iPhone 在內嵌網頁裡剪貼簿不能用的問題）
  if (!onNewSite()) { const a = $('#saveLink'); a.href = NEW_SITE + '#import=' + code; a.hidden = false; }
}
function importSave() {
  const app = isAppMode();
  openSaveBox(`把存檔碼貼在下面（長按空白處選「貼上」），再按「📥 匯入」。\n⚠️ 目前這裡的進度會被取代。${/iPhone|iPad|iPod/.test(navigator.userAgent) ? `\n\n📱 iPhone 小提醒：從主畫面圖示打開的遊戲，跟在 Safari 裡打開的遊戲，進度是分開存的。之後用哪一個玩，就要在哪一個裡面匯入。${app ? '（你現在是從主畫面圖示打開的）' : '（你現在是在 Safari 裡打開的）'}` : ''}`, '', '📥 匯入', async (ta, close) => {
    const r = parseCode(ta.value);
    if (r.err) return ask(r.err, '知道了', null);
    applyImport(r.data, close);
  }, false);
}
async function applyImport(data, close = () => { }) {
    if (!await ask(`要匯入這份存檔嗎？\n💰 ${fmt(data.coins)}　⭐ ${fmt(data.stars || 0)}　🐟 ${data.fish.length} 隻\n\n目前的進度會被取代。`, '匯入')) return;
    close();
    data.lastSeen = Date.now();
    pellets = []; particles = []; texts = []; releasing = []; starFish = []; selFishId = null;
    load(JSON.stringify(data)); syncStarFish(); calcBonus(); buildBg(); save();
    closeMenu(); updateFishCard(); updateModeLabel();
    // 確認真的存得起來（無痕模式或關閉網站資料時會存不進去）
    let ok = false; try { ok = JSON.parse(localStorage.getItem(SAVE_KEY)).coins === state.coins; } catch (e) { }
    if (ok) toast('✅ 匯入完成，歡迎回來！');
    else ask('匯入成功了，但這個瀏覽器沒辦法儲存進度（可能是無痕瀏覽，或關閉了網站資料）。\n關掉網頁後進度會消失，請改用一般模式的 Safari 或主畫面圖示打開再匯入一次。', '知道了', null);
}
// 從舊網址的連結打開時，網址後面會帶著「#import=存檔碼」，自動詢問要不要匯入
function importFromLink() {
  const i = location.hash.indexOf('import=');
  if (i < 0) return;
  const code = decodeURIComponent(location.hash.slice(i + 7));
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
  const r = parseCode(code);
  if (r.err) return ask('帶過來的進度讀不到：\n' + r.err, '知道了', null);
  applyImport(r.data);
}
async function resetGame() {
  if (!await ask('確定要重新開始嗎？\n所有進度都會消失！', '重新開始')) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
  pellets = []; particles = []; texts = []; selFishId = null;
  releasing = []; starFish = [];
  load(); syncStarFish(); calcBonus(); buildBg(); renderTab(); updateModeLabel(); toast('已重新開始');
}

// 賣魚最多拿回價格的 25%，而且不超過這隻魚大約 1 小時的產值，避免「繁殖後賣小魚」比養魚賺得還多
function sellPrice(f) { const sp = SP[f.sp]; return Math.floor(Math.min(sp.price * .25, sp.income * 3600) * (.2 + .8 * f.growth) * (f.shiny ? 3 : 1)); }
function releaseStars(f) { const st = SP[f.sp].stars * (f.shiny ? 3 : 1); return f.growth >= 1 ? st : Math.floor(st * f.growth * .5); }
const releaseOK = new Set();
async function releaseFish(id) {
  let f = state.fish.find(x => x.id === id); if (!f) return;
  const st = releaseStars(f);
  // 同一種魚只問第一次（這次開遊戲期間有效）；太小拿不到星星的另外問一次
  const key = f.sp + (st ? '' : ':young');
  if ((SP[f.sp].price >= 700 || st === 0) && !releaseOK.has(key)) {
    if (!await ask(st ? `確定要放生「${f.name}」嗎？\n可以獲得 ⭐${st}\n\n（之後放生${SP[f.sp].name}就不會再問）` : `「${f.name}」還太小，放生拿不到星星，確定要放生嗎？\n\n（之後放生${SP[f.sp].name}的小魚就不會再問）`, '放生')) return;
    releaseOK.add(key);
  }
  f = state.fish.find(x => x.id === id); if (!f) return;
  state.fish.splice(state.fish.indexOf(f), 1);
  state.stars += st; state.starEarned += st; state.stats.released++; taskProg('release');
  releasing.push({ f, life: 1.6 });
  floatText(f.x, f.y - 25, st ? `+⭐${st}` : '再見～', '#fff27a');
  toast(`🌊 ${f.name}回到大海了${st ? `，獲得 ⭐${st}` : ''}`);
  if (selFishId === id) selFishId = null;
  updateFishCard(); renderTab(); save();
}
function stageName(f) { return f.growth >= 1 ? '成魚' : f.growth < .35 ? '幼魚' : '亞成魚'; }
function updateFishCard() {
  const el = $('#fishCard'), f = state.fish.find(x => x.id === selFishId) || starFish.find(x => x.id === selFishId);
  if (!f) { el.style.display = 'none'; selFishId = null; return; }
  el.style.display = 'block';
  if (typeof f.id === 'string') {
    const sp = SSP[f.sp];
    el.innerHTML = `<b>🌟 ${sp.name}</b>　<small>夢幻魚</small><div style="margin-top:4px">不用餵食・寶物價值 ×${sp.valueMult}</div>
      <div>下次產寶：約 ${Math.max(0, Math.ceil(f.dropT / B.drop))} 秒</div>
      <div class="row" style="margin-top:8px"><button data-unshow="${f.sp}">收回</button><button class="ghost" data-close="1">關閉</button></div>`;
    return;
  }
  const sp = SP[f.sp];
  el.innerHTML = `<b>${f.shiny ? '✨' : ''}${f.name}</b>　<small>${f.shiny ? SHINY_NAME[f.shiny] : ''}${sp.name}・${stageName(f)}</small><button class="ghost mini" data-rename="${f.id}">✏️ 改名</button>
    <div>親密度 ${heartStr(f)} <small>${Math.floor(f.love || 0)}/100${hearts(f) ? `・寶物 +${hearts(f) * 2}%` : ''}</small></div>
    <div>飽食度 ${Math.round(f.hunger)}%<div class="bar"><i style="width:${f.hunger}%;background:${f.hunger < 30 ? 'var(--bad)' : 'var(--good)'}"></i></div></div>
    <div style="margin-top:4px">${f.growth >= 1 ? `下次產寶：約 ${Math.max(0, Math.ceil(f.dropT / B.drop))} 秒` : `成長 ${Math.floor(f.growth * 100)}%（飼料加速 ×${f.foodMult}）`}
    ${f.growth < 1 ? `<div class="bar"><i style="width:${f.growth * 100}%;background:#4aa8ff"></i></div>` : ''}</div>
    <div style="margin-top:6px">${fxOwned().length ? `<button class="ghost mini" data-fx="${f.id}">✨ 特效：${f.fx ? FISH_FX[f.fx].name : '無'} ▸</button>` : '<small style="color:var(--muted)">✨ 可以在「商店 → ✨小舖」兌換魚的特效</small>'}</div>
    <div class="row" style="margin-top:8px"><button data-sell="${f.id}">出售 💰${fmt(sellPrice(f))}</button><button class="star" data-release="${f.id}">放生 ⭐${releaseStars(f)}</button><button class="ghost" data-close="1">關閉</button></div>`;
}
$('#fishCard').addEventListener('click', e => {
  if (e.target.dataset.close) { selFishId = null; updateFishCard(); }
  if (e.target.dataset.rename) openRename(+e.target.dataset.rename);
  if (e.target.dataset.sell) sellFish(+e.target.dataset.sell);
  if (e.target.dataset.release) releaseFish(+e.target.dataset.release);
  if (e.target.dataset.unshow) { ACTIONS.toggleShow(e.target.dataset.unshow); renderTab(); save(); }
});
function sellFish(id) {
  const f = state.fish.find(x => x.id === id); if (!f) return;
  const v = sellPrice(f); state.coins += v; state.fish.splice(state.fish.indexOf(f), 1);
  toast(`賣出 ${f.name}，獲得 💰${fmt(v)}`); if (selFishId === id) selFishId = null;
  updateFishCard(); renderTab();
}
// 一次賣掉所有魚（夢幻魚不算）：要確認兩次，避免不小心點到
async function sellAll() {
  const n = state.fish.length; if (!n) return;
  const total = () => state.fish.reduce((a, f) => a + sellPrice(f), 0);
  if (!await ask(`確定要賣掉水族箱裡全部 ${n} 隻魚嗎？\n可以得到 💰${fmt(total())}`, '要賣掉', '取消')) return;
  if (!await ask(`再確認一次：全部 ${n} 隻魚賣掉後就回不來了喔！\n真的要全部賣掉嗎？`, '確定全部賣掉', '我再想想')) return;
  const v = total(), cnt = state.fish.length; state.coins += v; state.fish = []; selFishId = null;
  toast(`賣出全部 ${cnt} 隻魚，獲得 💰${fmt(v)}`); updateFishCard(); renderTab(); save();
}
// 一次放生所有魚（夢幻魚不算）：一樣要確認兩次
async function releaseAll() {
  const n = state.fish.length; if (!n) return;
  const total = () => state.fish.reduce((a, f) => a + releaseStars(f), 0);
  if (!await ask(`確定要放生水族箱裡全部 ${n} 隻魚嗎？\n可以得到 ⭐${fmt(total())}`, '要放生', '取消')) return;
  if (!await ask(`再確認一次：全部 ${n} 隻魚放生後就回不來了喔！\n真的要全部放生嗎？`, '確定全部放生', '我再想想')) return;
  const st = total(), cnt = state.fish.length;
  state.stars += st; state.starEarned += st; state.stats.released += cnt; taskProg('release', cnt);
  for (const f of state.fish) releasing.push({ f, life: 1.6 });
  state.fish = []; selFishId = null;
  toast(`🌊 全部 ${cnt} 隻魚回到大海了，獲得 ⭐${fmt(st)}`); updateFishCard(); renderTab(); save();
}

