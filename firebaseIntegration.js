// Ultrajednoduchá verzia Firebase integrácie - priame testovanie
console.log("Firebase integrácia - priamy test");

// Testovanie prístupu k Firebase - spúšťame okamžite
(function testFirebase() {
    console.log("Spúšťam priamy test Firebase...");
    
    try {
        // Kontrola, či je Firebase k dispozícii
        if (typeof firebase === 'undefined') {
            console.error("CHYBA: Firebase SDK nie je k dispozícii!");
            return;
        }
        
        console.log("Firebase SDK je k dispozícii!");
        
        // Vypíšeme verziu Firebase pre diagnostiku
        if (firebase.SDK_VERSION) {
            console.log("Firebase SDK verzia:", firebase.SDK_VERSION);
        }
        
        // Priama inicializácia Firebase
        try {
            // Kontrola, či už je Firebase inicializovaný
            try {
                const existingApp = firebase.app();
                console.log("Firebase už je inicializovaný:", existingApp.name);
            } catch (e) {
                // Firebase ešte nie je inicializovaný, inicializujeme
                firebase.initializeApp({
                    apiKey: "AIzaSyAQh85OLRUCXFOY3r2_07YBl9IWoLjHcWQ",
                    authDomain: "b-b-multiplay.firebaseapp.com",
                    databaseURL: "https://b-b-multiplay-default-rtdb.europe-west1.firebasedatabase.app",
                    projectId: "b-b-multiplay",
                    storageBucket: "b-b-multiplay.firebasestorage.app",
                    messagingSenderId: "720543159844",
                    appId: "1:720543159844:web:9652dcffa5de241fef2ab1",
                    measurementId: "G-XVPG7BFE2P"
                });
                console.log("Firebase bol úspešne inicializovaný");
            }
            
            // Priamy test prístupu k databáze
            const testRef = firebase.database().ref("test_" + new Date().getTime());
            testRef.set({
                message: "Priamy test",
                timestamp: new Date().toString()
            })
            .then(function() {
                console.log("TEST ÚSPEŠNÝ: Zápis do Firebase databázy funguje!");
                
                // Ak sa podaril test, nastavíme počúvanie na SPIN tlačidlo
                document.addEventListener('DOMContentLoaded', function() {
                    setupSpinTracking();
                });
                
                // Ak je DOM už načítaný, okamžite nastavíme tracking
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    setupSpinTracking();
                }
            })
            .catch(function(error) {
                console.error("TEST ZLYHAL: Nemožno zapisovať do Firebase databázy!", error);
            });
        } catch (error) {
            console.error("CHYBA pri inicializácii Firebase:", error);
        }
    } catch (error) {
        console.error("KRITICKÁ CHYBA pri teste Firebase:", error);
    }
})();

// Funkcia pre nastavenie sledovania spinov
function setupSpinTracking() {
    console.log("Nastavujem sledovanie spinov...");
    
    const spinButtonCheck = setInterval(function() {
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            clearInterval(spinButtonCheck);
            console.log("SPIN tlačidlo nájdené, pridávam listener");
            
            // Vygenerujeme session ID pre túto návštevu
            const sessionId = "session_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000000);
            
            // Pridáme event listener na SPIN tlačidlo
            spinButton.addEventListener('click', function() {
                console.log("SPIN tlačidlo bolo stlačené");
                
                // Počkáme, kým sa točenie dokončí
                setTimeout(function() {
                    try {
                        // Zachytíme stav hry
                        const bet = getBetAmount();
                        const win = getWinAmount();
                        const credit = getCreditAmount();
                        
                        console.log(`Stav hry: stávka=${bet}, výhra=${win}, kredit=${credit}`);
                        
                        // Zapíšeme do databázy
                        const spinData = {
                            timestamp: new Date().toString(),
                            bet: bet,
                            win: win,
                            credit: credit
                        };
                        
                        firebase.database().ref("spins/" + sessionId).push(spinData)
                            .then(function() {
                                console.log("Údaje o spine boli úspešne zapísané do databázy");
                            })
                            .catch(function(error) {
                                console.error("Chyba pri zapisovaní údajov o spine:", error);
                            });
                    } catch (error) {
                        console.error("Chyba pri spracovaní stavu hry:", error);
                    }
                }, 4000); // Počkáme 4 sekundy na dokončenie animácie
            });
        }
    }, 500); // Kontrola každých 500ms
}

// Pomocné funkcie pre získanie údajov o hre
function getBetAmount() {
    try {
        const betDisplay = document.getElementById('betDisplay');
        if (betDisplay) {
            const match = betDisplay.textContent.match(/\d+/);
            return match ? parseInt(match[0]) : 1;
        }
    } catch (error) {
        console.error("Chyba pri získavaní výšky stávky:", error);
    }
    return 1;
}

function getWinAmount() {
    try {
        const winDisplay = document.getElementById('winDisplay');
        if (winDisplay) {
            const match = winDisplay.textContent.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        }
    } catch (error) {
        console.error("Chyba pri získavaní výšky výhry:", error);
    }
    return 0;
}

function getCreditAmount() {
    try {
        const creditDisplay = document.getElementById('creditDisplay');
        if (creditDisplay) {
            const match = creditDisplay.textContent.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        }
    } catch (error) {
        console.error("Chyba pri získavaní výšky kreditu:", error);
    }
    return 0;
}
