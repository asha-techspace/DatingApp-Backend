// import UserModel from "../../models/user.model.js";
// import EmploymentModel from "../../models/employment.model.js";


// export const jobDetails = async (req, res) => {
//     try {
//       const { companyName, designation, location } = req.body;
//       const { _id } = req.user; // Get the user ID from the authenticated user
  
//       const employ = await EmploymentModel.create({
//         companyName,
//         designation,
//         location,
//         user: "66c2dffe244283cc224d66e1",
//       });
  
//       return res.status(201).json({
//         success: true,
//         message: "Job details saved successfully",
//         data: employ,
//       });
//     } catch (error) {
//       console.error("Job details error:", error); 
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
  
//   export const moreJobDetails = async (req, res) => {
//       try {
//         const { level } = req.body;
//         const user_id = "66c2dffe244283cc224d66e1";
//         const { _id } = req.user; // Get the user ID from the authenticated user

    
//         console.log( user_id);
    
//         const userEmployments = await EmploymentModel.find({ user: user_id });
    
//         if (userEmployments.length === 0) {
//           return res.status(404).json({
//             success: false,
//             message: "User not found or no employment records found for this user",
//           });
//         }
    
//         const employ = await EmploymentModel.updateMany(
//           { user: user_id },
//           { $set: { level } }
//         );
    
//         return res.status(200).json({
//           success: true,
//           message: "Job details updated successfully",
//           data: employ,
//         });
//       } catch (error) {
//         console.error("Job details error:", error);
//         return res.status(500).json({
//           success: false,
//           message: error.message,
//         });
//       }
//     };


import UserModel from "../../models/user.model.js";
import EmploymentModel from "../../models/employment.model.js";

// Handler for adding job details
export const jobDetails = async (req, res) => {
  try {
    const { companyName, designation, location } = req.body;
    const { _id: userId } = req.user; // Get the user ID from the authenticated user

    console.log(userId);
    

    // Create a new employment entry
    const employment = await EmploymentModel.create({
      companyName,
      designation,
      location,
      user: userId, // Use the authenticated user's ID
    });

    return res.status(201).json({
      success: true,
      message: "Job details saved successfully",
      data: employment,
    });
  } catch (error) {
    console.error("Job details error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save job details",
      error: error.message,
    });
  }
};

// Handler for updating additional job details (expertise level)
export const moreJobDetails = async (req, res) => {
  try {
    const { level } = req.body;
    const { _id: userId } = req.user; // Get the user ID from the authenticated user

    // Find employment records associated with the authenticated user
    const userEmployments = await EmploymentModel.find({ user: userId });

    if (userEmployments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employment records found for this user",
      });
    }

    // Update the level for all employment records of this user
    const updatedEmployment = await EmploymentModel.updateMany(
      { user: userId },
      { $set: { level } }
    );

    return res.status(200).json({
      success: true,
      message: "Job details updated successfully",
      data: updatedEmployment,
    });
  } catch (error) {
    console.error("Job details update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job details",
      error: error.message,
    });
  }
};
