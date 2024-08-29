import mongoose from 'mongoose';
import ProfileModel from "../../models/profile.model.js";
import UserModel from "../../models/user.model.js"; // Assuming the User model is imported

// Function to calculate match percentage between two users
export const calculateMatchPercentage = async (userProfile, otherUserProfile) => {
    console.log(`Comparing ${userProfile.user} with ${otherUserProfile.user}`);

    let matchScore = 0;
    const totalWeight = 100;
    let weightSum = 0;

    const criteria = [
        {
            field: 'drinking',
            weight: 20,
            matchFunc: (a, b) => (a === b ? 1 : 0),
        },
        {
            field: 'smoking',
            weight: 20,
            matchFunc: (a, b) => (a === b ? 1 : 0),
        },
        
        {
            field: 'qualification',
            weight: 15,
            matchFunc: (a, b) => (a === b ? 1 : 0),
        },
        {
            field: 'age',
            weight: 10,
            matchFunc: (a, b) => (Math.abs(a - b) <= 5 ? 1 : 0),
        },
        {
            field: 'interests',
            weight: 10,
            matchFunc: (a, b) => {
                // Handle case where interests are stored as a single string within an array
                const userInterests = Array.isArray(a) ? (typeof a[0] === 'string' ? a[0].split(',').map(s => s.trim()) : a[0]) : a;
                const otherUserInterests = Array.isArray(b) ? (typeof b[0] === 'string' ? b[0].split(',').map(s => s.trim()) : b) : b;

                // Find shared interests
                const sharedInterests = userInterests.filter((interest) => otherUserInterests.includes(interest));

                // More debug output
                console.log('Shared Interests:', sharedInterests);

                // Calculate the match score
                return sharedInterests.length / Math.max(userInterests.length, otherUserInterests.length);
            },
        },
    ];

    criteria.forEach((criterion) => {
        const { field, weight, matchFunc } = criterion;
        const userField = userProfile[field];
        const otherUserField = otherUserProfile[field];
        // console.log(otherUserField);


        if (userField && otherUserField) {
            matchScore += matchFunc(userField, otherUserField) * weight;
        }
        weightSum += weight;
    });

    const matchPercentage = Math.round((matchScore / weightSum) * totalWeight);

    return matchPercentage;
};

// Function to compare a user with all other users and return the results
export const compareUserWithAllOthers = async (req, res) => {
    try {
        const { _id: userId } = req.user; // Get the user ID from the authenticated user


        // Retrieve the profile of the specific user
        const userProfile = await ProfileModel.findOne({ user: userId }).lean();

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // Retrieve all profiles except the one with userId
        const allProfiles = await ProfileModel.find({ user: { $ne: userId } }).lean();

        if (allProfiles.length === 0) {
            return res.status(404).json({ message: 'No other users found for comparison.' });
        }

        const matchResults = [];

        for (const otherProfile of allProfiles) {
            // Calculate match percentage
            const matchPercentage = await calculateMatchPercentage(userProfile, otherProfile);

            // Retrieve the other user's first and last name from the UserModel
            const otherUser = await UserModel.findById(otherProfile.user, 'firstName lastName').lean();

            // Combine firstName and lastName into fullName
            const otherUserName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown';

            // Push the result with profile, match percentage, and the other user's full name
            matchResults.push({
                profile: otherProfile, // Include the other user's profile details
                matchPercentage,
                otherUserName,  // Include the full name from UserModel
            });
        }

        return res.status(200).json({ results: matchResults });
    } catch (error) {
        console.error('Error comparing user with all others:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};