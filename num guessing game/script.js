(() => {
    const guessInput = document.getElementById('guess');
    const submitBtn = document.getElementById('submit');
    const resetBtn = document.getElementById('reset');
    const msg = document.getElementById('message');
    const attemptsEl = document.getElementById('attempts');
    const bestEl = document.getElementById('best');
    const meterFill = document.getElementById('meterFill');

    let secret = generate();
    let attempts = 0;
    let best = Number(localStorage.getItem('bestGuessScore') || 0) || null;
    updateBest();

    function generate() { return Math.floor(Math.random() * 100) + 1; }
    function updateAttempts() { attemptsEl.textContent = String(attempts); }
    function updateBest() { bestEl.textContent = best == null ? '–' : String(best); }
    function setMessage(text) { msg.textContent = text; }

    function updateMeter(value) {
        // Map distance to width (closer -> wider)
        const distance = Math.abs(secret - value);
        const closeness = Math.max(0, 100 - distance) / 100; // 0..1
        const width = Math.max(5, Math.floor(closeness * 100));
        meterFill.style.width = width + '%';
    }

    function submit() {
        const value = Number(guessInput.value);
        if (!value || value < 1 || value > 100) { setMessage('Enter a number from 1 to 100'); return; }
        attempts += 1; updateAttempts();
        if (value === secret) {
            setMessage(`Correct! The number was ${secret}.`);
            if (best == null || attempts < best) { best = attempts; localStorage.setItem('bestGuessScore', String(best)); updateBest(); }
            secret = generate(); attempts = 0; updateAttempts();
            meterFill.style.width = '0%';
        } else if (value < secret) {
            setMessage('Too low!');
        } else {
            setMessage('Too high!');
        }
        updateMeter(value);
        guessInput.focus(); guessInput.select();
    }

    function reset() {
        secret = generate(); attempts = 0; updateAttempts(); setMessage('Start guessing...'); guessInput.value = ''; meterFill.style.width = '0%';
    }

    submitBtn.addEventListener('click', submit);
    resetBtn.addEventListener('click', reset);
    guessInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
})();


