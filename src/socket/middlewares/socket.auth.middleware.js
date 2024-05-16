import { jwtDecode } from "jwt-decode";

const authenticate = (socket, next) => {
    // TODO: authenticate job
    console.log(socket.handshake.address)
    const { token, hero, weapon, mode = "arena_sole", region = "vn", hero_skin = 1, has_betting = false } = socket.handshake.query
    const { user_id, iat } = jwtDecode(token)
    socket.userId = user_id
    socket.userElo = 0
    socket.findMatchData = {
        hero, weapon, mode, region, hero_skin, has_betting
    }
    next()
}

export default authenticate