// ==========================================
// M&B MOBILE
// DEFENSES.JS
// ==========================================

let activeDefense = null;

const defenses = [];


// ==========================================
// ACTIVE LE MODE PLACEMENT
// ==========================================

function activateDefensePlacement(type, cost) {

    if (gamePaused || gameOver) {
        return;
    }

    if (commandPoints < cost) {
        console.log("Pas assez de points.");
        return;
    }

    activeDefense = {
        type: type,
        cost: cost
    };

    battlefield.classList.add(
        "defense-targeting"
    );

    tacticalPanel.classList.add("hidden");
}


// ==========================================
// CLIC / TOUCH SUR LE TERRAIN
// ==========================================

battlefield.addEventListener(
    "click",
    function (event) {

        if (!activeDefense) {
            return;
        }

        if (gamePaused || gameOver) {
            return;
        }

        event.stopPropagation();

        const rect =
            battlefield.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;


        if (activeDefense.type === "trench") {

            createTrench(
                x,
                y,
                activeDefense.cost
            );
        }


        activeDefense = null;

        battlefield.classList.remove(
            "defense-targeting"
        );
    },
    true
);


// ==========================================
// CRÉATION D'UNE TRANCHÉE
// ==========================================

function createTrench(x, y, cost) {

    if (commandPoints < cost) {
        return;
    }


    // Paiement
    commandPoints -= cost;

    pointsDisplay.textContent =
        commandPoints;

    // La tranchée a réellement été achetée :
    // son prochain prix augmente
    increaseTacticalCost({
        type: "trench",
        name: "TRANCHÉE"
    });

    updatePoints();


    // Élément HTML
    const trench =
        document.createElement("div");

    trench.className = "trench";


    // Position
    trench.style.left =
        x + "px";

    trench.style.top =
        y + "px";


    // Contenu visuel
    trench.innerHTML = `
        <div class="trench-dirt"></div>
        <div class="trench-hole"></div>
        <div class="trench-plank"></div>
        <div class="trench-front"></div>
    `;


    battlefield.appendChild(trench);


    // Données de gameplay
    defenses.push({
        type: "trench",
        x: x,
        y: y,
        width: 155,
        height: 72,
        element: trench
    });
}


// ==========================================
// RESET
// ==========================================

function resetDefenses() {

    activeDefense = null;

    battlefield.classList.remove(
        "defense-targeting"
    );


    defenses.forEach(function (defense) {

        if (defense.element) {
            defense.element.remove();
        }

    });


    defenses.length = 0;
}

// ==========================================
// PROTECTION DES TRANCHÉES
// ==========================================

function isSoldierInTrench(soldier) {

    for (const defense of defenses) {

        if (defense.type !== "trench") {
            continue;
        }

        const halfWidth =
            defense.width / 2;

        const halfHeight =
            defense.height / 2;


        const insideX =
            soldier.x >= defense.x - halfWidth &&
            soldier.x <= defense.x + halfWidth;

        const insideY =
            soldier.y >= defense.y - halfHeight &&
            soldier.y <= defense.y + halfHeight;


        if (insideX && insideY) {
            return true;
        }
    }

    return false;
}

function getTrenchSlotAt(x, y) {

    for (const defense of defenses) {

        if (defense.type !== "trench") {
            continue;
        }

        const halfWidth = defense.width / 2;
        const halfHeight = defense.height / 2;

        // Le clic est-il dans cette tranchée ?
        if (
            x < defense.x - halfWidth ||
            x > defense.x + halfWidth ||
            y < defense.y - halfHeight ||
            y > defense.y + halfHeight
        ) {
            continue;
        }

        // 4 positions à l'intérieur
        const slots = [
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

        // Slots déjà utilisés par d'autres soldats
        const freeSlots = slots.filter(function (slot) {

            return !soldiers.some(function (soldier) {

                if (
                    !soldier.alive ||
                    soldier === selectedSoldier
                ) {
                    return false;
                }

                return (
                    Math.abs(soldier.targetX - slot.x) < 10 &&
                    Math.abs(soldier.targetY - slot.y) < 10
                );
            });
        });

        if (freeSlots.length === 0) {
            return null;
        }

        // Prend le slot libre le plus proche du clic
        freeSlots.sort(function (a, b) {

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

            return distanceA - distanceB;
        });

        return freeSlots[0];
    }

    return null;
}