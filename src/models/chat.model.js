import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
    createdAt: { type: Date, default: Date.now },
});

const ConversationModel = mongoose.model("Conversation", conversationSchema);

export default ConversationModel;
