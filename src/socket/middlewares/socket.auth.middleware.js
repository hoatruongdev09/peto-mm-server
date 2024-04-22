import { jwtDecode } from "jwt-decode";

const authenticate = (socket, next) => {
    // TODO: authenticate job

    const { token, hero, weapon, mode, region, hero_skin = 1 } = socket.handshake.query
    const { user_id, iat } = jwtDecode(token)

    socket.userId = user_id
    socket.userElo = 0
    socket.findMatchData = {
        hero, weapon, mode, region, hero_skin
    }
    next()
}

export default authenticate