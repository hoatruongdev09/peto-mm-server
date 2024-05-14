import { EntitySchema } from "typeorm";

const Match = new EntitySchema({
    name: "Match",
    tableName: "match",
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        mode: {
            type: 'varchar'
        },
        is_over: {
            type: 'boolean',
            default: false
        }
    }
})

export default Match