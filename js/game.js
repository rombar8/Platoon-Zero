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

const speedButton =
    document.querySelector("#speed-button");

const speedValue = document.querySelector("#speed-value");


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

let gameSpeed = 1;
let gameTime = 0;


// ==========================================
// ÉLÉMENTS GAME OVER
// ==========================================

const gameOverScreen =
    document.querySelector("#game-over");

const gameOverTitle =
    document.querySelector(
        "#game-over-title"
    );

const gameOverSubtitle =
    document.querySelector(
        "#game-over-subtitle"
    );

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

            // ======================================
            // NETTOYAGE
            // ======================================

            battlefield
                .querySelectorAll(
                    ".battlefield-grass, " +
                    ".battlefield-rock, " +
                    ".battlefield-log, " +
                    ".battlefield-tree"
                )
                .forEach(
                    function (element) {

                        element.remove();

                    }
                );


            // ======================================
            // 🌿 HERBES
            // ======================================

            for (
                let i = 0;
                i < 50;
                i++
            ) {

                const grass =
                    document.createElement(
                        "div"
                    );

                grass.className =
                    "battlefield-grass";

                grass.style.left =
                    (
                        5 +
                        Math.random() * 90
                    ) +
                    "%";

                grass.style.top =
                    (
                        10 +
                        Math.random() * 75
                    ) +
                    "%";

                grass.style.transform =
                    `rotate(${Math.random() * 360}deg)`;

                battlefield.appendChild(
                    grass
                );

            }


            // ======================================
            // 🪨 PETITS ROCHERS
            // ======================================

            for (
                let i = 0;
                i < 12;
                i++
            ) {

                const rock =
                    document.createElement(
                        "div"
                    );

                rock.className =
                    "battlefield-rock";

                rock.style.left =
                    (
                        5 +
                        Math.random() * 90
                    ) +
                    "%";

                rock.style.top =
                    (
                        10 +
                        Math.random() * 75
                    ) +
                    "%";

                const scale =
                    0.7 +
                    Math.random() * 0.7;

                rock.style.transform =
                    `rotate(${Math.random() * 360}deg) scale(${scale})`;

                battlefield.appendChild(
                    rock
                );

            }


            // ======================================
            // 🪵 TRONCS COUCHÉS
            // ======================================

            for (
                let i = 0;
                i < 5;
                i++
            ) {

                const log =
                    document.createElement(
                        "div"
                    );

                log.className =
                    "battlefield-log";

                log.style.left =
                    (
                        10 +
                        Math.random() * 80
                    ) +
                    "%";

                log.style.top =
                    (
                        15 +
                        Math.random() * 60
                    ) +
                    "%";

                log.style.transform =
                    `rotate(${-35 + Math.random() * 70}deg)`;

                battlefield.appendChild(
                    log
                );

            }


            // ======================================
            // 🌲 ARBRES VISUELS
            // ======================================

            for (
                let i = 0;
                i < 22;
                i++
            ) {

                let x;
                let y;
                let validPosition =
                    false;


                while (
                    !validPosition
                ) {

                    x =
                        5 +
                        Math.random() * 90;

                    y =
                        8 +
                        Math.random() * 78;


                    // Zone de spawn alliée
                    // laissée volontairement dégagée.

                    const insideSpawnZone =
                        x >= 34 &&
                        x <= 66 &&
                        y >= 78;


                    if (
                        !insideSpawnZone
                    ) {

                        validPosition =
                            true;

                    }

                }


                const tree =
                    document.createElement(
                        "div"
                    );

                tree.className =
                    "battlefield-tree";

                tree.style.left =
                    x + "%";

                tree.style.top =
                    y + "%";


                const scale =
                    0.75 +
                    Math.random() * 0.75;

                const rotation =
                    Math.random() * 360;


                tree.style.transform =
                    `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;


                battlefield.appendChild(
                    tree
                );

            }

        }

    // ======================================
    // SÉLECTION DU MODE DE JEU
    // ======================================

    let selectedGameMode = "survival";

    const gameModeButtons =
        document.querySelectorAll(
            ".gamemode-buttons button"
        );

    gameModeButtons.forEach(button => {

        button.addEventListener("click", () => {

            selectedGameMode =
                button.dataset.gamemode;

            gameModeButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            console.log(
                "Mode sélectionné :",
                selectedGameMode
            );

        });

    });

        // ======================================
        // SÉLECTION DE LA CARTE
        // ======================================

        let selectedMap =
            "map1";


        const mapButtons =
            document.querySelectorAll(
                ".map-buttons button"
            );


        mapButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        selectedMap =
                            button.dataset.map;


                        mapButtons.forEach(
                            function (btn) {

                                btn.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        button.classList.add(
                            "selected"
                        );


                        console.log(
                            "Carte sélectionnée :",
                            selectedMap
                        );

                    }
                );

            }
        );

// ======================================
// SÉLECTION DE LA DIFFICULTÉ
// ======================================

const difficultyButtons =
    document.querySelectorAll(
        ".difficulty-buttons button"
    );

const difficultyInfoName =
    document.querySelector("#difficulty-info-name");

const difficultyInfoDescription =
    document.querySelector("#difficulty-info-description");

const difficultyDescriptions = {
    easy:
        "Ennemis affaiblis. Plus de points de commandement.",

    medium:
        "Expérience standard. Forces ennemies équilibrées.",

    hard:
        "Ennemis plus résistants et plus nombreux.",

    extreme:
        "Combats violents. Les erreurs coûtent cher.",

    apocalypse:
        "Forces ennemies massives. Ressources fortement limitées.",

    ultimate:
        "Survie extrême. Ennemis surpuissants et très nombreux.",

    impossible:
        "Aucune pitié. Tout est contre vous."
};    


difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Récupère la difficulté du bouton
        selectedDifficulty =
            button.dataset.difficulty;

        // Retire la sélection actuelle
        difficultyButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // Sélectionne le nouveau bouton
        button.classList.add("selected");

        const difficulty =
            getDifficulty();

        difficultyInfoName.textContent =
            difficulty.name;

        difficultyInfoDescription.textContent =
            difficultyDescriptions[selectedDifficulty];

        console.log(
            "Difficulté sélectionnée :",
            getDifficulty().name
        );

    });

});


        // ==========================================
        // CHARGEMENT DES CARTES
        // ==========================================

        
        function loadSelectedMap() {

            // ======================================
            // MAP 2 TEMPORAIREMENT DÉSACTIVÉE
            // ======================================

            selectedMap =
                "map1";


            // ======================================
            // NETTOYAGE DES OBSTACLES
            // ======================================

            if (
                typeof resetObstacles ===
                    "function"
            ) {

                resetObstacles();

            }


            // ======================================
            // CHARGEMENT MAP 1
            // ======================================

            loadMap1();

        }


        // ==========================================
        // MAP 1 — CHAMP DE BATAILLE
        // ==========================================

        
        
        
        function loadMap1() {

            battlefield.classList.remove(
                "map-urban"
            );

            battlefield.classList.add(
                "map-battlefield"
            );


            // ======================================
            // DÉCORATIONS VISUELLES
            // ======================================

            createBattlefieldDecorations();


            // ======================================
            // 🪨 GROS ROCHERS SOLIDES
            // ======================================

            if (
                typeof createSolidRock ===
                    "function"
            ) {

                createSolidRock(
                    120,
                    150,
                    72
                );

                createSolidRock(
                    340,
                    330,
                    64
                );

                createSolidRock(
                    610,
                    180,
                    82
                );

                createSolidRock(
                    820,
                    310,
                    68
                );

                createSolidRock(
                    700,
                    500,
                    76
                );

                createSolidRock(
                    210,
                    500,
                    62
                );

            }

            
        // ======================================
        // 🪵 TRONCS SOLIDES
        // ======================================

        if (
            typeof createSolidLog ===
                "function"
        ) {

            
        
        createSolidLog(
            260,
            240,
            110,
            42
        );

        createSolidLog(
            480,
            410,
            125,
            46
        );

        createSolidLog(
            730,
            260,
            105,
            40
        );

        createSolidLog(
            570,
            550,
            115,
            43
        );

        }


            console.log(
                "Map chargée : Champ de bataille"
            );

        }


        // ==========================================
        // MAP 2 — ZONE URBAINE
        // ==========================================

            
        function loadMap2() {

            // ======================================
            // STYLE DE LA MAP
            // ======================================

            battlefield.classList.remove(
                "map-battlefield"
            );

            battlefield.classList.add(
                "map-urban"
            );


            // ======================================
            // SUPPRESSION DU DÉCOR MAP 1
            // ======================================

            battlefield
                .querySelectorAll(
                    ".battlefield-grass, " +
                    ".battlefield-rock, " +
                    ".battlefield-log"
                )
                .forEach(
                    function (element) {

                        element.remove();

                    }
                );


            // ======================================
            // CONSTRUCTION MAP 2
            // ======================================

            if (
                typeof buildUrbanMap ===
                "function"
            ) {

                
        requestAnimationFrame(
            function () {

                buildUrbanMap();

            }
        );

            }


            console.log(
                "Map chargée : Zone urbaine"
            );

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

    loadSelectedMap();


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
    // LANCEMENT DU MODE DE JEU
    // ======================================

    if (selectedGameMode === "domination") {

        startDomination();
        startNextWave();

} else {

    startNextWave();

}


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

            const riflemanSpawn =
                getAlliedSpawnPosition();

            const marksmanSpawn =
                getAlliedSpawnPosition();

            const scoutSpawn =
                getAlliedSpawnPosition();

            const gunnerSpawn =
                getAlliedSpawnPosition();


            createSoldier(
                riflemanSpawn.x,
                riflemanSpawn.y,
                "rifleman"
            );


            createSoldier(
                marksmanSpawn.x,
                marksmanSpawn.y,
                "marksman"
            );


            createSoldier(
                scoutSpawn.x,
                scoutSpawn.y,
                "scout"
            );


            createSoldier(
                gunnerSpawn.x,
                gunnerSpawn.y,
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
    // VITESSE DU JEU
    // ======================================

    deltaTime *=
        gameSpeed;

    gameTime +=
        deltaTime * 1000;


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
    // DÉFENSES
    // ======================================

    if (
        typeof updateDefenses ===
        "function"
    ) {

        updateDefenses(
            gameTime
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
            gameTime
        );


        // ==================================
        // MÉDECINS
        // ==================================

        if (
            typeof updateMedics ===
            "function"
        ) {

            updateMedics(
                gameTime
            );
        }
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
    // DOMINATION
    // ======================================

    if (
        selectedGameMode === "domination" &&
        typeof updateDomination === "function"
    ) {

        updateDomination(deltaTime);
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

function endGame(reason = "eliminated") {

    if (gameOver) {
        return;
    }


    gameOver = true;

    gameStarted = false;

    gamePaused = false;

    // ======================================
    // TYPE DE FIN
    // ======================================

    let endTitle = "☠ GAME OVER";
    let endSubtitle = "ESCOUADE ÉLIMINÉE";

    if (selectedGameMode === "domination") {

        if (reason === "domination-victory") {

            endTitle = "🚩 VICTOIRE";
            endSubtitle = "POINT SÉCURISÉ";

        } else if (reason === "domination-defeat") {

            endTitle = "☠ DÉFAITE";
            endSubtitle = "POSITION PERDUE";

        }
    }


    // ======================================
    // AFFICHAGE DU TYPE DE FIN
    // ======================================

    if (gameOverTitle) {
        gameOverTitle.textContent = endTitle;
    }

    if (gameOverSubtitle) {

        gameOverSubtitle.textContent =
            endSubtitle;

        gameOverSubtitle.classList.remove(
            "hidden"
        );
    }


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

    gameSpeed = 1;

    gameTime = 0;

    if (speedValue) {
        speedValue.textContent = "×1";
    }


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
    // DOMINATION
    // ======================================

    if (
        typeof resetDomination === "function"
    ) {
        resetDomination();
    }

        resetTacticalCosts();

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

if (speedButton) {

    speedButton.addEventListener(
        "click",
        function () {

            if (!gameStarted || gameOver) {
                return;
            }

            // ×1 → ×2 → ×4 → ×1
            if (gameSpeed === 1) {
                gameSpeed = 2;

            } else if (gameSpeed === 2) {
                gameSpeed = 4;

            } else {
                gameSpeed = 1;
            }

            // Mise à jour graphique
            const speedValue =
                document.querySelector("#speed-value");

            if (speedValue) {
                speedValue.textContent =
                    "×" + gameSpeed;
            }
        }
    );
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