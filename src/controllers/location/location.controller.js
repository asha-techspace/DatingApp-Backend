import LocationModel from '../../models/location.model.js';
import PartnerPreferenceModel from '../../models/partnerPreferance.model.js';
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
    const currentUserLocation = await LocationModel.findOne({ user: userId });
    
    if (!currentUserLocation) {
      return res.status(404).json({ message: "User not found" });
    }

    const [userLon, userLat] = currentUserLocation.location.coordinates || [null, null];
    if (userLat === null || userLon === null) {
      return res.status(400).json({ message: "User location not available" });
    }

    const userProfile = await ProfileModel.findOne({ user: userId });
        if (!userProfile) {
            return res.status(400).send('User profile not found');
        }
        

    // Set preferred gender based on the user's gender preference
    const userGenderPreference = userProfile.genderPreference;
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
    const nearestUsers = await LocationModel.aggregate([
       {
                $geoNear: {
                    near: { type: 'Point', coordinates: [userLon,userLat] },
                    distanceField: 'distance',
                    maxDistance: 50000, 
                    spherical: true,
                },
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user', 
                    foreignField: '_id', 
                    as: 'userDetails', 
                },
            },
            {
                $unwind: '$userDetails',
            },
            {
                $lookup: {
                    from: 'profiles', 
                    localField: 'user', 
                    foreignField: 'user', 
                    as: 'profileDetails', 
                },
            },
            {
                $unwind: '$profileDetails',
            },
            {
                $match: { 
                    'userDetails._id': { $ne: userId },
                    'profileDetails.gender': { $in: preferredGender } ,
                },
            },
            {
                $project: {
                    user: 1,
                    location: 1,
                    distance: 1,
                    'userDetails.firstName': 1,
                    'userDetails.lastName': 1,
                    'profileDetails.profileImage': 1,
                    'profileDetails.gender': 1,
                    'profileDetails.location': 1,
                    'profileDetails.age': 1,
                    'profileDetails.occupation': 1,
                    'profileDetails.bio': 1,
                },
            },
            {
                $sample: { size: 10 },
              },
    ]);

    res.json(nearestUsers);
    
  } catch (error) {
    console.error("Error finding nearby users:", error);
    res.status(500).json({ error: "Error occurred while finding nearby users" });
  }
};
