import { EntitySchema } from "typeorm"

const MatchPlayer = new EntitySchema({
    name: "MatchPlayer",
    tableName: "match_player",
    columns: {
        user_id: {
            primary: true,
            type: 'int',
        },
        match_id: {
            primary: true,
            type: 'int'
        },
        hero: {
            type: 'int'
        },
        weapon: {
            type: 'int'
        },
        hero_skin: {
            type: 'int'
        },
        position: {
            type: 'int',
            default: 0
        },
        team: {
            type: 'int',
            default: 1
        },
        bot: {
            type: 'boolean',
            default: false,
        },
        bot_id: {
            type: 'int',
            default: -1
        },
        betting_amount: {
            type: 'bigint',
            default: null
        }
    }
})

export default MatchPlayer