import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('create')
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    try{
      const newAttendance = await this.attendanceService.create(createAttendanceDto);
      if(newAttendance._id!="500"){
        return newAttendance;
    }else{
        return{
            _id:'500'
        }
    }
  }
  catch(error){
    return{
        _id:'500'
    }
  }
  }
}
