import MessageModel from "../../models/message.model.js";
import ConversationModel from "../../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { message } = req.body;
    let chats = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chats) {
      chats = await ConversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessages = new MessageModel({
      senderId,
      receiverId,
      message,
      conversationId: chats._id,
    });

    if (newMessages) {
      chats.message.push(newMessages._id);
    }

    // SOCKET.IO Here

    // This will run in parallel
    await Promise.all([chats.save(), newMessages.save()]);
    res.status(201).json({ newMessages });
  } catch (error) {
    console.log(error.message);
    res.send("Internal server error!!!");
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let chats = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("message");

    if (!chats) res.status(200).send([]);

    const messages = chats.message;

    res.status(200).send(messages);
  } catch (error) {
    console.log(error.message);
    res.send("Internal server error!!!");
  }
};
