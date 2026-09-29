// 每一種魚的外觀設定（MODELS）（fish-models.js）
const MODELS = {
  guppy: {
    L: .75, H: .33, seed: 11, top: '#c98450', mid: '#f2bb8e', belly: '#fdeedd', eye: [.72, -.15, .06, '#1a1210'],
    paint: (c, L, Hh) => { blob(c, L, Hh, -.45, .05, .42, .6, 'rgba(90,180,255,0.75)', 6, .3); blob(c, L, Hh, -.6, 0, .2, .35, 'rgba(120,120,255,0.6)', 5); },
    tail: { type: 'fan', len: 1.05, spread: .62, cols: ['#ffa84a', '#ff7a4a', '#ff5078', '#6aa8ff'] },
    fins: [{ x0: -.05, x1: -.65, h: .38, cols: ['#ffb45a', '#ff6a6a'] }, { kind: 'pec', x: .4, y: .3, len: .28, cols: ['#ffd0a8', '#ffb080'] }],
  },
  neon: {
    L: .95, H: .28, seed: 23, top: '#6a604e', mid: '#c8c1ae', belly: '#f5f2ea', eye: [.75, -.1, .065, '#141820'],
    paint: (c, L, Hh) => {
      const g = c.createLinearGradient(L * .2, 0, -L, 0); g.addColorStop(0, 'rgba(255,45,85,0)'); g.addColorStop(.25, '#ff2d55'); g.addColorStop(1, '#ff2d55');
      polyFill(c, [[L * .2, Hh * .08], [-L * 1.1, Hh * .02], [-L * 1.1, Hh * 1.3], [L * .2, Hh * 1.3]], g);
      polyFill(c, [[L * .72, -Hh * .42], [0, -Hh * .38], [-L * 1.05, -Hh * .3], [-L * 1.05, -Hh * .04], [0, -Hh * .1], [L * .72, -Hh * .16]], '#34e6ff');
    },
    tail: { type: 'fork', len: .55, spread: .36, cols: ['#e2e8ee', '#cfd8e2'], alpha: .7 },
    fins: [{ x0: -.1, x1: -.5, h: .22, cols: ['#e2e8ee', '#cfd8e2'], alpha: .7 }, { dir: 1, x0: -.1, x1: -.62, h: .18, cols: ['#e2e8ee', '#cfd8e2'], alpha: .7 }, { kind: 'pec', x: .4, y: .3, len: .22, cols: ['#eef2f6', '#dfe6ee'], alpha: .7 }],
    extra: (c, s, w, f, L, Hh) => { c.save(); c.globalAlpha *= .3 + .15 * Math.sin(T * 3); c.shadowColor = '#3ff3ff'; c.shadowBlur = 10; c.strokeStyle = '#8ffcff'; c.lineWidth = Hh * .2; c.lineCap = 'round'; c.beginPath(); c.moveTo(L * .6, -Hh * .25); c.lineTo(-L * .9, -Hh * .18); c.stroke(); c.restore(); },
  },
  clown: {
    L: .85, H: .47, seed: 5, shape: { nose: .72 }, top: '#f2620a', mid: '#ff8a26', belly: '#ffb060', eye: [.76, -.2, .065, '#1a0e08'],
    paint: (c, L, Hh) => { for (const [uc, hw, bd] of [[.5, .12, .2], [-.02, .15, .16], [-.8, .08, .08]]) { band(c, L, Hh, uc, hw + .055, bd, '#1c1410'); band(c, L, Hh, uc, hw, bd, '#ffffff'); } },
    tail: { type: 'round', len: .42, spread: .4, cols: ['#ff8a2a', '#ff6a10'], edge: '#1c1410' },
    fins: [{ x0: .3, x1: -.72, h: .3, back: .1, cols: ['#ff8a2a', '#ff7418'], edge: '#1c1410' }, { dir: 1, x0: -.1, x1: -.65, h: .22, back: .1, cols: ['#ff8a2a', '#ff7418'], edge: '#1c1410' },
      { kind: 'pec', x: .3, y: .35, len: .3, cols: ['#ff9a3c', '#ff7a20'], edge: '#1c1410' }],
  },
  angel: {
    L: .66, H: .55, seed: 31, shape: { nose: .42, hump: .05, tail: .3 }, top: '#a2a8b8', mid: '#e6e9f0', belly: '#ffffff', eye: [.68, -.25, .065, '#5a1010'],
    paint: (c, L, Hh) => { blob(c, L, Hh, .55, -.6, .35, .45, 'rgba(255,205,120,0.45)', 6); for (const [uc, hw] of [[.42, .075], [-.22, .12], [-.8, .08]]) band(c, L, Hh, uc, hw, -.06, '#2a2a33'); },
    tail: { type: 'fork', len: .5, spread: .45, cols: ['#e3e6ee', '#cfd4de'], alpha: .9 },
    fins: [{ x0: .4, x1: -.6, h: 1.0, back: .55, cols: ['#e3e6ee', '#3a3a45', '#e3e6ee', '#d5d9e2'] }, { dir: 1, x0: .35, x1: -.6, h: 1.0, back: .55, cols: ['#e3e6ee', '#3a3a45', '#e3e6ee', '#d5d9e2'] },
      { kind: 'pec', x: .25, y: .2, len: .28, cols: ['#f0f0f8', '#dadde8'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { c.strokeStyle = 'rgba(235,235,245,0.9)'; c.lineWidth = Math.max(1, s * .035); c.lineCap = 'round'; c.beginPath(); c.moveTo(L * .2, Hh * .75); c.lineTo(L * .05, Hh * 1.6); c.lineTo(-L * .2 + w * s * .4, Hh * 2.3); c.stroke(); },
  },
  betta: {
    L: .75, H: .3, seed: 43, top: '#1a2785', mid: '#3552cf', belly: '#8898f0', eye: [.72, -.12, .06, '#0c0a20'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['rgba(122,60,255,0)', 'rgba(122,60,255,0)', 'rgba(150,60,240,0.55)']),
    tail: { type: 'veil', len: 1.15, spread: .95, cols: ['#3452e0', '#6a3cf0', '#c43ca8', '#ff3c8c'] },
    fins: [{ x0: .05, x1: -.85, h: .7, back: .9, cols: ['#3a4ee6', '#8a3cd8', '#e04ca0'] }, { dir: 1, x0: .3, x1: -.9, h: .75, back: 1, cols: ['#3a4ee6', '#8a3cd8', '#ff4c8c'] },
      { kind: 'pec', x: .35, y: .35, len: .3, cols: ['#96aaff', '#ff82c0'], alpha: .85 }],
  },
  arowana: {
    L: 1.3, H: .3, seed: 57, shape: { nose: .3, belly: .92, hump: .3, tail: .45 }, top: '#a0700a', mid: '#f0bb44', belly: '#fff1c0', eye: [.8, -.28, .05, '#2a1600'], nx: 10,
    paint: (c, L, Hh) => { c.strokeStyle = 'rgba(255,245,200,0.4)'; c.lineWidth = 1.5; for (let u = -.9; u < .6; u += .16) for (const v of [-.55, 0, .55]) { c.beginPath(); c.moveTo((u - .06) * L, (v - .25) * Hh); c.lineTo((u + .03) * L, v * Hh); c.lineTo((u - .06) * L, (v + .25) * Hh); c.stroke(); } },
    tail: { type: 'round', len: .5, spread: .38, cols: ['#e0a020', '#ffcf5a'] },
    fins: [{ x0: -.5, x1: -.97, h: .35, back: .2, cols: ['#e6a824', '#ffd060'] }, { dir: 1, x0: -.35, x1: -.97, h: .4, back: .2, cols: ['#e6a824', '#ffd060'] },
      { kind: 'pec', x: .55, y: .5, len: .45, cols: ['#ffc850', '#ffe08a'] }],
    extra: (c, s, w, f, L, Hh) => { c.strokeStyle = '#a06a10'; c.lineWidth = Math.max(1, s * .035); c.lineCap = 'round'; c.beginPath(); c.moveTo(L * .95, Hh * .15); c.lineTo(L * 1.12, Hh * .25 + w * s * .3); c.lineTo(L * 1.2, Hh * .15 + w * s * .4); c.moveTo(L * .9, Hh * .2); c.lineTo(L * 1.02, Hh * .5 + w * s * .3); c.lineTo(L * 1.12, Hh * .45 + w * s * .4); c.stroke(); },
  },
  koi: {
    L: 1.05, H: .4, seed: 61, shape: { nose: .6, tail: .35 }, top: '#ebe4dc', mid: '#ffffff', belly: '#ffffff', eye: [.76, -.22, .055, '#1a1210'],
    paint: (c, L, Hh) => { blob(c, L, Hh, .55, -.45, .3, .55, '#e8412b', 7, .2); blob(c, L, Hh, -.1, -.5, .33, .6, '#e8412b', 8); blob(c, L, Hh, -.7, -.2, .2, .45, '#e8412b', 6, .5); },
    tail: { type: 'fan', len: .6, spread: .45, cols: ['#fff5ec', '#ffc8a8'], alpha: .92 },
    fins: [{ x0: .2, x1: -.68, h: .2, back: .3, cols: ['#fff5ee', '#ffc8a8'] }, { kind: 'pec', x: .35, y: .5, len: .4, cols: ['#fff8f0', '#ffd0b0'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => whisker(c, s, w, L, Hh, 'rgba(140,90,60,0.85)'),
  },
  // ---- 參考 AbyssRium 新增的魚 ----
  blueclown: {
    L: .85, H: .47, seed: 6, shape: { nose: .72 }, top: '#1b4aa0', mid: '#2e6ccc', belly: '#6aa0e6', eye: [.76, -.2, .065, '#08101e'],
    paint: (c, L, Hh) => { for (const [uc, hw, bd] of [[.5, .12, .2], [-.02, .15, .16], [-.8, .08, .08]]) { band(c, L, Hh, uc, hw + .05, bd, '#0e1a33'); band(c, L, Hh, uc, hw, bd, '#f4f8ff'); } },
    tail: { type: 'round', len: .42, spread: .4, cols: ['#2e6ccc', '#1b4aa0'], edge: '#0e1a33' },
    fins: [{ x0: .3, x1: -.72, h: .3, back: .1, cols: ['#2e6ccc', '#245cb8'], edge: '#0e1a33' }, { dir: 1, x0: -.1, x1: -.65, h: .22, back: .1, cols: ['#2e6ccc', '#245cb8'], edge: '#0e1a33' },
      { kind: 'pec', x: .3, y: .35, len: .3, cols: ['#4a86dc', '#2e6ccc'], edge: '#0e1a33' }],
  },
  jewel: {
    L: .8, H: .45, seed: 13, shape: { nose: .62 }, top: '#141f55', mid: '#243790', belly: '#3a52b0', eye: [.74, -.2, .065, '#050a1a'],
    paint: (c, L, Hh) => { const r = mulberry(99); for (let i = 0; i < 22; i++) blob(c, L, Hh, -.85 + r() * 1.5, -.8 + r() * 1.6, .035, .07, '#8ad8ff', 5, r()); },
    tail: { type: 'fork', len: .45, spread: .42, cols: ['#2a45a8', '#7ac8ff'] },
    fins: [{ x0: .3, x1: -.75, h: .3, back: .3, cols: ['#243790', '#3a5ac8'] }, { dir: 1, x0: .0, x1: -.7, h: .25, back: .3, cols: ['#243790', '#3a5ac8'] }, { kind: 'pec', x: .35, y: .3, len: .26, cols: ['#3a5ac8', '#6aa8ff'] }],
  },
  dottyback: {
    L: .95, H: .3, seed: 17, shape: { nose: .45 }, top: '#b04ecc', mid: '#dc86e6', belly: '#f0b8f0', eye: [.76, -.12, .06, '#200a28'],
    paint: (c, L, Hh) => blob(c, L, Hh, .7, -.05, .16, .45, 'rgba(250,215,255,0.8)', 6),
    tail: { type: 'round', len: .4, spread: .36, cols: ['#d07ae0', '#e8a8f0'] },
    fins: [{ x0: .35, x1: -.9, h: .2, back: .2, cols: ['#c868dc', '#e0a0f0'] }, { dir: 1, x0: -.1, x1: -.85, h: .18, back: .2, cols: ['#c868dc', '#e0a0f0'] }, { kind: 'pec', x: .4, y: .35, len: .22, cols: ['#e8b0f0', '#f4d0f8'] }],
  },
  snowclown: {
    L: .85, H: .47, seed: 8, shape: { nose: .72 }, top: '#c9361a', mid: '#e8542c', belly: '#ff8a5a', eye: [.76, -.2, .065, '#1a0806'],
    paint: (c, L, Hh) => { for (const [uc, hw, amp] of [[.48, .14, .08], [-.05, .2, .1], [-.75, .1, .06]]) { zigBand(c, L, Hh, uc, hw + .05, amp, '#1c1410'); zigBand(c, L, Hh, uc, hw, amp, '#ffffff'); } },
    tail: { type: 'round', len: .42, spread: .4, cols: ['#e8542c', '#ffffff'], edge: '#1c1410' },
    fins: [{ x0: .3, x1: -.72, h: .3, back: .1, cols: ['#e8542c', '#d8401e'], edge: '#1c1410' }, { dir: 1, x0: -.1, x1: -.65, h: .22, back: .1, cols: ['#e8542c', '#d8401e'], edge: '#1c1410' },
      { kind: 'pec', x: .3, y: .35, len: .3, cols: ['#ff7040', '#e8542c'], edge: '#1c1410' }],
  },
  clowntang: {
    L: .85, H: .45, seed: 19, shape: { nose: .5 }, top: '#e8b020', mid: '#ffd84a', belly: '#fff0a8', eye: [.72, -.2, .065, '#1a1204'],
    paint: (c, L, Hh) => { for (let k = -3; k <= 3; k++) { const v = k * .26; polyFill(c, [[L * .85, (v - .05) * Hh], [0, (v - .06 + k * .02) * Hh], [-L * 1.05, (v - .04 + k * .06) * Hh], [-L * 1.05, (v + .06 + k * .06) * Hh], [0, (v + .06 + k * .02) * Hh], [L * .85, (v + .05) * Hh]], '#3a78d8'); } },
    tail: { type: 'fork', len: .45, spread: .42, cols: ['#ffd84a', '#3a78d8'] },
    fins: [{ x0: .3, x1: -.8, h: .25, back: .2, cols: ['#ffd84a', '#3a78d8'] }, { dir: 1, x0: .1, x1: -.8, h: .22, back: .2, cols: ['#ffd84a', '#3a78d8'] }, { kind: 'pec', x: .35, y: .3, len: .26, cols: ['#fff0a0', '#ffd84a'] }],
  },
  peppermint: {
    L: .7, H: .5, seed: 29, shape: { nose: .6, hump: .1 }, top: '#d83a18', mid: '#f25a30', belly: '#ff8a5a', eye: [.7, -.22, .065, '#200602'],
    paint: (c, L, Hh) => { for (const uc of [.55, .2, -.15, -.5, -.85]) band(c, L, Hh, uc, .055, .12, '#fff4ec'); },
    tail: { type: 'round', len: .4, spread: .42, cols: ['#f25a30', '#fff4ec'] },
    fins: [{ x0: .3, x1: -.7, h: .35, back: .2, cols: ['#f25a30', '#ff9a70'] }, { dir: 1, x0: .1, x1: -.7, h: .3, back: .2, cols: ['#f25a30', '#ff9a70'] }, { kind: 'pec', x: .3, y: .3, len: .26, cols: ['#ffb090', '#ff8a5a'] }],
  },
  bluetang: {
    L: .85, H: .5, seed: 37, shape: { nose: .5 }, top: '#1a56c8', mid: '#2f7cf0', belly: '#6aaaff', eye: [.7, -.22, .065, '#040a18'],
    paint: (c, L, Hh) => { polyFill(c, [[L * .62, -Hh * .35], [L * .1, -Hh * .6], [-L * .6, -Hh * .4], [-L * .95, -Hh * .1], [-L * .9, Hh * .15], [-L * .55, -Hh * .1], [-L * .1, Hh * .1], [L * .1, -Hh * .15], [L * .55, -Hh * .1]], '#0c1a3a'); },
    tail: { type: 'fork', len: .45, spread: .45, cols: ['#ffd23a', '#ffb81a'], edge: '#0c1a3a' },
    fins: [{ x0: .35, x1: -.85, h: .28, back: .2, cols: ['#2f7cf0', '#1a56c8'], edge: '#0c1a3a' }, { dir: 1, x0: .1, x1: -.85, h: .25, back: .2, cols: ['#2f7cf0', '#1a56c8'], edge: '#0c1a3a' }, { kind: 'pec', x: .35, y: .3, len: .28, cols: ['#ffd23a', '#ffe070'] }],
  },
  parrot: {
    L: .9, H: .45, seed: 41, shape: { nose: .8, hump: .45, belly: .95 }, top: '#236e7e', mid: '#3a9aa4', belly: '#6ac4bc', eye: [.6, -.2, .06, '#061418'],
    paint: (c, L, Hh) => { blob(c, L, Hh, .95, .15, .1, .25, '#d8ecff', 5); c.strokeStyle = 'rgba(200,245,240,0.28)'; c.lineWidth = 1.5; for (let u = -.8; u < .45; u += .18) for (const v of [-.5, 0, .5]) { c.beginPath(); c.moveTo((u - .05) * L, (v - .2) * Hh); c.lineTo((u + .03) * L, v * Hh); c.lineTo((u - .05) * L, (v + .2) * Hh); c.stroke(); } },
    tail: { type: 'fan', len: .5, spread: .45, cols: ['#2a8090', '#4ab0b8'] },
    fins: [{ x0: .25, x1: -.8, h: .3, back: .2, cols: ['#2a8090', '#4ab0b8'] }, { dir: 1, x0: -.05, x1: -.75, h: .26, back: .2, cols: ['#2a8090', '#4ab0b8'] }, { kind: 'pec', x: .3, y: .3, len: .28, cols: ['#e89080', '#f0b0a0'] }],
  },
  grouper: {
    L: .9, H: .42, seed: 47, shape: { nose: .55 }, top: '#dedfe6', mid: '#f6f6f9', belly: '#ffffff', eye: [.72, -.2, .06, '#101014'],
    paint: (c, L, Hh) => { const r = mulberry(7); for (let i = 0; i < 14; i++) blob(c, L, Hh, -.85 + r() * 1.55, -.75 + r() * 1.5, .06 + r() * .04, .13 + r() * .08, '#15161c', 6, r()); },
    tail: { type: 'round', len: .45, spread: .4, cols: ['#eeeef2', '#d8d8e0'] },
    fins: [{ x0: .25, x1: -.8, h: .3, back: .15, cols: ['#eeeef2', '#d8d8e0'] }, { dir: 1, x0: .0, x1: -.75, h: .26, back: .15, cols: ['#eeeef2', '#d8d8e0'] }, { kind: 'pec', x: .3, y: .3, len: .32, cols: ['#f4f4f8', '#e0e0e8'] }],
    extra: (c, s, w, f, L, Hh) => { c.fillStyle = '#15161c'; for (const [x, y] of [[-L * 1.2, -Hh * .15], [-L * 1.25, Hh * .2], [0, -Hh * 1.1], [-L * .35, -Hh * 1.05]]) { circle(c, x, y, s * .045); c.fill(); } },
  },
  moorish: {
    L: .6, H: .62, seed: 53, shape: { nose: .3, hump: -.05, tail: .25 }, top: '#f4ecd0', mid: '#fbf6e8', belly: '#ffffff', eye: [.55, -.2, .065, '#0a0a0a'],
    paint: (c, L, Hh) => { band(c, L, Hh, .32, .16, -.05, '#16161a'); band(c, L, Hh, -.45, .17, -.05, '#16161a'); blob(c, L, Hh, -.85, 0, .22, 1.3, '#ffd23a', 6); blob(c, L, Hh, .95, .15, .12, .22, '#ff9a3a', 5); blob(c, L, Hh, -.05, -.8, .2, .35, 'rgba(255,215,90,0.55)', 5); },
    tail: { type: 'fork', len: .42, spread: .42, cols: ['#16161a', '#f4ecd0'] },
    fins: [{ x0: .3, x1: -.45, h: .95, back: .55, cols: ['#f8f4e8', '#f4ecd0', '#16161a'] }, { dir: 1, x0: .25, x1: -.45, h: .75, back: .8, cols: ['#16161a', '#f8f4e8'] }, { kind: 'pec', x: .2, y: .2, len: .26, cols: ['#fff0c0', '#ffd23a'] }],
    extra: (c, s, w, f, L, Hh) => { c.strokeStyle = 'rgba(250,246,232,0.95)'; c.lineWidth = Math.max(1, s * .03); c.lineCap = 'round'; c.beginPath(); const tx = -L * .45 - s * .95 * .55 + w * s * .95 * .5, ty = -Hh * .82 - s * .95; c.moveTo(tx, ty); c.lineTo(tx - L * .9 + w * s * .8, ty + s * .2); c.lineTo(tx - L * 1.7 + w * s * 1.6, ty + s * .55); c.stroke(); },
  },
  french: {
    L: .68, H: .6, seed: 59, shape: { nose: .5, hump: .05 }, top: '#121319', mid: '#1f2129', belly: '#2c2e38', eye: [.62, -.22, .07, '#f2d23a'],
    paint: (c, L, Hh) => { c.strokeStyle = '#f2d23a'; c.lineWidth = 2.2; for (let u = -.75; u < .45; u += .22) for (const v of [-.6, -.2, .2, .6]) { c.beginPath(); c.moveTo((u - .06) * L, (v - .15) * Hh); c.lineTo((u + .04) * L, v * Hh); c.lineTo((u - .06) * L, (v + .15) * Hh); c.stroke(); } band(c, L, Hh, .62, .035, .05, '#f2d23a'); },
    tail: { type: 'round', len: .4, spread: .45, cols: ['#1f2129', '#2c2e38'], edge: '#f2d23a' },
    fins: [{ x0: .3, x1: -.65, h: .7, back: .7, cols: ['#1f2129', '#2c2e38'], edge: '#f2d23a' }, { dir: 1, x0: .2, x1: -.65, h: .65, back: .7, cols: ['#1f2129', '#2c2e38'], edge: '#f2d23a' }, { kind: 'pec', x: .25, y: .25, len: .26, cols: ['#f2d23a', '#ffe070'] }],
  },
  queen: {
    L: .7, H: .55, seed: 67, shape: { nose: .45, hump: .05 }, top: '#5a2e9a', mid: '#8a46b4', belly: '#b060b8', eye: [.66, -.2, .065, '#0c0618'], edge: '#3ab8b0',
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['#ffa040', '#e06a6a', '#9a48b4', '#6a34a8'], .85); blob(c, L, Hh, .2, .15, .14, .18, '#ffc050', 5); },
    tail: { type: 'fork', len: .42, spread: .42, cols: ['#ffb040', '#ff9a30'] },
    fins: [{ x0: .35, x1: -.6, h: .75, back: 1.1, cols: ['#e8603a', '#7a3aa8', '#3ab8b0'] }, { dir: 1, x0: .3, x1: -.6, h: .7, back: 1.1, cols: ['#e8603a', '#7a3aa8', '#3ab8b0'] }, { kind: 'pec', x: .25, y: .25, len: .26, cols: ['#ffb040', '#ffd070'] }],
  },
  mahi: {
    L: 1.3, H: .36, seed: 73, shape: { nose: .95, hump: .5, belly: .95, tail: .3 }, top: '#1e7a62', mid: '#9ccc58', belly: '#f4e070', eye: [.78, -.05, .05, '#0a1a10'],
    paint: (c, L, Hh) => { const r = mulberry(31); for (let i = 0; i < 18; i++) blob(c, L, Hh, -.85 + r() * 1.6, -.75 + r() * .9, .02, .07, '#3a8ae8', 5, r()); },
    tail: { type: 'fork', len: .6, spread: .55, cols: ['#e8d040', '#ffe070'] },
    fins: [{ x0: .85, x1: -.9, y: .9, h: .3, back: .2, cols: ['#2a7ad0', '#1e7a62'] }, { dir: 1, x0: -.15, x1: -.9, h: .25, back: .2, cols: ['#e8d040', '#ffe070'] }, { kind: 'pec', x: .5, y: .45, len: .35, cols: ['#e8d040', '#fff0a0'] }],
  },
  // ---- 40 種魚改版新增 ----
  goldfish: {
    L: .62, H: .5, seed: 131, shape: { nose: .7, hump: .2, belly: 1.15, tail: .35 }, top: '#d8380e', mid: '#ff6a1e', belly: '#ffc48a', eye: [.66, -.2, .075, '#1a0a04'],
    paint: (c, L, Hh) => { blob(c, L, Hh, .1, .6, .62, .45, 'rgba(255,240,220,0.75)', 7); blob(c, L, Hh, .5, -.15, .22, .3, 'rgba(255,210,140,0.5)', 5); },
    tail: { type: 'veil', len: 1.0, spread: .85, cols: ['#ff7a2a', '#ffa860', '#ffe6d0'], alpha: .88 },
    fins: [{ x0: .3, x1: -.55, h: .55, back: .5, cols: ['#ff7a2a', '#ffc090'], alpha: .9 }, { dir: 1, x0: -.1, x1: -.6, h: .35, back: .5, cols: ['#ff8a3a', '#ffd0a8'], alpha: .85 },
      { kind: 'pec', x: .3, y: .45, len: .28, cols: ['#ffb080', '#ffe0c8'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => blush(c, L * .72, Hh * .15, s * .06),
  },
  puffer: {
    L: .62, H: .52, seed: 137, shape: { nose: .85, hump: .1, belly: 1.12, tail: .3 }, top: '#8a7a3e', mid: '#d8c878', belly: '#fff8e0', eye: [.58, -.3, .09, '#141008'],
    paint: (c, L, Hh) => { const r = mulberry(5); for (let i = 0; i < 16; i++) blob(c, L, Hh, -.8 + r() * 1.5, -.85 + r() * .9, .05, .09, '#5a4a22', 5, r()); blob(c, L, Hh, .1, .75, .85, .45, 'rgba(255,255,245,0.85)', 7); },
    tail: { type: 'round', len: .32, spread: .3, cols: ['#c8b868', '#e8dca0'] },
    fins: [{ x0: -.35, x1: -.7, h: .2, back: .1, cols: ['#c8b868', '#e8dca0'] }, { kind: 'pec', x: .2, y: .1, len: .24, cols: ['#e8dca0', '#fff4c8'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => {
      c.fillStyle = 'rgba(110,90,40,0.85)';
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * (.32 + 1.36 * i / 10), nx = Math.cos(a), ny = Math.sin(a), x = nx * L * .93, y = ny * Hh * 1.02;
        c.beginPath(); c.moveTo(x - ny * s * .025, y + nx * s * .025); c.lineTo(x + nx * s * .08, y + ny * s * .08); c.lineTo(x + ny * s * .025, y - nx * s * .025); c.fill();
      }
      blush(c, L * .62, Hh * .1, s * .07);
    },
  },
  boxfish: {
    L: .7, H: .42, seed: 139, shape: { nose: .95, hump: .45, belly: 1.0, tail: .45 }, top: '#e8b800', mid: '#ffd81a', belly: '#fff08a', eye: [.6, -.3, .08, '#141004'],
    paint: (c, L, Hh) => { const r = mulberry(21); for (let i = 0; i < 16; i++) { const u = -.8 + r() * 1.45, v = -.8 + r() * 1.55; blob(c, L, Hh, u, v, .07, .11, '#1a1a22', 6); blob(c, L, Hh, u + .01, v - .02, .035, .055, '#ffffff', 5); } },
    tail: { type: 'round', len: .35, spread: .32, cols: ['#ffd81a', '#fff08a'] },
    fins: [{ x0: -.45, x1: -.75, h: .18, back: .1, cols: ['#ffd81a', '#fff08a'], alpha: .85 }, { kind: 'pec', x: .3, y: .25, len: .22, cols: ['#fff08a', '#ffffff'], alpha: .8 }],
    extra: (c, s, w, f, L, Hh) => blush(c, L * .72, Hh * .15, s * .06),
  },
  butterfly: {
    L: .66, H: .55, seed: 149, shape: { nose: .3, hump: .1, tail: .3 }, top: '#e8a800', mid: '#ffcc1a', belly: '#fff0a0', eye: [.64, -.2, .07, '#101010'],
    paint: (c, L, Hh) => {
      for (let k = 0; k < 6; k++) { const u = .3 - k * .22; polyFill(c, [[(u + .06) * L, -Hh * 1.1], [(u - .3) * L, Hh * 1.2], [(u - .34) * L, Hh * 1.2], [(u + .02) * L, -Hh * 1.1]], 'rgba(170,100,10,0.4)'); }
      polyFill(c, [[L * .8, -Hh * 1.2], [L * .5, -Hh * 1.2], [L * .55, Hh * .1], [L * .78, Hh * .05]], '#15151a');
      polyFill(c, [[L * .5, -Hh * 1.2], [L * .38, -Hh * 1.2], [L * .44, 0], [L * .55, Hh * .1]], '#ffffff');
      blob(c, L, Hh, -.78, -.35, .12, .2, '#15151a', 6);
    },
    tail: { type: 'round', len: .36, spread: .38, cols: ['#ffcc1a', '#fff4c0'] },
    fins: [{ x0: .3, x1: -.8, h: .38, back: .25, cols: ['#ffc81a', '#f0a000'], edge: '#15151a' }, { dir: 1, x0: .2, x1: -.8, h: .33, back: .25, cols: ['#ffc81a', '#f0a000'], edge: '#15151a' },
      { kind: 'pec', x: .3, y: .3, len: .24, cols: ['#fff0a0', '#ffe070'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { c.fillStyle = '#e8b000'; c.beginPath(); c.moveTo(L * .95, -Hh * .12); c.lineTo(L * 1.2, -Hh * .02); c.lineTo(L * .95, Hh * .12); c.fill(); },
  },
  mandarin: {
    L: .78, H: .34, seed: 151, shape: { nose: .7, tail: .35 }, top: '#1a6a8a', mid: '#2a9aa8', belly: '#3ab0a0', eye: [.72, -.35, .085, '#401010'],
    paint: (c, L, Hh) => {
      const r = mulberry(33); c.lineJoin = 'round'; c.lineCap = 'round';
      c.strokeStyle = '#ff8a2a'; c.lineWidth = 3.2;
      for (let i = 0; i < 10; i++) { c.beginPath(); let x = -L + r() * L * 1.8, y = -Hh + r() * Hh * 2; c.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (r() - .5) * L * .5; y += (r() - .5) * Hh * .8; c.lineTo(x, y); } c.stroke(); }
      c.strokeStyle = '#3a5ae8'; c.lineWidth = 1.6;
      for (let i = 0; i < 7; i++) { c.beginPath(); const x = -L + r() * L * 1.8, y = -Hh + r() * Hh * 2; c.moveTo(x, y); c.lineTo(x + L * .2, y + (r() - .5) * Hh); c.stroke(); }
    },
    tail: { type: 'round', len: .45, spread: .42, cols: ['#ff8a2a', '#2a6ad8', '#ff8a2a'], edge: '#1a3a8a' },
    fins: [{ x0: .1, x1: -.7, h: .55, back: .3, cols: ['#ff7a2a', '#3a5ae8', '#ff9a3a'], edge: '#1a3a8a' }, { dir: 1, x0: -.05, x1: -.75, h: .3, back: .2, cols: ['#ff8a2a', '#2a8ad8'] },
      { kind: 'pec', x: .35, y: .4, len: .34, cols: ['#ff9a3a', '#ffcf5a'], alpha: .9 }],
  },
  emperor: {
    L: .72, H: .55, seed: 157, shape: { nose: .45, hump: .05 }, top: '#1a3a9a', mid: '#2a50c0', belly: '#3a5ab8', eye: [.66, -.2, .065, '#0a0a18'],
    paint: (c, L, Hh) => {
      for (let k = -5; k <= 5; k++) { const v = k * .2; polyFill(c, [[L * .45, (v - .035) * Hh], [-L * 1.05, (v - .035 + k * .02) * Hh], [-L * 1.05, (v + .035 + k * .02) * Hh], [L * .45, (v + .035) * Hh]], '#ffd84a'); }
      polyFill(c, [[L * 1.1, -Hh * .5], [L * .72, -Hh * .5], [L * .72, Hh * .4], [L * 1.1, Hh * .6]], '#dfe8ff');
      polyFill(c, [[L * .74, -Hh * 1.2], [L * .52, -Hh * 1.2], [L * .54, Hh * .15], [L * .72, Hh * .1]], '#101428');
      polyFill(c, [[L * .52, -Hh * 1.2], [L * .45, -Hh * 1.2], [L * .48, Hh * .2], [L * .54, Hh * .15]], '#6ab8ff');
      polyFill(c, [[L * .58, Hh * .1], [L * .2, Hh * .15], [L * .15, Hh * .6], [L * .52, Hh * .55]], '#101428');
    },
    tail: { type: 'round', len: .4, spread: .42, cols: ['#ffc81a', '#ffe060'] },
    fins: [{ x0: .3, x1: -.62, h: .45, back: .6, cols: ['#2a50c0', '#ffd84a'] }, { dir: 1, x0: .2, x1: -.62, h: .4, back: .6, cols: ['#2a50c0', '#1a2a70'], edge: '#6ab8ff' },
      { kind: 'pec', x: .25, y: .25, len: .26, cols: ['#3a60d0', '#6ab8ff'] }],
  },
  lionfish: {
    L: .82, H: .38, seed: 163, shape: { nose: .5, hump: .2 }, top: '#8a1a10', mid: '#c83a22', belly: '#f4d0c0', eye: [.7, -.25, .07, '#200404'],
    paint: (c, L, Hh) => { for (let k = 0; k < 9; k++) band(c, L, Hh, .75 - k * .21, .04, .12, '#fff2e8'); },
    tail: { type: 'round', len: .45, spread: .38, cols: ['#f8e8e0', '#e8b0a0'], alpha: .8 },
    // 張開的大片羽毛狀胸鰭
    under: (c, s, w, f, L, Hh) => {
      for (const k of [0, 1]) {
        c.save(); c.translate(L * .3, Hh * .3); c.rotate(.5 + k * .45 + Math.sin(T * 2 + (f ? f.phase : 0) + k) * .12 + w);
        for (let i = 0; i < 6; i++) {
          const a = -.5 + i * .2, len = s * (.95 - Math.abs(i - 2.5) * .09);
          c.fillStyle = i % 2 ? 'rgba(205,60,40,0.85)' : 'rgba(255,238,228,0.85)';
          c.beginPath(); c.moveTo(0, 0); c.lineTo(-Math.cos(a) * len, Math.sin(a) * len - s * .04); c.lineTo(-Math.cos(a + .12) * len * .96, Math.sin(a + .12) * len * .96); c.closePath(); c.fill();
        }
        c.restore();
      }
    },
    // 背上一根根的長刺
    extra: (c, s, w, f, L, Hh) => {
      c.lineCap = 'round';
      for (let i = 0; i < 9; i++) {
        const x = L * (.5 - i * .14), y = -Hh * .85, len = s * (.75 - Math.abs(i - 3) * .07), a = -1.25 - i * .06 + w * .5;
        c.fillStyle = 'rgba(235,130,115,0.4)'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * len * .7, y + Math.sin(a) * len * .7); c.lineTo(x - L * .14, y); c.fill();
        c.strokeStyle = i % 2 ? 'rgba(255,240,235,0.95)' : 'rgba(190,40,30,0.95)'; c.lineWidth = Math.max(1, s * .03);
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); c.stroke();
      }
    },
  },
  sunfish: {
    L: .62, H: .62, seed: 167, shape: { nose: .7, hump: 0, belly: 1.0, tail: .7 }, top: '#6a7a8a', mid: '#a8b8c4', belly: '#e8eef2', eye: [.62, -.2, .075, '#101418'],
    paint: (c, L, Hh) => { const r = mulberry(8); for (let i = 0; i < 12; i++) blob(c, L, Hh, -.7 + r() * 1.3, -.6 + r() * 1.3, .06, .06, 'rgba(255,255,255,0.35)', 5, r()); },
    tail: { type: 'round', len: .22, spread: .62, cols: ['#98a8b4', '#c8d4dc'] },
    fins: [{ x0: -.35, x1: -.75, h: .85, back: .15, cols: ['#8a9aa8', '#b8c8d4'] }, { dir: 1, x0: -.35, x1: -.75, h: .85, back: .15, cols: ['#8a9aa8', '#b8c8d4'] },
      { kind: 'pec', x: .3, y: .05, len: .2, cols: ['#b8c8d4', '#dce4ea'] }],
    extra: (c, s, w, f, L, Hh) => {
      blush(c, L * .6, Hh * .1, s * .08);
      c.strokeStyle = 'rgba(60,70,80,0.8)'; c.lineWidth = Math.max(1, s * .025); c.beginPath(); c.arc(L * .93, Hh * .08, s * .04, -.9, .9); c.stroke();
    },
  },
  dolphin: {
    L: 1.15, H: .3, seed: 173, shape: { nose: .5, hump: .35, belly: .95, tail: .16 }, top: '#4a6a8e', mid: '#8aa8c8', belly: '#eef4fa', eye: [.6, -.12, .055, '#0a1420'],
    paint: (c, L, Hh) => { polyFill(c, [[L * 1.1, Hh * .25], [L * .3, Hh * .15], [-L * .4, Hh * .35], [-L * 1.1, Hh * .5], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(245,250,255,0.9)'); },
    tail: { type: 'fluke', len: .5, spread: .38, cols: ['#5a7aa0', '#7a98bc'] },
    fins: [{ x0: .05, x1: -.3, h: .38, back: .9, cols: ['#4a6a8e', '#6a8aae'] }, { kind: 'pec', x: .45, y: .45, len: .32, cols: ['#6a8aae', '#8aa8c8'] }],
    // 長長的嘴和微笑
    extra: (c, s, w, f, L, Hh) => {
      polyFill(c, [[L * .95, -Hh * .2], [L * 1.28, Hh * .02], [L * 1.26, Hh * .2], [L * .95, Hh * .3]], '#7e9cbe');
      polyFill(c, [[L * .95, Hh * .08], [L * 1.26, Hh * .12], [L * 1.26, Hh * .2], [L * .95, Hh * .3]], '#eef4fa');
      c.strokeStyle = 'rgba(40,60,90,0.7)'; c.lineWidth = Math.max(1, s * .02); c.beginPath(); c.moveTo(L * 1.24, Hh * .1); c.quadraticCurveTo(L * 1.05, Hh * .2, L * .88, Hh * .05); c.stroke();
      blush(c, L * .72, Hh * .15, s * .06);
    },
  },
  sailfish: {
    L: 1.25, H: .26, seed: 177, shape: { nose: .45, hump: .3, tail: .2 }, top: '#12306a', mid: '#3a6ab0', belly: '#e8f0f8', eye: [.72, -.15, .055, '#060c18'], nx: 10,
    paint: (c, L, Hh) => { polyFill(c, [[L * 1.1, Hh * .1], [-L * 1.1, Hh * .2], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(235,242,250,0.9)'); for (let u = -.8; u < .5; u += .16) band(c, L, Hh, u, .018, 0, 'rgba(120,200,255,0.6)'); },
    tail: { type: 'fork', len: .7, spread: .7, cols: ['#12306a', '#2a58a0'] },
    fins: [{ x0: .6, x1: -.55, h: 1.15, back: .5, cols: ['#1a3a8a', '#2a6ad8', '#1a3a8a'], alpha: .92 }, { dir: 1, x0: -.3, x1: -.6, h: .25, back: .3, cols: ['#12306a', '#3a6ab0'] },
      { kind: 'pec', x: .5, y: .5, len: .35, cols: ['#2a58a0', '#5a8ad0'] }],
    extra: (c, s, w, f, L, Hh) => {
      polyFill(c, [[L * .98, -Hh * .25], [L * 1.7, -Hh * .05], [L * .98, Hh * .15]], '#2a3e5e');
      c.fillStyle = 'rgba(20,30,60,0.6)'; for (let i = 0; i < 7; i++) { circle(c, L * (.4 - i * .14), -Hh * (1.9 - Math.abs(i - 2) * .12), s * .03); c.fill(); }
    },
  },
  orca: {
    L: 1.3, H: .36, seed: 179, shape: { nose: .8, hump: .35, belly: .98, tail: .16 }, top: '#0e1016', mid: '#161820', belly: '#20232c', eye: [.66, -.08, .05, '#000000'],
    paint: (c, L, Hh) => {
      polyFill(c, [[L * 1.1, Hh * .3], [L * .5, Hh * .45], [L * .1, Hh * .5], [-L * .3, Hh * .35], [-L * .55, Hh * .1], [-L * .45, Hh * .55], [-L * .1, Hh * 1.3], [L * 1.1, Hh * 1.3]], '#f4f6f8');
      blob(c, L, Hh, .48, -.32, .16, .14, '#f4f6f8', 7, .3);
      polyFill(c, [[-L * .05, -Hh * .95], [-L * .35, -Hh * .9], [-L * .3, -Hh * .6], [-L * .02, -Hh * .7]], 'rgba(200,205,215,0.55)');
    },
    tail: { type: 'fluke', len: .5, spread: .42, cols: ['#12141a', '#262a34'] },
    fins: [{ x0: .12, x1: -.2, h: .75, back: .3, cols: ['#0e1016', '#23262e'] }, { kind: 'pec', x: .45, y: .6, len: .42, cols: ['#161820', '#2a2d36'] }],
    extra: (c, s, w, f, L, Hh) => blush(c, L * .74, Hh * .35, s * .06),
  },
  whaleshark: {
    L: 1.35, H: .36, seed: 181, shape: { nose: 1.0, hump: .45, belly: .92, tail: .2 }, top: '#2a3e5a', mid: '#3e5878', belly: '#dfe8f0', eye: [.8, -.02, .045, '#0a0f18'], nx: 10,
    paint: (c, L, Hh) => {
      polyFill(c, [[L * 1.1, Hh * .35], [0, Hh * .4], [-L * 1.1, Hh * .2], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(225,235,242,0.92)');
      let row = 0; for (let v = -.85; v < .35; v += .22, row++) for (let u = -.9; u < .95; u += .13) blob(c, L, Hh, u + (row % 2) * .065, v, .022, .06, 'rgba(240,248,255,0.85)', 5);
      c.strokeStyle = 'rgba(220,235,250,0.4)'; c.lineWidth = 1.5; for (const v of [-.62, -.2]) { c.beginPath(); c.moveTo(-L, v * Hh); c.lineTo(L * .8, (v - .08) * Hh); c.stroke(); }
    },
    tail: { type: 'fork', len: .6, spread: .6, cols: ['#2a3e5a', '#3e5878'] },
    fins: [{ x0: -.05, x1: -.4, h: .45, back: .4, cols: ['#2a3e5a', '#3e5878'] }, { dir: 1, x0: -.55, x1: -.75, h: .15, back: .2, cols: ['#2a3e5a', '#3e5878'] },
      { kind: 'pec', x: .4, y: .55, len: .5, cols: ['#2a3e5a', '#3e5878'] }],
    extra: (c, s, w, f, L, Hh) => { c.strokeStyle = 'rgba(15,25,40,0.7)'; c.lineWidth = Math.max(1, s * .025); c.beginPath(); c.moveTo(L * 1.0, Hh * .25); c.quadraticCurveTo(L * .85, Hh * .35, L * .7, Hh * .3); c.stroke(); },
  },
  humpback: {
    L: 1.4, H: .38, seed: 191, shape: { nose: .75, hump: .3, belly: 1.0, tail: .15 }, top: '#2a3448', mid: '#3a4a64', belly: '#c8d4e2', eye: [.62, .05, .045, '#080c14'], nx: 10,
    paint: (c, L, Hh) => {
      polyFill(c, [[L * 1.1, Hh * .2], [L * .3, Hh * .35], [-L * .6, Hh * .5], [-L * 1.1, Hh * .4], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(215,225,238,0.9)');
      c.strokeStyle = 'rgba(120,135,160,0.7)'; c.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const y = Hh * (.45 + k * .1); c.beginPath(); c.moveTo(L * .95, y); c.lineTo(L * .05, y + Hh * .05); c.stroke(); }
      const r = mulberry(4); for (let i = 0; i < 7; i++) blob(c, L, Hh, .55 + r() * .4, -.6 + r() * .5, .03, .05, 'rgba(20,28,40,0.7)', 5);
    },
    tail: { type: 'fluke', len: .6, spread: .5, cols: ['#2a3448', '#8a9ab4'] },
    fins: [{ x0: -.3, x1: -.45, h: .18, back: .5, cols: ['#2a3448', '#3a4a64'] }, { kind: 'pec', x: .35, y: .7, len: 1.05, cols: ['#e8eef6', '#aab8cc'] }],
    extra: (c, s, w, f, L, Hh) => blush(c, L * .74, Hh * .3, s * .06),
  },
  fairybetta: {
    L: .72, H: .3, seed: 193, top: '#f0d8ff', mid: '#ffffff', belly: '#ffffff', eye: [.72, -.12, .07, '#301040'], glow: '#ffb8f0',
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['#ffd0f0', '#e8d0ff', '#c0e8ff', '#b0f0e8'], .6),
    // 身後飄著兩條羽衣彩帶
    under: (c, s, w, f, L, Hh) => {
      c.save(); c.translate(-L * .2, Hh * .5); const ph = f ? f.phase : 0;
      for (const k of [0, 1]) ribbon(c, [0, 1, 2, 3, 4, 5, 6].map(j => [-s * .3 * j, s * (.2 + j * .12) * (k ? 1 : -.35) + Math.sin(T * 1.8 + j * .8 + k * 2 + ph) * s * .1 * j / 6 + w * s * j * .3]), s * .09, k ? '#c8a8ff' : '#ffa8e0', .75);
      c.restore();
    },
    tail: { type: 'veil', len: 1.6, spread: 1.25, cols: ['#ffc8f0', '#e0b8ff', '#a8d8ff', '#b8fff0'], alpha: .82 },
    fins: [{ x0: .1, x1: -.9, h: 1.0, back: 1.1, cols: ['#ffd0f4', '#d0b8ff', '#a8e8ff'], alpha: .82 }, { dir: 1, x0: .35, x1: -.9, h: 1.05, back: 1.2, cols: ['#ffd0f4', '#c8b0ff', '#a8f0e8'], alpha: .82 },
      { kind: 'pec', x: .35, y: .35, len: .4, cols: ['#ffffff', '#ffc8f0'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { for (let i = 0; i < 6; i++) { const a = T * 1.5 + i * 1.05; c.fillStyle = `rgba(255,255,255,${.5 + .5 * Math.sin(T * 4 + i)})`; star4(c, -L * 1.5 + Math.cos(a) * s * .5, Math.sin(a * 1.3) * s * .6, s * .05); } },
  },
  narwhal: {
    L: 1.2, H: .36, seed: 197, shape: { nose: .9, hump: .4, belly: 1.0, tail: .16 }, top: '#b8c4e8', mid: '#e4e8fa', belly: '#ffffff', eye: [.66, -.05, .05, '#1a1a40'], glow: '#d8e0ff',
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['rgba(255,215,250,0.55)', 'rgba(210,220,255,0)', 'rgba(170,200,255,0.5)']);
      const r = mulberry(12); for (let i = 0; i < 18; i++) blob(c, L, Hh, -.9 + r() * 1.5, -.9 + r() * .8, .025, .05, 'rgba(140,150,210,0.45)', 5, r());
    },
    tail: { type: 'fluke', len: .5, spread: .42, cols: ['#c8d0f0', '#f0e0ff'] },
    fins: [{ kind: 'pec', x: .45, y: .55, len: .34, cols: ['#d8dcf4', '#f4ecff'] }],
    // 螺旋長角，尖端閃著星光
    extra: (c, s, w, f, L, Hh) => {
      const x0 = L * .92, y0 = -Hh * .28, len = s * 1.3, tw = (Math.sin(T * 3) + 1) / 2;
      c.save(); c.shadowColor = '#fff0a0'; c.shadowBlur = 14;
      polyFill(c, [[x0, y0 - s * .05], [x0 + len, y0 - s * .25], [x0, y0 + s * .05]], '#fff4d0');
      c.restore();
      c.strokeStyle = 'rgba(210,170,90,0.9)'; c.lineWidth = 1.2;
      for (let k = 1; k < 8; k++) { const t = k / 8, x = x0 + len * t, y = y0 - s * .25 * t, hw = s * .05 * (1 - t); c.beginPath(); c.moveTo(x - s * .03, y + hw); c.lineTo(x + s * .03, y - hw); c.stroke(); }
      c.fillStyle = `rgba(255,255,220,${.55 + .45 * tw})`; star4(c, x0 + len, y0 - s * .25, s * (.07 + .07 * tw));
      blush(c, L * .72, Hh * .3, s * .06);
    },
  },
  aurorawhale: {
    L: 1.45, H: .4, seed: 199, shape: { nose: .85, hump: .35, belly: 1.0, tail: .15 }, top: '#0a1a4a', mid: '#1a3a8a', belly: '#7ac8e8', eye: [.64, 0, .05, '#e8fbff'], nx: 10,
    glow: () => `hsl(${160 + Math.sin(T * .7) * 60},90%,65%)`,
    paint: (c, L, Hh) => {
      polyFill(c, [[L * 1.1, Hh * .25], [0, Hh * .4], [-L * 1.1, Hh * .35], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(170,235,255,0.55)');
      for (const [v, col] of [[-.55, 'rgba(90,255,190,0.55)'], [-.3, 'rgba(120,170,255,0.5)'], [-.05, 'rgba(210,130,255,0.45)']])
        polyFill(c, [[L * .9, (v - .06) * Hh], [0, (v - .12) * Hh], [-L * 1.1, (v + .05) * Hh], [-L * 1.1, (v + .16) * Hh], [0, (v + .02) * Hh], [L * .9, (v + .05) * Hh]], col);
    },
    // 身後飄著三條極光彩帶
    under: (c, s, w, f, L, Hh) => {
      const h0 = 150 + Math.sin(T * .5) * 40; c.save(); c.translate(L * .1, -Hh * .7);
      for (const k of [0, 1, 2]) ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * (.28 + k * .04) * j, -s * (.06 + k * .09) * j - Math.sin(T * 1.4 + j * .8 + k * 1.3) * s * .1 * j / 5 + w * s * j * .2]), s * (.12 - k * .02), hsl((h0 + k * 55) % 360, .85, .65), .5);
      c.restore();
    },
    tail: { type: 'fluke', len: .65, spread: .55, cols: ['#1a3a8a', '#5ae8c8', '#b88aff'] },
    fins: [{ x0: -.2, x1: -.4, h: .2, back: .5, cols: ['#1a3a8a', '#5ae8c8'] }, { kind: 'pec', x: .35, y: .65, len: .8, cols: ['#3a6ad0', '#8af0e0', '#c8a8ff'], alpha: .92 }],
    extra: (c, s, w, f, L, Hh) => GALAXY_DOTS.forEach(([x, y, r], i) => { c.fillStyle = `rgba(230,255,255,${.4 + .6 * Math.sin(T * 2.5 + i)})`; circle(c, x * L * .95, y * Hh * .9 - Hh * .15, r * Hh * .8 + .6); c.fill(); }),
  },
  rainbowwhale: {
    L: 1.35, H: .4, seed: 211, shape: { nose: .85, hump: .35, belly: 1.0, tail: .15 }, top: '#f8f4ff', mid: '#ffffff', belly: '#ffffff', eye: [.64, 0, .05, '#302050'], nx: 10,
    glow: () => `hsl(${(T * 50) % 360},90%,75%)`,
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['#ff6aa8', '#ffb040', '#ffe850', '#50e090', '#50b0ff', '#a070ff'], .85); polyFill(c, [[L * 1.1, Hh * .45], [0, Hh * .6], [-L * 1.1, Hh * .5], [-L * 1.1, Hh * 1.3], [L * 1.1, Hh * 1.3]], 'rgba(255,255,255,0.55)'); },
    under: (c, s, w, f, L, Hh) => {
      const h = (T * 50) % 360; c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      for (const k of [-1, 0, 1]) ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .36 * j, k * s * (.12 + j * .07) + Math.sin(T * 2 + j * .9 + k) * s * .1 * j / 5 + w * s * j * .25]), s * .08, hsl((h + k * 60 + 360) % 360, .9, .72), .8);
      c.restore();
    },
    tail: { type: 'fluke', len: .6, spread: .5, cols: ['#ffb0d8', '#b0d8ff', '#d0b0ff'] },
    fins: [{ kind: 'pec', x: .35, y: .65, len: .7, cols: ['#ffd0f0', '#c0e0ff', '#fff0b0'], alpha: .92 }],
    extra: (c, s, w, f, L, Hh) => { blush(c, L * .72, Hh * .3, s * .06); sparkles(c, s, f, '#ffffff', 6); },
  },
  // ---- 夢幻魚 ----
  phoenix: {
    L: .85, H: .4, seed: 71, top: '#e03a18', mid: '#ff9a2a', belly: '#fff1a0', eye: [.72, -.15, .065, '#2a0800'], glow: '#ff7a1a',
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,230,120,0.5)', 'rgba(255,120,40,0)', 'rgba(220,40,20,0.5)']); for (let i = 0; i < 4; i++) band(c, L, Hh, .3 - i * .35, .04, .25, 'rgba(255,240,160,0.35)'); },
    under: (c, s, w, f, L) => {
      const a0 = c.globalAlpha; c.save(); c.shadowColor = '#ff7a1a'; c.shadowBlur = 16; c.translate(-L + 2, 0); c.rotate(w * .6);
      for (let k = 0; k < 3; k++) {
        c.globalAlpha = a0 * (.92 - k * .2); c.fillStyle = lg3(c, 0, 0, -s * 1.6, 0, '#ffe066', '#ff8a1a', 'rgba(255,40,20,0.7)');
        c.beginPath(); c.moveTo(0, 0); c.lineTo(-s * (.6 + k * .3), -s * (.75 - k * .5) + w * s); c.lineTo(-s * (1.1 + k * .3), -s * (.35 - k * .4) + w * s * 1.4); c.lineTo(-s * (1.5 + k * .15), (k - 1) * s * .55 + w * s * 1.8);
        c.lineTo(-s * (1.0 + k * .2), (k - 1) * s * .25 + w * s); c.lineTo(-s * .4, s * .25); c.closePath(); c.fill();
      }
      c.restore(); c.globalAlpha = a0;
    },
    fins: [{ x0: .4, x1: -.55, h: .75, back: .8, cols: ['#ffcf3a', '#ff8a1a', '#ff4a1a'] }, { dir: 1, x0: .25, x1: -.55, h: .45, back: .8, cols: ['#ffcf3a', '#ff4a1a'] },
      { kind: 'pec', x: .35, y: .35, len: .32, cols: ['#ffdc5a', '#ff6a2a'] }],
    extra: (c, s, w, f, L, Hh) => { c.fillStyle = '#ffe680'; for (let i = 0; i < 3; i++) { c.beginPath(); const x = L * (.62 - i * .15), y = -Hh * 1.0; c.moveTo(x - s * .05, y + s * .05); c.lineTo(x - s * .02 - i * s * .03, y - s * (.28 - i * .04)); c.lineTo(x + s * .05, y + s * .03); c.fill(); } },
  },
  rainbow: {
    L: .7, H: .52, seed: 83, shape: { nose: .45, hump: .05, tail: .3 }, top: '#f2f0ff', mid: '#ffffff', belly: '#ffffff', eye: [.66, -.2, .07, '#1a0a30'], glow: () => `hsl(${(T * 60) % 360},90%,70%)`,
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['#ff7ab0', '#ffb45a', '#ffe45a', '#6ae0a0', '#5ab4ff', '#a07aff'], .9); c.fillStyle = lg(c, Hh * .3, Hh * 1.1, 'rgba(255,255,255,0)', 'rgba(255,255,255,0.45)'); c.fillRect(-L, 0, L * 2, Hh * 1.2); },
    under: (c, s, w, f, L) => {
      const h = (T * 60) % 360; c.save(); c.translate(-L + 2, 0); c.rotate(w * .6); c.lineCap = 'round'; c.lineJoin = 'round';
      for (const k of [-1, 0, 1]) ribbon(c, [0, 1, 2, 3, 4, 5].map(j => [-s * .34 * j, k * s * (.12 + j * .08) + Math.sin(T * 2.2 + j * .9 + k) * s * .12 * j / 5 + w * s * j * .25]), s * .075, hsl((h + k * 60 + 360) % 360, .9, .7), .9);
      c.restore();
    },
    fins: [{ x0: .35, x1: -.5, h: 1.0, back: .55, cols: ['#ff7ab0', '#ffd05a', '#6ae0a0', '#6ab0ff', '#b07aff'], alpha: .9 }, { dir: 1, x0: .3, x1: -.5, h: 1.0, back: .55, cols: ['#b07aff', '#6ab0ff', '#6ae0a0', '#ffd05a', '#ff7ab0'], alpha: .9 },
      { kind: 'pec', x: .25, y: .25, len: .3, cols: ['#ffffff', '#d8c8ff'] }],
  },
  galaxy: {
    L: .9, H: .42, seed: 97, top: '#12083a', mid: '#3f1f8c', belly: '#8a5ad8', eye: [.74, -.15, .065, '#e8d8ff'], glow: '#c46bff',
    paint: (c, L, Hh) => { blob(c, L, Hh, -.2, .25, .55, .8, 'rgba(255,90,200,0.35)', 7); blob(c, L, Hh, .3, -.2, .3, .5, 'rgba(90,200,255,0.25)', 6); },
    tail: { type: 'veil', len: .95, spread: .7, cols: ['#6edcff', '#9a8aff', '#ff5adc'] },
    fins: [{ x0: .2, x1: -.65, h: .55, back: .7, cols: ['#9678ff', '#ff64dc'] }, { kind: 'pec', x: .35, y: .35, len: .3, cols: ['#8cdcff', '#ff64dc'] }],
    extra: (c, s, w, f, L, Hh) => GALAXY_DOTS.forEach(([x, y, r], i) => { c.fillStyle = `rgba(255,255,255,${.45 + .55 * Math.sin(T * 3 + i)})`; circle(c, x * L * .9, y * Hh, r * Hh + .5); c.fill(); }),
  },
  beluga: {
    L: 1.0, H: .42, seed: 111, shape: { nose: .95, hump: .45, belly: 1.0, tail: .22 }, top: '#d8e3ee', mid: '#f4f8fc', belly: '#ffffff', eye: [.66, -.08, .05, '#1a2230'], glow: '#cdeeff',
    paint: (c, L, Hh) => { blob(c, L, Hh, .7, -.45, .25, .4, 'rgba(255,255,255,0.8)', 6); blob(c, L, Hh, -.3, .6, .5, .35, 'rgba(225,240,255,0.7)', 6); },
    tail: { type: 'fork', len: .45, spread: .55, cols: ['#e4ecf4', '#cfdbe8'] },
    fins: [{ kind: 'pec', x: .3, y: .55, len: .38, cols: ['#e8eef6', '#d0dce8'] }],
    extra: (c, s, w, f, L, Hh) => { c.strokeStyle = 'rgba(120,140,170,0.8)'; c.lineWidth = Math.max(1, s * .03); c.lineCap = 'round'; c.beginPath(); c.moveTo(L * .98, Hh * .15); c.quadraticCurveTo(L * .85, Hh * .38, L * .7, Hh * .22); c.stroke(); blush(c, L * .72, Hh * .3, s * .07); },
  },
  moon: {
    L: 1.0, H: .4, seed: 101, shape: { nose: .6, tail: .35 }, top: '#c9d1e6', mid: '#ffffff', belly: '#ffffff', eye: [.76, -.2, .055, '#1a1a40'], glow: '#fff6c0',
    paint: (c, L, Hh) => {
      blob(c, L, Hh, .38, -.35, .3, .75, '#ffcf4a', 9); blob(c, L, Hh, .5, -.58, .28, .72, '#f4f6fc', 9);
      for (let i = 0; i < 4; i++) blob(c, L, Hh, -.1 - i * .2, -.3 + (i % 2) * .35, .06, .15, '#ffcf4a', 5);
    },
    under: (c, s) => { const hg = c.createRadialGradient(0, 0, s * .3, 0, 0, s * 1.7); hg.addColorStop(0, 'rgba(255,240,180,0.35)'); hg.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = hg; ell(c, -s * .2, 0, s * 1.8, s * 1.2); c.fill(); },
    tail: { type: 'veil', len: 1.0, spread: .75, cols: ['#f0f4ff', '#fff0c8', '#ffd88a'], alpha: .92 },
    fins: [{ x0: .2, x1: -.65, h: .25, back: .3, cols: ['#f0f4ff', '#ffe0a0'] }, { kind: 'pec', x: .35, y: .5, len: .5, cols: ['#f5f8ff', '#ffe0a0'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => whisker(c, s, w, L, Hh, 'rgba(210,170,90,0.9)'),
  },
  // ---- 50 種魚改版新增：體型小巧、越後面越夢幻 ----
  sakurabetta: {
    L: .62, H: .3, seed: 301, top: '#ffd6e8', mid: '#fff4f8', belly: '#ffffff', eye: [.7, -.12, .075, '#40102a'],
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['rgba(255,255,255,0)', 'rgba(255,170,205,0.55)', 'rgba(255,120,170,0.7)']);
      for (let i = 0; i < 5; i++) blob(c, L, Hh, .1 - i * .2, -.35 + (i % 2) * .5, .07, .12, 'rgba(255,130,180,0.5)', 5, i);
    },
    under: (c, s) => halo(c, 0, 0, s * 1.3, '#ffb8d8', .35),
    tail: { type: 'veil', len: 1.35, spread: 1.05, cols: ['#fff0f6', '#ffc0da', '#ff8ab8', '#ffd0e4'], alpha: .85 },
    fins: [{ x0: .15, x1: -.85, h: .8, back: 1, cols: ['#ffe4f0', '#ffaacc', '#ff90bc'], alpha: .85 }, { dir: 1, x0: .25, x1: -.85, h: .85, back: 1.1, cols: ['#ffe4f0', '#ffaacc', '#ffc8e0'], alpha: .85 },
      { kind: 'pec', x: .35, y: .35, len: .35, cols: ['#ffffff', '#ffc8dc'], alpha: .85 }],
    // 身邊飄著幾片櫻花花瓣
    extra: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      for (let i = 0; i < 4; i++) {
        const a = T * .8 + i * 1.57 + ph; c.save(); c.translate(-L * 1.4 + Math.cos(a) * s * .6, Math.sin(a * 1.3) * s * .7); c.rotate(T * 2 + i);
        c.fillStyle = i % 2 ? 'rgba(255,190,215,0.95)' : 'rgba(255,225,238,0.95)'; ell(c, 0, 0, s * .08, s * .045); c.fill(); c.restore();
      }
    },
  },
  lunarguppy: {
    L: .55, H: .26, seed: 307, top: '#c8c8f0', mid: '#f4f4ff', belly: '#ffffff', eye: [.72, -.1, .08, '#1a1a40'],
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['rgba(255,240,200,0.6)', 'rgba(220,220,255,0)', 'rgba(170,160,255,0.55)']);
      const r = mulberry(31); for (let i = 0; i < 12; i++) blob(c, L, Hh, -.8 + r() * 1.4, -.6 + r() * 1.2, .04, .07, 'rgba(255,255,255,0.6)', 5, r());
    },
    under: (c, s) => halo(c, 0, 0, s * 1.2, '#fff0c0', .35),
    tail: { type: 'fan', len: 1.45, spread: 1.1, cols: ['#e8e8ff', '#b8b0ff', '#8a90ff', '#fff0c0'], alpha: .88 },
    fins: [{ x0: .1, x1: -.6, h: .45, back: .8, cols: ['#e8e8ff', '#b0a8ff'], alpha: .88 }, { kind: 'pec', x: .35, y: .4, len: .3, cols: ['#ffffff', '#d0c8ff'], alpha: .85 }],
    // 尾巴上閃著一串月光
    extra: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      for (let i = 0; i < 5; i++) { const k = Math.max(0, Math.sin(T * 3 + i * 1.3 + ph)); if (k < .1) continue; c.fillStyle = `rgba(255,245,200,${k})`; star4(c, -L - s * (.35 + .2 * i), Math.sin(i * 2.1) * s * .45 * (i + 1) / 5 + w * s * i * .15, s * .07 * (.5 + k)); }
    },
  },
  opalangel: {
    L: .5, H: .5, seed: 311, shape: { nose: .45, hump: .05, tail: .3 }, top: '#f4e8ff', mid: '#ffffff', belly: '#fff4ec', eye: [.66, -.2, .075, '#2a1a40'],
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['#ffd0e8', '#d0f0ff', '#e8d8ff', '#d8ffe8'], .7);
      for (let i = 0; i < 3; i++) band(c, L, Hh, .45 - i * .45, .06, -.2, 'rgba(255,255,255,0.4)');
    },
    under: (c, s) => halo(c, 0, 0, s * 1.4, '#e8d8ff', .4),
    tail: { type: 'veil', len: .9, spread: .8, cols: ['#ffe0f0', '#e0e8ff', '#e0fff4'], alpha: .85 },
    fins: [{ x0: .3, x1: -.45, h: .9, back: 1.1, cols: ['#ffd8f0', '#d8e8ff', '#d8fff0'], alpha: .85 }, { dir: 1, x0: .3, x1: -.45, h: .9, back: 1.1, cols: ['#d8fff0', '#d8e8ff', '#ffd8f0'], alpha: .85 },
      { kind: 'pec', x: .3, y: .25, len: .3, cols: ['#ffffff', '#f0d8ff'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => { const ph = f ? f.phase * 3 : 0; twinkle(c, L * .2, -Hh * .4, s * .09, ph); twinkle(c, -L * .3, Hh * .2, s * .08, ph + 1); twinkle(c, L * .1, Hh * .5, s * .07, ph + 2); },
  },
  papillon: {
    L: .55, H: .3, seed: 313, top: '#3a2a8a', mid: '#6a5ad8', belly: '#e8e0ff', eye: [.7, -.12, .08, '#10082a'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(120,240,255,0.55)', 'rgba(150,120,255,0)', 'rgba(255,130,230,0.5)']); },
    // 背上和腹下各有一對會拍動的蝴蝶翅膀，翅膀上有眼斑
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0, fl = .55 + .45 * Math.abs(Math.sin(T * 5 + ph)), a0 = c.globalAlpha;
      halo(c, 0, 0, s * 1.4, '#a890ff', .35);
      for (const d of [-1, 1]) {
        c.save(); c.translate(L * .05, d * Hh * .3); c.scale(1, fl); c.globalAlpha = a0 * .9;
        const g = c.createLinearGradient(0, 0, -s * .3, d * s * 1.05); g.addColorStop(0, '#7af0ff'); g.addColorStop(.6, '#9a7aff'); g.addColorStop(1, '#ff8ae8');
        c.fillStyle = g; c.beginPath(); [[0, 0], [s * .25, d * s * .7], [-s * .1, d * s * 1.05], [-s * .45, d * s * .8], [-s * .3, d * s * .2]].forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath(); c.fill();
        polyFill(c, [[-s * .1, 0], [-s * .35, d * s * .25], [-s * .75, d * s * .6], [-s * .6, d * s * .15]], 'rgba(255,150,230,0.85)');
        c.fillStyle = 'rgba(255,255,255,0.9)'; circle(c, -s * .08, d * s * .7, s * .1); c.fill();
        c.fillStyle = '#3a2a8a'; circle(c, -s * .08, d * s * .7, s * .055); c.fill();
        c.restore();
      }
      c.globalAlpha = a0;
    },
    tail: { type: 'round', len: .5, spread: .45, cols: ['#9a7aff', '#ff8ae8'], alpha: .9 },
    fins: [{ kind: 'pec', x: .35, y: .4, len: .3, cols: ['#c8f4ff', '#9a7aff'], alpha: .85 }],
    extra: (c, s, w, f) => sparkles(c, s, f, '#c8f4ff', 4),
  },
  glasssprite: {
    L: .6, H: .32, seed: 317, top: 'rgba(170,230,255,0.5)', mid: 'rgba(230,250,255,0.4)', belly: 'rgba(255,255,255,0.5)', edge: 'rgba(255,255,255,0.75)', eye: [.72, -.12, .075, '#1a3050'],
    paint: (c, L, Hh) => {
      c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(L * .6, 0); c.lineTo(-L * .95, 0); c.stroke();
      for (let i = 0; i < 9; i++) { const x = L * (.45 - i * .16); c.beginPath(); c.moveTo(x, -Hh * .55); c.lineTo(x - L * .06, 0); c.lineTo(x, Hh * .55); c.stroke(); }
    },
    under: (c, s) => halo(c, 0, 0, s * 1.3, '#a8f0ff', .4),
    tail: { type: 'veil', len: 1.0, spread: .8, cols: ['#e0f8ff', '#b0e8ff', '#e8d8ff'], alpha: .55, edge: 'rgba(255,255,255,0.6)' },
    fins: [{ x0: .2, x1: -.7, h: .5, back: .9, cols: ['#e0f8ff', '#c8e0ff'], alpha: .5, edge: 'rgba(255,255,255,0.6)' }, { dir: 1, x0: .1, x1: -.6, h: .4, back: .9, cols: ['#e0f8ff', '#e8d8ff'], alpha: .5 },
      { kind: 'pec', x: .35, y: .4, len: .3, cols: ['#ffffff', '#c8f0ff'], alpha: .6 }],
    // 透明身體裡有一顆會變色的發光核心
    extra: (c, s, w, f, L, Hh) => {
      const h = Math.round((T * 60 + (f ? f.phase * 60 : 0)) / 15) * 15 % 360;
      glowDot(c, L * .12, Hh * .05, s * .32, hsl(h, .9, .7), .95);
      c.fillStyle = 'rgba(255,255,255,0.9)'; circle(c, L * .12, Hh * .05, s * .06); c.fill();
    },
  },
  lanternfish: {
    L: .6, H: .34, seed: 319, shape: { nose: .7, hump: .3 }, top: '#101a4a', mid: '#243a8a', belly: '#5a7ad0', eye: [.7, -.15, .085, '#e8f8ff'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['rgba(90,220,255,0.35)', 'rgba(60,80,200,0)', 'rgba(150,90,255,0.4)']),
    tail: { type: 'fork', len: .5, spread: .5, cols: ['#243a8a', '#5ae8ff'], alpha: .92 },
    fins: [{ x0: .1, x1: -.5, h: .35, back: .6, cols: ['#243a8a', '#5ae8ff'] }, { kind: 'pec', x: .35, y: .45, len: .3, cols: ['#5a7ad0', '#8af0ff'] }],
    // 身上一排會閃的發光點，頭上提著一盞小燈
    extra: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      for (let i = 0; i < 8; i++) {
        const x = L * (.5 - i * .2), y = Hh * (.55 - Math.abs(i - 3.5) * .03), k = .55 + .45 * Math.sin(T * 3 - i * .7 + ph), col = i % 2 ? '#8af0ff' : '#ffe890';
        halo(c, x, y, s * .12, col, k); c.fillStyle = css(hex(col), .6 + .4 * k); circle(c, x, y, s * .025); c.fill();
      }
      const bx = L * 1.3, by = -Hh * 1.45 + Math.sin(T * 2 + ph) * s * .04;
      c.strokeStyle = 'rgba(120,160,255,0.9)'; c.lineWidth = Math.max(1, s * .025); c.beginPath(); c.moveTo(L * .55, -Hh * .85); c.quadraticCurveTo(L * .9, -Hh * 1.9, bx, by); c.stroke();
      halo(c, bx, by, s * .4, '#ffe890', .75 + .25 * Math.sin(T * 4 + ph)); c.fillStyle = '#fffbe0'; circle(c, bx, by, s * .07); c.fill();
    },
  },
  peacockfish: {
    L: .6, H: .32, seed: 323, top: '#0a6a6a', mid: '#1ab0a0', belly: '#c8fff0', eye: [.72, -.12, .08, '#082020'],
    paint: (c, L, Hh) => {
      hGrad(c, L, Hh, ['rgba(255,220,90,0.5)', 'rgba(40,200,255,0.3)', 'rgba(20,90,200,0.5)']);
      const r = mulberry(47); for (let i = 0; i < 14; i++) blob(c, L, Hh, -.8 + r() * 1.5, -.6 + r() * 1.1, .05, .08, 'rgba(255,230,120,0.45)', 6, r());
    },
    // 像孔雀開屏的尾羽，每根羽毛末端有一顆眼斑
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; c.save(); c.translate(-L + 2, 0); c.rotate(w * .6);
      c.lineCap = 'round';
      for (let i = 0; i < 7; i++) {
        const a = Math.PI + (i - 3) * .28 + Math.sin(T * 2 + i + ph) * .05, len = s * (1.05 + (3 - Math.abs(i - 3)) * .08), x = Math.cos(a) * len, y = Math.sin(a) * len;
        c.strokeStyle = 'rgba(140,240,210,0.85)'; c.lineWidth = Math.max(1, s * .035); c.beginPath(); c.moveTo(0, 0); c.lineTo(x, y); c.stroke();
        polyFill(c, [[x * .35, y * .35 - s * .05], [x * .95, y * .95 - s * .1], [x * .95, y * .95 + s * .1], [x * .35, y * .35 + s * .05]], 'rgba(40,200,170,0.55)');
        c.fillStyle = '#1ad0a0'; ell(c, x, y, s * .15, s * .11, a); c.fill();
        c.fillStyle = '#ffd84a'; ell(c, x, y, s * .105, s * .08, a); c.fill();
        c.fillStyle = '#2a4ad8'; ell(c, x, y, s * .065, s * .05, a); c.fill();
        c.fillStyle = '#0a1a4a'; ell(c, x, y, s * .03, s * .025, a); c.fill();
      }
      c.restore();
    },
    fins: [{ x0: .1, x1: -.5, h: .4, back: .6, cols: ['#1ab0a0', '#ffd84a'] }, { kind: 'pec', x: .35, y: .45, len: .3, cols: ['#c8fff0', '#1ab0a0'] }],
    extra: (c, s, w, f, L, Hh) => {
      c.strokeStyle = 'rgba(140,240,210,0.9)'; c.lineWidth = Math.max(1, s * .02);
      for (let k = 0; k < 3; k++) { const x0 = L * (.45 + k * .1), x1 = x0 - s * .12 + k * s * .06, y1 = -Hh * 1.05 - s * (.28 - k * .04); c.beginPath(); c.moveTo(x0, -Hh * .8); c.lineTo(x1, y1); c.stroke(); c.fillStyle = '#ffd84a'; circle(c, x1, y1, s * .035); c.fill(); }
    },
  },
  rainbowveil: {
    L: .58, H: .3, seed: 331, top: '#ffffff', mid: '#fff8fc', belly: '#ffffff', eye: [.72, -.12, .075, '#301040'],
    paint: (c, L, Hh) => hGrad(c, L, Hh, ['#ffb0d0', '#ffe0a0', '#b0f0c0', '#a0d0ff', '#d0b0ff'], .6),
    // 身後拖著四條顏色流轉的彩綾
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0, h = T * 40; c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      for (let k = 0; k < 4; k++) ribbon(c, [0, 1, 2, 3, 4].map(j => [-s * .42 * j, (k - 1.5) * s * (.06 + j * .07) + Math.sin(T * 2 + j * .9 + k + ph) * s * .1 * j / 4 + w * s * j * .25]), s * .06, hsl(Math.round((h + k * 80) / 10) * 10 % 360, .9, .72), .8);
      c.restore();
    },
    tail: { type: 'veil', len: 1.25, spread: 1.05, cols: ['#ffc8e0', '#fff0b0', '#c0f0d0', '#b8d8ff', '#e0c8ff'], alpha: .8 },
    fins: [{ x0: .15, x1: -.85, h: .75, back: 1, cols: ['#ffc8e0', '#fff0b0', '#c0f0d0'], alpha: .8 }, { dir: 1, x0: .25, x1: -.85, h: .8, back: 1.1, cols: ['#b8d8ff', '#e0c8ff', '#ffc8e0'], alpha: .8 },
      { kind: 'pec', x: .35, y: .35, len: .32, cols: ['#ffffff', '#ffd8f0'], alpha: .85 }],
    extra: (c, s, w, f) => sparkles(c, s, f, '#ffffff', 4),
  },
  starsprite: {
    L: .55, H: .3, seed: 337, top: '#1a0a4a', mid: '#4a2aa8', belly: '#a88aff', eye: [.72, -.12, .08, '#f0e8ff'],
    paint: (c, L, Hh) => { blob(c, L, Hh, -.2, .2, .5, .7, 'rgba(255,90,200,0.35)', 7); blob(c, L, Hh, .3, -.2, .3, .5, 'rgba(90,220,255,0.3)', 6); },
    under: (c, s) => halo(c, 0, 0, s * 1.4, '#b890ff', .45),
    tail: { type: 'veil', len: 1.2, spread: .95, cols: ['#4a2aa8', '#8a6aff', '#ff9ae8', '#fff0ff'], alpha: .85 },
    fins: [{ x0: .15, x1: -.7, h: .6, back: .9, cols: ['#6a4ad8', '#ff9ae8'], alpha: .85 }, { dir: 1, x0: .2, x1: -.6, h: .5, back: .9, cols: ['#6a4ad8', '#8af0ff'], alpha: .85 },
      { kind: 'pec', x: .35, y: .4, len: .3, cols: ['#c8b8ff', '#ff9ae8'] }],
    // 身上有星空，頭頂一圈小光環，尾巴灑出星塵
    extra: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0;
      GALAXY_DOTS.forEach(([x, y, r], i) => { if (i % 2) return; c.fillStyle = `rgba(255,255,255,${.45 + .55 * Math.sin(T * 3 + i)})`; circle(c, x * L * .9, y * Hh, r * Hh + .5); c.fill(); });
      c.strokeStyle = 'rgba(255,230,140,0.95)'; c.lineWidth = Math.max(1.2, s * .035); ell(c, L * .4, -Hh * 1.6 + Math.sin(T * 2 + ph) * s * .03, s * .17, s * .05); c.stroke();
      for (let i = 0; i < 6; i++) { const q = (T * .6 + i / 6 + ph) % 1; c.fillStyle = `rgba(255,244,192,${1 - q})`; star4(c, -L - s * (.3 + q * 1.4), Math.sin(i * 2.3 + T) * s * .35 * q, s * .08 * (1 - q * .5)); }
    },
  },
  phoenixfairy: {
    L: .62, H: .3, seed: 347, top: '#fff4d8', mid: '#ffffff', belly: '#ffffff', eye: [.72, -.12, .075, '#401020'],
    paint: (c, L, Hh) => { hGrad(c, L, Hh, ['rgba(255,200,90,0.65)', 'rgba(255,160,200,0.35)', 'rgba(190,140,255,0.55)']); for (let i = 0; i < 4; i++) band(c, L, Hh, .35 - i * .3, .025, .25, 'rgba(255,215,110,0.5)'); },
    // 金色光暈＋三條長長的鳳凰尾羽，羽尖有眼斑
    under: (c, s, w, f, L) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 1.6, '#ffd87a', .45);
      c.save(); c.translate(-L + 2, 0); c.rotate(w * .5);
      [['#ffd860', '#ff8ab8'], ['#ff9ac8', '#c890ff'], ['#c8a0ff', '#ffd860']].forEach(([col, eye], k) => {
        const pts = [0, 1, 2, 3, 4, 5, 6].map(j => [-s * .3 * j, (k - 1) * s * (.05 + j * .08) + Math.sin(T * 1.8 + j * .8 + k * 1.7 + ph) * s * .12 * j / 6 + w * s * j * .25]);
        ribbon(c, pts, s * .11, col, .85);
        const [ex, ey] = pts[6]; c.fillStyle = css(hex(col), .95); ell(c, ex, ey, s * .12, s * .08); c.fill(); c.fillStyle = eye; ell(c, ex, ey, s * .07, s * .045); c.fill(); c.fillStyle = '#ffffff'; circle(c, ex, ey, s * .025); c.fill();
      });
      c.restore();
    },
    tail: { type: 'fan', len: .9, spread: .8, cols: ['#fff0b0', '#ffb8d8', '#c8a8ff'], alpha: .9 },
    fins: [{ x0: .2, x1: -.7, h: .7, back: .9, cols: ['#ffe8a0', '#ffb0d0', '#c0a0ff'], alpha: .85 }, { dir: 1, x0: .25, x1: -.6, h: .55, back: .9, cols: ['#ffe8a0', '#ffb0d0'], alpha: .85 },
      { kind: 'pec', x: .35, y: .35, len: .34, cols: ['#ffffff', '#ffd8a0'], alpha: .9 }],
    extra: (c, s, w, f, L, Hh) => {
      for (let k = 0; k < 3; k++) {
        const x0 = L * (.5 - k * .1), tip = [x0 - s * (.2 + k * .06), -Hh - s * (.42 - k * .08) + Math.sin(T * 3 + k) * s * .03];
        c.strokeStyle = 'rgba(255,215,110,0.95)'; c.lineWidth = Math.max(1, s * .025); c.beginPath(); c.moveTo(x0, -Hh * .85); c.quadraticCurveTo(x0 + s * .05, tip[1] + s * .1, tip[0], tip[1]); c.stroke();
        c.fillStyle = ['#ff8ab8', '#ffd860', '#c890ff'][k]; circle(c, tip[0], tip[1], s * .045); c.fill();
      }
      sparkles(c, s, f, '#fff0b0', 5);
    },
  },
  // ---- 新夢幻魚：天河錦鯉 ----
  skykoi: {
    L: .95, H: .36, seed: 353, shape: { nose: .6, tail: .3 }, top: '#ffffff', mid: '#ffffff', belly: '#ffffff', eye: [.76, -.18, .055, '#2a0a10'],
    paint: (c, L, Hh) => {
      blob(c, L, Hh, .45, -.4, .28, .6, '#ff5a3a', 9); blob(c, L, Hh, -.15, -.55, .3, .5, '#ff7a3a', 8); blob(c, L, Hh, -.6, -.2, .18, .45, '#ffc830', 7);
      blob(c, L, Hh, .05, .1, .12, .3, '#ffd860', 6); hGrad(c, L, Hh, ['rgba(255,255,255,0)', 'rgba(200,220,255,0.3)', 'rgba(230,200,255,0.45)']);
    },
    // 身後兩條天河彩帶，再灑出一路星塵
    under: (c, s, w, f, L, Hh) => {
      const ph = f ? f.phase : 0; halo(c, 0, 0, s * 1.8, '#ffe8b0', .45);
      c.save(); c.translate(-L * .2, 0); c.rotate(w * .5);
      [['#8ae8ff', -1], ['#d0a0ff', 1]].forEach(([col, d], k) => ribbon(c, [0, 1, 2, 3, 4, 5, 6].map(j => [-s * .4 * j, d * s * (.2 + j * .1) + Math.sin(T * 1.6 + j * .8 + k * 2 + ph) * s * .12 * j / 6 + w * s * j * .3]), s * .09, col, .75));
      for (let i = 0; i < 8; i++) { const q = (T * .5 + i / 8 + ph) % 1; c.fillStyle = `rgba(255,248,210,${1 - q})`; star4(c, -s * (.6 + q * 2.2), Math.sin(i * 2.7 + T * .8) * s * .5 * q, s * .08 * (1 - q * .4)); }
      c.restore();
    },
    tail: { type: 'veil', len: 1.45, spread: 1.15, cols: ['#ffffff', '#ffd8e8', '#c8e0ff', '#e8d0ff'], alpha: .85 },
    fins: [{ x0: .3, x1: -.7, h: .55, back: .9, cols: ['#ffffff', '#ffd0c0', '#e0d0ff'], alpha: .85 }, { kind: 'pec', x: .4, y: .5, len: .6, cols: ['#ffffff', '#ffe0d8', '#d8e8ff'], alpha: .85 }],
    extra: (c, s, w, f, L, Hh) => {
      whisker(c, s, w, L, Hh, 'rgba(255,215,110,0.95)');
      const a = T * 1.5 + (f ? f.phase : 0); c.fillStyle = '#fff4b0'; star4(c, Math.cos(a) * s * 1.1, Math.sin(a) * s * .7, s * .1);
      sparkles(c, s, f, '#ffffff', 6);
    },
  },
};
for (const id in MODELS) MODELS[id].id = id;
