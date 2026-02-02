// ==========================================
// V6 OPTIMISÉE - PERFORMANCES + UX
// ==========================================

console.log('🚀 V6 - Chargement optimisé...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM chargé');
    
    // ==========================================
    // 1. MODE SOMBRE
    // ==========================================
    
    function initDarkMode() {
        const saved = localStorage.getItem('cc_dark_mode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        console.log('✅ Mode:', theme);
    }
    
    function toggleDarkMode() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('cc_dark_mode', newTheme);
        console.log('🌓 Basculé:', newTheme);
    }
    
    initDarkMode();
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleDarkMode);
        console.log('✅ Toggle installé');
    }
    
    // ==========================================
    // 2. SLIDERS - OPTIMISÉS
    // ==========================================
    
    function setupSlider(sliderId, valueId, min, max, unit) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        if (!slider || !valueDisplay) {
            console.error('❌ Slider introuvable:', sliderId);
            return;
        }
        
        function updateDisplay() {
            const val = parseInt(slider.value);
            valueDisplay.textContent = val === 1 ? `1 ${unit.replace('s', '')}` : `${val} ${unit}`;
            
            const percent = ((val - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, var(--secondary) 0%, var(--secondary) ${percent}%, rgba(127, 169, 155, 0.2) ${percent}%, rgba(127, 169, 155, 0.2) 100%)`;
        }
        
        slider.addEventListener('input', updateDisplay);
        updateDisplay();
        
        console.log('✅ Slider:', sliderId);
    }
    
    setupSlider('sessionDuration', 'durationValue', 3, 30, 'minutes');
    setupSlider('inhaleTime', 'inhaleValue', 3, 10, 'secondes');
    setupSlider('exhaleTime', 'exhaleValue', 3, 10, 'secondes');
    
    // ==========================================
    // 3. SESSION OVERLAY - OPTIMISÉ
    // ==========================================
    
    const sessionFullscreen = document.getElementById('sessionFullscreen');
    const sessionBubble = document.getElementById('sessionBubble');
    const sessionBubbleText = document.getElementById('sessionBubbleText');
    const sessionTimerDisplay = document.getElementById('sessionTimerDisplay');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtnSession = document.getElementById('stopBtnSession');
    const sessionCloseBtn = document.getElementById('sessionCloseBtn');
    const pauseIcon = document.getElementById('pauseIcon');
    const pauseText = document.getElementById('pauseText');
    
    let sessionIsPaused = false;
    let syncTimer = null; // UN SEUL TIMER
    
    // Sync OPTIMISÉ - 500ms au lieu de 100ms
    function syncDisplay() {
        if (typeof isRunning === 'undefined' || !isRunning) return;
        
        // Timer
        if (typeof totalTime !== 'undefined' && typeof elapsedTime !== 'undefined') {
            const remaining = totalTime - elapsedTime;
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            sessionTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        
        // Bulle - SYNC avec currentPhase
        if (typeof currentPhase !== 'undefined') {
            if (currentPhase === 'inhale') {
                sessionBubble.className = 'session-bubble inhaling';
                sessionBubbleText.textContent = 'Inspirez';
                sessionBubbleText.classList.add('visible');
            } else if (currentPhase === 'exhale') {
                sessionBubble.className = 'session-bubble exhaling';
                sessionBubbleText.textContent = 'Expirez';
                sessionBubbleText.classList.add('visible');
            }
        }
    }
    
    // Fonction pour FERMER proprement
    function closeSession() {
        console.log('🔴 Fermeture session');
        
        sessionFullscreen.classList.remove('active');
        sessionIsPaused = false;
        
        // NETTOYER le timer
        if (syncTimer) {
            clearInterval(syncTimer);
            syncTimer = null;
        }
        
        // Reset classes
        sessionBubble.className = 'session-bubble';
        sessionBubbleText.classList.remove('visible');
    }
    
    // START
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('🎬 Démarrage...');
            
            setTimeout(function() {
                if (typeof isRunning !== 'undefined' && isRunning) {
                    // Afficher overlay
                    sessionFullscreen.classList.add('active');
                    sessionIsPaused = false;
                    pauseIcon.textContent = '⏸️';
                    pauseText.textContent = 'Pause';
                    
                    // Démarrer sync OPTIMISÉ (500ms)
                    if (syncTimer) clearInterval(syncTimer);
                    syncTimer = setInterval(syncDisplay, 500);
                    syncDisplay(); // Immédiat
                    
                    console.log('✅ Overlay affiché');
                } else {
                    // Retry
                    setTimeout(function() {
                        if (typeof isRunning !== 'undefined' && isRunning) {
                            sessionFullscreen.classList.add('active');
                            if (syncTimer) clearInterval(syncTimer);
                            syncTimer = setInterval(syncDisplay, 500);
                            syncDisplay();
                        }
                    }, 500);
                }
            }, 300);
        });
        console.log('✅ StartBtn');
    }
    
    // PAUSE
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            if (typeof isRunning === 'undefined' || !isRunning) return;
            
            sessionIsPaused = !sessionIsPaused;
            
            if (sessionIsPaused) {
                // PAUSE
                pauseIcon.textContent = '▶️';
                pauseText.textContent = 'Reprendre';
                
                if (typeof sessionTimer !== 'undefined' && sessionTimer) {
                    clearInterval(sessionTimer);
                }
                if (typeof phaseTimer !== 'undefined' && phaseTimer) {
                    clearTimeout(phaseTimer);
                }
                if (typeof backgroundAudio !== 'undefined' && backgroundAudio) {
                    backgroundAudio.pause();
                }
                
                console.log('⏸️ PAUSE');
            } else {
                // REPRENDRE
                pauseIcon.textContent = '⏸️';
                pauseText.textContent = 'Pause';
                
                if (typeof backgroundAudio !== 'undefined' && backgroundAudio) {
                    backgroundAudio.play().catch(e => {});
                }
                
                // Redémarrer timer
                if (typeof sessionTimer !== 'undefined') {
                    window.sessionTimer = setInterval(function() {
                        if (typeof elapsedTime !== 'undefined') elapsedTime++;
                        if (typeof updateProgress === 'function') updateProgress();
                        
                        if (typeof totalTime !== 'undefined' && elapsedTime >= totalTime) {
                            if (typeof stopSession === 'function') stopSession(true);
                        }
                    }, 1000);
                }
                
                // Reprendre phase
                if (typeof currentPhase !== 'undefined') {
                    if (currentPhase === 'inhale' && typeof startInhale === 'function') {
                        startInhale();
                    } else if (currentPhase === 'exhale' && typeof startExhale === 'function') {
                        startExhale();
                    }
                }
                
                console.log('▶️ REPRISE');
            }
        });
        console.log('✅ PauseBtn');
    }
    
    // STOP
    if (stopBtnSession) {
        stopBtnSession.addEventListener('click', function() {
            if (typeof isRunning === 'undefined' || !isRunning) return;
            
            closeSession();
            
            const stopBtn = document.getElementById('stopBtn');
            if (stopBtn) stopBtn.click();
            
            console.log('⏹️ STOP');
        });
        console.log('✅ StopBtn');
    }
    
    // FERMETURE ✖️
    if (sessionCloseBtn) {
        sessionCloseBtn.addEventListener('click', function() {
            if (typeof isRunning === 'undefined' || !isRunning) return;
            
            closeSession();
            
            const stopBtn = document.getElementById('stopBtn');
            if (stopBtn) stopBtn.click();
            
            console.log('✖️ Fermé');
        });
        console.log('✅ CloseBtn');
    }
    
    // TOUCHE ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sessionFullscreen.classList.contains('active')) {
            if (typeof isRunning !== 'undefined' && isRunning) {
                closeSession();
                const stopBtn = document.getElementById('stopBtn');
                if (stopBtn) stopBtn.click();
                console.log('⌨️ ESC pressée');
            }
        }
    });
    console.log('✅ Touche ESC activée');
    
    // Fermer à la fin naturelle
    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) {
        stopBtn.addEventListener('click', closeSession);
    }
    
    // Observer pour fermer quand endScreen apparaît
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const endScreen = document.getElementById('endScreen');
                if (endScreen && endScreen.classList.contains('show')) {
                    closeSession();
                }
            }
        });
    });
    
    const endScreen = document.getElementById('endScreen');
    if (endScreen) {
        observer.observe(endScreen, { attributes: true });
    }
    
    // ==========================================
    // 4. BOUTON "À BIENTÔT"
    // ==========================================
    
    const endScreenBtn = document.getElementById('endScreenCloseBtn');
    if (endScreenBtn) {
        endScreenBtn.onclick = null;
        
        endScreenBtn.addEventListener('click', function() {
            const endScreenEl = document.getElementById('endScreen');
            if (endScreenEl) {
                endScreenEl.classList.remove('show');
                endScreenEl.setAttribute('aria-hidden', 'true');
            }
            document.body.classList.remove('modal-open');
            
            window.close();
            
            setTimeout(function() {
                if (!window.closed) {
                    document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Montserrat, sans-serif; color: var(--text-color); flex-direction: column; gap: 20px; background: linear-gradient(135deg, var(--bg-start) 0%, var(--bg-end) 100%);"><h1 style="font-family: Cormorant Garamond, serif; font-size: 3rem;">À bientôt ! 🌿</h1><p style="opacity: 0.7; font-size: 1.2rem;">Prenez soin de vous</p></div>';
                }
            }, 100);
        });
        
        console.log('✅ À bientôt');
    }
    
    console.log('✅✅✅ V6 OPTIMISÉE CHARGÉE !');
});
