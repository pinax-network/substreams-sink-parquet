import fs from "node:fs";
import { download, createHash, Clock, EntityChanges } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import parquet from "parquetjs";
import YAML from "yaml";

import pkg from "./package.json";

logger.defaultMeta = { service: pkg.name };
export { logger };

export const DEFAULT_SCHEMA = "schema.yaml";
export const DEFAULT_OUT = "out.parquet";
export const TYPE_NAME = "substreams.entity.v1.EntityChanges";

// Custom user options interface
interface ActionOptions extends RunOptions {
    schema: string;
    out: string;
}

export async function action(manifest: string, moduleName: string, options: ActionOptions) {
    // Download substreams and create hash
    const spkg = await download(manifest);
    const hash = createHash(spkg);

    // Parquet Schema read from YAML file
    const file = fs.readFileSync(options.schema, 'utf8')
    const schema = new parquet.ParquetSchema(YAML.parse(file));

    // DISABLE cursor (Parquet sink needs better handling)
    options.cursorFile = undefined;

    // Run substreams
    const substreams = run(spkg, moduleName, options);
    const writer = await parquet.ParquetWriter.openFile(schema, options.out);

    substreams.on("anyMessage", async (message: EntityChanges, clock: Clock, typeName: string) => {
        // Only supports for EntityChanges
        for ( const entityChange of message?.entityChanges || []) {
            const json = entityChange.toJson() as any;
            const fields: any = {};
            for ( const {name, newValue} of entityChange.fields) {
                if (newValue) fields[name] = newValue.typed.value;
            }
            await writer.appendRow({clock: {
                id: clock.id,
                number: clock.number,
                timestamp: clock.timestamp?.seconds
            }, module: {
                hash,
                type_name: typeName,
            }, entity_change: {
                entity: entityChange.entity,
                id: entityChange.id,
                ordinal: entityChange.ordinal,
                operation: json.operation,
            }, ...fields})
        }
    });
    substreams.on("end", async () => {
        await writer.close()
    })
    substreams.start(options.delayBeforeStart);
}
