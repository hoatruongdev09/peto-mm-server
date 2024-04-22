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
        instance_host: {
            type: 'varchar'
        },
        instance_port: {
            type: 'int'
        },
        is_over: {
            type: 'boolean',
            default: false
        }
    }
})

export default Match