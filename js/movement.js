// ==========================================
// M&B MOBILE
// MOVEMENT.JS
// Déplacement des unités
// ==========================================


// ==========================================
// ORIENTATION D'UNE UNITÉ
// ==========================================

function rotateUnitTowards(
    unit,
    targetX,
    targetY
) {

    const dx =
        targetX - unit.x;

    const dy =
        targetY - unit.y;

    const angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI -
        90;


    // ======================================
    // ALLIÉ
    // ======================================

    const unitIcon =
        unit.element.querySelector(
            ".unit-icon"
        );

    if (unitIcon) {

        unitIcon.style.transform =
            `translate(-50%, -50%) rotate(${angle}deg)`;

        return;
    }


    // ======================================
    // ENNEMI
    // ======================================

    const enemyIcon =
        unit.element.querySelector(
            ".enemy-icon"
        );

    if (enemyIcon) {

        enemyIcon.style.rotate =
            angle + "deg";
    }
}


// ==========================================
// DÉSÉLECTION DU SOLDAT
// ==========================================

function clearSoldierSelection() {

    if (!selectedSoldier) {
        return;
    }


    // Retire l'effet visuel de sélection
    if (selectedSoldier.element) {

        selectedSoldier.element.classList.remove(
            "selected"
        );
    }


    // Ferme la fiche du soldat
    const unitPanel =
        document.querySelector(
            "#unit-panel"
        );

    if (unitPanel) {

        unitPanel.classList.add(
            "hidden"
        );
    }


    // Plus aucun soldat sélectionné
    selectedSoldier = null;
}


// ==========================================
// ORDRE DE DÉPLACEMENT
// ==========================================

battlefield.addEventListener(
    "click",

    function (event) {


        // ==================================
        // AUCUN SOLDAT SÉLECTIONNÉ
        // ==================================

        if (
            !selectedSoldier ||
            selectedSoldier.alive === false
        ) {

            return;
        }


        // On garde temporairement le soldat
        // avant de supprimer la sélection.

        const soldier =
            selectedSoldier;


        // ==================================
        // ORDRES BLOQUANTS
        // ==================================

        if (
            soldier.order === "hold" ||
            soldier.order === "retreat"
        ) {

            return;
        }


        // ==================================
        // POSITION DU CLIC
        // ==================================

        const rect =
            battlefield.getBoundingClientRect();

        const x =
            event.clientX -
            rect.left;

        const y =
            event.clientY -
            rect.top;


        // ==================================
        // POSITION LIMITÉE AU TERRAIN
        // ==================================

        const targetX =
            Math.max(
                17,
                Math.min(
                    rect.width - 17,
                    x
                )
            );

        const targetY =
            Math.max(
                17,
                Math.min(
                    rect.height - 17,
                    y
                )
            );


        // ==================================
        // TRANCHÉE
        // ==================================

        if (
            typeof getTrenchSlotAt ===
            "function"
        ) {

            const trenchSlot =
                getTrenchSlotAt(
                    x,
                    y
                );

            if (trenchSlot) {

                soldier.targetX =
                    trenchSlot.x;

                soldier.targetY =
                    trenchSlot.y;


                // Ordre donné :
                // désélection immédiate.

                clearSoldierSelection();

                return;
            }
        }


        // ==================================
        // DESTINATION NORMALE
        // ==================================

        soldier.targetX =
            targetX;

        soldier.targetY =
            targetY;


        // ==================================
        // ORDRE TERMINÉ
        // ==================================

        // Le soldat continue son déplacement,
        // mais le joueur doit le sélectionner
        // à nouveau pour donner un autre ordre.

        clearSoldierSelection();
    }
);


// ==========================================
// DÉPLACEMENT DES SOLDATS
// ==========================================

function moveSoldiers(
    deltaTime
) {

    soldiers.forEach(
        function (soldier) {

            if (
                soldier.alive === false
            ) {

                return;
            }


            const dx =
                soldier.targetX -
                soldier.x;

            const dy =
                soldier.targetY -
                soldier.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            // ==================================
            // ORIENTATION
            // ==================================

            if (
                soldier.target &&
                soldier.target.alive
            ) {

                rotateUnitTowards(
                    soldier,
                    soldier.target.x,
                    soldier.target.y
                );

            } else if (
                distance > 1
            ) {

                rotateUnitTowards(
                    soldier,
                    soldier.targetX,
                    soldier.targetY
                );
            }


            // ==================================
            // ARRIVÉ À DESTINATION
            // ==================================

            if (
                distance < 0.5
            ) {

                soldier.x =
                    soldier.targetX;

                soldier.y =
                    soldier.targetY;


                updateSoldierPosition(
                    soldier
                );

                updateTrenchStatus(
                    soldier
                );

                return;
            }


            // ==================================
            // VITESSE EN PIXELS / SECONDE
            // ==================================

            const movement =
                soldier.speed *
                deltaTime;

            const directionX =
                dx /
                distance;

            const directionY =
                dy /
                distance;


            if (
                movement < distance
            ) {

                soldier.x +=
                    directionX *
                    movement;

                soldier.y +=
                    directionY *
                    movement;

            } else {

                soldier.x =
                    soldier.targetX;

                soldier.y =
                    soldier.targetY;
            }


            updateSoldierPosition(
                soldier
            );

            updateTrenchStatus(
                soldier
            );
        }
    );
}


// ==========================================
// ÉTAT DE COUVERTURE
// ==========================================

function updateTrenchStatus(
    soldier
) {

    if (
        typeof isSoldierInTrench !==
        "function"
    ) {

        return;
    }


    const inTrench =
        isSoldierInTrench(
            soldier
        );


    // ======================================
    // INDICATEUR SUR LE TERRAIN
    // ======================================

    soldier.element.classList.toggle(
        "in-trench",
        inTrench
    );


    // ======================================
    // MISE À JOUR LIVE DE LA FICHE
    // ======================================

    if (
        soldier === selectedSoldier
    ) {

        const coverIndicator =
            document.querySelector(
                "#unit-cover"
            );


        if (!coverIndicator) {

            return;
        }


        if (inTrench) {

            coverIndicator.textContent =
                "🛡️ COUVERT — TRANCHÉE";

            coverIndicator.classList.add(
                "active"
            );

        } else {

            coverIndicator.textContent =
                "⚠ AUCUNE COUVERTURE";

            coverIndicator.classList.remove(
                "active"
            );
        }
    }
}