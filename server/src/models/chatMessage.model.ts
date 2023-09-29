import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface IChatMessage {
  _id: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  isLatestIn?: Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, immutable: true, ref: "Chat", required: true },
    senderId: { type: Schema.Types.ObjectId, immutable: true, ref: "User", required: true },
    isLatestIn: { type: Schema.Types.ObjectId, ref: "Chat", required: false },
    message: { type: String, required: true },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
  },
  { collection: "chatMessages" }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);