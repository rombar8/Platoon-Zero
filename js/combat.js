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

    setTimeout(
        function () {

            tracer.remove();

        },
        70
    );
}


// ==========================================
// BARRE DE VIE ENNEMIE
// ==========================================

function updateEnemyHealthBar(enemy) {

    if (
        !enemy ||
        !enemy.element ||
        !enemies.includes(enemy)
    ) {
        return;
    }

    let container =
        enemy.element.querySelector(
            ".enemy-health"
        );

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.className =
            "enemy-health";

        container.innerHTML = `
            <div class="enemy-health-bar"></div>
        `;

        enemy.element.appendChild(
            container
        );
    }

    const bar =
        container.querySelector(
            ".enemy-health-bar"
        );

    const percent =
        Math.max(
            0,
            Math.min(
                100,
                (enemy.hp / enemy.maxHp) * 100
            )
        );

    bar.style.width =
        percent + "%";

    // Barre visible seulement
    // quand l'ennemi est blessé
    container.classList.toggle(
        "visible",
        percent < 100 &&
        enemy.alive !== false
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

    // ======================================
    // CHEAT — GOD MODE
    // ======================================

    const targetIsSoldier =
        soldiers.includes(target);

    if (
        targetIsSoldier &&
        typeof cheatState !== "undefined" &&
        cheatState.godMode
    ) {
        return;
    }


    // ======================================
    // SÉCURITÉ DÉGÂTS
    // ======================================

    if (
        typeof damage !== "number" ||
        !Number.isFinite(damage) ||
        damage <= 0
    ) {
        return;
    }


    // ======================================
    // APPLICATION DES DÉGÂTS
    // ======================================

    target.hp -= damage;

    if (target.hp < 0) {
        target.hp = 0;
    }


    // ======================================
    // ARRONDI DE LA VIE
    // ======================================

    target.hp =
        Math.round(
            target.hp * 10
        ) / 10;


    // ======================================
    // VIE ENNEMIE
    // ======================================

    if (
        enemies.includes(target)
    ) {

        updateEnemyHealthBar(
            target
        );
    }


    // ======================================
    // FICHE DU SOLDAT
    // ======================================

    if (
        target === selectedSoldier &&
        typeof showUnitPanel ===
            "function"
    ) {

        showUnitPanel(
            target
        );
    }


    // ======================================
    // MORT
    // ======================================

    if (
        target.hp <= 0
    ) {

        killUnit(
            target,
            attacker
        );
    }
}


// ==========================================
// BONUS DE COMBAT DES GRADES
// ==========================================

const rankCombatBonuses = {

    PVT: {
        hp: 1.00,
        damage: 1.00,
        range: 1.00
    },

    PFC: {
        hp: 1.04,
        damage: 1.03,
        range: 1.01
    },

    SPC: {
        hp: 1.08,
        damage: 1.06,
        range: 1.02
    },

    CPL: {
        hp: 1.12,
        damage: 1.09,
        range: 1.03
    },

    SGT: {
        hp: 1.16,
        damage: 1.12,
        range: 1.04
    },

    SSG: {
        hp: 1.20,
        damage: 1.15,
        range: 1.05
    },

    SFC: {
        hp: 1.25,
        damage: 1.18,
        range: 1.06
    },

    WO1: {
        hp: 1.30,
        damage: 1.22,
        range: 1.08
    },

    CW2: {
        hp: 1.35,
        damage: 1.26,
        range: 1.10
    },

    "2LT": {
        hp: 1.40,
        damage: 1.30,
        range: 1.12
    }
};


// ==========================================
// APPLICATION BONUS DE GRADE
// ==========================================

// ==========================================
// APPLICATION BONUS DE GRADE
// ==========================================

function applyRankCombatBonus(
    soldier,
    oldRank,
    newRank
) {
    const oldBonus =
        rankCombatBonuses[oldRank] ||
        rankCombatBonuses.PVT;

    const newBonus =
        rankCombatBonuses[newRank] ||
        rankCombatBonuses.PVT;

    const hpRatio =
        newBonus.hp /
        oldBonus.hp;

    const damageRatio =
        newBonus.damage /
        oldBonus.damage;

    const rangeRatio =
        newBonus.range /
        oldBonus.range;

    const oldMaxHp =
        soldier.maxHp;

    soldier.maxHp *=
        hpRatio;

    soldier.damage *=
        damageRatio;

    soldier.range *=
        rangeRatio;

    // Le bonus de PV max est également
    // ajouté aux PV actuels

    soldier.hp +=
        soldier.maxHp -
        oldMaxHp;

    soldier.hp =
        Math.min(
            soldier.hp,
            soldier.maxHp
        );


    // ======================================
    // ARRONDI DES STATS
    // ======================================

    soldier.maxHp =
        Math.round(
            soldier.maxHp
        );

    soldier.hp =
        Math.min(
            soldier.maxHp,
            Math.round(soldier.hp)
        );

    soldier.damage =
        Math.round(
            soldier.damage * 10
        ) / 10;

    soldier.range =
        Math.round(
            soldier.range
        );
}


// ==========================================
// PROGRESSION / GRADES
// ==========================================

function updateSoldierRank(
    soldier
) {

    if (!soldier) {

        return;
    }


    let newRank =
        soldierRanks[0].rank;


    // Cherche le grade correspondant
    // à l'XP actuelle
    for (
        const rankData
        of soldierRanks
    ) {

        if (
            soldier.xp >=
            rankData.xp
        ) {

            newRank =
                rankData.rank;

        } else {

            break;
        }
    }


    // Pas de promotion
    if (
        soldier.rank ===
        newRank
    ) {

        return;
    }


    // ======================================
    // PROMOTION
    // ======================================

    const oldRank =
        soldier.rank;

    soldier.rank =
        newRank;


    applyRankCombatBonus(
        soldier,
        oldRank,
        newRank
    );


    console.log(
        soldier.name +
        " est promu " +
        newRank +
        " !"
    );


    // Actualise immédiatement
    // la fiche
    if (
        soldier === selectedSoldier &&
        typeof showUnitPanel ===
            "function"
    ) {

        showUnitPanel(
            soldier
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
        enemies.includes(target)
    ) {

        const index =
            enemies.indexOf(
                target
            );


        if (
            index !== -1
        ) {

            enemies.splice(
                index,
                1
            );
        }


        // ==================================
        // KILL INDIVIDUEL / XP
        // ==================================

        if (
            attacker &&
            soldiers.includes(attacker)
        ) {

            attacker.kills++;

            // 1 kill = 1 XP
            attacker.xp++;


            updateSoldierRank(
                attacker
            );


            if (
                attacker ===
                    selectedSoldier &&
                typeof showUnitPanel ===
                    "function"
            ) {

                showUnitPanel(
                    attacker
                );
            }
        }


        // ==================================
        // KILLS GLOBAUX
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
        soldiers.includes(target)
    ) {

        const index =
            soldiers.indexOf(
                target
            );


        if (
            index !== -1
        ) {

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
        // MULTI-SÉLECTION
        // ==================================

        if (
            typeof selectedSoldiers !==
                "undefined"
        ) {

            const selectedIndex =
                selectedSoldiers.indexOf(
                    target
                );


            if (
                selectedIndex !== -1
            ) {

                selectedSoldiers.splice(
                    selectedIndex,
                    1
                );
            }
        }


        // ==================================
        // SOLDAT PRINCIPAL MORT
        // ==================================

        if (
            selectedSoldier === target
        ) {

            if (
                typeof selectedSoldiers !==
                    "undefined" &&
                selectedSoldiers.length > 0
            ) {

                selectedSoldier =
                    selectedSoldiers[0];


                if (
                    typeof showUnitPanel ===
                        "function"
                ) {

                    showUnitPanel(
                        selectedSoldier
                    );
                }

            } else {

                selectedSoldier =
                    null;


                if (
                    typeof hideUnitPanel ===
                        "function"
                ) {

                    hideUnitPanel();
                }
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

function findFriendlyFireTarget(
    shooter,
    target
) {

    // Friendly fire uniquement
    // pour les soldats alliés
    if (
        !soldiers.includes(shooter)
    ) {

        return null;
    }


    const dx =
        target.x - shooter.x;

    const dy =
        target.y - shooter.y;


    const shotLengthSquared =
        dx * dx +
        dy * dy;


    if (
        shotLengthSquared === 0
    ) {

        return null;
    }


    let closestFriendly =
        null;

    let closestProgress =
        Infinity;


    for (
        const soldier
        of soldiers
    ) {

        if (
            soldier === shooter ||
            !soldier.alive
        ) {

            continue;
        }


        // Position du soldat projetée
        // sur la trajectoire du tir
        const progress =
            (
                (
                    soldier.x -
                    shooter.x
                ) *
                dx +

                (
                    soldier.y -
                    shooter.y
                ) *
                dy
            ) /
            shotLengthSquared;


        // Doit être entre le tireur
        // et la cible
        if (
            progress <= 0 ||
            progress >= 1
        ) {

            continue;
        }


        const lineX =
            shooter.x +
            dx * progress;

        const lineY =
            shooter.y +
            dy * progress;


        const distanceFromShot =
            Math.hypot(
                soldier.x -
                    lineX,

                soldier.y -
                    lineY
            );


        // Rayon approximatif
        // d'un soldat
        if (
            distanceFromShot > 14
        ) {

            continue;
        }


        if (
            progress <
            closestProgress
        ) {

            closestProgress =
                progress;

            closestFriendly =
                soldier;
        }
    }


    // 33 % de risque de toucher
    // l'allié placé sur la trajectoire
    if (
        closestFriendly &&
        Math.random() < 0.33
    ) {

        return closestFriendly;
    }


    return null;
}


// ==========================================
// EFFECTUE UN TIR
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
    // FRIENDLY FIRE
    // ======================================

    let actualTarget =
        target;

    if (!enemyShot) {

        const friendlyTarget =
            findFriendlyFireTarget(
                shooter,
                target
            );

        if (friendlyTarget) {

            actualTarget =
                friendlyTarget;

            console.log(
                "FRIENDLY FIRE !"
            );
        }
    }


    // ======================================
    // TRACEUR
    // ======================================

    createTracer(
        shooter,
        actualTarget,
        enemyShot
    );


    // ======================================
    // DÉGÂTS DE BASE
    // ======================================

    let finalDamage =
        shooter.damage;


    // ======================================
    // COUVERTURE
    // Uniquement contre les tirs ennemis
    // ======================================

    if (
        enemyShot &&
        typeof getSoldierProtection ===
        "function"
    ) {

        const protection =
            getSoldierProtection(
                actualTarget
            );

        finalDamage *=
            1 - protection;
    }


    // ======================================
    // ARRONDI
    // ======================================

    finalDamage =
        Math.round(
            finalDamage * 10
        ) / 10;


    // ======================================
    // APPLICATION DES DÉGÂTS
    // ======================================

    damageUnit(
        actualTarget,
        finalDamage,
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
        // OPÉRATEUR DE MITRAILLEUSE
        // ======================================

        /*
            Un soldat assigné à une mitrailleuse
            ne doit pas utiliser son arme personnelle
            lorsqu'il est arrivé au poste.

            La mitrailleuse est gérée séparément
            par updateMachineGuns().
        */

        if (
            soldier.machineGun &&
            typeof isMachineGunOperatorReady ===
                "function" &&
            isMachineGunOperatorReady(
                soldier.machineGun
            )
        ) {

            soldier.target =
                null;

            soldier.isFiring =
                false;

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
        ) >
        soldier.range
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

    if (
        !soldier.target
    ) {

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

    // ======================================
    // CHEAT — FREEZE ENNEMIS
    // ======================================

    if (
        typeof cheatState !== "undefined" &&
        cheatState.freezeEnemies
    ) {

        if (enemy) {
            enemy.isFiring = false;
        }

        return;
    }

    if (
        !enemy ||
        !enemy.alive
    ) {

        return;
    }


    // ======================================
    // IA PLUS RÉACTIVE
    // ======================================

    // L'ennemi recherche en permanence
    // le soldat vivant le plus proche
    // qui se trouve à portée.

    enemy.target =
        findClosestTarget(
            enemy,
            soldiers
        );


    // ======================================
    // AUCUNE CIBLE
    // ======================================

    if (
        !enemy.target
    ) {

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

    // Copie du tableau :
    // permet de supprimer une unité
    // pendant l'update sans casser
    // la boucle.

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


    if (
        killsDisplay
    ) {

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

            soldier.target =
                null;

            soldier.isFiring =
                false;

            soldier.lastShot =
                0;
        }
    );


    // ======================================
    // CIBLES DES ENNEMIS
    // ======================================

    enemies.forEach(
        function (enemy) {

            enemy.target =
                null;

            enemy.isFiring =
                false;

            enemy.lastShot =
                0;
        }
    );


    console.log(
        "Combat réinitialisé."
    );
}