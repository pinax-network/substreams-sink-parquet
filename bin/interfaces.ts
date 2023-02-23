// export enum LoggingLevels {
//     // UNSPECIFIED = 0; // Unspecified: default value
//     EMERG = 0,       // Emergency: system is unusable
//     ALERT = 1,       // Alert: action must be taken immediately
//     CRIT = 2,        // Critical: critical conditions
//     ERROR = 3,       // Error: error conditions
//     WARNING = 4,     // Warning: warning conditions
//     NOTICE = 5,      // Notice: normal but significant condition
//     INFO = 6,        // Informational: informational messages
//     DEBUG = 7,       // Debug: debug-level messages
// }

// export interface WinstonOperation {
//     service: string;
//     level: LoggingLevels;
//     message: string;
//     meta: Map<string, string>;
// }

export interface DatabaseChanges {
    tableChanges: TableChange[];
}

export enum Operation {
    UNSET = 0,    // Protobuf default should not be used, this is used so that the consume can ensure that the value was actually specified
    CREATE = 1,
    UPDATE = 2,
    DELETE = 3,
}
  
export interface TableChange {
    table: string;
    pk: string;
    ordinal: number;
    operation: Operation;
    fields: Field[];
}

export interface Field {
    name: string;
    newValue: string;
    oldValue: string;
}