// ==========================================
// M&B MOBILE
// TACTICAL-MENU.JS
// Gestion du menu tactique
// ==========================================


// ==========================================
// OUVERTURE DU MENU
// ==========================================

function openTacticalMenu(menuName) {

    const menu =
        tacticalMenus[menuName];


    if (!menu) {

        console.error(
            "Menu tactique inconnu :",
            menuName
        );

        return;
    }


    // ======================================
    // TITRE
    // ======================================

    tacticalTitle.textContent =
        menu.title;


    // ======================================
    // NETTOYAGE
    // ======================================

    tacticalContent.innerHTML =
        "";


    // ======================================
    // CRÉATION DES OPTIONS
    // ======================================

    menu.options.forEach(
        function (option) {

            const button =
                document.createElement(
                    "button"
                );


            button.classList.add(
                "tactical-option"
            );


            // ==================================
            // CONTENU DU BOUTON
            // ==================================

            button.innerHTML = `

                <span class="tactical-icon">
                    ${option.icon}
                </span>

                <span class="tactical-info">

                    <strong>
                        ${option.name}
                    </strong>

                    <small>
                        ${option.description}
                    </small>

                </span>

                <span class="tactical-cost">
                    ${option.cost}
                </span>

            `;


            // ==================================
            // PAS ASSEZ DE POINTS
            // ==================================

            if (
                option.cost >
                commandPoints
            ) {

                button.disabled =
                    true;

            }


            // ==================================
            // CLIC SUR UNE OPTION
            // ==================================

            button.addEventListener(
                "click",
                function () {

                    buyTacticalOption(
                        option
                    );

                }
            );


            tacticalContent.appendChild(
                button
            );

        }
    );


    // ======================================
    // AFFICHAGE
    // ======================================

    tacticalPanel.classList.remove(
        "hidden"
    );

}


// ==========================================
// ACHETER / UTILISER UNE OPTION
// ==========================================

function buyTacticalOption(option) {

    // ======================================
    // VÉRIFICATION DES POINTS
    // ======================================

    if (
        commandPoints <
        option.cost
    ) {

        console.log(
            "Pas assez de points."
        );

        return;
    }


    // ======================================
    // PAIEMENT
    // ======================================

    commandPoints -=
        option.cost;


    updatePoints();


    // ======================================
    // RENFORTS
    // ======================================

    if (option.type) {

        spawnReinforcement(
            option.type
        );


        closeTacticalMenu();

        return;
    }


    // ======================================
    // GRENADE
    // ======================================

    if (
        option.name ===
        "GRENADE"
    ) {

        activateSupport(
            "grenade"
        );


        closeTacticalMenu();

        return;
    }


    // ======================================
    // MORTIER
    // ======================================

    if (
        option.name ===
        "MORTIER"
    ) {

        activateSupport(
            "mortar"
        );


        closeTacticalMenu();

        return;
    }


    // ======================================
    // RAVITAILLEMENT
    // ======================================

    if (
        option.name ===
        "RAVITAILLEMENT"
    ) {

        activateSupport(
            "supply"
        );


        closeTacticalMenu();

        return;
    }


    // ======================================
    // TENIR POSITION
    // ======================================
    if (
        option.name ===
        "TENIR POSITION"
    ) {

        orderHoldPosition();

        closeTacticalMenu();

        return;
    }


    // ======================================
    // FEU À VOLONTÉ
    // ======================================

    if (
        option.name ===
        "FEU À VOLONTÉ"
    ) {

        orderFireAtWill();

        closeTacticalMenu();

        return;
    }


    // ======================================
    // REPLI
    // ======================================

    if (
        option.name ===
        "REPLI"
    ) {

        orderRetreat();

        closeTacticalMenu();

        return;
    }


    // ======================================
    // OPTION INCONNUE
    // ======================================

    console.warn(
        "Option tactique non gérée :",
        option.name
    );


    closeTacticalMenu();

}


// ==========================================
// FERMER LE MENU
// ==========================================

function closeTacticalMenu() {

    tacticalPanel.classList.add(
        "hidden"
    );

}


// ==========================================
// BOUTONS DE LA BARRE DE COMMANDES
// ==========================================

commandButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const menuName =
                    button.dataset.menu;


                if (!menuName) {
                    return;
                }


                openTacticalMenu(
                    menuName
                );

            }
        );

    }
);


// ==========================================
// BOUTON FERMER
// ==========================================

closeTacticalButton.addEventListener(
    "click",
    closeTacticalMenu
);