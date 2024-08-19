import mongoose from "mongoose";
const interestSchema = new mongoose.Schema({
    interest: {
        type: String,
        required: true,
        enum: ['MEN', 'WOMEN', 'BOTH']
    }
});

const InterestModel =   mongoose.model('Interest', interestSchema);
export default InterestModel;