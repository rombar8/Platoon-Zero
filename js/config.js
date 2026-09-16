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


// ==========================================
// GRADES DES SOLDATS
// ==========================================

// ==========================================
// GRADES DES SOLDATS
// ==========================================

const soldierRanks = [
    { rank: "PVT",  xp: 0 },
    { rank: "PFC",  xp: 5 },
    { rank: "CPL",  xp: 12 },
    { rank: "SGT",  xp: 22 },
    { rank: "SSGT", xp: 35 },
    { rank: "SFC",  xp: 50 },
    { rank: "MSG",  xp: 70 },
    { rank: "1SG",  xp: 95 },
    { rank: "SGM",  xp: 125 },
    { rank: "CSM",  xp: 160 }
];

// ... tout ton config.js actuel au-dessus


// ======================================
// DIFFICULTÉS
// ======================================

const difficulties = {
    easy: {
        name: "FACILE",
        enemyHp: 0.75,
        enemyDamage: 0.75,
        enemySpeed: 0.90,
        enemyCount: 0.80,
        pointGain: 0.70
    },

    medium: {
        name: "MOYEN",
        enemyHp: 1,
        enemyDamage: 1,
        enemySpeed: 1,
        enemyCount: 1,
        pointGain: 0.50
    },

    hard: {
        name: "DIFFICILE",
        enemyHp: 1.25,
        enemyDamage: 1.20,
        enemySpeed: 1.05,
        enemyCount: 1.20,
        pointGain: 0.40
    },

    extreme: {
        name: "EXTRÊME",
        enemyHp: 1.55,
        enemyDamage: 1.45,
        enemySpeed: 1.10,
        enemyCount: 1.40,
        pointGain: 0.30
    },

    apocalypse: {
        name: "APOCALYPSE",
        enemyHp: 2,
        enemyDamage: 1.75,
        enemySpeed: 1.15,
        enemyCount: 1.65,
        pointGain: 0.25
    },

    ultimate: {
        name: "ULTIME",
        enemyHp: 2.6,
        enemyDamage: 2.15,
        enemySpeed: 1.20,
        enemyCount: 2,
        pointGain: 0.20
    },

    impossible: {
        name: "IMPOSSIBLE",
        enemyHp: 3.5,
        enemyDamage: 2.75,
        enemySpeed: 1.30,
        enemyCount: 2.5,
        pointGain: 0.15
    }
};

let selectedDifficulty = "medium";

function getDifficulty() {
    return difficulties[selectedDifficulty];
}