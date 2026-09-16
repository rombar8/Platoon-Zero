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

    let reward =
        3 + currentWave;


    if (isBonusWave()) {

        reward +=
            bonusWaveReward;

    }


    return reward;

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

    enemiesToSpawn =
        2 + currentWave;


    // Premier spawn immédiat

    spawnTimer =
        0;


    // ======================================
    // ANNONCE
    // ======================================

    if (isBonusWave()) {

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


    announcementTimer =
        1800;

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
    // SPAWN
    // ======================================

    spawnEnemy();


    enemiesToSpawn--;


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