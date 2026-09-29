// 背景音樂（music.js）
// ====== 背景音樂（即時合成：柔和和弦 + 音樂盒旋律 + 海水聲 + 水滴與遠方鯨鳴） ======
const Music = (() => {
  const KEY = 'aquarium-music', TKEY = 'aquarium-track';
  // 四首背景音樂：和弦進行、旋律音階、節奏快慢不同；mode 決定旋律怎麼走
  const TRACKS = {
    ocean:   { name: '🌊 海洋輕音樂', desc: '悠閒的海底氣氛（預設）', bar: 8, lp: 900, padVol: .018, chords: [[48, 55, 64, 71], [45, 52, 60, 67], [41, 48, 57, 64], [43, 50, 59, 62]],
      scale: [72, 74, 76, 79, 81, 84, 86, 88], gaps: [.75, 1.5, 1.5, 2.25, 3], p: .72, vol: [.05, .09], mode: 'random', drops: true, whale: true },
    lullaby: { name: '🌙 夜晚搖籃曲', desc: '像音樂盒一樣輕輕柔柔', bar: 9, lp: 650, padVol: .014, chords: [[41, 48, 57, 64], [36, 43, 52, 60], [38, 45, 53, 62], [34, 41, 50, 57]],
      gaps: [.75], p: .9, vol: [.03, .05], mode: 'arp', drops: false, whale: true },
    festive: { name: '🎉 節慶歡樂', desc: '輕快熱鬧、有節奏感', bar: 4, lp: 1500, padVol: .014, chords: [[48, 55, 64, 72], [43, 50, 59, 67], [45, 52, 60, 69], [41, 48, 57, 65]],
      scale: [72, 74, 76, 79, 81, 84], gaps: [.25, .5, .5, .75], p: .85, vol: [.04, .065], mode: 'random', bass: true, drops: false, whale: false },
    dream:   { name: '✨ 夢幻星空', desc: '閃閃發亮的夢幻音色', bar: 10, lp: 800, padVol: .017, chords: [[48, 55, 62, 66], [45, 52, 59, 64], [50, 57, 64, 69], [43, 50, 57, 62]],
      scale: [74, 76, 78, 79, 83, 86, 88, 90, 91], gaps: [1, 1.5, 2], p: .7, vol: [.035, .065], mode: 'sparkle', drops: true, whale: false },
  };
  let cur = 'ocean'; try { const t = localStorage.getItem(TKEY); if (TRACKS[t]) cur = t; } catch (e) { }
  let TR = TRACKS[cur], BAR = TR.bar, arpI = 0, nextBeat = 0;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  let ac, master, wet, timer, nextBar = 0, nextNote = 0, nextDrop = 0, nextWhale = 0, bar = 0, playing = false, unlockEl;
  let wanted = true;
  try { wanted = localStorage.getItem(KEY) !== 'off'; } catch (e) { }
  // iPhone 靜音鍵會讓網頁音效沒聲音；先播放一段無聲的 <audio>，把音訊模式切成「播放」
  function silentWav() {
    const n = 800, b = new Uint8Array(44 + n), v = new DataView(b.buffer), w = (o, str) => [...str].forEach((ch, i) => b[o + i] = ch.charCodeAt(0));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
    let bin = ''; b.forEach(x => bin += String.fromCharCode(x)); return 'data:audio/wav;base64,' + btoa(bin);
  }
  function init() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ac = new AC();
    const comp = ac.createDynamicsCompressor(); comp.connect(ac.destination);
    master = ac.createGain(); master.gain.value = 0; master.connect(comp);
    const verb = ac.createConvolver(), len = ac.sampleRate * 3.5, ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    verb.buffer = ir; wet = ac.createGain(); wet.gain.value = .9; wet.connect(verb); verb.connect(master);
    // 海水聲：低通濾過的布朗噪音，濾波頻率緩慢起伏
    const nb = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate), nd = nb.getChannelData(0); let last = 0;
    for (let i = 0; i < nd.length; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; nd[i] = last * 3.2; }
    const src = ac.createBufferSource(); src.buffer = nb; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    const lfo = ac.createOscillator(), lfoG = ac.createGain(); lfo.frequency.value = .08; lfoG.gain.value = 200; lfo.connect(lfoG); lfoG.connect(lp.frequency);
    const ng = ac.createGain(); ng.gain.value = .22; src.connect(lp); lp.connect(ng); ng.connect(master); src.start(); lfo.start();
    return true;
  }
  function pad(chord, t) {
    for (const m of chord) for (const det of [-5, 5]) {
      const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = hz(m); o.detune.value = det; f.type = 'lowpass'; f.frequency.value = 900;
      o.type = 'triangle'; f.frequency.value = TR.lp;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(TR.padVol, t + 2.5); g.gain.setValueAtTime(TR.padVol, t + BAR - .5); g.gain.linearRampToValueAtTime(0, t + BAR + 2.5);
      o.connect(f); f.connect(g); g.connect(master); g.connect(wet); o.start(t); o.stop(t + BAR + 3);
    }
  }
  function bell(m, t, vol) {
    for (const [mul, v] of [[1, 1], [2, .25], [3.01, .08]]) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = hz(m) * mul;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * v, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + 2.8 / mul);
      o.connect(g); g.connect(master); g.connect(wet); o.start(t); o.stop(t + 3);
    }
  }
  function drop(t) {
    const o = ac.createOscillator(), g = ac.createGain(), f0 = rand(700, 1100);
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 2.2, t + .07);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.045, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + .18);
    o.connect(g); g.connect(master); g.connect(wet); o.start(t); o.stop(t + .25);
  }
  // 節慶的貝斯：短短的撥弦聲
  function pluck(m, t) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.06, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .4);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + .45);
  }
  function whale(t) {
    const o = ac.createOscillator(), vib = ac.createOscillator(), vg = ac.createGain(), lp = ac.createBiquadFilter(), g = ac.createGain(), f0 = rand(150, 210);
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 1.7, t + 2.2); o.frequency.linearRampToValueAtTime(f0 * 1.2, t + 4.5);
    vib.frequency.value = 5; vg.gain.value = 5; vib.connect(vg); vg.connect(o.frequency);
    lp.type = 'lowpass'; lp.frequency.value = 650;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + 1.2); g.gain.setValueAtTime(.05, t + 3.2); g.gain.linearRampToValueAtTime(0, t + 5);
    o.connect(lp); lp.connect(g); g.connect(wet); g.connect(master); o.start(t); vib.start(t); o.stop(t + 5.2); vib.stop(t + 5.2);
  }
  function tick() {
    const now = ac.currentTime;
    if (!nextDrop) { nextDrop = now + 3; nextWhale = now + 20; }
    while (nextDrop < now + 1.5) { if (TR.drops) { drop(Math.max(now, nextDrop)); if (Math.random() < .3) drop(Math.max(now, nextDrop) + .12); } nextDrop += rand(4, 10); }
    while (nextWhale < now + 1.5) { if (TR.whale) whale(Math.max(now, nextWhale)); nextWhale += rand(40, 75); }
    if (nextBar < now) nextBar = now + .1;
    if (nextNote < now) nextNote = now + .5;
    if (nextBeat < now) nextBeat = now + .1;
    while (nextBar < now + 1.5) { pad(TR.chords[bar % 4], nextBar); nextBar += BAR; bar++; }
    const chord = TR.chords[(bar + 3) % 4];
    while (nextNote < now + 1.5) {
      if (TR.mode === 'arp') {
        // 音樂盒：把目前的和弦一個音一個音往上彈
        const m = chord[[0, 1, 2, 3, 2, 1][arpI++ % 6]] + 24; bell(m, nextNote, rand(TR.vol[0], TR.vol[1]));
      } else if (Math.random() < TR.p) {
        bell(pick(TR.scale), nextNote, rand(TR.vol[0], TR.vol[1])); if (Math.random() < .2) bell(pick(TR.scale) - 12, nextNote + .01, TR.vol[0]);
        // 星空：偶爾來一串往上的閃亮音
        if (TR.mode === 'sparkle' && Math.random() < .18) { const i0 = Math.floor(Math.random() * (TR.scale.length - 4)); for (let k = 0; k < 4; k++) bell(TR.scale[i0 + k] + 12, nextNote + .12 * (k + 1), TR.vol[0] * .8); }
      }
      nextNote += pick(TR.gaps);
    }
    while (TR.bass && nextBeat < now + 1.5) { pluck(chord[(Math.round(nextBeat * 2) % 2) ? 1 : 0] - 12, nextBeat); nextBeat += .5; }
  }
  function start() {
    if (!wanted) return;
    // 已經在「播放中」但音訊其實被瀏覽器擋住（重新整理後第一次按下畫面的時機，iPhone 不一定算數）：
    // 之後每次點畫面都再試著喚醒，直到真的有聲音
    if (playing) { if (ac && ac.state !== 'running') { ac.resume(); try { unlockEl && unlockEl.play().catch(() => { }); } catch (e) { } } return; }
    if (!ac && !init()) return;
    try { if (!unlockEl) { unlockEl = new Audio(silentWav()); unlockEl.loop = true; } unlockEl.play().catch(() => { }); } catch (e) { }
    ac.resume(); playing = true;
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(.5, ac.currentTime, 1.2);
    tick(); timer = setInterval(tick, 400); updateBtn();
  }
  function stop() {
    if (!playing) return; playing = false; clearInterval(timer);
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(0, ac.currentTime, .3);
    setTimeout(() => { if (!playing) { ac.suspend(); try { unlockEl && unlockEl.pause(); } catch (e) { } } }, 1200);
    updateBtn();
  }
  function updateBtn() { const b = $('#musicBtn'); b.textContent = wanted ? '🎵' : '🔇'; b.title = wanted ? '關閉背景音樂' : '開啟背景音樂'; b.classList.toggle('on', playing); }
  function toggle() { wanted = !wanted; try { localStorage.setItem(KEY, wanted ? 'on' : 'off'); } catch (e) { } wanted ? start() : stop(); toast(wanted ? '🎵 背景音樂開啟' : '🔇 背景音樂關閉'); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (wanted) setTimeout(start, 0); });
  // 換一首：下一小節就換成新的和弦與旋律
  function setTrack(id) {
    if (!TRACKS[id]) return; cur = id; TR = TRACKS[id]; BAR = TR.bar; arpI = 0;
    try { localStorage.setItem(TKEY, id); } catch (e) { }
    if (ac) { const now = ac.currentTime; nextBar = now + .3; nextNote = now + .5; nextBeat = now + .5; }
    if (!wanted) toggle(); else toast(`🎵 背景音樂：${TR.name}`);
  }
  return { start, toggle, updateBtn, setTrack, tracks: TRACKS, track: () => cur };
})();
$('#musicBtn').onclick = e => { e.stopPropagation(); Music.toggle(); };
// 瀏覽器規定要先點一下畫面才能播放聲音
for (const ev of ['pointerdown', 'touchend', 'click', 'keydown']) document.addEventListener(ev, () => Music.start(), { passive: true });

