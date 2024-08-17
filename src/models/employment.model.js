import mongoose, { Schema } from "mongoose";

const employementSchema=new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    companyName:{
        type:String
    },
    designation:{
        type:String
    },
    employement:{
        type:String,
        required:true
    },
    location:{
        type:String
    },
    level:{
        type:String
    }
    },
    {
    timestamps: true,
     }
    )

const employementModel = new mongoose.model('Employements',employementSchema);
export default employementModel