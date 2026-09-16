// ==========================================
// M&B MOBILE
// MOVEMENT.JS
// Déplacement des unités
// ==========================================


// ==========================================
// ORDRE DE DÉPLACEMENT
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


    // ALLIÉ
    const unitIcon =
        unit.element.querySelector(
            ".unit-icon"
        );

    if (unitIcon) {
        unitIcon.style.transform =
            `translate(-50%, -50%) rotate(${angle}deg)`;
        return;
    }


    // ENNEMI
    const enemyIcon =
        unit.element.querySelector(
            ".enemy-icon"
        );

    if (enemyIcon) {
        enemyIcon.style.rotate =
            angle + "deg";
    }
}


battlefield.addEventListener(
    "click",
    function (event) {

        // Aucun soldat sélectionné
        if (selectedSoldier === null) {
            return;
        }

        // ======================================
        // ORDRES BLOQUANT LE DÉPLACEMENT
        // ======================================

        if (
            selectedSoldier.order === "hold" ||
            selectedSoldier.order === "retreat"
        ) {

            return;

        }

        const rect =
            battlefield.getBoundingClientRect();

        // Position du clic dans le terrain
        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        
        // ======================================
        // PLACEMENT AUTOMATIQUE DANS TRANCHÉE
        // ======================================

        if (
            typeof getTrenchSlotAt === "function"
        ) {

            const trenchSlot =
                getTrenchSlotAt(x, y);

            if (trenchSlot) {

                selectedSoldier.targetX =
                    trenchSlot.x;

                selectedSoldier.targetY =
                    trenchSlot.y;

                return;
            }
        }


        // Limite horizontale
        selectedSoldier.targetX =
            Math.max(
                17,
                Math.min(
                    rect.width - 17,
                    x
                )
            );


        // Limite verticale
        selectedSoldier.targetY =
            Math.max(
                17,
                Math.min(
                    rect.height - 17,
                    y
                )
            );

    }
);


// ==========================================
// DÉPLACEMENT DES SOLDATS
// ==========================================

function moveSoldiers(deltaTime) {

    soldiers.forEach(
        function (soldier) {

            if (soldier.alive === false) {
                return;
            }

            const dx =
                soldier.targetX - soldier.x;

            const dy =
                soldier.targetY - soldier.y;

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

            } else if (distance > 1) {

                rotateUnitTowards(
                    soldier,
                    soldier.targetX,
                    soldier.targetY
                );
            }

            // ==================================
            // ARRIVÉ À DESTINATION
            // ==================================

            if (distance < 0.5) {

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
                dx / distance;

            const directionY =
                dy / distance;

            if (movement < distance) {

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

function updateTrenchStatus(soldier) {

    if (
        typeof isSoldierInTrench !== "function"
    ) {
        return;
    }

    const inTrench =
        isSoldierInTrench(soldier);

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

    if (soldier === selectedSoldier) {

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