import parquet from "parquetjs";

export const schema = new parquet.ParquetSchema({
    clock: {
        fields: {
            id: { type: 'UTF8' },
            number: { type: 'UINT_64'},
            //     fields: {
            //         seconds: { type: 'INT_64' },
            //         nanos: { type: 'INT_32' }
            //     }
            // }
        }
    },
    user_id: { type: 'UTF8'},
    from: { type: 'UTF8'},
    to: { type: 'UTF8'},
    quantity: { type: 'UTF8'},
    contract: { type: 'UTF8'},
    fee: { type: 'UTF8'},
    value: { type: 'UTF8'},
    memo: { type: 'UTF8'},
    project_id: { type: 'UTF8'},
    created_at: { type: 'UTF8'},
    trx_id: { type: 'UTF8'},

    // id: {type: "UTF8"},
    // entity: {type: "UTF8"},
    // ordinal: {type: "UTF8"},
    // operation: {type: "UTF8"},
    // changes: {
    //     repeated: true,
    //     fields: {
    //         name: {
    //             type: "UTF8"
    //         },
    //         // newValue: {
    //         //     fields: {
    //         //         string: {
    //         //             type: "UTF8"
    //         //         }
    //         //     }
    //         // },
    //     }
    // }

    // entityChanges: {
    //     repeated: true,
    //     fields: {
    //         // id: {type: "UTF8"},
    //         entity: {type: "UTF8"},
    //         // ordinal: {type: "UTF8"},
    //         // operation: {type: "UTF8"},
    //         // ["fields"]: {
    //         //     repeated: true,
    //         //     fields: {
    //         //         name: {
    //         //             type: "UTF8"
    //         //         },
    //         //         newValue: {
    //         //             type: "UTF8"
    //         //         },
    //         //     }
    //         // }
    //     }
    // }
});