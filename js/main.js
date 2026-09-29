// 遊戲啟動（main.js）
load(); refundFishFx(); syncStarFish(); calcBonus(); buildPreviews();
resize(); window.addEventListener('resize', resize); window.addEventListener('orientationchange', () => setTimeout(resize, 200));
if (window.visualViewport) visualViewport.addEventListener('resize', resize);
applyBigText(); updatePopDot(); updateModeLabel(); renderTab(); Music.updateBtn(); checkOffline(); save(); setTimeout(importFromLink, 300);
if (migrateNote) { ask(migrateNote, '好', null); migrateNote = ''; }
if (state.daily.date !== todayStr()) newDay(); updateEvent(); updateGiftDot();
// 之前登入過 Google 的話，打開遊戲就自動恢復登入並開始雲端備份
if (Cloud.enabled()) Cloud.init().catch(() => { });
// 一打開就申請存檔保護；有些瀏覽器要點過畫面才會同意，所以第一次點畫面時再申請一次
requestPersist();
document.addEventListener('pointerdown', () => { if (persistState !== 'granted') requestPersist(); }, { once: true });
window.addEventListener('beforeunload', save);
document.addEventListener('visibilitychange', () => { if (document.hidden) { save(); Cloud.upload(); } else checkOffline(); });
requestAnimationFrame(frame);
