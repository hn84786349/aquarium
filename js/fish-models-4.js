// 第 86～100 種魚的外觀設定（fish-models-4.js）
// 一樣用 fish-models-3.js 的「夢幻魚模板」dreamModel 組出來，這批補在錦鯉、星月、小型魚等魚比較少的系列
Object.assign(MODELS, {
  // 小型魚家族
  pearlguppy:   dreamModel({ seed: 561, c: ['#e8e0f0', '#fff8fc', '#ffffff'], fin: ['#ffe8f4', '#e8d8ff', '#d8f0ff'], glow: '#fff0f8', pattern: 'scales', pc: 'rgba(255,255,255,0.6)', acc: ['bubbles', 'twinkle'] }),
  candytetra:   dreamModel({ seed: 563, c: ['#ff9ac8', '#ffd0e8', '#fff8fc'], fin: ['#ffb8dc', '#b8e8ff', '#fff0a8'], glow: '#ffd8ec', pattern: 'band', pc: 'rgba(140,220,255,0.75)', tail: 'fork', acc: ['sparkle'], spark: '#fff4fa' }),
  rainbowtetra: dreamModel({ seed: 565, c: ['#a8c8ff', '#f0f4ff', '#ffffff'], fin: ['#ffb0c8', '#ffe0a0', '#b0f0c8', '#b0d0ff', '#d8b8ff'], glow: '#e8e0ff', sheen: ['#ffb0c8', '#ffe8a0', '#b8f0d0', '#b0d0ff', '#d8b8ff'], tail: 'fork', acc: ['ribbons', 'sparkle'], rib: ['#ffb0c8', '#b0f0c8', '#b0d0ff'] }),
  // 錦鯉家族
  sakurakoi:    dreamModel({ seed: 567, koi: true, L: .6, H: .28, c: ['#fff0f4', '#ffffff', '#fffafc'], fin: ['#ffe0ec', '#ffb8d0', '#ffffff'], glow: '#ffd8e8', pattern: 'spots', pc: 'rgba(255,140,180,0.75)', acc: ['petals'], petal: '#ffc0d8', whisker: 'rgba(255,200,220,0.9)' }),
  moonkoi:      dreamModel({ seed: 569, koi: true, L: .62, H: .28, c: ['#c0c8e8', '#f0f4ff', '#ffffff'], fin: ['#e8ecff', '#b8c4f0', '#fff4d0'], glow: '#e0e8ff', pattern: 'scales', pc: 'rgba(255,255,255,0.5)', acc: ['orb', 'twinkle'], orb: '#fff4c8', whisker: 'rgba(255,245,200,0.9)' }),
  goldkoi:      dreamModel({ seed: 571, koi: true, L: .62, H: .29, c: ['#e8a020', '#ffd050', '#fff4c0'], fin: ['#ffe080', '#ffb840', '#fff8d8'], glow: '#ffe070', sheen: ['rgba(255,255,220,0.6)', 'rgba(255,200,80,0)', 'rgba(255,240,170,0.6)'], pattern: 'scales', pc: 'rgba(255,250,200,0.65)', acc: ['crown', 'sparkle'], crown: '#fff4b0', spark: '#fffbe0', whisker: 'rgba(255,250,200,0.95)' }),
  rainbowkoi:   dreamModel({ seed: 573, koi: true, L: .64, H: .29, c: ['#ffffff', '#fffafa', '#ffffff'], fin: ['#ffb0c8', '#ffe0a0', '#b0f0c8', '#a8d0ff', '#d0b0ff'], glow: '#ffe8f8', sheen: ['#ffb8cc', '#ffe8a8', '#c0f4d0', '#b0d8ff', '#dcc0ff'], pattern: 'flecks', pc: 'rgba(255,255,255,0.85)', long: true, acc: ['ribbons', 'sparkle'], rib: ['#ffb0c8', '#ffe0a0', '#b0f0c8', '#b0c8ff'], spark: '#ffffff' }),
  // 星月精靈
  crescentfin:  dreamModel({ seed: 575, c: ['#3a4890', '#7080d0', '#d8e0ff'], fin: ['#a8b8ff', '#e0e4ff', '#fff4c8'], glow: '#b8c4ff', pattern: 'stars', long: true, acc: ['ring', 'twinkle'] }),
  meteorfin:    dreamModel({ seed: 577, c: ['#20285a', '#4058a8', '#a8c0ff'], fin: ['#8aa8ff', '#e8f0ff', '#ffd8a0'], glow: '#90a8ff', pattern: 'stars', tail: 'fork', tl: .75, acc: ['ribbons', 'sparkle'], rib: ['#ffe8a8', '#c8d8ff'], spark: '#fff8d8' }),
  nebulaveil:   dreamModel({ seed: 579, c: ['#3a1a70', '#7a48c0', '#e0c8ff'], fin: ['#c8a0ff', '#ff9ad8', '#8ad0ff', '#fff0d0'], glow: '#c8a0ff', sheen: ['rgba(255,140,220,0.5)', 'rgba(140,200,255,0.4)', 'rgba(200,160,255,0.5)'], pattern: 'stars', long: true, acc: ['ribbons', 'orb'], rib: ['#ff9ad8', '#8ad0ff', '#c8a0ff'], orb: '#ffe8ff' }),
  polaris:      dreamModel({ seed: 581, shape: 'angel', c: ['#1a2060', '#4a5cb0', '#e8ecff'], fin: ['#c8d4ff', '#ffffff', '#fff0b0', '#a8b8ff'], glow: '#d0d8ff', pattern: 'stars', pc: 'rgba(255,248,200,0.95)', long: true, acc: ['crown', 'antenna', 'sparkle'], crown: '#fff4c0', orb: '#fffbe8', spark: '#fff8d0' }),
  // 花與自然精靈
  lilybell:     dreamModel({ seed: 583, shape: 'round', c: ['#d8f0d8', '#f4fff4', '#ffffff'], fin: ['#ffffff', '#e0f8e8', '#fff8d8'], glow: '#e8ffe8', pattern: 'flecks', pc: 'rgba(255,255,255,0.8)', acc: ['petals', 'wings'], petal: '#ffffff', wing: '#f4fff4' }),
  dandelionfin: dreamModel({ seed: 585, c: ['#f8e070', '#fff4b8', '#fffbe8'], fin: ['#fffbe8', '#ffffff', '#fff0a0'], glow: '#fff4c0', pattern: 'flecks', pc: 'rgba(255,255,255,0.9)', long: true, acc: ['bubbles', 'petals'], petal: '#ffffff' }),
  // 鬥魚家族
  sunsetbetta:  dreamModel({ seed: 587, c: ['#e85a7a', '#ff9a8a', '#ffd8b0'], fin: ['#ff7a9a', '#ffb070', '#ffe0a0', '#c8a0ff'], glow: '#ffb8a0', sheen: ['rgba(255,200,120,0.5)', 'rgba(255,120,160,0.3)', 'rgba(200,160,255,0.5)'], long: true, tl: 1.35, ts: 1.1, acc: ['sparkle'], spark: '#fff0d8' }),
  // 寶石與鳳凰
  amethyst:     dreamModel({ seed: 589, shape: 'angel', c: ['#6a3ab0', '#a878e8', '#f0e0ff'], fin: ['#c8a0ff', '#e8d8ff', '#ffffff', '#b080f0'], glow: '#d0b0ff', sheen: ['rgba(255,255,255,0.5)', 'rgba(180,120,255,0)', 'rgba(240,220,255,0.6)'], pattern: 'scales', pc: 'rgba(255,240,255,0.45)', long: true, acc: ['orb', 'twinkle', 'sparkle'], orb: '#f0d8ff', spark: '#f8f0ff' }),
});
for (const id of ['pearlguppy', 'candytetra', 'rainbowtetra', 'sakurakoi', 'moonkoi', 'goldkoi', 'rainbowkoi', 'crescentfin', 'meteorfin', 'nebulaveil', 'polaris', 'lilybell', 'dandelionfin', 'sunsetbetta', 'amethyst']) MODELS[id].id = id;
