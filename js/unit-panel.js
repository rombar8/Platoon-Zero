// ==========================================
// M&B MOBILE
// UNIT-PANEL.JS
// Fiche soldats + mitrailleuses
// ==========================================


// ==========================================
// OBJET ACTUEL AFFICHÉ
// ==========================================

let displayedMachineGun = null;


// ==========================================
// AFFICHER LA FICHE SOLDAT
// ==========================================

function showUnitPanel(soldier) {

    displayedMachineGun = null;


    const panel =
        document.querySelector("#unit-panel");

    const name =
        document.querySelector("#unit-name");

    const unitClass =
        document.querySelector("#unit-class");

    const hpText =
        document.querySelector("#unit-hp-text");

    const hpBar =
        document.querySelector("#unit-hp-bar");

    const kills =
        document.querySelector("#unit-kills");

    const damage =
        document.querySelector("#unit-damage");

    const range =
        document.querySelector("#unit-range");

    const machineGunStats =
        document.querySelector("#machinegun-stats");


    // ======================================
    // MODE SOLDAT
    // ======================================

    panel.classList.remove(
        "machinegun-mode",
        "machinegun-active",
        "machinegun-inactive"
    );


    if (machineGunStats) {

        machineGunStats.classList.add(
            "hidden"
        );
    }


    // ======================================
    // RÉAFFICHE LES ÉLÉMENTS SOLDAT
    // ======================================

    const hpContainer =
        document.querySelector(
            ".unit-hp-container"
        );

    if (hpContainer) {
        hpContainer.style.display = "";
    }


    if (kills && kills.parentElement) {
        kills.parentElement.style.display = "";
    }


    // ======================================
    // ICÔNE DE GRADE
    // ======================================

    let rankIcon =
        document.querySelector(
            "#unit-rank-icon"
        );


    if (!rankIcon) {

        rankIcon =
            document.createElement("img");

        rankIcon.id =
            "unit-rank-icon";

        name.parentNode.insertBefore(
            rankIcon,
            name
        );
    }


    rankIcon.style.display =
        "block";


    // ======================================
    // XP
    // ======================================

    let xpContainer =
        document.querySelector(
            "#unit-xp-container"
        );


    if (!xpContainer) {

        xpContainer =
            document.createElement("div");

        xpContainer.id =
            "unit-xp-container";


        const hpBarContainer =
            hpBar.parentElement;


        hpBarContainer.insertAdjacentElement(
            "afterend",
            xpContainer
        );
    }


    xpContainer.style.display =
        "";


    // ======================================
    // IDENTITÉ
    // ======================================

    const rankImages = {

        PVT: "private.png",
        PFC: "private-first-class.png",
        SPC: "specialist.png",
        CPL: "corporal.png",
        SGT: "sergeant.png",
        SSG: "staff-sergeant.png",
        SFC: "sergeant-first-class.png",
        WO1: "warrant-officer-1.png",
        CW2: "chief-warrant-officer-2.png",
        "2LT": "second-lieutenant.png"
    };


    const rankImage =
        rankImages[soldier.rank];


    if (rankImage) {

        rankIcon.src =
            "img/rangs/" +
            rankImage;

        rankIcon.alt =
            soldier.rank;

        rankIcon.style.display =
            "block";
    }

    else {

        rankIcon.removeAttribute(
            "src"
        );

        rankIcon.style.display =
            "none";
    }


    name.textContent =
        soldier.rank +
        ". " +
        soldier.name;


    unitClass.textContent =
        soldier.className.toUpperCase();


    // ======================================
    // VIE
    // ======================================

    hpText.textContent =
        Math.ceil(soldier.hp) +
        " / " +
        soldier.maxHp;


    const hpPercent =
        (soldier.hp / soldier.maxHp) *
        100;


    hpBar.style.width =
        hpPercent + "%";


    // ======================================
    // EXPÉRIENCE
    // ======================================

    const currentRankIndex =
        soldierRanks.findIndex(
            function (rankData) {

                return (
                    rankData.rank ===
                    soldier.rank
                );
            }
        );


    const nextRank =
        soldierRanks[
            currentRankIndex + 1
        ];


    if (nextRank) {

        const currentRank =
            soldierRanks[
                currentRankIndex
            ];


        const xpInCurrentRank =
            soldier.xp -
            currentRank.xp;


        const xpNeeded =
            nextRank.xp -
            currentRank.xp;


        const xpPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        xpInCurrentRank /
                        xpNeeded
                    ) * 100
                )
            );


        xpContainer.innerHTML = `
            <div class="unit-xp-header">

                <span>
                    XP
                </span>

                <span>
                    ${xpInCurrentRank} / ${xpNeeded}
                </span>

            </div>

            <div class="unit-xp-track">

                <div
                    class="unit-xp-bar"
                    style="width: ${xpPercent}%"
                ></div>

            </div>
        `;
    }

    else {

        xpContainer.innerHTML = `
            <div class="unit-xp-max">
                ★ GRADE MAXIMUM ★
            </div>
        `;
    }


    // ======================================
    // STATISTIQUES
    // ======================================

    kills.textContent =
        soldier.kills;

    damage.textContent =
        soldier.damage;

    range.textContent =
        soldier.range;


    // ======================================
    // COUVERTURE
    // ======================================

    let coverIndicator =
        document.querySelector(
            "#unit-cover"
        );


    if (!coverIndicator) {

        coverIndicator =
            document.createElement(
                "div"
            );

        coverIndicator.id =
            "unit-cover";

        panel.appendChild(
            coverIndicator
        );
    }


    coverIndicator.style.display =
        "";


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

    else if (
        typeof isSoldierInTrench ===
            "function" &&
        isSoldierInTrench(soldier)
    ) {

        coverName =
            "TRANCHÉE";
    }


    if (coverName) {

        coverIndicator.textContent =
            "🛡️ COUVERT — " +
            coverName;

        coverIndicator.classList.add(
            "active"
        );
    }

    else {

        coverIndicator.textContent =
            "⚠ AUCUNE COUVERTURE";

        coverIndicator.classList.remove(
            "active"
        );
    }


    // ======================================
    // AFFICHAGE
    // ======================================

    panel.classList.remove(
        "hidden"
    );
}

// ==========================================
// AFFICHER LA FICHE MITRAILLEUSE
// ==========================================

function showMachineGunPanel(
    defense
) {

    if (
        !defense ||
        defense.type !== "machinegun"
    ) {
        return;
    }


    displayedMachineGun =
        defense;


    const panel =
        document.querySelector(
            "#unit-panel"
        );

    const name =
        document.querySelector(
            "#unit-name"
        );

    const unitClass =
        document.querySelector(
            "#unit-class"
        );

    const machineGunStats =
        document.querySelector(
            "#machinegun-stats"
        );


    // ======================================
    // MODE MITRAILLEUSE
    // ======================================

    panel.classList.add(
        "machinegun-mode"
    );


    // ======================================
    // MASQUE LES ÉLÉMENTS SOLDAT
    // ======================================

    const rankIcon =
        document.querySelector(
            "#unit-rank-icon"
        );

    if (rankIcon) {

        rankIcon.style.display =
            "none";
    }


    const hpContainer =
        document.querySelector(
            ".unit-hp-container"
        );

    if (hpContainer) {

        hpContainer.style.display =
            "none";
    }


    const xpContainer =
        document.querySelector(
            "#unit-xp-container"
        );

    if (xpContainer) {

        xpContainer.style.display =
            "none";
    }


    const kills =
        document.querySelector(
            "#unit-kills"
        );

    if (
        kills &&
        kills.parentElement
    ) {

        kills.parentElement.style.display =
            "none";
    }


    const coverIndicator =
        document.querySelector(
            "#unit-cover"
        );

    if (coverIndicator) {

        coverIndicator.style.display =
            "none";
    }


    // ======================================
    // IDENTITÉ MG
    // ======================================

    name.textContent =
        "MITRAILLEUSE";


    unitClass.textContent =
        "DÉFENSE STATIQUE";


    // ======================================
    // RÉUTILISE DÉGÂTS + PORTÉE
    // ======================================

    const damage =
        document.querySelector(
            "#unit-damage"
        );

    const range =
        document.querySelector(
            "#unit-range"
        );


    if (damage) {

        damage.textContent =
            defense.damage;
    }


    if (range) {

        range.textContent =
            defense.range;
    }


    // ======================================
    // AFFICHE LES STATS MG
    // ======================================

    if (machineGunStats) {

        machineGunStats.classList.remove(
            "hidden"
        );
    }


    // ======================================
    // PREMIÈRE ACTUALISATION
    // ======================================

    updateMachineGunPanel();


    // ======================================
    // AFFICHAGE
    // ======================================

    panel.classList.remove(
        "hidden"
    );
}


// ==========================================
// ACTUALISATION DE LA FICHE MG
// ==========================================

function updateMachineGunPanel() {

    if (!displayedMachineGun) {
        return;
    }


    const defense =
        displayedMachineGun;


    const panel =
        document.querySelector(
            "#unit-panel"
        );


    if (
        !panel ||
        panel.classList.contains(
            "hidden"
        )
    ) {
        return;
    }


    // ======================================
    // ÉLÉMENTS
    // ======================================

    const status =
        document.querySelector(
            "#mg-panel-status"
        );

    const operator =
        document.querySelector(
            "#mg-panel-operator"
        );

    const fireRate =
        document.querySelector(
            "#mg-panel-firerate"
        );

    const protection =
        document.querySelector(
            "#mg-panel-protection"
        );

    const target =
        document.querySelector(
            "#mg-panel-target"
        );

    const damage =
        document.querySelector(
            "#unit-damage"
        );

    const range =
        document.querySelector(
            "#unit-range"
        );


    // ======================================
    // DÉGÂTS / PORTÉE
    // ======================================

    if (damage) {

        damage.textContent =
            defense.damage;
    }


    if (range) {

        range.textContent =
            defense.range;
    }


    // ======================================
    // CADENCE
    // ======================================

    if (fireRate) {

        fireRate.textContent =
            defense.fireRate +
            " ms";
    }


    // ======================================
    // PROTECTION
    // ======================================

    if (protection) {

        protection.textContent =
            Math.round(
                (
                    defense.protection ||
                    0
                ) * 100
            ) +
            " %";
    }


    // ======================================
    // OPÉRATEUR
    // ======================================

    const soldier =
        defense.operator;


    if (
        operator &&
        soldier &&
        soldier.alive
    ) {

        operator.textContent =
            (
                soldier.rank
                    ? soldier.rank + ". "
                    : ""
            ) +
            soldier.name;
    }

    else if (operator) {

        operator.textContent =
            "AUCUN";
    }


    // ======================================
    // ÉTAT
    // ======================================

    let ready =
        false;


    if (
        soldier &&
        soldier.alive &&
        typeof isMachineGunOperatorReady ===
            "function"
    ) {

        ready =
            isMachineGunOperatorReady(
                defense
            );
    }


    panel.classList.remove(
        "machinegun-active",
        "machinegun-inactive"
    );


    if (
        soldier &&
        soldier.alive &&
        ready
    ) {

        if (status) {

            status.textContent =
                "ACTIVE";
        }


        panel.classList.add(
            "machinegun-active"
        );
    }

    else if (
        soldier &&
        soldier.alive
    ) {

        if (status) {

            status.textContent =
                "OPÉRATEUR EN ROUTE";
        }


        panel.classList.add(
            "machinegun-inactive"
        );
    }

    else {

        if (status) {

            status.textContent =
                "SANS OPÉRATEUR";
        }


        panel.classList.add(
            "machinegun-inactive"
        );
    }


    // ======================================
    // CIBLE ACTUELLE
    // ======================================

    if (target) {

        if (
            defense.target &&
            defense.target.alive
        ) {

            target.textContent =
                defense.target.name ||
                defense.target.type ||
                "ENNEMI";
        }

        else {

            target.textContent =
                "AUCUNE";
        }
    }
}


// ==========================================
// CACHER LA FICHE
// ==========================================

function hideUnitPanel() {

    const panel =
        document.querySelector(
            "#unit-panel"
        );


    panel.classList.add(
        "hidden"
    );


    panel.classList.remove(
        "machinegun-mode",
        "machinegun-active",
        "machinegun-inactive"
    );


    displayedMachineGun =
        null;
}


// ==========================================
// BOUTON FERMER
// ==========================================

const closeUnitPanelButton =
    document.querySelector(
        "#close-unit-panel"
    );


closeUnitPanelButton.addEventListener(
    "click",

    function () {

        hideUnitPanel();


        // ==================================
        // ANCIENNE MULTI-SÉLECTION
        // COMPATIBILITÉ
        // ==================================

        if (
            typeof selectedSoldiers !==
                "undefined"
        ) {

            selectedSoldiers.forEach(
                function (soldier) {

                    if (
                        soldier &&
                        soldier.element
                    ) {

                        soldier.element
                            .classList
                            .remove(
                                "selected"
                            );
                    }
                }
            );


            selectedSoldiers.length =
                0;
        }


        // ==================================
        // SÉLECTION SIMPLE
        // ==================================

        if (
            typeof selectedSoldier !==
                "undefined" &&
            selectedSoldier !== null
        ) {

            if (
                selectedSoldier.element
            ) {

                selectedSoldier.element
                    .classList
                    .remove(
                        "selected"
                    );
            }


            selectedSoldier =
                null;
        }
    }
);


// ==========================================
// ACTUALISATION LIVE DE LA FICHE MG
// ==========================================

setInterval(
    function () {

        if (
            displayedMachineGun
        ) {

            updateMachineGunPanel();
        }

    },
    150
);