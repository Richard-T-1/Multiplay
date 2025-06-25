function showWithdrawModal() {
    let withdrawModal = document.getElementById('withdrawModal');
    if (withdrawModal) {
        document.body.removeChild(withdrawModal);
    }
    
    withdrawModal = document.createElement('div');
    withdrawModal.id = 'withdrawModal';
    withdrawModal.style.position = 'fixed';
    withdrawModal.style.top = '0';
    withdrawModal.style.left = '0';
    withdrawModal.style.width = '100%';
    withdrawModal.style.height = '100%';
    withdrawModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    withdrawModal.style.display = 'flex';
    withdrawModal.style.justifyContent = 'center';
    withdrawModal.style.alignItems = 'center';
    withdrawModal.style.zIndex = '2000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#111';
    modalContent.style.border = '2px solid #f00';
    modalContent.style.borderRadius = '10px';
    modalContent.style.padding = '20px';
    modalContent.style.width = '250px';
    modalContent.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
    modalContent.style.position = 'relative';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Výber B&B coinov';
    modalTitle.style.color = '#f00';
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
        document.body.removeChild(withdrawModal);
    });
    
    const inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '20px';
    
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.id = 'withdrawAmount';
    amountInput.placeholder = 'Zadajte sumu na výber';
    amountInput.style.width = '100%';
    amountInput.style.padding = '10px';
    amountInput.style.border = '1px solid #500';
    amountInput.style.borderRadius = '5px';
    amountInput.style.backgroundColor = '#222';
    amountInput.style.color = 'white';
    amountInput.style.marginBottom = '10px';
    
    const maxWithdrawInfo = document.createElement('div');
    const maxWithdrawAmount = Math.max(0, window.credit - 5000);
    maxWithdrawInfo.textContent = `Maximálna suma na výber: ${maxWithdrawAmount} B&B`;
    maxWithdrawInfo.style.color = '#ccc';
    maxWithdrawInfo.style.fontSize = '12px';
    maxWithdrawInfo.style.marginBottom = '5px';
    
    const currentBalanceInfo = document.createElement('div');
    currentBalanceInfo.textContent = `Aktuálny zostatok: ${window.credit} B&B`;
    currentBalanceInfo.style.color = '#ccc';
    currentBalanceInfo.style.fontSize = '12px';
    
    inputContainer.appendChild(maxWithdrawInfo);
    inputContainer.appendChild(currentBalanceInfo);
    inputContainer.appendChild(amountInput);
    
    const errorMessage = document.createElement('div');
    errorMessage.id = 'withdrawErrorMessage';
    errorMessage.style.color = '#ff6666';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.fontSize = '14px';
    errorMessage.style.marginBottom = '10px';
    errorMessage.style.display = 'none';
    
    const withdrawButton = document.createElement('button');
    withdrawButton.textContent = 'Potvrdiť výber';
    withdrawButton.style.width = '100%';
    withdrawButton.style.padding = '10px';
    withdrawButton.style.backgroundColor = '#800';
    withdrawButton.style.color = 'white';
    withdrawButton.style.border = 'none';
    withdrawButton.style.borderRadius = '5px';
    withdrawButton.style.cursor = 'pointer';
    withdrawButton.style.fontWeight = 'bold';
    
    withdrawButton.addEventListener('click', function() {
        const amount = parseInt(amountInput.value);
        
        if (isNaN(amount) || amount <= 0) {
            showWithdrawError("Zadajte platnú sumu na výber");
            return;
        }
        
        if (window.credit - amount < 5000) {
            showWithdrawError("Na účte musí zostať aspoň 5000 B&B coinov");
            return;
        }
        
        if (amount > window.credit) {
            showWithdrawError("Nemáte dostatok B&B coinov na výber");
            return;
        }
        
        processWithdrawal(amount);
        document.body.removeChild(withdrawModal);
    });
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(inputContainer);
    modalContent.appendChild(errorMessage);
    modalContent.appendChild(withdrawButton);
    
    withdrawModal.appendChild(modalContent);
    document.body.appendChild(withdrawModal);
}

function showWithdrawError(message) {
    const errorElement = document.getElementById('withdrawErrorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function processWithdrawal(amount) {
    if (!window.authState.isLoggedIn || !window.authState.userName) {
        alert("Pre výber musíte byť prihlásený");
        return;
    }
    
    const previousCredit = window.credit;
    window.credit -= amount;
    
    const creditElement = document.getElementById('creditDisplay');
    if (creditElement) {
        creditElement.textContent = `Kredit: ${window.credit} B&B`;
    }
    
    firebase.database().ref(window.authState.userName + "/vybery/" + Date.now()).set({
        suma: amount,
        predchadzajuci_zostatok: previousCredit,
        novy_zostatok: window.credit,
        datum: formatDate(new Date()),
        stav: "čaká na spracovanie",
        uzivatel: window.authState.userName,
        email: window.authState.userEmail
    })
    .then(() => {
        return firebase.database().ref(window.authState.userName + "/historia_kreditov/" + Date.now()).set({
            typ: "Výber",
            suma: -amount,
            novy_zostatok: window.credit,
            datum: formatDate(new Date())
        });
    })
    .then(() => {
        return saveUserCredit();
    })
    .then(() => {
        alert(`Vaša žiadosť o výber ${amount} B&B bola úspešne odoslaná a čaká na spracovanie.`);
    })
    .catch(error => {
        alert("Nastala chyba pri spracovaní výberu. Skúste to znova neskôr.");
        window.credit = previousCredit;
        if (creditElement) {
            creditElement.textContent = `Kredit: ${window.credit} B&B`;
        }
    });
}

function addWithdrawButton() {
    const slotMachine = document.querySelector('.slot-machine');
    if (!slotMachine) return;
    
    const userNameElement = document.getElementById('userNameDisplay');
    if (userNameElement) {
        let withdrawButton = userNameElement.querySelector('#withdrawButton');
        
        if (!withdrawButton) {
            withdrawButton = document.createElement('button');
            withdrawButton.id = 'withdrawButton';
            withdrawButton.textContent = 'Výber';
            withdrawButton.style.backgroundColor = '#800';
            withdrawButton.style.color = 'white';
            withdrawButton.style.border = 'none';
            withdrawButton.style.borderRadius = '5px';
            withdrawButton.style.padding = '5px 10px';
            withdrawButton.style.cursor = 'pointer';
            withdrawButton.style.fontWeight = 'bold';
            withdrawButton.style.marginLeft = '10px';
            
            withdrawButton.addEventListener('click', function() {
                showWithdrawModal();
            });
            
            userNameElement.appendChild(withdrawButton);
        }
    } else {
        const newUserNameElement = document.createElement('div');
        newUserNameElement.id = 'userNameDisplay';
        newUserNameElement.style.color = '#ffcc00';
        newUserNameElement.style.textAlign = 'right';
        newUserNameElement.style.marginTop = '10px';
        newUserNameElement.style.marginRight = '10px';
        newUserNameElement.style.fontSize = '14px';
        newUserNameElement.style.display = 'flex';
        newUserNameElement.style.justifyContent = 'space-between';
        newUserNameElement.style.alignItems = 'center';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = `Hráč: ${window.authState.userName || 'Hosť'}`;
        
        const addCreditButton = document.createElement('button');
        addCreditButton.textContent = 'Pridať kredit';
        addCreditButton.style.backgroundColor = '#00aa00';
        addCreditButton.style.color = 'white';
        addCreditButton.style.border = 'none';
        addCreditButton.style.borderRadius = '5px';
        addCreditButton.style.padding = '5px 10px';
        addCreditButton.style.cursor = 'pointer';
        addCreditButton.style.fontWeight = 'bold';
        addCreditButton.addEventListener('click', function() {
            showAddCreditModal();
        });
        
        const withdrawButton = document.createElement('button');
        withdrawButton.id = 'withdrawButton';
        withdrawButton.textContent = 'Výber';
        withdrawButton.style.backgroundColor = '#800';
        withdrawButton.style.color = 'white';
        withdrawButton.style.border = 'none';
        withdrawButton.style.borderRadius = '5px';
        withdrawButton.style.padding = '5px 10px';
        withdrawButton.style.cursor = 'pointer';
        withdrawButton.style.fontWeight = 'bold';
        withdrawButton.style.marginLeft = '10px';
        withdrawButton.addEventListener('click', function() {
            showWithdrawModal();
        });
        
        newUserNameElement.appendChild(nameSpan);
        newUserNameElement.appendChild(addCreditButton);
        newUserNameElement.appendChild(withdrawButton);
        
        const title = slotMachine.querySelector('.title');
        if (title) {
            slotMachine.insertBefore(newUserNameElement, title.nextSibling);
        } else {
            slotMachine.appendChild(newUserNameElement);
        }
    }
}

const originalUpdateUIForLoggedUser = updateUIForLoggedUser;
updateUIForLoggedUser = function() {
    originalUpdateUIForLoggedUser();
    addWithdrawButton();
};

if (window.authState && window.authState.isLoggedIn) {
    addWithdrawButton();
}

window.addEventListener('authStateChanged', function() {
    if (window.authState && window.authState.isLoggedIn) {
        addWithdrawButton();
    }
});