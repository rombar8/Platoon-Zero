// ==========================================
// M&B MOBILE
// CONFIGURATION DU JEU
// ==========================================


// ==========================================
// TYPES DE SOLDATS
// ==========================================

const soldierTypes = {
    rifleman: {
        name: "Fantassin",
        hp: 100,
        speed: 28,
        damage: 20,
        range: 160,
        fireRate: 900
    },

    marksman: {
        name: "Tireur",
        hp: 80,
        speed: 22,
        damage: 45,
        range: 280,
        fireRate: 1600
    },

    scout: {
        name: "Éclaireur",
        hp: 70,
        speed: 38,
        damage: 14,
        range: 130,
        fireRate: 650
    },

    gunner: {
        name: "Mitrailleur",
        hp: 140,
        speed: 17,
        damage: 12,
        range: 190,
        fireRate: 220
    }
};


// ==========================================
// MENUS TACTIQUES
// ==========================================

const tacticalMenus = {

    reinforcements: {
        title: "RENFORTS",

        options: [
            {
                icon: "🪖",
                name: "FANTASSIN",
                description: "Polyvalent • efficace à moyenne portée",
                cost: 5,
                type: "rifleman"
            },

            {
                icon: "🎯",
                name: "TIREUR",
                description: "Longue portée • dégâts élevés",
                cost: 8,
                type: "marksman"
            },

            {
                icon: "💨",
                name: "ÉCLAIREUR",
                description: "Très mobile • faible résistance",
                cost: 6,
                type: "scout"
            },

            {
                icon: "🛡️",
                name: "MITRAILLEUR",
                description: "Tir soutenu • lourd et lent",
                cost: 12,
                type: "gunner"
            }
        ]
    },


    support: {
        title: "SOUTIEN",

        options: [
            {
                icon: "💣",
                name: "GRENADE",
                description: "Explosion rapide • petite zone",
                cost: 4
            },

            {
                icon: "💥",
                name: "MORTIER",
                description: "Frappe puissante • grande zone",
                cost: 10
            },

            {
                icon: "📦",
                name: "RAVITAILLEMENT",
                description: "Soigne les soldats à proximité",
                cost: 7
            }
        ]
    },


    defenses: {
                title: "DÉFENSES",
                options: [
                    {
                        icon: "⛏️",
                        name: "TRANCHÉE",
                        description: "Couverture défensive • réduit les dégâts",
                        cost: 8,
                        type: "trench"
                    }
                ]
            },


    orders: {
        title: "ORDRES",

        options: [
            {
                icon: "⚑",
                name: "TENIR POSITION",
                description: "Immobilise l'unité • combat maintenu",
                cost: 0
            },

            {
                icon: "🎯",
                name: "FEU À VOLONTÉ",
                description: "Annule les ordres • comportement libre",
                cost: 0
            },

            {
                icon: "↙️",
                name: "REPLI",
                description: "Retour immédiat vers la zone arrière",
                cost: 0
            }
        ]
    }

};