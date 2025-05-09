// Minimálna verzia Firebase integrácie
console.log("Firebase Integrácia sa načítava...");

// Počkáme, kým sa celý dokument načíta
window.addEventListener('load', function() {
    console.log("Stránka je načítaná, inicializujem Firebase");
    initFirebase();
});

// Funkcia na inicializáciu Firebase
function initFirebase() {
    try {
        // Základná konfigurácia Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyAQh85OlRUCXFOY3r2_07YB19IWoLjHcWQ",
            authDomain: "b-b-multiplay.firebaseapp.com",
            projectId: "b-b-multiplay",
            storageBucket: "b-b-multiplay.firebasestorage.app",
            messagingSenderId: "72054315984",
            appId: "1:72054315984:web:9652dcffa5de241fef2ab1",
            measurementId: "G-XVPG7BFE2P",
            databaseURL: "https://b-b-multiplay-default-rtdb.europe-west1.firebasedatabase.app"
        };

        // Kontrola, či je Firebase k dispozícii
        if (typeof firebase === 'undefined') {
            console.error("CHYBA: Firebase SDK nie je načítané!");
            return;
        }

        // Inicializácia Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Získanie referencie na databázu
        const db = firebase.database();
        console.log("Firebase bola inicializovaná");

        // Anonymné prihlásenie
        firebase.auth().signInAnonymously()
            .then(result => {
                console.log("Anonymné prihlásenie úspešné, používateľ ID:", result.user.uid);
                
                // Testovací zápis do databázy
                db.ref('test').set({
                    message: "Test pripojenia",
                    timestamp: Date.now()
                })
                .then(() => {
                    console.log("TEST: Úspešný zápis do databázy!");
                    
                    // Nastavenie poslucháčov udalostí
                    setupEventListeners(db, result.user);
                })
                .catch(error => {
                    console.error("CHYBA pri zápise do databázy:", error);
                });
            })
            .catch(error => {
                console.error("CHYBA pri prihlásení:", error);
            });
    } catch (error) {
        console.error("CHYBA pri inicializácii Firebase:", error);
    }
}

// Nastavenie poslucháčov udalostí
function setupEventListeners(db, user) {
    // Počkáme na načítanie DOM
    setTimeout(() => {
        console.log("Nastavujem poslucháčov pre hernú logiku");
        
        // Nájdenie tlačidla SPIN
        const spinButton = document.getElementById('spinButton');
        if (!spinButton) {
            console.error("CHYBA: Tlačidlo SPIN nebolo nájdené!");
            return;
        }

        // Pridanie poslucháča na tlačidlo SPIN
        spinButton.addEventListener('click', function() {
            console.log("Tlačidlo SPIN bolo stlačené");
            
            // Počkáme, kým sa dokončí animácia točenia
            setTimeout(() => {
                // Získanie informácií o stave hry
                const credit = getCredit();
                const bet = getBet();
                const win = getWin();
                
                console.log(`Údaje o točení: kredit=${credit}, stávka=${bet}, výhra=${win}`);
                
                // Uloženie informácií do databázy
                saveSpinData(db, user.uid, credit, bet, win);
            }, 4000);
        });
        
        console.log("Poslucháč pre SPIN tlačidlo bol nastavený");
    }, 1000);
}

// Funkcia na získanie kreditu
function getCredit() {
    const creditElement = document.getElementById('creditDisplay');
    if (creditElement) {
        const match = creditElement.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }
    return 0;
}

// Funkcia na získanie stávky
function getBet() {
    const betElement = document.getElementById('betDisplay');
    if (betElement) {
        const match = betElement.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 1;
    }
    return 1;
}

// Funkcia na získanie výhry
function getWin() {
    const winElement = document.getElementById('winDisplay');
    if (winElement) {
        const match = winElement.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }
    return 0;
}

// Funkcia na uloženie informácií o točení
function saveSpinData(db, userId, credit, bet, win) {
    console.log("Ukladám údaje o točení do databázy...");
    
    // Aktualizácia kreditu používateľa
    db.ref('users/' + userId).update({
        credit: credit,
        lastUpdated: Date.now()
    })
    .then(() => {
        console.log("Kredit používateľa bol aktualizovaný");
    })
    .catch(error => {
        console.error("CHYBA pri aktualizácii kreditu:", error);
    });
    
    // Zaznamenanie točenia do histórie
    db.ref('spinHistory/' + userId).push({
        timestamp: Date.now(),
        bet: bet,
        win: win
    })
    .then(() => {
        console.log("História točenia bola uložená");
    })
    .catch(error => {
        console.error("CHYBA pri uložení histórie točenia:", error);
    });
}