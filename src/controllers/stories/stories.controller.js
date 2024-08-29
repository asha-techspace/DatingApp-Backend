import ProfileModel from "../../models/profile.model.js";
import { users } from "../usersDetails/userDetails.controller.js";

export const getStories =
  ("/",
  async (req, res) => {
    await ProfileModel.find({
      "stories.storyDate": {
        $ne: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
    })
      .select("_id profileImage.url reel.url")
      .then((user) => {
        res.status(200).json({ userStories: user });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

export const oneStory = ('/:id', async (req, res) => {
   // API to get story by ObjectId
  try {
    const story = await ProfileModel.findById(req.params.id).select("profileImage, reel")
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ObjectId' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});
    
