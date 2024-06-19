import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AttendanceDocument = HydratedDocument<Attendance>;

Schema({timestamps: true})
export class Attendance {
    @Prop({required: true})
    Mssv: string;
    @Prop({required: true})
    Name: string;
    @Prop({required: true})
    Date: Date;
    @Prop({required: true})
    Class: string;
    @Prop({required: true})
    Session: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
