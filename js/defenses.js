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
                    defense.triggered !== true
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
                            enemy.alive === false
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
// UPDATE GLOBAL
// ==========================================

function updateDefenses() {

    updateMines();
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

            if (
                defense.element
            ) {

                defense.element.remove();
            }
        }
    );


    defenses.length =
        0;


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