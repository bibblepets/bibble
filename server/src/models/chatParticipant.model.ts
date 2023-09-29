import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface IChatParticipant {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  hasSeenLatestMessage: boolean;
}

const chatParticipantSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, immutable: true, ref: "User", required: true },
    chatId: { type: Schema.Types.ObjectId, immutable: true, ref: "Chat", required: true },
    hasSeenLatestMessage: { type: Boolean, required: true },
  },
  { collection: "chatParticipants" }
);

module.exports = mongoose.model("ChatParticipant", chatParticipantSchema);