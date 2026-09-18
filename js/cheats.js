// ==========================================
// M&B MOBILE
// CHEATS.JS
// DEV / CHEAT MENU
// ==========================================


const cheatState = {

    infinitePoints: false,
    godMode: false,
    freezeEnemies: false

};


// ==========================================
// CRÉATION DU MENU
// ==========================================

const cheatPanel =
    document.createElement("section");

cheatPanel.id =
    "cheat-panel";

cheatPanel.classList.add(
    "hidden"
);


cheatPanel.innerHTML = `

    <div class="cheat-header">

        <h2>
            🛠 DEV / CHEAT MENU
        </h2>

        <button id="close-cheats">
            ✕
        </button>

    </div>


    <div class="cheat-content">

        <button
            class="cheat-toggle"
            data-cheat="infinitePoints"
        >
            POINTS INFINIS
            <span>OFF</span>
        </button>


        <button
            class="cheat-toggle"
            data-cheat="godMode"
        >
            GOD MODE
            <span>OFF</span>
        </button>


        <button
            class="cheat-toggle"
            data-cheat="freezeEnemies"
        >
            FREEZE ENNEMIS
            <span>OFF</span>
        </button>


        <hr>


        <button id="cheat-add-points">
            +100 POINTS
        </button>


        <button id="cheat-heal-all">
            SOIGNER TOUS
        </button>


        <button id="cheat-kill-all">
            TUER TOUS LES ENNEMIS
        </button>

    </div>

`;


document.body.appendChild(
    cheatPanel
);


// ==========================================
// OUVRIR / FERMER
// ==========================================

function openCheatMenu() {

    cheatPanel.classList.remove(
        "hidden"
    );

}


function closeCheatMenu() {

    cheatPanel.classList.add(
        "hidden"
    );

}


function toggleCheatMenu() {

    cheatPanel.classList.toggle(
        "hidden"
    );

}


// ==========================================
// TOGGLES
// ==========================================

function toggleCheat(name) {

    if (
        !(name in cheatState)
    ) {
        return;
    }


    cheatState[name] =
        !cheatState[name];


    refreshCheatMenu();

}


// ==========================================
// ACTUALISE L'AFFICHAGE
// ==========================================

function refreshCheatMenu() {

    document
        .querySelectorAll(
            ".cheat-toggle"
        )
        .forEach(
            function (button) {

                const name =
                    button.dataset.cheat;

                const enabled =
                    cheatState[name];

                const state =
                    button.querySelector(
                        "span"
                    );


                state.textContent =
                    enabled
                        ? "ON"
                        : "OFF";


                button.classList.toggle(
                    "enabled",
                    enabled
                );

            }
        );

}


// ==========================================
// CLIC SUR TOGGLE
// ==========================================

document
    .querySelectorAll(
        ".cheat-toggle"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    toggleCheat(
                        button.dataset.cheat
                    );

                }
            );

        }
    );


// ==========================================
// +100 POINTS
// ==========================================

document
    .querySelector(
        "#cheat-add-points"
    )
    .addEventListener(
        "click",
        function () {

            commandPoints += 100;

            updatePoints();

        }
    );


// ==========================================
// SOIGNE TOUS LES SOLDATS
// ==========================================

document
    .querySelector(
        "#cheat-heal-all"
    )
    .addEventListener(
        "click",
        function () {

            soldiers.forEach(
                function (soldier) {

                    if (!soldier.alive) {
                        return;
                    }

                    soldier.hp =
                        soldier.maxHp;

                }
            );


            if (
                selectedSoldier &&
                typeof showUnitPanel ===
                    "function"
            ) {

                showUnitPanel(
                    selectedSoldier
                );

            }

        }
    );


// ==========================================
// TUE TOUS LES ENNEMIS
// ==========================================

document
    .querySelector(
        "#cheat-kill-all"
    )
    .addEventListener(
        "click",
        function () {

            enemies
                .slice()
                .forEach(
                    function (enemy) {

                        if (!enemy.alive) {
                            return;
                        }


                        damageUnit(
                            enemy,
                            enemy.hp + 999999,
                            null
                        );

                    }
                );

        }
    );


// ==========================================
// BOUTON FERMER
// ==========================================

document
    .querySelector(
        "#close-cheats"
    )
    .addEventListener(
        "click",
        closeCheatMenu
    );


// ==========================================
// RACCOURCI F8
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "F8"
        ) {

            event.preventDefault();

            toggleCheatMenu();

        }

    }
);


// ==========================================
// COMMANDES CONSOLE
// ==========================================

window.cheats = {


    // Ouvre le menu
    open() {

        openCheatMenu();

    },


    // Ferme le menu
    close() {

        closeCheatMenu();

    },


    // Ouvre / ferme
    toggle() {

        toggleCheatMenu();

    },


    // Points infinis
    points() {

        toggleCheat(
            "infinitePoints"
        );

        return cheatState.infinitePoints;

    },


    // God mode
    god() {

        toggleCheat(
            "godMode"
        );

        return cheatState.godMode;

    },


    // Freeze ennemis
    freeze() {

        toggleCheat(
            "freezeEnemies"
        );

        return cheatState.freezeEnemies;

    },


    // Ajoute des points
    addPoints(amount = 100) {

        commandPoints +=
            Number(amount) || 0;

        updatePoints();

        return commandPoints;

    },


    // Soigne tous les soldats
    healAll() {

        soldiers.forEach(
            function (soldier) {

                if (soldier.alive) {

                    soldier.hp =
                        soldier.maxHp;

                }

            }
        );


        if (
            selectedSoldier &&
            typeof showUnitPanel ===
                "function"
        ) {

            showUnitPanel(
                selectedSoldier
            );

        }

    },


    // Tue tous les ennemis
    killAll() {

        enemies
            .slice()
            .forEach(
                function (enemy) {

                    if (enemy.alive) {

                        damageUnit(
                            enemy,
                            enemy.hp + 999999,
                            null
                        );

                    }

                }
            );

    },


    // ======================================
    // XP DU SOLDAT SÉLECTIONNÉ
    // ======================================

    xp(amount = 500) {

        if (!selectedSoldier) {

            console.log(
                "CHEAT XP : sélectionne d'abord un soldat."
            );

            return;

        }


        const xpAmount =
            Number(amount);


        if (
            !Number.isFinite(xpAmount) ||
            xpAmount < 0
        ) {

            console.log(
                "CHEAT XP : valeur invalide."
            );

            return;

        }


        selectedSoldier.xp =
            xpAmount;


        // Vérifie le nouveau grade
        if (
            typeof updateSoldierRank ===
                "function"
        ) {

            updateSoldierRank(
                selectedSoldier
            );

        }


        // Actualise le panneau
        if (
            typeof showUnitPanel ===
                "function"
        ) {

            showUnitPanel(
                selectedSoldier
            );

        }


        console.log(
            `CHEAT XP : ${selectedSoldier.name} → ${xpAmount} XP → ${selectedSoldier.rank}`
        );


        return selectedSoldier.rank;

    },


    // Affiche l'état des cheats
    status() {

        console.table(
            cheatState
        );

        return cheatState;

    }

};


// ==========================================
// MESSAGE CONSOLE
// ==========================================

console.log(
    "🛠 M&B Cheat API chargée."
);


// ==========================================
// CHEAT MENU DRAGGABLE
// ==========================================

const cheatPanelHandle =
    cheatPanel.querySelector(
        ".cheat-header"
    );


if (
    typeof makeDraggable ===
        "function"
) {

    makeDraggable(
        cheatPanel,
        cheatPanelHandle
    );

}