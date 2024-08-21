import express from "express";
import UserModel from "../models/user.model";
    
    
const location = express.Router();

location.post("/", async(req,res) => {
    const { longitude, latitude } = req.body;
    try {

    } catch (error) {
        console.log(error);
        
    }
})


export default location