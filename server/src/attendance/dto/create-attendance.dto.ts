export class CreateAttendanceDto {
    constructor(
        public readonly Mssv: string,
        public readonly Name: string,
        public readonly Date: Date,
        public readonly Class: string,
        public readonly Session: string,
    ) {
    }
}
