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
            type: 'varchar'
        },
        weapon: {
            type: 'varchar'
        },
        hero_skin: {
            type: 'int'
        },
        position: {
            type: 'int',
            default: null
        }
    },
    relations: {
        match_id: {
            target: 'Match',
            type: 'one-to-one',
            joinTable: true,
            cascade: true
        }
    }
})

export default MatchPlayer