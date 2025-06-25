(function() {
    'use strict';
    
    let layoutInitialized = false;
    let inputFocused = false;
    let layoutBlocked = false;
    
    function isMobileDevice() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isNarrowScreen = window.innerWidth <= 767;
        const isLikelyMobile = isTouchDevice && isNarrowScreen;
        
        return isLikelyMobile;
    }
    
    function enhanceMobileLayout() {
        const isMobile = isMobileDevice();
        
        if (!isMobile) {
            return;
        }
        
        if (inputFocused || layoutBlocked) {
            return;
        }
        
        if (!layoutInitialized) {
            optimizeSymbols();
            optimizeReels();
            optimizeReelsContainer();
            optimizeControls();
            addMobileCSS();
            addViewportStabilization();
            layoutInitialized = true;
        }
    }
    
    function optimizeSymbols() {
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach(function(symbol) {
            symbol.style.display = 'flex';
            symbol.style.justifyContent = 'center';
            symbol.style.alignItems = 'center';
            symbol.style.width = '100%';
            symbol.style.height = '80px';
            symbol.style.margin = '0';
            symbol.style.padding = '5px';
            symbol.style.backgroundColor = '#000';
            symbol.style.boxSizing = 'border-box';
            symbol.style.position = 'relative';
            
            const img = symbol.querySelector('img');
            if (img) {
                img.style.maxWidth = '70px';
                img.style.maxHeight = '70px';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                img.style.verticalAlign = 'middle';
                img.style.position = 'absolute';
                img.style.top = '50%';
                img.style.left = '50%';
                img.style.transform = 'translate(-50%, -50%)';
            }
        });
    }
    
    function optimizeReels() {
        const reels = document.querySelectorAll('.reel');
        reels.forEach(function(reel) {
            reel.style.width = '23%';
            reel.style.height = '240px';
            reel.style.margin = '0';
            reel.style.padding = '0';
            reel.style.border = '2px solid #500';
            reel.style.borderRadius = '5px';
            reel.style.overflow = 'hidden';
            reel.style.position = 'relative';
            reel.style.backgroundColor = '#111';
        });
    }
    
    function optimizeReelsContainer() {
        const reelsContainer = document.querySelector('.reels-container');
        if (reelsContainer) {
            reelsContainer.style.display = 'flex';
            reelsContainer.style.justifyContent = 'space-between';
            reelsContainer.style.gap = '1%';
            reelsContainer.style.padding = '10px';
            reelsContainer.style.marginBottom = '15px';
            reelsContainer.style.backgroundColor = '#000';
            reelsContainer.style.borderRadius = '10px';
            reelsContainer.style.border = '3px solid #500';
            reelsContainer.style.position = 'relative';
        }
    }
    
    function optimizeControls() {
        const controls = document.querySelector('.controls');
        if (!controls) return;
        
        controls.style.display = 'flex';
        controls.style.flexDirection = 'row';
        controls.style.justifyContent = 'space-between';
        controls.style.alignItems = 'center';
        controls.style.gap = '10px';
        controls.style.padding = '10px';
        controls.style.backgroundColor = '#111';
        controls.style.borderRadius = '5px';
        controls.style.position = 'relative';
        
        const info = controls.querySelector('.info');
        if (info) {
            info.style.flex = '1';
            info.style.textAlign = 'left';
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.alignItems = 'flex-start';
            info.style.minWidth = '120px';
            
            const winDisplay = info.querySelector('.win-display');
            if (winDisplay) {
                winDisplay.style.fontSize = '16px';
                winDisplay.style.marginBottom = '5px';
                winDisplay.style.color = '#fff';
            }
            
            const creditDisplay = info.querySelector('.credit-display');
            if (creditDisplay) {
                creditDisplay.style.fontSize = '14px';
                creditDisplay.style.color = '#fff';
            }
        }
        
        const betControls = controls.querySelector('.bet-controls');
        if (betControls) {
            betControls.style.display = 'flex';
            betControls.style.flexDirection = 'column';
            betControls.style.alignItems = 'center';
            betControls.style.minWidth = '80px';
            
            const betAmount = betControls.querySelector('.bet-amount');
            if (betAmount) {
                betAmount.style.fontSize = '20px';
                betAmount.style.color = '#f55';
                betAmount.style.marginBottom = '5px';
            }
            
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
        
        const spinControls = controls.querySelector('.spin-controls');
        if (spinControls) {
            spinControls.style.display = 'flex';
            spinControls.style.flexDirection = 'column';
            spinControls.style.gap = '15px';
            spinControls.style.alignItems = 'center';
            spinControls.style.minWidth = '90px';
            
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
    
    function addViewportStabilization() {
        if (document.getElementById('viewport-stabilization')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'viewport-stabilization';
        style.textContent = `
            html {
                height: 100%;
                height: -webkit-fill-available;
                overflow: hidden;
            }
            
            body {
                min-height: 100vh;
                min-height: -webkit-fill-available;
                position: fixed;
                width: 100%;
                top: 0;
                left: 0;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .slot-machine {
                position: relative !important;
                min-height: auto !important;
            }
            
            .reels-container {
                position: relative !important;
                height: 240px !important;
            }
            
            .reel {
                position: relative !important;
                height: 240px !important;
            }
            
            .symbols-strip {
                position: absolute !important;
                will-change: transform !important;
            }
            
            .symbol {
                position: relative !important;
                height: 80px !important;
                flex-shrink: 0 !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    function addMobileCSS() {
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
                    position: relative !important;
                }
                
                .title {
                    font-size: 20px !important;
                    margin-bottom: 15px !important;
                    padding: 8px !important;
                }
                
                .reels-container {
                    margin-bottom: 15px !important;
                    height: 240px !important;
                    position: relative !important;
                }
                
                .reel {
                    border: 2px solid #500 !important;
                    border-radius: 5px !important;
                    height: 240px !important;
                    position: relative !important;
                }
                
                .symbol {
                    height: 80px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 5px !important;
                    box-sizing: border-box !important;
                    position: relative !important;
                    flex-shrink: 0 !important;
                }
                
                .symbol img {
                    max-width: 70px !important;
                    max-height: 70px !important;
                    object-fit: contain !important;
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                }
                
                .controls {
                    flex-wrap: nowrap !important;
                    gap: 10px !important;
                    position: relative !important;
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
    
    function setupInputFocusBlocking() {
        document.addEventListener('focusin', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.type === 'number') {
                inputFocused = true;
                layoutBlocked = true;
            }
        }, true);
        
        document.addEventListener('focusout', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.type === 'number') {
                inputFocused = false;
                setTimeout(() => {
                    layoutBlocked = false;
                }, 1000);
            }
        }, true);
    }
    
    function setupResizeBlocking() {
        let originalAddEventListener = window.addEventListener;
        
        window.addEventListener = function(type, listener, options) {
            if (type === 'resize') {
                const wrappedListener = function(event) {
                    if (!inputFocused && !layoutBlocked) {
                        listener.call(this, event);
                    }
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }
    
    function initializeMobileModule() {
        setupInputFocusBlocking();
        setupResizeBlocking();
        
        enhanceMobileLayout();
        
        window.addEventListener('orientationchange', function() {
            if (!inputFocused && !layoutBlocked) {
                setTimeout(() => {
                    layoutInitialized = false;
                    enhanceMobileLayout();
                }, 500);
            }
        });
    }
    
    window.mobileLayout = {
        enhance: enhanceMobileLayout,
        isMobile: isMobileDevice,
        blockLayout: function() { layoutBlocked = true; },
        unblockLayout: function() { layoutBlocked = false; },
        optimize: {
            symbols: optimizeSymbols,
            reels: optimizeReels,
            container: optimizeReelsContainer,
            controls: optimizeControls
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileModule);
    } else {
        initializeMobileModule();
    }
    
})();