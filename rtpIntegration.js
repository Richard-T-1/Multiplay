// RTP Integration - prepojenie s hrou
(function() {
    'use strict';
    
    console.log('RTP Integration sa inicializuje...');
    
    // Čakanie na načítanie RTP Managera
    function waitForRTPManager() {
        return new Promise((resolve) => {
            const checkManager = () => {
                if (window.rtpManager) {
                    console.log('RTP Manager detekovaný, spúšťam integráciu');
                    resolve();
                } else {
                    setTimeout(checkManager, 100);
                }
            };
            checkManager();
        });
    }
    
    // Funkcia na prepočet výhry na základe RTP
    function adjustWinAmount(originalWin, betAmount) {
        if (!window.rtpManager) return originalWin;
        
        const shouldForceWin = window.rtpManager.shouldForceWin();
        
        if (shouldForceWin && originalWin === 0) {
            // Ak mal hráč prehrať, ale force win je aktívny
            const targetWin = window.rtpManager.calculateTargetWin(betAmount);
            console.log(`🎯 RTP korekcia: ${originalWin} → ${targetWin} B&B (Force Win)`);
            return targetWin;
        } else if (shouldForceWin && originalWin > 0) {
            // Ak mal hráč vyhrať, zvýšime výhru
            const multiplier = window.rtpManager.getWinMultiplier(betAmount);
            const adjustedWin = Math.round(originalWin * multiplier);
            console.log(`🎯 RTP korekcia: ${originalWin} → ${adjustedWin} B&B (${multiplier.toFixed(1)}x)`);
            return adjustedWin;
        }
        
        return originalWin;
    }
    
    // Hlavná integračná funkcia
    async function initializeRTPIntegration() {
        await waitForRTPManager();
        
        // Hook na startSpin funkciu
        if (window.startSpin) {
            const originalStartSpin = window.startSpin;
            window.startSpin = function() {
                // Zaznamenať stávku pred spinom
                const bet = window.currentBet || 1;
                window.rtpManager.recordBet(bet);
                
                // Spustiť pôvodný spin
                return originalStartSpin.apply(this, arguments);
            };
            console.log('✅ startSpin funkcia hooknutá pre RTP');
        }
        
        // Hook na checkWin funkciu
        if (window.checkWin) {
            const originalCheckWin = window.checkWin;
            window.checkWin = function() {
                // Uložiť referenciu na pôvodnú výhru
                const originalWinAmount = window.winAmount || 0;
                const betAmount = window.currentBet || 1;
                
                // Spustiť pôvodný checkWin
                const result = originalCheckWin.apply(this, arguments);
                
                // Upraviť výhru na základe RTP
                setTimeout(() => {
                    const currentWinAmount = window.winAmount || 0;
                    const adjustedWin = adjustWinAmount(currentWinAmount, betAmount);
                    
                    if (adjustedWin !== currentWinAmount) {
                        window.winAmount = adjustedWin;
                        window.pendingWin = adjustedWin;
                        
                        // Aktualizovať display
                        const winDisplay = document.getElementById('winDisplay');
                        if (winDisplay) {
                            winDisplay.textContent = `Výhra: ${adjustedWin} B&B`;
                        }
                    }
                    
                    // Zaznamenať finálnu výhru
                    window.rtpManager.recordWin(adjustedWin);
                }, 100);
                
                return result;
            };
            console.log('✅ checkWin funkcia hooknutá pre RTP');
        }
        
        // Monitoring zmien kreditu pre zaznamenávanie stávok
        let lastCredit = window.credit;
        setInterval(() => {
            if (window.credit !== null && window.credit !== lastCredit) {
                const creditChange = lastCredit - window.credit;
                if (creditChange > 0 && creditChange <= 20) {
                    // Pravdepodobne stávka
                    console.log(`💰 Detekovaná stávka: ${creditChange} B&B`);
                }
                lastCredit = window.credit;
            }
        }, 1000);
        
        console.log('🎮 RTP Integration úspešne inicializovaná!');
    }
    
    // Export funkcií pre testovanie
    window.rtpIntegration = {
        adjustWinAmount: adjustWinAmount,
        
        // Test funkcia pre manuálne testovanie
        testWin: function(betAmount, originalWin = 0) {
            if (!window.rtpManager) {
                console.error('RTP Manager nie je dostupný');
                return originalWin;
            }
            
            window.rtpManager.recordBet(betAmount);
            const adjustedWin = adjustWinAmount(originalWin, betAmount);
            window.rtpManager.recordWin(adjustedWin);
            
            console.log(`Test: Stávka ${betAmount} B&B → Výhra ${adjustedWin} B&B`);
            return adjustedWin;
        },
        
        // Simulácia viacerých spinov
        simulate: function(spins = 50) {
            console.log(`Simulujem ${spins} spinov...`);
            for (let i = 0; i < spins; i++) {
                const bet = Math.floor(Math.random() * 10) + 1;
                const win = Math.random() < 0.3 ? bet * (Math.random() * 5 + 1) : 0;
                this.testWin(bet, win);
            }
            window.rtpDebug.showStats();
        }
    };
    
    // Spustenie integrácie po načítaní DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRTPIntegration);
    } else {
        initializeRTPIntegration();
    }
    
    console.log('RTP Integration modul načítaný');
})();