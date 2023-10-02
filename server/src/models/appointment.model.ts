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
        listingId: { type: Schema.Types.ObjectId, required: true },
        userId: { type: Schema.Types.ObjectId, required: true },
        datetime: { type: Date, required: true },
        status: { type: String, enum: statuses, required: true },
        remarks: { type: String, required: false },
    },
    { collection: "appointments" }
);

module.exports = mongoose.model("Appointment", appointmentSchema);