import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface IChat {
  _id: Schema.Types.ObjectId;
  listingId: Schema.Types.ObjectId;
  participantsId: Schema.Types.ObjectId[];
  messagesId?: Schema.Types.ObjectId[];
  latestMessageId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, immutable: true, ref: "Listing", required: true },
    participantsId: [{ type: Schema.Types.ObjectId, immutable: true, ref: "ChatParticipant", required: true }],
    messagesId: [{ type: Schema.Types.ObjectId, ref: "ChatMessage", required: false }],
    latestMessageId: { type: Schema.Types.ObjectId, ref: "ChatMessage", required: false },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
  },
  { collection: "chats" }
);

module.exports = mongoose.model("Chat", ChatSchema);