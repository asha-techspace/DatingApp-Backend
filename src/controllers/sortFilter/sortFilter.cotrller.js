import ProfileModel from "../../models/profile.model.js";
import PreferenceModel from '../../models/partnerPreferance.model.js';

// Sort and filter function
export const getSortedAndFilteredUsers = async (req, res) => {
    const filterSort = req.body;
    const userId = req.params.id;
    console.log(filterSort);


    try {
        let query = {};
        let sortQuery = {};

        // Check if sorting/filtering by age is requested
        if (filterSort.includes('age')) {
            // Get the user's age preference
            const preferAge = await PreferenceModel.findOne(
                { user: userId },
                { ageRange: 1, _id: 0 } // Only get the ageRange field
            );

            if (!preferAge) {
                return res.status(404).json({ message: 'No age preference found for this user' });
            }

            const [minAge, maxAge] = preferAge.ageRange; // Destructure age range
            query.age = { $gte: minAge, $lte: maxAge }; // Filter by age range
            // Set the sort query for age in ascending order
            sortQuery.age = 1;
        }

        // Filter by gender
        if (filterSort.includes('Gender')) {
            const genderPreference = await PreferenceModel.findOne(
                { user: userId },
                { gender: 1, _id: 0 } // Fetch gender preference
            );

            if (genderPreference && genderPreference.gender) {
                query.gender = genderPreference.gender; // Filter by gender
            }
        }

        // Filter by location
        if (filterSort.includes('Location')) {
            const locationPreference = await PreferenceModel.findOne(
                { user: userId },
                { locations: 1, _id: 0 } // Fetch location preference
            );
            console.log('location', locationPreference);

            if (locationPreference && locationPreference.locations && locationPreference.locations.length > 0) {
                // Assuming `locations` is an array of preferred locations
                const locationRegexArray = locationPreference.locations.map(
                    location => new RegExp(`^${location.substring(0, 4)}`, 'i') // Match first 4 letters
                );
                query.location = { $in: locationRegexArray }; // Filter by location
            } else {
                // If location preference is empty or undefined, display all profiles
                delete query.location; // Remove location filter from the query
            }
        }


        // Filter by interests
        if (filterSort.includes('Interests/Hobbies')) {
            const interestPreference = await PreferenceModel.findOne(
                { user: userId },
                { interests: 1, _id: 0 } // Fetch interests preference
            );

            if (interestPreference && interestPreference.interests && interestPreference.interests.length > 0) {
                // Create regex patterns to match the first 3 letters of any preferred interest
                const prefixPatterns = interestPreference.interests.map(interest => {
                    const prefix = interest.substring(0, 3); // Get the first 3 letters
                    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
                    return new RegExp(`\\b${escapedPrefix}`, 'i'); // Create a regex to match this prefix
                });

                // Build $or condition to match if any of the prefixes are present in the comma-separated interests
                query.$or = prefixPatterns.map(pattern => ({
                    interests: { $regex: pattern }
                }));
            }
        }

        console.log(query);

        // Query profiles based on filter criteria and select user details
        let profiles = await ProfileModel.find(query)
            .select('user interests') // Select user and interests fields
            .populate({
                path: 'user',
                select: 'createdAt _id' // Only fetch createdAt and userId from UserModel
            })
            .sort(sortQuery) // Apply sorting by age
            .lean(); // Use lean to optimize performance by returning plain JS objects

        // Check if sorting by newest is requested, then sort the profiles in-memory
        if (filterSort.includes("NewestMember")) {
            profiles = profiles.sort((a, b) => new Date(b.user.createdAt) - new Date(a.user.createdAt));
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
