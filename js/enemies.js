// ==========================================
// Platoon Zero
// ENEMIES.JS
// Gestion des unités ennemies
// ==========================================

const enemies = [];


// ==========================================
// TYPES D'ENNEMIS
// ==========================================

const enemyTypes = {

    boss: {
        name: "JUGGERNAUT",
        hp: 650,
        speed: 10,
        damage: 30,
        range: 145,
        fireRate: 900
    },

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
        rifleman: "⁛",
        scout: "∞",
        gunner: "∻",
        marksman: "⊕",
        boss: "⋰BOSS⋱"
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

        alive: true,

        // ======================================
        // MÉMOIRE D'ÉVITEMENT DES OBSTACLES
        // ======================================

        avoidingObstacle: false,

        avoidanceDirection: 0,

        avoidanceTimer: 0
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
// Déblocage progressif des spécialistes
// ==========================================

function getRandomEnemyType() {

    const roll =
        Math.random() * 100;


    // ======================================
    // VAGUES 1 - 7
    // Fusiliers uniquement
    // ======================================

    if (currentWave <= 7) {

        return "rifleman";
    }


    // ======================================
    // VAGUES 8 - 14
    //
    // 85% Fusiliers
    // 15% Éclaireurs
    // ======================================

    if (currentWave <= 14) {

        if (roll < 15) {
            return "scout";
        }

        return "rifleman";
    }


    // ======================================
    // VAGUES 15 - 21
    //
    // 70% Fusiliers
    // 20% Éclaireurs
    // 10% Mitrailleurs
    // ======================================

    if (currentWave <= 21) {

        if (roll < 10) {
            return "gunner";
        }

        if (roll < 30) {
            return "scout";
        }

        return "rifleman";
    }


    // ======================================
    // VAGUES 22 - 29
    //
    // 60% Fusiliers
    // 20% Éclaireurs
    // 13% Mitrailleurs
    // 7% Tireurs d'élite
    // ======================================

    if (currentWave <= 29) {

        if (roll < 7) {
            return "marksman";
        }

        if (roll < 20) {
            return "gunner";
        }

        if (roll < 40) {
            return "scout";
        }

        return "rifleman";
    }


    // ======================================
    // VAGUES 30 - 39
    //
    // 50% Fusiliers
    // 22% Éclaireurs
    // 18% Mitrailleurs
    // 10% Tireurs d'élite
    // ======================================

    if (currentWave <= 39) {

        if (roll < 10) {
            return "marksman";
        }

        if (roll < 28) {
            return "gunner";
        }

        if (roll < 50) {
            return "scout";
        }

        return "rifleman";
    }


    // ======================================
    // VAGUE 40+
    //
    // 40% Fusiliers
    // 25% Éclaireurs
    // 22% Mitrailleurs
    // 13% Tireurs d'élite
    // ======================================

    if (roll < 13) {
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

    const width =
        battlefield.clientWidth;

    const height =
        battlefield.clientHeight;


    let x;
    let y;


    if (
        enemySpawnWorld.initialized &&
        width > 0 &&
        height > 0
    ) {

        const worldX =
            enemySpawnWorld.minX +
            Math.random() *
            (
                enemySpawnWorld.maxX -
                enemySpawnWorld.minX
            );


        const worldY =
            enemySpawnWorld.minY +
            Math.random() *
            (
                enemySpawnWorld.maxY -
                enemySpawnWorld.minY
            );


        x =
            worldX /
            width *
            100;

        y =
            worldY /
            height *
            100;

    } else {

        x =
            10 +
            Math.random() * 80;

        y =
            5 +
            Math.random() * 5;

    }


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
// RALENTISSEMENT DES DÉFENSES
// ==========================================

function getEnemyMovementMultiplier(
    enemy
) {

    if (
        typeof getEnemyDefenseSpeedMultiplier ===
        "function"
    ) {

        return getEnemyDefenseSpeedMultiplier(
            enemy
        );
    }

    return 1;
}


// ==========================================
// DÉPLACEMENT VERS UNE POSITION
// ==========================================


        function moveEnemyTowards(
            enemy,
            targetX,
            targetY,
            deltaTime
        ) {

            const dx =
                targetX - enemy.x;

            const dy =
                targetY - enemy.y;

            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance <= 0.001
            ) {

                return;

            }


            rotateEnemyTowards(
                enemy,
                targetX,
                targetY
            );


            const directionX =
                dx / distance;

            const directionY =
                dy / distance;


            const speedMultiplier =
                getEnemyMovementMultiplier(
                    enemy
                );


            const movement =
                enemy.speed *
                speedMultiplier *
                deltaTime;


            const step =
                Math.min(
                    movement,
                    distance
                );


            // ======================================
            // DIRECTION DIRECTE
            // ======================================

            const nextX =
                enemy.x +
                directionX *
                step;

            const nextY =
                enemy.y +
                directionY *
                step;



        const directBlocked =
            typeof isEnemyPathNearObstacle ===
                "function"
                ? isEnemyPathNearObstacle(
                    nextX,
                    nextY
                )
                : (
                    typeof isUnitBlockedByObstacle ===
                        "function" &&
                    isUnitBlockedByObstacle(
                        nextX,
                        nextY
                    )
                );


            // ======================================
            // CHEMIN DIRECT LIBRE
            // ======================================

            if (
                !directBlocked &&
                !enemy.avoidingObstacle
            ) {

                enemy.x =
                    nextX;

                enemy.y =
                    nextY;

                updateEnemyPosition(
                    enemy
                );

                return;

            }


            // ======================================
            // DÉBUT DU CONTOURNEMENT
            // ======================================

            if (
                directBlocked &&
                !enemy.avoidingObstacle
            ) {

                enemy.avoidingObstacle =
                    true;

                enemy.avoidanceTimer =
                    0.75;


                // Deux directions perpendiculaires
                // possibles autour de l'obstacle.

                const sideAX =
                    -directionY;

                const sideAY =
                    directionX;

                const sideBX =
                    directionY;

                const sideBY =
                    -directionX;


                const probeDistance =
                    28;


                const sideABlocked =
                    isUnitBlockedByObstacle(
                        enemy.x +
                            sideAX *
                            probeDistance,
                        enemy.y +
                            sideAY *
                            probeDistance
                    );


                const sideBBlocked =
                    isUnitBlockedByObstacle(
                        enemy.x +
                            sideBX *
                            probeDistance,
                        enemy.y +
                            sideBY *
                            probeDistance
                    );


                // ==================================
                // CHOIX DU CÔTÉ
                // ==================================

                if (
                    !sideABlocked &&
                    sideBBlocked
                ) {

                    enemy.avoidanceDirection =
                        1;

                } else if (
                    sideABlocked &&
                    !sideBBlocked
                ) {

                    enemy.avoidanceDirection =
                        -1;

                } else {

                    // Si les deux côtés sont libres,
                    // choisit celui qui rapproche
                    // le plus de la cible.

                    const distanceA =
                        Math.hypot(
                            targetX -
                                (
                                    enemy.x +
                                    sideAX *
                                    probeDistance
                                ),
                            targetY -
                                (
                                    enemy.y +
                                    sideAY *
                                    probeDistance
                                )
                        );


                    const distanceB =
                        Math.hypot(
                            targetX -
                                (
                                    enemy.x +
                                    sideBX *
                                    probeDistance
                                ),
                            targetY -
                                (
                                    enemy.y +
                                    sideBY *
                                    probeDistance
                                )
                        );


                    enemy.avoidanceDirection =
                        distanceA <= distanceB
                            ? 1
                            : -1;

                }

            }


            // ======================================
            // CONTOURNEMENT DE L'OBSTACLE
            // ======================================

            if (
                enemy.avoidingObstacle
            ) {

                enemy.avoidanceTimer -=
                    deltaTime;


                const sideDirection =
                    enemy.avoidanceDirection;


                const avoidX =
                    -directionY *
                    sideDirection;

                const avoidY =
                    directionX *
                    sideDirection;


                // Mélange déplacement latéral +
                // légère progression vers la cible.

                let moveX =
                    avoidX * 0.85 +
                    directionX * 0.35;

                let moveY =
                    avoidY * 0.85 +
                    directionY * 0.35;


                const moveLength =
                    Math.hypot(
                        moveX,
                        moveY
                    );


                if (
                    moveLength > 0
                ) {

                    moveX /=
                        moveLength;

                    moveY /=
                        moveLength;

                }


                const avoidNextX =
                    enemy.x +
                    moveX *
                    step;

                const avoidNextY =
                    enemy.y +
                    moveY *
                    step;


                const avoidBlocked =
                    isUnitBlockedByObstacle(
                        avoidNextX,
                        avoidNextY
                    );


                // ==================================
                // DÉPLACEMENT DE CONTOURNEMENT
                // ==================================

                if (
                    !avoidBlocked
                ) {

                    enemy.x =
                        avoidNextX;

                    enemy.y =
                        avoidNextY;

                } else {

                    // Le côté choisi est lui-même
                    // bloqué : essaie l'autre côté.

                    enemy.avoidanceDirection *=
                        -1;


                    const reverseX =
                        directionY *
                        sideDirection;

                    const reverseY =
                        -directionX *
                        sideDirection;


                    const reverseNextX =
                        enemy.x +
                        reverseX *
                        step;

                    const reverseNextY =
                        enemy.y +
                        reverseY *
                        step;


                    const reverseBlocked =
                        isUnitBlockedByObstacle(
                            reverseNextX,
                            reverseNextY
                        );


                    if (
                        !reverseBlocked
                    ) {

                        enemy.x =
                            reverseNextX;

                        enemy.y =
                            reverseNextY;

                    }

                }


                // ==================================
                // PEUT-IL REPRENDRE SA ROUTE ?
                // ==================================

                const resumeX =
                    enemy.x +
                    directionX *
                    24;

                const resumeY =
                    enemy.y +
                    directionY *
                    24;


                const canResume =
                    !isUnitBlockedByObstacle(
                        resumeX,
                        resumeY
                    );


                if (
                    canResume &&
                    enemy.avoidanceTimer <= 0
                ) {

                    enemy.avoidingObstacle =
                        false;

                    enemy.avoidanceTimer =
                        0;

                }

            }


            updateEnemyPosition(
                enemy
            );

        }


// ==========================================
// SOLDAT ALLIÉ LE PLUS PROCHE
// ==========================================

function getClosestSoldier(
    enemy
) {

    let closestSoldier = null;

    let closestDistance =
        Infinity;


    soldiers.forEach(
        function (soldier) {

            if (!soldier.alive) {
                return;
            }


            const dx =
                soldier.x -
                enemy.x;

            const dy =
                soldier.y -
                enemy.y;

            const distance =
                Math.hypot(
                    dx,
                    dy
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


    return {
        soldier: closestSoldier,
        distance: closestDistance
    };
}


// ==========================================
// IA SURVIE
// ==========================================

function moveEnemySurvival(
    enemy,
    deltaTime
) {

    const closest =
        getClosestSoldier(
            enemy
        );

    const closestSoldier =
        closest.soldier;

    const closestDistance =
        closest.distance;


    if (!closestSoldier) {
        return;
    }


    // Regarde sa cible

    rotateEnemyTowards(
        enemy,
        closestSoldier.x,
        closestSoldier.y
    );


    // À portée :
    // ne bouge plus.

    if (
        closestDistance <=
        enemy.range * 0.90
    ) {

        return;
    }


    moveEnemyTowards(
        enemy,
        closestSoldier.x,
        closestSoldier.y,
        deltaTime
    );
}


// ==========================================
// IA DOMINATION
// ==========================================

function moveEnemyDomination(
    enemy,
    deltaTime
) {

    const battlefieldRect =
        battlefield.getBoundingClientRect();


    const flagX =
        battlefieldRect.width / 2;

    const flagY =
        battlefieldRect.height / 2;


    const dx =
        flagX -
        enemy.x;

    const dy =
        flagY -
        enemy.y;


    const distanceToFlag =
        Math.hypot(
            dx,
            dy
        );


    // ======================================
    // ZONE DE CAPTURE
    // ======================================

    const dominationRadius = 60;


    // ======================================
    // PAS ENCORE DANS LE POINT
    // ======================================

    if (
        distanceToFlag >
        dominationRadius
    ) {

        moveEnemyTowards(
            enemy,
            flagX,
            flagY,
            deltaTime
        );

        return;
    }


    // ======================================
    // DANS LE POINT
    // ======================================
    //
    // IMPORTANT :
    // aucune IA de déplacement vers les
    // soldats ne s'exécute ici.
    //
    // L'ennemi conserve donc le point.
    // Le système de combat peut toujours
    // gérer ses tirs indépendamment.
    // ======================================

    const closest =
        getClosestSoldier(
            enemy
        );


    // Il peut regarder un soldat proche
    // sans se déplacer vers lui.

    if (
        closest.soldier &&
        closest.distance <= enemy.range
    ) {

        rotateEnemyTowards(
            enemy,
            closest.soldier.x,
            closest.soldier.y
        );

        return;
    }


    // Aucun soldat à portée :
    // regarde vers le centre du point.

    rotateEnemyTowards(
        enemy,
        flagX,
        flagY
    );
}


// ==========================================
// DÉPLACEMENT DES ENNEMIS
// ==========================================

function moveEnemies(
    deltaTime
) {

    // ======================================
    // CHEAT — FREEZE ENNEMIS
    // ======================================

    if (
        typeof cheatState !== "undefined" &&
        cheatState.freezeEnemies
    ) {

        return;
    }


    enemies.forEach(
        function (enemy) {

            if (!enemy.alive) {
                return;
            }


            // ==================================
            // DOMINATION
            // ==================================

            if (
                typeof selectedGameMode !==
                    "undefined" &&
                selectedGameMode ===
                    "domination"
            ) {

                moveEnemyDomination(
                    enemy,
                    deltaTime
                );

                return;
            }


            // ==================================
            // SURVIE
            // ==================================

            moveEnemySurvival(
                enemy,
                deltaTime
            );
        }
    );
}