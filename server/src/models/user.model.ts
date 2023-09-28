import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IUser {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, lowercase: true, trim: true, required: true },
        password: { type: String, required: true },
        createdAt: { type: Date, immutable: true, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() }
    },
    { collection: 'users' }
);

module.exports = mongoose.model('User', UserSchema);
