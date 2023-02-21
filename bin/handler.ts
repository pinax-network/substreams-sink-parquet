import { WriteStream } from "fs"
import { Clock } from "substreams";

export function handleOperation(operation: WinstonOperation, clock: Clock, writer: WriteStream, columns: string[], delimiter: string) {
    let items = [clock.timestamp?.seconds, clock.number, operation.service, operation.level, operation.message];
    for ( const column of columns ) {
        const item: string = (operation.meta as any)[column];
        if ( !item) items.push(""); // if blank
        else if ( item.includes(delimiter)) items.push(`"${item}"`); // exception when value contains delimiter
        else items.push(item);
    }
    writer.write(items.join(delimiter) + "\n");
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