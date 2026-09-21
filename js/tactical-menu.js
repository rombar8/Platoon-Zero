// ==========================================
// M&B MOBILE
// TACTICAL-MENU.JS
// Gestion du menu tactique
// ==========================================


// ==========================================
// PRIX DYNAMIQUE DES RENFORTS
// ==========================================

const REINFORCEMENT_COST_PER_SOLDIER = 0.10;
        let currentTacticalMenu =
            null;


// ==========================================
// VÉRIFIE SI UNE OPTION EST UN RENFORT
// ==========================================

function isReinforcementOption(option) {

    if (!option || !option.type) {
        return false;
    }

    return Object.prototype.hasOwnProperty.call(
        soldierTypes,
        option.type
    );
}


// ==========================================
// CALCUL DU PRIX
// ==========================================

function getTacticalCost(option) {

    // Prix de base
    const baseCost =
        option.cost || 0;


    // ======================================
    // SOUTIENS / DÉFENSES / ORDRES
    // ======================================

    // Ils gardent leur prix normal.
    if (!isReinforcementOption(option)) {

        return baseCost;
    }


    // ======================================
    // RENFORTS
    // ======================================

    // On compte uniquement les soldats
    // actuellement présents sur le terrain.

    const soldierCount =
        soldiers.filter(
            function (soldier) {

                return (
                    soldier &&
                    soldier.alive !== false
                );
            }
        ).length;


    // +10 % du prix de base
    // par soldat vivant.

    const multiplier =
        1 +
        (
            soldierCount *
            REINFORCEMENT_COST_PER_SOLDIER
        );


    return Math.ceil(
        baseCost *
        multiplier
    );
}


// ==========================================
// COMPATIBILITÉ RESET
// ==========================================

// L'ancien système utilisait un compteur
// d'achats qu'il fallait remettre à zéro.
//
// Il n'existe plus.
// On garde simplement cette fonction
// au cas où game.js l'appelle encore.

function resetTacticalCosts() {

    // Rien à réinitialiser.
}


// ==========================================
// OUVERTURE DU MENU
// ==========================================

function openTacticalMenu(menuName) {

    const menu =
        tacticalMenus[menuName];
            currentTacticalMenu =
                menuName;


    if (!menu) {

        console.error(
            "Menu tactique inconnu :",
            menuName
        );

        return;
    }


    // ======================================
    // TITRE
    // ======================================

    tacticalTitle.textContent =
        menu.title;


    // ======================================
    // NETTOYAGE
    // ======================================

    tacticalContent.innerHTML =
        "";


    // ======================================
    // CRÉATION DES OPTIONS
    // ======================================

    menu.options.forEach(
        function (option) {

            const currentCost =
                getTacticalCost(
                    option
                );


            const button =
                document.createElement(
                    "button"
                );


            button.classList.add(
                "tactical-option"
            );
            
            // ==================================
            // COMPTEUR MITRAILLEUSES
            // ==================================

            let optionName =
                option.name;

            let machineGunLimitReached =
                false;

            if (
                option.type === "machinegun"
            ) {

                const machineGunCount =
                    defenses.filter(
                        function (defense) {

                            return (
                                defense &&
                                defense.type ===
                                    "machinegun"
                            );
                        }
                    ).length;


                machineGunLimitReached =
                    machineGunCount >= 3;


                if (machineGunLimitReached) {

                    optionName =
                        "MITRAILLEUSE 3/3 — MAX";

                } else {

                    optionName =
                        "MITRAILLEUSE " +
                        machineGunCount +
                        "/3";
                }
            }

            // ==================================
            // CONTENU DU BOUTON
            // ==================================

            button.innerHTML = `

                <span class="tactical-icon">
                    ${option.icon}
                </span>

                <span class="tactical-info">

                    <strong>
                        ${optionName}
                    </strong>

                    <small>
                        ${option.description}
                    </small>

                </span>

                <span class="tactical-cost">
                    ${currentCost}
                </span>

            `;


            // ==================================
            // PAS ASSEZ DE POINTS
            // ==================================

            if (
                currentCost >
                    commandPoints ||
                machineGunLimitReached
            ) {

                button.disabled =
                    true;
            }


            // ==================================
            // CLIC SUR UNE OPTION
            // ==================================

            button.addEventListener(
                "click",

                function () {

                    buyTacticalOption(
                        option
                    );
                }
            );


            tacticalContent.appendChild(
                button
            );
        }
    );


    // ======================================
    // AFFICHAGE
    // ======================================

    tacticalPanel.classList.remove(
        "hidden"
    );
}


// ==========================================
// ACHETER / UTILISER UNE OPTION
// ==========================================

function buyTacticalOption(option) {

    // Recalcul au moment exact de l'achat.
    //
    // Important :
    // le nombre de soldats peut avoir changé
    // depuis l'ouverture du menu.

    const currentCost =
        getTacticalCost(
            option
        );


    // ======================================
    // VÉRIFICATION DES POINTS
    // ======================================

    if (
        commandPoints <
        currentCost
    ) {

        console.log(
            "Pas assez de points."
        );

        return;
    }


    // ======================================
    // TRANCHÉE
    // ======================================

    // Le paiement est effectué
    // au moment du placement.

    const defenseOption =
    [
        "trench",
        "sandbags",
        "barbedwire",
        "mine",
        "machinegun"
    ].includes(
        option.type
    );

    if (defenseOption) {

        activateDefensePlacement(
            option.type,
            currentCost
        );

        return;
    }


    // ======================================
    // RENFORT
    // ======================================

    if (
        isReinforcementOption(
            option
        )
    ) {

        if (
            typeof cheatState === "undefined" ||
            !cheatState.infinitePoints
        ) {
            commandPoints -= currentCost;
        }

        updatePoints();



        spawnReinforcement(
            option.type
        );

        return;
    }


    // ======================================
    // GRENADE
    // ======================================

    if (
        option.name ===
        "GRENADE"
    ) {

        commandPoints -=
            currentCost;


        updatePoints();


        activateSupport(
            "grenade"
        );

        return;
    }


    // ======================================
    // MORTIER
    // ======================================

    if (
        option.name ===
        "MORTIER"
    ) {

        commandPoints -=
            currentCost;


        updatePoints();


        activateSupport(
            "mortar"
        );

        return;
    }


    // ======================================
    // RAVITAILLEMENT
    // ======================================

    if (
        option.name ===
        "RAVITAILLEMENT"
    ) {

        commandPoints -=
            currentCost;


        updatePoints();


        activateSupport(
            "supply"
        );

        return;
    }


    // ======================================
    // TENIR POSITION
    // ======================================

    if (
        option.name ===
        "TENIR POSITION"
    ) {

        orderHoldPosition();

        return;
    }


    // ======================================
    // FEU À VOLONTÉ
    // ======================================

    if (
        option.name ===
        "FEU À VOLONTÉ"
    ) {

        orderFireAtWill();

        return;
    }


    // ======================================
    // REPLI
    // ======================================

    if (
        option.name ===
        "REPLI"
    ) {

        orderRetreat();


        return;
    }


    // ======================================
    // OPTION INCONNUE
    // ======================================

    console.warn(
        "Option tactique non gérée :",
        option.name
    );
}


    
    // ==========================================
    // ACTUALISER LE MENU OUVERT
    // ==========================================

    function refreshTacticalMenu() {

        if (
            currentTacticalMenu ===
                null
        ) {

            return;
        }

        if (
            tacticalPanel.classList.contains(
                "hidden"
            )
        ) {

            return;
        }

        openTacticalMenu(
            currentTacticalMenu
        );
    }


// ==========================================
// FERMER LE MENU
// ==========================================

function closeTacticalMenu() {
    
    currentTacticalMenu =
        null;

    tacticalPanel.classList.add(
        "hidden"
    );
}


// ==========================================
// BOUTONS DE LA BARRE DE COMMANDES
// ==========================================

commandButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",

            function () {

                const menuName =
                    button.dataset.menu;


                if (!menuName) {

                    return;
                }


                openTacticalMenu(
                    menuName
                );
            }
        );
    }
);


// ==========================================
// BOUTON FERMER
// ==========================================

closeTacticalButton.addEventListener(
    "click",
    closeTacticalMenu
);


// ==========================================
// RACCOURCIS CLAVIER - MENUS TACTIQUES
// ==========================================

document.addEventListener(
    "keydown",

    function (event) {

        // ==================================
        // IGNORE LES CHAMPS DE SAISIE
        // ==================================

        const activeElement =
            document.activeElement;

        if (
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT"
            )
        ) {
            return;
        }


        // ==================================
        // RENFORTS
        // ==================================

        if (event.code === "Digit1") {

            if (currentTacticalMenu === "reinforcements") {

                closeTacticalMenu();

            } else {

                openTacticalMenu(
                    "reinforcements"
                );
            }

            return;
        }


        // ==================================
        // SOUTIEN
        // ==================================

        if (event.code === "Digit2") {

            if (currentTacticalMenu === "support") {

                closeTacticalMenu();

            } else {

                openTacticalMenu(
                    "support"
                );
            }

            return;
        }


        // ==================================
        // DÉFENSES
        // ==================================

        if (event.code === "Digit3") {

            if (currentTacticalMenu === "defenses") {

                closeTacticalMenu();

            } else {

                openTacticalMenu(
                    "defenses"
                );
            }

            return;
        }


        // ==================================
        // ORDRES
        // ==================================

        if (event.code === "Digit4") {

            if (currentTacticalMenu === "orders") {

                closeTacticalMenu();

            } else {

                openTacticalMenu(
                    "orders"
                );
            }

            return;
        }
    }
);