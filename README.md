# [`Substreams`](https://substreams.streamingfast.io/) CSV sink module

[<img alt="github" src="https://img.shields.io/badge/Github-substreams.csv-8da0cb?style=for-the-badge&logo=github" height="20">](https://github.com/pinax-network/substreams-sink-csv)
[<img alt="npm" src="https://img.shields.io/npm/v/substreams-sink-csv.svg?style=for-the-badge&color=CB0001&logo=npm" height="20">](https://www.npmjs.com/package/substreams-sink-csv)
[<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/pinax-network/substreams-sink-csv/ci.yml?branch=main&style=for-the-badge" height="20">](https://github.com/pinax-network/substreams-sink-csv/actions?query=branch%3Amain)

> `substreams-sink-csv` fills CSV file from a [Substreams Winston Logger sink](https://github.com/pinax-network/substreams-sink-winston) map output.

### Further resources

- [Substreams documentation](https://substreams.streamingfast.io)
- [Substreams Winston Sink](https://github.com/pinax-network/substreams-sink-winston)

## CLI
[**Use pre-built binaries**](https://github.com/pinax-network/substreams-sink-csv/releases)
- [x] MacOS
- [x] Linux
- [x] Windows

**Install** globally via npm
```
$ npm install -g substreams-sink-csv
```

**Run**
```
$ substreams-sink-csv run [options] <spkg>
```

## Features
- Consume `*.spkg` from:
  - [x] Load URL or IPFS
  - [ ] Read from `*.spkg` local filesystem
  - [ ] Read from `substreams.yaml`
- Output as CSV file
  - [x] Set CSV delimiter
  - [x] Append or overwrite file
  - [x] Output filename (default `out.csv`)
- [x] Select `meta` columns to output
- [x] Select `base` columns to output
  - [x] Time (`date,year,month,day,timestamp,seconds`)
  - [x] Block (`block_num`)
  - [x] Winston (`service,level,message`)
- [x] Set `start-block` & `end-block`
- [x] Select `outputModule` (default `log_out`)
- [x] Select Substream endpoint (default `mainnet.eth.streamingfast.io:443`)
