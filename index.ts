import { ParquetWriter } from "./src/parquet";
import { download, createHash, Clock } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";

import pkg from "./package.json";

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
    const substreams = run(spkg, moduleName, options);

    const schema = {};
    const filepath = "test.parquet";
    const opts = {};
    const writer = await ParquetWriter.openFile(schema, filepath, opts);

    substreams.on("anyMessage", async (message: any, clock: Clock, typeName: string) => {
        console.log({message, clock, typeName});
        writer.appendRow(message);
    });
    substreams.start(options.delayBeforeStart);
}
