# [`Substreams`](https://substreams.streamingfast.io/) [Parquet](https://parquet.apache.org) sink module

[<img alt="github" src="https://img.shields.io/badge/Github-substreams.csv-8da0cb?style=for-the-badge&logo=github" height="20">](https://github.com/pinax-network/substreams-sink-parquet)
[<img alt="npm" src="https://img.shields.io/npm/v/substreams-sink-parquet.svg?style=for-the-badge&color=CB0001&logo=npm" height="20">](https://www.npmjs.com/package/substreams-sink-parquet)
[<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/pinax-network/substreams-sink-parquet/ci.yml?branch=main&style=for-the-badge" height="20">](https://github.com/pinax-network/substreams-sink-parquet/actions?query=branch%3Amain)

> `substreams-sink-parquet` fills Parquet file format.

### Further resources

- [Parquet: more than just "Turbo CSV"](https://csvbase.com/blog/3)
- [Substreams documentation](https://substreams.streamingfast.io)
- [Substreams `DatabaseChanges`](https://github.com/streamingfast/substreams-database-change)

## CLI
[**Use pre-built binaries**](https://github.com/pinax-network/substreams-sink-parquet/releases)
- [x] MacOS
- [x] Linux
- [x] Windows

**Install** globally via npm
```
$ npm install -g substreams-sink-parquet
```

## Schema
**schema.yaml**

```yaml
name:
  type: 'UTF8'
colours:
  type: 'UTF8'
  repeated: true
stock:
  repeated: true
  fields:
    price:
      type: 'DOUBLE'
    quantity:
      type: 'INT64'
```

**Run**
```
$ substreams-sink-parquet run [options] <spkg>
```

## Features
- [ ] Create Schema `schema.yaml` file based on Substreams `spkg` file
- [ ] Output to `.parquet` file binary format
