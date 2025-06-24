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
    }
    
    // Optimalizácia symbolov pre mobil
    function optimizeSymbols() {
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach(function(symbol) {
            symbol.style.display = 'flex';
            symbol.style.justifyContent = 'center';
            symbol.style.alignItems = 'center';
            symbol.style.width = '100%';
            symbol.style.height = '80px';
            symbol.style.margin = '0';
            symbol.style.padding = '0';
            symbol.style.backgroundColor = '#000';
            
            const img = symbol.querySelector('img');
            if (img) {
                img.style.maxWidth = '85%';
                img.style.maxHeight = '85%';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.display = 'block';
                img.style.margin = '0 auto';
            }
        });
    }
    
    // Optimalizácia valcov pre mobil
    function optimizeReels() {
        const reels = document.querySelectorAll('.reel');
        reels.forEach(function(reel) {
            reel.style.width = '24%';
            reel.style.margin = '0';
            reel.style.padding = '0';
        });
    }
    
    // Optimalizácia kontajnera valcov pre mobil
    function optimizeReelsContainer() {
        const reelsContainer = document.querySelector('.reels-container');
        if (reelsContainer) {
            reelsContainer.style.display = 'flex';
            reelsContainer.style.justifyContent = 'space-between';
            reelsContainer.style.gap = '2px';
            reelsContainer.style.padding = '8px';
        }
    }
    
    // Optimalizácia ovládacích prvkov pre mobil
    function optimizeControls() {
        const controls = document.querySelector('.controls');
        if (!controls) return;
        
        if (window.innerWidth > 400) {
            // Horizontálne rozloženie pre väčšie mobilné obrazovky
            applyHorizontalLayout(controls);
        } else {
            // Vertikálne rozloženie pre veľmi malé obrazovky
            applyVerticalLayout(controls);
        }
    }
    
    // Horizontálne rozloženie ovládania
    function applyHorizontalLayout(controls) {
        controls.style.display = 'flex';
        controls.style.flexDirection = 'row';
        controls.style.justifyContent = 'space-between';
        controls.style.alignItems = 'center';
        controls.style.gap = '10px';
        
        // Informácie vľavo
        const info = controls.querySelector('.info');
        if (info) {
            info.style.flex = '1';
            info.style.textAlign = 'left';
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.alignItems = 'flex-start';
        }
        
        // Stávka v strede
        const betControls = controls.querySelector('.bet-controls');
        if (betControls) {
            betControls.style.margin = '0 10px';
            betControls.style.display = 'flex';
            betControls.style.flexDirection = 'column';
            betControls.style.alignItems = 'center';
        }
        
        // Tlačidlá vpravo
        const spinControls = controls.querySelector('.spin-controls');
        if (spinControls) {
            spinControls.style.display = 'flex';
            spinControls.style.flexDirection = 'column';
            spinControls.style.gap = '8px';
            spinControls.style.alignItems = 'center';
        }
    }
    
    // Vertikálne rozloženie ovládania
    function applyVerticalLayout(controls) {
        controls.style.flexDirection = 'column';
        controls.style.gap = '15px';
        
        const info = controls.querySelector('.info');
        if (info) {
            info.style.width = '100%';
            info.style.textAlign = 'center';
            info.style.alignItems = 'center';
        }
        
        const spinControls = controls.querySelector('.spin-controls');
        if (spinControls) {
            spinControls.style.flexDirection = 'row';
            spinControls.style.justifyContent = 'center';
            spinControls.style.gap = '25px';
        }
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
        window.addEventListener('resize', enhanceMobileLayout);
        window.addEventListener('orientationchange', function() {
            setTimeout(enhanceMobileLayout, 100);
        });
        
        // Nastaviť hooky na herné funkcie
        setTimeout(hookGameFunctions, 100);
        
        // Nastaviť mutation observer
        setupMutationObserver();
        
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