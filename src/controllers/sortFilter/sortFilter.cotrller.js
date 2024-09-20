import ProfileModel from "../../models/profile.model.js";
import PreferenceModel from '../../models/partnerPreferance.model.js';
import LocationModel from "../../models/location.model.js";

// Sort and filter function
export const getSortedAndFilteredUsers = async (req, res) => {
    const filterSort = req.body;
    const userId = req.params.id;
    console.log(filterSort);

    try {
        // Check if there are any filters in the filterSort array
        if (!filterSort || filterSort.length === 0) {
            return res.status(200).json([]); // Return an empty array if no filters are provided
        }

        // Fetch the user's location from LocationModel
        const userLocation = await LocationModel.findOne({ user: userId }).lean();

        // Check if the user's location is found
        if (!userLocation || !userLocation.location || !userLocation.location.coordinates) {
            return res.status(400).json({ message: "User location not found." });
        }

        const [userLon, userLat] = userLocation.location.coordinates; // Extract longitude and latitude from location

        let query = {};
        let sortQuery = {};

        // Check if sorting/filtering by age is requested
        if (filterSort.includes('age')) {
            const preferAge = await PreferenceModel.findOne(
                { user: userId },
                { ageRange: 1, _id: 0 } // Only get the ageRange field
            );

            if (!preferAge || !preferAge.ageRange) {
                return res.status(200).json([]); // Return an empty array if age preference is missing
            }

            const [minAge, maxAge] = preferAge.ageRange; // Destructure age range
            query.age = { $gte: minAge, $lte: maxAge }; // Filter by age range
        }

        // Filter by gender
        if (filterSort.includes('Gender')) {
            const genderPreference = await PreferenceModel.findOne(
                { user: userId },
                { gender: 1, _id: 0 } // Fetch gender preference
            );

            if (!genderPreference || !genderPreference.gender) {
                return res.status(200).json([]); // Return an empty array if gender preference is missing
            }

            query.gender = genderPreference.gender; // Filter by gender
        }

        // Filter by location
        if (filterSort.includes('Location')) {
            const locationPreference = await PreferenceModel.findOne(
                { user: userId },
                { locations: 1, _id: 0 } // Fetch location preference
            );
            console.log('location', locationPreference);

            if (!locationPreference || !locationPreference.locations || locationPreference.locations.length === 0) {
                return res.status(200).json([]); // Return an empty array if location preference is missing
            }

            const locationRegexArray = locationPreference.locations.map(
                location => new RegExp(`^${location.substring(0, 4)}`, 'i') // Match first 4 letters
            );
            query.location = { $in: locationRegexArray }; // Filter by location
        }

        // Filter by interests
        if (filterSort.includes('Interests/Hobbies')) {
            const interestPreference = await PreferenceModel.findOne(
                { user: userId },
                { interests: 1, _id: 0 } // Fetch interests preference
            );

            if (!interestPreference || !interestPreference.interests || interestPreference.interests.length === 0) {
                return res.status(200).json([]); // Return an empty array if interest preference is missing
            }

            const prefixPatterns = interestPreference.interests.map(interest => {
                const prefix = interest.substring(0, 3); // Get the first 3 letters
                const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
                return new RegExp(`\\b${escapedPrefix}`, 'i'); // Create a regex to match this prefix
            });

            query.$or = prefixPatterns.map(pattern => ({
                interests: { $regex: pattern }
            }));
        }

        // Query profiles based on filter criteria and select user details
        let profiles = await ProfileModel.find(query)
            .select('user interests friends') // Select user, interests, and friends fields
            .populate({
                path: 'user',
                select: 'createdAt _id friends' // Only fetch createdAt and userId from UserModel
            })
            .lean(); // Use lean to optimize performance by returning plain JS objects

        // Sort by newest member if requested
        if (filterSort.includes("NewestMember")) {
            const today = new Date();
            const oneDayAgo = new Date();
            oneDayAgo.setDate(today.getDate() - 2);

            profiles = profiles.filter(profile => {
                const createdAt = new Date(profile.user.createdAt);
                return createdAt >= oneDayAgo && createdAt <= today;
            });

            profiles = profiles.sort((a, b) => new Date(b.user.createdAt) - new Date(a.user.createdAt));
        }

        // Sort by popularity (number of friends) if requested
        if (filterSort.includes('popularity')) {
            profiles = profiles.filter(profile => (profile.user.friends?.length || 0) > 5);
            profiles = profiles.sort((a, b) => b.user.friends.length - a.user.friends.length);
        }

        // Sort by distance and apply existing filters
        if (filterSort.includes('distance')) {
            // Get profiles based on distance with filters applied
            const nearbyUsers = await LocationModel.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [userLon, userLat] },
                        $maxDistance: 50000 // 50 km in meters
                    }
                },
                user: { $in: profiles.map(p => p.user._id) } // Only get users in filtered profiles
            }).lean();

            // Sort profiles based on their proximity
            profiles = profiles.filter(profile => nearbyUsers.some(nearUser => nearUser.user.equals(profile.user._id)));
        }

        // Extract only userId from the sorted profiles
        const userIds = profiles.map(profile => profile.user._id);

        // If no profiles were found, return an error
        if (userIds.length === 0) {
            return res.status(404).json({ message: 'No profiles found based on the provided criteria' });
        }

        // Send the list of userIds as the response
        res.status(200).json(userIds);

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};
