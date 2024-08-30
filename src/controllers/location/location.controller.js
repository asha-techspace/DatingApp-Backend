/* import locationModel from '../../models/location.model.js';
import ProfileModel from '../../models/profile.model.js';

export const getLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const user = req.user._id;

  console.log(user);
  console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);

  try {
    // Find the existing location document for the user
    let location = await locationModel.findOne({ user: user });

    if (!location) {
      // If no document exists, create a new one
      location = new locationModel({
        user: user,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });
      await location.save();
      console.log("New location model created");
    } else {
      // If a document exists, update the existing location
      location.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      await location.save();
      console.log("Location document updated");
    }

    res.status(200).json({ message: "User location updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findNearByUser = async (req, res) => {
  const { latitude, longitude } = req.query;
  const currentUser = req.user._id;

  try {
    const nearByUsers = await locationModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000,
        },
      },
      user: { $ne: currentUser },
    })

    const userIds = nearByUsers.map(userLocation => userLocation.user);

    const userDetails = await ProfileModel.find({user:{$in:userIds}})
    res.json(userDetails)
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
};
 */

import ProfileModel from "../../models/profile.model.js";

export const matchByLocation = async (req, res) => {
  const userId = req.user._id;

  try {
    // Retrieve current user location
    const user = await ProfileModel.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [userLat, userLon] = user.location.coordinates || [null, null];
    if (userLat === null || userLon === null) {
      return res.status(400).json({ message: "User location not available" });
    }

    // Use aggregation to calculate distance and retrieve nearby users
    const nearestUsers = await ProfileModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [userLat, userLon] },
          distanceField: "distance",
          maxDistance: 50000, // 50 km
          spherical: true,
        },
      },
      {
        $match: { user: { $ne: userId } }, // Exclude the current user
      },
      {
        $project: {
          profileImage: 1,
          user: 1,
          location: 1,
          distance: { $divide: ["$distance",1000] },
        },
      },
    ]);


    res.json(nearestUsers);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error occurred while finding nearby users" });
  }
};
