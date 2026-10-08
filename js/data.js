// 遊戲資料：寶物、魚種、夢幻魚、飼料、背景（data.js）
// ====== 遊戲資料 ======
const TREASURE = {
  bubble:  { icon: '🫧', name: '泡泡珠',   value: 2 },
  coin:    { icon: '🔹', name: '海玻璃',   value: 5 },
  shell:   { icon: '🐚', name: '貝殼',     value: 12 },
  pearl:   { icon: '🦪', name: '珍珠貝',   value: 30 },
  crystal: { icon: '🔮', name: '水晶球',   value: 75 },
  crown:   { icon: '👑', name: '皇冠',     value: 200 },
  diamond: { icon: '💎', name: '鑽石',     value: 500 },
  vase:    { icon: '🏺', name: '古董花瓶', value: 1200 },
  gold:    { icon: '💍', name: '寶石戒指', value: 3000 },
  relic:   { icon: '🏆', name: '傳說寶杯', value: 8000 },
  key:     { icon: '🗝️', name: '黃金鑰匙', value: 20000 },
  trident: { icon: '🔱', name: '海神三叉戟', value: 60000 },
  orb:     { icon: '🔮', name: '龍宮寶珠', value: 150000 },
  starstone: { icon: '🌟', name: '星辰寶石', value: 400000 },
  heart:   { icon: '💖', name: '海洋之心', value: 1000000 },
  // 節日寶物（價值依掉落的魚另外計算）
  redpacket: { icon: '🧧', name: '紅包', value: 1 },
  mooncake:  { icon: '🥮', name: '月餅', value: 1 },
  bouquet:   { icon: '💐', name: '花束', value: 1 },
  xmasgift:  { icon: '🎁', name: '聖誕禮物', value: 1 },
};
const avgTreasure = pool => pool.reduce((a, [t, w]) => a + TREASURE[t].value * w, 0) / pool.reduce((a, p) => a + p[1], 0);

// 用 MODELS 裡的設定畫魚
function mdl(id) { return (c, s, w, e, f) => drawModel(c, s, w, e, f, MODELS[id]); }
// 100 種魚（包含海龜、海豚、鯨魚等海洋生物），越後面越華麗夢幻；第 41 種起是體型小巧的夢幻魚，第 51 種起游過去會留下淡淡的痕跡（trail）；價格、產值、成長、繁殖等數值由 tierStats 自動計算
const SPECIES = [
  { id: 'guppy',      name: '孔雀魚',       size: 20, desc: '入門好養，繁殖快速', draw: drawGuppy },
  { id: 'neon',       name: '霓虹燈魚',     size: 18, desc: '身上的藍光閃閃發亮', draw: drawNeon },
  { id: 'goldfish',   name: '琉金',         size: 22, desc: '圓滾滾的身體配上飄逸大尾巴', draw: mdl('goldfish') },
  { id: 'clown',      name: '小丑魚',       size: 24, desc: '活潑可愛的人氣王', draw: drawClown },
  { id: 'puffer',     name: '河豚',         size: 20, desc: '緊張時會鼓成一顆刺刺球', draw: mdl('puffer') },
  { id: 'blueclown',  name: '藍色小丑魚',   size: 24, desc: '少見的藍色小丑魚', draw: draw_blueclown },
  { id: 'jewel',      name: '寶石魔',       size: 22, desc: '深藍身上撒滿亮藍色寶石', draw: draw_jewel },
  { id: 'boxfish',    name: '黃金箱魨',     size: 19, desc: '方方正正的黃色小盒子', draw: mdl('boxfish') },
  { id: 'dottyback',  name: '蘭花擬雀鯛',   size: 22, desc: '像蘭花一樣的粉紫色', draw: draw_dottyback },
  { id: 'butterfly',  name: '月眉蝶',       size: 22, desc: '戴著黑色眼罩的黃色蝴蝶魚', draw: mdl('butterfly') },
  { id: 'snowclown',  name: '雪花小丑魚',   size: 25, desc: '條紋像雪花一樣不規則', draw: draw_snowclown },
  { id: 'clowntang',  name: '紋刺尾魚',     size: 26, desc: '黃色身體配上藍色條紋', draw: draw_clowntang },
  { id: 'seahorse',   name: '海馬',         size: 24, desc: '直立著慢慢游的海中小馬', draw: drawSeahorse },
  { id: 'angel',      name: '神仙魚',       size: 28, desc: '優雅的長鰭貴族', draw: drawAngel },
  { id: 'mandarin',   name: '青蛙魚',       size: 21, desc: '全身布滿迷幻的彩色花紋', draw: mdl('mandarin') },
  { id: 'peppermint', name: '紅薄荷神仙魚', size: 24, desc: '紅白條紋像薄荷糖', draw: draw_peppermint },
  { id: 'emperor',    name: '皇帝神仙魚',   size: 28, desc: '藍底黃線，神仙魚中的皇帝', draw: mdl('emperor') },
  { id: 'bluetang',   name: '藍倒吊',       size: 28, desc: '寶藍色身體、黃色尾巴', draw: draw_bluetang },
  { id: 'lionfish',   name: '獅子魚',       size: 28, desc: '張開華麗的羽毛狀魚鰭', draw: mdl('lionfish') },
  { id: 'betta',      name: '鬥魚',         size: 26, desc: '華麗飄逸的大尾巴', draw: drawBetta },
  { id: 'turtle',     name: '海龜',         size: 34, desc: '慢慢划水的長壽象徵', draw: drawTurtle },
  { id: 'parrot',     name: '鸚哥魚',       size: 30, desc: '額頭圓鼓鼓的溫和大魚', draw: draw_parrot },
  { id: 'grouper',    name: '豹石斑',       size: 30, desc: '白底黑點像小豹子', draw: draw_grouper },
  { id: 'sunfish',    name: '翻車魚',       size: 32, desc: '圓圓扁扁、呆萌的大魚', draw: mdl('sunfish') },
  { id: 'moorish',    name: '鐮魚',         size: 30, desc: '拖著長長的背鰭絲', draw: draw_moorish },
  { id: 'french',     name: '法國神仙魚',   size: 30, desc: '黑色身體鑲著金邊', draw: draw_french },
  { id: 'seaangel',   name: '海天使',       size: 32, desc: '透明身體裡有一顆發光的心', draw: drawSeaAngel },
  { id: 'queen',      name: '紫后神仙魚',   size: 30, desc: '紫色漸層到橘色的女王', draw: draw_queen },
  { id: 'dolphin',    name: '海豚',         size: 34, desc: '聰明又愛笑的海洋精靈', draw: mdl('dolphin') },
  { id: 'arowana',    name: '金龍魚',       size: 34, desc: '招財納福的風水魚', draw: drawArowana },
  { id: 'sailfish',   name: '旗魚',         size: 32, desc: '背上揚起一面藍色大帆', draw: mdl('sailfish') },
  { id: 'mahi',       name: '鬼頭刀',       size: 32, desc: '大海裡閃耀的綠金色', draw: draw_mahi },
  { id: 'koi',        name: '錦鯉',         size: 34, desc: '帶來好運的傳說之魚', draw: drawKoi },
  { id: 'orca',       name: '虎鯨',         size: 38, desc: '黑白分明的海洋霸主', draw: mdl('orca') },
  { id: 'whaleshark', name: '鯨鯊',         size: 40, desc: '溫柔的巨人，身上滿是星點', draw: mdl('whaleshark') },
  { id: 'oarfish',    name: '皇帶魚',       size: 30, desc: '傳說中的銀色海龍', draw: drawOarfish },
  { id: 'humpback',   name: '座頭鯨',       size: 40, desc: '會唱歌的大鯨魚', draw: mdl('humpback') },
  { id: 'fairybetta', name: '仙羽鬥魚',     size: 32, desc: '如仙女羽衣般的夢幻長鰭', draw: mdl('fairybetta') },
  { id: 'narwhal',    name: '星光獨角鯨',   size: 38, desc: '頭上閃耀著星光長角', draw: mdl('narwhal') },
  { id: 'aurorawhale', name: '極光鯨',      size: 42, desc: '身上流動著極光的神話之鯨', draw: mdl('aurorawhale') },
  { id: 'sakurabetta', name: '櫻吹雪鬥魚',  size: 24, desc: '游過的地方飄著櫻花花瓣', draw: mdl('sakurabetta') },
  { id: 'lunarguppy',  name: '月華孔雀魚',  size: 22, desc: '大尾巴上閃著一串月光', draw: mdl('lunarguppy') },
  { id: 'opalangel',   name: '蛋白石神仙魚', size: 25, desc: '像蛋白石一樣泛著柔和的虹彩', draw: mdl('opalangel') },
  { id: 'papillon',    name: '蝶翼仙魚',    size: 23, desc: '背上長著會拍動的蝴蝶翅膀', draw: mdl('papillon') },
  { id: 'glasssprite', name: '琉璃精靈魚',  size: 23, desc: '透明身體裡有一顆變色的光', draw: mdl('glasssprite') },
  { id: 'lanternfish', name: '星燈魚',      size: 23, desc: '提著小燈、身上一排星光', draw: mdl('lanternfish') },
  { id: 'peacockfish', name: '孔雀仙鰭魚',  size: 24, desc: '尾巴像孔雀開屏一樣華麗', draw: mdl('peacockfish') },
  { id: 'rainbowveil', name: '虹綾鬥魚',    size: 25, desc: '拖著四條顏色流轉的彩綾', draw: mdl('rainbowveil') },
  { id: 'starsprite',  name: '星辰仙子魚',  size: 24, desc: '頭頂光環、一路灑下星塵', draw: mdl('starsprite') },
  { id: 'phoenixfairy', name: '鳳羽仙魚',   size: 26, desc: '金色光暈中搖曳著鳳凰尾羽', draw: mdl('phoenixfairy') },
  { id: 'dewdrop',      name: '露珠精靈魚', size: 20, trail: '#c8f4ff', desc: '像一顆透明的露珠，閃著淡淡虹光', draw: mdl('dewdrop') },
  { id: 'moonmoth',     name: '月蛾魚',     size: 21, trail: '#c8f4d8', desc: '背上一對淡綠色的月蛾翅膀', draw: mdl('moonmoth') },
  { id: 'snowflake',    name: '雪晶鬥魚',   size: 23, trail: '#e0f0ff', desc: '白色長紗上印著雪花', draw: mdl('snowflake') },
  { id: 'blossomkoi',   name: '花瓣小錦鯉', size: 22, trail: '#ffc8d8', desc: '鰭像花瓣一樣柔軟的迷你錦鯉', draw: mdl('blossomkoi') },
  { id: 'aurorafin',    name: '極光綾鰭魚', size: 23, trail: '#8af0d8', desc: '身後飄著兩條會變色的極光綾帶', draw: mdl('aurorafin') },
  { id: 'honeyfairy',   name: '蜜糖仙子魚', size: 20, trail: '#ffe090', desc: '金黃色的小身體，背上有透明小翅膀', draw: mdl('honeyfairy') },
  { id: 'mermaidfin',   name: '人魚紗魚',   size: 23, trail: '#c8fff0', desc: '拖著像人魚一樣的長尾紗', draw: mdl('mermaidfin') },
  { id: 'starlitbetta', name: '星紗鬥魚',   size: 23, trail: '#b8c0ff', desc: '深藍長紗上的星星一閃一閃', draw: mdl('starlitbetta') },
  { id: 'rosequartz',   name: '粉晶魚',     size: 21, trail: '#ffc0e0', desc: '像粉紅水晶一樣的切面身體', draw: mdl('rosequartz') },
  { id: 'cloudfish',    name: '雲朵棉花魚', size: 21, trail: '#ffffff', desc: '身邊圍著一圈棉花般的小雲朵', draw: mdl('cloudfish') },
  { id: 'rainbowguppy', name: '霓彩孔雀魚', size: 21, trail: '#e0d0ff', desc: '大扇尾的顏色像彩虹一樣流轉', draw: mdl('rainbowguppy') },
  { id: 'celestia',     name: '星宿仙鰭魚', size: 23, trail: '#c8b8ff', desc: '身上畫著閃亮的星座', draw: mdl('celestia') },
  { id: 'sunbird',      name: '旭日鳳尾魚', size: 23, trail: '#ffd090', desc: '像日出一樣的暖色長尾', draw: mdl('sunbird') },
  { id: 'mermaidangel', name: '珍珠天使魚', size: 24, trail: '#fff0f8', desc: '珍珠白的身體，長鰭像天使的翅膀', draw: mdl('mermaidangel') },
  { id: 'galaxyangel',  name: '銀河天使魚', size: 25, trail: '#d0b8ff', desc: '身體裡藏著銀河，頭頂有淡金色光環', draw: mdl('galaxyangel') },
  // 第 66～85 種（外觀在 fish-models-3.js）
  { id: 'mistveil',      name: '霧紗仙魚',     size: 22, trail: '#e8e0f8', desc: '像晨霧一樣朦朧的長紗', draw: mdl('mistveil') },
  { id: 'lilyfin',       name: '百合鰭魚',     size: 22, trail: '#fff4d0', desc: '鰭像百合花瓣，身邊飄著白色花瓣', draw: mdl('lilyfin') },
  { id: 'jadekoi',       name: '翡翠小錦鯉',   size: 23, trail: '#c8f4d8', desc: '白底配上翡翠綠的花紋', draw: mdl('jadekoi') },
  { id: 'twilightbetta', name: '暮光鬥魚',     size: 23, trail: '#e0a0c0', desc: '從夕陽橘漸變到夜空紫的長紗', draw: mdl('twilightbetta') },
  { id: 'bubblepuff',    name: '泡泡糖河豚',   size: 20, trail: '#ffd0e8', desc: '圓滾滾的粉紅色，會冒出小泡泡', draw: mdl('bubblepuff') },
  { id: 'feathertail',   name: '羽尾仙魚',     size: 22, trail: '#c8f0ff', desc: '拖著三條像羽毛一樣的彩帶', draw: mdl('feathertail') },
  { id: 'lavenderangel', name: '薰衣草神仙魚', size: 24, trail: '#e0d0ff', desc: '淡紫色的優雅長鰭', draw: mdl('lavenderangel') },
  { id: 'prismtetra',    name: '稜光燈魚',     size: 19, trail: '#a0fff0', desc: '身上一條會發光的稜光線', draw: mdl('prismtetra') },
  { id: 'frostwing',     name: '霜翼魚',       size: 22, trail: '#e0f4ff', desc: '背上一對像冰霜一樣的翅膀', draw: mdl('frostwing') },
  { id: 'peachblossom',  name: '桃花鬥魚',     size: 23, trail: '#ffc8c0', desc: '桃花色的長紗，身邊飄著花瓣', draw: mdl('peachblossom') },
  { id: 'auroraneon',    name: '極光燈魚',     size: 20, trail: '#90f0d8', desc: '發光的燈線配上兩條極光彩帶', draw: mdl('auroraneon') },
  { id: 'pearlmoon',     name: '珠月魚',       size: 23, trail: '#fff4ec', desc: '身邊繞著一顆發光的小珍珠', draw: mdl('pearlmoon') },
  { id: 'sapphire',      name: '藍寶石仙魚',   size: 22, trail: '#a8c8ff', desc: '深藍色的身體閃著寶石光', draw: mdl('sapphire') },
  { id: 'goldleaf',      name: '金箔鬥魚',     size: 23, trail: '#ffd890', desc: '酒紅色長紗上灑滿金箔', draw: mdl('goldleaf') },
  { id: 'cherubfish',    name: '小天使魚',     size: 20, trail: '#fff8f0', desc: '圓圓的白色小魚，有翅膀和光環', draw: mdl('cherubfish') },
  { id: 'starbloom',     name: '星花仙魚',     size: 23, trail: '#ffe0f0', desc: '身上開滿金色的小星花', draw: mdl('starbloom') },
  { id: 'opalveil',      name: '虹紗精靈魚',   size: 24, trail: '#e8e0ff', desc: '蛋白石般的長紗，拖著三色彩帶', draw: mdl('opalveil') },
  { id: 'moonveil',      name: '月紗仙女魚',   size: 24, trail: '#e8ecff', desc: '銀色長紗、戴著月光小皇冠', draw: mdl('moonveil') },
  { id: 'starkoi',       name: '星河錦鯉',     size: 25, trail: '#a8b0ff', desc: '深藍身體上灑滿星星的錦鯉', draw: mdl('starkoi') },
  { id: 'empress',       name: '鳳凰女皇魚',   size: 26, trail: '#ffe0b0', desc: '金冠、金箔與三條鳳凰尾羽的女皇', draw: mdl('empress') },
  // 第 86～100 種：補在魚比較少的系列（錦鯉、星月、小型魚…），每一階的價格比之前再多一點（外觀在 fish-models-4.js）
  { id: 'pearlguppy',    name: '珍珠孔雀魚',   size: 20, trail: '#fff0f8', desc: '全身閃著珍珠光澤的小孔雀魚', draw: mdl('pearlguppy') },
  { id: 'sakurakoi',     name: '櫻花錦鯉',     size: 25, trail: '#ffd8e8', desc: '白底粉紅花紋，身邊飄著櫻花瓣', draw: mdl('sakurakoi') },
  { id: 'candytetra',    name: '糖果燈魚',     size: 20, trail: '#ffd8ec', desc: '粉紅和水藍像糖果一樣的小燈魚', draw: mdl('candytetra') },
  { id: 'crescentfin',   name: '新月仙魚',     size: 23, trail: '#b8c4ff', desc: '頭上浮著一圈金色的月環', draw: mdl('crescentfin') },
  { id: 'lilybell',      name: '鈴蘭仙魚',     size: 22, trail: '#e8ffe8', desc: '圓滾滾的身體，背上有小翅膀', draw: mdl('lilybell') },
  { id: 'rainbowtetra',  name: '彩虹燈魚',     size: 21, trail: '#e8e0ff', desc: '身上流著彩虹光，拖著三條彩帶', draw: mdl('rainbowtetra') },
  { id: 'moonkoi',       name: '月光錦鯉',     size: 25, trail: '#e0e8ff', desc: '銀白鱗片，身邊繞著一顆月光珠', draw: mdl('moonkoi') },
  { id: 'dandelionfin',  name: '蒲公英仙魚',   size: 22, trail: '#fff4c0', desc: '鰭像蒲公英絨毛一樣輕飄飄', draw: mdl('dandelionfin') },
  { id: 'sunsetbetta',   name: '彩霞鬥魚',     size: 24, trail: '#ffb8a0', desc: '晚霞色的超長裙尾', draw: mdl('sunsetbetta') },
  { id: 'meteorfin',     name: '流星仙魚',     size: 23, trail: '#90a8ff', desc: '游過去像一顆拖著光尾的流星', draw: mdl('meteorfin') },
  { id: 'amethyst',      name: '紫水晶仙魚',   size: 24, trail: '#d0b0ff', desc: '紫水晶般透亮的高身仙魚', draw: mdl('amethyst') },
  { id: 'goldkoi',       name: '金鱗錦鯉',     size: 26, trail: '#ffe070', desc: '滿身金鱗、戴著小金冠的錦鯉', draw: mdl('goldkoi') },
  { id: 'nebulaveil',    name: '星雲紗魚',     size: 24, trail: '#c8a0ff', desc: '粉紫和水藍的星雲長紗', draw: mdl('nebulaveil') },
  { id: 'rainbowkoi',    name: '七彩錦鯉',     size: 26, trail: '#ffe8f8', desc: '白身七彩鰭，拖著四條彩虹緞帶', draw: mdl('rainbowkoi') },
  { id: 'polaris',       name: '北極星仙魚',   size: 25, trail: '#d0d8ff', desc: '頭頂一顆北極星、戴著星冠', draw: mdl('polaris') },
];
// 依「平均每次想產出的價值」組出寶物組合：主要兩種相鄰的寶物，再加 6% 機率的更高級寶物
function makePool(avg) {
  const TV = ['bubble', 'coin', 'shell', 'pearl', 'crystal', 'crown', 'diamond', 'vase', 'gold', 'relic', 'key', 'trident', 'orb', 'starstone', 'heart'];
  let i = 0; while (i < TV.length - 2 && TREASURE[TV[i + 1]].value < avg) i++;
  const lo = TREASURE[TV[i]].value, hi = TREASURE[TV[i + 1]].value, wHi = clamp(Math.round((avg - lo) / (hi - lo) * 94), 5, 88);
  const pool = [[TV[i], 94 - wHi], [TV[i + 1], wHi]];
  if (i + 2 < TV.length) pool.push([TV[i + 2], 6]); else pool[1][1] += 6;
  return pool;
}
// 價格取兩位有效數字，看起來比較整齊
const nice = n => { const p = Math.pow(10, Math.floor(Math.log10(n)) - 1); return Math.round(n / p) * p; };
// 每一階：產值每階成長 ×1.38（前期）→ ×1.7（後期），回本時間從 1.5 分鐘慢慢拉長到約 60 小時；
// 越後面的魚產值跳得越多，買到第一隻後，第二隻會比較快買到
// 模擬結果：前期每 1～2 分鐘就能買下一種，中期約 10～30 分鐘，最後幾種約 4～6 小時（實際遊玩約一兩天）
// 第 41～50 種：接在原本 40 種後面，原本 40 種的數值完全不變；產值每階 ×1.6，回本時間每階再慢 5%
const BASE_TIERS = 40;
function tierStats(k) {
  const n = BASE_TIERS - 1, q = Math.min(1, k / n), x = Math.max(0, k - n);
  let income = .33; for (let i = 1; i <= k; i++) income *= i <= n ? 1.38 + .32 * (i / n) ** 2 : 1.6;
  const price = k ? nice(income * 90 * Math.pow(216000 / 90, Math.pow(q, 1.3)) * Math.pow(1.05, x) * Math.pow(1.07 / 1.05, Math.max(0, k - 84))) : 20;
  const dropEvery = Math.round(8 + 9 * q), avg = income * dropEvery, pool = makePool(avg);
  return {
    price, income, dropEvery, pool, mult: avg / avgTreasure(pool),
    // 放生得到的星星：跟價格掛鉤（孔雀魚 1 顆，第 40 種約 430 顆，第 100 種約 130 萬顆）
    stars: Math.max(1, Math.round(Math.pow(price / 20, .256))), speed: Math.round(70 - 25 * q),
    hungerRate: +(.55 + .4 * q).toFixed(2), growTime: Math.round(60 * Math.pow(10, q) / 10) * 10 + x * 30,
    // 繁殖時間：3 分鐘 → 最高級約 6 小時
    breedTime: Math.round(180 * Math.pow(120, q) / 10) * 10,
  };
}
SPECIES.forEach((s, k) => Object.assign(s, tierStats(k), { tier: k }));
const SP = Object.fromEntries(SPECIES.map(s => [s.id, s]));

// 星願夢幻生物（36 種）：用星星兌換，每種只能有一隻，要依序兌換（不能跳著買），水族箱最多展示 5 隻
// income：目標每秒產值（基本值，不含造景與背景加成）；寶物價值倍率 valueMult 另外乘上
const STARFISH = [
  { id: 'phoenix', name: '火鳳凰魚', cost: 30,   size: 26, speed: 65, dropEvery: 11, valueMult: 1.3,  income: 30,     desc: '尾巴像火焰一樣燃燒', draw: drawPhoenix },
  { id: 'rainbow', name: '彩虹天使', cost: 60,   size: 26, speed: 55, dropEvery: 12, valueMult: 1.35, income: 120,    desc: '身上的顏色不停流轉', draw: drawRainbow },
  { id: 'crystal', name: '水晶魚',   cost: 100,  size: 26, speed: 50, dropEvery: 12, valueMult: 1.4,  income: 400,    desc: '透明閃耀的晶體身軀', draw: drawCrystal },
  { id: 'leafy',   name: '葉形海龍', cost: 150,  size: 34, speed: 35, dropEvery: 13, valueMult: 1.45, income: 1200,   desc: '身上長滿隨水搖曳的葉子', draw: drawLeafy },
  { id: 'galaxy',  name: '星河魚',   cost: 220,  size: 28, speed: 50, dropEvery: 13, valueMult: 1.45, income: 4000,   desc: '身體裡藏著一整片星空', draw: drawGalaxy },
  { id: 'jelly',   name: '夜光水母', cost: 300,  size: 36, speed: 28, dropEvery: 14, valueMult: 1.5,  income: 12000,  desc: '一縮一放、發出柔和的光', draw: drawJelly },
  { id: 'dragon',  name: '青龍',     cost: 420,  size: 26, speed: 60, dropEvery: 14, valueMult: 1.55, income: 35000,  desc: '傳說中守護海洋的神龍', draw: drawDragon },
  { id: 'manta',   name: '鬼蝠魟',   cost: 560,  size: 38, speed: 45, dropEvery: 15, valueMult: 1.6,  income: 100000, desc: '張開大翅膀在水中飛翔', draw: drawManta },
  { id: 'moon',    name: '月光錦鯉', cost: 750,  size: 32, speed: 40, dropEvery: 15, valueMult: 1.65, income: 300000, desc: '在月光下誕生的夢幻之魚', draw: drawMoon },
  { id: 'beluga',  name: '小白鯨',   cost: 1000, size: 40, speed: 38, dropEvery: 16, valueMult: 1.75, income: 800000, desc: '總是笑咪咪的海中天使', draw: drawBeluga },
  // 更高級的夢幻生物：星星需求更高，外觀更華麗
  { id: 'pegasus',      name: '天馬海馬', cost: 1400, size: 30, speed: 40, dropEvery: 16, valueMult: 1.8,  income: 1800000,   desc: '長著羽毛翅膀的純白海馬', draw: drawPegasus },
  { id: 'lotus',        name: '蓮花水母', cost: 2000, size: 38, speed: 26, dropEvery: 16, valueMult: 1.85, income: 4000000,   desc: '像一朵發光的蓮花在水中綻放', draw: drawLotusJelly },
  { id: 'starmanta',    name: '星空魟',   cost: 2800, size: 40, speed: 44, dropEvery: 17, valueMult: 1.9,  income: 9000000,   desc: '翅膀上閃爍著整片星空', draw: drawStarManta },
  { id: 'icedragon',    name: '冰晶龍',   cost: 4000, size: 28, speed: 58, dropEvery: 17, valueMult: 2.0,  income: 20000000,  desc: '冰晶鱗片、拖著極光鬃毛的神龍', draw: drawIceDragon },
  { id: 'rainbowwhale', name: '彩虹鯨',   cost: 5500, size: 42, speed: 36, dropEvery: 18, valueMult: 2.1,  income: 45000000,  desc: '游過的地方都會留下彩虹', draw: drawRainbowWhale },
  { id: 'dragonking',   name: '海神龍王', cost: 8000, size: 30, speed: 55, dropEvery: 18, valueMult: 2.25, income: 100000000, desc: '守護整片海洋、捧著龍珠的王者', draw: drawDragonKing },
  // 最頂級的五種：星星需求每階約 ×1.45，外觀最華麗
  { id: 'skykoi',        name: '天河錦鯉',     cost: 12000, size: 34, speed: 42, dropEvery: 18, valueMult: 2.35, income: 220000000,  desc: '拖著天河彩帶、灑下一路星塵', draw: drawSkyKoi },
  { id: 'prismjelly',    name: '七彩琉璃水母', cost: 17500, size: 40, speed: 26, dropEvery: 19, valueMult: 2.45, income: 500000000,  desc: '傘蓋的顏色像彩虹一樣流轉', draw: drawPrismJelly },
  { id: 'unicorn',       name: '獨角夢幻天馬', cost: 25000, size: 32, speed: 40, dropEvery: 19, valueMult: 2.55, income: 1100000000, desc: '彩虹鬃毛、金色獨角的夢幻天馬', draw: drawUnicorn },
  { id: 'nebulamanta',   name: '星雲魔鬼魟',   cost: 36000, size: 42, speed: 44, dropEvery: 20, valueMult: 2.65, income: 2500000000, desc: '翅膀是一片星雲，翼尖拖著極光', draw: drawNebulaManta },
  { id: 'rainbowdragon', name: '七彩神龍',     cost: 52000, size: 32, speed: 56, dropEvery: 20, valueMult: 2.8,  income: 5500000000, desc: '全身流動著七彩光芒的傳說神龍', draw: drawRainbowDragon },
  // 第 22～26 隻：配合第 51～65 種魚的進度，星星需求一樣每階約 ×1.45；游過去會留下淡淡的痕跡
  { id: 'lunajelly',     name: '月光琉璃水母', cost: 75000,  size: 38, speed: 26, dropEvery: 20, valueMult: 2.9,  income: 22000000000,   trail: '#e8f0ff', desc: '銀白的傘蓋裡藏著一彎月亮', draw: drawLunaJelly },
  { id: 'phoenixlord',   name: '不死鳥',       cost: 110000, size: 30, speed: 55, dropEvery: 20, valueMult: 3.0,  income: 90000000000,   trail: '#ffc070', desc: '拖著四條金紅尾羽的浴火神鳥', draw: drawPhoenixLord },
  { id: 'skywhale',      name: '天空之鯨',     cost: 160000, size: 40, speed: 34, dropEvery: 21, valueMult: 3.1,  income: 360000000000,  trail: '#ffffff', desc: '身邊飄著小雲朵、尾巴拖著淡淡彩虹', draw: drawSkyWhale },
  { id: 'crystaldragon', name: '水晶神龍',     cost: 235000, size: 32, speed: 54, dropEvery: 21, valueMult: 3.2,  income: 1500000000000, trail: '#e0d8ff', desc: '粉彩水晶鱗片，捧著一顆稜鏡龍珠', draw: drawCrystalDragon },
  { id: 'goddessfish',   name: '海之女神',     cost: 340000, size: 34, speed: 40, dropEvery: 22, valueMult: 3.4,  income: 6000000000000, trail: '#fff0d8', desc: '披著層層羽衣、戴著金冠的海洋女神', draw: drawGoddessFish },
  // 第 27～31 隻：配合第 66～85 種魚的進度，星星需求每階約 ×1.65（外觀在 dream-fish-3.js）
  { id: 'lotusqueen',    name: '蓮花仙后',     cost: 560000,  size: 40, speed: 26, dropEvery: 22, valueMult: 3.6, income: 40000000000000,    trail: '#ffe0f0', desc: '戴著小皇冠的大朵粉金蓮花', draw: drawLotusQueen },
  { id: 'starwhale',     name: '星辰巨鯨',     cost: 920000,  size: 42, speed: 32, dropEvery: 22, valueMult: 3.8, income: 260000000000000,   trail: '#8a90ff', desc: '身上畫著星座，身後拖著極光', draw: drawStarWhale },
  { id: 'phoenixdragon', name: '鳳凰神龍',     cost: 1500000, size: 33, speed: 56, dropEvery: 23, valueMult: 4.0, income: 1700000000000000,  trail: '#ffb070', desc: '火焰羽毛般的鬃毛，捧著火焰龍珠', draw: drawPhoenixDragon },
  { id: 'starpegasus',   name: '星空天馬',     cost: 2500000, size: 33, speed: 40, dropEvery: 23, valueMult: 4.2, income: 11000000000000000, trail: '#c8b8ff', desc: '夜空般的身體、星光翅膀和獨角', draw: drawStarPegasus },
  { id: 'empressmanta',  name: '彩虹女皇魟',   cost: 4000000, size: 44, speed: 42, dropEvery: 24, valueMult: 4.5, income: 75000000000000000, trail: '#ffe0f8', desc: '彩虹翅膀拖著長彩帶，額頭閃著金光', draw: drawEmpressManta },
  // 第 32～36 隻：配合第 86～100 種魚的進度，星星需求每階約 ×1.8（外觀在 dream-fish-4.js）
  { id: 'aurorajelly',   name: '極光水母后',   cost: 7200000,  size: 40, speed: 26, dropEvery: 24, valueMult: 4.7, income: 310000000000000000,   trail: '#a0ffe0', desc: '極光色的傘蓋，外圈一道會變色的光環', draw: drawAuroraJelly },
  { id: 'sakuradragon',  name: '櫻花神龍',     cost: 13000000, size: 33, speed: 54, dropEvery: 24, valueMult: 4.9, income: 1300000000000000000,  trail: '#ffc8dc', desc: '粉白色的龍，身邊不停飄落櫻花', draw: drawSakuraDragon },
  { id: 'galaxymanta',   name: '銀河魔鬼魟',   cost: 23000000, size: 44, speed: 42, dropEvery: 25, valueMult: 5.1, income: 5300000000000000000,  trail: '#b090ff', desc: '翅膀裡灑滿星星，拖著星雲彩帶', draw: drawGalaxyManta },
  { id: 'icepegasus',    name: '冰晶天馬',     cost: 42000000, size: 34, speed: 40, dropEvery: 25, valueMult: 5.3, income: 21000000000000000000, trail: '#c8f0ff', desc: '冰晶獨角和雪白翅膀，身邊飄著雪花', draw: drawIcePegasus },
  { id: 'galaxyphoenix', name: '星河鳳凰',     cost: 76000000, size: 32, speed: 52, dropEvery: 26, valueMult: 5.6, income: 86000000000000000000, trail: '#c8b0ff', desc: '夜空色的鳳凰，五條銀河尾羽尾端閃著星星', draw: drawGalaxyPhoenix },
];
STARFISH.forEach(s => { s.pool = makePool(s.income * s.dropEvery / s.valueMult); s.mult = s.income * s.dropEvery / avgTreasure(s.pool); s.star = true; });
const SSP = Object.fromEntries(STARFISH.map(s => [s.id, s]));
const getSp = id => SP[id] || SSP[id];
const MAX_SHOWN = 5;
// 夢幻魚要依序兌換：第一隻隨時可以買，之後要先擁有前一隻
const starUnlocked = i => i <= 0 || state.starOwned.includes(STARFISH[i - 1].id);

const FOODS = [
  { id: 'basic',   name: '普通飼料',   icon: '🟤', cost: 1,  sat: 15, grow: 1,   color: '#9a6a3a', r: 4.5 },
  { id: 'quality', name: '營養顆粒',   icon: '🟢', cost: 4,  sat: 30, grow: 1.5, color: '#45c46a', r: 5 },
  { id: 'premium', name: '高級蝦乾',   icon: '🦐', cost: 12, sat: 50, grow: 2.2, color: '#ff7a45', r: 5.5 },
  { id: 'deluxe',  name: '頂級魚子醬', icon: '⚫', cost: 35, sat: 85, grow: 3,   color: '#2a2440', r: 6.5 },
];
const FD = Object.fromEntries(FOODS.map(f => [f.id, f]));

// 10 種金幣背景（由便宜到貴，越貴寶物價值加成越高；價格配合魚的進度拉長）＋ 7 種星星背景（越貴越夢幻）
const BGS = [
  { id: 'fresh',   name: '清澈淡水',   price: 0,       bonus: 0,    top: '#8ee3ff', bot: '#1a6fa8', sand: ['#f1dfae', '#d9bf82'], ray: .10 },
  { id: 'reef',    name: '熱帶珊瑚礁', price: 1000,     bonus: 0.05, top: '#5ff0e0', bot: '#0a7a9a', sand: ['#ffd9c9', '#e9ad92'], ray: .12 },
  { id: 'kelp',    name: '巨藻森林',   price: 8000,    bonus: 0.08, top: '#7ad8b4', bot: '#0c4a44', sand: ['#d2c48e', '#9c8f5c'], ray: .13 },
  { id: 'sunset',  name: '夕陽海灣',   price: 50000,    bonus: 0.12, top: '#ffb070', bot: '#4a2372', sand: ['#e7b98a', '#b98a5f'], ray: .09 },
  { id: 'sakura',  name: '櫻花海灣',   price: 300000,   bonus: 0.16, top: '#ffcade', bot: '#6a3a7c', sand: ['#ffe6ee', '#e8b6c8'], ray: .1 },
  { id: 'deep',    name: '深海秘境',   price: 2000000,   bonus: 0.20, top: '#123a6b', bot: '#02070f', sand: ['#3a4658', '#222b38'], ray: .03 },
  { id: 'arctic',  name: '冰洋極光',   price: 15000000,   bonus: 0.25, top: '#d8f4ff', bot: '#1f5f8e', sand: ['#f4f8fc', '#c6d4e2'], ray: .1 },
  { id: 'jelly',   name: '夜光水母',   price: 100000000,  bonus: 0.30, top: '#2a1a5e', bot: '#07031a', sand: ['#40306a', '#261a44'], ray: .02 },
  { id: 'volcano', name: '海底火山',   price: 800000000,  bonus: 0.36, top: '#4e1c18', bot: '#120404', sand: ['#3c2c28', '#1e1412'], ray: .02 },
  { id: 'palace',  name: '龍宮寶殿',   price: 6000000000, bonus: 0.45, top: '#8a2436', bot: '#1c0612', sand: ['#e9c46a', '#b8892f'], ray: .08 },
  { id: 'galaxy', name: '星河幻境',   starPrice: 80, bonus: 0.35, top: '#1b0b3a', bot: '#050214', sand: ['#4a3a80', '#1d1540'], ray: 0 },
  { id: 'bubblepink',  name: '粉紅泡泡海', starPrice: 250,   bonus: 0.38, top: '#ffc8e6', bot: '#7a4aa8', sand: ['#ffe4f0', '#e8b8d8'], ray: .1 },
  { id: 'moonsea',     name: '月光海',     starPrice: 600,   bonus: 0.42, top: '#27367a', bot: '#070b26', sand: ['#8a94c0', '#4a5282'], ray: .06 },
  { id: 'lantern',     name: '天燈祈願海', starPrice: 1500,  bonus: 0.46, top: '#43205e', bot: '#140a26', sand: ['#6a4a5a', '#3a2838'], ray: .03 },
  { id: 'lotuspond',   name: '蓮花仙池',   starPrice: 3500,  bonus: 0.50, top: '#c8f4e8', bot: '#1e6a78', sand: ['#f0ecd0', '#c8c49a'], ray: .14 },
  { id: 'crystalhall', name: '水晶宮殿',   starPrice: 7000,  bonus: 0.55, top: '#c8ecff', bot: '#28307a', sand: ['#e8f0ff', '#aab8e8'], ray: .1 },
  { id: 'heaven',      name: '彩虹天堂',   starPrice: 15000, bonus: 0.60, top: '#fff4fb', bot: '#7a9ae8', sand: ['#fff8e8', '#f0d8b8'], ray: .16 },
];
const BG = Object.fromEntries(BGS.map(b => [b.id, b]));

