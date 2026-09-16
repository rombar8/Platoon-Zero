// ==========================================
// M&B MOBILE
// MOVEMENT.JS
// Déplacement des unités
// ==========================================


// ==========================================
// MULTI-SÉLECTION
// ==========================================

let selectedSoldiers = [];


// Retourne tous les soldats actuellement
// concernés par un ordre de déplacement.
//
// Si aucune multi-sélection n'existe,
// on utilise selectedSoldier comme avant.
// ==========================================

function getSelectedSoldiers() {

    const validSelectedSoldiers =
        selectedSoldiers.filter(
            function (soldier) {

                return (
                    soldier &&
                    soldier.alive !== false
                );
            }
        );


    if (
        validSelectedSoldiers.length > 0
    ) {

        return validSelectedSoldiers;
    }


    if (
        selectedSoldier &&
        selectedSoldier.alive !== false
    ) {

        return [
            selectedSoldier
        ];
    }


    return [];
}


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
// ORDRE DE DÉPLACEMENT
// ==========================================

battlefield.addEventListener(
    "click",

    function (event) {

        const units =
            getSelectedSoldiers();


        // ==================================
        // AUCUN SOLDAT SÉLECTIONNÉ
        // ==================================

        if (units.length === 0) {

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
        // DÉPLACE LES UNITÉS SÉLECTIONNÉES
        // ==================================

        units.forEach(
            function (
                soldier,
                index
            ) {

                // ==========================
                // ORDRES BLOQUANTS
                // ==========================

                if (
                    soldier.order === "hold" ||
                    soldier.order === "retreat"
                ) {

                    return;
                }


                // ==========================
                // TRANCHÉE
                // ==========================

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

                        return;
                    }
                }


                // ==========================
                // FORMATION DE GROUPE
                // ==========================

                let offsetX = 0;
                let offsetY = 0;


                if (units.length > 1) {

                    const spacing = 26;

                    const columns =
                        Math.ceil(
                            Math.sqrt(
                                units.length
                            )
                        );

                    const column =
                        index %
                        columns;

                    const row =
                        Math.floor(
                            index /
                            columns
                        );


                    offsetX =
                        (
                            column -
                            (columns - 1) / 2
                        ) *
                        spacing;

                    offsetY =
                        (
                            row -
                            (
                                Math.ceil(
                                    units.length /
                                    columns
                                ) -
                                1
                            ) /
                            2
                        ) *
                        spacing;
                }


                // ==========================
                // DESTINATION
                // ==========================

                soldier.targetX =
                    Math.max(
                        17,
                        Math.min(
                            rect.width - 17,
                            targetX +
                            offsetX
                        )
                    );

                soldier.targetY =
                    Math.max(
                        17,
                        Math.min(
                            rect.height - 17,
                            targetY +
                            offsetY
                        )
                    );
            }
        );
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