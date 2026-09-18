// ==========================================
// M&B MOBILE
// CONFIGURATION DU JEU
// ==========================================


// ==========================================
// TYPES DE SOLDATS
// ==========================================

const soldierTypes = {
    rifleman: {
        name: "SOLDAT",
        hp: 100,
        speed: 28,
        damage: 20,
        range: 160,
        fireRate: 900
    },

    medic: {
        name: "MÉDECIN",
        hp: 85,
        speed: 40,
        damage: 9,
        range: 115,
        fireRate: 800
    },

    assault: {
        name: "ASSAUT",
        hp: 110,
        speed: 48,
        damage: 15,
        range: 95,
        fireRate: 420
    },

    heavy: {
        name: "LOURD",
        hp: 180,
        speed: 25,
        damage: 35,
        range: 125,
        fireRate: 550
    },

    marksman: {
        name: "SNIPER",
        hp: 80,
        speed: 22,
        damage: 50,
        range: 280,
        fireRate: 1600
    },

    scout: {
        name: "COMMANDO",
        hp: 70,
        speed: 38,
        damage: 27,
        range: 130,
        fireRate: 650
    },

    gunner: {
        name: "MITRAILLEUR",
        hp: 140,
        speed: 17,
        damage: 18,
        range: 190,
        fireRate: 210
    },

    minigunner: {
        name: "MINIGUNNER",

        hp: 200,
        speed: 19,

        damage: 14,
        range: 175,

        fireRate: 90
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
            name: "SOLDAT",
            description: "Polyvalent • moyenne portée",
            cost: 5,
            type: "rifleman"
        },

        {
            icon: "🎯",
            name: "SNIPER",
            description: "Longue portée • dégâts élevés",
            cost: 8,
            type: "marksman"
        },

        {
            icon: "💨",
            name: "SCOUT",
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
        },

        {
            icon: "✚",
            name: "MÉDECIN",
            description: "Soigne automatiquement les alliés proches",
            cost: 9,
            type: "medic"
        },

        {
            icon: "🔥",
            name: "ASSAUT",
            description: "Très rapide • combat rapproché",
            cost: 8,
            type: "assault"
        },

        {
            icon: "💪",
            name: "LOURD",
            description: "Très résistant • puissance de feu élevée",
            cost: 14,
            type: "heavy"
        },

        {
            icon: "⛓️",
            name: "MINIGUN",
            description: "Mega cadence de tir, super OP",
            cost: 30,
            type: "minigunner"
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
                description: "4 places • protection 50%",
                cost: 8,
                type: "trench"
            },

            {
                icon: "🧱",
                name: "SACS DE SABLE",
                description: "3 places • protection 25%",
                cost: 5,
                type: "sandbags"
            },

            {
                icon: "🧵",
                name: "BARBELÉS",
                description: "Ralentit fortement les ennemis",
                cost: 6,
                type: "barbedwire"
            },

            {
                icon: "💥",
                name: "MINE",
                description: "Explosion • dégâts de zone",
                cost: 7,
                type: "mine"
            },

            {
                icon: "🔥",
                name: "MITRAILLEUSE",
                description: "1 opérateur • tir automatique",
                cost: 15,
                type: "machinegun"
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
    { rank: "PVT", xp: 0 },
    { rank: "PFC", xp: 5 },
    { rank: "SPC", xp: 12 },
    { rank: "CPL", xp: 22 },
    { rank: "SGT", xp: 35 },
    { rank: "SSG", xp: 50 },
    { rank: "SFC", xp: 70 },
    { rank: "WO1", xp: 95 },
    { rank: "CW2", xp: 125 },
    { rank: "2LT", xp: 160 }
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
        enemyCount: 0.65,
        pointGain: 0.70
    },

    medium: {
        name: "MOYEN",
        enemyHp: 1,
        enemyDamage: 1,
        enemySpeed: 1,
        enemyCount: 0.80,
        pointGain: 0.50
    },

    hard: {
        name: "DIFFICILE",
        enemyHp: 1.25,
        enemyDamage: 1.20,
        enemySpeed: 1.05,
        enemyCount: 0.95,
        pointGain: 0.40
    },

    extreme: {
        name: "EXTRÊME",
        enemyHp: 1.55,
        enemyDamage: 1.45,
        enemySpeed: 1.10,
        enemyCount: 1.10,
        pointGain: 0.30
    },

    apocalypse: {
        name: "APOCALYPSE",
        enemyHp: 2,
        enemyDamage: 1.75,
        enemySpeed: 1.15,
        enemyCount: 1.30,
        pointGain: 0.25
    },

    ultimate: {
        name: "ULTIME",
        enemyHp: 2.6,
        enemyDamage: 2.15,
        enemySpeed: 1.20,
        enemyCount: 1.55,
        pointGain: 0.20
    },

    impossible: {
        name: "IMPOSSIBLE",
        enemyHp: 3.5,
        enemyDamage: 2.75,
        enemySpeed: 1.30,
        enemyCount: 1.85,
        pointGain: 0.15
    }

};

let selectedDifficulty = "medium";

function getDifficulty() {
    return difficulties[selectedDifficulty];
}