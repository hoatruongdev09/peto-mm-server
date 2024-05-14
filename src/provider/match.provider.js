import db from '../db/db.js'
import Match from '../db/entity/match.js'
import MatchPlayer from '../db/entity/match.player.js'
import MatchMaking from '../db/entity/matchmaking.js'
import { deleteInstance, getInstanceInfo } from '../game_instance/game-runner.js'

export const MATCH_BETTING_AMOUNT = 900
export const MATCH_BETTING_FEE = 90

export const createMatchInfo = async (matchMode) => {
    try {
        const newMatch = await db.getRepository("Match").save({
            mode: matchMode,
            is_over: false
        })
        return newMatch
    } catch (err) {
        throw err
    }
}

const calculateBettingData = (betPlayerCount, pool) => {
    const poolReward = pool - MATCH_BETTING_FEE * betPlayerCount

    if (betPlayerCount == 2) {
        return [poolReward]
    } else if (betPlayerCount == 3 || betPlayerCount == 4) {
        return [poolReward * 0.8, poolReward * 0.2]
    } else if (betPlayerCount == 5 || betPlayerCount == 6) {
        return [poolReward * 0.65, poolReward * 0.2, poolReward * 0.15]
    } else if (betPlayerCount == 7 || betPlayerCount == 8) {
        return [poolReward * 0.5, poolReward * 0.2, poolReward * 0.16, poolReward * 0.14]
    } else {
        return null
    }
}

export const getMatchInfo = async (matchId) => {
    try {
        const match = await db.getRepository("Match").findOne({ where: { id: matchId } })
        if (match == null) { return null }
        const players = await db.getRepository("MatchPlayer").find({ where: { match_id: matchId } })
        const betPlayerCount = players.filter(player => player.betting_amount != null).length
        const bettingPool = players.map(player => player.betting_amount ?? 0).reduce((total, num) => total + num)

        return {
            ...match,
            players: players,
            betting_rewards: calculateBettingData(betPlayerCount, bettingPool)
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

export const createMatchMakingData = async (gameId, edgeGapRequestId) => {
    try {
        const newData = await db.getRepository("MatchMaking").save({
            match_id: gameId,
            edge_gap_request_id: edgeGapRequestId
        })
        return newData
    } catch (error) {
        throw error
    }
}

export const getMatchMakingInfo = async (gameId) => {
    try {
        const data = await db.getRepository("MatchMaking").findOneBy({
            match_id: gameId
        })
        const deployInfo = await getInstanceInfo(data.edge_gap_request_id)
        return {
            match_id: data.match_id,
            ...deployInfo,
        }
    } catch (error) {
        throw error
    }
}

export const closeMatch = async (gameId) => {
    try {
        await db.createQueryBuilder().update(Match).set({ is_over: true }).where(
            "id=:id", { id: gameId }
        ).execute()
        const data = await db.getRepository("MatchMaking").findOneBy({
            match_id: gameId
        })
        await deleteInstance(data.edge_gap_request_id)
        return getMatchInfo(gameId)
    } catch (error) {
        throw error
    }
}