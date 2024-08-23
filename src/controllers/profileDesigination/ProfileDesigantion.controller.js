import EmploymentModel from "../../models/employment.model.js";
import ProfileModel from "../../models/profile.model.js";



export const getProfileByDesigination =async(req,res)=>{
    const {designation} = req.params;
    console.log(designation)
    try{
        const employes = await EmploymentModel.find({designation});
        console.log(employes)

        const userIds = employes.map((employment) => employment.user);
        console.log(userIds);
        //checking profile with userid exist
        if(!userIds || userIds.length === 0){
            return res.status(404).json({ error: 'no profile with this designation' });
        }

        // Retrieve profiles based on userIds
        const profiles = await ProfileModel.find({ user: { $in: userIds } });
        console.log(profiles);

        // Send response with profiles
        res.status(200).json(profiles);
    }
    catch(error){
        res.status(500).json({ error: 'Failed to retrieve profiles' });
    }
}