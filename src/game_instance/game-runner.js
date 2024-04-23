import net from 'net'
import { spawn } from 'child_process'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


const linuxProcessPath = __dirname + '/server.x86_64'

const getNetworkIP = (callback) => {
    var socket = net.createConnection(80, "www.google.com");
    socket.on("connect", function () {
        callback(socket.address().address);
        socket.end();
    });
}

let hostIP = "localhost"
getNetworkIP((address) => {
    hostIP = address
    console.log("address: ", address)
})

const portMap = new Map()

for (let i = 8001; i < 9999; i++) {
    portMap.set(i, false)
}

const createHostData = () => {
    let port = 8001
    for (; port < 9999; port++) {
        if (portMap[port]) { continue }
        portMap[port] = true
        break
    }
    return {
        host: hostIP,
        port
    }
}
const createInstance = (gameId, host, port) => {

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
            portMap.set(port, false)
        });

    } catch (err) {
        console.error(err)
    }
}
export {
    hostIP,
    createInstance,
    createHostData
}