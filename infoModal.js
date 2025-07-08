

function initInfoModal() {
 
    const css = `
        .info-button {
            position: absolute;
            top: 50px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #0066cc, #004499);
            border: 2px solid #0099ff;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(0, 153, 255, 0.5);
            transition: all 0.3s ease;
            z-index: 100;
        }

        .info-button:hover {
            background: linear-gradient(135deg, #0088ff, #0066cc);
            box-shadow: 0 0 15px rgba(0, 153, 255, 0.8);
            transform: scale(1.05);
        }

        .info-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .info-modal-content {
            background: linear-gradient(135deg, #111, #222);
            border: 3px solid #ffcc00;
            border-radius: 15px;
            padding: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px rgba(255, 204, 0, 0.6);
            position: relative;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                transform: scale(0.8) translateY(-50px);
                opacity: 0;
            }
            to {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }

        .close-info {
            position: absolute;
            top: 15px;
            right: 20px;
            background: #ff4444;
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .close-info:hover {
            background: #ff6666;
            transform: scale(1.1);
        }

        .info-title {
            color: #ffcc00;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 0 0 10px #ff6600;
        }

        .info-section {
            margin-bottom: 25px;
            color: white;
        }

        .info-section h3 {
            color: #ff6600;
            font-size: 20px;
            margin-bottom: 10px;
            border-bottom: 2px solid #ff6600;
            padding-bottom: 5px;
        }

        .info-section p, .info-section li {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 8px;
        }

        .info-section ul {
            padding-left: 20px;
        }

        .symbols-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .symbols-table th,
        .symbols-table td {
            border: 1px solid #555;
            padding: 10px;
            text-align: center;
        }

        .symbols-table th {
            background-color: #333;
            color: #ffcc00;
            font-weight: bold;
        }

        .symbols-table td {
            background-color: #222;
        }

        .symbol-img {
            width: 40px;
            height: 40px;
            object-fit: contain;
            border-radius: 5px;
        }

        .wild-text {
            color: #00ff00;
            font-weight: bold;
        }

        .info-modal-content::-webkit-scrollbar {
            width: 8px;
        }

        .info-modal-content::-webkit-scrollbar-track {
            background: #333;
            border-radius: 4px;
        }

        .info-modal-content::-webkit-scrollbar-thumb {
            background: #ffcc00;
            border-radius: 4px;
        }

        @media (max-width: 768px) {
            .info-modal-content {
                width: 95%;
                padding: 15px;
                margin: 10px;
            }

            .info-title {
                font-size: 24px;
            }

            .info-section h3 {
                font-size: 18px;
            }

            .info-section p, .info-section li {
                font-size: 14px;
            }

            .symbols-table th,
            .symbols-table td {
                padding: 8px;
                font-size: 14px;
            }

            .symbol-img {
                width: 30px;
                height: 30px;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const html = `
        <button class="info-button" id="infoButton" title="Informácie a pravidlá hry">
            ℹ️
        </button>

        <div class="info-modal" id="infoModal">
            <div class="info-modal-content">
                <button class="close-info" id="closeInfo">×</button>
                
                <h2 class="info-title">B&B MULTIPLAY</h2>
                
                <div class="info-section">
                    <h3>🎰 Ako hrať</h3>
                    <p>B&B Multiplay je 4-válcová slot hra s 3 viditeľnými symbolmi na každom válci.</p>
                    <ul>
                        <li>Nastavte si stávku pomocou tlačidiel <strong>+</strong> a <strong>-</strong></li>
                        <li>Stlačte <strong>SPIN</strong> pre jedno točenie</li>
                        <li>Alebo použite <strong>AUTO</strong> pre automatické točenie</li>
                        <li>Výhry sa započítavaju za 3 alebo 4 rovnaké symboly v rade</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h3>💰 Výherné kombinácie</h3>
                    <p>Pre výhru potrebujete <strong>3 alebo 4 rovnaké symboly</strong> za sebou (zľava doprava):</p>
                    <ul>
                        <li><strong>3 symboly:</strong> Základná výhra = hodnota symbolu × stávka</li>
                        <li><strong>4 symboly:</strong> Zdvojnásobená výhra = 2× základná výhra</li>
                        <li><strong>S WILD symbolom:</strong> Zdvojnásobená výhra pre akúkoľvek kombináciu</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h3>🍎 Tabuľka symbolov</h3>
                    <table class="symbols-table">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Názov</th>
                                <th>Hodnota</th>
                                <th>Výhra za 3</th>
                                <th>Výhra za 4</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/B&B.png" alt="B&B" class="symbol-img"></td>
                                <td class="wild-text">B&B (WILD)</td>
                                <td class="wild-text">10×</td>
                                <td class="wild-text">20× stávka</td>
                                <td class="wild-text">40× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/seven.jpg" alt="Seven" class="symbol-img"></td>
                                <td>Seven</td>
                                <td>7×</td>
                                <td>7× stávka</td>
                                <td>14× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/melon.jpg" alt="Melón" class="symbol-img"></td>
                                <td>Melón</td>
                                <td>5×</td>
                                <td>5× stávka</td>
                                <td>10× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/bar.jpg" alt="Bar" class="symbol-img"></td>
                                <td>Bar</td>
                                <td>3×</td>
                                <td>3× stávka</td>
                                <td>6× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/grape.jpg" alt="Hrozno" class="symbol-img"></td>
                                <td>Hrozno</td>
                                <td>2×</td>
                                <td>2× stávka</td>
                                <td>4× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/green_grape.jpg" alt="Zelené hrozno" class="symbol-img"></td>
                                <td>Zelené hrozno</td>
                                <td>2×</td>
                                <td>2× stávka</td>
                                <td>4× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/lemon.jpg" alt="Citrón" class="symbol-img"></td>
                                <td>Citrón</td>
                                <td>1×</td>
                                <td>1× stávka</td>
                                <td>2× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/cherry.jpg" alt="Čerešňa" class="symbol-img"></td>
                                <td>Čerešňa</td>
                                <td>1×</td>
                                <td>1× stávka</td>
                                <td>2× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/orange.jpg" alt="Pomaranč" class="symbol-img"></td>
                                <td>Pomaranč</td>
                                <td>0.5×</td>
                                <td>0.5× stávka</td>
                                <td>1× stávka</td>
                            </tr>
                            <tr>
                                <td><img src="https://richard-t-1.github.io/Multiplay/obrazky/plum.jpg" alt="Slivka" class="symbol-img"></td>
                                <td>Slivka</td>
                                <td>0.5×</td>
                                <td>0.5× stávka</td>
                                <td>1× stávka</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="info-section">
                    <h3>⭐ WILD Symbol</h3>
                    <p><strong>B&B symbol</strong> je <span class="wild-text">WILD</span> symbol:</p>
                    <ul>
                        <li>Nahradí akýkoľvek iný symbol pre vytvorenie výhernej kombinácie</li>
                        <li>Akákoľvek výhra s WILD symbolom je <strong>zdvojnásobená</strong></li>
                        <li>Má najvyššiu hodnotu v hre (10×)</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h3>💎 Možné stávky</h3>
                    <p>Dostupné hodnoty stávok: <strong>10, 20, 50, 100, 200 </strong></p>
                </div>

                <div class="info-section">
                    <h3>🎮 Ovládanie</h3>
                    <ul>
                        <li><strong>SPIN:</strong> Spustí jedno točenie</li>
                        <li><strong>AUTO:</strong> Spustí automatické točenie (stlačte znovu pre zastavenie)</li>
                        <li><strong>+ / -:</strong> Zmena výšky stávky</li>
                        <li><strong>Pridať kredit:</strong> Doplnenie B&B coinov na účet</li>
                        <li><strong>Vybrať kredit:</strong> Vybratie B&B coinov z účtu</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h3>⚠️ Zodpovedné hranie</h3>
                    <ul>
                        <li>Hrajte len za peniaze, ktoré si môžete dovoliť stratiť</li>
                        <li>Nastavte si limity pre stávky a čas hrania</li>
                        <li>Hra je určená na zábavu</li>
                        <li>Pri problémoch s hraním vyhľadajte odbornú pomoc</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    setupInfoModal();
}

function setupInfoModal() {
    const infoButton = document.getElementById('infoButton');
    const infoModal = document.getElementById('infoModal');
    const closeInfo = document.getElementById('closeInfo');

    if (!infoButton || !infoModal || !closeInfo) {
        return;
    }

    infoButton.addEventListener('click', function() {
        infoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        infoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeInfo.addEventListener('click', closeModal);

    infoModal.addEventListener('click', function(e) {
        if (e.target === infoModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && infoModal.style.display === 'flex') {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initInfoModal, 1000);
});