import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AttendanceDocument = HydratedDocument<Attendance>;

Schema({timestamps: true})
export class Attendance {
    @Prop({required: true})
    Username: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
