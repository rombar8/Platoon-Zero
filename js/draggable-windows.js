// ==========================================
// Platoon Zero
// DRAGGABLE WINDOWS
// ==========================================


// ==========================================
// REND UNE FENÊTRE DÉPLAÇABLE
// ==========================================

function makeDraggable(
    windowElement,
    handleElement
) {

    if (
        !windowElement ||
        !handleElement
    ) {
        return;
    }


    let dragging = false;
    let pointerId = null;

    let offsetX = 0;
    let offsetY = 0;


    // ======================================
    // DÉBUT DU DRAG
    // ======================================

    handleElement.addEventListener(
        "pointerdown",

        function (event) {

            // Empêche le drag lorsqu'on
            // clique sur un bouton du header.

            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            const panelRect =
                windowElement
                    .getBoundingClientRect();


            // ==================================
            // FIX DU TRANSFORM CSS
            // ==================================

            // Le panneau tactique est centré
            // initialement avec translateX(-50%).
            //
            // Au premier drag on convertit sa
            // position actuelle en coordonnées
            // fixes réelles.

            const isFixed =
                window
                    .getComputedStyle(
                        windowElement
                    )
                    .position ===
                "fixed";


            if (isFixed) {

                windowElement.style.left =
                    panelRect.left + "px";

                windowElement.style.top =
                    panelRect.top + "px";

                windowElement.style.right =
                    "auto";

                windowElement.style.bottom =
                    "auto";

                windowElement.style.transform =
                    "none";
            }

            else {

                const parent =
                    windowElement.offsetParent;


                if (!parent) {
                    return;
                }


                const parentRect =
                    parent
                        .getBoundingClientRect();


                const currentLeft =
                    panelRect.left -
                    parentRect.left;


                const currentTop =
                    panelRect.top -
                    parentRect.top;


                windowElement.style.left =
                    currentLeft + "px";

                windowElement.style.top =
                    currentTop + "px";

                windowElement.style.right =
                    "auto";

                windowElement.style.bottom =
                    "auto";

                windowElement.style.transform =
                    "none";
            }


            // ==================================
            // OFFSET DU POINTEUR
            // ==================================

            offsetX =
                event.clientX -
                panelRect.left;


            offsetY =
                event.clientY -
                panelRect.top;


            dragging = true;

            pointerId =
                event.pointerId;


            windowElement.classList.add(
                "dragging"
            );


            // ==================================
            // CAPTURE DU POINTEUR
            // ==================================

            try {

                handleElement
                    .setPointerCapture(
                        pointerId
                    );

            }

            catch (error) {

                console.warn(
                    "Pointer capture impossible.",
                    error
                );
            }
        }
    );


    // ======================================
    // DÉPLACEMENT
    // ======================================

    handleElement.addEventListener(
        "pointermove",

        function (event) {

            if (!dragging) {
                return;
            }


            if (
                event.pointerId !==
                pointerId
            ) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            const position =
                window
                    .getComputedStyle(
                        windowElement
                    )
                    .position;


            const panelWidth =
                windowElement.offsetWidth;


            const panelHeight =
                windowElement.offsetHeight;


            // ==================================
            // FENÊTRE FIXED
            // ==================================

            if (
                position === "fixed"
            ) {

                let newLeft =
                    event.clientX -
                    offsetX;


                let newTop =
                    event.clientY -
                    offsetY;


                // ==============================
                // LIMITES DE L'ÉCRAN
                // ==============================

                const maxLeft =
                    Math.max(
                        0,
                        window.innerWidth -
                        panelWidth
                    );


                const maxTop =
                    Math.max(
                        0,
                        window.innerHeight -
                        panelHeight
                    );


                newLeft =
                    Math.max(
                        0,
                        Math.min(
                            maxLeft,
                            newLeft
                        )
                    );


                newTop =
                    Math.max(
                        0,
                        Math.min(
                            maxTop,
                            newTop
                        )
                    );


                windowElement.style.left =
                    newLeft + "px";


                windowElement.style.top =
                    newTop + "px";


                return;
            }


            // ==================================
            // FENÊTRE ABSOLUTE
            // ==================================

            const parent =
                windowElement.offsetParent;


            if (!parent) {
                return;
            }


            const parentRect =
                parent
                    .getBoundingClientRect();


            let newLeft =
                event.clientX -
                parentRect.left -
                offsetX;


            let newTop =
                event.clientY -
                parentRect.top -
                offsetY;


            // ==================================
            // LIMITES DU PARENT
            // ==================================

            const maxLeft =
                Math.max(
                    0,
                    parent.clientWidth -
                    panelWidth
                );


            const maxTop =
                Math.max(
                    0,
                    parent.clientHeight -
                    panelHeight
                );


            newLeft =
                Math.max(
                    0,
                    Math.min(
                        maxLeft,
                        newLeft
                    )
                );


            newTop =
                Math.max(
                    0,
                    Math.min(
                        maxTop,
                        newTop
                    )
                );


            // ==================================
            // APPLICATION
            // ==================================

            windowElement.style.left =
                newLeft + "px";


            windowElement.style.top =
                newTop + "px";
        }
    );


    // ======================================
    // FIN DU DRAG
    // ======================================

    function stopDragging(
        event
    ) {

        if (!dragging) {
            return;
        }


        if (
            event &&
            pointerId !== null &&
            event.pointerId !==
                pointerId
        ) {
            return;
        }


        dragging = false;


        windowElement.classList.remove(
            "dragging"
        );


        if (
            pointerId !== null
        ) {

            try {

                if (
                    handleElement
                        .hasPointerCapture(
                            pointerId
                        )
                ) {

                    handleElement
                        .releasePointerCapture(
                            pointerId
                        );
                }

            }

            catch (error) {

                console.warn(
                    "Pointer release impossible.",
                    error
                );
            }
        }


        pointerId = null;
    }


    handleElement.addEventListener(
        "pointerup",
        stopDragging
    );


    handleElement.addEventListener(
        "pointercancel",
        stopDragging
    );


    handleElement.addEventListener(
        "lostpointercapture",

        function () {

            dragging = false;

            pointerId = null;


            windowElement.classList.remove(
                "dragging"
            );
        }
    );
}


// ==========================================
// FICHE SOLDAT
// ==========================================

const unitPanelWindow =
    document.querySelector(
        "#unit-panel"
    );


const unitPanelHandle =
    document.querySelector(
        ".unit-panel-header"
    );


makeDraggable(
    unitPanelWindow,
    unitPanelHandle
);


// ==========================================
// FENÊTRE TACTIQUE
// ==========================================

const tacticalPanelWindow =
    document.querySelector(
        "#tactical-panel"
    );


const tacticalPanelHandle =
    tacticalPanelWindow
        ?.querySelector(
            ".tactical-header"
        );


makeDraggable(
    tacticalPanelWindow,
    tacticalPanelHandle
);