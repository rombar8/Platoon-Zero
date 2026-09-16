// ==========================================
// M&B MOBILE
// ORDERS.JS
// Ordres tactiques
// ==========================================


// ==========================================
// TENIR POSITION
// ==========================================

function orderHoldPosition() {

    if (!selectedSoldier) {

        console.log(
            "Aucun soldat sélectionné."
        );

        return;
    }


    const soldier =
        selectedSoldier;


    soldier.order =
        "hold";


    // Stop immédiat

    soldier.targetX =
        soldier.x;

    soldier.targetY =
        soldier.y;


    console.log(
        soldier.name +
        " : TENIR POSITION"
    );


    showOrderIndicator(
        soldier,
        "⚑"
    );

}


// ==========================================
// FEU À VOLONTÉ
// ==========================================

function orderFireAtWill() {

    if (!selectedSoldier) {

        console.log(
            "Aucun soldat sélectionné."
        );

        return;
    }


    const soldier =
        selectedSoldier;


    // Retour au comportement normal

    soldier.order =
        "fire";


    console.log(
        soldier.name +
        " : FEU À VOLONTÉ"
    );


    showOrderIndicator(
        soldier,
        "🎯"
    );

}


// ==========================================
// REPLI
// ==========================================

function orderRetreat() {

    if (!selectedSoldier) {

        console.log(
            "Aucun soldat sélectionné."
        );

        return;
    }


    const soldier =
        selectedSoldier;


    soldier.order =
        "retreat";


    const rect =
        battlefield
            .getBoundingClientRect();


    // Garde approximativement
    // sa position horizontale.

    soldier.targetX =
        Math.max(
            20,
            Math.min(
                rect.width - 20,
                soldier.x
            )
        );


    // Retour vers le bas du terrain.

    soldier.targetY =
        rect.height - 35;


    console.log(
        soldier.name +
        " : REPLI"
    );


    showOrderIndicator(
        soldier,
        "↙"
    );

}


// ==========================================
// INDICATEUR VISUEL
// ==========================================

function showOrderIndicator(
    soldier,
    symbol
) {

    const indicator =
        document.createElement(
            "div"
        );


    indicator.classList.add(
        "order-indicator"
    );


    indicator.textContent =
        symbol;


    indicator.style.left =
        soldier.x + "px";


    indicator.style.top =
        soldier.y + "px";


    battlefield.appendChild(
        indicator
    );


    setTimeout(
        function () {

            indicator.remove();

        },

        900
    );

}