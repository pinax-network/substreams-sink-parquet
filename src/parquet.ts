import { PathLike, WriteStream } from "fs";
import parquet, { ParquetSchema } from "parquetjs";

export interface ParquetWriterOpts {
    autoClose?: boolean | undefined;
    bitWidth?: number | undefined;
    disableEnvelope?: boolean | undefined;
    encoding?: string | undefined;
    fd?: number | undefined;
    flags?: string | undefined;
    mode?: number | undefined;
    rowGroupSize?: number | undefined;
    start?: number | undefined;
    useDataPageV2?: boolean | undefined;
}

export class ParquetWriter {
    static async openFile(schema: ParquetSchema, path: PathLike, opts?: ParquetWriterOpts) {
        return parquet.ParquetWriter.openFile(schema, path, opts);
    }

    static async openStream(schema: ParquetSchema, outputStream: WriteStream, opts?: ParquetWriterOpts) {
        return parquet.ParquetWriter.openStream(schema, outputStream, opts);
    }

    async appendRow(message: any) {
        console.log(message);
    }

    async close() {
        console.log("closed");
    }
}
