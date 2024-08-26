import locationModel from '../../models/location.model.js';

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
          $maxDistance: 5000,
        },
      },
      user: { $ne: currentUser },
    }).populate('user');

    const users = nearByUsers.map(userLocation => userLocation.user);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
};
