import ChatModel from "../../models/chat.model.js";
import UserModel from "../../models/user.model.js";

// Server-side createChat function (chat.controller.js)
export const createChat = async (req, res) => {
  console.log(req.body);

  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    let chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    }).populate("members", "-password");

    // const userDetails = await UserModel.findById(chat.members[1].user).select(' -password -isVerified -requestedLists -shortlistedProfiles -shortListedBy -rejected -viewedBy -friendRequests ')
    // chat.members[1].user = userDetails;

    let userDetails;

    for (const item of chat) {
      // Fetch the user details by ID
      const userDetails = await UserModel.findById(item.members[1].user).select(
        "-password -isVerified -requestedLists -shortlistedProfiles -shortListedBy -rejected -viewedBy -friendRequests"
      );
  
      // Update the member's user field with the user details
      item.members[1].user = userDetails;
    }

    console.log(userDetails);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};



export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
