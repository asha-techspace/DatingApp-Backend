import { cloudinaryInstance } from "../config/cloudinary.config.js";

const uploadOnCloudinary = async (localFilePath, publicId, resourceType = 'auto') => {
    try {
        if (!localFilePath) {
            throw new Error('Cannot get the local file path');
        }
        const response = await cloudinaryInstance.uploader.upload(localFilePath, {
            resource_type: resourceType, // Specify the resource type, either 'auto', 'image', 'video', etc.
            public_id: publicId
        });
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default uploadOnCloudinary;
