// ==========================================
// Platoon Zero
// MEDIC.JS
// Soins automatiques de proximité
// ==========================================

const MEDIC_HEAL_RANGE = 85;
const MEDIC_HEAL_AMOUNT = 6;
const MEDIC_HEAL_INTERVAL = 1200;


// ==========================================
// DISTANCE ENTRE DEUX UNITÉS
// ==========================================

function getMedicDistance(
    unitA,
    unitB
) {

    const dx =
        unitA.x - unitB.x;

    const dy =
        unitA.y - unitB.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ==========================================
// CHERCHE UN ALLIÉ BLESSÉ PROCHE
// ==========================================

function findWoundedSoldier(
    medic
) {

    let target = null;
    let lowestHpRatio = 1;


    soldiers.forEach(
        function (soldier) {

            // Ne se soigne pas lui-même
            if (soldier === medic) {
                return;
            }

            // Mort
            if (soldier.alive === false) {
                return;
            }

            // Déjà full HP
            if (soldier.hp >= soldier.maxHp) {
                return;
            }


            const distance =
                getMedicDistance(
                    medic,
                    soldier
                );


            // Trop loin
            if (
                distance >
                MEDIC_HEAL_RANGE
            ) {

                return;
            }


            const hpRatio =
                soldier.hp /
                soldier.maxHp;


            // Priorité au plus blessé
            if (
                hpRatio <
                lowestHpRatio
            ) {

                lowestHpRatio =
                    hpRatio;

                target =
                    soldier;
            }
        }
    );


    return target;
}


// ==========================================
// EFFET VISUEL DU SOIN
// ==========================================

function showHealEffect(
    soldier
) {

    if (
        !soldier ||
        !soldier.element
    ) {

        return;
    }


    const effect =
        document.createElement(
            "div"
        );

    effect.className =
        "medic-heal-effect";

    effect.textContent =
        "+";


    soldier.element.appendChild(
        effect
    );


    setTimeout(
        function () {

            effect.remove();

        },
        600
    );
}


// ==========================================
// SOIN
// ==========================================

function healSoldier(
    medic,
    soldier
) {

    const oldHp =
        soldier.hp;


    soldier.hp =
        Math.min(
            soldier.maxHp,
            soldier.hp +
            MEDIC_HEAL_AMOUNT
        );


    const healed =
        soldier.hp -
        oldHp;


    if (healed <= 0) {
        return;
    }


    showHealEffect(
        soldier
    );


    // Si la fiche du soldat soigné
    // est actuellement ouverte

    if (
        selectedSoldier === soldier &&
        typeof showUnitPanel === "function"
    ) {

        showUnitPanel(
            soldier
        );
    }
}


// ==========================================
// UPDATE DES MÉDECINS
// ==========================================

function updateMedics(
    currentTime
) {

    soldiers.forEach(
        function (medic) {

            if (
                medic.alive === false ||
                medic.type !== "medic"
            ) {

                return;
            }


            if (
                medic.lastHeal === undefined
            ) {

                medic.lastHeal = 0;
            }


            if (
                currentTime -
                medic.lastHeal <
                MEDIC_HEAL_INTERVAL
            ) {

                return;
            }


            const target =
                findWoundedSoldier(
                    medic
                );


            // Aucun blessé assez proche
            if (!target) {
                return;
            }


            healSoldier(
                medic,
                target
            );


            medic.lastHeal =
                currentTime;
        }
    );
}