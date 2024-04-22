import express from 'express'
import matchRoute from './route/match.js'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.status(200).json({ result: "ok" })
})

app.use('/v1/match', matchRoute)

export default app