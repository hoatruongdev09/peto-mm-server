import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

const authenticate = async (socket, next) => {
    try {

        const { token, hero_id, weapon_id, mode = "arena_sole", region = "vn", hero_skin = 1, has_betting = false } = socket.handshake.query
        const { user_id, iat } = jwtDecode(token)
        const hero = await fetchHeroData(hero_id)
        const weapon = await fetchWeaponData(weapon_id)

        socket.userId = user_id
        socket.userElo = 0
        socket.findMatchData = {
            hero: hero.data,
            weapon: weapon.data,
            mode,
            region,
            hero_skin,
            has_betting
        }
        next()
    } catch (error) {
        console.log(error);
        next(new Error("error"));
    }
}

export default authenticate