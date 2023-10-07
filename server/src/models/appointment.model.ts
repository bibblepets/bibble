import { Schema } from "mongoose";

const mongoose = require("mongoose");

const statuses = ["Pending", "Completed", "Cancelled", "Rejected"];

export interface IAppointment {
    _id: Schema.Types.ObjectId;
    listingId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    datetime: Date;
    status: string;
    remarks?: string;
}

const appointmentSchema = new Schema(
    {
        listingId: { type: Schema.Types.ObjectId, required: [true, 'Please specify the listing of this appointment.'] },
        userId: { type: Schema.Types.ObjectId, required: [true, 'Please specify the user that made this appointment.'] },
        datetime: { type: Date, required: [true, 'Please specify the date and time of this appointment.'] },
        status: { type: String, enum: statuses, required: [true, 'Please specify the current status of this appointment.'] },
        remarks: { type: String, required: false },
    },
    { collection: "appointments" }
);

module.exports = mongoose.model("Appointment", appointmentSchema);