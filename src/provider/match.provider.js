import db from '../db/db.js'
import MatchPlayer from '../db/entity/match.player.js'
import Match from '../db/entity/match.js'

export const createMatchInfo = async (matchMode, instanceHost, instancePort) => {
    try {
        const newMatch = await db.getRepository("Match").save({
            mode: matchMode,
            instance_host: instanceHost,
            instance_port: instancePort,
            is_over: false
        })
        return newMatch
    } catch (err) {
        throw err
    }
}

export const getMatchInfo = async (matchId) => {
    try {
        const match = await db.getRepository("Match").findOne({ where: { id: matchId } })
        if (match == null) { return null }
        const players = await db.getRepository("MatchPlayer").find({ where: { match_id: matchId } })

        return {
            ...match,
            players: players
        }
    } catch (err) {
        throw err
    }
}

export const addPlayerToMatch = async (matchId, players) => {
    try {
        const repo = db.getRepository("MatchPlayer")
        const matchPlayers = players.map(player => repo.save({
            ...player,
            match_id: matchId
        }))
        return await Promise.all(matchPlayers)
    } catch (err) {
        throw err
    }
}

export const findPlayerInMatch = async (playerId, matchId) => {
    try {
        const info = await db.manager
            .createQueryBuilder(MatchPlayer, "player")
            .where("player.match_id = :matchId AND player.user_id = :playerId", { matchId: matchId, playerId: playerId })
            .getOne()
        return info
    } catch (error) {
        throw error
    }
}