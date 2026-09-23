// ==========================================
// Platoon Zero
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

        const rangeIndicator =
            selectedSoldier.element
                .querySelector(
                    ".soldier-range-indicator"
                );

        if (rangeIndicator) {

            rangeIndicator.classList.remove(
                "visible"
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

    selectedSoldier =
        null;
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
        // MITRAILLEUSE DÉFENSIVE
        // ==================================

        if (
            typeof getMachineGunAt ===
                "function" &&
            typeof assignSoldierToMachineGun ===
                "function"
        ) {

            const machineGun =
                getMachineGunAt(
                    x,
                    y
                );


            if (machineGun) {

                // ==================================
                // MG DÉJÀ OCCUPÉE
                // ==================================

                if (
                    machineGun.operator &&
                    machineGun.operator.alive &&
                    machineGun.operator !==
                        soldier
                ) {

                    console.log(
                        "Mitrailleuse déjà occupée."
                    );

                    clearSoldierSelection();

                    return;
                }


                // ==================================
                // ASSIGNATION
                // ==================================

                const assigned =
                    assignSoldierToMachineGun(
                        soldier,
                        machineGun
                    );


                if (assigned) {

                    console.log(
                        soldier.name +
                        " rejoint la mitrailleuse."
                    );

                    clearSoldierSelection();

                    return;
                }
            }
        }


        // ==================================
        // COUVERTURE
        // ==================================

        if (
            typeof getTrenchSlotAt ===
                "function"
        ) {

            const defenseSlot =
                getTrenchSlotAt(
                    x,
                    y
                );


            if (defenseSlot) {

                // ==================================
                // QUITTE SA MG SI NÉCESSAIRE
                // ==================================

                if (
                    soldier.machineGun &&
                    typeof releaseSoldierFromMachineGun ===
                        "function"
                ) {

                    releaseSoldierFromMachineGun(
                        soldier
                    );
                }


                soldier.targetX =
                    defenseSlot.x;

                soldier.targetY =
                    defenseSlot.y;

                soldier.target =
                    null;

                soldier.isFiring =
                    false;


                clearSoldierSelection();

                return;
            }
        }


        // ==================================
        // QUITTE LA MITRAILLEUSE
        // ==================================

        if (
            soldier.machineGun &&
            typeof releaseSoldierFromMachineGun ===
                "function"
        ) {

            releaseSoldierFromMachineGun(
                soldier
            );
        }


        // ==================================
        // DESTINATION NORMALE
        // ==================================

        soldier.targetX =
            targetX;

        soldier.targetY =
            targetY;

        soldier.target =
            null;

        soldier.isFiring =
            false;


        // ==================================
        // ORDRE TERMINÉ
        // ==================================

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


        // ==================================
        // DIRECTION VERS LA DESTINATION
        // ==================================

        const dx =
            soldier.targetX -
            soldier.x;

        const dy =
            soldier.targetY -
            soldier.y;


        // ==================================
        // DISTANCE
        // ==================================

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // ==================================
        // OPÉRATEUR DE MITRAILLEUSE
        // ==================================

        /*
            Si le soldat est arrivé au siège
            de sa mitrailleuse :

            - il ne vise plus avec son arme
            - il ne tourne plus vers les ennemis
            - il reste à sa destination
            - seule la MG s'oriente
        */

        const operatingMachineGun =
            soldier.machineGun &&
            typeof isMachineGunOperatorReady ===
                "function" &&
            isMachineGunOperatorReady(
                soldier.machineGun
            );




        if (operatingMachineGun) {

            soldier.target =
                null;

            soldier.isFiring =
                false;
            
            soldier.element.classList.add(
                "machinegun-operator"
            );


            
        // ==================================
        // POSITION VISUELLE DERRIÈRE LA CROSSE
        // ==================================

        const machineGun =
            soldier.machineGun;

        const angle =
            machineGun.angle ?? 0;

        
        const radians =
            angle *
            Math.PI / 180;

        const stockDistance =
            38;

        const visualX =
            machineGun.x -
            Math.cos(
                radians
            ) *
            stockDistance;

        const visualY =
            machineGun.y -
            Math.sin(
                radians
            ) *
            stockDistance;

        soldier.element.style.left =
            visualX + "px";

        soldier.element.style.top =
            visualY + "px";


            // ==================================
            // ORIENTATION DE L'OPÉRATEUR
            // ==================================

            const unitIcon =
                soldier.element.querySelector(
                    ".unit-icon"
                );

            if (unitIcon) {

                const operatorAngle =
                    angle - 90;

                unitIcon.style.transform =
                    `translate(-50%, -50%) rotate(${operatorAngle}deg)`;

            }


            return;

        }


        // ==================================
        // ORIENTATION NORMALE
        // ==================================

        else if (
            soldier.target &&
            soldier.target.alive
        ) {

            rotateUnitTowards(
                soldier,
                soldier.target.x,
                soldier.target.y
            );
        }


        // ==================================
        // ORIENTATION PENDANT DÉPLACEMENT
        // ==================================

        else if (
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


            // ==================================
            // ACTUALISE L'ÉTAT DE LA MG
            // ==================================

            if (
                soldier.machineGun &&
                typeof updateMachineGunVisual ===
                    "function"
            ) {

                updateMachineGunVisual(
                    soldier.machineGun
                );
            }


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


        // ==================================
        // DÉPLACEMENT
        // ==================================

        let nextX;
        let nextY;

        if (movement < distance) {

            nextX =
                soldier.x +
                directionX * movement;

            nextY =
                soldier.y +
                directionY * movement;

        } else {

            nextX =
                soldier.targetX;

            nextY =
                soldier.targetY;
        }


        // ==================================
        // COLLISION AVEC LES OBSTACLES
        // ==================================

        const blocked =
            typeof isUnitBlockedByObstacle ===
                "function" &&
            isUnitBlockedByObstacle(
                nextX,
                nextY
            );


                if (!blocked) {

            // ==============================
            // CHEMIN DIRECT LIBRE
            // ==============================

            soldier.x =
                nextX;

            soldier.y =
                nextY;

        } else {

            // ==============================
            // OBSTACLE :
            // ESSAIE DE GLISSER SUR LES CÔTÉS
            // ==============================

            const horizontalBlocked =
                typeof isUnitBlockedByObstacle ===
                    "function" &&
                isUnitBlockedByObstacle(
                    nextX,
                    soldier.y
                );


            const verticalBlocked =
                typeof isUnitBlockedByObstacle ===
                    "function" &&
                isUnitBlockedByObstacle(
                    soldier.x,
                    nextY
                );


            // ==============================
            // DISTANCE RESTANTE
            // POUR CHAQUE OPTION
            // ==============================

            const horizontalDistance =
                Math.hypot(
                    soldier.targetX - nextX,
                    soldier.targetY - soldier.y
                );


            const verticalDistance =
                Math.hypot(
                    soldier.targetX - soldier.x,
                    soldier.targetY - nextY
                );


            // ==============================
            // LES DEUX DIRECTIONS LIBRES
            // ==============================

            if (
                !horizontalBlocked &&
                !verticalBlocked
            ) {

                if (
                    horizontalDistance <
                    verticalDistance
                ) {

                    soldier.x =
                        nextX;

                } else {

                    soldier.y =
                        nextY;

                }

            }

            // ==============================
            // HORIZONTAL LIBRE
            // ==============================

            else if (
                !horizontalBlocked
            ) {

                soldier.x =
                    nextX;

            }

            // ==============================
            // VERTICAL LIBRE
            // ==============================

            else if (
                !verticalBlocked
            ) {

                soldier.y =
                    nextY;

            }

        }


        // ==================================
        // MISE À JOUR VISUELLE
        // ==================================

        updateSoldierPosition(
            soldier
        );

        updateTrenchStatus(
            soldier
        );


        // ==================================
        // SOLDAT EN ROUTE VERS UNE MG
        // ==================================

        if (
            soldier.machineGun &&
            typeof updateMachineGunVisual ===
                "function"
        ) {

            updateMachineGunVisual(
                soldier.machineGun
            );
        }
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


        // ==================================
        // NOM DE LA COUVERTURE
        // ==================================

        let coverName =
            null;


        if (
            typeof getSoldierCoverName ===
                "function"
        ) {

            coverName =
                getSoldierCoverName(
                    soldier
                );
        }


        // ==================================
        // SOLDAT À COUVERT
        // ==================================

        if (coverName) {

            coverIndicator.textContent =
                "🛡️ COUVERT — " +
                coverName;

            coverIndicator.classList.add(
                "active"
            );
        }


        // ==================================
        // AUCUNE COUVERTURE
        // ==================================

        else {

            coverIndicator.textContent =
                "⚠ AUCUNE COUVERTURE";

            coverIndicator.classList.remove(
                "active"
            );
        }
    }
}