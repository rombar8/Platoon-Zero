// ==========================================
// Platoon Zero
// DEFENSES.JS
// Défenses, couvertures et obstacles
// ==========================================


// ==========================================
// ÉTAT
// ==========================================

let activeDefense = null;

const defenses = [];


let defensePreview =
    null;


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
    // NIVEAUX DES DÉFENSES
    // ==========================================

    
        const defenseUpgrades = {

            trench: {

                1: {
                    protection: 0.10
                },

                2: {
                    protection: 0.25,
                    upgradeCost: 10
                },

                3: {
                    protection: 0.50,
                    upgradeCost: 25
                }

            },


            sandbags: {

                1: {
                    protection: 0.10
                },

                2: {
                    protection: 0.20,
                    upgradeCost: 10
                },

                3: {
                    protection: 0.30,
                    upgradeCost: 15
                }

            },


            barbedwire: {

                1: {
                    slow: 0.10,
                    enemySpeedMultiplier: 0.90
                },

                2: {
                    slow: 0.20,
                    enemySpeedMultiplier: 0.80,
                    upgradeCost: 10
                },

                3: {
                    slow: 0.35,
                    enemySpeedMultiplier: 0.65,
                    upgradeCost: 15
                }

            },


            mine: {

                1: {
                    hpDamagePercent: 0.25,
                    radiusBonus: 0.02
                },

                2: {
                    hpDamagePercent: 0.50,
                    radiusBonus: 0.04,
                    upgradeCost: 8
                },

                3: {
                    hpDamagePercent: 0.70,
                    radiusBonus: 0.06,
                    upgradeCost: 15
                }

            },


            machinegun: {

                1: {
                    fireRate: 170,
                    damage: 30,
                    operatorProtection: 0.05
                },

                2: {
                    fireRate: 145,
                    damage: 34,
                    operatorProtection: 0.10,
                    upgradeCost: 20
                },

                3: {
                    fireRate: 120,
                    damage: 39,
                    operatorProtection: 0.20,
                    upgradeCost: 35
                }

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

    
        // ======================================
        // APERÇU DE PLACEMENT
        // ======================================

        if (defensePreview) {

            defensePreview.remove();

        }

        defensePreview =
            document.createElement(
                "div"
            );

        defensePreview.className =
            "defense-placement-preview";

        defensePreview.dataset.type =
            type;

            
        // ======================================
        // APPARENCE DE LA DÉFENSE
        // ======================================

        if (
            type === "trench"
        ) {

            defensePreview.innerHTML = `
                <div class="trench-dirt"></div>
                <div class="trench-hole"></div>
                <div class="trench-plank"></div>
                <div class="trench-front"></div>
            `;

        }

        else if (
            type === "sandbags"
        ) {

            defensePreview.innerHTML = `
                <div class="sandbag sandbag-1"></div>
                <div class="sandbag sandbag-2"></div>
                <div class="sandbag sandbag-3"></div>
                <div class="sandbag sandbag-4"></div>
                <div class="sandbag sandbag-5"></div>
            `;

        }

        else if (
            type === "barbedwire"
        ) {

            defensePreview.innerHTML = `
                <div class="wire-line wire-line-1"></div>
                <div class="wire-line wire-line-2"></div>
                <div class="wire-post wire-post-1"></div>
                <div class="wire-post wire-post-2"></div>
                <div class="wire-post wire-post-3"></div>
            `;

        }

        else if (
            type === "mine"
        ) {

            defensePreview.innerHTML = `
                <div class="landmine-body"></div>
                <div class="landmine-center"></div>
            `;

        }

        else if (
            type === "machinegun"
        ) {

            defensePreview.innerHTML = `
                <div class="mg-tripod"></div>
                <div class="mg-body"></div>
                <div class="mg-barrel"></div>
                <div class="mg-seat"></div>
            `;

        }

        defensePreview.style.width =
            defenseTypes[type].width +
            "px";

        defensePreview.style.height =
            defenseTypes[type].height +
            "px";

        battlefield.appendChild(
            defensePreview
        );

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


        if (defensePreview) {

            defensePreview.remove();

            defensePreview =
                null;

        }

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


    
    battlefield.addEventListener(
        "mousemove",

        function (event) {

            if (
                !activeDefense ||
                !defensePreview
            ) {

                return;

            }

            const rect =
                battlefield
                    .getBoundingClientRect();

            defensePreview.style.left =
                (
                    event.clientX -
                    rect.left
                ) + "px";

            defensePreview.style.top =
                (
                    event.clientY -
                    rect.top
                ) + "px";

        }
    );


// ==========================================
// CLIC SUR LE TERRAIN
// ==========================================

battlefield.addEventListener(
    "click",

    function (event) {

        
        if (
            event.target.closest(
                ".trench, .sandbags, .barbed-wire, .landmine"
            )
        ) {

            return;

        }

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

            element.classList.add(
                "defense-level-1"
            );

            element.dataset.level =
                1;

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


            const defense = {

                type: "trench",

                name:
                    defenseTypes.trench.name,

                level: 1,

                x: x,

                y: y,

                width:
                    defenseTypes.trench.width,

                height:
                    defenseTypes.trench.height,

                protection:
                    defenseUpgrades
                        .trench[1]
                        .protection,

                slots:
                    defenseTypes.trench.slots,

                element: element

            };


            defenses.push(
                defense
            );


            element.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    if (
                        typeof showDefensePanel ===
                        "function"
                    ) {

                        showDefensePanel(
                            defense
                        );

                    }

                }
            );

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

            element.classList.add(
                "defense-level-1"
            );

            element.dataset.level =
                1;

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
            <div class="sandbag sandbag-6"></div>
            <div class="sandbag sandbag-7"></div>
            <div class="sandbag sandbag-8"></div>
            <div class="sandbag sandbag-9"></div>
        `;

            battlefield.appendChild(
                element
            );


            const defense = {

                type: "sandbags",

                name:
                    defenseTypes.sandbags.name,

                level: 1,

                x: x,

                y: y,

                width:
                    defenseTypes.sandbags.width,

                height:
                    defenseTypes.sandbags.height,

                protection:
                    defenseUpgrades
                        .sandbags[1]
                        .protection,

                slots:
                    defenseTypes.sandbags.slots,

                element: element

            };


            defenses.push(
                defense
            );


            element.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    if (
                        typeof showDefensePanel ===
                        "function"
                    ) {

                        showDefensePanel(
                            defense
                        );

                    }

                }
            );

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

            element.classList.add(
                "defense-level-1"
            );

            element.dataset.level =
                1;

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


            const defense = {

                type: "barbedwire",

                name:
                    defenseTypes.barbedwire.name,

                level: 1,

                x: x,

                y: y,

                width:
                    defenseTypes.barbedwire.width,

                height:
                    defenseTypes.barbedwire.height,

                protection: 0,

                slots: 0,

                enemySpeedMultiplier:
                    defenseUpgrades
                        .barbedwire[1]
                        .enemySpeedMultiplier,

                element: element

            };


            defenses.push(
                defense
            );


            element.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    if (
                        typeof showDefensePanel ===
                        "function"
                    ) {

                        showDefensePanel(
                            defense
                        );

                    }

                }
            );

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

            element.classList.add(
                "defense-level-1"
            );

            element.dataset.level =
                1;

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


            const defense = {

                type: "mine",

                name:
                    defenseTypes.mine.name,

                level: 1,

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

                hpDamagePercent:
                    defenseUpgrades
                        .mine[1]
                        .hpDamagePercent,

                radiusBonus:
                    defenseUpgrades
                        .mine[1]
                        .radiusBonus,

                triggered: false,

                element: element

            };


            defenses.push(
                defense
            );


            element.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    if (
                        typeof showDefensePanel ===
                        "function"
                    ) {

                        showDefensePanel(
                            defense
                        );

                    }

                }
            );

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
    
        element.classList.add(
            "defense-level-1"
        );

        element.dataset.level =
            1;

    element.style.left =
        x + "px";

    element.style.top =
        y + "px";


    
        
        element.innerHTML = `
            <div class="mg-weapon">

                <div class="mg-tripod"></div>
                <div class="mg-body"></div>
                <div class="mg-barrel"></div>
                <div class="mg-seat"></div>

                <div class="mg-upgrade-ammo-box mg-ammo-box-1"></div>
                <div class="mg-upgrade-ammo-box mg-ammo-box-2"></div>

                <div class="mg-ammo-belt">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

            <div class="mg-status">
                SANS OPÉRATEUR
            </div>
        `;


    battlefield.appendChild(
        element
    );

    
        // ======================================
        // ZONE VISUELLE DE PORTÉE MG
        // ======================================

        const rangeIndicator =
            document.createElement(
                "div"
            );

        rangeIndicator.classList.add(
            "machinegun-range-indicator"
        );

        rangeIndicator.style.width =
            defenseTypes.machinegun.range *
            2 + "px";

        rangeIndicator.style.height =
            defenseTypes.machinegun.range *
            2 + "px";

        element.appendChild(
            rangeIndicator
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

        level: 1,

        x: x,

        y: y,

        width:
            config.width,

        height:
            config.height,

        protection:
            defenseUpgrades
                .machinegun[1]
                .operatorProtection,

        operatorProtection:
            defenseUpgrades
                .machinegun[1]
                .operatorProtection,

        slots:
            config.slots,

        range:
            config.range,

        damage:
            defenseUpgrades
                .machinegun[1]
                .damage,

        fireRate:
            defenseUpgrades
                .machinegun[1]
                .fireRate,

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

            
                // ==================================
                // PRIORITÉ À L'OPÉRATEUR
                // ==================================

                if (
                    machineGun.operator &&
                    machineGun.operator.alive &&
                    machineGun.operator.element
                ) {

                    const operatorRect =
                        machineGun.operator.element
                            .getBoundingClientRect();

                    const operatorClicked =
                        event.clientX >=
                            operatorRect.left &&
                        event.clientX <=
                            operatorRect.right &&
                        event.clientY >=
                            operatorRect.top &&
                        event.clientY <=
                            operatorRect.bottom;

                    if (operatorClicked) {

                        machineGun.operator.element.click();

                        return;

                    }

                }

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

                
        document
            .querySelectorAll(
                ".machinegun-range-indicator"
            )
            .forEach(
                function (indicator) {

                    indicator.classList.remove(
                        "visible"
                    );

                }
            );

        rangeIndicator.classList.add(
            "visible"
        );

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
        // AMÉLIORATION DES DÉFENSES
        // ==========================================

        function upgradeDefense(
            defense
        ) {

            if (
                !defense ||
                !defense.type
            ) {

                return false;

            }


            // ======================================
            // NIVEAU MAX
            // ======================================

            if (
                defense.level >= 3
            ) {

                return false;

            }


            const newLevel =
                defense.level + 1;

            const upgrade =
                defenseUpgrades[
                    defense.type
                ][
                    newLevel
                ];


            if (
                !upgrade
            ) {

                return false;

            }


            // ======================================
            // TRANCHÉE / SACS DE SABLE
            // ======================================

            if (
                defense.type === "trench" ||
                defense.type === "sandbags"
            ) {

                defense.protection =
                    upgrade.protection;

            }


            // ======================================
            // BARBELÉS
            // ======================================

            else if (
                defense.type ===
                    "barbedwire"
            ) {

                defense.enemySpeedMultiplier =
                    upgrade.enemySpeedMultiplier;

            }


            // ======================================
            // MINE
            // ======================================

            else if (
                defense.type ===
                    "mine"
            ) {

                defense.hpDamagePercent =
                    upgrade.hpDamagePercent;

                defense.radiusBonus =
                    upgrade.radiusBonus;

            }


            // ======================================
            // MITRAILLEUSE
            // ======================================

            else if (
                defense.type ===
                    "machinegun"
            ) {

                defense.fireRate =
                    upgrade.fireRate;

                defense.damage =
                    upgrade.damage;

                defense.operatorProtection =
                    upgrade.operatorProtection;

                defense.protection =
                    upgrade.operatorProtection;

            }


            // ======================================
            // APPLIQUE LE NOUVEAU NIVEAU
            // ======================================

            defense.level =
                newLevel;


            // ======================================
            // CLASSE VISUELLE
            // ======================================

            if (
                defense.element
            ) {

                defense.element.classList.remove(
                    "defense-level-1",
                    "defense-level-2",
                    "defense-level-3"
                );

                defense.element.classList.add(
                    "defense-level-" +
                    defense.level
                );

                defense.element.dataset.level =
                    defense.level;

            }


            return true;

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

                x:
                    defense.x - 28,

                y:
                    defense.y

            };

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
    
    soldier.element.classList.remove(
        "machinegun-operator"
    );

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
        // POSITION VISUELLE DE L'OPÉRATEUR MG
        // ==========================================

        function updateMachineGunOperatorPosition(
            defense
        ) {

            if (
                !defense ||
                !defense.operator ||
                !defense.operator.alive ||
                !defense.operator.element
            ) {

                return;

            }

            const angle =
                defense.angle ?? 0;

            const radians =
                angle *
                Math.PI / 180;

            const stockDistance =
                38;

            const visualX =
                defense.x -
                Math.cos(
                    radians
                ) *
                stockDistance;

            const visualY =
                defense.y -
                Math.sin(
                    radians
                ) *
                stockDistance;

            defense.operator.element.style.left =
                visualX + "px";

            defense.operator.element.style.top =
                visualY + "px";

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
                
                defense.angle =
                angle;


            const weapon =
                defense.element.querySelector(
                    ".mg-weapon"
                );


            if (!weapon) {

                return;

            }


            weapon.style.transformOrigin =
                "45px 35px";

            weapon.style.transform =
                `rotate(${angle}deg)`;
               
            updateMachineGunOperatorPosition(
                defense
            );

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

    const upgradedExplosionRadius =
        mine.explosionRadius *
        (
            1 +
            mine.radiusBonus
        );

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


            // ==================================
            // HORS DU RAYON D'EXPLOSION
            // ==================================

            if (
                distance >
                    upgradedExplosionRadius
            ) {

                return;

            }


            // ==================================
            // DÉGÂTS = % DES HP MAX
            // ==================================

            const maxEnemyHp =
                enemy.maxHp ??
                enemy.maxHP ??
                enemy.hp;

            const damage =
                Math.round(
                    maxEnemyHp *
                    mine.hpDamagePercent
                );


            // ==================================
            // SYSTÈME DE COMBAT EXISTANT
            // ==================================

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

                    enemy.alive =
                        false;

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