// RTP Management System - UPRAVENÝ PRE 80% RTP
class RTPassivní {
    constructor(targetRTP = 60) {  // ZMENENÉ NA 80%
        this.targetRTP = targetRTP;
        this.stats = this.loadStats();
        this.forceWinMode = false;
        this.updateForceWinMode();
        
        console.log('RTP Manager inicializovaný s cieľovým RTP:', this.targetRTP + '%');
    }

    loadStats() {
        const saved = localStorage.getItem('rtpStats');
        if (saved) {
            try {
                const stats = JSON.parse(saved);
                console.log('Načítané RTP štatistiky:', stats);
                return stats;
            } catch (e) {
                console.warn('Chyba pri načítaní RTP štatistík:', e);
            }
        }
        
        return {
            totalBets: 0,
            totalWins: 0,
            spinCount: 0,
            lastRTP: 0,
            forcedLosses: 0  // PRIDANÉ
        };
    }

    saveStats() {
        try {
            localStorage.setItem('rtpStats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Chyba pri ukladaní RTP štatistík:', e);
        }
    }

    recordBet(amount) {
        this.stats.totalBets += amount;
        this.stats.spinCount++;
        this.updateForceWinMode();
        this.saveStats();
        
        console.log(`Stávka zaznamenána: ${amount} B&B | Celkové stávky: ${this.stats.totalBets} B&B`);
    }

    recordWin(amount) {
        this.stats.totalWins += amount;
        this.updateForceWinMode();
        this.saveStats();
        
        if (amount > 0) {
            console.log(`Výhra zaznamenána: ${amount} B&B | Celkové výhry: ${this.stats.totalWins} B&B`);
        }
    }

    getCurrentRTP() {
        if (this.stats.totalBets === 0) return 0;
        return (this.stats.totalWins / this.stats.totalBets) * 100;
    }

    updateForceWinMode() {
        const currentRTP = this.getCurrentRTP();
        this.stats.lastRTP = currentRTP;
        
        // Aktivovať force win ak RTP klesne pod 40% a máme aspoň 10 spinov (UPRAVENÉ PRE 80% TARGET)
        this.forceWinMode = (currentRTP < 40 && this.stats.spinCount >= 10);
        
        if (this.forceWinMode) {
            console.log(`🔥 FORCE WIN MODE AKTIVOVANÝ! Aktuálne RTP: ${currentRTP.toFixed(1)}%`);
        }
    }

    shouldForceWin() {
        return this.forceWinMode;
    }

    // 🆕 NOVÁ FUNKCIA - kontrola forced loss
    shouldForceLoss() {
        const currentRTP = this.getCurrentRTP();
        // Force loss ak RTP stúpne nad 85% (5% nad target) a máme aspoň 20 spinov
        return currentRTP > this.targetRTP + 5 && this.stats.spinCount >= 20;
    }

    calculateTargetWin(betAmount) {
        if (!this.shouldForceWin()) return 0;
        
        const currentRTP = this.getCurrentRTP();
        const targetRTP = this.targetRTP;
        
        // Výpočet potrebnej výhry na dosiahnutie cieľového RTP
        const neededWin = ((targetRTP / 100) * (this.stats.totalBets + betAmount)) - this.stats.totalWins;
        
        // Minimálna výhra by mala byť aspoň 2x stávka
        const minWin = betAmount * 2;
        const targetWin = Math.max(neededWin, minWin);
        
        console.log(`💰 Cieľová výhra pre force win: ${targetWin.toFixed(0)} B&B (RTP: ${currentRTP.toFixed(1)}% → ${targetRTP}%)`);
        
        return Math.round(targetWin);
    }

    getWinMultiplier(betAmount) {
        if (!this.shouldForceWin()) return 1;
        
        const targetWin = this.calculateTargetWin(betAmount);
        const normalWin = betAmount * 2; // Základná výhra
        
        return Math.max(1, targetWin / normalWin);
    }

    // 🔥 HLAVNÁ FUNKCIA - s forced loss systémom
    adjustWinAmount(originalWin, betAmount) {
        // Zaznamenať stávku
        this.recordBet(betAmount);
        
        let finalWin = originalWin;
        
        // 🚫 FORCED LOSS KONTROLA (NOVÁ LOGIKA)
        if (this.shouldForceLoss() && originalWin > 0) {
            // Force loss - zmeniť výhru na prehru
            finalWin = 0;
            this.stats.forcedLosses = (this.stats.forcedLosses || 0) + 1;
            console.log(`🚫 FORCED LOSS: ${originalWin} → 0 B&B (RTP: ${this.getCurrentRTP().toFixed(1)}%)`);
        }
        // 🎯 FORCE WIN KONTROLA (PÔVODNÁ LOGIKA)
        else if (this.shouldForceWin() && originalWin === 0) {
            // Force win - hráč mal prehrať ale dostane výhru
            finalWin = this.calculateTargetWin(betAmount);
            console.log(`🎯 FORCE WIN aktivovaný: 0 → ${finalWin} B&B`);
        } else if (this.shouldForceWin() && originalWin > 0) {
            // Zvýšiť existujúcu výhru
            const multiplier = this.getWinMultiplier(betAmount);
            finalWin = Math.round(originalWin * multiplier);
            console.log(`🎯 Výhra zvýšená multiplierom ${multiplier.toFixed(1)}x: ${finalWin} B&B`);
        }
        
        // Zaznamenať finálnu výhru
        this.recordWin(finalWin);
        
        return finalWin;
    }

    resetStats() {
        this.stats = {
            totalBets: 0,
            totalWins: 0,
            spinCount: 0,
            lastRTP: 0,
            forcedLosses: 0
        };
        this.forceWinMode = false;
        this.saveStats();
        
        console.log('RTP štatistiky resetované');
    }

    getStats() {
        return {
            ...this.stats,
            currentRTP: this.getCurrentRTP(),
            targetRTP: this.targetRTP,
            forceWinMode: this.forceWinMode,
            forcedLosses: this.stats.forcedLosses || 0
        };
    }

    setTargetRTP(newRTP) {
        this.targetRTP = Math.max(50, Math.min(95, newRTP));  // ROZŠÍRENÝ ROZSAH
        this.updateForceWinMode();
        console.log('Cieľové RTP zmenené na:', this.targetRTP + '%');
    }
}

// Globálne inicializácia s 80% RTP
window.rtpManager = new RTPassivní(80);

// Debug rozhranie
window.rtpDebug = {
    showStats: function() {
        const stats = window.rtpManager.getStats();
        console.log('=== RTP STATISTICS ===');
        console.log(`Total Bets: ${stats.totalBets} B&B`);
        console.log(`Total Wins: ${stats.totalWins} B&B`);
        console.log(`Spin Count: ${stats.spinCount}`);
        console.log(`Forced Losses: ${stats.forcedLosses}`);
        console.log(`Current RTP: ${stats.currentRTP.toFixed(1)}% (Target: ${stats.targetRTP}%)`);
        console.log(`Force Win Mode: ${stats.forceWinMode}`);
        
        // Dodatočné info
        const difference = stats.currentRTP - stats.targetRTP;
        if (Math.abs(difference) > 5) {
            console.log(`⚠️  RTP je ${difference > 0 ? 'vysoké' : 'nízke'} o ${Math.abs(difference).toFixed(1)}%`);
        } else {
            console.log(`✅ RTP je v cieľovom rozsahu`);
        }
        
        return stats;
    },
    
    reset: function() {
        window.rtpManager.resetStats();
        console.log('RTP štatistiky boli resetované');
    },
    
    setRTP: function(newRTP) {
        window.rtpManager.setTargetRTP(newRTP);
    },
    
    forceWin: function() {
        window.rtpManager.forceWinMode = true;
        console.log('Force win mode manuálne aktivovaný');
    },
    
    // 🆕 NOVÉ DEBUG FUNKCIE
    forceLoss: function() {
        const originalFunction = window.rtpManager.shouldForceLoss;
        window.rtpManager.shouldForceLoss = () => true;
        console.log('🚫 Force loss mode manuálne aktivovaný na jeden spin');
        
        // Reset po jednom spine
        setTimeout(() => {
            window.rtpManager.shouldForceLoss = originalFunction.bind(window.rtpManager);
        }, 100);
    },
    
    simulate: function(spins = 100) {
        console.log(`🎰 Simulácia ${spins} spinov...`);
        const startRTP = window.rtpManager.getCurrentRTP();
        
        for (let i = 0; i < spins; i++) {
            const bet = 10;
            const randomWin = Math.random() < 0.3 ? bet * (1 + Math.random() * 3) : 0;
            window.rtpManager.adjustWinAmount(randomWin, bet);
        }
        
        const endRTP = window.rtpManager.getCurrentRTP();
        console.log(`📊 RTP: ${startRTP.toFixed(1)}% → ${endRTP.toFixed(1)}%`);
        
        return this.showStats();
    }
};

console.log('🎯 RTP Manager načítaný s cieľovým RTP 80% a forced loss systémom!');