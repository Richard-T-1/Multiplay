window.addEventListener('load', function() {
    initFirebase();
});

function initFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            return;
        }
    
        const firebaseConfig = {
            apiKey: "AIzaSyAQh85OLRUCXFOY3r2_07YBl9IWoLjHcWQ",
            authDomain: "b-b-multiplay.firebaseapp.com",
            databaseURL: "https://b-b-multiplay-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "b-b-multiplay",
            storageBucket: "b-b-multiplay.firebasestorage.app",
            messagingSenderId: "720543159844",
            appId: "1:720543159844:web:9652dcffa5de241fef2ab1",
            measurementId: "G-XVPG7BFE2P"
        };

        try {
            firebase.app();
        } catch (e) {
            firebase.initializeApp(firebaseConfig);
        }
        
        setupSpinTracking();
    } catch (error) {
    }
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month} ${year}, ${hours}:${minutes}`;
}

window.slotMachineData = {
    lastWin: 0,
    pendingRecord: false,
    sessionId: "session_" + Date.now() + "_" + Math.floor(Math.random() * 1000000),
    lastBet: 0,
    timestamp: null,
    isAnimationInProgress: false,
    recordRequested: false,
    userName: null
};

function setupSpinTracking() {
    const UICheckInterval = setInterval(function() {
        const spinButton = document.getElementById('spinButton');
        const winDisplay = document.getElementById('winDisplay');
        
        if (spinButton && winDisplay) {
            clearInterval(UICheckInterval);
            spinButton.addEventListener('click', function() {
                if (window.slotMachineData.recordRequested && window.slotMachineData.pendingRecord) {
                    recordSpin();
                }

                window.slotMachineData.lastBet = getBetAmount();
                window.slotMachineData.timestamp = new Date();
                window.slotMachineData.pendingRecord = true;
                window.slotMachineData.recordRequested = false;
                window.slotMachineData.lastWin = 0;

                setTimeout(function() {
                    if (window.slotMachineData.pendingRecord && !window.slotMachineData.isAnimationInProgress) {
                        recordSpin();
                    }
                }, 15000);
            });

            window.recordSpinResult = function(win) {
                window.slotMachineData.lastWin = win;
                window.slotMachineData.recordRequested = true;
                
                if (window.slotMachineData.pendingRecord && !window.slotMachineData.isAnimationInProgress) {
                    recordSpin();
                }
            };

            observeWinDisplay(winDisplay);
        }
    }, 500);
}

function observeWinDisplay(winDisplay) {
    const classObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const hasAnimation = winDisplay.classList.contains('win-animation');
                window.slotMachineData.isAnimationInProgress = hasAnimation;
                
                if (!hasAnimation && window.slotMachineData.recordRequested && window.slotMachineData.pendingRecord) {
                    setTimeout(() => {
                        recordSpin();
                    }, 500);
                }
            }
        });
    });
    
    classObserver.observe(winDisplay, {
        attributes: true,
        attributeFilter: ['class']
    });

    const textObserver = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const winText = winDisplay.textContent;
                const match = winText.match(/Výhra: (\d+)/);
                
                if (match) {
                    const winAmount = parseInt(match[1]);
                }
            }
        }
    });
    
    textObserver.observe(winDisplay, {
        childList: true,
        characterData: true,
        subtree: true
    });
}

function recordSpin() {
    if (!window.slotMachineData.pendingRecord) {
        return;
    }

    if (!window.authState || !window.authState.isLoggedIn || !window.authState.userName) {
        window.slotMachineData.pendingRecord = false;
        window.slotMachineData.recordRequested = false;
        return;
    }
    
    const spinData = {
        timestamp: formatDate(window.slotMachineData.timestamp),
        bet: window.slotMachineData.lastBet,
        win: window.slotMachineData.lastWin,
        credit: window.credit + (window.pendingWin || 0)
    };
    
    firebase.database().ref(window.authState.userName + "/hry/" + Date.now()).set(spinData)
        .then(function() {
            if (window.authState.isLoggedIn && window.authHelpers && window.authHelpers.saveUserCredit) {
                return window.authHelpers.saveUserCredit();
            }
        })
        .catch(function(error) {
        });

    window.slotMachineData.pendingRecord = false;
    window.slotMachineData.recordRequested = false;
}

function getBetAmount() {
    const betDisplay = document.getElementById('betDisplay');
    if (betDisplay) {
        const match = betDisplay.textContent.match(/[\d\.]+/);
        return match ? parseFloat(match[0]) : 1;
    }
    return 1;
}

function getCreditAmount() {
    const creditDisplay = document.getElementById('creditDisplay');
    if (creditDisplay) {
        const match = creditDisplay.textContent.match(/Kredit: (\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    return 0;
}