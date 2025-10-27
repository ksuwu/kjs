// Typing Bubbles Game - kid-friendly implementation
const words = [
  'cat','dog','sun','cup','car','hat','ball','bee','egg','pig',
  'cow','fox','bat','bee','ant','tree','fish','book','star','cake'
];

const gameArea = document.getElementById('gameArea');
const collectedEl = document.getElementById('collected');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const voiceToggle = document.getElementById('voiceToggle');
const hintLetterEl = document.getElementById('hintLetter');
const currentTypedEl = document.getElementById('currentTyped');
const info = document.getElementById('info');
const touchKeyboard = document.getElementById('touchKeyboard');

let bubbles = new Map(); // id -> {el, word, index, spawnTime}
let nextId = 1;
let collected = '';
let score = 0;
let running = false;
let spawnInterval = null;
let startTime = 0;

function rand(min,max){return Math.random()*(max-min)+min}

function createBubble(word){
  const id = nextId++;
  const el = document.createElement('div');
  el.className = 'bubble large';
  el.textContent = word;
  el.dataset.id = id;

  const areaRect = gameArea.getBoundingClientRect();
  const x = rand(6, areaRect.width - 120);
  const y = areaRect.height + 40;
  el.style.left = x + 'px';
  el.style.top = y + 'px';

  const dur = rand(12, 18);
  el.style.animation = `floatUp ${dur}s linear forwards`;

  gameArea.appendChild(el);

  const meta = {el, word, index:0, spawnTime:performance.now(), dur};
  bubbles.set(String(id), meta);

  updateHint(word[0]);
  if (currentTypedEl) currentTypedEl.textContent = '';
  if (isVoiceEnabled()) speakWord(word);

  el.addEventListener('animationend', ()=>{
    if (bubbles.has(String(id))){
      try{ if (el.parentNode) el.parentNode.removeChild(el); } catch(e){}
      bubbles.delete(String(id));
    }
  });
}

function updateHint(letter){
  hintLetterEl.textContent = letter ? letter.toUpperCase() : '';
}

function isVoiceEnabled(){
  return !!(voiceToggle && voiceToggle.checked && window.speechSynthesis);
}

function speakWord(word){
  try{
    const s = new SpeechSynthesisUtterance(word);
    s.rate = 0.9; s.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(s);
  }catch(e){}
}

function spawnLoop(){
  if (!running) return;
  if (bubbles.size > 0) return;
  const w = words[Math.floor(Math.random()*words.length)];
  createBubble(w);
}

function startGame(){
  if (running) return;
  running = true;
  info.style.display = 'none';
  startBtn.disabled = true;
  resetBtn.disabled = false;
  startTime = performance.now();
  spawnInterval = setInterval(spawnLoop, 1200);
  gameArea.focus();
  if (window.innerWidth <= 700) buildTouchKeyboard();
}

function resetGame(){
  running = false;
  startBtn.disabled = false;
  resetBtn.disabled = true;
  info.style.display = 'block';
  clearInterval(spawnInterval);
  spawnInterval = null;
  bubbles.forEach((meta)=>{
    if (meta.el && meta.el.parentNode) meta.el.parentNode.removeChild(meta.el);
  });
  bubbles.clear();
  collected = '';
  score = 0;
  updateCollected();
  updateScore();
  timerEl.textContent = 'Time: 0.0s';
}

function updateScore(){ scoreEl.textContent = `Score: ${score}` }
function updateCollected(){ collectedEl.textContent = collected }

function onKey(e){
  if (!running) return;
  const key = (typeof e === 'string') ? e : (e.key || '');
  if (!key || key.length !== 1) return;
  const ch = key.toLowerCase();

  if (bubbles.size === 0) return;
  const meta = bubbles.values().next().value;
  if (!meta) return;

  const expected = meta.word[meta.index];
  if (!expected) return;

  if (ch === expected.toLowerCase()){
    meta.index += 1;
    if (currentTypedEl) currentTypedEl.textContent = meta.word.slice(0, meta.index).toUpperCase();
    const rect = meta.el.getBoundingClientRect();
    showSpark(rect.left + rect.width/2, rect.top, '+1');

    if (meta.index >= meta.word.length){
      const now = performance.now();
      const elapsed = (now - meta.spawnTime)/1000;
      const gained = Math.max(5, Math.floor((meta.word.length * 4) + (6 - Math.min(6, elapsed))));
      score += gained; updateScore();

      collected += (collected ? ' ' : '') + meta.word.toLowerCase(); updateCollected();

      if (isVoiceEnabled()) speakWord('Great! ' + meta.word);

      updateHint(''); if (currentTypedEl) currentTypedEl.textContent = '';
      showSpark(rect.left + rect.width/2, rect.top, `+${gained}`);
      popBubble(meta.el.dataset.id);
    }
  }
}

function buildTouchKeyboard(){
  if (!touchKeyboard) return;
  touchKeyboard.innerHTML = '';
  const rows = ['qwertyuiop','asdfghjkl','zxcvbnm'];
  rows.forEach(r =>{
    const row = document.createElement('div'); row.className='row';
    for (const ch of r){
      const k = document.createElement('div'); k.className='key'; k.textContent = ch.toUpperCase();
      k.addEventListener('touchstart', (ev)=>{ ev.preventDefault(); handleTouchKey(ch); });
      k.addEventListener('click', ()=>handleTouchKey(ch));
      row.appendChild(k);
    }
    touchKeyboard.appendChild(row);
  });
  touchKeyboard.style.display = 'flex';
}

function handleTouchKey(ch){ onKey(ch); }

function showSpark(x,y,text){
  const s = document.createElement('div');
  s.className = 'score-spark';
  s.style.left = (x) + 'px';
  s.style.top = (y) + 'px';
  s.textContent = text;
  document.body.appendChild(s);
  s.animate([
    { transform: 'translateY(0) scale(1)', opacity:1 },
    { transform: 'translateY(-40px) scale(1.4)', opacity:0 }
  ],{duration:900, easing:'cubic-bezier(.2,.9,.3,1)'}).onfinish = ()=>s.remove();
}

function popBubble(id){
  const meta = bubbles.get(String(id));
  if (!meta) return;
  const el = meta.el;
  el.classList.add('pop-animation');
  setTimeout(()=>{ try{ if (el.parentNode) el.parentNode.removeChild(el); }catch(_){} }, 220);
  bubbles.delete(String(id));
  if (bubbles.size === 0) updateHint('');
}

gameArea.addEventListener('keydown', onKey);
window.addEventListener('keydown', onKey);

startBtn.addEventListener('click', ()=>{ startGame(); });
resetBtn.addEventListener('click', ()=>resetGame());
resetBtn.disabled = true;

function tick(){
  if (!running) return requestAnimationFrame(tick);
  const now = performance.now();
  const t = (now - startTime)/1000;
  // If a large on-page timer exists, let timer.js control the visible countdown
  const largeTimerEl = document.getElementById('largeTimer');
  if (!largeTimerEl && timerEl) {
    timerEl.textContent = `Time: ${t.toFixed(1)}s`;
  }
  requestAnimationFrame(tick);
}

gameArea.addEventListener('click', (e)=>{
  const b = e.target.closest('.bubble');
  if (b){
    const id = b.dataset.id;
    const meta = bubbles.get(String(id));
    if (!meta) return;
    try{ b.animate([{ transform: 'scale(1)', offset: 0 },{ transform: 'scale(1.06)', offset: 0.5 },{ transform: 'scale(1)', offset: 1 }], { duration: 300, easing: 'ease-out' }); }catch(e){}
    if (isVoiceEnabled()) speakWord(meta.word);
    gameArea.focus();
  }
});

updateCollected(); updateScore();
gameArea.addEventListener('mousedown', ()=>gameArea.focus());
gameArea.setAttribute('tabindex','0');
(function mainLoop(){ requestAnimationFrame(mainLoop); })();
