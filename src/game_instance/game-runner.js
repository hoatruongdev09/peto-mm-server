import net from 'net'
import { spawn } from 'child_process'
import { networkInterfaces } from 'os'

const linuxProcessPath = __dirname + './server.x86_64'

const getNetworkIP = (callback) => {
    var socket = net.createConnection(80, "www.google.com");
    socket.on("connect", function () {
        callback(socket.address().address);
        socket.end();
    });
}

let hostIP = "localhost"
getNetworkIP((address) => { hostIP = address })


const createInstance = (gameId) => {
    const host = hostIP
    const port = 8001

    const args = ["-game_id", `${gameId}`, "-host", `${host}`, "-port", `${port}`]
    const child = spawn(linuxProcessPath, args)

    child.stdout.on("spawn", () => {
        console.log(`instance ${gameId} spawned`)
    })

    return {
        gameId, host, port
    }
}

export default createInstance