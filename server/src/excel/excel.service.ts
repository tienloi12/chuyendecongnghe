import { Injectable } from '@nestjs/common';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';
import { log } from 'console';
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const xlsxPopulate = require('xlsx-populate');

@Injectable()
export class ExcelService {

  exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    log(data, workSheetColumnNames, workSheetName, filePath);
    try{
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ... data
    ];

    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, filePath);
    console.log(workSheet);
    log(path.resolve(filePath))
    log(workBook);
    log(workSheetData);

    
    
    return true;
  }catch(err){
    console.log(err);
    return false;
  }
}
  exportUsersToExcel = (users, workSheetColumnNames, workSheetName, filePath) => {
    const data = users.map(user => {
        return [user.id, user.name, user.age];
    });
    return this.exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}

}
