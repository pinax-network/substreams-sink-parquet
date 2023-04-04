#!/usr/bin/env node

import { cli } from "substreams-sink";
import { DEFAULT_SCHEMA, action } from "../index.js"
import pkg from "../package.json";

const program = cli.program(pkg);
const command = cli.run(program, pkg);
command.option('--schema', 'Parquet schema.', DEFAULT_SCHEMA)
command.action(action);
program.parse();
