/**
 * Mobile Layout Module - Prispôsobenie hry pre mobilné zariadenia
 * Tento modul zabezpečuje optimálne zobrazenie na mobilných zariadeniach
 */

(function() {
    'use strict';
    
    // Detekcia mobilných zariadení - vylepšená detekcia
    function isMobileDevice() {
        // Kontrola šírky okna A touch zariadenia
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isNarrowScreen = window.innerWidth <= 767;
        
        // Na notebooku/desktop s úzkou obrazovkou neaplikovať mobilný layout
        const isLikelyMobile = isTouchDevice && isNarrowScreen;
        
        console.log('Device detection:', {
            innerWidth: window.innerWidth,
            isTouchDevice: isTouchDevice,
            isNarrowScreen: isNarrowScreen,
            isLikelyMobile: isLikelyMobile
        });
        
        return isLikelyMobile;
    }
    
    // Hlavná funkcia pre mobilný layout
    function enhanceMobileLayout() {
        const isMobile = isMobileDevice();
        
        if (!isMobile) {
            // Pre desktop nerobíme žiadne zmeny
            return;
        }
        
        console.log('Aplikujem mobilný layout...');
        
        // Oprava symbolov
        optimizeSymbols();
        
        // Oprava valcov
        optimizeReels();
        
        // Oprava kontajnera valcov  
        optimizeReelsContainer();
        
        // Oprava ovládacích prvkov
        optimizeControls();
        
        // Pridanie mobilných CSS pravidiel
        addMobileCSS();
    }
    
    // Optimalizácia symbolov pre mobil
    function optimizeSymbols() {
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach(function(symbol) {
            // Základné nastavenia symbolu
            symbol.style.display = 'flex';
            symbol.style.justifyContent = 'center';
            symbol.style.alignItems = 'center';
            symbol.style.width = '100%';
            symbol.style.height = '80px';
            symbol.style.margin = '0';
            symbol.style.padding = '5px';
            symbol.style.backgroundColor = '#000';
            symbol.style.boxSizing = 'border-box';
            
            const img = symbol.querySelector('img');
            if (img) {
                // Lepšie centrovanie obrázkov
                img.style.maxWidth = '70px';
                img.style.maxHeight = '70px';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                img.style.verticalAlign = 'middle';
            }
        });
    }
    
    // Optimalizácia valcov pre mobil
    function optimizeReels() {
        const reels = document.querySelectorAll('.reel');
        reels.forEach(function(reel) {
            reel.style.width = '23%'; // Mierne zmenšenie pre lepšie rozostupy
            reel.style.height = '240px'; // 3 symboly × 80px
            reel.style.margin = '0';
            reel.style.padding = '0';
            reel.style.border = '2px solid #500';
            reel.style.borderRadius = '5px';
            reel.style.overflow = 'hidden';
            reel.style.position = 'relative';
            reel.style.backgroundColor = '#111';
        });
    }
    
    // Optimalizácia kontajnera valcov pre mobil
    function optimizeReelsContainer() {
        const reelsContainer = document.querySelector('.reels-container');
        if (reelsContainer) {
            reelsContainer.style.display = 'flex';
            reelsContainer.style.justifyContent = 'space-between';
            reelsContainer.style.gap = '1%'; // Percentuálny gap pre responsívnosť
            reelsContainer.style.padding = '10px';
            reelsContainer.style.marginBottom = '15px';
            reelsContainer.style.backgroundColor = '#000';
            reelsContainer.style.borderRadius = '10px';
            reelsContainer.style.border = '3px solid #500';
        }
    }
    
    // Optimalizácia ovládacích prvkov pre mobil
    function optimizeControls() {
        const controls = document.querySelector('.controls');
        if (!controls) return;
        
        // Aplikovanie horizontálneho layoutu podobného desktop verzii
        applyHorizontalLayout(controls);
    }
    
    // Horizontálne rozloženie ovládania (podobné desktop verzii)
    function applyHorizontalLayout(controls) {
        controls.style.display = 'flex';
        controls.style.flexDirection = 'row';
        controls.style.justifyContent = 'space-between';
        controls.style.alignItems = 'center';
        controls.style.gap = '10px';
        controls.style.padding = '10px';
        controls.style.backgroundColor = '#111';
        controls.style.borderRadius = '5px';
        
        // Informácie vľavo
        const info = controls.querySelector('.info');
        if (info) {
            info.style.flex = '1';
            info.style.textAlign = 'left';
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.alignItems = 'flex-start';
            info.style.minWidth = '120px';
            
            // Styling pre win display
            const winDisplay = info.querySelector('.win-display');
            if (winDisplay) {
                winDisplay.style.fontSize = '16px';
                winDisplay.style.marginBottom = '5px';
                winDisplay.style.color = '#fff';
            }
            
            // Styling pre credit display
            const creditDisplay = info.querySelector('.credit-display');
            if (creditDisplay) {
                creditDisplay.style.fontSize = '14px';
                creditDisplay.style.color = '#fff';
            }
        }
        
        // Stávka v strede
        const betControls = controls.querySelector('.bet-controls');
        if (betControls) {
            betControls.style.display = 'flex';
            betControls.style.flexDirection = 'column';
            betControls.style.alignItems = 'center';
            betControls.style.minWidth = '80px';
            
            // Styling pre bet amount
            const betAmount = betControls.querySelector('.bet-amount');
            if (betAmount) {
                betAmount.style.fontSize = '20px';
                betAmount.style.color = '#f55';
                betAmount.style.marginBottom = '5px';
            }
            
            // Styling pre bet buttons
            const betButtons = betControls.querySelector('.bet-buttons');
            if (betButtons) {
                betButtons.style.display = 'flex';
                betButtons.style.gap = '5px';
                
                const buttons = betButtons.querySelectorAll('.bet-button');
                buttons.forEach(function(button) {
                    button.style.width = '30px';
                    button.style.height = '30px';
                    button.style.fontSize = '16px';
                });
            }
        }
        
        // Tlačidlá SPIN a AUTO vpravo - ODDELENE
        const spinControls = controls.querySelector('.spin-controls');
        if (spinControls) {
            spinControls.style.display = 'flex';
            spinControls.style.flexDirection = 'column';
            spinControls.style.gap = '15px'; // Väčší gap pre lepšie oddelenie
            spinControls.style.alignItems = 'center';
            spinControls.style.minWidth = '90px';
            
            // Styling pre spin button
            const spinButton = spinControls.querySelector('#spinButton');
            if (spinButton) {
                spinButton.style.width = '70px';
                spinButton.style.height = '70px';
                spinButton.style.fontSize = '14px';
                spinButton.style.borderRadius = '50%';
                spinButton.style.backgroundColor = '#f00';
                spinButton.style.border = 'none';
                spinButton.style.color = 'white';
                spinButton.style.fontWeight = 'bold';
                spinButton.style.cursor = 'pointer';
                spinButton.style.boxShadow = '0 0 10px #f00';
            }
            
            // Styling pre auto button
            const autoButton = spinControls.querySelector('#autoButton');
            if (autoButton) {
                autoButton.style.width = '70px';
                autoButton.style.height = '25px';
                autoButton.style.fontSize = '12px';
                autoButton.style.borderRadius = '12px';
                autoButton.style.backgroundColor = '#008800';
                autoButton.style.border = 'none';
                autoButton.style.color = 'white';
                autoButton.style.fontWeight = 'bold';
                autoButton.style.cursor = 'pointer';
                autoButton.style.boxShadow = '0 0 8px #008800';
            }
        }
    }
    
    // Pridanie mobilných CSS pravidiel
    function addMobileCSS() {
        // Kontrola či už neexistuje mobilný CSS
        if (document.getElementById('mobile-css')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'mobile-css';
        style.textContent = `
            @media screen and (max-width: 767px) {
                .slot-machine {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 15px !important;
                    box-sizing: border-box !important;
                }
                
                .title {
                    font-size: 20px !important;
                    margin-bottom: 15px !important;
                    padding: 8px !important;
                }
                
                .reels-container {
                    margin-bottom: 15px !important;
                }
                
                .reel {
                    border: 2px solid #500 !important;
                    border-radius: 5px !important;
                }
                
                .symbol {
                    height: 80px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 5px !important;
                    box-sizing: border-box !important;
                }
                
                .symbol img {
                    max-width: 70px !important;
                    max-height: 70px !important;
                    object-fit: contain !important;
                }
                
                .controls {
                    flex-wrap: nowrap !important;
                    gap: 10px !important;
                }
                
                .spin-controls {
                    gap: 15px !important;
                }
                
                .spin-button {
                    width: 70px !important;
                    height: 70px !important;
                    font-size: 14px !important;
                }
                
                .auto-button {
                    width: 70px !important;
                    height: 25px !important;
                    font-size: 12px !important;
                }
                
                .bet-amount {
                    font-size: 20px !important;
                }
                
                .win-display {
                    font-size: 16px !important;
                }
                
                .credit-display {
                    font-size: 14px !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Hookovanie herných funkcií pre mobilný layout
    function hookGameFunctions() {
        // Hook na initializeReels
        if (window.initializeReels) {
            const originalInitializeReels = window.initializeReels;
            window.initializeReels = function() {
                const result = originalInitializeReels.apply(this, arguments);
                setTimeout(enhanceMobileLayout, 50);
                return result;
            };
        }
        
        // Hook na startSpin  
        if (window.startSpin) {
            const originalStartSpin = window.startSpin;
            window.startSpin = function() {
                const result = originalStartSpin.apply(this, arguments);
                setTimeout(enhanceMobileLayout, 50);
                return result;
            };
        }
    }
    
    // Nastavenie MutationObserver pre automatické sledovanie zmien
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            
            mutations.forEach(function(mutation) {
                // Aktualizovať len ak sa zmenili elementy týkajúce sa hry
                if (mutation.target.classList && 
                   (mutation.target.classList.contains('slot-machine') ||
                    mutation.target.classList.contains('reel') ||
                    mutation.target.classList.contains('controls'))) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                enhanceMobileLayout();
            }
        });
        
        // Sledovanie zmien na hlavnom elemente hry
        const slotMachine = document.querySelector('.slot-machine');
        if (slotMachine) {
            observer.observe(slotMachine, { 
                childList: true, 
                subtree: true,
                attributes: true
            });
        }
    }
    
    // Inicializácia mobilného modulu
    function initializeMobileModule() {
        console.log('Inicializujem mobilný layout modul...');
        
        // Okamžite aplikovať layout
        enhanceMobileLayout();
        
        // Nastaviť event listenery
        window.addEventListener('resize', function() {
            setTimeout(enhanceMobileLayout, 100);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(enhanceMobileLayout, 200);
        });
        
        // Nastaviť hooky na herné funkcie
        setTimeout(hookGameFunctions, 100);
        
        // Nastaviť mutation observer
        setTimeout(setupMutationObserver, 200);
        
        console.log('Mobilný layout modul inicializovaný');
    }
    
    // Export funkcií pre externé použitie
    window.mobileLayout = {
        enhance: enhanceMobileLayout,
        isMobile: isMobileDevice,
        optimize: {
            symbols: optimizeSymbols,
            reels: optimizeReels,
            container: optimizeReelsContainer,
            controls: optimizeControls
        }
    };
    
    // Spustenie pri načítaní DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileModule);
    } else {
        initializeMobileModule();
    }
    
    // Spustenie aj po auth statechanged pre Firebase integráciu
    window.addEventListener('authStateChanged', function() {
        setTimeout(enhanceMobileLayout, 100);
    });
    
})();
