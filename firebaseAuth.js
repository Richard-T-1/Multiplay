window.authState = {
    isLoggedIn: false,
    userId: null,
    userEmail: null,
    userName: null,
    isAuthReady: false
};

window.addEventListener('load', function() {
    initAuthSystem();
});

function initAuthSystem() {
    try {
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK nie je dostupné");
            return;
        }

        // Počkáme na inicializáciu Firebase z hlavného súboru
        const checkFirebaseInterval = setInterval(() => {
            if (firebase.app && firebase.auth) {
                clearInterval(checkFirebaseInterval);
                setupAuthListeners();
            }
        }, 100);

    } catch (error) {
        console.error("Chyba pri inicializácii autentifikačného systému:", error);
    }
}

function setupAuthListeners() {
    console.log("Nastavujem autentifikačných poslucháčov");
    
    // Vytvoríme overlay pre prihlásenie a registráciu
    createAuthOverlay();
    
    // Počúvame na zmeny stavu autentifikácie
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Používateľ je prihlásený
            console.log("Používateľ je prihlásený:", user.uid);
            window.authState.isLoggedIn = true;
            window.authState.userId = user.uid;
            window.authState.userEmail = user.email;
            window.authState.userName = user.displayName || user.email;
            window.authState.isAuthReady = true;
            
            // Skryjeme prihlasovací overlay
            hideAuthOverlay();
            
            // Môžeme aktualizovať UI, ak je potrebné
            updateUIForLoggedUser();
        } else {
            // Používateľ nie je prihlásený
            console.log("Používateľ nie je prihlásený");
            window.authState.isLoggedIn = false;
            window.authState.userId = null;
            window.authState.userEmail = null;
            window.authState.userName = null;
            window.authState.isAuthReady = true;
            
            // Zobrazíme prihlasovací overlay
            showAuthOverlay();
        }
    });
}

function createAuthOverlay() {
    // Vytvorenie container elementu pre autentifikačný overlay
    const authOverlay = document.createElement('div');
    authOverlay.id = 'authOverlay';
    authOverlay.style.position = 'fixed';
    authOverlay.style.top = '0';
    authOverlay.style.left = '0';
    authOverlay.style.width = '100%';
    authOverlay.style.height = '100%';
    authOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    authOverlay.style.display = 'flex';
    authOverlay.style.justifyContent = 'center';
    authOverlay.style.alignItems = 'center';
    authOverlay.style.zIndex = '1000';
    
    // Autentifikačný box
    const authBox = document.createElement('div');
    authBox.className = 'auth-box';
    authBox.style.backgroundColor = '#111';
    authBox.style.border = '2px solid #f00';
    authBox.style.borderRadius = '10px';
    authBox.style.padding = '30px';
    authBox.style.width = '80%';
    authBox.style.maxWidth = '400px';
    authBox.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
    
    // Nadpis
    const title = document.createElement('h2');
    title.textContent = 'B&B MULTIPLAY';
    title.style.color = '#ffcc00';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.textShadow = '0 0 5px #ff6600';
    
    // Tlačidlá pre prepínanie medzi prihlásením a registráciou
    const tabContainer = document.createElement('div');
    tabContainer.style.display = 'flex';
    tabContainer.style.marginBottom = '20px';
    
    const loginTab = document.createElement('button');
    loginTab.id = 'loginTab';
    loginTab.textContent = 'Prihlásenie';
    loginTab.style.flex = '1';
    loginTab.style.padding = '10px';
    loginTab.style.background = '#f00';
    loginTab.style.color = 'white';
    loginTab.style.border = 'none';
    loginTab.style.borderTopLeftRadius = '5px';
    loginTab.style.borderBottomLeftRadius = '5px';
    loginTab.style.cursor = 'pointer';
    
    const registerTab = document.createElement('button');
    registerTab.id = 'registerTab';
    registerTab.textContent = 'Registrácia';
    registerTab.style.flex = '1';
    registerTab.style.padding = '10px';
    registerTab.style.background = '#333';
    registerTab.style.color = 'white';
    registerTab.style.border = 'none';
    registerTab.style.borderTopRightRadius = '5px';
    registerTab.style.borderBottomRightRadius = '5px';
    registerTab.style.cursor = 'pointer';
    
    tabContainer.appendChild(loginTab);
    tabContainer.appendChild(registerTab);
    
    // Prihlasovací formulár
    const loginForm = document.createElement('div');
    loginForm.id = 'loginForm';
    
    const loginEmailInput = document.createElement('input');
    loginEmailInput.type = 'email';
    loginEmailInput.id = 'loginEmail';
    loginEmailInput.placeholder = 'E-mail';
    loginEmailInput.style.width = '100%';
    loginEmailInput.style.padding = '10px';
    loginEmailInput.style.marginBottom = '10px';
    loginEmailInput.style.border = '1px solid #500';
    loginEmailInput.style.borderRadius = '5px';
    loginEmailInput.style.backgroundColor = '#222';
    loginEmailInput.style.color = 'white';
    
    const loginPasswordInput = document.createElement('input');
    loginPasswordInput.type = 'password';
    loginPasswordInput.id = 'loginPassword';
    loginPasswordInput.placeholder = 'Heslo';
    loginPasswordInput.style.width = '100%';
    loginPasswordInput.style.padding = '10px';
    loginPasswordInput.style.marginBottom = '20px';
    loginPasswordInput.style.border = '1px solid #500';
    loginPasswordInput.style.borderRadius = '5px';
    loginPasswordInput.style.backgroundColor = '#222';
    loginPasswordInput.style.color = 'white';
    
    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.textContent = 'Prihlásiť sa';
    loginButton.style.width = '100%';
    loginButton.style.padding = '10px';
    loginButton.style.background = '#f00';
    loginButton.style.color = 'white';
    loginButton.style.border = 'none';
    loginButton.style.borderRadius = '5px';
    loginButton.style.cursor = 'pointer';
    loginButton.style.fontWeight = 'bold';
    
    loginForm.appendChild(loginEmailInput);
    loginForm.appendChild(loginPasswordInput);
    loginForm.appendChild(loginButton);
    
    // Registračný formulár
    const registerForm = document.createElement('div');
    registerForm.id = 'registerForm';
    registerForm.style.display = 'none';
    
    const registerNameInput = document.createElement('input');
    registerNameInput.type = 'text';
    registerNameInput.id = 'registerName';
    registerNameInput.placeholder = 'Meno';
    registerNameInput.style.width = '100%';
    registerNameInput.style.padding = '10px';
    registerNameInput.style.marginBottom = '10px';
    registerNameInput.style.border = '1px solid #500';
    registerNameInput.style.borderRadius = '5px';
    registerNameInput.style.backgroundColor = '#222';
    registerNameInput.style.color = 'white';
    
    const registerEmailInput = document.createElement('input');
    registerEmailInput.type = 'email';
    registerEmailInput.id = 'registerEmail';
    registerEmailInput.placeholder = 'E-mail';
    registerEmailInput.style.width = '100%';
    registerEmailInput.style.padding = '10px';
    registerEmailInput.style.marginBottom = '10px';
    registerEmailInput.style.border = '1px solid #500';
    registerEmailInput.style.borderRadius = '5px';
    registerEmailInput.style.backgroundColor = '#222';
    registerEmailInput.style.color = 'white';
    
    const registerPasswordInput = document.createElement('input');
    registerPasswordInput.type = 'password';
    registerPasswordInput.id = 'registerPassword';
    registerPasswordInput.placeholder = 'Heslo';
    registerPasswordInput.style.width = '100%';
    registerPasswordInput.style.padding = '10px';
    registerPasswordInput.style.marginBottom = '10px';
    registerPasswordInput.style.border = '1px solid #500';
    registerPasswordInput.style.borderRadius = '5px';
    registerPasswordInput.style.backgroundColor = '#222';
    registerPasswordInput.style.color = 'white';
    
    const registerConfirmPasswordInput = document.createElement('input');
    registerConfirmPasswordInput.type = 'password';
    registerConfirmPasswordInput.id = 'registerConfirmPassword';
    registerConfirmPasswordInput.placeholder = 'Potvrďte heslo';
    registerConfirmPasswordInput.style.width = '100%';
    registerConfirmPasswordInput.style.padding = '10px';
    registerConfirmPasswordInput.style.marginBottom = '20px';
    registerConfirmPasswordInput.style.border = '1px solid #500';
    registerConfirmPasswordInput.style.borderRadius = '5px';
    registerConfirmPasswordInput.style.backgroundColor = '#222';
    registerConfirmPasswordInput.style.color = 'white';
    
    const registerButton = document.createElement('button');
    registerButton.id = 'registerButton';
    registerButton.textContent = 'Registrovať sa';
    registerButton.style.width = '100%';
    registerButton.style.padding = '10px';
    registerButton.style.background = '#f00';
    registerButton.style.color = 'white';
    registerButton.style.border = 'none';
    registerButton.style.borderRadius = '5px';
    registerButton.style.cursor = 'pointer';
    registerButton.style.fontWeight = 'bold';
    
    registerForm.appendChild(registerNameInput);
    registerForm.appendChild(registerEmailInput);
    registerForm.appendChild(registerPasswordInput);
    registerForm.appendChild(registerConfirmPasswordInput);
    registerForm.appendChild(registerButton);
    
    // Správa o chybe
    const errorMessage = document.createElement('div');
    errorMessage.id = 'authErrorMessage';
    errorMessage.style.color = '#ff6666';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginTop = '10px';
    errorMessage.style.display = 'none';
    
    // Pridávame všetky elementy do authBox
    authBox.appendChild(title);
    authBox.appendChild(tabContainer);
    authBox.appendChild(loginForm);
    authBox.appendChild(registerForm);
    authBox.appendChild(errorMessage);
    
    // Pridávame authBox do authOverlay
    authOverlay.appendChild(authBox);
    
    // Pridávame authOverlay do body
    document.body.appendChild(authOverlay);
    
    // Pridávame event listenery
    setupAuthEvents();
}

function setupAuthEvents() {
    // Prepínače medzi prihlásením a registráciou
    document.getElementById('loginTab').addEventListener('click', function() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        
        document.getElementById('loginTab').style.background = '#f00';
        document.getElementById('registerTab').style.background = '#333';
        
        hideErrorMessage();
    });
    
    document.getElementById('registerTab').addEventListener('click', function() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        
        document.getElementById('loginTab').style.background = '#333';
        document.getElementById('registerTab').style.background = '#f00';
        
        hideErrorMessage();
    });
    
    // Prihlásenie
    document.getElementById('loginButton').addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showErrorMessage("Vyplňte e-mail a heslo");
            return;
        }
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Prihlásenie úspešné
                console.log("Prihlásenie úspešné");
                hideErrorMessage();
            })
            .catch((error) => {
                console.error("Chyba pri prihlásení:", error);
                let errorMsg = "Chyba pri prihlásení";
                
                switch(error.code) {
                    case "auth/user-not-found":
                        errorMsg = "Používateľ s týmto e-mailom neexistuje";
                        break;
                    case "auth/wrong-password":
                        errorMsg = "Nesprávne heslo";
                        break;
                    case "auth/invalid-email":
                        errorMsg = "Neplatný formát e-mailu";
                        break;
                    default:
                        errorMsg = error.message;
                }
                
                showErrorMessage(errorMsg);
            });
    });
    
    // Registrácia
    document.getElementById('registerButton').addEventListener('click', function() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validácia
        if (!name || !email || !password || !confirmPassword) {
            showErrorMessage("Vyplňte všetky polia");
            return;
        }
        
        if (password.length < 6) {
            showErrorMessage("Heslo musí mať minimálne 6 znakov");
            return;
        }
        
        if (password !== confirmPassword) {
            showErrorMessage("Heslá sa nezhodujú");
            return;
        }
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Registrácia úspešná
                console.log("Registrácia úspešná");
                
                // Aktualizácia profilu s menom používateľa
                userCredential.user.updateProfile({
                    displayName: name
                }).then(() => {
                    console.log("Profil aktualizovaný");
                    
                    // Uložiť dodatočné informácie o používateľovi do databázy
                    return firebase.database().ref('users/' + userCredential.user.uid).set({
                        username: name,
                        email: email,
                        createdAt: new Date().toString(),
                        credit: 1000 // Začiatočný kredit
                    });
                }).then(() => {
                    // Dáta užívateľa uložené do databázy
                    hideErrorMessage();
                }).catch((error) => {
                    console.error("Chyba pri aktualizácii profilu:", error);
                    showErrorMessage("Účet bol vytvorený, ale nastala chyba pri ukladaní profilových údajov");
                });
            })
            .catch((error) => {
                console.error("Chyba pri registrácii:", error);
                let errorMsg = "Chyba pri registrácii";
                
                switch(error.code) {
                    case "auth/email-already-in-use":
                        errorMsg = "E-mail je už používaný";
                        break;
                    case "auth/invalid-email":
                        errorMsg = "Neplatný formát e-mailu";
                        break;
                    case "auth/weak-password":
                        errorMsg = "Heslo je príliš slabé";
                        break;
                    default:
                        errorMsg = error.message;
                }
                
                showErrorMessage(errorMsg);
            });
    });
}

function showErrorMessage(message) {
    const errorElement = document.getElementById('authErrorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideErrorMessage() {
    const errorElement = document.getElementById('authErrorMessage');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

function showAuthOverlay() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideAuthOverlay() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function updateUIForLoggedUser() {
    // Aktualizácia UI pre prihláseného používateľa
    // Napr. zobrazenie mena, kreditu atď.
    
    // Načítanie kreditu z databázy
    firebase.database().ref('users/' + window.authState.userId).once('value')
        .then((snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.credit !== undefined) {
                // Aktualizácia kreditu v hre
                const credit = userData.credit;
                const creditDisplay = document.getElementById('creditDisplay');
                
                if (creditDisplay) {
                    creditDisplay.textContent = `Kredit: ${credit} B&B`;
                    
                    // Aktualizácia globálneho stavu hry
                    if (window.slotMachineData) {
                        window.slotMachineData.userId = window.authState.userId;
                    }
                }
            }
        })
        .catch((error) => {
            console.error("Chyba pri načítaní údajov o používateľovi:", error);
        });
    
    // Môžeme pridať meno používateľa do rozhrania
    const slotMachine = document.querySelector('.slot-machine');
    if (slotMachine) {
        // Skontrolujeme, či už neexistuje element s používateľským menom
        let userNameElement = document.getElementById('userNameDisplay');
        
        if (!userNameElement) {
            userNameElement = document.createElement('div');
            userNameElement.id = 'userNameDisplay';
            userNameElement.style.color = '#ffcc00';
            userNameElement.style.textAlign = 'right';
            userNameElement.style.marginTop = '10px';
            userNameElement.style.marginRight = '10px';
            userNameElement.style.fontSize = '14px';
            
            const title = slotMachine.querySelector('.title');
            if (title) {
                slotMachine.insertBefore(userNameElement, title.nextSibling);
            } else {
                slotMachine.appendChild(userNameElement);
            }
        }
        
        userNameElement.textContent = `Hráč: ${window.authState.userName}`;
    }
    
    // Pridáme tlačidlo na odhlásenie
    addLogoutButton();
}

function addLogoutButton() {
    const slotMachine = document.querySelector('.slot-machine');
    if (!slotMachine) return;
    
    // Skontrolujeme, či už neexistuje logout tlačidlo
    let logoutButton = document.getElementById('logoutButton');
    
    if (!logoutButton) {
        const controlsContainer = document.querySelector('.controls');
        
        if (controlsContainer) {
            // Vytvoríme nový container pre odhlásenie
            const logoutContainer = document.createElement('div');
            logoutContainer.style.position = 'absolute';
            logoutContainer.style.top = '10px';
            logoutContainer.style.right = '10px';
            
            // Vytvoríme tlačidlo
            logoutButton = document.createElement('button');
            logoutButton.id = 'logoutButton';
            logoutButton.textContent = 'Odhlásiť sa';
            logoutButton.style.padding = '5px 10px';
            logoutButton.style.backgroundColor = '#333';
            logoutButton.style.color = 'white';
            logoutButton.style.border = '1px solid #500';
            logoutButton.style.borderRadius = '3px';
            logoutButton.style.cursor = 'pointer';
            
            // Pridáme event listener
            logoutButton.addEventListener('click', function() {
                // Uložíme aktuálny kredit do databázy pred odhlásením
                saveUserCredit().then(() => {
                    firebase.auth().signOut()
                        .then(() => {
                            console.log("Používateľ bol odhlásený");
                        })
                        .catch((error) => {
                            console.error("Chyba pri odhlásení:", error);
                        });
                });
            });
            
            logoutContainer.appendChild(logoutButton);
            slotMachine.appendChild(logoutContainer);
        }
    }
}

function saveUserCredit() {
    // Uloženie aktuálneho kreditu do databázy
    if (!window.authState.isLoggedIn || !window.authState.userId) {
        return Promise.resolve();
    }
    
    const creditElement = document.getElementById('creditDisplay');
    if (!creditElement) {
        return Promise.resolve();
    }
    
    const creditText = creditElement.textContent;
    const match = creditText.match(/Kredit: (\d+)/);
    
    if (!match) {
        return Promise.resolve();
    }
    
    const credit = parseInt(match[1]);
    
    return firebase.database().ref('users/' + window.authState.userId).update({
        credit: credit,
        lastUpdated: new Date().toString()
    });
}

// Prepíšeme funkciu recordSpin, aby zahŕňala informácie o používateľovi
window.originalRecordSpin = window.recordSpin;

window.recordSpin = function() {
    if (!window.slotMachineData.pendingRecord) {
        console.log("Točenie už bolo zaznamenané");
        return;
    }
    
    const spinData = {
        timestamp: window.slotMachineData.timestamp.toString(),
        bet: window.slotMachineData.lastBet,
        win: window.slotMachineData.lastWin,
        credit: getCreditAmount(),
        userId: window.authState.isLoggedIn ? window.authState.userId : 'anonymous'
    };
    
    console.log("Zaznamenávam údaje o točení:", spinData);
    
    // Ukladáme údaje o točení do databázy
    firebase.database().ref("spins/" + window.slotMachineData.sessionId).push(spinData)
        .then(function() {
            console.log("Údaje o točení boli úspešne zaznamenané");
            
            // Aktualizujeme kredit používateľa v databáze po každom točení
            if (window.authState.isLoggedIn) {
                return saveUserCredit();
            }
        })
        .catch(function(error) {
            console.error("Chyba pri ukladaní údajov o točení:", error);
        });
    
    // Označíme, že už bolo zaznamenané
    window.slotMachineData.pendingRecord = false;
    window.slotMachineData.recordRequested = false;
};