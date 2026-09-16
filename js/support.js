// ==========================================
// M&B MOBILE
// SUPPORT.JS
// Grenade / Mortier / Ravitaillement
// Timers compatibles avec la pause
// ==========================================


// ==========================================
// ÉTAT
// ==========================================

let activeSupport = null;

const pendingSupports = [];


// ==========================================
// CONFIGURATION
// ==========================================

const supportConfig = {

    grenade: {
        damage: 55,
        radius: 65
    },

    mortar: {
        damage: 100,
        radius: 95,
        delay: 1000
    },

    supply: {
        heal: 45,
        radius: 90,
        delay: 1200,
        duration: 4000
    }

};


// ==========================================
// ACTIVER UN SOUTIEN
// ==========================================

function activateSupport(type) {

    if (!supportConfig[type]) {
        return;
    }

    activeSupport = type;

    battlefield.classList.add(
        "support-targeting"
    );

    console.log(
        "Soutien sélectionné :",
        type
    );

}


// ==========================================
// ANNULER LE MODE CIBLAGE
// ==========================================

function cancelSupportTargeting() {

    activeSupport = null;

    battlefield.classList.remove(
        "support-targeting"
    );

}


// ==========================================
// CLIC SUR LE TERRAIN
// ==========================================

battlefield.addEventListener(
    "click",
    function (event) {

        if (
            !activeSupport ||
            gamePaused ||
            gameOver
        ) {
            return;
        }


        event.preventDefault();

        event.stopImmediatePropagation();


        const rect =
            battlefield.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        const support =
            activeSupport;


        cancelSupportTargeting();


        // ==================================
        // GRENADE
        // ==================================

        if (support === "grenade") {

            useGrenade(
                x,
                y
            );

        }


        // ==================================
        // MORTIER
        // ==================================

        if (support === "mortar") {

            useMortar(
                x,
                y
            );

        }


        // ==================================
        // RAVITAILLEMENT
        // ==================================

        if (support === "supply") {

            useSupply(
                x,
                y
            );

        }

    },

    true
);


// ==========================================
// GRENADE
// ==========================================

function useGrenade(x, y) {

    createExplosion(
        x,
        y,
        supportConfig.grenade.radius
    );


    damageEnemiesInRadius(
        x,
        y,
        supportConfig.grenade.radius,
        supportConfig.grenade.damage
    );

}


// ==========================================
// MORTIER
// ==========================================

function useMortar(x, y) {

    const marker =
        createTargetMarker(
            x,
            y
        );


    pendingSupports.push({

        type: "mortar",

        x: x,
        y: y,

        timer:
            supportConfig.mortar.delay,

        element:
            marker

    });

}


// ==========================================
// RAVITAILLEMENT
// ==========================================

function useSupply(x, y) {

    const marker =
        createSupplyMarker(
            x,
            y
        );


    pendingSupports.push({

        type: "supply",

        phase: "incoming",

        x: x,
        y: y,

        timer:
            supportConfig.supply.delay,

        element:
            marker

    });

}


// ==========================================
// UPDATE SUPPORTS
// ==========================================

function updateSupports(deltaTime) {

    const deltaMilliseconds =
        deltaTime * 1000;


    for (
        let i =
            pendingSupports.length - 1;

        i >= 0;

        i--
    ) {

        const support =
            pendingSupports[i];


        support.timer -=
            deltaMilliseconds;


        if (support.timer > 0) {
            continue;
        }


        // ==================================
        // MORTIER
        // ==================================

        if (
            support.type ===
            "mortar"
        ) {

            if (support.element) {

                support.element.remove();

            }


            createExplosion(
                support.x,
                support.y,
                supportConfig.mortar.radius
            );


            damageEnemiesInRadius(
                support.x,
                support.y,
                supportConfig.mortar.radius,
                supportConfig.mortar.damage
            );


            pendingSupports.splice(
                i,
                1
            );


            continue;

        }


        // ==================================
        // RAVITAILLEMENT ARRIVE
        // ==================================

        if (
            support.type ===
            "supply" &&
            support.phase ===
            "incoming"
        ) {

            if (support.element) {

                support.element.remove();

            }


            const crate =
                createSupplyCrate(
                    support.x,
                    support.y
                );


            healSoldiersInRadius(
                support.x,
                support.y,
                supportConfig.supply.radius,
                supportConfig.supply.heal
            );


            support.phase =
                "landed";


            support.timer =
                supportConfig.supply.duration;


            support.element =
                crate;


            continue;

        }


        // ==================================
        // CAISSE DISPARAÎT
        // ==================================

        if (
            support.type ===
            "supply" &&
            support.phase ===
            "landed"
        ) {

            if (support.element) {

                support.element.remove();

            }


            pendingSupports.splice(
                i,
                1
            );

        }

    }

}


// ==========================================
// DÉGÂTS DE ZONE
// ==========================================

function damageEnemiesInRadius(
    x,
    y,
    radius,
    damage
) {

    const targets =
        [...enemies];


    targets.forEach(
        function (enemy) {

            if (
                !enemy ||
                !enemy.alive
            ) {
                return;
            }


            const dx =
                enemy.x - x;

            const dy =
                enemy.y - y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance <= radius
            ) {

                damageUnit(
                    enemy,
                    damage,
                    null
                );

            }

        }
    );

}


// ==========================================
// SOIN DE ZONE
// ==========================================

function healSoldiersInRadius(
    x,
    y,
    radius,
    heal
) {

    soldiers.forEach(
        function (soldier) {

            if (
                !soldier ||
                !soldier.alive
            ) {
                return;
            }


            const dx =
                soldier.x - x;

            const dy =
                soldier.y - y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance >
                radius
            ) {
                return;
            }


            soldier.hp =
                Math.min(
                    soldier.maxHp,
                    soldier.hp + heal
                );


            if (
                selectedSoldier ===
                soldier &&
                typeof showUnitPanel ===
                "function"
            ) {

                showUnitPanel(
                    soldier
                );

            }

        }
    );

}


// ==========================================
// EXPLOSION
// ==========================================

function createExplosion(
    x,
    y,
    radius
) {

    const explosion =
        document.createElement(
            "div"
        );


    explosion.className =
        "support-explosion";


    explosion.style.left =
        x + "px";


    explosion.style.top =
        y + "px";


    explosion.style.width =
        radius * 2 + "px";


    explosion.style.height =
        radius * 2 + "px";


    battlefield.appendChild(
        explosion
    );


    /*
        Cet élément est uniquement visuel.

        On utilise animationend plutôt qu'un
        setTimeout de gameplay.
    */

    explosion.addEventListener(
        "animationend",
        function () {

            explosion.remove();

        },

        {
            once: true
        }
    );

}


// ==========================================
// CIBLE MORTIER
// ==========================================

function createTargetMarker(
    x,
    y
) {

    const marker =
        document.createElement(
            "div"
        );


    marker.className =
        "mortar-marker";


    marker.style.left =
        x + "px";


    marker.style.top =
        y + "px";


    battlefield.appendChild(
        marker
    );


    return marker;

}


// ==========================================
// CIBLE RAVITAILLEMENT
// ==========================================

function createSupplyMarker(
    x,
    y
) {

    const marker =
        document.createElement(
            "div"
        );


    marker.className =
        "supply-marker";


    marker.style.left =
        x + "px";


    marker.style.top =
        y + "px";


    battlefield.appendChild(
        marker
    );


    return marker;

}


// ==========================================
// CAISSE
// ==========================================

function createSupplyCrate(
    x,
    y
) {

    const crate =
        document.createElement(
            "div"
        );


    crate.className =
        "supply-crate";


    crate.style.left =
        x + "px";


    crate.style.top =
        y + "px";


    crate.textContent =
        "✚";


    battlefield.appendChild(
        crate
    );


    return crate;

}

// ==========================================
// RESET DES SOUTIENS
// ==========================================

function resetSupports() {

    activeSupport = null;

    battlefield.classList.remove(
        "support-targeting"
    );

    pendingSupports.forEach(
        function (support) {

            if (support.element) {
                support.element.remove();
            }

        }
    );

    pendingSupports.length = 0;


    // Nettoyage de sécurité des effets visuels

    battlefield
        .querySelectorAll(
            ".support-explosion, " +
            ".mortar-marker, " +
            ".supply-marker, " +
            ".supply-crate"
        )
        .forEach(
            function (element) {

                element.remove();

            }
        );
}