import { WriteStream } from "fs";

export function writeRow(writer: WriteStream, values: string[], delimiter: string) {
    writer.write(values.join(delimiter) + "\n");
}

export function writeRows(writer: WriteStream, databaseChanges: {[key: string]: unknown}[], columns: string[], delimiter: string) {
    for ( const changes of databaseChanges ) {
        const row = json_to_row(changes, columns, delimiter);
        writeRow(writer, row, delimiter);
    }
}

// write headers if file does not exists
export function writeHeaders(writer: WriteStream, columns: string[], delimiter: string) {
    writeRow(writer, columns, delimiter);
}

export function json_to_row(object: {[key: string]: unknown}, columns: string[], delimiter: string) {
    const row = [];
    for ( const column of columns ) {
        const item = object[column];
        if ( !item ) row.push(""); // if blank
        else if ( typeof item == "string" && item.includes(delimiter)) row.push(`"${item}"`); // exception when value contains delimiter
        else row.push(String(item));
    }
    return row;
}
