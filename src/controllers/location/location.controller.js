import LocationModel from '../../models/location.model.js';
import ProfileModel from '../../models/profile.model.js';

export const getLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const user = req.user._id;

  console.log(user);
  console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);

  try {
    // Find the existing location document for the user
    let location = await LocationModel.findOne({ user: user });

    if (!location) {
      // If no document exists, create a new one
      location = new LocationModel({
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

export const matchByLocation = async (req, res) => {
  const userId = req.user._id;

  try {
    // Retrieve current user's profile to get location and gender preference
    const currentUserProfile = await ProfileModel.findOne({ user: userId });
    if (!currentUserProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const [userLon, userLat] = currentUserProfile.location.coordinates || [null, null];
    if (userLat === null || userLon === null) {
      return res.status(400).json({ message: "User location not available" });
    }

    // Set preferred gender based on the user's gender preference
    const userGenderPreference = currentUserProfile.genderPreference.trim();
    let preferredGender = [];

    console.log('User gender preference:', userGenderPreference);

    if (userGenderPreference === 'MEN') {
      preferredGender = ['Male'];
    } else if (userGenderPreference === 'WOMEN') {
      preferredGender = ['Female'];
    } else if (userGenderPreference === 'BOTH') {
      preferredGender = ['Male', 'Female'];
    }

    // Use aggregation to calculate distance, filter by gender preference, and retrieve nearby users
    const nearestUsers = await ProfileModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [userLon, userLat] }, // Correct order: [longitude, latitude]
          distanceField: "distance",
          maxDistance: 50000, // 50 km
          spherical: true,
        },
      },
      {
        $match: {
          user: { $ne: userId }, // Exclude the current user
          gender: { $in: preferredGender }, // Filter based on gender preference
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for user model (change if necessary)
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind to get the userDetails object
      },
      {
        $project: {
          profileImage: 1,
          user: 1,
          location: 1,
          age: 1,
          distance: { $divide: ["$distance", 1000] }, // Convert distance to kilometers
          firstName: "$userDetails.firstName", // Add firstName from user
          lastName: "$userDetails.lastName",  // Add lastName from user
        },
      },
    ]);

    res.json(nearestUsers);
  } catch (error) {
    console.error("Error finding nearby users:", error);
    res.status(500).json({ error: "Error occurred while finding nearby users" });
  }
};
