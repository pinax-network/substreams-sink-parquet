import parquet from "parquetjs";

(async () => {
    const reader = await parquet.ParquetReader.openFile('test.parquet');

    const cursor = reader.getCursor();
    let record = null;
    while (record = await cursor.next()) {
      console.log(record);
    }
})();
