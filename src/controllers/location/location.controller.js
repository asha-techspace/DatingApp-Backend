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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if(isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    throw new Error("Invalid coordinates for distance calculation")
  }
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};


export const matchByLocation = async (req, res) => {
  const userId = req.user._id;
  

  try {
    // Retrieve current user location
    const user = await ProfileModel.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    const [userLat, userLon] = user.location.coordinates || [null, null]
    if(userLat === null || userLon === null) {
      res.status(400).json({message: "User location not available"})
    }
    

    // Retrieve all uesrs(excluding current user)

    const users = await ProfileModel.find({user: {$ne: userId}})
    
    
    const userWithDistance = users.map((otherUser) => {
      const [otherUserLat, otherUserLon] = otherUser.location.coordinates || [null,null]
      if(otherUserLat === null || otherUserLon === null) return null
      
      const distance = calculateDistance(userLat,userLon,otherUserLat,otherUserLon)
      return {...otherUser._doc, distance};
      
    }).filter(user => user !== null)

    // sort users with distance
    userWithDistance.sort((a,b) => a.distance - b.distance);

    //limit number of users to show
    const nearestUsers = userWithDistance.slice(0, 10);

    res.json(nearestUsers)

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Error occured while finding nearby users"})
  }
};
