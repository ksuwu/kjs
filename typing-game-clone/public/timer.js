// 60-second countdown timer for Dreamland page
// Shows 'Game Over' in #info when time runs out. Hooks Start and Reset buttons.
(function () {
  const TIMER_SECONDS = 60.0;

  function $(id) { return document.getElementById(id); }

  // Wait for DOM (script is loaded at end of body but keep safe)
  function init() {
    const startBtn = $('startBtn');
    const resetBtn = $('resetBtn');
    const addMinBtn = $('addMinBtn');
  const timerEl = $('timer');
  const largeTimerEl = $('largeTimer');
  const infoEl = $('info');
  const gameArea = $('gameArea');

    if (!timerEl || !infoEl) return; // nothing to do

    let intervalId = null;
    let endTime = null;
    let running = false;

    function formatTime(t) {
      return t.toFixed(1) + 's';
    }

    function updateTimerDisplay(remaining) {
      const txt = `Time: ${formatTime(Math.max(0, remaining))}`;
      if (timerEl) timerEl.textContent = txt;
      if (largeTimerEl) largeTimerEl.textContent = formatTime(Math.max(0, remaining));
    }

    function startTimer() {
      if (running) return;
      running = true;
      if (startBtn) startBtn.disabled = true;
      endTime = Date.now() + TIMER_SECONDS * 1000;
      updateTimerDisplay(TIMER_SECONDS);

      // clear the overlay/info when starting
      infoEl.textContent = '';

      if (largeTimerEl) largeTimerEl.style.display = '';
      intervalId = setInterval(() => {
        const msLeft = endTime - Date.now();
        const secLeft = Math.max(0, msLeft / 1000);
        updateTimerDisplay(secLeft);
        if (msLeft <= 0) {
          stopTimer(true);
        }
      }, 100);

      try { gameArea && gameArea.focus(); } catch (e) {}
    }

    function addMinutes(n) {
      const ms = (n || 1) * 60000;
      if (running && endTime) {
        endTime += ms;
        // show a brief flash on the large timer to indicate the add
        if (largeTimerEl) {
          largeTimerEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 300 }).onfinish = () => {};
        }
      } else {
        // not running: increase the displayed initial time
        const newT = TIMER_SECONDS + (n || 1) * 60;
        // update the visible timer without changing the constant
        updateTimerDisplay(newT);
      }
    }

    function stopTimer(isGameOver = false) {
      if (!running && !isGameOver) return;
      running = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
  updateTimerDisplay(0);
  if (largeTimerEl) largeTimerEl.style.display = '';

      if (isGameOver) {
        infoEl.textContent = 'Game Over';
        // re-enable start so user can play again
        if (startBtn) startBtn.disabled = false;
        // Additional game-cleanup could be done here if needed
      }
    }

    function resetTimer() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      running = false;
      if (startBtn) startBtn.disabled = false;
  updateTimerDisplay(TIMER_SECONDS);
  if (largeTimerEl) largeTimerEl.style.display = 'none';
  infoEl.textContent = 'Press Start to play. Pop the dream bubbles!';
    }

    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
  if (addMinBtn) addMinBtn.addEventListener('click', ()=> addMinutes(1));

    // initialize
    updateTimerDisplay(TIMER_SECONDS);
    if (!infoEl.textContent.trim()) {
      infoEl.textContent = 'Press Start to play. Pop the dream bubbles!';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
