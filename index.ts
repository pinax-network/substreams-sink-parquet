// import PQueue from 'p-queue';
// import { ParquetWriter } from "./src/parquet";
import { download, createHash, Clock, EntityChange, EntityChanges } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import parquet from "parquetjs";

import pkg from "./package.json";
import { schema } from "./schema";

logger.defaultMeta = { service: pkg.name };
export { logger };

export const DEFAULT_SCHEMA = "schema.yaml";

// Custom user options interface
interface ActionOptions extends RunOptions {
}

export async function action(manifest: string, moduleName: string, options: ActionOptions) {
    // Download substreams and create hash
    const spkg = await download(manifest);
    const hash = createHash(spkg);

    // Get command options
    const { } = options;

    // Run substreams
    options.cursorFile = undefined;
    const substreams = run(spkg, moduleName, options);
    const path = "test.parquet";
    const opts = {};
    const writer = await parquet.ParquetWriter.openFile(schema, path, opts);
    // const queue = new PQueue({concurrency: 1});
    let count = 0;

    substreams.on("anyMessage", async (message: EntityChanges, clock: Clock, typeName: string) => {
        count ++;
        for ( const entityChange of message.entityChanges) {
            const fields: any = {};
            for ( const {name, newValue} of entityChange.fields) {
                if (newValue) {
                    if ( newValue.typed.case == "string") {
                        fields[name] = newValue.typed.value;
                    }
                }
            }
            await writer.appendRow({clock, ...fields})
        }
        // queue.add(() => writer.appendRow({...message, clock}));
    });
    substreams.on("end", async () => {
        await writer.close()
        // queue.add(() => writer.close());
        console.log(count)
    })
    substreams.start(options.delayBeforeStart);
}
