window.addEventListener('load', function() {
    initFirebase();
});

function initFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK nie je dostupné");
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
        console.error("Chyba pri inicializácii Firebase:", error);
    }
}


function setupSpinTracking() {
    const spinButtonCheck = setInterval(function() {
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            clearInterval(spinButtonCheck);
            const sessionId = "session_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
            
            spinButton.addEventListener('click', function() {
                setTimeout(function() {
                    const spinData = {
                        timestamp: new Date().toString(),
                        bet: getBetAmount(),
                        win: getWinAmount(),
                        credit: getCreditAmount()
                    };
                    
                    firebase.database().ref("spins/" + sessionId).push(spinData)
                        .catch(function(error) {
                            console.error("Chyba pri ukladaní údajov o točení:", error);
                        });
                }, 4000);
            });
        }
    }, 500);
}

function getBetAmount() {
    const betDisplay = document.getElementById('betDisplay');
    if (betDisplay) {
        const match = betDisplay.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 1;
    }
    return 1;
}

function getWinAmount() {
    const winDisplay = document.getElementById('winDisplay');
    if (winDisplay) {
        const match = winDisplay.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }
    return 0;
}

function getCreditAmount() {
    const creditDisplay = document.getElementById('creditDisplay');
    if (creditDisplay) {
        const match = creditDisplay.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }
    return 0;
}