type Schema = any;

interface Options {

}

export class ParquetWriter {
    static async openFile(schema: Schema, path: string, opts: Options) {
        console.log(schema);
        return new ParquetWriter();
    }

    static async openStream(schema: Schema, outputStream: any, opts: Options) {
        console.log(schema);
    }

    async appendRow(message: any) {
        console.log(message);
    }

    constructor( ) {

    }
}
