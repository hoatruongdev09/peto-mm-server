const pistol = { id: 1, ingame_id: "201001" }
const shotgun = { id: 2, ingame_id: "201002" }
const ak47 = { id: 3, ingame_id: "201003" }
const dagger = { id: 4, ingame_id: "201006" }
const baton = { id: 5, ingame_id: "201005" }
const needle = { id: 6, ingame_id: "201004" }

const fox = {
    id: 1,
    ingame_id: "101001",
    nft_rarity: -1,
    passive_skill_ids: [],
    stats: {
        base: {
            hp: 500,
            attack: 60,
            defend: 30,
            evade_rate: 20,
            crit_rate: 15,
            crit_damage: 140,
            move_speed: 2.5,
            attack_speed: 1,
            hp_regen: 0,
        },
        bonus: {
            hp: 0,
            attack: 0,
            defend: 0,
            evade_rate: 0,
            crit_rate: 0,
            crit_damage: 0,
            move_speed: 0,
            attack_speed: 0,
            hp_regen: 0,
        }
    }
}
const jack = {
    id: 2,
    ingame_id: "101002",
    nft_rarity: -1,
    passive_skill_ids: [],
    stats: {
        base: {
            hp: 500,
            attack: 60,
            defend: 30,
            evade_rate: 20,
            crit_rate: 15,
            crit_damage: 140,
            move_speed: 2.5,
            attack_speed: 1,
            hp_regen: 0,
        },
        bonus: {
            hp: 0,
            attack: 0,
            defend: 0,
            evade_rate: 0,
            crit_rate: 0,
            crit_damage: 0,
            move_speed: 0,
            attack_speed: 0,
            hp_regen: 0,
        }
    }
}
const luna = {
    id: 3,
    ingame_id: "102001",
    nft_rarity: -1,
    passive_skill_ids: [],
    stats: {
        base: {
            hp: 600,
            attack: 60,
            defend: 40,
            evade_rate: 20,
            crit_rate: 10,
            crit_damage: 120,
            move_speed: 3,
            attack_speed: 1,
            hp_regen: 0,
        },
        bonus: {
            hp: 0,
            attack: 0,
            defend: 0,
            evade_rate: 0,
            crit_rate: 0,
            crit_damage: 0,
            move_speed: 0,
            attack_speed: 0,
            hp_regen: 0,
        }
    }
}
const ly = {
    id: 4,
    ingame_id: "103001",
    nft_rarity: -1,
    passive_skill_ids: [],
    stats: {
        base: {
            hp: 600,
            attack: 100,
            defend: 40,
            evade_rate: 10,
            crit_rate: 10,
            crit_damage: 120,
            move_speed: 3,
            attack_speed: 1,
            hp_regen: 0,
        },
        bonus: {
            hp: 0,
            attack: 0,
            defend: 0,
            evade_rate: 0,
            crit_rate: 0,
            crit_damage: 0,
            move_speed: 0,
            attack_speed: 0,
            hp_regen: 0,
        }
    }
}
const bufeno = {
    id: 5,
    ingame_id: "104001",
    nft_rarity: -1,
    passive_skill_ids: [],
    stats: {
        base: {
            hp: 800,
            attack: 100,
            defend: 40,
            evade_rate: 10,
            crit_rate: 5,
            crit_damage: 120,
            move_speed: 3,
            attack_speed: 1,
            hp_regen: 0,
        },
        bonus: {
            hp: 0,
            attack: 0,
            defend: 0,
            evade_rate: 0,
            crit_rate: 0,
            crit_damage: 0,
            move_speed: 0,
            attack_speed: 0,
            hp_regen: 0,
        }
    }
}
const buck = {
    id: 6,
    ingame_id: "105001",
    nft_rarity: -1,
    passive_skill_ids: [],
    stats: {
        base: {
            hp: 600,
            attack: 100,
            defend: 30,
            evade_rate: 20,
            crit_rate: 10,
            crit_damage: 130,
            move_speed: 3,
            attack_speed: 1,
            hp_regen: 0,
        },
        bonus: {
            hp: 0,
            attack: 0,
            defend: 0,
            evade_rate: 0,
            crit_rate: 0,
            crit_damage: 0,
            move_speed: 0,
            attack_speed: 0,
            hp_regen: 0,
        }
    }
}

const botConfig = [

    {
        bot_id: 1,
        hero: fox,
        weapon: pistol
    },
    {
        bot_id: 2,
        hero: fox,
        weapon: shotgun
    },
    {
        bot_id: 3,
        hero: fox,
        weapon: ak47
    },
    {
        bot_id: 4,
        hero: luna,
        weapon: pistol
    },
    {
        bot_id: 5,
        hero: luna,
        weapon: shotgun
    },
    {
        bot_id: 6,
        hero: luna,
        weapon: ak47
    },
    {
        bot_id: 7,
        hero: jack,
        weapon: pistol
    },
    {
        bot_id: 8,
        hero: jack,
        weapon: shotgun
    },
    {
        bot_id: 9,
        hero: jack,
        weapon: ak47
    },
    {
        bot_id: 10,
        hero: bufeno,
        weapon: baton
    },
    {
        bot_id: 11,
        hero: ly,
        weapon: needle
    },
    {
        bot_id: 12,
        hero: buck,
        weapon: dagger
    },
]

export const randomConfig = () => {
    const config = botConfig[Math.floor(Math.random() * botConfig.length)]

    return {
        ...config,
        hero_skin: 1,
    }
}

export const getBotConfig = (id) => {
    for (let config of botConfig) {
        if (config.bot_id == id) {
            return config;
        }
    }
    return null;
}