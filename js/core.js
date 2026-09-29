// 基本常數與小工具（core.js）
'use strict';
// ====== 基本常數 ======
// 水族箱高度固定 620，寬度依螢幕比例調整，讓畫面剛好填滿螢幕
let W = 1000;
const H = 620, FLOOR = 555, TOP = 55;
const SAVE_KEY = 'aquarium-save-v1';
// 在畫布上畫表情符號。一定要先把填色設回實心顏色：iPhone 的 Safari 會用當下的填色（例如金色光暈的漸層）
// 去填滿表情符號，結果只看到一團光、看不到圖案
function emoji(c, ch, x, y, size, baseline = 'middle') {
  c.fillStyle = '#000'; c.font = `${size}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = baseline; c.fillText(ch, x, y);
}
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const $ = s => document.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// 大數字改用「億」「兆」表示，比較好讀（例如 3.8億）
const fmt = n => {
  n = Math.floor(n); if (n < 1e8) return n.toLocaleString('zh-TW');
  const [d, u] = n < 1e12 ? [1e8, '億'] : [1e12, '兆'], v = n / d;
  return (v < 100 ? +v.toFixed(2) : v < 1000 ? +v.toFixed(1) : Math.floor(v).toLocaleString('zh-TW')) + u;
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function weighted(pool) { let t = pool.reduce((s, p) => s + p[1], 0), r = Math.random() * t; for (const p of pool) { if ((r -= p[1]) <= 0) return p[0]; } return pool[0][0]; }

