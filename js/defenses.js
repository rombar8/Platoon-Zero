// ==========================================
// M&B MOBILE
// DEFENSES.JS
// Défenses, couvertures et obstacles
// ==========================================


// ==========================================
// ÉTAT
// ==========================================

let activeDefense = null;

const defenses = [];


// ==========================================
// CONFIGURATION
// ==========================================

const defenseTypes = {

    trench: {
        name: "TRANCHÉE",

        width: 155,
        height: 72,

        protection: 0.50,
        slots: 4
    },

    sandbags: {
        name: "SACS DE SABLE",

        width: 115,
        height: 45,

        protection: 0.25,
        slots: 3
    },

    barbedwire: {
        name: "BARBELÉS",

        width: 125,
        height: 35,

        protection: 0,
        slots: 0,

        enemySpeedMultiplier: 0.40
    },

    mine: {
        name: "MINE",

        width: 30,
        height: 30,

        protection: 0,
        slots: 0,

        triggerRadius: 24,
        explosionRadius: 85,
        damage: 100
    },

        machinegun: {
        name: "MITRAILLEUSE",
        width: 90,
        height: 70,
        protection: 0.20,
        slots: 1,

        range: 260,

        damage: 30,
        fireRate: 170,

        operatorRequired: true
    }

};


// ==========================================
// ACTIVE LE MODE PLACEMENT
// ==========================================

function activateDefensePlacement(
    type,
    cost
) {

    if (
        gamePaused ||
        gameOver
    ) {
        return;
    }

    if (!defenseTypes[type]) {

        console.warn(
            "Défense inconnue :",
            type
        );

        return;
    }

    if (
        (
            typeof cheatState === "undefined" ||
            !cheatState.infinitePoints
        ) &&
        commandPoints < cost
    ) {
        console.log(
            "Pas assez de points."
        );

        return;
    }

    activeDefense = {
        type: type,
        cost: cost
    };

    battlefield.classList.add(
        "defense-targeting"
    );

    tacticalPanel.classList.add(
        "hidden"
    );
}


// ==========================================
// ANNULE LE PLACEMENT
// ==========================================

function cancelDefensePlacement() {

    activeDefense = null;

    battlefield.classList.remove(
        "defense-targeting"
    );
}


// ==========================================
// PAIEMENT
// ==========================================

function payDefense(cost) {

    if (
        typeof cheatState !== "undefined" &&
        cheatState.infinitePoints
    ) {
        return true;
    }

    if (
        commandPoints < cost
    ) {
        return false;
    }

    commandPoints -= cost;

    updatePoints();

    return true;
}


// ==========================================
// CLIC SUR LE TERRAIN
// ==========================================

battlefield.addEventListener(
    "click",

    function (event) {

        if (!activeDefense) {
            return;
        }

        if (
            gamePaused ||
            gameOver
        ) {
            return;
        }

        event.stopPropagation();

        const rect =
            battlefield.getBoundingClientRect();

        const x =
            event.clientX -
            rect.left;

        const y =
            event.clientY -
            rect.top;

        const type =
            activeDefense.type;

        const cost =
            activeDefense.cost;


        // ==================================
        // CRÉATION
        // ==================================

        if (
            type === "trench"
        ) {

            createTrench(
                x,
                y,
                cost
            );
        }

        else if (
            type === "sandbags"
        ) {

            createSandbags(
                x,
                y,
                cost
            );
        }

        else if (
            type === "barbedwire"
        ) {

            createBarbedWire(
                x,
                y,
                cost
            );
        }

        else if (
            type === "mine"
        ) {

            createMine(
                x,
                y,
                cost
            );
        }

        else if (
            type === "machinegun"
        ) {

            createMachineGun(
                x,
                y,
                cost
            );
        }


        cancelDefensePlacement();
    },

    true
);


// ==========================================
// TRANCHÉE
// ==========================================

function createTrench(
    x,
    y,
    cost
) {

    if (!payDefense(cost)) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "trench";

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";

    element.innerHTML = `
        <div class="trench-dirt"></div>
        <div class="trench-hole"></div>
        <div class="trench-plank"></div>
        <div class="trench-front"></div>
    `;

    battlefield.appendChild(
        element
    );

    defenses.push({

        type: "trench",

        name:
            defenseTypes.trench.name,

        x: x,
        y: y,

        width:
            defenseTypes.trench.width,

        height:
            defenseTypes.trench.height,

        protection:
            defenseTypes.trench.protection,

        slots:
            defenseTypes.trench.slots,

        element: element
    });
}


// ==========================================
// SACS DE SABLE
// ==========================================

function createSandbags(
    x,
    y,
    cost
) {

    if (!payDefense(cost)) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "sandbags";

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";

    element.innerHTML = `
        <div class="sandbag sandbag-1"></div>
        <div class="sandbag sandbag-2"></div>
        <div class="sandbag sandbag-3"></div>
        <div class="sandbag sandbag-4"></div>
        <div class="sandbag sandbag-5"></div>
    `;

    battlefield.appendChild(
        element
    );

    defenses.push({

        type: "sandbags",

        name:
            defenseTypes.sandbags.name,

        x: x,
        y: y,

        width:
            defenseTypes.sandbags.width,

        height:
            defenseTypes.sandbags.height,

        protection:
            defenseTypes.sandbags.protection,

        slots:
            defenseTypes.sandbags.slots,

        element: element
    });
}


// ==========================================
// BARBELÉS
// ==========================================

function createBarbedWire(
    x,
    y,
    cost
) {

    if (!payDefense(cost)) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "barbed-wire";

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";

    element.innerHTML = `
        <div class="wire-line wire-line-1"></div>
        <div class="wire-line wire-line-2"></div>
        <div class="wire-post wire-post-1"></div>
        <div class="wire-post wire-post-2"></div>
        <div class="wire-post wire-post-3"></div>
    `;

    battlefield.appendChild(
        element
    );

    defenses.push({

        type: "barbedwire",

        name:
            defenseTypes.barbedwire.name,

        x: x,
        y: y,

        width:
            defenseTypes.barbedwire.width,

        height:
            defenseTypes.barbedwire.height,

        protection: 0,
        slots: 0,

        enemySpeedMultiplier:
            defenseTypes
                .barbedwire
                .enemySpeedMultiplier,

        element: element
    });
}


// ==========================================
// MINE
// ==========================================

function createMine(
    x,
    y,
    cost
) {

    if (!payDefense(cost)) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "landmine";

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";

    element.innerHTML = `
        <div class="landmine-body"></div>
        <div class="landmine-center"></div>
    `;

    battlefield.appendChild(
        element
    );

    defenses.push({

        type: "mine",

        name:
            defenseTypes.mine.name,

        x: x,
        y: y,

        width:
            defenseTypes.mine.width,

        height:
            defenseTypes.mine.height,

        protection: 0,
        slots: 0,

        triggerRadius:
            defenseTypes.mine.triggerRadius,

        explosionRadius:
            defenseTypes.mine.explosionRadius,

        damage:
            defenseTypes.mine.damage,

        triggered: false,

        element: element
    });
}


// ==========================================
// MITRAILLEUSE DÉFENSIVE
// ==========================================

function createMachineGun(
    x,
    y,
    cost
) {

    // ======================================
    // LIMITE DE MITRAILLEUSES
    // ======================================

    const machineGunCount =
        defenses.filter(
            defense =>
                defense.type === "machinegun"
        ).length;

    if (machineGunCount >= 3) {

        console.log(
            "Limite de 3 mitrailleuses atteinte."
        );

        return;
    }

    if (!payDefense(cost)) {
        return;
    }


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "defense-machinegun inactive";

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";


    element.innerHTML = `
        <div class="mg-tripod"></div>
        <div class="mg-body"></div>
        <div class="mg-barrel"></div>
        <div class="mg-seat"></div>
        <div class="mg-status">
            SANS OPÉRATEUR
        </div>
    `;


    battlefield.appendChild(
        element
    );


    const config =
        defenseTypes.machinegun;


    // ======================================
    // OBJET MITRAILLEUSE
    // ======================================

    const machineGun = {

        type:
            "machinegun",

        name:
            config.name,

        x: x,

        y: y,

        width:
            config.width,

        height:
            config.height,

        protection:
            config.protection,

        slots:
            config.slots,

        range:
            config.range,

        damage:
            config.damage,

        fireRate:
            config.fireRate,

        operatorRequired:
            config.operatorRequired,

        operator:
            null,

        lastShot:
            0,

        target:
            null,

        element:
            element
    };


    // ======================================
    // AJOUT AUX DÉFENSES
    // ======================================

    defenses.push(
        machineGun
    );


    // ======================================
    // CLIC SUR LA MITRAILLEUSE
    // ======================================

    element.addEventListener(
        "click",

        function (event) {

            /*
                IMPORTANT :

                On ne bloque PAS la propagation
                lorsqu'un soldat est sélectionné.

                Le clic doit continuer jusqu'au
                battlefield pour permettre à
                movement.js d'assigner le soldat
                à cette MG.
            */

            if (
                typeof selectedSoldier !==
                    "undefined" &&
                selectedSoldier
            ) {
                return;
            }


            /*
                Aucun soldat sélectionné :
                le clic sert donc à consulter
                la fiche de la MG.
            */

            event.stopPropagation();


            if (
                typeof showMachineGunPanel ===
                    "function"
            ) {

                showMachineGunPanel(
                    machineGun
                );
            }
        }
    );


    // ======================================
    // PREMIER RAFRAÎCHISSEMENT VISUEL
    // ======================================

    if (
        typeof updateMachineGunVisual ===
            "function"
    ) {

        updateMachineGunVisual(
            machineGun
        );
    }
}

// ==========================================
// SLOT OPÉRATEUR DE LA MITRAILLEUSE
// ==========================================

function getMachineGunOperatorSlot(
    defense
) {

    if (
        !defense ||
        defense.type !==
            "machinegun"
    ) {
        return null;
    }

    return {
        x: defense.x,
        y: defense.y + 24
    };
}


// ==========================================
// TROUVE LA MG CLIQUÉE
// ==========================================

function getMachineGunAt(
    x,
    y
) {

    for (
        const defense
        of defenses
    ) {

        if (
            defense.type !==
            "machinegun"
        ) {
            continue;
        }

        if (
            isPointInsideDefense(
                x,
                y,
                defense
            )
        ) {
            return defense;
        }
    }

    return null;
}


// ==========================================
// ASSIGNE UN SOLDAT À LA MG
// ==========================================

function assignSoldierToMachineGun(
    soldier,
    defense
) {

    if (
        !soldier ||
        !soldier.alive ||
        !defense ||
        defense.type !==
            "machinegun"
    ) {
        return false;
    }

    // Une MG ne peut avoir qu'un opérateur
    if (
        defense.operator &&
        defense.operator.alive &&
        defense.operator !== soldier
    ) {
        return false;
    }

    // Si le soldat utilisait déjà une autre MG,
    // on le libère d'abord.
    releaseSoldierFromMachineGun(
        soldier
    );

    const slot =
        getMachineGunOperatorSlot(
            defense
        );

    if (!slot) {
        return false;
    }

    defense.operator =
        soldier;

    soldier.machineGun =
        defense;

    // Le soldat reçoit l'ordre
    // de rejoindre physiquement le siège.
    soldier.targetX =
        slot.x;

    soldier.targetY =
        slot.y;

    soldier.target =
        null;

    soldier.isFiring =
        false;

    updateMachineGunVisual(
        defense
    );

    return true;
}


// ==========================================
// LIBÈRE UN SOLDAT DE SA MG
// ==========================================

function releaseSoldierFromMachineGun(
    soldier
) {

    if (
        !soldier ||
        !soldier.machineGun
    ) {
        return;
    }

    const defense =
        soldier.machineGun;

    if (
        defense.operator ===
        soldier
    ) {
        defense.operator =
            null;
    }

    soldier.machineGun =
        null;

    updateMachineGunVisual(
        defense
    );
}


// ==========================================
// OPÉRATEUR PRÉSENT AU SIÈGE ?
// ==========================================

function isMachineGunOperatorReady(
    defense
) {

    if (
        !defense ||
        defense.type !==
            "machinegun"
    ) {
        return false;
    }

    const soldier =
        defense.operator;

    if (
        !soldier ||
        !soldier.alive ||
        soldier.machineGun !==
            defense
    ) {
        return false;
    }

    const slot =
        getMachineGunOperatorSlot(
            defense
        );

    if (!slot) {
        return false;
    }

    const distance =
        Math.hypot(
            soldier.x - slot.x,
            soldier.y - slot.y
        );

    return (
        distance <= 10
    );
}


// ==========================================
// VISUEL ACTIF / INACTIF
// ==========================================

function updateMachineGunVisual(
    defense
) {

    if (
        !defense ||
        !defense.element
    ) {
        return;
    }

    const ready =
        isMachineGunOperatorReady(
            defense
        );

    defense.element.classList.toggle(
        "active",
        ready
    );

    defense.element.classList.toggle(
        "inactive",
        !ready
    );

    const status =
        defense.element.querySelector(
            ".mg-status"
        );

    if (!status) {
        return;
    }

    if (ready) {

        status.textContent =
            "ACTIVE";
    }

    else if (
        defense.operator &&
        defense.operator.alive
    ) {

        status.textContent =
            "OPÉRATEUR EN ROUTE";
    }

    else {

        status.textContent =
            "SANS OPÉRATEUR";
    }
}


// ==========================================
// CIBLE LA PLUS PROCHE POUR UNE MG
// ==========================================

function findMachineGunTarget(
    defense
) {

    let closestEnemy =
        null;

    let closestDistance =
        Infinity;

    enemies.forEach(
        function (enemy) {

            if (
                !enemy ||
                !enemy.alive
            ) {
                return;
            }

            const distance =
                Math.hypot(
                    enemy.x -
                        defense.x,
                    enemy.y -
                        defense.y
                );

            if (
                distance >
                    defense.range ||
                distance >=
                    closestDistance
            ) {
                return;
            }

            closestDistance =
                distance;

            closestEnemy =
                enemy;
        }
    );

    return closestEnemy;
}


// ==========================================
// TIR DE LA MITRAILLEUSE
// ==========================================

// ==========================================
// ORIENTATION DE LA MITRAILLEUSE
// ==========================================

function rotateMachineGunTowards(
            defense,
            target
        ) {

            if (
                !defense ||
                !defense.element ||
                !target
            ) {
                return;
            }

            const dx =
                target.x - defense.x;

            const dy =
                target.y - defense.y;

            const angle =
                Math.atan2(
                    dy,
                    dx
                ) * 180 / Math.PI;


            const body =
                defense.element.querySelector(
                    ".mg-body"
                );

            const barrel =
                defense.element.querySelector(
                    ".mg-barrel"
                );


            if (body) {

                body.style.transformOrigin =
                    "center center";

                body.style.transform =
                    `rotate(${angle}deg)`;
            }


            if (barrel) {

                barrel.style.transformOrigin =
                    "left center";

                barrel.style.transform =
                    `rotate(${angle}deg)`;
            }
        }


function fireMachineGun(
    defense,
    target
) {

    if (
        !defense ||
        !target ||
        !target.alive
    ) {
        return;
    }


    const shooter =
        defense.operator;


    if (
        !shooter ||
        !shooter.alive
    ) {
        return;
    }


    // ======================================
    // ORIENTATION DE LA MITRAILLEUSE
    // ======================================

    /*
        IMPORTANT :

        On ne fait PLUS de
        rotateUnitTowards(shooter).

        L'opérateur garde donc son
        orientation lorsqu'il utilise
        la mitrailleuse.

        Seule la MG pivote vers l'ennemi.
    */

    if (
        typeof rotateMachineGunTowards ===
            "function"
    ) {

        rotateMachineGunTowards(
            defense,
            target
        );
    }


    // ======================================
    // TRACEUR
    // ======================================

    if (
        typeof createTracer ===
            "function"
    ) {

        const fakeShooter = {

            x: defense.x,
            y: defense.y,
            alive: true
        };


        createTracer(
            fakeShooter,
            target,
            false
        );
    }


    // ======================================
    // DÉGÂTS
    // ======================================

    if (
        typeof damageUnit ===
            "function"
    ) {

        /*
            On garde le soldat opérateur
            comme attacker.

            Donc les kills et l'XP de
            la mitrailleuse restent
            attribués à son opérateur.
        */

        damageUnit(
            target,
            defense.damage,
            shooter
        );
    }
}


// ==========================================
// UPDATE DES MITRAILLEUSES
// ==========================================

function updateMachineGuns(currentTime) {

    defenses.forEach(
        function (defense) {

            if (
                defense.type !==
                    "machinegun"
            ) {
                return;
            }


            // ==================================
            // VÉRIFIE L'OPÉRATEUR
            // ==================================

            if (
                defense.operator &&
                (
                    !defense.operator.alive ||
                    defense.operator.machineGun !==
                        defense
                )
            ) {

                if (
                    defense.operator
                ) {

                    defense.operator.machineGun =
                        null;
                }

                defense.operator =
                    null;
            }


            // ==================================
            // ACTUALISE L'AFFICHAGE
            // ==================================

            updateMachineGunVisual(
                defense
            );


            // ==================================
            // PAS D'OPÉRATEUR AU SIÈGE
            // ==================================

            if (
                !isMachineGunOperatorReady(
                    defense
                )
            ) {

                defense.target =
                    null;

                return;
            }


            /*
                Tant que le soldat utilise
                la mitrailleuse, on empêche
                son arme personnelle de tirer.
            */

            defense.operator.isFiring =
                false;


            // ==================================
            // CHERCHE UNE CIBLE
            // ==================================

            const target =
                findMachineGunTarget(
                    defense
                );

            if (target) {

                rotateMachineGunTowards(
                    defense,
                    target
                );
            }

            defense.target =
                target;

            if (!target) {
                return;
            }


            // ==================================
            // CADENCE
            // ==================================

            if (
                currentTime -
                    defense.lastShot <
                defense.fireRate
            ) {
                return;
            }

            defense.lastShot =
                currentTime;


            // ==================================
            // FEU
            // ==================================

            fireMachineGun(
                defense,
                target
            );
        }
    );
}


// ==========================================
// POINT DANS UNE DÉFENSE
// ==========================================

function isPointInsideDefense(
    x,
    y,
    defense
) {

    const halfWidth =
        defense.width / 2;

    const halfHeight =
        defense.height / 2;

    return (
        x >=
            defense.x -
            halfWidth &&

        x <=
            defense.x +
            halfWidth &&

        y >=
            defense.y -
            halfHeight &&

        y <=
            defense.y +
            halfHeight
    );
}


// ==========================================
// COUVERTURE DU SOLDAT
// ==========================================

function getSoldierDefense(
    soldier
) {

    if (!soldier) {
        return null;
    }

    let bestDefense =
        null;

    defenses.forEach(
        function (defense) {

            if (
                defense.protection <= 0
            ) {
                return;
            }

            if (
                !isPointInsideDefense(
                    soldier.x,
                    soldier.y,
                    defense
                )
            ) {
                return;
            }

            if (
                !bestDefense ||
                defense.protection >
                    bestDefense.protection
            ) {

                bestDefense =
                    defense;
            }
        }
    );

    return bestDefense;
}


// ==========================================
// VALEUR DE PROTECTION
// ==========================================

function getSoldierProtection(
    soldier
) {

    const defense =
        getSoldierDefense(
            soldier
        );

    if (!defense) {
        return 0;
    }

    return (
        defense.protection ||
        0
    );
}


// ==========================================
// COMPATIBILITÉ TRANCHÉE
// ==========================================

function isSoldierInTrench(
    soldier
) {

    const defense =
        getSoldierDefense(
            soldier
        );

    return (
        defense !== null &&
        defense.type ===
            "trench"
    );
}


// ==========================================
// SACS DE SABLE
// ==========================================

function isSoldierInSandbags(
    soldier
) {

    const defense =
        getSoldierDefense(
            soldier
        );

    return (
        defense !== null &&
        defense.type ===
            "sandbags"
    );
}


// ==========================================
// NOM DE LA COUVERTURE
// ==========================================

function getSoldierCoverName(
    soldier
) {

    const defense =
        getSoldierDefense(
            soldier
        );

    if (!defense) {
        return null;
    }

    return defense.name;
}

// ==========================================
// SLOTS DES COUVERTURES
// ==========================================

function getDefenseSlots(
    defense
) {

    if (
        defense.type ===
        "trench"
    ) {

        return [
            {
                x: defense.x - 50,
                y: defense.y
            },
            {
                x: defense.x - 17,
                y: defense.y
            },
            {
                x: defense.x + 17,
                y: defense.y
            },
            {
                x: defense.x + 50,
                y: defense.y
            }
        ];
    }


    if (
        defense.type ===
        "sandbags"
    ) {

        return [
            {
                x: defense.x - 35,
                y: defense.y + 5
            },
            {
                x: defense.x,
                y: defense.y + 5
            },
            {
                x: defense.x + 35,
                y: defense.y + 5
            }
        ];
    }


    if (
        defense.type ===
        "machinegun"
    ) {

        const operatorSlot =
            getMachineGunOperatorSlot(
                defense
            );

        return operatorSlot
            ? [operatorSlot]
            : [];
    }


    return [];
}


// ==========================================
// TROUVE UN SLOT LIBRE
// ==========================================

function getDefenseSlotAt(
    x,
    y
) {

    for (
        const defense
        of defenses
    ) {

        const slots =
            getDefenseSlots(
                defense
            );

        if (
            slots.length === 0
        ) {
            continue;
        }

        if (
            !isPointInsideDefense(
                x,
                y,
                defense
            )
        ) {
            continue;
        }


        const freeSlots =
            slots.filter(
                function (slot) {

                    return !soldiers.some(
                        function (soldier) {

                            if (
                                !soldier.alive ||
                                soldier ===
                                    selectedSoldier
                            ) {
                                return false;
                            }

                            return (
                                Math.abs(
                                    soldier.targetX -
                                    slot.x
                                ) < 10 &&

                                Math.abs(
                                    soldier.targetY -
                                    slot.y
                                ) < 10
                            );
                        }
                    );
                }
            );


        if (
            freeSlots.length === 0
        ) {
            return null;
        }


        freeSlots.sort(
            function (a, b) {

                const distanceA =
                    Math.hypot(
                        a.x - x,
                        a.y - y
                    );

                const distanceB =
                    Math.hypot(
                        b.x - x,
                        b.y - y
                    );

                return (
                    distanceA -
                    distanceB
                );
            }
        );


        return freeSlots[0];
    }


    return null;
}


// ==========================================
// COMPATIBILITÉ MOVEMENT.JS
// ==========================================

function getTrenchSlotAt(
    x,
    y
) {

    return getDefenseSlotAt(
        x,
        y
    );
}


// ==========================================
// ENNEMI DANS LES BARBELÉS
// ==========================================

function isEnemyInBarbedWire(
    enemy
) {

    if (!enemy) {
        return false;
    }

    return defenses.some(
        function (defense) {

            return (
                defense.type ===
                    "barbedwire" &&

                isPointInsideDefense(
                    enemy.x,
                    enemy.y,
                    defense
                )
            );
        }
    );
}


// ==========================================
// MULTIPLICATEUR DE VITESSE ENNEMIE
// ==========================================

function getEnemyDefenseSpeedMultiplier(
    enemy
) {

    let multiplier =
        1;

    defenses.forEach(
        function (defense) {

            if (
                defense.type !==
                    "barbedwire"
            ) {
                return;
            }

            if (
                !isPointInsideDefense(
                    enemy.x,
                    enemy.y,
                    defense
                )
            ) {
                return;
            }

            multiplier =
                Math.min(
                    multiplier,
                    defense.enemySpeedMultiplier
                );
        }
    );

    return multiplier;
}


// ==========================================
// DISTANCE
// ==========================================

function getDefenseDistance(
    x1,
    y1,
    x2,
    y2
) {

    return Math.hypot(
        x2 - x1,
        y2 - y1
    );
}


// ==========================================
// EXPLOSION VISUELLE D'UNE MINE
// ==========================================

function createMineExplosion(
    x,
    y
) {

    const explosion =
        document.createElement(
            "div"
        );

    explosion.className =
        "mine-explosion";

    explosion.style.left =
        x + "px";

    explosion.style.top =
        y + "px";

    explosion.textContent =
        "💥";

    battlefield.appendChild(
        explosion
    );

    setTimeout(
        function () {

            explosion.remove();
        },

        500
    );
}


// ==========================================
// EXPLOSION D'UNE MINE
// ==========================================

function explodeMine(
    mine
) {

    if (
        !mine ||
        mine.triggered
    ) {
        return;
    }

    mine.triggered =
        true;


    createMineExplosion(
        mine.x,
        mine.y
    );


    // ======================================
    // DÉGÂTS DE ZONE
    // ======================================

    const enemySnapshot =
        enemies.slice();

    enemySnapshot.forEach(
        function (enemy) {

            if (
                !enemy ||
                enemy.alive === false
            ) {
                return;
            }

            const distance =
                getDefenseDistance(
                    mine.x,
                    mine.y,
                    enemy.x,
                    enemy.y
                );

            if (
                distance >
                    mine.explosionRadius
            ) {
                return;
            }


            // Plus proche = plus de dégâts

            const distanceRatio =
                1 -
                (
                    distance /
                    mine.explosionRadius
                );

            const damage =
                Math.max(
                    20,
                    Math.round(
                        mine.damage *
                        distanceRatio
                    )
                );


            // Utilise le système de combat
            // existant si disponible.

            if (
                typeof damageUnit ===
                    "function"
            ) {

                damageUnit(
                    enemy,
                    damage
                );
            }

            else {

                enemy.hp -=
                    damage;

                if (
                    enemy.hp <= 0
                ) {

                    enemy.hp = 0;
                    enemy.alive = false;

                    if (
                        enemy.element
                    ) {

                        enemy.element.remove();
                    }

                    const index =
                        enemies.indexOf(
                            enemy
                        );

                    if (
                        index !== -1
                    ) {

                        enemies.splice(
                            index,
                            1
                        );
                    }
                }
            }
        }
    );


    // ======================================
    // SUPPRESSION DE LA MINE
    // ======================================

    if (
        mine.element
    ) {

        mine.element.remove();
    }


    const index =
        defenses.indexOf(
            mine
        );

    if (
        index !== -1
    ) {

        defenses.splice(
            index,
            1
        );
    }
}

// ==========================================
// MISE À JOUR DES MINES
// ==========================================

function updateMines() {

    const mines =
        defenses.filter(
            function (defense) {

                return (
                    defense.type ===
                        "mine" &&
                    defense.triggered !==
                        true
                );
            }
        );


    mines.forEach(
        function (mine) {

            const triggered =
                enemies.some(
                    function (enemy) {

                        if (
                            !enemy ||
                            enemy.alive ===
                                false
                        ) {
                            return false;
                        }

                        const distance =
                            getDefenseDistance(
                                mine.x,
                                mine.y,
                                enemy.x,
                                enemy.y
                            );

                        return (
                            distance <=
                                mine.triggerRadius
                        );
                    }
                );


            if (triggered) {

                explodeMine(
                    mine
                );
            }
        }
    );
}


// ==========================================
// UPDATE GLOBAL DES DÉFENSES
// ==========================================

function updateDefenses(currentTime) {

    updateMines();

    updateMachineGuns(currentTime);

}


// ==========================================
// RESET
// ==========================================

function resetDefenses() {

    activeDefense =
        null;

    battlefield.classList.remove(
        "defense-targeting"
    );


    defenses.forEach(
        function (defense) {

            // ==================================
            // LIBÈRE L'OPÉRATEUR DE LA MG
            // ==================================

            if (
                defense.type ===
                    "machinegun" &&
                defense.operator
            ) {

                defense.operator.machineGun =
                    null;

                defense.operator =
                    null;
            }


            // ==================================
            // SUPPRIME LE VISUEL
            // ==================================

            if (
                defense.element
            ) {

                defense.element.remove();
            }
        }
    );


    defenses.length =
        0;


    // ======================================
    // NETTOIE LES EXPLOSIONS RESTANTES
    // ======================================

    document
        .querySelectorAll(
            ".mine-explosion"
        )
        .forEach(
            function (element) {

                element.remove();
            }
        );
}