#!/usr/bin/env node

import { Command } from "commander";
import { run } from "..";
import pkg from "../package.json";

function commaSeparatedList(value: string) {
    return value.split(',');
}

const program = new Command();
program.name('substreams-sink-csv')
    .version(pkg.version, '-v, --version', 'version for substreams-sink-csv')

program.command('run')
    .description('Fills CSV file from a substreams Wintston logger map output')
    .argument('<spkg>', 'URL or IPFS hash of Substreams package')
    .option('-o --out <string>', 'Write output to <file>', "out.csv")
    .option('-m --output-module <string>', 'Name of the output module (declared in the manifest)', "db_out")
    .option('-e --substreams-endpoint <string>', 'Substreams gRPC endpoint', 'mainnet.eth.streamingfast.io:443')
    .option('-s --start-block <int>', 'Start block to stream from. Defaults to -1, which means the initialBlock of the first module you are streaming', "-1")
    .option('-t --stop-block <string>', 'Stop block to end stream at, inclusively.', "0")
    .option('--columns <items>', 'Output columns (comma separated list).', commaSeparatedList, ["timestamp", "block_num"])
    .option('--add-header-row <bool>', 'Add the name of the columns to the first row of the file ', true)
    .option('--append', 'Append data to output file.')
    .option('--delimiter', 'Character used to separate values in CSV file.', ",")

    .action(run);

program.command('completion').description('Generate the autocompletion script for the specified shell');

program.command('help').description('Display help for command');

program.parse();
