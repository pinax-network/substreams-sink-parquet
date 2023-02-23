import { WriteStream } from "fs"
import { Clock } from "substreams";
import { TableChange, DatabaseChanges, Operation } from "./interfaces";

export function handleDecoded(decoded: DatabaseChanges, clock: Clock, writer: WriteStream, columns: string[], delimiter: string) {
    for ( const operation of decoded.tableChanges ) {
        // handle clock timestamp
        const seconds = Number(clock.timestamp?.seconds);
        const nanos = Number(clock.timestamp?.nanos);
        const ms = nanos / 1000000;
        const timestamp = seconds * 1000 + ms;
        const date = new Date(timestamp).toISOString();
        const [year, month, day] = date.split("T")[0].split("-");

        // skip if not CREATE operation
        if ( operation.operation != Operation.CREATE ) return;

        // base data
        const base = {
            date,
            year,
            month,
            day,
            timestamp,
            seconds,
            block_num: clock.number,
            block_number: clock.number,
        } as any;

        // extracted json from `db_out` map output (will be override base data)
        const json = table_changes_to_json(operation);

        // write CSV in order of user specified columns
        let items: string[] = [];
        push_rows(items, Object.assign(base, json), columns, delimiter);
        if ( !items.length) return; // skip empty
        writer.write(items.join(delimiter) + "\n");
    }
}

function table_changes_to_json(operation: TableChange) {
    const json: any = {};
    for ( const { name, newValue } of operation.fields ) {
        json[name] = newValue;
    }
    return json;
}

function push_rows(items: string[], object: {[key: string]: string}, columns: string[], delimiter: string) {
    for ( const column of columns ) {
        const item: string = object[column];
        if ( !item ) items.push(""); // if blank
        else if ( typeof item == "string" && item.includes(delimiter)) items.push(`"${item}"`); // exception when value contains delimiter
        else items.push(item);
    }
}
