import fs from "fs";
import { Substreams, download } from "substreams";
import { parseDatabaseChanges } from "./src/database_changes";
import { writeHeaders, writeRows } from "./src/csv";
import { logger } from "./src/logger";

export * from "./src/csv";
export * from "./src/database_changes";

export async function run(spkg: string, args: {
    outputModule?: string,
    startBlock?: string,
    stopBlock?: string,
    substreamsEndpoint?: string,
    addHeaderRow?: boolean,
    out?: string,
    columns?: string[],
    append?: boolean,
    delimiter?: string,
} = {}) {
    // User params
    const messageTypeName = "sf.substreams.sink.database.v1.DatabaseChanges";
    if ( !args.outputModule ) throw new Error("[outputModule] is required");
    if ( !args.out ) throw new Error("[out] is required");
    if ( !args.delimiter ) throw new Error("[delimiter] is required");
    
    const delimiter = args.delimiter;
    const columns = args.columns;
    if ( !columns?.length ) throw new Error("[columns] cannot be empty");
    
    // create write stream
    const writer = fs.createWriteStream(args.out, args.append ? {flags: "a"} : {});

    // write headers if file does not exists)
    const exists = fs.existsSync(args.out);
    if ( args.addHeaderRow ) {
        if ( exists && args.append ) { /* do nothing */ }
        else if ( !exists && args.append ) writeHeaders(writer, columns, delimiter);
        else writeHeaders(writer, columns, delimiter);
        logger.info('addHeaderRow', {columns})
    }

    // Initialize Substreams
    const substreams = new Substreams(args.outputModule, {
        productionMode: true,
        host: args.substreamsEndpoint,
        startBlockNum: args.startBlock,
        stopBlockNum: args.stopBlock,
        authorization: process.env.STREAMINGFAST_KEY // or SUBSTREAMS_API_TOKEN
    });

    // Download Substream from URL or IPFS
    const { modules, registry } = await download(spkg);

    // Find Protobuf message types from registry
    const DatabaseChanges = registry.findMessage(messageTypeName);
    if (!DatabaseChanges) throw new Error(`Could not find [${messageTypeName}] message type`);

    substreams.on("mapOutput", (output, clock) => {
        // Handle map operations
        if (!output.data.mapOutput.typeUrl.match(messageTypeName)) return;
        if (output.name != args.outputModule) return;
        const decoded = DatabaseChanges.fromBinary(output.data.mapOutput.value) as any;
        const databaseChanges = parseDatabaseChanges(decoded, clock)
        writeRows(writer, databaseChanges, columns, delimiter);
        logger.info('writer.write', {databaseChanges: databaseChanges.length})
    });

    // start streaming Substream
    await substreams.start(modules);
}
