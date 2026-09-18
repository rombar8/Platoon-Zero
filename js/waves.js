// ==========================================
// M&B MOBILE
// WAVES.JS
// Vagues + récompenses + timers pausables
// ==========================================


// ==========================================
// ÉTAT DES VAGUES
// ==========================================

let currentWave = 0;

let waveActive = false;

let waveSpawning = false;


// ==========================================
// CONFIGURATION
// ==========================================

const timeBetweenWaves = 5000;

const enemySpawnDelay = 450;

const bonusWaveInterval = 5;

const bonusWaveReward = 10;


// ==========================================
// TIMERS INTERNES
// ==========================================

let enemiesToSpawn = 0;

let bossesToSpawn = 0;

let spawnTimer = 0;

let nextWaveTimer = 0;

let announcementTimer = 0;

let waveCountdownActive = false;


// ==========================================
// ÉLÉMENTS HTML
// ==========================================

const waveNumberDisplay =
    document.querySelector("#wave-number");

const waveAnnouncement =
    document.querySelector("#wave-announcement");

const waveTitle =
    document.querySelector("#wave-title");

const waveSubtitle =
    document.querySelector("#wave-subtitle");


// ==========================================
// ANNONCES
// ==========================================

function showWaveAnnouncement(
    title,
    subtitle = ""
) {

    waveTitle.textContent =
        title;

    waveSubtitle.textContent =
        subtitle;

    waveAnnouncement.classList.remove(
        "hidden"
    );

}


function hideWaveAnnouncement() {

    waveAnnouncement.classList.add(
        "hidden"
    );

}


// ==========================================
// VAGUE BONUS
// ==========================================

function isBonusWave() {

    return (
        currentWave > 0 &&
        currentWave %
        bonusWaveInterval === 0
    );

}


// ==========================================
// RÉCOMPENSE
// ==========================================

function getWaveReward() {

    const difficulty =
        getDifficulty();

    // Récompense de base beaucoup plus faible
    let baseReward =
        2 + Math.floor(currentWave / 3);

    // Bonus toutes les 5 vagues
    if (isBonusWave()) {
        baseReward +=
            bonusWaveReward;
    }

    // La difficulté modifie les gains
    // Plus la difficulté est élevée,
    // plus la récompense est importante
    
    const finalReward =
        Math.max(
            1,
            Math.round(
                baseReward *
                difficulty.pointGain
            )
        );

    return finalReward;
}


function rewardWave() {

    const reward =
        getWaveReward();


    commandPoints +=
        reward;


    updatePoints();


    if (isBonusWave()) {

        showWaveAnnouncement(
            "★ VAGUE " +
            currentWave +
            " TERMINÉE ★",

            "+" +
            reward +
            " POINTS BONUS"
        );

    } else {

        showWaveAnnouncement(
            "VAGUE " +
            currentWave +
            " TERMINÉE",

            "+" +
            reward +
            " POINTS"
        );

    }


    announcementTimer =
        1200;

}


// ==========================================
// LANCER UNE VAGUE
// ==========================================

function startNextWave() {

    if (
        waveActive ||
        waveSpawning ||
        gameOver
    ) {

        return;

    }


    currentWave++;


    waveActive =
        true;


    waveSpawning =
        true;


    waveCountdownActive =
        false;


    waveNumberDisplay.textContent =
        currentWave;


    // ======================================
    // NOMBRE D'ENNEMIS
    // ======================================

const difficulty =
    getDifficulty();

const baseEnemyCount =
    2 + currentWave;

enemiesToSpawn =
    Math.max(
        1,
        Math.round(
            baseEnemyCount *
            difficulty.enemyCount
        )
    );

// ======================================
// BOSS
// 1 boss vague 10
// 2 boss vague 20
// 3 boss vague 30...
// ======================================

if (
    currentWave % 10 === 0
) {

    bossesToSpawn =
        Math.floor(
            currentWave / 10
        );

} else {

    bossesToSpawn = 0;
}


    // Premier spawn immédiat

    spawnTimer =
        0;


    // ======================================
// ANNONCE
// ======================================

if (bossesToSpawn > 0) {

    showWaveAnnouncement(
        "☠ VAGUE BOSS " +
        currentWave +
        " ☠",

        bossesToSpawn +
        (
            bossesToSpawn > 1
                ? " JUGGERNAUTS"
                : " JUGGERNAUT"
        ) +
        " • " +
        enemiesToSpawn +
        " ENNEMIS"
    );

} else if (isBonusWave()) {

    showWaveAnnouncement(
        "★ VAGUE BONUS " +
        currentWave +
        " ★",

        enemiesToSpawn +
        " ENNEMIS"
    );

} else {

    showWaveAnnouncement(
        "VAGUE " +
        currentWave,

        enemiesToSpawn +
        " ENNEMIS"
    );
}

announcementTimer = 1800;

}


// ==========================================
// SPAWN PROGRESSIF
// ==========================================

function updateEnemySpawning(
    deltaMilliseconds
) {

    if (!waveSpawning) {
        return;
    }


    spawnTimer -=
        deltaMilliseconds;


    if (spawnTimer > 0) {
        return;
    }


// ======================================
// SPAWN DES BOSS EN PRIORITÉ
// ======================================

if (bossesToSpawn > 0) {

    const bossX =
        20 +
        Math.random() * 60;

    const bossY =
        5 +
        Math.random() * 5;

    createEnemy(
        bossX,
        bossY,
        "boss"
    );

    bossesToSpawn--;

} else if (enemiesToSpawn > 0) {

    // Ennemi normal
    spawnEnemy();

    enemiesToSpawn--;
}


// ======================================
// FIN DU SPAWN
// ======================================

if (
    bossesToSpawn <= 0 &&
    enemiesToSpawn <= 0
) {

    bossesToSpawn = 0;
    enemiesToSpawn = 0;

    waveSpawning = false;

    return;
}


// ======================================
// PROCHAIN SPAWN
// ======================================

spawnTimer =
    enemySpawnDelay;


    if (
        enemiesToSpawn <= 0
    ) {

        enemiesToSpawn =
            0;

        waveSpawning =
            false;

        return;

    }


    spawnTimer =
        enemySpawnDelay;

}


// ==========================================
// FIN DE VAGUE
// ==========================================

function finishWave() {

    if (!waveActive) {
        return;
    }


    waveActive =
        false;


    rewardWave();


    // ======================================
    // COMPTE À REBOURS
    // ======================================

    nextWaveTimer =
        timeBetweenWaves;


    waveCountdownActive =
        true;

}


// ==========================================
// COMPTE À REBOURS
// ==========================================

function updateWaveCountdown(
    deltaMilliseconds
) {

    if (!waveCountdownActive) {
        return;
    }


    nextWaveTimer -=
        deltaMilliseconds;


    const seconds =
        Math.max(
            1,
            Math.ceil(
                nextWaveTimer /
                1000
            )
        );


    // On laisse l'annonce
    // de récompense 1.2 sec.

    if (
        announcementTimer <= 0
    ) {

        showWaveAnnouncement(
            "ZONE SÉCURISÉE",

            "PROCHAINE VAGUE : " +
            seconds
        );

    }


    // ======================================
    // PROCHAINE VAGUE
    // ======================================

    if (
        nextWaveTimer <= 0
    ) {

        nextWaveTimer =
            0;


        waveCountdownActive =
            false;


        hideWaveAnnouncement();


        startNextWave();

    }

}


// ==========================================
// ANNONCES
// ==========================================

function updateWaveAnnouncement(
    deltaMilliseconds
) {

    if (
        announcementTimer <= 0
    ) {

        return;

    }


    announcementTimer -=
        deltaMilliseconds;


    if (
        announcementTimer <= 0 &&
        !waveCountdownActive
    ) {

        announcementTimer =
            0;


        hideWaveAnnouncement();

    }

}


// ==========================================
// MISE À JOUR DES VAGUES
// ==========================================

function updateWaves(
    deltaTime
) {

    // deltaTime arrive en secondes.
    // On le convertit en millisecondes.

    const deltaMilliseconds =
        deltaTime * 1000;


    // ======================================
    // ANNONCES
    // ======================================

    updateWaveAnnouncement(
        deltaMilliseconds
    );


    // ======================================
    // SPAWN
    // ======================================

    updateEnemySpawning(
        deltaMilliseconds
    );


    // ======================================
    // FIN DE VAGUE
    // ======================================

    if (
        waveActive &&
        !waveSpawning &&
        enemies.length === 0
    ) {

        finishWave();

    }


    // ======================================
    // PROCHAINE VAGUE
    // ======================================

    updateWaveCountdown(
        deltaMilliseconds
    );

}

// ==========================================
// RESET DES VAGUES
// ==========================================

function resetWaves() {

    currentWave = 0;
    bossesToSpawn = 0;

    waveActive = false;
    waveSpawning = false;

    enemiesToSpawn = 0;

    spawnTimer = 0;
    nextWaveTimer = 0;
    announcementTimer = 0;

    waveCountdownActive = false;

    if (waveNumberDisplay) {
        waveNumberDisplay.textContent = "0";
    }

    hideWaveAnnouncement();
}