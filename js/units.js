// ==========================================
// M&B MOBILE
// UNITS.JS
// Gestion des unités alliées
// ==========================================

// ==========================================
// NOMS DES SOLDATS
// ==========================================

const soldierNames = [

    "MILLER",
    "COOPER",
    "WALKER",
    "HARRIS",
    "TURNER",
    "CARTER",
    "MORGAN",
    "BAKER",
    "PARKER",
    "REED",
    "WARD",
    "FOSTER",
    "BENNETT",
    "COLLINS",
    "MURPHY"

];


function generateSoldierName() {

    const randomIndex =
        Math.floor(
            Math.random() *
            soldierNames.length
        );


    return soldierNames[
        randomIndex
    ];
}

// ==========================================
// CRÉATION D'UN SOLDAT
// ==========================================

function createSoldier(
    xPercent,
    yPercent,
    type = "rifleman"
) {

    const rect =
        battlefield.getBoundingClientRect();

    // Récupération des statistiques
    // définies dans config.js
    const stats =
        soldierTypes[type] ||
        soldierTypes.rifleman;


    // ======================================
    // POSITION DE DÉPART
    // ======================================

    const x =
        rect.width * (xPercent / 100);

    const y =
        rect.height * (yPercent / 100);


    // ======================================
    // ÉLÉMENT HTML
    // ======================================

const element =
    document.createElement("div");

element.classList.add(
    "soldier",
    type
);

element.innerHTML = `
    <span class="unit-icon">
        <span class="unit-helmet"></span>
        <span class="unit-body"></span>
        <span class="unit-gun"></span>
    </span>
`;

battlefield.appendChild(
    element
);


    // ======================================
    // OBJET SOLDAT
    // ======================================

    const soldier = {

        // Élément graphique
        element: element,

        // Classe
        type: type,
        className: stats.name,

        // Identité
        name: generateSoldierName(),
        rank: "PVT",

        // Position
        x: x,
        y: y,

        targetX: x,
        targetY: y,

        // Déplacement
        speed: stats.speed,

        // Vie
        hp: stats.hp,
        maxHp: stats.hp,

        // Combat
        damage: stats.damage,
        range: stats.range,
        fireRate: stats.fireRate,
        target: null,
        isFiring: false,
        lastShot: 0,
        alive: true,

        order: "fire",

        // Progression
        kills: 0,
        xp: 0

    };


    // Place le soldat sur le terrain
    updateSoldierPosition(
        soldier
    );


    // ======================================
    // SÉLECTION DU SOLDAT
    // ======================================

element.addEventListener(
    "click",

    function (event) {

        // Empêche le clic de déclencher
        // un ordre de déplacement
        event.stopPropagation();


        // ======================================
        // CTRL + CLIC = MULTI-SÉLECTION
        // ======================================

        if (event.ctrlKey) {

            const index =
                selectedSoldiers.indexOf(
                    soldier
                );


            // Déjà sélectionné
            // => on le retire du groupe
            if (index !== -1) {

                selectedSoldiers.splice(
                    index,
                    1
                );

                soldier.element
                    .classList
                    .remove("selected");


                // Si c'était le soldat principal
                // on prend un autre soldat du groupe
                if (
                    selectedSoldier === soldier
                ) {

                    selectedSoldier =
                        selectedSoldiers[0] ||
                        null;
                }

            } else {

                // Ajoute au groupe
                selectedSoldiers.push(
                    soldier
                );

                soldier.element
                    .classList
                    .add("selected");


                // Premier soldat du groupe
                if (
                    selectedSoldier === null
                ) {

                    selectedSoldier =
                        soldier;
                }
            }


            // ==================================
            // PANNEAU D'UNITÉ
            // ==================================

            if (selectedSoldier) {

                showUnitPanel(
                    selectedSoldier
                );
            }

            return;
        }


        // ======================================
        // CLIC SIMPLE = SÉLECTION UNIQUE
        // ======================================

        selectedSoldiers.forEach(
            function (selectedUnit) {

                selectedUnit.element
                    .classList
                    .remove("selected");
            }
        );


        // Compatibilité avec l'ancien système
        if (
            selectedSoldier !== null
        ) {

            selectedSoldier.element
                .classList
                .remove("selected");
        }


        // Vide l'ancienne multi-sélection
        selectedSoldiers.length = 0;


        // Nouvelle sélection
        selectedSoldier =
            soldier;

        selectedSoldiers.push(
            soldier
        );


        soldier.element
            .classList
            .add("selected");


        showUnitPanel(
            soldier
        );


        console.log(
            soldier.rank,
            soldier.name,
            "-",
            soldier.className
        );
    }
);


    // ======================================
    // AJOUT À L'ESCOUADE
    // ======================================

    soldiers.push(
        soldier
    );


    updateSoldiersCount();


    return soldier;
}


// ==========================================
// POSITION VISUELLE
// ==========================================

function updateSoldierPosition(
    soldier
) {

    soldier.element.style.left =
        soldier.x + "px";


    soldier.element.style.top =
        soldier.y + "px";

}


// ==========================================
// COMPTEUR DE SOLDATS
// ==========================================

function updateSoldiersCount() {

    soldiersCountDisplay.textContent =
        soldiers.length;

}


// ==========================================
// APPARITION D'UN RENFORT
// ==========================================

function spawnReinforcement(
    type
) {

    // Zone de déploiement alliée
    // X : 25% → 75%
    // Y : 82% → 92%

    const x =
        25 +
        Math.random() * 50;


    const y =
        82 +
        Math.random() * 10;


    const soldier =
        createSoldier(
            x,
            y,
            type
        );


    console.log(
        "Renfort arrivé :",
        soldier.className
    );


    return soldier;
}