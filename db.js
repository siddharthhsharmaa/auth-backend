import mongoose from "mongoose";

const schema = mongoose.Schema;

const User = schema({
firstname:String,
lastname:String,
email:{type:String,unique:true},
password:String,
confirmpassword:String
})

export const userModel = mongoose.model("users",User);