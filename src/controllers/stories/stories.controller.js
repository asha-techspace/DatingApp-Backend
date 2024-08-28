import ProfileModel from "../../models/profile.model.js";
import { users } from "../usersDetails/userDetails.controller.js";

export const getStories = async (req, res) => {
  await ProfileModel.find({
    "stories.storyDate": { "$ne": new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
  })
    .select("_id profileImage reel")
    .then((user) => {
      res.status(200).json({userStories: user});
    })
    .catch((err) => res.status(400).json({ error: err.message }));
};
