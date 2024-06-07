import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './entities/attendance.entity';
import { Model } from 'mongoose';

@Injectable()
export class AttendanceService {
    constructor(
      @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    ){}
    async create(createAttendanceDto: CreateAttendanceDto) {
      try{
        const attendance = new this.attendanceModel(createAttendanceDto);
        const newAttendance =  await attendance.save();
        if(newAttendance._id.toString().length > 0){
          return newAttendance;
        }return{
          _id:'500'
        }
      }
      catch(error){
        return{
          _id:'500'
        }
      }
    }
}
