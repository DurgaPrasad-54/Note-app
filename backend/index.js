const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Modules/User');
const Note = require('./Modules/Note');
const verify = require('./verification/verify')
const sendMail = require('./mail')
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });



const mongopath = process.env.MONGOPATH
const Token = process.env.TOKEN

mongoose.connect(mongopath)
.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) =>{
    const {username,email,password}=req.body;
    try{
        const usermail = await User.findOne({email})
        if(usermail){
            return res.status(501).send({message:"User already exists, please login"})
        }
        const hashedpassword = await bcrypt.hash(password,10)
        const user = await User.create({username,email,password:hashedpassword})
        res.status(201).send({message:"Registation Successfull"})
    }
    catch(err){
        res.status(501).send({message:'error in internal server',error:err})
    }
});

app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(501).send({message:'User not found please register'})
        }
        const match = await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(501).send({message:"Incorrect Password"})
        }

        const token = jwt.sign({_id:user.id,email:user.email},Token)
        res.status(201).send({message:"User login successfull",Token:token})

    }
    catch(err){
        res.status(504).send({message:'Error in login',error:err})
    }
})
app.post("/createnote",verify, async (req,res)=>{
    const {title,content} = req.body
    try{
        const note = await Note.create({userId:req.user._id,title,content})
        res.status(201).send({message:'Note created',Note:note})

    }
    catch(err){
        res.status(501).send({message:"error",error:err.message})

    }

})
app.get('/note',verify,async (req,res)=>{
    const usernote = req.user._id
    try{
        const note = await Note.find({userId:usernote})
        if(!note){
            return res.send({message:"No notes found"})
        }
        res.send(JSON.stringify(note))

    }
    catch(err){
        res.status(501).send({message:'error',error:err})
    }

})
app.put('/upnote/:id', verify, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated", updatedNote });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/deletenote/:id",verify,async (req,res)=>{
    const id = req.params.id;
    try{
        const user = await Note.findOne({_id:id})
        if(!user){
            return res.status(501).send({message:"Note not found"})
        }
        else{
            const del = await Note.deleteOne(user)
            return res.status(201).send({message:"Note delete successfull"})
        }
    }
    catch(err){
        res.status(501).send({message:"Internal server error",error:err})
    }
})
app.get('/profile', verify, async (req, res) => {
  try {
    console.log("Decoded JWT:", req.user);
    const user = await User.findOne({ _id: req.user._id });
    console.log("Fetched user:", user);

    if (!user) return res.status(404).send({ message: "User not found" });

    res.send({ username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});
app.put('/sendotp', async(req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.send({message:'User not found'})
        }
        else{
            otp = Math.floor(100000 + Math.random()*900000);
            otpexpire = new Date(Date.now() + 15 * 60 *1000);
            await User.updateOne({email:email},{$set:{otp:otp,otpexpire:otpexpire}})
            const send = await sendMail(email,"Note App OTP",`Your OTP ${otp}`)
            res.send({message:'OTP SENT PLEASE CHECK YOUR MAIL'})
        }
    }
    catch(err){
        res.send({message:"error occurs during send otp",error:err})

    }
})
app.put('/verifyotp', async (req, res) => {
    const { otp, password } = req.body;

    try {
        const user = await User.findOne({ otp });
        if (!user) {
            return res.send({ message: 'INVALID OTP' });
        }
        if (user.otpexpire < new Date()) {
            return res.send({ message: "OTP Expired" });
        }
        const newhash = await bcrypt.hash(password, 10);
        await User.updateOne(
            { _id: user._id },
            {
                $set: { password: newhash },
                $unset: { otp: "", otpexpire: "" } 
            }
        );
        return res.send({ message: 'Password updated successfully' });
    } catch (err) {
        return res.send({ message: "Password update failed", error: err });
    }
});


app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})