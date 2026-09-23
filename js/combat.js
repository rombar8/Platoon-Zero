// ==========================================
// Platoon Zero
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

            const lineBlocked =
            typeof isLineBlockedByObstacle ===
                "function" &&
            isLineBlockedByObstacle(
                unit.x,
                unit.y,
                target.x,
                target.y
            );


            if (
                distance <= unit.range &&
                distance < closestDistance &&
                !lineBlocked
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
        // CIBLAGE TACTIQUE DES SOLDATS
        // ==========================================

        function findSoldierTarget(
            soldier,
            possibleTargets
        ) {

            const validTargets =
                possibleTargets.filter(
                    function (target) {

                        if (
                            !target ||
                            !target.alive
                        ) {

                            return false;
                        }


                        const distance =
                            getDistance(
                                soldier,
                                target
                            );


                        if (
                            distance >
                            soldier.range
                        ) {

                            return false;
                        }


                        const lineBlocked =
                            typeof isLineBlockedByObstacle ===
                                "function" &&
                            isLineBlockedByObstacle(
                                soldier.x,
                                soldier.y,
                                target.x,
                                target.y
                            );


                        return !lineBlocked;
                    }
                );


            if (
                validTargets.length === 0
            ) {

                return null;
            }


            const priority =
                soldier.targetPriority ||
                "closest";


            // ======================================
            // PLUS PROCHE
            // ======================================

            if (
                priority === "closest"
            ) {

                return validTargets.reduce(
                    function (
                        best,
                        target
                    ) {

                        return (
                            getDistance(
                                soldier,
                                target
                            ) <
                            getDistance(
                                soldier,
                                best
                            )
                        )
                            ? target
                            : best;
                    }
                );
            }


            // ======================================
            // PLUS ÉLOIGNÉ
            // ======================================

            if (
                priority === "farthest"
            ) {

                return validTargets.reduce(
                    function (
                        best,
                        target
                    ) {

                        return (
                            getDistance(
                                soldier,
                                target
                            ) >
                            getDistance(
                                soldier,
                                best
                            )
                        )
                            ? target
                            : best;
                    }
                );
            }


            // ======================================
            // PLUS FORT
            // Plus de PV actuels
            // ======================================

            if (
                priority === "strongest"
            ) {

                return validTargets.reduce(
                    function (
                        best,
                        target
                    ) {

                        return (
                            target.hp >
                            best.hp
                        )
                            ? target
                            : best;
                    }
                );
            }


            // ======================================
            // PLUS FAIBLE
            // Moins de PV actuels
            // ======================================

            if (
                priority === "weakest"
            ) {

                return validTargets.reduce(
                    function (
                        best,
                        target
                    ) {

                        return (
                            target.hp <
                            best.hp
                        )
                            ? target
                            : best;
                    }
                );
            }


            // ======================================
            // DERNIER
            // Ennemi le plus haut sur la carte
            // ======================================

            if (
                priority === "last"
            ) {

                return validTargets.reduce(
                    function (
                        best,
                        target
                    ) {

                        return (
                            target.y <
                            best.y
                        )
                            ? target
                            : best;
                    }
                );
            }


            // ======================================
            // SÉCURITÉ
            // ======================================

            return validTargets[0];
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
            range: 1.04
        },

        SGT: {
            hp: 1.17,
            damage: 1.13,
            range: 1.06
        },

        SSG: {
            hp: 1.22,
            damage: 1.17,
            range: 1.08
        },

        SFC: {
            hp: 1.27,
            damage: 1.21,
            range: 1.10
        },

        WO1: {
            hp: 1.32,
            damage: 1.25,
            range: 1.12
        },

        CW2: {
            hp: 1.37,
            damage: 1.29,
            range: 1.14
        },

        "2LT": {
            hp: 1.42,
            damage: 1.33,
            range: 1.16
        },

        "1LT": {
            hp: 1.47,
            damage: 1.37,
            range: 1.17
        },

        CPT: {
            hp: 1.52,
            damage: 1.41,
            range: 1.18
        },

        MAJ: {
            hp: 1.57,
            damage: 1.44,
            range: 1.19
        },

        LTC: {
            hp: 1.61,
            damage: 1.47,
            range: 1.20
        },

        COL: {
            hp: 1.65,
            damage: 1.50,
            range: 1.22
        },

        BG: {
            hp: 1.72,
            damage: 1.55,
            range: 1.24
        },

        MG: {
            hp: 1.80,
            damage: 1.60,
            range: 1.26
        },

        LTG: {
            hp: 1.90,
            damage: 1.66,
            range: 1.28
        },

        GEN: {
            hp: 2.00,
            damage: 1.72,
            range: 1.30
        },

        VET: {
            hp: 2.10,
            damage: 1.80,
            range: 1.32
        },

        ELT: {
            hp: 2.20,
            damage: 1.90,
            range: 1.34
        },

        CMD: {
            hp: 2.30,
            damage: 2.00,
            range: 1.36
        },

        HCM: {
            hp: 2.45,
            damage: 2.12,
            range: 1.38
        },

        WLD: {
            hp: 2.60,
            damage: 2.25,
            range: 1.40
        },

        LEG: {
            hp: 2.80,
            damage: 2.40,
            range: 1.43
        },

        GOAT: {
            hp: 3.00,
            damage: 2.60,
            range: 1.50
        }

    };

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
        // OBSTACLE ENTRE LE TIREUR ET LA CIBLE
        // ======================================

        if (
            typeof isLineBlockedByObstacle ===
                "function" &&
            isLineBlockedByObstacle(
                shooter.x,
                shooter.y,
                target.x,
                target.y
            )
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
            findSoldierTarget(
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


        // ==========================================
        // TEST TEMPORAIRE — NOUVEAUX GRADES
        // ==========================================

        function testNewRanks() {

            if (!selectedSoldier) {

                console.log(
                    "TEST GRADES : sélectionne d'abord un soldat."
                );

                return;
            }

            const soldier =
                selectedSoldier;

            const ranksToTest = [

                { rank: "BG", xp: 750 },
                { rank: "MG", xp: 1250 },
                { rank: "LTG", xp: 2000 },
                { rank: "GEN", xp: 3500 },

                { rank: "VET", xp: 5000 },
                { rank: "ELT", xp: 7500 },
                { rank: "CMD", xp: 10000 },

                { rank: "HCM", xp: 15000 },
                { rank: "WLD", xp: 20000 },
                { rank: "LEG", xp: 30000 },

                { rank: "GOAT", xp: 50000 }

            ];

            let index = 0;

            function testNextRank() {

                if (index >= ranksToTest.length) {

                    console.log(
                        "✅ TEST TERMINÉ — BG → GOAT"
                    );

                    return;
                }

                const test =
                    ranksToTest[index];

                soldier.xp =
                    test.xp;

                updateSoldierRank(
                    soldier
                );

                if (
                    typeof showUnitPanel ===
                    "function"
                ) {

                    showUnitPanel(
                        soldier
                    );

                }

                console.log(
                    "🪖",
                    test.rank,
                    "|",
                    test.xp,
                    "XP",
                    "| obtenu :",
                    soldier.rank
                );

                index++;

                setTimeout(
                    testNextRank,
                    2000
                );

            }

            testNextRank();

        }