// ==========================================
// M&B MOBILE
// COMBAT.JS
// Système de combat
// ==========================================


// ==========================================
// ÉTAT DU COMBAT
// ==========================================

let totalKills = 0;


// ==========================================
// DISTANCE ENTRE DEUX UNITÉS
// ==========================================

function getDistance(unitA, unitB) {

    const dx =
        unitB.x - unitA.x;

    const dy =
        unitB.y - unitA.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ==========================================
// CIBLE LA PLUS PROCHE
// ==========================================

function findClosestTarget(
    unit,
    possibleTargets
) {

    let closestTarget = null;

    let closestDistance = Infinity;


    possibleTargets.forEach(
        function (target) {

            if (
                !target ||
                !target.alive
            ) {
                return;
            }


            const distance =
                getDistance(
                    unit,
                    target
                );


            if (
                distance <= unit.range &&
                distance < closestDistance
            ) {

                closestTarget =
                    target;

                closestDistance =
                    distance;
            }
        }
    );


    return closestTarget;
}


// ==========================================
// EFFET VISUEL DU TIR
// ==========================================

function createTracer(
    shooter,
    target,
    enemyShot = false
) {

    if (
        !shooter ||
        !target
    ) {
        return;
    }


    const tracer =
        document.createElement(
            "div"
        );


    tracer.classList.add(
        "bullet-tracer"
    );


    if (enemyShot) {

        tracer.classList.add(
            "enemy-tracer"
        );
    }


    const dx =
        target.x - shooter.x;

    const dy =
        target.y - shooter.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI;


    tracer.style.left =
        shooter.x + "px";

    tracer.style.top =
        shooter.y + "px";

    tracer.style.width =
        distance + "px";

    tracer.style.transform =
        "rotate(" +
        angle +
        "deg)";


    battlefield.appendChild(
        tracer
    );


    // Purement visuel :
    // pas d'effet sur le gameplay.

    setTimeout(
        function () {

            tracer.remove();

        },
        70
    );
}


// ==========================================
// DÉGÂTS
// ==========================================

function damageUnit(
    target,
    damage,
    attacker
) {

    if (
        !target ||
        !target.alive
    ) {
        return;
    }


    target.hp -= damage;


    if (target.hp < 0) {

        target.hp = 0;
    }


    // ======================================
    // FICHE DU SOLDAT
    // ======================================

    if (
        target === selectedSoldier &&
        typeof showUnitPanel === "function"
    ) {

        showUnitPanel(
            target
        );
    }


    // ======================================
    // MORT
    // ======================================

    if (target.hp <= 0) {

        killUnit(
            target,
            attacker
        );
    }
}


// ==========================================
// MORT D'UNE UNITÉ
// ==========================================

function killUnit(
    target,
    attacker
) {

    if (
        !target ||
        !target.alive
    ) {
        return;
    }


    target.alive = false;


    target.element.classList.add(
        "dead"
    );


    // ======================================
    // ENNEMI TUÉ
    // ======================================

    if (
        enemies.includes(
            target
        )
    ) {

        const index =
            enemies.indexOf(
                target
            );


        if (index !== -1) {

            enemies.splice(
                index,
                1
            );
        }


        // ==================================
        // KILL INDIVIDUEL
        // ==================================

        if (
            attacker &&
            soldiers.includes(
                attacker
            )
        ) {

            attacker.kills++;
        }


        // ==================================
        // KILL GLOBAL
        // ==================================

        totalKills++;


        const killsDisplay =
            document.querySelector(
                "#kills"
            );


        if (killsDisplay) {

            killsDisplay.textContent =
                totalKills;
        }
    }


    // ======================================
    // SOLDAT ALLIÉ TUÉ
    // ======================================

    else if (
        soldiers.includes(
            target
        )
    ) {

        const index =
            soldiers.indexOf(
                target
            );


        if (index !== -1) {

            soldiers.splice(
                index,
                1
            );
        }


        // ==================================
        // HUD
        // ==================================

        if (
            typeof updateSoldiersCount ===
            "function"
        ) {

            updateSoldiersCount();
        }


        // ==================================
        // UNITÉ SÉLECTIONNÉE MORTE
        // ==================================

        if (
            selectedSoldier ===
            target
        ) {

            selectedSoldier = null;


            if (
                typeof hideUnitPanel ===
                "function"
            ) {

                hideUnitPanel();
            }
        }
    }


    // ======================================
    // SUPPRESSION VISUELLE
    // ======================================

    setTimeout(
        function () {

            if (
                target.element
            ) {

                target.element.remove();
            }

        },
        700
    );
}


// ==========================================
// TIR
// ==========================================

function shoot(
    shooter,
    target,
    enemyShot = false
) {

    if (
        !shooter ||
        !shooter.alive ||
        !target ||
        !target.alive
    ) {

        return;
    }


    // ======================================
    // ORIENTATION
    // ======================================

    if (
        typeof rotateUnitTowards ===
        "function"
    ) {

        rotateUnitTowards(
            shooter,
            target.x,
            target.y
        );
    }


    // ======================================
    // TRACEUR
    // ======================================

    createTracer(
        shooter,
        target,
        enemyShot
    );


    // ======================================
    // DÉGÂTS
    // ======================================

    damageUnit(
        target,
        shooter.damage,
        shooter
    );
}


// ==========================================
// COMBAT DES SOLDATS
// ==========================================

function updateSoldierCombat(
    soldier,
    currentTime
) {

    if (
        !soldier ||
        soldier.alive === false
    ) {

        return;
    }


    // ======================================
    // RECHERCHE D'UNE CIBLE
    // ======================================

    if (
        !soldier.target ||
        !soldier.target.alive ||
        getDistance(
            soldier,
            soldier.target
        ) > soldier.range
    ) {

        soldier.target =
            findClosestTarget(
                soldier,
                enemies
            );
    }


    // ======================================
    // AUCUNE CIBLE
    // ======================================

    if (!soldier.target) {

        soldier.isFiring =
            false;

        return;
    }


    soldier.isFiring =
        true;


    // ======================================
    // ORIENTATION
    // ======================================

    if (
        typeof rotateUnitTowards ===
        "function"
    ) {

        rotateUnitTowards(
            soldier,
            soldier.target.x,
            soldier.target.y
        );
    }


    // ======================================
    // CADENCE
    // ======================================

    if (
        currentTime -
        soldier.lastShot >=
        soldier.fireRate
    ) {

        soldier.lastShot =
            currentTime;


        shoot(
            soldier,
            soldier.target
        );
    }
}


// ==========================================
// COMBAT DES ENNEMIS
// ==========================================

function updateEnemyCombat(
    enemy,
    currentTime
) {

    if (
        !enemy ||
        !enemy.alive
    ) {

        return;
    }


    // ======================================
    // RECHERCHE D'UNE CIBLE
    // ======================================

    if (
        !enemy.target ||
        !enemy.target.alive ||
        getDistance(
            enemy,
            enemy.target
        ) > enemy.range
    ) {

        enemy.target =
            findClosestTarget(
                enemy,
                soldiers
            );
    }


    // ======================================
    // AUCUNE CIBLE
    // ======================================

    if (!enemy.target) {

        enemy.isFiring =
            false;

        return;
    }


    enemy.isFiring =
        true;


    // ======================================
    // ORIENTATION
    // ======================================

    if (
        typeof rotateUnitTowards ===
        "function"
    ) {

        rotateUnitTowards(
            enemy,
            enemy.target.x,
            enemy.target.y
        );
    }


    // ======================================
    // CADENCE
    // ======================================

    if (
        currentTime -
        enemy.lastShot >=
        enemy.fireRate
    ) {

        enemy.lastShot =
            currentTime;


        shoot(
            enemy,
            enemy.target,
            true
        );
    }
}


// ==========================================
// UPDATE COMBAT
// ==========================================

function updateCombat(
    currentTime
) {

    soldiers
        .slice()
        .forEach(
            function (soldier) {

                updateSoldierCombat(
                    soldier,
                    currentTime
                );
            }
        );


    enemies
        .slice()
        .forEach(
            function (enemy) {

                updateEnemyCombat(
                    enemy,
                    currentTime
                );
            }
        );
}


// ==========================================
// RESET DU COMBAT
// ==========================================

function resetCombat() {

    // ======================================
    // KILLS
    // ======================================

    totalKills = 0;


    const killsDisplay =
        document.querySelector(
            "#kills"
        );


    if (killsDisplay) {

        killsDisplay.textContent =
            "0";
    }


    // ======================================
    // TRACEURS RESTANTS
    // ======================================

    battlefield
        .querySelectorAll(
            ".bullet-tracer"
        )
        .forEach(
            function (tracer) {

                tracer.remove();
            }
        );


    // ======================================
    // CIBLES DES SOLDATS
    // ======================================

    soldiers.forEach(
        function (soldier) {

            soldier.target = null;

            soldier.isFiring = false;

            soldier.lastShot = 0;
        }
    );


    // ======================================
    // CIBLES DES ENNEMIS
    // ======================================

    enemies.forEach(
        function (enemy) {

            enemy.target = null;

            enemy.isFiring = false;

            enemy.lastShot = 0;
        }
    );


    console.log(
        "Combat réinitialisé."
    );
}