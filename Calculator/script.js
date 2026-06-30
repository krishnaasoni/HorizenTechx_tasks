(() => {
        const expressionEl = document.getElementById('expression');
        const resultEl = document.getElementById('result');
        const sciRow = document.getElementById('sciRow');
        const sciToggle = document.getElementById('sciToggle');
        const historyToggle = document.getElementById('historyToggle');
        const historyPanel = document.getElementById('historyPanel');
        const historyList = document.getElementById('historyList');
        const clearHist = document.getElementById('clearHist');
        const voiceBtn = document.getElementById('voiceBtn');
        const calculator = document.querySelector('.calculator');
        const themeDots = document.querySelectorAll('.theme-dot');
        const fx = document.getElementById('fx');

        let expr = '';
        let history = JSON.parse(localStorage.getItem('neon_history') || '[]');
        let justEvaluated = false;
        renderHistory();

        /* Theme */
        applyTheme(localStorage.getItem('neon_theme') || 'cyan');
        themeDots.forEach(d => d.addEventListener('click', () => applyTheme(d.dataset.theme)));
        function applyTheme(name) {
            document.body.dataset.theme = name;
            localStorage.setItem('neon_theme', name);
            themeDots.forEach(d => d.classList.toggle('active', d.dataset.theme === name));
        }

        /* Display */
        function updateDisplay() { expressionEl.textContent = expr || '0'; }
        function softPreview() {
            if (!expr) { resultEl.innerHTML = '&nbsp;'; return; }
            try {
                const v = evaluate(expr, true);
                if (v === null || Number.isNaN(v)) { resultEl.innerHTML = '&nbsp;'; return; }
                resultEl.textContent = formatNumber(v);
            } catch { resultEl.innerHTML = '&nbsp;'; }
        }
        function formatNumber(n) {
            if (typeof n !== 'number') return String(n);
            if (!isFinite(n)) return '∞';
            const r = Math.round(n * 1e12) / 1e12;
            if (Math.abs(r) >= 1e12 || (Math.abs(r) > 0 && Math.abs(r) < 1e-6)) return r.toExponential(6);
            return String(r);
        }

        /* Actions */
        function insert(val) {
            if (justEvaluated) {
                if (!/[+\-*/%.^]/.test(val) && val !== '**') expr = '';
                justEvaluated = false;
            }
            expr += val; updateDisplay(); softPreview();
        }
        function clearAll() { expr = ''; justEvaluated = false; updateDisplay(); resultEl.innerHTML = '&nbsp;'; }
        function back() {
            if (justEvaluated) { clearAll(); return; }
            const tokens = ['sqrt(', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', 'pi', '**'];
            for (const t of tokens) if (expr.endsWith(t)) { expr = expr.slice(0, -t.length); updateDisplay(); softPreview(); return; }
            expr = expr.slice(0, -1); updateDisplay(); softPreview();
        }
        function applyFn(fn) { if (justEvaluated) { expr = ''; justEvaluated = false; } expr += `${fn}(`; updateDisplay(); softPreview(); }
        function applyFact() { if (justEvaluated) justEvaluated = false; expr += '!'; updateDisplay(); softPreview(); }
        function equals() {
            if (!expr) return;
            try {
                const v = evaluate(expr, false);
                if (v === null || Number.isNaN(v)) throw new Error('Invalid');
                const out = formatNumber(v);
                pushHistory(expr, out);
                resultEl.textContent = out;
                resultEl.classList.remove('flash'); void resultEl.offsetWidth; resultEl.classList.add('flash');
                expr = out; expressionEl.textContent = out; justEvaluated = true;
            } catch { resultEl.textContent = 'Error'; }
        }

        /* Safe evaluator */
        function evaluate(input, isPreview) {
            let s = input.trim(); if (!s) return null;
            if (isPreview) {
                const o = (s.match(/\(/g) || []).length, c = (s.match(/\)/g) || []).length;
                if (o > c) s += ')'.repeat(o - c);
                if (/[+\-*/^.(]$|\*\*$/.test(s)) return null;
            }
            s = s.replace(/(\d+(?:\.\d+)?|\))\s*!/g, 'factorial($1)')
                .replace(/\^/g, '**')
                .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
            if (!/^[\d+\-*/().\s,a-zA-Z_]+$/.test(s)) throw new Error('Illegal');
            const idents = s.match(/[a-zA-Z_]+/g) || [];
            const ok = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'factorial', 'pi', 'e', 'abs', 'PI', 'E']);
            for (const id of idents) if (!ok.has(id)) throw new Error('Unknown: ' + id);
            const ctx = {
                sin: x => Math.sin(x * Math.PI / 180), cos: x => Math.cos(x * Math.PI / 180), tan: x => Math.tan(x * Math.PI / 180),
                log: x => Math.log10(x), ln: Math.log, sqrt: Math.sqrt, abs: Math.abs,
                factorial, pi: Math.PI, e: Math.E, PI: Math.PI, E: Math.E
            };
            return new Function(...Object.keys(ctx), `"use strict";return (${s});`)(...Object.values(ctx));
        }
        function factorial(n) {
            if (n < 0 || !Number.isFinite(n)) return NaN;
            if (n > 170) return Infinity;
            if (Math.floor(n) !== n) return gamma(n + 1);
            let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
        }
        function gamma(z) {
            const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
            if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
            z -= 1; let x = p[0]; for (let i = 1; i < 9; i++) x += p[i] / (z + i);
            const t = z + 7.5; return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
        }

        /* History */
        function pushHistory(e, r) { history.unshift({ e, r, t: Date.now() }); history = history.slice(0, 40); localStorage.setItem('neon_history', JSON.stringify(history)); renderHistory(); }
        function renderHistory() {
            historyList.innerHTML = history.map((h, i) => `<li data-i="${i}"><span class="e">${esc(h.e)} =</span><span class="r">${esc(h.r)}</span></li>`).join('') || '<li style="color:var(--muted);cursor:default">no entries</li>';
        }
        function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
        historyList.addEventListener('click', e => {
            const li = e.target.closest('li[data-i]'); if (!li) return;
            const h = history[+li.dataset.i]; if (!h) return;
            expr = h.r; expressionEl.textContent = h.e; resultEl.textContent = h.r; justEvaluated = true;
        });
        clearHist.addEventListener('click', () => { history = []; localStorage.setItem('neon_history', '[]'); renderHistory(); });

        /* Toggles */
        sciToggle.addEventListener('click', () => { sciRow.classList.toggle('open'); sciToggle.classList.toggle('active'); });
        historyToggle.addEventListener('click', () => {
            historyPanel.classList.toggle('open');
            historyToggle.classList.toggle('active');
            calculator.classList.toggle('with-history', historyPanel.classList.contains('open'));
        });

        /* Button clicks + visual fx */
        document.querySelectorAll('.key, .sci-row .key').forEach(btn => {
            btn.addEventListener('click', (e) => {
                burstEffect(btn, e); spawnParticles(e);
                const a = btn.dataset.action, v = btn.dataset.val;
                if (a === 'ins') insert(v);
                else if (a === 'clear') clearAll();
                else if (a === 'back') back();
                else if (a === 'equals') equals();
                else if (a === 'fn') applyFn(btn.dataset.fn);
                else if (a === 'fact') applyFact();
            });
        });
        function burstEffect(btn, evt) {
            const r = btn.getBoundingClientRect();
            const x = evt ? ((evt.clientX - r.left) / r.width) * 100 : 50;
            const y = evt ? ((evt.clientY - r.top) / r.height) * 100 : 50;
            btn.style.setProperty('--cx', x + '%'); btn.style.setProperty('--cy', y + '%');
            btn.classList.remove('burst', 'pressed'); void btn.offsetWidth; btn.classList.add('burst', 'pressed');
            const rp = document.createElement('span'); rp.className = 'ripple';
            rp.style.left = x + '%'; rp.style.top = y + '%'; btn.appendChild(rp);
            setTimeout(() => { btn.classList.remove('burst', 'pressed'); rp.remove(); }, 700);
        }

        /* Keyboard */
        window.addEventListener('keydown', e => {
            const k = e.key, map = { '*': '*', '/': '/', '+': '+', '-': '-', '.': '.', '%': '%', '(': '(', ')': ')', '^': '**' };
            if (/^[0-9]$/.test(k)) click(`.key[data-val="${k}"]`);
            else if (k in map) click(`.key[data-val="${map[k].replace(/"/g, '\\"')}"]`);
            else if (k === 'Enter' || k === '=') { e.preventDefault(); click('.key[data-action="equals"]'); }
            else if (k === 'Backspace') click('.key[data-action="back"]');
            else if (k.toLowerCase() === 'c' || k === 'Escape') click('.key[data-action="clear"]');
        });
        function click(sel) { const b = document.querySelector(sel); if (b) b.click(); }

        /* Voice */
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (Speech) {
            const rec = new Speech(); rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
            voiceBtn.addEventListener('click', () => { try { voiceBtn.classList.contains('listening') ? rec.stop() : rec.start(); } catch { } });
            rec.onstart = () => voiceBtn.classList.add('listening');
            rec.onend = () => voiceBtn.classList.remove('listening');
            rec.onerror = () => voiceBtn.classList.remove('listening');
            rec.onresult = (ev) => { const p = parseSpeech(ev.results[0][0].transcript); if (p) { clearAll(); expr = p; updateDisplay(); softPreview(); equals(); } };
        } else {
            voiceBtn.addEventListener('click', () => { resultEl.textContent = 'No voice support'; });
        }
        function parseSpeech(t) {
            let s = t.toLowerCase().trim();
            const w = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90', hundred: '100', thousand: '1000' };
            Object.entries(w).forEach(([k, n]) => s = s.replace(new RegExp(`\\b${k}\\b`, 'g'), n));
            s = s.replace(/plus|add/g, '+').replace(/minus|subtract|less/g, '-')
                .replace(/times|multiplied by|multiply by|into/g, '*')
                .replace(/divided by|over/g, '/').replace(/percent/g, '%')
                .replace(/point|dot/g, '.').replace(/square root of/g, 'sqrt(')
                .replace(/[^0-9+\-*/().% a-z]/g, '').replace(/\s+/g, '');
            const o = (s.match(/\(/g) || []).length, c = (s.match(/\)/g) || []).length;
            if (o > c) s += ')'.repeat(o - c);
            return s;
        }

        /* Particle FX */
        const ctx = fx.getContext('2d');
        let particles = [];
        function resize() { fx.width = innerWidth; fx.height = innerHeight; }
        resize(); window.addEventListener('resize', resize);
        function spawnParticles(evt) {
            if (!evt) return;
            const x = evt.clientX, y = evt.clientY;
            const color = getComputedStyle(document.body).getPropertyValue('--neon').trim() || '#1ABC9C';
            for (let i = 0; i < 14; i++) particles.push({ x, y, vx: (Math.random() - .5) * 6, vy: (Math.random() - .5) * 6 - 1, life: 1, size: Math.random() * 3 + 1.2, color });
        }
        (function loop() {
            ctx.clearRect(0, 0, fx.width, fx.height);
            particles = particles.filter(p => p.life > 0);
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.98; p.vy *= 0.98; p.life -= 0.025;
                ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.color;
                ctx.shadowBlur = 10; ctx.shadowColor = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1; ctx.shadowBlur = 0;
            requestAnimationFrame(loop);
        })();

        updateDisplay();
    })();