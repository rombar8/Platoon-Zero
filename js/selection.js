    // ==========================================
    // Platoon Zero
    // SELECTION.JS
    // Sélection multiple par rectangle
    // ==========================================

    let selectionStartX = 0;
    let selectionStartY = 0;

    let selectionDragging = false;
    let suppressNextBattlefieldClick = false;


    const selectionBox =
        document.createElement(
            "div"
        );

    selectionBox.classList.add(
        "selection-box"
    );

    battlefield.appendChild(
        selectionBox
    );


    // ==========================================
    // DÉBUT DE SÉLECTION
    // ==========================================

    battlefield.addEventListener(
        "pointerdown",

        function (event) {

            if (event.button !== 0) {
                return;
            }


            // Si on clique directement sur un soldat,
            // on laisse units.js gérer le clic.
            if (
                event.target.closest(
                    ".soldier"
                )
            ) {
                return;
            }


            const rect =
                battlefield.getBoundingClientRect();


            selectionStartX =
                event.clientX -
                rect.left;

            selectionStartY =
                event.clientY -
                rect.top;


            selectionDragging =
                false;


            selectionBox.style.left =
                selectionStartX + "px";

            selectionBox.style.top =
                selectionStartY + "px";

            selectionBox.style.width =
                "0px";

            selectionBox.style.height =
                "0px";
        }
    );


    // ==========================================
    // DÉPLACEMENT DU RECTANGLE
    // ==========================================

    battlefield.addEventListener(
        "pointermove",

        function (event) {

            if (
                event.buttons !== 1
            ) {
                return;
            }


            const rect =
                battlefield.getBoundingClientRect();


            const currentX =
                Math.max(
                    0,
                    Math.min(
                        rect.width,
                        event.clientX -
                            rect.left
                    )
                );


            const currentY =
                Math.max(
                    0,
                    Math.min(
                        rect.height,
                        event.clientY -
                            rect.top
                    )
                );


            const width =
                Math.abs(
                    currentX -
                    selectionStartX
                );

            const height =
                Math.abs(
                    currentY -
                    selectionStartY
                );


            // Évite qu'un simple clic
            // soit considéré comme un rectangle.
            if (
                width < 6 &&
                height < 6
            ) {
                return;
            }


            selectionDragging =
                true;


            const left =
                Math.min(
                    selectionStartX,
                    currentX
                );

            const top =
                Math.min(
                    selectionStartY,
                    currentY
                );


            selectionBox.style.left =
                left + "px";

            selectionBox.style.top =
                top + "px";

            selectionBox.style.width =
                width + "px";

            selectionBox.style.height =
                height + "px";


            selectionBox.classList.add(
                "visible"
            );
        }
    );


    // ==========================================
    // FIN DE SÉLECTION
    // ==========================================

    battlefield.addEventListener(
        "pointerup",

        function () {

            if (!selectionDragging) {
                return;
            }


            const boxRect =
                selectionBox
                    .getBoundingClientRect();


            selectedSoldiers.length =
                0;


            soldiers.forEach(
                function (soldier) {

                    if (
                        soldier.alive === false
                    ) {
                        return;
                    }


                    const soldierRect =
                        soldier.element
                            .getBoundingClientRect();


                    const centerX =
                        soldierRect.left +
                        soldierRect.width / 2;

                    const centerY =
                        soldierRect.top +
                        soldierRect.height / 2;


                    const inside =
                        centerX >=
                            boxRect.left &&
                        centerX <=
                            boxRect.right &&
                        centerY >=
                            boxRect.top &&
                        centerY <=
                            boxRect.bottom;


                    soldier.element
                        .classList
                        .toggle(
                            "selected",
                            inside
                        );


                    const range =
                        soldier.element
                            .querySelector(
                                ".soldier-range-indicator"
                            );


                    if (range) {

                        range.classList.remove(
                            "visible"
                        );
                    }


                    if (inside) {

                        selectedSoldiers.push(
                            soldier
                        );
                    }
                }
            );


            // ==================================
            // AUCUN SOLDAT
            // ==================================

            if (
                selectedSoldiers.length === 0
            ) {

                selectedSoldier =
                    null;

                hideUnitPanel();
            }


            // ==================================
            // UN SEUL SOLDAT
            // ==================================

            else if (
                selectedSoldiers.length === 1
            ) {

                selectedSoldier =
                    selectedSoldiers[0];


                const range =
                    selectedSoldier.element
                        .querySelector(
                            ".soldier-range-indicator"
                        );


                if (range) {

                    range.classList.add(
                        "visible"
                    );
                }


                showUnitPanel(
                    selectedSoldier
                );
            }


            // ==================================
            // PLUSIEURS SOLDATS
            // ==================================

            else {

                selectedSoldier =
                    selectedSoldiers[0];

                hideUnitPanel();
            }


            selectionBox.classList.remove(
                "visible"
            );


            selectionDragging =
                false;

            suppressNextBattlefieldClick =
                true;
        }
    );


    // ==========================================
    // EMPÊCHE LE DRAG DE DONNER
    // UN ORDRE DE DÉPLACEMENT
    // ==========================================

    battlefield.addEventListener(
        "click",

        function (event) {

            if (
                !suppressNextBattlefieldClick
            ) {
                return;
            }


            event.preventDefault();
            event.stopImmediatePropagation();


            suppressNextBattlefieldClick =
                false;
        },

        true
    );