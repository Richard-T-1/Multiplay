class RTPassivní {
    constructor(targetRTP = 60) {
        this.targetRTP = targetRTP;
        this.stats = this.loadStats();
        this.forceWinMode = false;
        this.updateForceWinMode();
    }

    loadStats() {
        const saved = localStorage.getItem('rtpStats');
        if (saved) {
            try {
                const stats = JSON.parse(saved);
                return stats;
            } catch (e) {
            }
        }
        
        return {
            totalBets: 0,
            totalWins: 0,
            spinCount: 0,
            lastRTP: 0,
            forcedLosses: 0
        };
    }

    saveStats() {
        try {
            localStorage.setItem('rtpStats', JSON.stringify(this.stats));
        } catch (e) {
        }
    }

    recordBet(amount) {
        this.stats.totalBets += amount;
        this.stats.spinCount++;
        this.updateForceWinMode();
        this.saveStats();
    }

    recordWin(amount) {
        this.stats.totalWins += amount;
        this.updateForceWinMode();
        this.saveStats();
    }

    getCurrentRTP() {
        if (this.stats.totalBets === 0) return 0;
        return (this.stats.totalWins / this.stats.totalBets) * 100;
    }

    updateForceWinMode() {
        const currentRTP = this.getCurrentRTP();
        this.stats.lastRTP = currentRTP;
        
        this.forceWinMode = (currentRTP < 40 && this.stats.spinCount >= 10);
    }

    shouldForceWin() {
        return this.forceWinMode;
    }

    shouldForceLoss() {
        const currentRTP = this.getCurrentRTP();
        return currentRTP > this.targetRTP + 5 && this.stats.spinCount >= 20;
    }

    calculateTargetWin(betAmount) {
        if (!this.shouldForceWin()) return 0;
        
        const currentRTP = this.getCurrentRTP();
        const targetRTP = this.targetRTP;
        
        const neededWin = ((targetRTP / 100) * (this.stats.totalBets + betAmount)) - this.stats.totalWins;
        
        const minWin = betAmount * 2;
        const targetWin = Math.max(neededWin, minWin);
        
        return Math.round(targetWin);
    }

    getWinMultiplier(betAmount) {
        if (!this.shouldForceWin()) return 1;
        
        const targetWin = this.calculateTargetWin(betAmount);
        const normalWin = betAmount * 2;
        
        return Math.max(1, targetWin / normalWin);
    }

    adjustWinAmount(originalWin, betAmount) {
        this.recordBet(betAmount);
        
        let finalWin = originalWin;
        
        if (this.shouldForceLoss() && originalWin > 0) {
            finalWin = 0;
            this.stats.forcedLosses = (this.stats.forcedLosses || 0) + 1;
        }
        else if (this.shouldForceWin() && originalWin === 0) {
            finalWin = this.calculateTargetWin(betAmount);
        } else if (this.shouldForceWin() && originalWin > 0) {
            const multiplier = this.getWinMultiplier(betAmount);
            finalWin = Math.round(originalWin * multiplier);
        }
        
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
        this.targetRTP = Math.max(50, Math.min(95, newRTP));
        this.updateForceWinMode();
    }
}

window.rtpManager = new RTPassivní(80);

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
        console.log('Cieľové RTP zmenené na:', newRTP + '%');
    },
    
    forceWin: function() {
        window.rtpManager.forceWinMode = true;
        console.log('Force win mode manuálne aktivovaný');
    },
    
    forceLoss: function() {
        const originalFunction = window.rtpManager.shouldForceLoss;
        window.rtpManager.shouldForceLoss = () => true;
        console.log('🚫 Force loss mode manuálne aktivovaný na jeden spin');
        
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