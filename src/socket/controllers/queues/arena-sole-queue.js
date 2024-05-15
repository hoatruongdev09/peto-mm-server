
export const ARENA_SOLE_MODE = "arena_sole"
export const ARENA_SOLE_MODE_PLAYERS = 8
export const ARENA_SOLE_QUEUE_TIMEOUT = 1000
export const ARENA_SOLE_ADD_BOT_TIMEOUT = 5000

import socketEventIds from "../../socket-event-id.js";
import randomHero from './bot-data-set.js'
export class ArenaSoleQueue {
    constructor(averageElo, region, onConfirmMatch) {
        this.averageElo = averageElo
        this.region = region
        this.onConfirmMatch = onConfirmMatch
        this.players = []

        this.isConfirmed = false

        this.timeOutId = setTimeout(this.onTimeOut, ARENA_SOLE_QUEUE_TIMEOUT);
        this.addBotTimeOutId = null
    }

    getMode = () => { return ARENA_SOLE_MODE }

    isAvailable = () => {
        return this.players.length < ARENA_SOLE_MODE_PLAYERS && !this.isConfirmed
    }

    onTimeOut = () => {
        this.addBotTimeOutId = setTimeout(this.onAddBotTimeOut, ARENA_SOLE_ADD_BOT_TIMEOUT)
    }
    onAddBotTimeOut = () => {
        if (this.isConfirmed) { return; }
        this.addBot()
        this.addBotTimeOutId = setTimeout(this.onAddBotTimeOut, ARENA_SOLE_ADD_BOT_TIMEOUT)
    }

    addPlayer = (socket) => {
        const userId = socket.userId
        const ip = socket.handshake.address
        console.log(`${userId} join match making: `, socket.findMatchData)
        const playerData = {
            userId: socket.userId,
            ip: ip,
            isBot: false,
            findMatchData: {
                ...socket.findMatchData,
                team: 1
            },
            socket
        }
        this.removeBot(1)
        this.doAddPlayer(playerData);

        socket.on('disconnect', () => this.playerDisconnect(userId));
    }


    doAddPlayer(playerData) {
        this.players.push(playerData);
        const playersData = {
            current: this.players.length,
            max: ARENA_SOLE_MODE_PLAYERS
        };
        this.broadcast(socketEventIds.queuePlayerChanges, playersData);

        if (this.players.length == ARENA_SOLE_MODE_PLAYERS) {
            this.confirmQueue();
        }
    }

    randomBotId = () => {
        let id = Math.floor(Math.random() * 99999)
        const usedIds = this.players.map(player => player.userId)
        while (usedIds.indexOf(id) != -1) {
            id = Math.floor(Math.random() * 99999)
        }
        return id
    }

    addBot = () => {
        const heroData = randomHero()
        const playerData = {
            userId: this.randomBotId(),
            ip: null,
            isBot: true,
            findMatchData: {
                ...heroData,
                team: 1
            }
        }
        console.log("add bott: ", playerData)
        this.doAddPlayer(playerData);
    }

    removeBot = (count) => {
        let currentCount = 0;
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].isBot) {
                this.players.splice(i, 1)
                currentCount++
            }
            if (currentCount == count) { break }
        }
    }

    confirmQueue = () => {
        if (this.addBotTimeOutId != null) {
            clearTimeout(this.addBotTimeOutId)
        }
        clearTimeout(this.timeOutId)
        this.isConfirmed = true
        this.onConfirmMatch(true, this)
    }

    playerDisconnect = (userId) => {
        if (this.isConfirmed) { return }
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId != userId) { continue }
            this.players.splice(i, 1)

            const playersData = {
                current: this.players.length,
                max: ARENA_SOLE_MODE_PLAYERS
            }
            this.broadcast(socketEventIds.queuePlayerChanges, playersData)

            break
        }
        if (this.players.filter(player => !player.isBot).length == 0) {
            this.cancelQueue()
            return
        }

    }

    cancelQueue = () => {
        clearTimeout(this.timeOutId)
        if (this.addBotTimeOutId != null) {
            clearTimeout(this.addBotTimeOutId)
        }
        this.isConfirmed = true
        this.onConfirmMatch(false, this)
    }

    broadcast = (message, data) => {
        this.players.forEach(player => {
            player.socket?.emit(message, data)
        })
    }

    dispose = () => {
        console.log("disposed queue")
        setTimeout(() => {
            this.players.forEach(player => {
                player.socket?.disconnect()
            }, 10000)
        })
    }
}

