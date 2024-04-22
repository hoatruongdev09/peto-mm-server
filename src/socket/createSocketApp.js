import { Server } from "socket.io"
import authenticate from "./middlewares/socket.auth.middleware.js"

import matchMakingController from "./controllers/matchmaking.controller.js"

const createSocketApp = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    })

    io.use(authenticate)

    io.on('connection', (socket) => {
        matchMakingController.joinMatchMaking(socket)
    })

    return io
}



export default createSocketApp