// ==========================================
// M&B MOBILE
// DRAGGABLE WINDOWS
// ==========================================

function makeDraggable(
    windowElement,
    handleElement
) {

    if (!windowElement || !handleElement) {
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

            if (
                event.target.closest("button")
            ) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            const parent =
                windowElement.offsetParent;


            if (!parent) {
                return;
            }


            const panelRect =
                windowElement
                    .getBoundingClientRect();


            const parentRect =
                parent
                    .getBoundingClientRect();


            // ==================================
            // POSITION ACTUELLE
            // RELATIVE AU PARENT
            // ==================================

            const currentLeft =
                panelRect.left -
                parentRect.left;


            const currentTop =
                panelRect.top -
                parentRect.top;


            // On passe proprement
            // de bottom/right à top/left

            windowElement.style.left =
                currentLeft + "px";

            windowElement.style.top =
                currentTop + "px";

            windowElement.style.right =
                "auto";

            windowElement.style.bottom =
                "auto";


            // ==================================
            // OFFSET DE LA SOURIS
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


            handleElement.setPointerCapture(
                pointerId
            );

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


            const parent =
                windowElement.offsetParent;


            if (!parent) {
                return;
            }


            const parentRect =
                parent
                    .getBoundingClientRect();


            const panelWidth =
                windowElement.offsetWidth;


            const panelHeight =
                windowElement.offsetHeight;


            // ==================================
            // POSITION RELATIVE AU PARENT
            // ==================================

            let newLeft =
                event.clientX -
                parentRect.left -
                offsetX;


            let newTop =
                event.clientY -
                parentRect.top -
                offsetY;


            // ==================================
            // LIMITES
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

    function stopDragging(event) {

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
            pointerId !== null &&
            handleElement.hasPointerCapture(
                pointerId
            )
        ) {

            handleElement.releasePointerCapture(
                pointerId
            );

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