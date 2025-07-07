import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from "mongoose";
import {z} from "zod"; 
import { userModel } from './db.js';
import bcrypt from "bcrypt";
import dotenv from "dotenv"
const JWT_SECERET="siddharth";
dotenv.config();
await mongoose.connect(process.env.DATABASE_URL);

const app = express();

app.use(express.json());
app.use(cors())





app.post("/signup",async(req,res)=>{
const parsheddata = z.object({
firstname:z.string().min(3).max(20),
lastname:z.string().min(3).max(20),
email:z.string().email(),
password:z.string().min(7).max(14),
confirmpassword:z.string().min(7).max(14)
})
const parsheddatawithsuccess = await parsheddata.safeParse(req.body)
if(!parsheddatawithsuccess.success){
return res.json({
message:parsheddatawithsuccess.error.errors[0].message
})
}
const {firstname,lastname,email,password,confirmpassword}=req.body;
try{
if(password!==confirmpassword){
return res.json({
message:"password is not matching"
})
}
const hashedpassword = await bcrypt.hash(password,10);
await userModel.create({
firstname:firstname,
lastname:lastname,
email:email,
password:hashedpassword,
})
res.json({
message:"You are signed up"
})
}
catch(e){
res.json({
message:e.message
})
}
})

app.post("/signin",async(req,res)=>{
const parsheddata = z.object({
email:z.string().email(),
password:z.string().min(7).max(14),
})
const parsheddatawithsuccess =  parsheddata.safeParse(req.body)
if(!parsheddatawithsuccess.success){
return res.json({
message:parsheddatawithsuccess.error
})
}
const email=req.body.email;
const password= req.body.password;
try{

const user = await userModel.findOne({
email:email
})
const passwordii = await bcrypt.compare(password,user.password);
if(!passwordii){
return res.json({
message:"Incorrect password"
})
}
if(user){
let token =jwt.sign({
id:user._id
},JWT_SECERET);
res.json({
token:token,
message:"You are Signed in"
});
}
else{
res.status(403).json({
message:"username or password is invalid"
})
}
}
catch(e){
res.json({
message:e.message
});
}

})

const PORT = process.env.PORT || 3000

app.listen(PORT);