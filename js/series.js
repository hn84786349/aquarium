// 系列收集獎勵（series.js）
// 每個系列有兩條獨立的進度線，各有 25%／50%／100% 三個階段：
//   收集線（圖鑑看過就算）：該系列寶物價值 +3%／+3%／+4%，星星 ×1／×2／×3
//   稀有色線（圖鑑看過金色或白色）：25% 該系列寶物 +10%、稀有色機率 8%；50% 再 +10%、機率 12%；
//                                  100% 全部的魚寶物 +3% 和專屬稱號；星星 ×3／×5／×10
// 星星的「×1」是玩家買過最高級的魚的放生星星，跟著進度變多
const SERIES = [
  { id: 'small',  icon: '🐟', name: '小型魚家族',   title: '小魚知音',   fish: '孔雀魚、霓虹燈魚、月華孔雀魚、霓彩孔雀魚、星燈魚、稜光燈魚、極光燈魚、珍珠孔雀魚、糖果燈魚、彩虹燈魚、蜜桃孔雀魚' },
  { id: 'reef',   icon: '🐠', name: '珊瑚礁家族',   title: '珊瑚礁之友', fish: '小丑魚、藍色小丑魚、雪花小丑魚、寶石魔、黃金箱魨、蘭花擬雀鯛、月眉蝶、紋刺尾魚、青蛙魚、藍倒吊、獅子魚、河豚、泡泡糖河豚、珊瑚公主魚' },
  { id: 'angel',  icon: '👼', name: '神仙魚家族',   title: '天使守護者', fish: '神仙魚、紅薄荷神仙魚、皇帝神仙魚、法國神仙魚、紫后神仙魚、蛋白石神仙魚、珍珠天使魚、銀河天使魚、薰衣草神仙魚、小天使魚、海天使、晨曦神仙魚、天鵝神仙魚' },
  { id: 'betta',  icon: '🎐', name: '鬥魚家族',     title: '鬥魚收藏家', fish: '鬥魚、仙羽鬥魚、櫻吹雪鬥魚、虹綾鬥魚、雪晶鬥魚、星紗鬥魚、暮光鬥魚、桃花鬥魚、金箔鬥魚、彩霞鬥魚、玫瑰鬥魚、銀河鬥魚' },
  { id: 'koi',    icon: '🎏', name: '錦鯉家族',     title: '錦鯉大師',   fish: '琉金、錦鯉、金龍魚、花瓣小錦鯉、翡翠小錦鯉、星河錦鯉、櫻花錦鯉、銀月錦鯉、金鱗錦鯉、七彩錦鯉、紫藤錦鯉、琉璃錦鯉' },
  { id: 'ocean',  icon: '🐋', name: '大海家族',     title: '海洋守護者', fish: '海馬、海龜、鸚哥魚、豹石斑、翻車魚、鐮魚、海豚、旗魚、鬼頭刀、虎鯨、鯨鯊、皇帶魚、座頭鯨、星光獨角鯨、極光鯨' },
  { id: 'nature', icon: '🌸', name: '花與自然精靈', title: '花園精靈',   fish: '蝶翼仙魚、露珠精靈魚、月蛾魚、蜜糖仙子魚、雲朵棉花魚、百合鰭魚、羽尾仙魚、霜翼魚、孔雀仙鰭魚、鈴蘭仙魚、蒲公英仙魚、繡球花仙魚、向日葵仙魚、薔薇仙魚' },
  { id: 'star',   icon: '🌙', name: '星月精靈',     title: '星月使者',   fish: '星辰仙子魚、星宿仙鰭魚、極光綾鰭魚、霧紗仙魚、珠月魚、月紗仙女魚、新月仙魚、流星仙魚、星雲紗魚、北極星仙魚、雙子星仙魚、彗星紗魚' },
  { id: 'gem',    icon: '💎', name: '寶石與鳳凰',   title: '珍寶大師',   fish: '琉璃精靈魚、粉晶魚、藍寶石仙魚、人魚紗魚、星花仙魚、虹紗精靈魚、旭日鳳尾魚、鳳羽仙魚、鳳凰女皇魚、紫水晶仙魚、鑽石仙魚、鳳冠仙魚' },
  { id: 'snow',   icon: '❄️', name: '冰雪精靈',     title: '雪國公主',   fish: '雪花燈魚、雪絨仙魚、冰鈴仙魚、冰晶紗魚、霜花仙魚、雪兔仙魚、冰湖精靈魚、雪國女王魚' },
  { id: 'dream',  icon: '🌈', name: '彩虹夢境',     title: '夢境旅人',   fish: '棉花糖魚、彩虹泡泡魚、獨角仙魚、糖霜仙魚、星糖仙魚、彩虹橋仙魚、夢境公主魚' },
];
// 用魚名找出魚的 id，並記錄每種魚屬於哪個系列
const SERIES_OF = {};
for (const se of SERIES) {
  se.ids = se.fish.split('、').map(n => { const sp = SPECIES.find(s => s.name === n); if (!sp) console.error('系列找不到魚：' + n); return sp && sp.id; }).filter(Boolean);
  for (const id of se.ids) SERIES_OF[id] = se;
}
// 六個階段：kind a＝收集線、b＝稀有色線
const SERIES_STAGES = [
  { key: 'a25', kind: 'a', pct: .25, label: '收集 25%', stars: 1, value: .03 },
  { key: 'a50', kind: 'a', pct: .5, label: '收集 50%', stars: 2, value: .03 },
  { key: 'a100', kind: 'a', pct: 1, label: '系列集齊', stars: 3, value: .04 },
  { key: 'b25', kind: 'b', pct: .25, label: '稀有色 25%', stars: 3, value: .10, shiny: .08 },
  { key: 'b50', kind: 'b', pct: .5, label: '稀有色 50%', stars: 5, value: .10, shiny: .12 },
  { key: 'b100', kind: 'b', pct: 1, label: '稀有色 100%', stars: 10, global: .03 },
];
const seriesNeed = (se, pct) => Math.ceil(se.ids.length * pct - 1e-9);
const seriesCount = (se, kind) => se.ids.filter(id => kind === 'a' ? state.dex.seen[id] : state.dex.shiny[id]).length;
const seriesDone = () => (state.series || (state.series = { done: [] })).done;
const seriesHas = (se, key) => seriesDone().includes(se.id + ':' + key);
// 該系列的魚寶物價值加成（倍率）
const seriesMul = spId => { const se = SERIES_OF[spId]; if (!se) return 1; let v = 1; for (const st of SERIES_STAGES) if (st.value && seriesHas(se, st.key)) v += st.value; return v; };
// 稀有色機率：基本 4%，稀有色 25% 階段 8%、50% 階段 12%
function shinyRate(spId) {
  const se = SERIES_OF[spId]; let r = SHINY_RATE;
  if (se) for (const st of SERIES_STAGES) if (st.shiny && seriesHas(se, st.key)) r = Math.max(r, st.shiny);
  return r;
}
// 全部的魚寶物價值加成（每個系列稀有色 100% 各 +3%），calcBonus 會加進去
const seriesGlobal = () => SERIES.filter(se => seriesHas(se, 'b100')).length * .03;
const seriesStarUnit = () => Math.max(5, SPECIES[Math.min(SPECIES.length - 1, state.maxTier || 0)].stars || 1);
// 每秒檢查一次：達成的階段自動領取（舊存檔一打開也會補發）
function checkSeries() {
  const got = [];
  for (const se of SERIES) for (const st of SERIES_STAGES) {
    if (seriesHas(se, st.key) || seriesCount(se, st.kind) < seriesNeed(se, st.pct)) continue;
    seriesDone().push(se.id + ':' + st.key); const s = seriesStarUnit() * st.stars;
    state.stars += s; state.starEarned += s; got.push({ se, st, s });
  }
  if (!got.length) return;
  calcBonus();
  if (got.length === 1) {
    const { se, st, s } = got[0];
    toast(`📚 ${se.icon}${se.name}「${st.label}」達成！${st.global ? `全部的魚寶物 +3%，獲得稱號「${se.title}」` : `${se.name}寶物 +${Math.round(st.value * 100)}%${st.shiny ? `、稀有色機率 ${st.shiny * 100}%` : ''}`}　⭐${fmt(s)}`);
  } else ask(`📚 系列收集獎勵\n\n${got.map(({ se, st, s }) => `${se.icon}${se.name}「${st.label}」⭐${fmt(s)}`).join('\n')}\n\n加成已經生效，可以到「收藏 → 📚 系列」查看。`, '好', null);
  if (menuOpen && tab === 'series') renderTab();
}
// 點系列裡的魚：跳到商店那隻魚的購買卡片，並用醒目的框框起來（約 4 秒）
let shopFocus = null, shopFocusT = 0;
Object.assign(ACTIONS, {
  seriesGo(id) {
    const sp = SP[id]; if (!sp) return;
    if (sp.tier > shopLimit()) return toast(`🔒 ${sp.name}還沒出現在商店，買到更高級的魚就會慢慢解鎖`);
    shopFocus = id; clearTimeout(shopFocusT); setTab('shop');
    // 捲到卡片剛好在上方「水族箱數量」欄的下面，金色框才不會被擋住
    setTimeout(() => {
      const el = document.getElementById('shop-' + id); if (!el) return;
      const cap = tabEl.querySelector('.capBox'), capH = cap ? cap.offsetHeight + 14 : 8;
      tabEl.scrollTo({ top: tabEl.scrollTop + el.getBoundingClientRect().top - tabEl.getBoundingClientRect().top - capH, behavior: 'smooth' });
    }, 60);
    shopFocusT = setTimeout(() => { shopFocus = null; const el = document.getElementById('shop-' + id); if (el) el.classList.remove('focus'); }, 4000);
  },
});
function renderSeries() {
  const doneN = seriesDone().length, total = SERIES.length * SERIES_STAGES.length, g = seriesGlobal();
  let h = `<div class="bonus">已完成 <b>${doneN} / ${total}</b> 個階段${g ? `　全部的魚寶物 <b>+${Math.round(g * 100)}%</b>` : ''}<br>
    圖鑑「看過」就算收集到；看過金色或白色就算稀有色。收集和稀有色是分開算的，可以各自先拿到獎勵。<br>👆 點魚的小圖，可以直接跳到商店購買那種魚。</div>`;
  for (const se of SERIES) {
    const a = seriesCount(se, 'a'), b = seriesCount(se, 'b'), n = se.ids.length, mul = seriesMul(se.ids[0]), sr = shinyRate(se.ids[0]);
    h += `<div class="card" style="flex-direction:column;align-items:stretch"><div class="row"><b style="flex:1">${se.icon} ${se.name}</b>${seriesHas(se, 'b100') ? `<small style="color:var(--accent)">🏅 ${se.title}</small>` : ''}</div>
      <div class="dexMini">${se.ids.map(id => `<span class="${state.dex.seen[id] ? '' : 'unk'}" data-act="seriesGo" data-arg="${id}" role="button"><img src="${state.dex.shiny[id] ? shinyPrev(SP[id], state.dex.shiny[id]) : PREV[id]}" alt="">${state.dex.shiny[id] ? '<i>✨</i>' : ''}</span>`).join('')}</div>
      <small>📖 收集 ${a}/${n}<div class="bar"><i style="width:${a / n * 100}%;background:var(--accent)"></i></div></small>
      <small>✨ 稀有色 ${b}/${n}<div class="bar"><i style="width:${b / n * 100}%;background:#ffd860"></i></div></small>
      <div class="stages">${SERIES_STAGES.map(st => { const ok = seriesHas(se, st.key), left = seriesNeed(se, st.pct) - seriesCount(se, st.kind);
        return `<span class="${ok ? 'ok' : ''}">${ok ? '✅' : '⬜'} ${st.label}<small>${st.global ? '全體寶物 +3%・稱號' : `寶物 +${Math.round(st.value * 100)}%${st.shiny ? `・稀有色 ${st.shiny * 100}%` : ''}`}・⭐×${st.stars}${ok ? '' : `・還差 ${left} 種`}</small></span>`; }).join('')}</div>
      <small style="color:var(--muted)">目前加成：${se.name}寶物 +${Math.round((mul - 1) * 100)}%・稀有色機率 ${Math.round(sr * 100)}%</small></div>`;
  }
  return h;
}
