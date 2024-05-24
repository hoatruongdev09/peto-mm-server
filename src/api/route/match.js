import { Router } from "express";
import axios from "axios";
import { getMatchInfo, findPlayerInMatch, getMatchMakingInfo, closeMatch } from "../../provider/match.provider.js";
import { jwtDecode } from "jwt-decode";
import { getBotConfig } from "../../socket/controllers/queues/bot-data-set.js";

const router = Router()

const fetchHeroData = async (heroId) => {
    try {
        const { data } = await axios.get(`https://api-dev.petopiagame.io/v1/hero/base-stats/${heroId}`)
        return data
    } catch (error) {
        throw error
    }
}

const fetchWeaponData = async (weaponId) => {
    try {
        const { data } = await axios.get(`https://api-dev.petopiagame.io/v1/equipment/weapon-data/${weaponId}`)
        return data
    } catch (error) {
        throw error
    }
}

router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log("find match by id: ", id)
    try {
        const matchData = await getMatchInfo(id)
        const players = []
        for (let player of matchData.players) {
            if (player.bot) {
                const botConfig = getBotConfig(player.bot_id)
                console.log("bot config: ", player.bot_id)
                players.push({
                    ...player,
                    hero: botConfig.hero,
                    weapon: botConfig.weapon
                })
            } else {
                const hero = await fetchHeroData(player.hero);
                const weapon = await fetchWeaponData(player.weapon)
                console.log("weapon: ", weapon)
                players.push({
                    ...player,
                    hero: hero.data,
                    weapon: weapon.data
                })
            }
        }
        res.status(200).json({
            status: true,
            data: {
                ...matchData,
                players: players
            }
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

router.post('/validate-token', async (req, res) => {
    const { token, match_id } = req.body
    const { user_id } = jwtDecode(token)
    try {
        const player = await findPlayerInMatch(user_id, match_id)
        const hero = await fetchHeroData(player.hero);
        const weapon = await fetchWeaponData(player.weapon)
        res.status(200).json({
            status: true,
            data: {
                ...player,
                hero: hero.data,
                weapon: weapon.data
            }
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

router.get('/matchmaking-info/:matchId', async (req, res) => {
    const { matchId } = req.params
    try {
        res.status(200).json({
            status: true,
            data: await getMatchMakingInfo(matchId)
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

router.post('/close-match/:matchId', async (req, res) => {
    const { matchId } = req.params
    try {
        res.status(200).json({
            status: true,
            data: await closeMatch(matchId)
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

export default router