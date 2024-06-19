export class CreateExcelDto {
    constructor(
        public users: [],
        public workSheetColumnName: [],
        public workSheetName: string,
        public filePath: string,
    ){}
}
