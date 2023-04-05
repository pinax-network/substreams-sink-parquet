#!/usr/bin/env node

import parquet from "parquetjs";
import { cli } from "substreams-sink";
import { DEFAULT_OUT, DEFAULT_SCHEMA, action } from "../index.js"
import pkg from "../package.json";

const program = cli.program(pkg);
const command = cli.run(program, pkg);
command.option('--schema <string>', 'Parquet schema.', DEFAULT_SCHEMA)
command.option('--out <string>', 'Out filepath.', DEFAULT_OUT)
command.action(action);

program.command('read')
    .argument('<input file>', "Parquet file to read")
    .action(async filepath => {
        const reader = await parquet.ParquetReader.openFile(filepath);
        const cursor = reader.getCursor();
        let record = null;
        while (record = await cursor.next()) {
          console.log(record);
        }
    })
program.parse();

