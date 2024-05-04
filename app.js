const xlsx = require('xlsx-populate');
xlsx.fromBlankAsync()
    .then(workbook => {
        workbook.sheet(0).cell("A1").value("Hello, World!");
        return workbook.toFileAsync("./test.xlsx");
    });