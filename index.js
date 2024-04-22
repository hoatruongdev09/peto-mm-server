import { createServer } from 'node:http'
import app from './src/api/createExpressApp.js'
import createSocketApp from './src/socket/createSocketApp.js'

const server = createServer(app)
createSocketApp(server)

const port = process.env.PORT || 8000
server.listen(port, () => {
    console.log(`server running on port: ${port}`)
})