(() => {
    const display = document.getElementById('display');
    const keys = document.querySelector('.keys');
    const clearBtn = document.getElementById('clear');
    const equalsBtn = document.getElementById('equals');

    let expression = '';

    function updateDisplay() {
        display.value = expression || '0';
    }

    function append(value) {
        expression += value;
        updateDisplay();
    }

    function appendOp(op) {
        if (expression === '' && (op === '+' || op === '-' )) {
            expression = op;
        } else if (/[-+*/.]$/.test(expression)) {
            expression = expression.slice(0, -1) + op;
        } else {
            expression += op;
        }
        updateDisplay();
    }

    function evaluate() {
        try {
            // Disallow invalid trailing operators
            if (/[-+*/.]$/.test(expression)) expression = expression.slice(0, -1);
            // Evaluate safely
            // eslint-disable-next-line no-new-func
            const result = Function(`"use strict"; return (${expression || 0})`)();
            expression = String(result);
        } catch (e) {
            expression = '';
            alert('Invalid expression');
        }
        updateDisplay();
    }

    keys.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLButtonElement)) return;
        const key = target.getAttribute('data-key');
        const op = target.getAttribute('data-op');
        if (key) append(key);
        if (op) appendOp(op);
    });

    clearBtn.addEventListener('click', () => { expression = ''; updateDisplay(); });
    equalsBtn.addEventListener('click', evaluate);

    document.addEventListener('keydown', (e) => {
        if (/^[0-9.]$/.test(e.key)) append(e.key);
        if (['+', '-', '*', '/'].includes(e.key)) appendOp(e.key);
        if (e.key === 'Enter') evaluate();
        if (e.key === 'Escape') { expression = ''; updateDisplay(); }
    });

    updateDisplay();
})();


