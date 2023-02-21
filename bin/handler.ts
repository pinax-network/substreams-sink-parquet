import { WriteStream } from "fs"
import { Clock } from "substreams";

export function handleOperation(operation: WinstonOperation, clock: Clock, writer: WriteStream, base_columns: string[], meta_columns: string[], delimiter: string) {
    // handle clock timestamp
    const seconds = Number(clock.timestamp?.seconds);
    const nanos = Number(clock.timestamp?.nanos);
    const ms = nanos / 1000000;
    const timestamp = seconds * 1000 + ms;
    const date = new Date(timestamp);

    // base columns
    let items: string[] = [];
    const base = {
        date: date.toISOString(),
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        day: date.getUTCDay(),
        timestamp,
        seconds,
        block_num: clock.number,
        block_number: clock.number,
        service: operation.service,
        level: operation.level,
        message: operation.message,
    } as any;

    push_columns(items, base, base_columns, delimiter);
    push_columns(items, operation.meta as any, meta_columns, delimiter);

    writer.write(items.join(delimiter) + "\n");
}

function push_columns(items: string[], object: {[key: string]: string}, columns: string[], delimiter: string) {
    for ( const column of columns ) {
        const item: string = object[column];
        if ( !item.length ) items.push(""); // if blank
        else if ( item.includes(delimiter)) items.push(`"${item}"`); // exception when value contains delimiter
        else items.push(item);
    }
}

enum LoggingLevels {
    // UNSPECIFIED = 0; // Unspecified: default value
    EMERG = 0,       // Emergency: system is unusable
    ALERT = 1,       // Alert: action must be taken immediately
    CRIT = 2,        // Critical: critical conditions
    ERROR = 3,       // Error: error conditions
    WARNING = 4,     // Warning: warning conditions
    NOTICE = 5,      // Notice: normal but significant condition
    INFO = 6,        // Informational: informational messages
    DEBUG = 7,       // Debug: debug-level messages
}

interface WinstonOperation {
    service: string;
    level: LoggingLevels;
    message: string;
    meta: Map<string, string>;
}