import db from '../db/db.js'

export const createMatchInfo = async (matchMode) => {
    try {
        const newMatch = await db.getRepository("Match").save({
            mode: matchMode
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
            id: matchId,
            mode: match.mode,
            players: players
        }
    } catch (err) {
        throw err
    }
}

export const addPlayerToMatch = async (matchId, players) => {
    try {
        console.log(players)
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