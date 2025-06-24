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

function initAuthSystem() {
    try {
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK nie je dostupné");
            return;
        }

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
    
    createAuthOverlay();
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Používateľ je prihlásený:", user.uid);
            window.authState.isLoggedIn = true;
            window.authState.userId = user.uid;
            window.authState.userEmail = user.email;
            window.authState.userName = user.displayName || user.email.split('@')[0];
            window.authState.isAuthReady = true;
            
            hideAuthOverlay();
            
            updateUIForLoggedUser();

            const authEvent = new Event('authStateChanged');
            window.dispatchEvent(authEvent);
        } else {
            console.log("Používateľ nie je prihlásený");
            window.authState.isLoggedIn = false;
            window.authState.userId = null;
            window.authState.userEmail = null;
            window.authState.userName = null;
            window.authState.isAuthReady = true;
            
            showAuthOverlay();

            const authEvent = new Event('authStateChanged');
            window.dispatchEvent(authEvent);
        }
    });
}

function createAuthOverlay() {
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
    
    const authBox = document.createElement('div');
    authBox.className = 'auth-box';
    authBox.style.backgroundColor = '#111';
    authBox.style.border = '2px solid #f00';
    authBox.style.borderRadius = '10px';
    authBox.style.padding = '30px';
    authBox.style.width = '80%';
    authBox.style.maxWidth = '400px';
    authBox.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
    
    const title = document.createElement('h2');
    title.textContent = 'B&B MULTIPLAY';
    title.style.color = '#ffcc00';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.textShadow = '0 0 5px #ff6600';
    
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
    
    const errorMessage = document.createElement('div');
    errorMessage.id = 'authErrorMessage';
    errorMessage.style.color = '#ff6666';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginTop = '10px';
    errorMessage.style.display = 'none';
    
    authBox.appendChild(title);
    authBox.appendChild(tabContainer);
    authBox.appendChild(loginForm);
    authBox.appendChild(registerForm);
    authBox.appendChild(errorMessage);
    authOverlay.appendChild(authBox);
    document.body.appendChild(authOverlay);

    setupAuthEvents();
}

function setupAuthEvents() {
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
    
    document.getElementById('loginButton').addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showErrorMessage("Vyplňte e-mail a heslo");
            return;
        }
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
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
    
    document.getElementById('registerButton').addEventListener('click', function() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
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
        
        // Najprv skontrolujeme, či užívateľské meno už existuje
        let uniqueName = name;
        
        firebase.database().ref().once('value')
            .then((snapshot) => {
                let counter = 1;
                
                // Ak meno existuje, pridáme k nemu číslo
                while(snapshot.hasChild(uniqueName)) {
                    uniqueName = name + " " + counter;
                    counter++;
                }
                
                // Teraz máme unikátne meno, môžeme vytvoriť účet
                return firebase.auth().createUserWithEmailAndPassword(email, password);
            })
            .then((userCredential) => {
                console.log("Registrácia úspešná");
                
                return userCredential.user.updateProfile({
                    displayName: uniqueName
                });
            })
            .then(() => {
                const user = firebase.auth().currentUser;
                console.log("Profil aktualizovaný, unikátne meno:", uniqueName);
                
                return firebase.database().ref(uniqueName).set({
                    credit: 5000,
                    lastUpdated: formatDate(new Date()),
                    email: email,
                    uid: user.uid
                });
            })
            .then(() => {
                hideErrorMessage();
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

function showAddCreditModal() {
    let creditModal = document.getElementById('creditModal');
    if (creditModal) {
        document.body.removeChild(creditModal);
    }
    
    creditModal = document.createElement('div');
    creditModal.id = 'creditModal';
    creditModal.style.position = 'fixed';
    creditModal.style.top = '0';
    creditModal.style.left = '0';
    creditModal.style.width = '100%';
    creditModal.style.height = '100%';
    creditModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    creditModal.style.display = 'flex';
    creditModal.style.justifyContent = 'center';
    creditModal.style.alignItems = 'center';
    creditModal.style.zIndex = '2000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#111';
    modalContent.style.border = '2px solid #00cc00';
    modalContent.style.borderRadius = '10px';
    modalContent.style.padding = '20px';
    modalContent.style.width = '250px';
    modalContent.style.boxShadow = '0 0 15px rgba(0, 204, 0, 0.5)';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Pridať kredit';
    modalTitle.style.color = '#00cc00';
    modalTitle.style.textAlign = 'center';
    modalTitle.style.marginBottom = '20px';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.addEventListener('click', function() {
        document.body.removeChild(creditModal);
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '10px';
    const creditValues = [500, 1000, 2000];
    
    for (const value of creditValues) {
        const button = document.createElement('button');
        button.textContent = `Pridať ${value} B&B`;
        button.style.padding = '12px';
        button.style.backgroundColor = '#008800';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        
        button.addEventListener('click', function() {
            addCreditToUser(value);
            document.body.removeChild(creditModal);
        });
        
        buttonContainer.appendChild(button);
    }
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(buttonContainer);
    
    creditModal.appendChild(modalContent);
    document.body.appendChild(creditModal);
}


function addCreditToUser(amount) {

    if (!window.authState.isLoggedIn || !window.authState.userName) {
        console.error("Používateľ nie je prihlásený");
        return;
    }
    
    const newCredit = window.credit + amount;
    window.credit = newCredit;
    const creditElement = document.getElementById('creditDisplay');
    if (creditElement) {
        creditElement.textContent = `Kredit: ${window.credit} B&B`;
    }

    firebase.database().ref(window.authState.userName).once('value')
        .then((snapshot) => {
            const userData = snapshot.val() || {};
            const updatedData = {
                credit: window.credit,
                hry: userData.hry || {},
                email: window.authState.userEmail,
                lastUpdated: formatDate(new Date())
            };
            
            if (userData.historia_kreditov) {
                updatedData.historia_kreditov = userData.historia_kreditov;
            }
            
            return firebase.database().ref(window.authState.userName).set(updatedData);
        })
        .then(() => {
            console.log(`Kredit bol úspešne zvýšený o ${amount} B&B. Nový kredit: ${window.credit} B&B`);
            return firebase.database().ref(window.authState.userName + "/historia_kreditov/" + Date.now()).set({
                typ: "Pridanie",
                suma: amount,
                novy_zostatok: window.credit,
                datum: formatDate(new Date())
            });
        })
        .then(() => {
            console.log("História kreditu bola uložená");
        })
        .catch(error => {
            console.error("Chyba pri pridávaní kreditu:", error);
        });
}

function updateUIForLoggedUser() {
    console.log("updateUIForLoggedUser - začiatok");
    console.log("Meno používateľa:", window.authState.userName);
    firebase.database().ref(window.authState.userName).once('value')
        .then((snapshot) => {
            const userData = snapshot.val();
            console.log("Údaje používateľa z Firebase:", userData);
            
            if (userData && userData.credit !== undefined) {
                console.log("Načítaný kredit z Firebase:", userData.credit);
                window.credit = userData.credit;
                console.log("Kredit nastavený na hodnotu z Firebase:", window.credit);
                
                const creditDisplay = document.getElementById('creditDisplay');
                if (creditDisplay) {
                    console.log("Aktualizujem zobrazenie kreditu na:", window.credit);
                    creditDisplay.textContent = `Kredit: ${window.credit} B&B`;
                    
                    if (window.slotMachineData) {
                        window.slotMachineData.userId = window.authState.userId;
                        window.slotMachineData.userName = window.authState.userName;
                    }
                }

                window.isUserDataLoaded = true;
                console.log("Odosielam event authStateChanged");
                const authEvent = new Event('authStateChanged');
                window.dispatchEvent(authEvent);
            } else {
                console.log("Kredit nebol nájdený v údajoch používateľa");
                window.credit = 5000;
                console.log("Nastavujem predvolený kredit 5000, pretože v databáze nebol nájdený");
                
                const creditDisplay = document.getElementById('creditDisplay');
                if (creditDisplay) {
                    creditDisplay.textContent = `Kredit: ${window.credit} B&B`;
                }
                
                window.isUserDataLoaded = true;
                const authEvent = new Event('authStateChanged');
                window.dispatchEvent(authEvent);
            }
        })
        .catch((error) => {
            console.error("Chyba pri načítaní údajov o používateľovi:", error);
            window.credit = 1000;
            console.log("Nastavujem predvolený kredit 1000 kvôli chybe");
            
            const creditDisplay = document.getElementById('creditDisplay');
            if (creditDisplay) {
                creditDisplay.textContent = `Kredit: ${window.credit} B&B`;
            }
            
            window.isUserDataLoaded = true;
            const authEvent = new Event('authStateChanged');
            window.dispatchEvent(authEvent);
        });
    
    const slotMachine = document.querySelector('.slot-machine');
    if (slotMachine) {
        let userNameElement = document.getElementById('userNameDisplay');
        
        if (!userNameElement) {
            userNameElement = document.createElement('div');
            userNameElement.id = 'userNameDisplay';
            userNameElement.style.color = '#ffcc00';
            userNameElement.style.textAlign = 'right';
            userNameElement.style.marginTop = '10px';
            userNameElement.style.marginRight = '10px';
            userNameElement.style.fontSize = '14px';
            userNameElement.style.display = 'flex';
            userNameElement.style.justifyContent = 'space-between';
            userNameElement.style.alignItems = 'center';
            const addCreditButton = document.createElement('button');
            addCreditButton.textContent = 'Pridať kredit';
            addCreditButton.style.backgroundColor = '#00aa00';
            addCreditButton.style.color = 'white';
            addCreditButton.style.border = 'none';
            addCreditButton.style.borderRadius = '5px';
            addCreditButton.style.padding = '5px 10px';
            addCreditButton.style.cursor = 'pointer';
            addCreditButton.style.fontWeight = 'bold';
            addCreditButton.style.marginLeft = '10px';
            addCreditButton.addEventListener('click', function() {
                showAddCreditModal();
            });
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `Hráč: ${window.authState.userName}`;
            
            userNameElement.appendChild(nameSpan);
            userNameElement.appendChild(addCreditButton);
            
            const title = slotMachine.querySelector('.title');
            if (title) {
                slotMachine.insertBefore(userNameElement, title.nextSibling);
            } else {
                slotMachine.appendChild(userNameElement);
            }
        } else {
            userNameElement.querySelector('span').textContent = `Hráč: ${window.authState.userName}`;
        }
    }
    
    addLogoutButton();
}
    
function addLogoutButton() {
    const slotMachine = document.querySelector('.slot-machine');
    if (!slotMachine) return;
    let logoutButton = document.getElementById('logoutButton');
    
    if (!logoutButton) {
        const controlsContainer = document.querySelector('.controls');
        
        if (controlsContainer) {
            const logoutContainer = document.createElement('div');
            logoutContainer.style.position = 'absolute';
            logoutContainer.style.top = '10px';
            logoutContainer.style.right = '10px';
            logoutButton = document.createElement('button');
            logoutButton.id = 'logoutButton';
            logoutButton.textContent = 'Odhlásiť sa';
            logoutButton.style.padding = '5px 10px';
            logoutButton.style.backgroundColor = '#333';
            logoutButton.style.color = 'white';
            logoutButton.style.border = '1px solid #500';
            logoutButton.style.borderRadius = '3px';
            logoutButton.style.cursor = 'pointer';
            logoutButton.addEventListener('click', function() {
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
    if (!window.authState || !window.authState.isLoggedIn || !window.authState.userName) {
        console.error("Nemôžem uložiť kredit - používateľ nie je prihlásený");
        return Promise.resolve();
    }
    
    // Pripočítať aj nezapísanú výhru ak existuje
    const totalCredit = window.credit + (window.pendingWin || 0);
    console.log("Ukladám kredit do Firebase:", totalCredit, "(kredit:", window.credit, "pendingWin:", window.pendingWin || 0, ")");
    
    return firebase.database().ref(window.authState.userName).once('value')
        .then((snapshot) => {
            const userData = snapshot.val() || {};
            const updatedData = {
                credit: totalCredit,
                hry: userData.hry || {},
                email: window.authState.userEmail,
                lastUpdated: formatDate(new Date())
            };
            
            if (userData.historia_kreditov) {
                updatedData.historia_kreditov = userData.historia_kreditov;
            }
            
            return firebase.database().ref(window.authState.userName).set(updatedData);
        })
        .then(() => {
            console.log("Kredit bol úspešne uložený:", totalCredit);
            return Promise.resolve();
        })
        .catch((error) => {
            console.error("Chyba pri ukladaní kreditu:", error);
            return Promise.reject(error);
        });
}


function setupCreditSaveInterval() {
    console.log("Nastavujem periodické ukladanie kreditu");
    
    if (window.creditSaveInterval) {
        clearInterval(window.creditSaveInterval);
    }
    
    window.creditSaveInterval = setInterval(() => {
        if (window.authState && window.authState.isLoggedIn && window.credit !== null) {
            console.log("Periodické ukladanie kreditu:", window.credit);
            saveUserCredit();
        }
    }, 60000);
}

window.addEventListener('authStateChanged', function() {
    if (window.authState && window.authState.isLoggedIn) {
        setupCreditSaveInterval();
    } else {

        if (window.creditSaveInterval) {
            clearInterval(window.creditSaveInterval);
        }
    }
});

window.authHelpers = {
    formatDate: formatDate,
    saveUserCredit: saveUserCredit,
    setupCreditSaveInterval: setupCreditSaveInterval
};