import net from 'net'
import { spawn } from 'child_process'



const linuxProcessPath = './server.x86_64'

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
    try {

        const child = spawn(linuxProcessPath, args)

        child.stdout.on("data", (data) => {
            console.log(`match ${gameId} ${port} data: ${data}`);
        });
        child.on("spawn", () => {
            console.log(`match ${gameId} ${port} spawned`);
        });
        child.on("disconnect", (code, signal) => {
            console.log(`match ${gameId} ${port} closed ${code} ${signal}`);
        });
        child.on("message", (code, signal) => {
            console.log(`match ${gameId} ${port} message ${code} ${signal}`);
        });
        child.on("error", (code, signal) => {
            console.log(`match ${gameId} ${port} error ${code} ${signal}`);
        });
        child.on("exit", (code, signal) => {
            console.log(`match ${gameId} ${port} exit ${code} ${signal}`);
        });

    } catch (err) {

    }
    return {
        gameId, host, port
    }
}

export default createInstance