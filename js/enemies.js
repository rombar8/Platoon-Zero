// ==========================================
// M&B MOBILE
// ENEMIES.JS
// Gestion des unités ennemies
// ==========================================

const enemies = [];


// ==========================================
// TYPES D'ENNEMIS
// ==========================================

const enemyTypes = {

    rifleman: {
        name: "Fusilier",
        hp: 60,
        speed: 20,
        damage: 10,
        range: 130,
        fireRate: 1200
    },

    scout: {
        name: "Éclaireur",
        hp: 40,
        speed: 32,
        damage: 7,
        range: 100,
        fireRate: 900
    },

    gunner: {
        name: "Mitrailleur",
        hp: 100,
        speed: 14,
        damage: 13,
        range: 120,
        fireRate: 650
    },

    marksman: {
        name: "Tireur d'élite",
        hp: 45,
        speed: 16,
        damage: 22,
        range: 210,
        fireRate: 2200
    }

};


// ==========================================
// CRÉATION D'UN ENNEMI
// ==========================================

function createEnemy(
    xPercent,
    yPercent,
    type = "rifleman"
) {

    const rect =
        battlefield.getBoundingClientRect();

    const x =
        rect.width * (xPercent / 100);

    const y =
        rect.height * (yPercent / 100);


    // ======================================
    // TYPE / STATS
    // ======================================

    const stats =
        enemyTypes[type] ||
        enemyTypes.rifleman;

    const difficulty =
        typeof getDifficulty === "function"
        ? getDifficulty()
        : {
            enemyHp: 1,
            enemyDamage: 1,
            enemySpeed: 1,
            enemyCount: 1,
            pointGain: 1
        };


    // ======================================
    // ÉLÉMENT HTML
    // ======================================

    const element =
        document.createElement("div");

    element.classList.add(
        "enemy",
        type
    );

    const classIcons = {
        rifleman: "",
        scout: "⚡",
        gunner: "◆",
        marksman: "⌖"
    };

    element.innerHTML = `
        <span class="enemy-class">
            ${classIcons[type] || ""}
        </span>

        <span class="enemy-icon">
            <span class="enemy-helmet"></span>
            <span class="enemy-body"></span>
            <span class="enemy-gun"></span>
        </span>
    `;

    battlefield.appendChild(
        element
    );


    // ======================================
    // OBJET ENNEMI
    // ======================================

    const enemy = {

        element: element,

        type: type,

        name: stats.name,

        x: x,
        y: y,

        hp:
            stats.hp *
            difficulty.enemyHp,

        maxHp:
            stats.hp *
            difficulty.enemyHp,

        speed:
            stats.speed *
            difficulty.enemySpeed,

        damage:
            stats.damage *
            difficulty.enemyDamage,

        range:
            stats.range,

        fireRate:
            stats.fireRate,

        target: null,

        isFiring: false,

        lastShot: 0,

        alive: true
    };


    enemies.push(
        enemy
    );

    updateEnemyPosition(
        enemy
    );

    return enemy;
}


// ==========================================
// POSITION VISUELLE
// ==========================================

function updateEnemyPosition(
    enemy
) {

    enemy.element.style.left =
        enemy.x + "px";

    enemy.element.style.top =
        enemy.y + "px";
}


// ==========================================
// CHOIX DU TYPE D'ENNEMI
// ==========================================

function getRandomEnemyType() {

    const roll =
        Math.random() * 100;


    // ======================================
    // VAGUES 1 - 2
    // Fusiliers uniquement
    // ======================================

    if (currentWave < 3) {

        return "rifleman";
    }


    // ======================================
    // VAGUES 3 - 4
    // Apparition des éclaireurs
    // ======================================

    if (currentWave < 5) {

        if (roll < 25) {

            return "scout";
        }

        return "rifleman";
    }


    // ======================================
    // VAGUES 5 - 7
    // Apparition des mitrailleurs
    // ======================================

    if (currentWave < 8) {

        if (roll < 20) {

            return "gunner";
        }

        if (roll < 45) {

            return "scout";
        }

        return "rifleman";
    }


    // ======================================
    // VAGUE 8+
    // Toutes les classes
    // ======================================

    if (roll < 15) {

        return "marksman";
    }

    if (roll < 35) {

        return "gunner";
    }

    if (roll < 60) {

        return "scout";
    }

    return "rifleman";
}


// ==========================================
// SPAWN EN HAUT DU TERRAIN
// ==========================================

function spawnEnemy() {

    const x =
        10 +
        Math.random() * 80;

    // Arrivée depuis le haut
    const y =
        5 +
        Math.random() * 5;

    const type =
        getRandomEnemyType();

    return createEnemy(
        x,
        y,
        type
    );
}


// ==========================================
// ORIENTATION ENNEMIE
// ==========================================

function rotateEnemyTowards(
    enemy,
    targetX,
    targetY
) {

    rotateUnitTowards(
        enemy,
        targetX,
        targetY
    );
}


// ==========================================
// DÉPLACEMENT DES ENNEMIS
// ==========================================

function moveEnemies(deltaTime) {

    enemies.forEach(
        function (enemy) {

            if (!enemy.alive) {

                return;
            }


            // ==================================
            // CHERCHE L'ALLIÉ LE PLUS PROCHE
            // ==================================

            let closestSoldier = null;

            let closestDistance =
                Infinity;


            soldiers.forEach(
                function (soldier) {

                    if (
                        soldier.alive === false
                    ) {

                        return;
                    }

                    const dx =
                        soldier.x -
                        enemy.x;

                    const dy =
                        soldier.y -
                        enemy.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                    if (
                        distance <
                        closestDistance
                    ) {

                        closestDistance =
                            distance;

                        closestSoldier =
                            soldier;
                    }
                }
            );


            if (!closestSoldier) {

                return;
            }


            // ==================================
            // REGARDE L'ALLIÉ
            // ==================================

            rotateUnitTowards(
                enemy,
                closestSoldier.x,
                closestSoldier.y
            );


            // ==================================
            // À PORTÉE = ARRÊTE D'AVANCER
            // ==================================

            if (
                closestDistance <=
                enemy.range * 0.90
            ) {

                return;
            }


            // ==================================
            // AVANCE
            // ==================================

            const dx =
                closestSoldier.x -
                enemy.x;

            const dy =
                closestSoldier.y -
                enemy.y;

            const directionX =
                dx /
                closestDistance;

            const directionY =
                dy /
                closestDistance;

            const movement =
                enemy.speed *
                deltaTime;

            enemy.x +=
                directionX *
                movement;

            enemy.y +=
                directionY *
                movement;


            updateEnemyPosition(
                enemy
            );
        }
    );
}