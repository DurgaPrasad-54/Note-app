const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Modules/User');
const Note = require('./Modules/Note');
const verify = require('./verification/verify')


mongoose.connect('mongodb://localhost:27017/Notepad').then(() => {
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
        const hashedpassword = await bcrypt.hash(password,10)
        const user = await User.create({username,email,password:hashedpassword})
        res.status(201).send({message:"Registation Successfull"})
    }
    catch(err){
        res.status(500).send({message:'error in internal server',error:err})
    }
});

app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).send({message:'User not found please register'})
        }
        const match = await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(401).send({message:"Incorrect Password"})
        }

        const token = jwt.sign({_id:user.id,email:user.email},"prasad")
        res.status(200).send({message:"User login successfull",Token:token})

    }
    catch(err){
        res.status(500).send({message:'Error in login',error:err})
    }
})

app.post("/createnote",verify, async (req,res)=>{
    const {title,content} = req.body
    try{
        const note = await Note.create({userId:req.user._id,title,content})
        res.status(201).send({message:'Note created',Note:note})
    }
    catch(err){
        res.status(500).send({message:"error",error:err.message})
    }
})

app.get('/note',verify,async (req,res)=>{
    const usernote = req.user._id
    try{
        const note = await Note.find({userId:usernote})
        if(note.length === 0){
            return res.status(404).send({message:"No notes found"})
        }
        res.status(200).send(note)
    }
    catch(err){
        res.status(500).send({message:'error',error:err})
    }
})

app.put("/upnote/:id", verify, async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    try {
        const upnote = await Note.updateOne(
            { _id: id, userId: req.user.id },
            { $set: { title, content } }
        );

        res.status(200).send({ message: "Update Successful", note: upnote });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err });
    }
});

app.delete("/deletenote/:id",verify,async (req,res)=>{
    const id = req.params.id

    try{
        const user = await Note.findOne({_id:id})
        if(!user){
            return res.status(404).send({message:"Note not found"})
        }
        else{
            const del = await Note.deleteOne(user)
            res.status(200).send({message:"Note delete successfull"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal server error",error:err})
    }
})

app.get('/profile', verify, async (req, res) => {
  try {
    console.log("Decoded JWT:", req.user);
    const user = await User.findOne({ _id: req.user._id });
    console.log("Fetched user:", user);

    if (!user) return res.status(404).send({ message: "User not found" });

    res.status(200).send({ username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});






app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})