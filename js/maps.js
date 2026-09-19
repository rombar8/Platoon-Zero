
        // ==========================================
        // M&B MOBILE
        // MAPS.JS
        // Gestion des cartes
        // ==========================================


        // ==========================================
        // NETTOYAGE VISUEL D'UNE CARTE
        // ==========================================

        function clearMapVisuals() {

            battlefield
                .querySelectorAll(
                    ".map-decoration"
                )
                .forEach(
                    function (element) {

                        element.remove();

                    }
                );

        }


        // ==========================================
        // CRÉATION D'UN ÉLÉMENT DE DÉCOR
        // ==========================================

        function createMapElement(
            className,
            x,
            y,
            width,
            height
        ) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "map-decoration " +
                className;


            element.style.left =
                x + "px";

            element.style.top =
                y + "px";

            element.style.width =
                width + "px";

            element.style.height =
                height + "px";


            battlefield.appendChild(
                element
            );


            return element;

        }


        // ==========================================
        // CRÉATION D'UN BÂTIMENT
        // ==========================================

        function createUrbanBuilding(
            x,
            y,
            width,
            height,
            variant = 1
        ) {

            const obstacle =
                createObstacle(
                    x,
                    y,
                    width,
                    height,
                    "building"
                );


            const element =
                createObstacleElement(
                    obstacle
                );


            if (element) {

                element.classList.add(
                    "urban-building",
                    "urban-building-" +
                        variant
                );

            }


            return obstacle;

        }


        // ==========================================
        // ROUTE
        // ==========================================

        function createUrbanRoad(
            x,
            y,
            width,
            height,
            direction = "vertical"
        ) {

            return createMapElement(
                "urban-road " +
                    direction,
                x,
                y,
                width,
                height
            );

        }


        // ==========================================
        // TROTTOIR
        // ==========================================

        function createUrbanSidewalk(
            x,
            y,
            width,
            height
        ) {

            return createMapElement(
                "urban-sidewalk",
                x,
                y,
                width,
                height
            );

        }


        // ==========================================
        // MARQUAGE ROUTIER
        // ==========================================

        function createRoadMarking(
            x,
            y,
            width,
            height,
            type = "line"
        ) {

            return createMapElement(
                "urban-marking " +
                    type,
                x,
                y,
                width,
                height
            );

        }


        // ==========================================
        // PASSAGE PIÉTON
        // ==========================================

        function createCrosswalk(
            x,
            y,
            width,
            height,
            direction = "horizontal"
        ) {

            return createMapElement(
                "urban-crosswalk " +
                    direction,
                x,
                y,
                width,
                height
            );

        }


        // ==========================================
        // PARKING
        // ==========================================

        function createParking(
            x,
            y,
            width,
            height
        ) {

            return createMapElement(
                "urban-parking",
                x,
                y,
                width,
                height
            );

        }


        // ==========================================
        // DÉTAIL DE TOIT
        // ==========================================

        function createRoofDetail(
            x,
            y,
            width,
            height,
            type = "vent"
        ) {

            return createMapElement(
                "urban-roof-detail " +
                    type,
                x,
                y,
                width,
                height
            );

        }


        // ==========================================
        // OBSTACLE URBAIN
        // Hitbox adaptée à l'orientation
        // ==========================================

        function createUrbanObstacle(
            x,
            y,
            width,
            height,
            type,
            rotation = 0
        ) {

            const normalizedRotation =
                (
                    (
                        rotation % 360
                    ) +
                    360
                ) %
                360;


            const isVertical =
                normalizedRotation === 90 ||
                normalizedRotation === 270;


            const collisionWidth =
                isVertical
                    ? height
                    : width;


            const collisionHeight =
                isVertical
                    ? width
                    : height;


            const obstacle =
                createObstacle(
                    x,
                    y,
                    collisionWidth,
                    collisionHeight,
                    type
                );


            const element =
                createObstacleElement(
                    obstacle
                );


            if (element) {

                element.classList.add(
                    "urban-prop",
                    "urban-" + type
                );


                element.style.width =
                    width + "px";

                element.style.height =
                    height + "px";


                element.style.left =
                    (
                        x +
                        (
                            collisionWidth -
                            width
                        ) /
                        2
                    ) +
                    "px";


                element.style.top =
                    (
                        y +
                        (
                            collisionHeight -
                            height
                        ) /
                        2
                    ) +
                    "px";


                element.style.transform =
                    `rotate(${rotation}deg)`;

            }


            return obstacle;

        }


        // ==========================================
        // VOITURE ABANDONNÉE
        // ==========================================

        function createAbandonedCar(
            x,
            y,
            rotation = 0
        ) {

            return createUrbanObstacle(
                x,
                y,
                58,
                28,
                "car",
                rotation
            );

        }


        // ==========================================
        // BARRICADE
        // ==========================================

        function createUrbanBarricade(
            x,
            y,
            rotation = 0
        ) {

            return createUrbanObstacle(
                x,
                y,
                65,
                18,
                "barricade",
                rotation
            );

        }


        // ==========================================
        // BENNE
        // ==========================================

        function createDumpster(
            x,
            y,
            rotation = 0
        ) {

            return createUrbanObstacle(
                x,
                y,
                48,
                30,
                "dumpster",
                rotation
            );

        }


        // ==========================================
        // DÉBRIS VISUEL
        // ==========================================

        function createUrbanDebris(
            x,
            y,
            size = 20,
            rotation = 0
        ) {

            const debris =
                createMapElement(
                    "urban-debris",
                    x,
                    y,
                    size,
                    size
                );


            debris.style.transform =
                `rotate(${rotation}deg)`;


            return debris;

        }


        // ==========================================
        // FISSURE DANS L'ASPHALTE
        // ==========================================

        function createRoadCrack(
            x,
            y,
            width,
            rotation = 0
        ) {

            const crack =
                createMapElement(
                    "urban-road-crack",
                    x,
                    y,
                    width,
                    3
                );


            crack.style.transform =
                `rotate(${rotation}deg)`;


            return crack;

        }


        
        // ==========================================
        // MAP 1 — ARBRE SOLIDE
        // ==========================================

        function createSolidTree(
            x,
            y,
            size = 52
        ) {

            // ======================================
            // HITBOX DU TRONC
            // ======================================

            const trunkSize =
                Math.max(
                    18,
                    size * 0.38
                );


            const obstacle =
                createObstacle(
                    x +
                        (
                            size -
                            trunkSize
                        ) / 2,
                    y +
                        (
                            size -
                            trunkSize
                        ) / 2,
                    trunkSize,
                    trunkSize,
                    "tree"
                );


            // ======================================
            // VISUEL DE L'ARBRE
            // ======================================

            const element =
                createObstacleElement(
                    obstacle
                );


            if (element) {

                element.classList.add(
                    "map1-tree"
                );


                element.style.left =
                    x + "px";

                element.style.top =
                    y + "px";

                element.style.width =
                    size + "px";

                element.style.height =
                    size + "px";

            }


            return obstacle;

        }

        
        // ==========================================
        // MAP 1 — GROS ROCHER SOLIDE
        // ==========================================

        function createSolidRock(
            x,
            y,
            size = 70
        ) {

            // Petite hitbox au centre du rocher
            const hitboxSize =
                Math.max(
                    24,
                    size * 0.38
                );


            const obstacle =
                createObstacle(
                    x +
                        (
                            size -
                            hitboxSize
                        ) / 2,
                    y +
                        (
                            size -
                            hitboxSize
                        ) / 2,
                    hitboxSize,
                    hitboxSize,
                    "rock"
                );

            
        obstacle.blocksMovement =
            false;

        obstacle.blocksShots =
            false;


            const element =
                createObstacleElement(
                    obstacle
                );


            if (
                element
            ) {

                element.classList.add(
                    "map1-solid-rock"
                );


                // Le VISUEL est plus grand
                // que la vraie hitbox.

                element.style.left =
                    x + "px";

                element.style.top =
                    y + "px";

                element.style.width =
                    size + "px";

                element.style.height =
                    size + "px";

            }


            return obstacle;

        }

        
        
        // ==========================================
        // MAP 1 — TRONC SOLIDE
        // Bloque les unités mais PAS les tirs
        // ==========================================

        function createSolidLog(
            x,
            y,
            width = 110,
            height = 42
        ) {

            const hitboxHeight =
                Math.max(
                    12,
                    height * 0.38
                );


            const obstacle =
                createObstacle(
                    x,
                    y +
                        (
                            height -
                            hitboxHeight
                        ) / 2,
                    width,
                    hitboxHeight,
                    "log"
                );


            obstacle.blocksMovement =
                true;

            obstacle.blocksShots =
                false;


            const element =
                createObstacleElement(
                    obstacle
                );


            if (
                element
            ) {

                element.classList.add(
                    "map1-solid-log"
                );

                element.style.left =
                    x + "px";

                element.style.top =
                    y + "px";

                element.style.width =
                    width + "px";

                element.style.height =
                    height + "px";

            }


            return obstacle;

        }


        // ==========================================
        // MAP 2 — ZONE URBAINE
        // ==========================================

        
        function buildUrbanMap() {

            clearMapVisuals();


            // ======================================
            // DIMENSIONS RÉELLES DU TERRAIN
            // ======================================

            const rect =
                battlefield
                    .getBoundingClientRect();


            const width =
                rect.width ||
                battlefield.clientWidth ||
                window.innerWidth;


            const height =
                rect.height ||
                battlefield.clientHeight ||
                (
                    window.innerHeight -
                    120
                );


            console.log(
                "Taille Map 2 :",
                width,
                "x",
                height
            );

            // ======================================
            // ROUTE PRINCIPALE
            // ======================================

            createUrbanRoad(
                width * 0.43,
                0,
                width * 0.16,
                height,
                "vertical"
            );


            // ======================================
            // ROUTE TRANSVERSALE
            // ======================================

            createUrbanRoad(
                0,
                height * 0.43,
                width,
                height * 0.15,
                "horizontal"
            );


            // ======================================
            // TROTTOIRS VERTICAUX
            // ======================================

            createUrbanSidewalk(
                width * 0.40,
                0,
                width * 0.03,
                height
            );


            createUrbanSidewalk(
                width * 0.59,
                0,
                width * 0.03,
                height
            );


            // ======================================
            // TROTTOIRS HORIZONTAUX
            // ======================================

            createUrbanSidewalk(
                0,
                height * 0.39,
                width,
                height * 0.04
            );


            createUrbanSidewalk(
                0,
                height * 0.58,
                width,
                height * 0.04
            );


            // ======================================
            // LIGNE CENTRALE VERTICALE
            // ======================================

            for (
                let y = 15;
                y < height;
                y += 65
            ) {

                createRoadMarking(
                    width * 0.51,
                    y,
                    4,
                    30,
                    "vertical-line"
                );

            }


            // ======================================
            // LIGNE CENTRALE HORIZONTALE
            // ======================================

            for (
                let x = 15;
                x < width;
                x += 65
            ) {

                createRoadMarking(
                    x,
                    height * 0.505,
                    30,
                    4,
                    "horizontal-line"
                );

            }


            // ======================================
            // PASSAGES PIÉTONS
            // ======================================

            createCrosswalk(
                width * 0.43,
                height * 0.35,
                width * 0.16,
                26,
                "horizontal"
            );


            createCrosswalk(
                width * 0.43,
                height * 0.62,
                width * 0.16,
                26,
                "horizontal"
            );


            createCrosswalk(
                width * 0.34,
                height * 0.43,
                30,
                height * 0.15,
                "vertical"
            );


            createCrosswalk(
                width * 0.64,
                height * 0.43,
                30,
                height * 0.15,
                "vertical"
            );


            // ======================================
            // PARKING
            // ======================================

            createParking(
                width * 0.69,
                height * 0.62,
                width * 0.23,
                height * 0.055
            );


            // ======================================
            // BÂTIMENT NORD-OUEST
            // ======================================

            createUrbanBuilding(
                width * 0.05,
                height * 0.08,
                width * 0.28,
                height * 0.23,
                1
            );


            // ======================================
            // BÂTIMENT NORD-EST
            // ======================================

            createUrbanBuilding(
                width * 0.68,
                height * 0.07,
                width * 0.25,
                height * 0.27,
                2
            );


            // ======================================
            // PETIT BÂTIMENT SUD-OUEST
            // ======================================

            createUrbanBuilding(
                width * 0.08,
                height * 0.66,
                width * 0.20,
                height * 0.20,
                3
            );


            // ======================================
            // BÂTIMENT SUD-EST
            // ======================================

            createUrbanBuilding(
                width * 0.70,
                height * 0.68,
                width * 0.23,
                height * 0.20,
                1
            );


            // ======================================
            // ANNEXE SUD-OUEST
            // ======================================

            createUrbanBuilding(
                width * 0.31,
                height * 0.72,
                width * 0.08,
                height * 0.14,
                2
            );


            // ======================================
            // VOITURES ABANDONNÉES
            // ======================================

            createAbandonedCar(
                width * 0.455,
                height * 0.18,
                90
            );


            createAbandonedCar(
                width * 0.515,
                height * 0.70,
                90
            );


            createAbandonedCar(
                width * 0.18,
                height * 0.47,
                0
            );


            createAbandonedCar(
                width * 0.75,
                height * 0.52,
                0
            );


            // ======================================
            // BARRICADES
            // ======================================

            createUrbanBarricade(
                width * 0.39,
                height * 0.31,
                90
            );


            createUrbanBarricade(
                width * 0.60,
                height * 0.64,
                90
            );


            // ======================================
            // BENNES
            // ======================================

            createDumpster(
                width * 0.34,
                height * 0.17,
                0
            );


            createDumpster(
                width * 0.62,
                height * 0.78,
                90
            );


            // ======================================
            // DÉBRIS URBAINS
            // ======================================

            createUrbanDebris(
                width * 0.37,
                height * 0.36,
                18,
                15
            );


            createUrbanDebris(
                width * 0.64,
                height * 0.32,
                24,
                -20
            );


            createUrbanDebris(
                width * 0.30,
                height * 0.61,
                16,
                40
            );


            createUrbanDebris(
                width * 0.66,
                height * 0.63,
                20,
                -35
            );


            createUrbanDebris(
                width * 0.47,
                height * 0.83,
                14,
                20
            );


            // ======================================
            // FISSURES ROUTIÈRES
            // ======================================

            createRoadCrack(
                width * 0.46,
                height * 0.27,
                42,
                65
            );


            createRoadCrack(
                width * 0.53,
                height * 0.76,
                50,
                -55
            );


            createRoadCrack(
                width * 0.16,
                height * 0.49,
                38,
                12
            );


            createRoadCrack(
                width * 0.72,
                height * 0.54,
                44,
                -10
            );


            // ======================================
            // ÉQUIPEMENTS SUR LES TOITS
            // ======================================

            createRoofDetail(
                width * 0.10,
                height * 0.12,
                25,
                18,
                "vent"
            );


            createRoofDetail(
                width * 0.25,
                height * 0.22,
                32,
                22,
                "ac"
            );


            createRoofDetail(
                width * 0.73,
                height * 0.12,
                28,
                20,
                "vent"
            );


            createRoofDetail(
                width * 0.83,
                height * 0.25,
                35,
                22,
                "ac"
            );


            createRoofDetail(
                width * 0.76,
                height * 0.73,
                30,
                20,
                "vent"
            );


            console.log(
                "Structure urbaine créée."
            );

        }