import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'conversations', // Reference to a Conversation schema
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Reference to a User schema
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
