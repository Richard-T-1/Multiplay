(function() {
    'use strict';
    
    let securityActive = false;
    let consoleOpen = false;
    let gameDisabled = false;
    let securityLogsRef = null;
    
    function initFirebaseLogging() {
        setTimeout(function() {
            if (typeof firebase !== 'undefined' && firebase.database) {
                securityLogsRef = firebase.database().ref('security-logs');
            }
        }, 5000);
    }
    
    function logSecurityEvent(eventType, details = {}) {
        if (!securityLogsRef) return;
        
        const timestamp = new Date().toISOString();
        const userAgent = navigator.userAgent;
        const currentUrl = window.location.href;
        let userInfo = {
            isLoggedIn: false,
            userId: null,
            userName: null,
            userEmail: null
        };
        
        if (window.authState && window.authState.isLoggedIn) {
            userInfo = {
                isLoggedIn: true,
                userId: window.authState.userId || 'unknown',
                userName: window.authState.userName || 'unknown',
                userEmail: window.authState.userEmail || 'unknown'
            };
        }
        
        const logEntry = {
            timestamp: timestamp,
            eventType: eventType,
            userInfo: userInfo,
            browserInfo: {
                userAgent: userAgent,
                url: currentUrl,
                screenSize: `${screen.width}x${screen.height}`,
                windowSize: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language
            },
            details: details
        };

        securityLogsRef.push(logEntry).then(() => {
        }).catch((error) => {
            console.error('Failed to log security event:', error);
        });
    }
    
    function detectOpenConsole() {
        let devtools = {
            open: false,
            orientation: null
        };
        
        let consecutiveDetections = 0;

        function checkWindowSize() {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            
            if (heightDiff > threshold || widthDiff > threshold) {
                consecutiveDetections++;
                
                if (consecutiveDetections > 2 && !consoleOpen) {
                    consoleOpen = true;
                    onConsoleDetected('window-size-detection');
                }
            } else {
                consecutiveDetections = 0;
                if (consoleOpen) {
                    consoleOpen = false;
                    onConsoleClosed();
                }
            }
        }
        
        function timingDetection() {
            let start = performance.now();
            debugger;
            let end = performance.now();
            
            if (end - start > 100) {
                if (!consoleOpen) {
                    consoleOpen = true;
                    onConsoleDetected('timing-detection');
                }
            }
        }
        
        function consoleLogDetection() {
            const img = new Image();
            let isConsoleOpen = false;
            
            Object.defineProperty(img, 'id', {
                get: function() {
                    isConsoleOpen = true;
                    if (!consoleOpen) {
                        consoleOpen = true;
                        onConsoleDetected('console-log-detection');
                    }
                }
            });
            
            console.clear();
        }
        
        setInterval(function() {
            if (!securityActive) return;
            
            checkWindowSize();

            if (Math.random() < 0.3) {
                timingDetection();
            }
            
            consoleLogDetection();
        }, 1000);
    }

    function onConsoleDetected(detectionMethod) {        
        logSecurityEvent('CONSOLE_OPENED', {
            detectionMethod: detectionMethod,
            gameCredit: window.credit || 0,
            gameState: {
                isSpinning: window.isSpinning || false,
                currentBet: window.currentBet || 0,
                pendingWin: window.pendingWin || 0
            }
        });

        hideGameData();
        disableGame();
        if (console.clear) {
            console.clear();
        }

        showFakeData();
    }
    
    function onConsoleClosed() {
        logSecurityEvent('CONSOLE_CLOSED', {
            gameDuration: Date.now() - (window.gameStartTime || Date.now()),
            actionsAttempted: window.suspiciousActions || 0
        });
        
        if (gameDisabled) {
            enableGame();
        }
    }

    function monitorSuspiciousActions() {
        window.suspiciousActions = 0;

        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            const suspiciousKeys = ['hack', 'cheat', 'infinite', 'admin', 'god', 'unlimited'];
            
            if (suspiciousKeys.some(suspicious => key.toLowerCase().includes(suspicious))) {
                window.suspiciousActions++;
                
                logSecurityEvent('SUSPICIOUS_LOCALSTORAGE', {
                    attemptedKey: key,
                    attemptedValue: value.substring(0, 100),
                    totalAttempts: window.suspiciousActions
                });
                
                return false;
            }
            
            return originalSetItem.call(localStorage, key, value);
        };

        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (obj === window) {
                const suspiciousProps = ['credit', 'rtp', 'win', 'admin', 'hack'];
                
                if (suspiciousProps.some(suspicious => prop.toLowerCase().includes(suspicious))) {
                    window.suspiciousActions++;
                    
                    logSecurityEvent('SUSPICIOUS_WINDOW_MODIFICATION', {
                        attemptedProperty: prop,
                        propertyDescriptor: JSON.stringify(descriptor).substring(0, 200),
                        totalAttempts: window.suspiciousActions
                    });
                    
                    return obj;
                }
            }
            
            return originalDefineProperty.call(Object, obj, prop, descriptor);
        };

        const originalEval = window.eval;
        window.eval = function(code) {
            window.suspiciousActions++;
            
            logSecurityEvent('EVAL_ATTEMPT', {
                codeSnippet: code.substring(0, 200),
                totalAttempts: window.suspiciousActions
            });
            
            return undefined;
        };
    }
    
    function hideGameData() {
        if (window.rtpManager) {
            window._hiddenRTP = window.rtpManager;
            window.rtpManager = undefined;
        }

        if (window.rtpDebug) {
            window._hiddenDebug = window.rtpDebug;
            window.rtpDebug = undefined;
        }
        
        if (typeof window.credit !== 'undefined') {
            window._hiddenCredit = window.credit;
            window.credit = undefined;
        }
        
        const sensitiveVars = ['authState', 'slotMachineData', 'pendingWin', 'currentBet'];
        sensitiveVars.forEach(varName => {
            if (window[varName]) {
                window['_hidden' + varName] = window[varName];
                window[varName] = undefined;
            }
        });
    }
    
    function showFakeData() {
        window.rtpManager = {
            stats: { totalBets: 1000, totalWins: 800, spinCount: 50 },
            targetRTP: 80,
            getCurrentRTP: () => 80.0,
            adjustWinAmount: (win, bet) => {
                logSecurityEvent('FAKE_RTP_ACCESS', {
                    attemptedWin: win,
                    attemptedBet: bet
                });
                return win;
            }
        };

        window.rtpDebug = {
            showStats: () => {
                logSecurityEvent('FAKE_DEBUG_ACCESS', { action: 'showStats' });
                console.log('RTP: 80% | Safe mode active');
            },
            reset: () => {
                logSecurityEvent('FAKE_DEBUG_ACCESS', { action: 'reset' });
                console.log('Access denied');
            },
            setRTP: (value) => {
                logSecurityEvent('FAKE_DEBUG_ACCESS', { action: 'setRTP', value: value });
                console.log('Permission denied');
            }
        };

        window.credit = 5000;
        window.addCredit = function(amount) {
            logSecurityEvent('FAKE_CREDIT_ACCESS', { action: 'addCredit', amount: amount });
            console.log('Function disabled for security');
        };
        
        window.setCredit = function(amount) {
            logSecurityEvent('FAKE_CREDIT_ACCESS', { action: 'setCredit', amount: amount });
            console.log('Unauthorized access attempt logged');
        };
    }

    function disableGame() {
        gameDisabled = true;
        
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            spinButton.disabled = true;
            spinButton.style.opacity = '0.5';
            spinButton.title = 'Game temporarily disabled';
        }
        
        const autoButton = document.getElementById('autoButton');
        if (autoButton) {
            autoButton.disabled = true;
            autoButton.style.opacity = '0.5';
        }
        
        console.log('🔒 Game functions temporarily disabled while console is open');
    }
    
    function enableGame() {
        gameDisabled = false;

        if (window._hiddenRTP) {
            window.rtpManager = window._hiddenRTP;
            delete window._hiddenRTP;
        }
        
        if (window._hiddenDebug) {
            window.rtpDebug = window._hiddenDebug;
            delete window._hiddenDebug;
        }
        
        if (typeof window._hiddenCredit !== 'undefined') {
            window.credit = window._hiddenCredit;
            delete window._hiddenCredit;
        }
        
        const sensitiveVars = ['authState', 'slotMachineData', 'pendingWin', 'currentBet'];
        sensitiveVars.forEach(varName => {
            const hiddenVar = '_hidden' + varName;
            if (window[hiddenVar]) {
                window[varName] = window[hiddenVar];
                delete window[hiddenVar];
            }
        });
        
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            spinButton.disabled = false;
            spinButton.style.opacity = '1';
            spinButton.title = '';
        }
        
        const autoButton = document.getElementById('autoButton');
        if (autoButton) {
            autoButton.disabled = false;
            autoButton.style.opacity = '1';
        }
        
        setTimeout(() => {
            if (console.clear) {
                console.clear();
            }
        }, 100);
    }
    
    function basicProtection() {
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 75) ||
                (e.ctrlKey && e.keyCode === 85) ||
                (e.ctrlKey && e.keyCode === 83)) {
                
                logSecurityEvent('KEYBOARD_SHORTCUT_BLOCKED', {
                    keyCode: e.keyCode,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey
                });
                
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        document.addEventListener('contextmenu', function(e) {
            logSecurityEvent('RIGHT_CLICK_BLOCKED', {
                elementTag: e.target.tagName,
                elementId: e.target.id
            });
            
            e.preventDefault();
            return false;
        }, true);

        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        setTimeout(function() {
            if (document.body) {
                document.body.style.userSelect = 'none';
                document.body.style.webkitUserSelect = 'none';
                document.body.style.mozUserSelect = 'none';
                document.body.style.msUserSelect = 'none';
            }
        }, 1000);
    }
    
    function initSecurity() {
        securityActive = true;
        window.gameStartTime = Date.now();
        
        logSecurityEvent('SECURITY_SYSTEM_STARTED', {
            timestamp: new Date().toISOString(),
            gameVersion: '1.0'
        });
        
        basicProtection();
        monitorSuspiciousActions();
        detectOpenConsole();
    
        setTimeout(function() {
            if (window.rtpManager && !window.secureRTP) {
                window.secureRTP = {
                    adjustWin: function(originalWin, betAmount) {
                        if (gameDisabled) return originalWin;
                        if (window.rtpManager && window.rtpManager.adjustWinAmount) {
                            return window.rtpManager.adjustWinAmount(originalWin, betAmount);
                        }
                        return originalWin;
                    },
                    isActive: function() {
                        return !gameDisabled;
                    }
                };
            }
        }, 2000);
        
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initFirebaseLogging();
            setTimeout(initSecurity, 3000);
        });
    } else {
        initFirebaseLogging();
        setTimeout(initSecurity, 3000);
    }

})();