
        // ==========================================
        // PLATOON ZERO
        // PATCH NOTES
        // ==========================================

        const patchNotesData = [

            // ======================================
            // v0.3.3 ALPHA
            // ======================================

            {
                version: "v0.3.3 ALPHA",

                sections: [

                    {
                        title: "🗺️ CHAMP DE BATAILLE",

                        changes: [
                            "Correction du positionnement du décor lors du zoom navigateur.",
                            "Les éléments du terrain restent désormais ancrés au champ de bataille.",
                            "Correction de la position de la zone alliée lors du zoom.",
                            "Suppression de plusieurs artefacts visuels du terrain.",
                            "Amélioration générale du comportement responsive du champ de bataille."
                        ]
                    },

                    {
                        title: "🪖 SPAWNS",

                        changes: [
                            "Correction de la zone de spawn des renforts alliés.",
                            "Correction de la zone de spawn des ennemis.",
                            "Les nouvelles unités apparaissent désormais dans leur zone correcte même avec un fort niveau de zoom ou de dézoom.",
                            "Les zones de spawn suivent désormais les dimensions du monde lors du redimensionnement du champ de bataille."
                        ]
                    },

                    {
                        title: "🛠️ CORRECTIONS",

                        changes: [
                            "Correction de plusieurs problèmes de positionnement provoqués par le zoom navigateur.",
                            "Suppression de deux anciennes zones ovales du fond qui se déformaient avec le zoom.",
                            "Le zoom navigateur reste entièrement utilisable sans modifier la cohérence du terrain."
                        ]
                    }

                ]
            },


            // ======================================
            // v0.3.2 ALPHA
            // ======================================

            {
                version: "v0.3.2 ALPHA",

                sections: [

                    {
                        title: "🏗️ DÉFENSES",

                        changes: [
                            "Nouveau système d'amélioration des défenses jusqu'au niveau 3.",
                            "Tranchées : protection améliorée jusqu'à 50 %.",
                            "Sacs de sable : protection améliorée jusqu'à 30 %.",
                            "Barbelés : ralentissement amélioré jusqu'à 35 %.",
                            "Mines : dégâts améliorés jusqu'à 70 % des PV max.",
                            "Amélioration du rayon d'explosion des mines.",
                            "Évolution visuelle des défenses selon leur niveau.",
                            "Nouvelle prévisualisation avant le placement d'une défense."
                        ]
                    },

                    {
                        title: "🔫 MACHINE GUN",

                        changes: [
                            "Refonte visuelle complète de la Machine Gun.",
                            "Machine Gun désormais améliorable jusqu'au niveau 3.",
                            "Amélioration de la cadence, des dégâts et de la protection de l'opérateur.",
                            "Ajout d'un indicateur de portée.",
                            "Rotation de la Machine Gun corrigée.",
                            "Positionnement de l'opérateur corrigé derrière l'arme.",
                            "Sélection de l'opérateur améliorée.",
                            "L'arme personnelle de l'opérateur est masquée pendant l'utilisation de la Machine Gun."
                        ]
                    },

                    {
                        title: "🎯 GAMEPLAY",

                        changes: [
                            "Ajout d'un indicateur de portée pour les soldats sélectionnés.",
                            "Les rochers sont désormais décoratifs et ne bloquent plus les déplacements.",
                            "Amélioration de plusieurs collisions et interactions avec les défenses.",
                            "Amélioration de la sélection des unités à proximité des défenses."
                        ]
                    },

                    {
                        title: "🧭 INTERFACE TACTIQUE",

                        changes: [
                            "Les menus tactiques restent désormais ouverts après une action.",
                            "Actualisation en temps réel du contenu des menus tactiques.",
                            "Ajout des raccourcis clavier pour les menus.",
                            "1 : Renforts.",
                            "2 : Soutien.",
                            "3 : Défenses.",
                            "4 : Ordres.",
                            "Échap : pause / reprise de la partie."
                        ]
                    },

                    {
                        title: "⚙️ PARAMÈTRES",

                        changes: [
                            "Nouveau menu Paramètres.",
                            "Accessible depuis le menu principal et le menu pause.",
                            "Nouvelle interface adaptée au style militaire de PLATOON ZERO.",
                            "Ajout des options d'effets visuels.",
                            "Ajout des options d'indicateurs de portée.",
                            "Sauvegarde automatique des paramètres.",
                            "Les paramètres sont conservés après fermeture ou actualisation du jeu.",
                            "Échap permet de revenir au menu pause depuis les paramètres en cours de partie."
                        ]
                    },

                    {
                        title: "🛠️ CORRECTIONS",

                        changes: [
                            "Correction de plusieurs problèmes liés au placement des défenses.",
                            "Correction de la rotation et du positionnement de la Machine Gun.",
                            "Correction du positionnement de son opérateur.",
                            "Correction de plusieurs problèmes de sélection d'unités.",
                            "Diverses améliorations de stabilité et d'interface."
                        ]
                    }

                ]
            },


            // ======================================
            // v0.3.1 ALPHA
            // ======================================

            {
                version: "v0.3.1 ALPHA",

                sections: [

                    {
                        title: "🪖 NOUVELLE IDENTITÉ",

                        changes: [
                            "M&B Mobile devient officiellement PLATOON ZERO.",
                            "Nouveau nom et nouvelle identité pour le jeu."
                        ]
                    },

                    {
                        title: "🌲 REFONTE DU CHAMP DE BATAILLE",

                        changes: [
                            "Ajout de nombreux arbres sur le champ de bataille.",
                            "Les unités peuvent désormais passer sous les arbres.",
                            "Amélioration générale de la végétation et du décor.",
                            "Nouvelle zone d'apparition alliée plus compacte en bas du champ de bataille.",
                            "Les unités alliées apparaissent désormais orientées vers le champ de bataille."
                        ]
                    },

                    {
                        title: "🪨 NOUVEAUX OBSTACLES",

                        changes: [
                            "Ajout de gros rochers solides sur le champ de bataille.",
                            "Les rochers bloquent le déplacement des unités.",
                            "Les rochers bloquent également les tirs.",
                            "Ajout de troncs d'arbres couchés.",
                            "Les troncs bloquent le déplacement des unités mais permettent aux tirs de passer au-dessus.",
                            "Ajout de zones de collision adaptées à la taille des obstacles."
                        ]
                    },

                    {
                        title: "🤖 IA ENNEMIE",

                        changes: [
                            "Amélioration du système de contournement des obstacles.",
                            "Les ennemis détectent désormais les obstacles avant d'entrer en collision avec eux.",
                            "Les ennemis conservent temporairement leur direction de contournement.",
                            "Réduction des blocages contre les rochers et les troncs."
                        ]
                    },

                    {
                        title: "⚙️ AMÉLIORATIONS",

                        changes: [
                            "Amélioration des collisions entre les unités et les éléments du terrain.",
                            "Distinction entre les obstacles bloquant les tirs et ceux bloquant uniquement les déplacements.",
                            "Divers ajustements visuels du champ de bataille."
                        ]
                    }

                ]
            },


            // ======================================
            // v0.3.0 ALPHA
            // ======================================

            {
                version: "v0.3.0 ALPHA",

                sections: [

                    {
                        title: "🚩 NOUVEAU MODE : DOMINATION",

                        changes: [
                            "Ajout du nouveau mode de jeu DOMINATION.",
                            "Un point stratégique apparaît au centre du champ de bataille.",
                            "Les alliés et les ennemis peuvent prendre le contrôle de la zone.",
                            "Une zone contestée bloque la progression du score.",
                            "Le contrôle allié fait progresser votre score.",
                            "Le contrôle ennemi fait progresser le score adverse.",
                            "Le premier camp à atteindre 500 points remporte la bataille."
                        ]
                    },

                    {
                        title: "🤖 IA ENNEMIE",

                        changes: [
                            "Nouvelle logique de déplacement spécifique au mode Domination.",
                            "Les ennemis cherchent désormais à rejoindre et contrôler l'objectif.",
                            "Correction de mouvements anormaux autour du point de capture.",
                            "Amélioration du comportement en vitesse ×2 et ×4."
                        ]
                    },

                    {
                        title: "🏆 VICTOIRE & DÉFAITE",

                        changes: [
                            "Ajout d'une condition de victoire en Domination.",
                            "Ajout d'une condition de défaite lorsque l'ennemi atteint 500 points.",
                            "Nouveaux écrans de fin adaptés au résultat de la bataille.",
                            "Réinitialisation correcte du point de capture lors d'une nouvelle partie."
                        ]
                    },

                    {
                        title: "🎖️ GRADES",

                        changes: [
                            "Extension du système de grades jusqu'au grade COL.",
                            "15 grades disponibles au total.",
                            "Nouveaux insignes pour les grades supérieurs.",
                            "Les promotions augmentent les PV, les dégâts et la portée."
                        ]
                    },

                    {
                        title: "💰 POINTS DE COMMANDEMENT",

                        changes: [
                            "Rééquilibrage des récompenses selon la difficulté.",
                            "Les difficultés élevées accordent désormais davantage de points."
                        ]
                    },

                    {
                        title: "⚙️ AMÉLIORATIONS",

                        changes: [
                            "Le score de Domination respecte les vitesses ×1, ×2 et ×4.",
                            "Amélioration de la gestion des différents modes de jeu.",
                            "Amélioration de la gestion des fins de partie."
                        ]
                    }

                ]
            },


            // ======================================
            // v0.2.4 ALPHA
            // ======================================

            {
                version: "v0.2.4 ALPHA",

                sections: [

                    {
                        title: "🔥 MITRAILLEUSE DÉFENSIVE",

                        changes: [
                            "Ajout de la mitrailleuse défensive.",
                            "La mitrailleuse peut être placée directement sur le champ de bataille.",
                            "Un soldat est nécessaire pour utiliser la mitrailleuse.",
                            "L'opérateur cesse d'utiliser son arme personnelle lorsqu'il utilise la mitrailleuse.",
                            "Tir automatique sur les ennemis à portée."
                        ]
                    },

                    {
                        title: "🎯 INTERFACE",

                        changes: [
                            "Ajout d'une fiche dédiée à la mitrailleuse.",
                            "Affichage de l'état de la mitrailleuse.",
                            "Affichage de l'opérateur actuel.",
                            "Affichage de la cadence de tir.",
                            "Affichage de la protection.",
                            "Affichage de la cible actuelle."
                        ]
                    },

                    {
                        title: "⚙️ ÉQUILIBRAGE",

                        changes: [
                            "Limite de 3 mitrailleuses défensives simultanément.",
                            "Coût fixé à 15 points de commandement.",
                            "Les statistiques de la mitrailleuse sont indépendantes de celles de son opérateur."
                        ]
                    }

                ]
            },


            // ======================================
            // v0.2.0 ALPHA
            // ======================================

            {
                version: "v0.2.0 ALPHA",

                sections: [

                    {
                        title: "👹 NOUVEAUX ENNEMIS",

                        changes: [
                            "Ajout de plusieurs types d'ennemis.",
                            "Les ennemis disposent désormais de caractéristiques différentes.",
                            "Apparition progressive de nouveaux ennemis au fil des vagues.",
                            "Ajout des barres de vie ennemies."
                        ]
                    },

                    {
                        title: "🤖 IA & COMBAT",

                        changes: [
                            "Amélioration du comportement des ennemis.",
                            "Amélioration du système de ciblage.",
                            "Divers ajustements du système de combat."
                        ]
                    },

                    {
                        title: "🎖️ SOLDATS",

                        changes: [
                            "Développement du système de grades des soldats.",
                            "Les grades peuvent améliorer les caractéristiques de combat.",
                            "Ajout de nouvelles possibilités de gestion des unités."
                        ]
                    },

                    {
                        title: "⏩ VITESSE DE JEU",

                        changes: [
                            "Ajout des vitesses ×1, ×2 et ×4.",
                            "Les combats et déplacements suivent la vitesse sélectionnée."
                        ]
                    }

                ]
            }

        ];