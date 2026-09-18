// ==========================================
// M&B MOBILE
// DOMINATION.JS
// Mode de jeu Domination
// ==========================================


// ==========================================
// ÉTAT DOMINATION
// ==========================================

let dominationScore = 0;

const DOMINATION_MAX_SCORE = 500;

const DOMINATION_POINT_INTERVAL = 5000;



let dominationPointTimer = 0;


// ==========================================
// INITIALISATION
// ==========================================

function startDomination() {

    dominationScore = 0;

    createDominationFlag();

    console.log(
        "Mode DOMINATION lancé."
    );
}


// ==========================================
// DRAPEAU CENTRAL
// ==========================================

function createDominationFlag() {

    const oldFlag =
        battlefield.querySelector(
            ".domination-flag"
        );

    if (oldFlag) {
        oldFlag.remove();
    }


    const flag =
        document.createElement("div");

    flag.className =
        "domination-flag";

flag.innerHTML = `

    <div class="domination-zone">
        <div class="domination-inner-zone"></div>
    </div>

    <div class="domination-score">
        <span class="score-arrow left"></span>

        <span class="score-value">
            0 / ${DOMINATION_MAX_SCORE}
        </span>

        <span class="score-arrow right"></span>
    </div>

    <div class="domination-pointer"></div>

    <div class="flag-pole">

        <div class="flag-cloth"></div>

        <div class="flag-base">
            <span></span>
            <span></span>
            <span></span>
        </div>

    </div>

`;

    battlefield.appendChild(flag);
}

// ==========================================
// CONTRÔLE DU POINT
// ==========================================

function getDominationControl() {

    const flag =
        battlefield.querySelector(
            ".domination-flag"
        );

    if (!flag) {
        return "neutral";
    }


    const battlefieldRect =
        battlefield.getBoundingClientRect();

    const centerX =
        battlefieldRect.width / 2;

    const centerY =
        battlefieldRect.height / 2;

    const captureRadius = 75;


    // ======================================
    // ALLIÉS DANS LA ZONE
    // ======================================

    const alliesInside =
        soldiers.filter(soldier => {

            if (!soldier.alive) {
                return false;
            }

            const distance =
                Math.hypot(
                    soldier.x - centerX,
                    soldier.y - centerY
                );

            return distance <= captureRadius;
        });


    // ======================================
    // ENNEMIS DANS LA ZONE
    // ======================================

    const enemiesInside =
        enemies.filter(enemy => {

            if (!enemy.alive) {
                return false;
            }

            const distance =
                Math.hypot(
                    enemy.x - centerX,
                    enemy.y - centerY
                );

            return distance <= captureRadius;
        });


    // ======================================
    // ÉTAT DU POINT
    // ======================================

    if (
        alliesInside.length > 0 &&
        enemiesInside.length > 0
    ) {
        return "contested";
    }

    if (alliesInside.length > 0) {
        return "allied";
    }

    if (enemiesInside.length > 0) {
        return "enemy";
    }

    return "neutral";
}

// ==========================================
// MISE À JOUR DOMINATION
// ==========================================

function updateDomination(deltaTime) {

    if (selectedGameMode !== "domination") {
        return;
    }

    const flag =
        battlefield.querySelector(
            ".domination-flag"
        );

    if (!flag) {
        return;
    }

    const control =
        getDominationControl();


    // ======================================
    // VISUEL DU POINT
    // ======================================

    flag.classList.remove(
        "allied",
        "enemy",
        "contested",
        "neutral"
    );

    flag.classList.add(control);


// ======================================
// PROGRESSION
// ======================================

if (
    control === "allied" ||
    control === "enemy"
) {

    dominationPointTimer +=
        deltaTime * 1000;

    if (
        dominationPointTimer >=
        DOMINATION_POINT_INTERVAL
    ) {

        dominationPointTimer -=
            DOMINATION_POINT_INTERVAL;


        // ALLIÉS
        if (control === "allied") {
            dominationScore++;
        }


        // ENNEMIS
        if (control === "enemy") {
            dominationScore--;
        }


        // Limite entre -1000 et +1000
        dominationScore =
            Math.max(
                -DOMINATION_MAX_SCORE,
                Math.min(
                    dominationScore,
                    DOMINATION_MAX_SCORE
                )
            );


        updateDominationScore();
    }

} else {

    // Point vide ou contesté
    dominationPointTimer = 0;
}

}


// ==========================================
// AFFICHAGE DU SCORE
// ==========================================

function updateDominationScore() {

    const scoreDisplay =
        battlefield.querySelector(
            ".score-value"
        );

    const flag =
        battlefield.querySelector(
            ".domination-flag"
        );

    if (!scoreDisplay || !flag) {
        return;
    }


    // Toujours afficher un nombre positif
    scoreDisplay.textContent =
        `${Math.abs(dominationScore)} / ${DOMINATION_MAX_SCORE}`;


    // Retire l'ancien propriétaire du score
    flag.classList.remove(
        "score-allied",
        "score-enemy",
        "score-neutral"
    );

    // ======================================
    // VICTOIRE / DÉFAITE
    // ======================================

    if (
        dominationScore >=
        DOMINATION_MAX_SCORE
    ) {

        endDominationGame("allied");
        return;
    }


    if (
        dominationScore <=
        -DOMINATION_MAX_SCORE
    ) {

        endDominationGame("enemy");
        return;
    }


    if (dominationScore > 0) {

        flag.classList.add(
            "score-allied"
        );

    } else if (dominationScore < 0) {

        flag.classList.add(
            "score-enemy"
        );

    } else {

        flag.classList.add(
            "score-neutral"
        );
    }
}


// ==========================================
// FIN DE PARTIE DOMINATION
// ==========================================

function endDominationGame(winner) {

    if (
        typeof gameOver !== "undefined" &&
        gameOver
    ) {
        return;
    }

    if (winner === "allied") {

        endGame(
            "domination-victory"
        );

    } else {

        endGame(
            "domination-defeat"
        );
    }
}