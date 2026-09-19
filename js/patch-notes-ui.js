
        // ==========================================
        // PLATOON ZERO
        // INTERFACE PATCH NOTES
        // ==========================================


        const patchToggle =
            document.querySelector(
                "#patch-toggle"
            );


        const patchNotesContainer =
            document.querySelector(
                "#patch-notes"
            );


        // ==========================================
        // GÉNÉRATION DES PATCH NOTES
        // ==========================================

        function renderPatchNotes() {

            if (
                !patchNotesContainer ||
                typeof patchNotesData === "undefined"
            ) {

                return;

            }


            patchNotesContainer.innerHTML =
                "";


            patchNotesData.forEach(
                function (
                    patch,
                    patchIndex
                ) {

                    // ==================================
                    // VERSION
                    // ==================================

                    const patchEntry =
                        document.createElement(
                            "div"
                        );

                    patchEntry.className =
                        "patch-entry";


                    // ==================================
                    // BOUTON VERSION
                    // ==================================

                    const versionButton =
                        document.createElement(
                            "button"
                        );

                    versionButton.className =
                        "patch-version-toggle";

                    versionButton.type =
                        "button";


                    const versionName =
                        document.createElement(
                            "span"
                        );

                    versionName.textContent =
                        patch.version;


                    const arrow =
                        document.createElement(
                            "span"
                        );

                    arrow.className =
                        "patch-arrow";


                    // Le patch le plus récent
                    // est ouvert par défaut.

                    arrow.textContent =
                        patchIndex === 0
                            ? "▼"
                            : "▶";


                    versionButton.appendChild(
                        versionName
                    );

                    versionButton.appendChild(
                        arrow
                    );


                    // ==================================
                    // CONTENU VERSION
                    // ==================================

                    const versionContent =
                        document.createElement(
                            "div"
                        );

                    versionContent.className =
                        "patch-version-content";


                    if (
                        patchIndex !== 0
                    ) {

                        versionContent.classList.add(
                            "hidden"
                        );

                    }


                    // ==================================
                    // SECTIONS
                    // ==================================

                    patch.sections.forEach(
                        function (section) {

                            const sectionElement =
                                document.createElement(
                                    "div"
                                );

                            sectionElement.className =
                                "patch-section";


                            const title =
                                document.createElement(
                                    "h3"
                                );

                            title.textContent =
                                section.title;


                            sectionElement.appendChild(
                                title
                            );


                            // ==========================
                            // MODIFICATIONS
                            // ==========================

                            section.changes.forEach(
                                function (change) {

                                    const paragraph =
                                        document.createElement(
                                            "p"
                                        );

                                    paragraph.textContent =
                                        "• " +
                                        change;


                                    sectionElement.appendChild(
                                        paragraph
                                    );

                                }
                            );


                            versionContent.appendChild(
                                sectionElement
                            );

                        }
                    );


                    // ==================================
                    // OUVRIR / FERMER VERSION
                    // ==================================

                    versionButton.addEventListener(
                        "click",
                        function () {

                            versionContent
                                .classList
                                .toggle(
                                    "hidden"
                                );


                            const closed =
                                versionContent
                                    .classList
                                    .contains(
                                        "hidden"
                                    );


                            arrow.textContent =
                                closed
                                    ? "▶"
                                    : "▼";

                        }
                    );


                    // ==================================
                    // AJOUT FINAL
                    // ==================================

                    patchEntry.appendChild(
                        versionButton
                    );

                    patchEntry.appendChild(
                        versionContent
                    );


                    patchNotesContainer.appendChild(
                        patchEntry
                    );

                }
            );

        }


        // ==========================================
        // OUVRIR / FERMER PATCH NOTES
        // ==========================================

        if (
            patchToggle &&
            patchNotesContainer
        ) {

            patchToggle.addEventListener(
                "click",
                function () {

                    const isHidden =
                        patchNotesContainer
                            .classList
                            .contains(
                                "hidden"
                            );


                    if (
                        isHidden
                    ) {

                        patchNotesContainer
                            .classList
                            .remove(
                                "hidden"
                            );

                        patchToggle.textContent =
                            "✕ FERMER PATCH NOTES";

                    } else {

                        patchNotesContainer
                            .classList
                            .add(
                                "hidden"
                            );

                        patchToggle.textContent =
                            "📋 PATCH NOTES";

                    }

                }
            );

        }


        // ==========================================
        // INITIALISATION
        // ==========================================

        renderPatchNotes();