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

        if (type === "minigunner") {

            element.innerHTML = `
                <span class="unit-icon">

                    <span class="unit-helmet"></span>
                    <span class="unit-body"></span>

                    <span class="minigun-backpack"></span>
                    <span class="minigun-ammo-belt"></span>

                    <span class="unit-gun minigun">
                        <span class="minigun-barrels"></span>
                        <span class="minigun-muzzle"></span>
                    </span>

                </span>
            `;

        } else {

            element.innerHTML = `
                <span class="unit-icon">

                    <span class="unit-helmet"></span>
                    <span class="unit-body"></span>
                    <span class="unit-gun"></span>

                </span>
            `;
        }

battlefield.appendChild(
    element
);

    
        // ======================================
        // ZONE VISUELLE DE PORTÉE
        // ======================================

        const rangeIndicator =
            document.createElement(
                "div"
            );

        rangeIndicator.classList.add(
            "soldier-range-indicator"
        );

        rangeIndicator.style.width =
            stats.range * 2 + "px";

        rangeIndicator.style.height =
            stats.range * 2 + "px";

        element.appendChild(
            rangeIndicator
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

        
        // Ordre de ciblage individuel
        targetPriority: "closest",

        // Progression
        kills: 0,
        xp: 0

    };


    // Place le soldat sur le terrain
    updateSoldierPosition(
        soldier
    );


    
        // ======================================
        // ORIENTATION DE DÉPART
        // Face au haut du champ de bataille
        // ======================================

        const unitIcon =
            soldier.element.querySelector(
                ".unit-icon"
            );


        if (unitIcon) {

            unitIcon.style.transform =
                "translate(-50%, -50%) rotate(180deg)";

        }


// ======================================
// SÉLECTION DU SOLDAT
// ======================================

element.addEventListener(
    "click",

    function (event) {

        // Empêche le clic sur le soldat
        // d'être interprété comme un clic terrain.
        event.stopPropagation();


        // Soldat mort = impossible à sélectionner
        if (soldier.alive === false) {
            return;
        }


        // ======================================
        // RETIRE L'ANCIENNE SÉLECTION
        // ======================================

        if (
            selectedSoldier &&
            selectedSoldier !== soldier
        ) {

            selectedSoldier.element
                .classList
                .remove("selected");
        }


        // ======================================
        // NOUVELLE SÉLECTION
        // ======================================

        selectedSoldier =
            soldier;

        soldier.element
            .classList
            .add("selected");

        
        rangeIndicator.classList.add(
            "visible"
        );


        // ======================================
        // FICHE DU SOLDAT
        // ======================================

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
        // POSITION ALÉATOIRE DANS LA ZONE ALLIÉE
        // ==========================================

        function getAlliedSpawnPosition() {

            const width =
                battlefield.clientWidth;

            const height =
                battlefield.clientHeight;


            if (
                !alliedSpawnWorld.initialized ||
                width <= 0 ||
                height <= 0
            ) {

                return {
                    x: 50,
                    y: 88
                };

            }


            const worldX =
                alliedSpawnWorld.minX +
                Math.random() *
                (
                    alliedSpawnWorld.maxX -
                    alliedSpawnWorld.minX
                );


            const worldY =
                alliedSpawnWorld.minY +
                Math.random() *
                (
                    alliedSpawnWorld.maxY -
                    alliedSpawnWorld.minY
                );


            const x =
                worldX /
                width *
                100;

            const y =
                worldY /
                height *
                100;


            return {
                x: x,
                y: y
            };

        }


        
        // ==========================================
        // APPARITION D'UN RENFORT
        // ==========================================

        function spawnReinforcement(
            type
        ) {

            const spawn =
                getAlliedSpawnPosition();


            const soldier =
                createSoldier(
                    spawn.x,
                    spawn.y,
                    type
                );


            console.log(
                "Renfort arrivé :",
                soldier.className
            );


            return soldier;

        }