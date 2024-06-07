import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './entities/attendance.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
