import fs from "fs";
import { Substreams, download } from "substreams";
import { handleOperation } from "./handler";

export async function run(spkg: string, args: {
    outputModule?: string,
    startBlock?: string,
    stopBlock?: string,
    substreamsEndpoint?: string,
    port?: string,
    address?: string,
    out?: string,
    meta?: string[],
    append?: boolean,
} = {}) {
    // User params
    const messageTypeName = "pinax.substreams.sink.winston.v1.LoggerOperations";
    if ( !args.outputModule ) throw new Error("Missing outputModule");
    if ( !args.out ) throw new Error("Missing out file");

    // TO-DO: add as argument
    const delimiter = ",";

    // create write stream
    // TO-DO: support append & no-append
    const writer = fs.createWriteStream(args.out, args.append ? {flags: "a"} : {});
    const meta_columns = args.meta || [];
    const base_columns = [
        "timestamp",
        "block_num",
        "service",
        "level",
        "message",
    ];

    // write headers if file does not exists
    // TO-DO: support no headers
    if ( !args.append || !fs.existsSync(args.out) ) {
        writer.write([...base_columns, ...meta_columns].join(delimiter) + "\n");
    }

    // Initialize Substreams
    const substreams = new Substreams(args.outputModule, {
        host: args.substreamsEndpoint,
        startBlockNum: args.startBlock,
        stopBlockNum: args.stopBlock,
        authorization: process.env.STREAMINGFAST_KEY // or SUBSTREAMS_API_TOKEN
    });

    // Download Substream from URL or IPFS
    const { modules, registry } = await download(spkg);

    // Find Protobuf message types from registry
    const LoggerOperations = registry.findMessage(messageTypeName);
    if (!LoggerOperations) throw new Error(`Could not find [${messageTypeName}] message type`);

    substreams.on("mapOutput", (output, clock) => {
        // Handle map operations
        if (!output.data.mapOutput.typeUrl.match(messageTypeName)) return;
        const decoded = LoggerOperations.fromBinary(output.data.mapOutput.value);
        for ( const operation of decoded.operations ) {
            handleOperation(operation.toJson(), clock, writer, meta_columns, delimiter);
        }
    });

    // start streaming Substream
    await substreams.start(modules);
}
