// ==========================================
// M&B MOBILE
// ENEMIES.JS
// Gestion des unités ennemies
// ==========================================

const enemies = [];


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
    // ÉLÉMENT HTML
    // ======================================

    const element =
        document.createElement("div");


    element.classList.add(
        "enemy",
        type
    );

    element.innerHTML = `
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

        x: x,
        y: y,

        hp: 60,
        maxHp: 60,

        speed: 20,

        damage: 10,

        range: 130,

        fireRate: 1200,

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


    return createEnemy(
        x,
        y
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
            let closestDistance = Infinity;


            soldiers.forEach(
                function (soldier) {

                    if (soldier.alive === false) {
                        return;
                    }


                    const dx =
                        soldier.x - enemy.x;

                    const dy =
                        soldier.y - enemy.y;


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