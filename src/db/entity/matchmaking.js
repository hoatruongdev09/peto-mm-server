import { EntitySchema } from "typeorm";

const MatchMaking = new EntitySchema({
    name: "MatchMaking",
    tableName: "matchmaking",
    columns: {
        match_id: {
            primary: true,
            type: 'int'
        },
        edge_gap_request_id: {
            primary: true,
            type: 'varchar'
        }
    }
})

export default MatchMaking