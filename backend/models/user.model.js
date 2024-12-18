import mongoose from "mongoose";



const UserSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default:""
    },
    gender: {
        type: String,
        enum:["male", "female"],
    },
},{timestamps:true})


const User=mongoose.model("User",UserSchema);
export  default  User