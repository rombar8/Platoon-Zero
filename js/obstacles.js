// ==========================================
// M&B MOBILE
// OBSTACLES.JS
// Obstacles solides du champ de bataille
// ==========================================

const obstacles = [];


// ==========================================
// CRÉER UN OBSTACLE
// ==========================================

function createObstacle(
    x,
    y,
    width,
    height,
    type = "building"
) {

    const obstacle = {
        x,
        y,
        width,
        height,
        type,
        blocksMovement: true,
        blocksShots: true
    };

    obstacles.push(obstacle);

    return obstacle;
}


// ==========================================
// COLLISION AVEC UN POINT
// ==========================================

function isPointInsideObstacle(
    x,
    y,
    margin = 0
) {

    return obstacles.some(
        function (obstacle) {

            if (!obstacle.blocksMovement) {
                return false;
            }

            return (
                x >= obstacle.x - margin &&
                x <= obstacle.x + obstacle.width + margin &&
                y >= obstacle.y - margin &&
                y <= obstacle.y + obstacle.height + margin
            );
        }
    );
}


// ==========================================
// COLLISION D'UNE UNITÉ
// ==========================================

function isUnitBlockedByObstacle(
    x,
    y
) {

    const unitRadius = 17;

    return isPointInsideObstacle(
        x,
        y,
        unitRadius
    );
}
    
        // ==========================================
        // DÉTECTION ANTICIPÉE POUR L'IA
        // ==========================================

        function isEnemyPathNearObstacle(
            x,
            y
        ) {

            const detectionRadius =
                40;


            return obstacles.some(
                function (obstacle) {

                    if (
                        !obstacle.blocksMovement
                    ) {

                        return false;

                    }


                    return (
                        x >=
                            obstacle.x -
                            detectionRadius &&

                        x <=
                            obstacle.x +
                            obstacle.width +
                            detectionRadius &&

                        y >=
                            obstacle.y -
                            detectionRadius &&

                        y <=
                            obstacle.y +
                            obstacle.height +
                            detectionRadius
                    );

                }
            );

        }

        // ==========================================
        // CRÉER LE VISUEL D'UN OBSTACLE
        // ==========================================

        function createObstacleElement(
            obstacle
        ) {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "map-obstacle " +
                obstacle.type;

            element.style.left =
                obstacle.x + "px";

            element.style.top =
                obstacle.y + "px";

            element.style.width =
                obstacle.width + "px";

            element.style.height =
                obstacle.height + "px";


        const battlefieldElement =
            document.querySelector(
                "#battlefield"
            );


        if (!battlefieldElement) {

            console.error(
                "Battlefield introuvable."
            );

            return;

        }


        battlefieldElement.appendChild(
            element
        );


            obstacle.element =
                element;

                return element;

        }


        // ==========================================
        // LIGNE DE VUE
        // ==========================================

        function isLineBlockedByObstacle(
            startX,
            startY,
            endX,
            endY
        ) {

            for (
                const obstacle
                of obstacles
            ) {

                if (!obstacle.blocksShots) {
                    continue;
                }


                const left =
                    obstacle.x;

                const right =
                    obstacle.x +
                    obstacle.width;

                const top =
                    obstacle.y;

                const bottom =
                    obstacle.y +
                    obstacle.height;


                // ==============================
                // TEST SEGMENT / RECTANGLE
                // ==============================

                if (
                    lineIntersectsRectangle(
                        startX,
                        startY,
                        endX,
                        endY,
                        left,
                        top,
                        right,
                        bottom
                    )
                ) {

                    return true;

                }

            }


            return false;

        }


        // ==========================================
        // SEGMENT CONTRE RECTANGLE
        // ==========================================

        function lineIntersectsRectangle(
            x1,
            y1,
            x2,
            y2,
            left,
            top,
            right,
            bottom
        ) {

            // Un point est déjà dans le bâtiment

            if (
                x1 >= left &&
                x1 <= right &&
                y1 >= top &&
                y1 <= bottom
            ) {

                return true;

            }


            if (
                x2 >= left &&
                x2 <= right &&
                y2 >= top &&
                y2 <= bottom
            ) {

                return true;

            }


            // Bord supérieur

            if (
                linesIntersect(
                    x1,
                    y1,
                    x2,
                    y2,
                    left,
                    top,
                    right,
                    top
                )
            ) {

                return true;

            }


            // Bord inférieur

            if (
                linesIntersect(
                    x1,
                    y1,
                    x2,
                    y2,
                    left,
                    bottom,
                    right,
                    bottom
                )
            ) {

                return true;

            }


            // Bord gauche

            if (
                linesIntersect(
                    x1,
                    y1,
                    x2,
                    y2,
                    left,
                    top,
                    left,
                    bottom
                )
            ) {

                return true;

            }


            // Bord droit

            if (
                linesIntersect(
                    x1,
                    y1,
                    x2,
                    y2,
                    right,
                    top,
                    right,
                    bottom
                )
            ) {

                return true;

            }


            return false;

        }


        // ==========================================
        // INTERSECTION DE DEUX SEGMENTS
        // ==========================================

        function linesIntersect(
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            dx,
            dy
        ) {

            const denominator =
                (
                    bx - ax
                ) *
                (
                    dy - cy
                ) -
                (
                    by - ay
                ) *
                (
                    dx - cx
                );


            if (
                Math.abs(
                    denominator
                ) < 0.000001
            ) {

                return false;

            }


            const t =
                (
                    (
                        cx - ax
                    ) *
                    (
                        dy - cy
                    ) -
                    (
                        cy - ay
                    ) *
                    (
                        dx - cx
                    )
                ) /
                denominator;


            const u =
                (
                    (
                        cx - ax
                    ) *
                    (
                        by - ay
                    ) -
                    (
                        cy - ay
                    ) *
                    (
                        bx - ax
                    )
                ) /
                denominator;


            return (
                t >= 0 &&
                t <= 1 &&
                u >= 0 &&
                u <= 1
            );

        }


        // ==========================================
        // RESET
        // ==========================================

        function resetObstacles() {

            obstacles.forEach(
                function (obstacle) {

                    if (obstacle.element) {

                        obstacle.element.remove();

                    }

                }
            );


            obstacles.length = 0;

        }