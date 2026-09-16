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
    let rankIcon =
    document.querySelector("#unit-rank-icon");

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

        let xpContainer =
            document.querySelector("#unit-xp-container");

        if (!xpContainer) {

            xpContainer =
                document.createElement("div");

            xpContainer.id =
                "unit-xp-container";

            const hpBar =
                document.querySelector("#unit-hp-bar");

            const hpBarContainer =
                hpBar.parentElement;

            hpBarContainer.insertAdjacentElement(
                "afterend",
                xpContainer
            );
        }


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

    rankIcon.src =
        "img/rangs/" +
        rankImages[soldier.rank];

    rankIcon.alt =
        soldier.rank;

    rankIcon.alt =

    soldier.rank;

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
    // EXPÉRIENCE / PROCHAIN GRADE
    // ======================================

    const currentRankIndex =
        soldierRanks.findIndex(
            function (rankData) {
                return rankData.rank === soldier.rank;
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
                    (xpInCurrentRank / xpNeeded) * 100
                )
            );

        xpContainer.innerHTML = `
            <div class="unit-xp-header">
                <span>XP</span>

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

    } else {

        // Grade maximum
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