// ==========================================
// M&B MOBILE
// UNIT-PANEL.JS
// Fiche d'information des soldats
// ==========================================


// ==========================================
// AFFICHER LA FICHE
// ==========================================

function showUnitPanel(soldier) {

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


    // ======================================
    // IDENTITÉ
    // ======================================

    name.textContent =
        soldier.rank + ". " + soldier.name;

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
        (soldier.hp / soldier.maxHp) * 100;

    hpBar.style.width =
        hpPercent + "%";


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

    // Création automatique si inexistant
    if (!coverIndicator) {

        coverIndicator =
            document.createElement("div");

        coverIndicator.id =
            "unit-cover";

        panel.appendChild(
            coverIndicator
        );
    }

    const inTrench =
        typeof isSoldierInTrench === "function" &&
        isSoldierInTrench(soldier);

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


    // ======================================
    // AFFICHAGE
    // ======================================

    panel.classList.remove(
        "hidden"
    );
}


// ==========================================
// CACHER LA FICHE
// ==========================================

function hideUnitPanel() {

    const panel =
        document.querySelector("#unit-panel");

    panel.classList.add(
        "hidden"
    );
}

const closeUnitPanelButton =
    document.querySelector(
        "#close-unit-panel"
    );


closeUnitPanelButton.addEventListener(
    "click",
    function () {

        hideUnitPanel();


        if (selectedSoldier !== null) {

            selectedSoldier.element
                .classList
                .remove("selected");

        }


        selectedSoldier = null;

    }
);