
export const ARENA_SOLE_MODE = "arena_sole"
export const ARENA_SOLE_MODE_PLAYERS = 2
export const ARENA_SOLE_QUEUE_TIMEOUT = 30000

import socketEventIds from "../../socket-event-id.js";

export class ArenaSoleQueue {
    constructor(averageElo, region, onConfirmMatch) {
        this.averageElo = averageElo
        this.region = region
        this.onConfirmMatch = onConfirmMatch
        this.players = []

        this.isConfirmed = false

        this.timeOutId = setTimeout(this.onTimeOut, ARENA_SOLE_QUEUE_TIMEOUT);
    }

    getMode = () => { return ARENA_SOLE_MODE }

    isAvailable = () => {
        return this.players.length < ARENA_SOLE_MODE_PLAYERS && !this.isConfirmed
    }

    onTimeOut = () => {
        this.isConfirmed = true
        this.onConfirmMatch(true, this)
    }

    addPlayer = (socket) => {
        socket.team = 1
        const userId = socket.userId
        this.players.push({
            userId: socket.userId,
            isBot: false,
            findMatchData: socket.findMatchData,
            socket
        })
        socket.on('disconnect', (socket) => this.playerDisconnect(userId))
        const playersData = {
            current: this.players.length,
            max: ARENA_SOLE_MODE_PLAYERS
        }
        this.broadcast(socketEventIds.queuePlayerChanges, playersData)

        if (this.players.length == ARENA_SOLE_MODE_PLAYERS) {
            this.confirmQueue()
        }
    }

    confirmQueue = () => {
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

        if (this.players.length == 0) {
            this.cancelQueue()
            return
        }

    }

    cancelQueue = () => {
        clearTimeout(this.timeOutId)
        this.isConfirmed = true
        this.onConfirmMatch(false, this)
    }

    broadcast = (message, data) => {
        this.players.forEach(player => {
            player.socket?.emit(message, data)
        })
    }

    dispose = () => {
        setTimeout(() => {
            this.players.forEach(player => {
                player.socket.disconnect()
            }, 10000)
        })
    }
}

