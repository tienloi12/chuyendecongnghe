import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceModule } from './attendance/attendance.module';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nguyenminhkhoa1311:13112002@cluster0.rqtcddh.mongodb.net/'),
    AttendanceModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
