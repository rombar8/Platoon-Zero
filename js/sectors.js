    // ==========================================
    // Platoon Zero
    // SECTORS.JS
    // Gestion des secteurs de la carte
    // ==========================================

    const SECTOR_2_REQUIRED_WAVE =
        250;

    const SECTOR_CAPTURE_DURATION =
        60;

    const SECTOR_CAPTURE_RADIUS =
        120;


    let sector2Unlocked =
        false;

    let sector2CaptureProgress =
        0;

    let sector2CaptureAvailable =
        false;


    let sectorLockedOverlay =
        null;

    let sectorBorder =
        null;

    let sectorCapturePoint =
        null;

    let sectorCaptureText =
        null;


    // ==========================================
    // INITIALISATION
    // ==========================================

    function initializeSectors() {

        resetSectors();


        // ======================================
        // ZONE 2 VERROUILLÉE
        // ======================================

        sectorLockedOverlay =
            document.createElement(
                "div"
            );

        sectorLockedOverlay.classList.add(
            "sector-locked-overlay"
        );

        sectorLockedOverlay.innerHTML = `
            <div class="sector-locked-content">
                <div class="sector-lock-icon">
                    🔒
                </div>

                <div class="sector-lock-title">
                    SECTEUR 2
                </div>

                <div class="sector-lock-subtitle">
                    ACCÈS VERROUILLÉ
                </div>

                <div class="sector-lock-requirement">
                    POINT DE CAPTURE DISPONIBLE
                    À LA VAGUE 250
                </div>
            </div>
        `;

        battlefieldWorld.appendChild(
            sectorLockedOverlay
        );


        // ======================================
        // FRONTIÈRE
        // ======================================

        sectorBorder =
            document.createElement(
                "div"
            );

        sectorBorder.classList.add(
            "sector-border"
        );

        sectorBorder.innerHTML = `
            <span>
                SECTEUR 1
            </span>

            <span>
                SECTEUR 2
            </span>
        `;

        battlefieldWorld.appendChild(
            sectorBorder
        );


        // ======================================
        // POINT DE CAPTURE
        // ======================================

        sectorCapturePoint =
            document.createElement(
                "div"
            );

        sectorCapturePoint.classList.add(
            "sector-capture-point"
        );

            sectorCapturePoint.innerHTML = `
                <div class="domination-zone">
                <div class="domination-inner-zone"></div>
                </div>

                <div class="flag-pole">
                <div class="flag-cloth"></div>

                <div class="flag-base">
                <span></span>
                <span></span>
                <span></span>
                </div>
                </div>

                <div class="sector-capture-progress">
                </div>

                <div class="sector-capture-timer">
                60s
                </div>
                `;

        battlefieldWorld.appendChild(
            sectorCapturePoint
        );
            sectorCapturePoint.style.display =
                "none";


        sectorCaptureText =
            sectorCapturePoint.querySelector(
                ".sector-capture-timer"
            );


        updateSectorInterface();
    }


    // ==========================================
    // MISE À JOUR DES SECTEURS
    // ==========================================

    function updateSectors(
        deltaTime
    ) {

        if (
            sector2Unlocked ||
            !sectorCapturePoint
        ) {

            return;
        }


        // ======================================
        // AVANT LA VAGUE 250
        // ======================================

        if (
        currentWave <
        SECTOR_2_REQUIRED_WAVE
        ) {

        sector2CaptureAvailable =
        false;

        sectorCapturePoint.style.display =
        "none";

        return;
        }


        // ======================================
        // VAGUE 250+
        // LE POINT DE CAPTURE APPARAÎT
        // ======================================

        sector2CaptureAvailable =
        true;

        sectorCapturePoint.style.display =
        "flex";


        const worldWidth =
            battlefieldWorld.offsetWidth;

        const worldHeight =
            battlefieldWorld.offsetHeight;


        // Point placé juste sous
        // la frontière des deux secteurs.
        const captureX =
            worldWidth * 0.50;

        const captureY =
            worldHeight * 0.55;


        // ======================================
        // SOLDATS DANS LA ZONE
        // ======================================

        const soldiersInside =
            soldiers.filter(
                function (soldier) {

                    if (
                        !soldier ||
                        soldier.alive === false
                    ) {

                        return false;
                    }


                    const dx =
                        soldier.x -
                        captureX;

                    const dy =
                        soldier.y -
                        captureY;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    return (
                        distance <=
                        SECTOR_CAPTURE_RADIUS
                    );
                }
            );


        // ======================================
        // CAPTURE
        // ======================================

        if (
            soldiersInside.length > 0
        ) {

            sector2CaptureProgress +=
                deltaTime;


            sectorCapturePoint.classList.add(
                "capturing"
            );

        } else {

            sector2CaptureProgress =
                0;


            sectorCapturePoint.classList.remove(
                "capturing"
            );
        }


        sector2CaptureProgress =
            Math.min(
                sector2CaptureProgress,
                SECTOR_CAPTURE_DURATION
            );


        // ======================================
        // CAPTURE TERMINÉE
        // ======================================

        if (
            sector2CaptureProgress >=
            SECTOR_CAPTURE_DURATION
        ) {

            unlockSector2();

            return;
        }


        updateSectorInterface();
    }


    // ==========================================
    // INTERFACE
    // ==========================================

        function updateSectorHud() {

    const sectorHud =
    document.querySelector(
    "#sector-hud"
    );

    const sectorHudValue =
    document.querySelector(
    "#sector-hud-value"
    );

    if (
    !sectorHud ||
    !sectorHudValue
    ) {

    return;
    }


    sectorHud.classList.remove(
    "sector-capturing",
    "sector-unlocked"
    );


    // AVANT LA VAGUE 250

    if (
    currentWave <
    SECTOR_2_REQUIRED_WAVE
    ) {

    sectorHudValue.textContent =
    "1 / 2";

    return;
    }


    // SECTEUR 2 CAPTURÉ

    if (sector2Unlocked) {

    sectorHudValue.textContent =
    "2 / 2";

    sectorHud.classList.add(
    "sector-unlocked"
    );

    return;
    }


    // CAPTURE EN COURS / DISPONIBLE

    const remainingTime =
    Math.max(
    0,
    Math.ceil(
    SECTOR_CAPTURE_DURATION -
    sector2CaptureProgress
    )
    );

    sectorHudValue.textContent =
    "CAPTURE " +
    remainingTime +
    "s";

    sectorHud.classList.add(
    "sector-capturing"
    );
    }

    function updateSectorInterface() {

            updateSectorHud();

        if (
            !sectorCapturePoint ||
            !sectorCaptureText
        ) {

            return;
        }


        const progressElement =
            sectorCapturePoint.querySelector(
                ".sector-capture-progress"
            );


        if (
            currentWave <
            SECTOR_2_REQUIRED_WAVE
        ) {

            sectorCapturePoint.style.display =
                "none";

        return;
        }


            return;
        }


        sectorCapturePoint.classList.remove(
            "locked"
        );


        const remainingTime =
            Math.max(
                0,
                Math.ceil(
                    SECTOR_CAPTURE_DURATION -
                    sector2CaptureProgress
                )
            );


        sectorCaptureText.textContent =
            remainingTime +
            "s";


        const progress =
            sector2CaptureProgress /
            SECTOR_CAPTURE_DURATION;


        if (progressElement) {

            progressElement.style.setProperty(
                "--capture-progress",
                (
                    progress *
                    360
                ) +
                "deg"
            );
        }


    // ==========================================
    // DÉBLOCAGE SECTEUR 2
    // ==========================================

    function unlockSector2() {

        if (sector2Unlocked) {
            return;
        }


        sector2Unlocked =
            true;

            updateSectorHud();

        sector2CaptureProgress =
            SECTOR_CAPTURE_DURATION;


        if (sectorLockedOverlay) {

            sectorLockedOverlay.classList.add(
                "unlocked"
            );
        }


        if (sectorBorder) {

            sectorBorder.classList.add(
                "unlocked"
            );
        }


        if (sectorCapturePoint) {

            sectorCapturePoint.classList.add(
                "captured"
            );
        }


        showWaveAnnouncement(
            "⚑ SECTEUR 2 DÉBLOQUÉ",
            "NOUVELLE ZONE ACCESSIBLE"
        );


        console.log(
            "🟢 Secteur 2 débloqué !"
        );
    }


    // ==========================================
    // RESET
    // ==========================================

    function resetSectors() {

        sector2Unlocked =
            false;

        sector2CaptureProgress =
            0;

        sector2CaptureAvailable =
            false;


        if (sectorLockedOverlay) {

            sectorLockedOverlay.remove();

            sectorLockedOverlay =
                null;
        }


        if (sectorBorder) {

            sectorBorder.remove();

            sectorBorder =
                null;
        }


        if (sectorCapturePoint) {

            sectorCapturePoint.remove();

            sectorCapturePoint =
                null;
        }


        sectorCaptureText =
            null;
    }


    // ==========================================
    // UTILITAIRES
    // ==========================================

    function isSector2Unlocked() {

        return sector2Unlocked;
    }


    function getAccessibleMapMinY() {

        if (sector2Unlocked) {

            return 0;
        }


        return (
            battlefieldWorld.offsetHeight *
            0.50
        );
    }
    // ==========================================
    // POSITION DE SPAWN DES ENNEMIS
    // ==========================================

    function getEnemySectorSpawnY() {

        // ======================================
        // VAGUES 1 À 249
        // Spawn en haut du SECTEUR 1
        // ======================================

        if (
            currentWave <
            SECTOR_2_REQUIRED_WAVE
        ) {

            return (
                52 +
                Math.random() * 4
            );
        }


        // ======================================
        // VAGUE 250+
        // Spawn en haut du SECTEUR 2
        // ======================================

        return (
            5 +
            Math.random() * 5
        );
    }


    function getSector1MinimumY() {

    return (
    battlefieldWorld.offsetHeight *
    0.50
    );
    }


    function canSoldierEnterSector2() {

    return (
    currentWave >=
    SECTOR_2_REQUIRED_WAVE
    );
    }


    function clampSoldierToUnlockedSector(
    targetY
    ) {

    if (
    canSoldierEnterSector2()
    ) {

    return targetY;
    }


    const borderY =
    getSector1MinimumY();


    return Math.max(
    borderY + 20,
    targetY
    );
    }