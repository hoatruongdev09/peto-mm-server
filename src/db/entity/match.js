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
            type: 'varchar',
            nullable: true,
        },
        instance_port: {
            type: 'int',
            nullable: true
        },
        is_over: {
            type: 'boolean',
            default: false
        },
        duration: {
            type: 'bigint'
        }
    }
})

export default Match