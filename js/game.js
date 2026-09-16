// ==========================================
// M&B MOBILE
// GAME.JS
// Gestion principale du jeu
// ==========================================


// ==========================================
// ÉLÉMENTS HTML
// ==========================================

const mainMenu =
    document.querySelector("#main-menu");

const playButton =
    document.querySelector("#play-button");

const helpButton =
    document.querySelector("#help-button");

const helpPanel =
    document.querySelector("#help-panel");

const closeHelpButton =
    document.querySelector("#close-help");

const game =
    document.querySelector("#game");

const battlefield =
    document.querySelector("#battlefield");

const pointsDisplay =
    document.querySelector("#points");

const soldiersCountDisplay =
    document.querySelector("#soldiers-count");

const tacticalPanel =
    document.querySelector("#tactical-panel");

const tacticalTitle =
    document.querySelector("#tactical-title");

const tacticalContent =
    document.querySelector("#tactical-content");

const closeTacticalButton =
    document.querySelector("#close-tactical");

const commandButtons =
    document.querySelectorAll(
        "#command-bar button"
    );


// ==========================================
// JOUEUR
// ==========================================

const playerNameInput =
    document.querySelector("#player-name");

const bestScoreDisplay =
    document.querySelector("#best-score");


let playerName =
    localStorage.getItem(
        "mb_player_name"
    ) || "";


let bestScore =
    Number(
        localStorage.getItem(
            "mb_best_score"
        )
    ) || 0;


// ==========================================
// ÉTAT DU JEU
// ==========================================

const soldiers = [];

let selectedSoldier = null;

let gameStarted = false;

let gameOver = false;

let gamePaused = false;

let commandPoints = 10;


// ==========================================
// TEMPS
// ==========================================

let lastFrameTime = 0;


// ==========================================
// ÉLÉMENTS GAME OVER
// ==========================================

const gameOverScreen =
    document.querySelector("#game-over");

const gameOverPlayer =
    document.querySelector(
        "#game-over-player"
    );

const finalWaveDisplay =
    document.querySelector("#final-wave");

const finalKillsDisplay =
    document.querySelector("#final-kills");

const finalScoreDisplay =
    document.querySelector("#final-score");

const newRecordDisplay =
    document.querySelector("#new-record");

const restartButton =
    document.querySelector("#restart-button");

const menuButton =
    document.querySelector("#menu-button");


// ==========================================
// ÉLÉMENTS PAUSE
// ==========================================

const pauseButton =
    document.querySelector("#pause-button");

const pauseMenu =
    document.querySelector("#pause-menu");

const resumeButton =
    document.querySelector("#resume-button");

const pauseMenuButton =
    document.querySelector(
        "#pause-menu-button"
    );


// ==========================================
// INITIALISATION PROFIL
// ==========================================

if (playerNameInput) {

    playerNameInput.value =
        playerName;
}


if (bestScoreDisplay) {

    bestScoreDisplay.textContent =
        bestScore;
}


// ==========================================
// MENU PRINCIPAL
// ==========================================

playButton.addEventListener(
    "click",
    startGame
);


helpButton.addEventListener(
    "click",
    function () {

        helpPanel.classList.remove(
            "hidden"
        );
    }
);


closeHelpButton.addEventListener(
    "click",
    function () {

        helpPanel.classList.add(
            "hidden"
        );
    }
);


function createBattlefieldDecorations() {


    // Supprime toutes les anciennes décorations
    battlefield
        .querySelectorAll(
            ".battlefield-grass, .battlefield-rock, .battlefield-log"
        )
        .forEach(function (element) {
            element.remove();
        });


    // 🌿 Herbes
    for (let i = 0; i < 50; i++) {

        const grass = document.createElement("div");

        grass.className = "battlefield-grass";

        grass.style.left =
            (5 + Math.random() * 90) + "%";

        grass.style.top =
            (10 + Math.random() * 75) + "%";

        grass.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        battlefield.appendChild(grass);
    }


    // 🪨 Petit rocher
    for (let i = 0; i < 12; i++) {

        const rock = document.createElement("div");

        rock.className = "battlefield-rock";

        rock.style.left =
            (5 + Math.random() * 90) + "%";

        rock.style.top =
            (10 + Math.random() * 75) + "%";

        const scale =
            0.7 + Math.random() * 0.7;

        rock.style.transform =
            `rotate(${Math.random() * 360}deg) scale(${scale})`;

        battlefield.appendChild(rock);
    }


    // 🪵 Troncs d'arbres couchés
    for (let i = 0; i < 5; i++) {

        const log = document.createElement("div");

        log.className = "battlefield-log";

        log.style.left =
            (10 + Math.random() * 80) + "%";

        log.style.top =
            (15 + Math.random() * 60) + "%";

        log.style.transform =
            `rotate(${-35 + Math.random() * 70}deg)`;

        battlefield.appendChild(log);
    }
}


// ==========================================
// LANCEMENT D'UNE PARTIE
// ==========================================

function startGame() {

    if (gameStarted) {
        return;
    }


    // ======================================
    // PSEUDO
    // ======================================

    if (playerNameInput) {

        const enteredName =
            playerNameInput.value
                .trim()
                .toUpperCase();


        if (enteredName) {

            playerName =
                enteredName;
        }
    }


    if (!playerName) {

        playerName =
            "ANONYME";
    }


    localStorage.setItem(
        "mb_player_name",
        playerName
    );


    // ======================================
    // NETTOYAGE DE SÉCURITÉ
    // ======================================

    resetGameState();

    createBattlefieldDecorations();


    // ======================================
    // ÉTAT
    // ======================================

    gameStarted = true;

    gameOver = false;

    gamePaused = false;


    // ======================================
    // INTERFACE
    // ======================================

    mainMenu.classList.add(
        "hidden"
    );


    game.classList.remove(
        "hidden"
    );


    game.classList.remove(
        "paused"
    );


    if (gameOverScreen) {

        gameOverScreen.classList.add(
            "hidden"
        );
    }


    if (pauseMenu) {

        pauseMenu.classList.add(
            "hidden"
        );
    }


    // ======================================
    // POINTS
    // ======================================

    commandPoints = 10;

    updatePoints();


    // ======================================
    // ESCOUADE DE DÉPART
    // ======================================

    createStartingSquad();


    // ======================================
    // PREMIÈRE VAGUE
    // ======================================

    startNextWave();


    // ======================================
    // BOUCLE
    // ======================================

    lastFrameTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );


    console.log(
        "M&B Mobile lancé !",
        playerName
    );
}


// ==========================================
// ESCOUADE DE DÉPART
// ==========================================

function createStartingSquad() {

    createSoldier(
        30,
        75,
        "rifleman"
    );


    createSoldier(
        70,
        75,
        "marksman"
    );


    createSoldier(
        40,
        88,
        "scout"
    );


    createSoldier(
        60,
        88,
        "gunner"
    );


    updateSoldiersCount();
}


// ==========================================
// POINTS
// ==========================================

function updatePoints() {

    if (!pointsDisplay) {
        return;
    }


    pointsDisplay.textContent =
        commandPoints;
}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop(currentTime) {

    if (!gameStarted) {
        return;
    }


    // ======================================
    // PAUSE
    // ======================================

    if (gamePaused) {

        lastFrameTime =
            currentTime;


        requestAnimationFrame(
            gameLoop
        );


        return;
    }


    // ======================================
    // DELTA TIME
    // ======================================

    let deltaTime =
        (
            currentTime -
            lastFrameTime
        ) /
        1000;


    lastFrameTime =
        currentTime;


    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    // ======================================
    // ALLIÉS
    // ======================================

    if (
        typeof moveSoldiers ===
        "function"
    ) {

        moveSoldiers(
            deltaTime
        );
    }


    // ======================================
    // ENNEMIS
    // ======================================

    if (
        typeof moveEnemies ===
        "function"
    ) {

        moveEnemies(
            deltaTime
        );
    }


    // ======================================
    // COMBAT
    // ======================================

    if (
        typeof updateCombat ===
        "function"
    ) {

        updateCombat(
            currentTime
        );
    }


    // ======================================
    // SUPPORTS
    // ======================================

    if (
        typeof updateSupports ===
        "function"
    ) {

        updateSupports(
            deltaTime
        );
    }


    // ======================================
    // VAGUES
    // ======================================

    if (
        typeof updateWaves ===
        "function"
    ) {

        updateWaves(
            deltaTime
        );
    }


    // ======================================
    // GAME OVER
    // ======================================

    if (
        soldiers.length === 0 &&
        !gameOver
    ) {

        endGame();

        return;
    }


    // ======================================
    // FRAME SUIVANTE
    // ======================================

    requestAnimationFrame(
        gameLoop
    );
}


// ==========================================
// FIN DE PARTIE
// ==========================================

function endGame() {

    if (gameOver) {
        return;
    }


    gameOver = true;

    gameStarted = false;

    gamePaused = false;


    game.classList.remove(
        "paused"
    );


    // ======================================
    // SCORE
    // ======================================

    const kills =
        typeof totalKills !==
        "undefined"
            ? totalKills
            : 0;


    const wave =
        typeof currentWave !==
        "undefined"
            ? currentWave
            : 0;


    const score =
        calculateFinalScore(
            kills,
            wave
        );


    // ======================================
    // AFFICHAGE
    // ======================================

    if (gameOverPlayer) {

        gameOverPlayer.textContent =
            playerName;
    }


    if (finalWaveDisplay) {

        finalWaveDisplay.textContent =
            wave;
    }


    if (finalKillsDisplay) {

        finalKillsDisplay.textContent =
            kills;
    }


    if (finalScoreDisplay) {

        finalScoreDisplay.textContent =
            score;
    }


    // ======================================
    // RECORD
    // ======================================

    const newRecord =
        saveBestScore(
            score
        );


    if (newRecordDisplay) {

        if (newRecord) {

            newRecordDisplay.classList.remove(
                "hidden"
            );

        } else {

            newRecordDisplay.classList.add(
                "hidden"
            );
        }
    }


    // ======================================
    // FERMETURE DES AUTRES FENÊTRES
    // ======================================

    if (tacticalPanel) {

        tacticalPanel.classList.add(
            "hidden"
        );
    }


    if (pauseMenu) {

        pauseMenu.classList.add(
            "hidden"
        );
    }


    if (
        typeof hideUnitPanel ===
        "function"
    ) {

        hideUnitPanel();
    }


    // ======================================
    // GAME OVER
    // ======================================

    if (gameOverScreen) {

        gameOverScreen.classList.remove(
            "hidden"
        );
    }


    console.log(
        "GAME OVER",
        playerName,
        score
    );
}


// ==========================================
// CALCUL SCORE
// ==========================================

function calculateFinalScore(
    kills,
    wave
) {

    const killScore =
        kills * 100;


    const waveScore =
        wave * 500;


    return (
        killScore +
        waveScore
    );
}


// ==========================================
// RECORD
// ==========================================

function saveBestScore(score) {

    if (
        score <= bestScore
    ) {

        return false;
    }


    bestScore =
        score;


    localStorage.setItem(
        "mb_best_score",
        bestScore
    );


    if (bestScoreDisplay) {

        bestScoreDisplay.textContent =
            bestScore;
    }


    return true;
}


// ==========================================
// RESET GÉNÉRAL
// ==========================================

function resetGameState() {

    // ======================================
    // ARRÊT
    // ======================================

    gameStarted = false;

    gamePaused = false;

    gameOver = false;


    game.classList.remove(
        "paused"
    );


    // ======================================
    // SÉLECTION
    // ======================================

    if (selectedSoldier) {

        selectedSoldier.element
            ?.classList
            .remove(
                "selected"
            );
    }


    selectedSoldier = null;


    if (
        typeof hideUnitPanel ===
        "function"
    ) {

        hideUnitPanel();
    }


    // ======================================
    // SOLDATS
    // ======================================

    soldiers.forEach(
        function (soldier) {

            if (
                soldier &&
                soldier.element
            ) {

                soldier.element.remove();
            }
        }
    );


    soldiers.length = 0;


    // ======================================
    // ENNEMIS
    // ======================================

    if (
        typeof enemies !==
        "undefined"
    ) {

        enemies.forEach(
            function (enemy) {

                if (
                    enemy &&
                    enemy.element
                ) {

                    enemy.element.remove();
                }
            }
        );


        enemies.length = 0;
    }


    // ======================================
    // COMBAT
    // ======================================

    if (
        typeof resetCombat ===
        "function"
    ) {

        resetCombat();
    }


    // ======================================
    // SUPPORTS
    // ======================================

    if (
        typeof resetSupports ===
        "function"
    ) {

        resetSupports();
    }


    // ======================================
    // DEFENSES
    // ======================================

    if (
        typeof resetDefenses === 
        "function"
    ) {
    
        resetDefenses();
    }


    // ======================================
    // VAGUES
    // ======================================

    if (
        typeof resetWaves ===
        "function"
    ) {

        resetWaves();
    }


    // ======================================
    // NETTOYAGE VISUEL
    // ======================================

    battlefield
        .querySelectorAll(
            ".bullet-tracer, " +
            ".support-explosion, " +
            ".mortar-marker, " +
            ".supply-marker, " +
            ".supply-crate, " +
            ".order-indicator"
        )
        .forEach(
            function (element) {

                element.remove();
            }
        );


    // ======================================
    // HUD
    // ======================================

    commandPoints = 10;

    updatePoints();


    const killsDisplay =
        document.querySelector(
            "#kills"
        );


    if (killsDisplay) {

        killsDisplay.textContent =
            "0";
    }


    if (soldiersCountDisplay) {

        soldiersCountDisplay.textContent =
            "0";
    }


    const waveDisplay =
        document.querySelector(
            "#wave-number"
        );


    if (waveDisplay) {

        waveDisplay.textContent =
            "0";
    }


    // ======================================
    // FENÊTRES
    // ======================================

    if (tacticalPanel) {

        tacticalPanel.classList.add(
            "hidden"
        );
    }


    if (pauseMenu) {

        pauseMenu.classList.add(
            "hidden"
        );
    }


    if (gameOverScreen) {

        gameOverScreen.classList.add(
            "hidden"
        );
    }


    console.log(
        "Partie réinitialisée."
    );
}


// ==========================================
// REJOUER
// ==========================================

function restartGame() {

    resetGameState();


    // On garde le même pseudo.

    if (playerNameInput) {

        playerNameInput.value =
            playerName;
    }


    startGame();
}


// ==========================================
// RETOUR MENU
// ==========================================

function returnToMainMenu() {

    resetGameState();


    // ======================================
    // INTERFACE
    // ======================================

    game.classList.add(
        "hidden"
    );


    mainMenu.classList.remove(
        "hidden"
    );


    helpPanel.classList.add(
        "hidden"
    );


    // ======================================
    // PSEUDO CONSERVÉ
    // ======================================

    if (playerNameInput) {

        playerNameInput.value =
            playerName;
    }


    // ======================================
    // RECORD CONSERVÉ
    // ======================================

    if (bestScoreDisplay) {

        bestScoreDisplay.textContent =
            bestScore;
    }


    console.log(
        "Retour au menu."
    );
}


// ==========================================
// PAUSE
// ==========================================

function pauseGame() {

    if (
        !gameStarted ||
        gameOver
    ) {

        return;
    }


    gamePaused = true;


    game.classList.add(
        "paused"
    );


    if (pauseMenu) {

        pauseMenu.classList.remove(
            "hidden"
        );
    }
}


// ==========================================
// REPRENDRE
// ==========================================

function resumeGame() {

    if (
        !gameStarted ||
        gameOver
    ) {

        return;
    }


    gamePaused = false;


    game.classList.remove(
        "paused"
    );


    lastFrameTime =
        performance.now();


    if (pauseMenu) {

        pauseMenu.classList.add(
            "hidden"
        );
    }
}


// ==========================================
// BOUTONS GAME OVER
// ==========================================

if (restartButton) {

    restartButton.addEventListener(
        "click",
        restartGame
    );
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        returnToMainMenu
    );
}


// ==========================================
// BOUTONS PAUSE
// ==========================================

if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        pauseGame
    );
}


if (resumeButton) {

    resumeButton.addEventListener(
        "click",
        resumeGame
    );
}


if (pauseMenuButton) {

    pauseMenuButton.addEventListener(
        "click",
        returnToMainMenu
    );
}


// ==========================================
// INITIALISATION
// ==========================================

updatePoints();


console.log(
    "M&B Mobile prêt."
);