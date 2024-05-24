import { ArenaSoleQueue, ARENA_SOLE_MODE } from "./queues/arena-sole-queue.js";
import { createMatchInfo, addPlayerToMatch, MATCH_BETTING_AMOUNT, createMatchMakingData } from '../../provider/match.provider.js'
import socketEventId from "../socket-event-id.js";
import { createInstance } from "../../game_instance/game-runner.js";

class MatchMakingController {
    constructor() {
        this.queues = []
    }

    joinMatchMaking = (socket) => {
        const { region, mode } = socket.findMatchData
        const queue = this.getOrCreateQueue(socket.userElo, region, mode)
        if (queue == null) {
            return
        }
        queue.addPlayer(socket)
    }

    getOrCreateQueue = (elo, region, gameMode) => {
        const differentElo = this.getDifferentElo(elo)

        const availableQueues = this.queues.filter(queue => queue.isAvailable() &&
            elo >= queue.averageElo - differentElo &&
            elo <= queue.averageElo + differentElo &&
            queue.region == region
        )


        if (availableQueues.length == 0) {
            return this.createQueue(elo, region, gameMode)
        }

        return this.queues[0]
    }

    createQueue = (elo, region, gameMode) => {
        let queue = null
        switch (gameMode) {
            case ARENA_SOLE_MODE:
                queue = new ArenaSoleQueue(elo, region, this.onOnQueueConfirmed)
                break
        }
        if (queue != null) {
            this.queues.push(queue)
        }
        return queue
    }

    removeQueue = (queue) => {
        for (let i = 0; i < this.queues.length; i++) {
            if (this.queues[i] != queue) { continue }
            this.queues.splice(i, 1)
            queue.dispose()
            break
        }
    }

    onOnQueueConfirmed = async (isConfirm, queue) => {
        if (isConfirm) {
            await this.createMatchForQueue(queue)
        }
        this.removeQueue(queue)
    }

    createMatchForQueue = async (queue) => {
        try {
            const match = await createMatchInfo(queue.getMode())
            const ipList = queue.players.filter(player => player.ip !== null).map(player => player.ip.replace('::ffff:', ''))

            const players = queue.players.map(player => {
                const { userId, isBot, findMatchData } = player
                const { hero, weapon, hero_skin, team, has_betting, bot_id = -1 } = findMatchData
                return {
                    user_id: userId,
                    hero: hero.id,
                    weapon: weapon.id,
                    hero_skin,
                    team,
                    bot: isBot,
                    bot_id: bot_id,
                    betting_amount: (has_betting != null && has_betting.toLowerCase()) === "true" ? MATCH_BETTING_AMOUNT : null
                }
            })
            await addPlayerToMatch(match.id, players)
            console.log("create instance: ", ipList)
            const { data } = await createInstance(match.id, ipList)
            await createMatchMakingData(match.id, data.request_id)
            queue.broadcast(socketEventId.matchCreated, {
                match_id: match.id,
            })
        } catch (err) {
            console.error(err)
        }

    }

    getDifferentElo = (elo) => {
        return 100
    }

}

export default new MatchMakingController()