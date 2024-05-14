import 'reflect-metadata'
import { DataSource } from "typeorm";
import Match from './entity/match.js'
import MatchPlayer from './entity/match.player.js'
import MatchMaking from './entity/matchmaking.js'

const db = new DataSource({
    type: "sqlite",
    database: './main.sqlite',
    synchronize: true,
    logging: true,
    entities: [
        Match,
        MatchPlayer,
        MatchMaking
    ]
})

db.initialize()

export default db