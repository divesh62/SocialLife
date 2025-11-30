import httpStatus from "http-status";
import bcrypt from "bcrypt"
import { User } from "../models/users.model.js"
import  Profile  from "../models/profiles.model.js"
import ConnectionRequest from "../models/connections.model.js";
import fs from "fs";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import mongoose from "mongoose";
import path from "path";


const convertUserDataToPDF = async(userData)=>{
    const doc = new PDFDocument();

    const outputPath  = crypto.randomBytes(32).toString('hex') + ".pdf";

    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center", width: 100})
    doc.fontSize(14).text(`name: ${userData.userId.name}`);
    doc.fontSize(14).text(`username: ${userData.userId.username}`);
    doc.fontSize(14).text(`email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.userId.Bio}`);
    doc.fontSize(14).text(`CurrentPosition: ${userData.userId.CurrentPosition}`);
    
    doc.fontSize(14).text("past Work:")
     userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name: ${work.companyName}`);
                doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years : ${work.years}`);

     })
}


export const register = async (req, res) => {
    const {username, name, profilePicture, email, password} = req.body;

    try {
        if(!name || !username || !email || !password ) return res.status(500).json({message:" All feild are required "});

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }  
        const hashsedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username:username,
            name:name,
            email:email,
            password:hashsedPassword,
            profilePicture: profilePicture,
        });

        
        console.log(newUser)
        await newUser.save();

        const profile = new Profile({userId: newUser._id});
       
        await profile.save();
        res.status(201).json({message: "User registered successfully"});
    }   
    catch (error) { 
        res.status(500).json({message: "Something went wrong"});
        console.log(error);
    }
}


export const login = async(req,res) =>{
    
    try{

        const {username , password } = req.body;

        if(!username || !password) return res.status(httpStatus.NOT_FOUND).json({message:"All feild are required "});

        let user = await User.findOne({username});
        if(!user){
            res.status(httpStatus.FOUND).json({message: "User not exist !"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        if(!isMatch) return res.status(400).json({message:"Invalid Credential !"});
        
        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id:user._id},{token});

        return res.json({token})

    }catch(err){
        console.log(err);
        res.status(500).json({message: " Server Error "});
    }

}

export const uploadProfilePicture = async (req, res) => {
    try{
    
    const { token } = req.body;
  
   
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({ token: token });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     console.log(req.file)
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
   
    user.profilePicture = req.file.filename;
    
    await user.save();

    res.status(201).json({
      message: "Profile picture updated",
      fileUrl: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
    const {token, ...newUserData} = req.body;    
   

    try{
        const {token, ...newUserData} = req.body; 

        const user = await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }   
        
        const {username,email} = newUserData;

        const existingUser = await User.findOne({$or:[{username:username},{email:email}]});
      if(existingUser){
        if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message: "Username or email already exists"});
        }   
      }        

      Object.assign(user,newUserData);
      await user.save();
      return res.status(200).json({message: "User profile updated successfully"});  

    }catch(err){
        return res.status(500).json({message: "Something went wrong"});
    }       

}


export const getUserAndProfile = async (req, res) => {
  const { token } = req.query || {};
  
    
  try {
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name username email profilePicture"); // ❌ removed password

    return res.json({profile})

  } catch (err) {
    console.error("Error in getUserAndProfile:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const updateProfileData = async(req,res)=>{
    try{

        const { token , ...newProfileData } = req.body;

        const userProfile = await User.findOne({token : token});
        if(!userProfile){
            return res.status(404).json({mesage: " User not found"});
        }
        
        const profile_to_update = await Profile.findOne({ userId: userProfile._id});

        Object.assign(profile_to_update,newProfileData);

        await profile_to_update.save();
        return res.json(profile_to_update)

    }catch(err){
        return res.status(500).json({message: err.message})
    }
}




export const getAllUserProfile = async(req,res)=>{

    try{

        const profile = await Profile.find().populate('userId', 'name email username profilePicture');

        return res.json({profile})

    }catch(err){
            res.status(400).json({message: " Server Error"})
    }

}

export const downloadProfile = async(req,res)=>{

    const user_id = req.query.id;
    console.log(user_id)
    const userProfile = await Profile.findOne({userId: user_id})
    .populate('userId', 'name email username profilePicture');

    let outputPath = await convertUserDataToPDF(userProfile);
    return res.json({message: outputPath})
}



//  Connextion Request Functions

export const sendConnectionRequest = async (req,res)=>{
    const { token, connectionId } = req.body;
   

    if (!token || !connectionId) {
      return res.status(400).json({ message: "Missing token or connectionId" });
    }
    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
    return res.status(400).json({ message: "Invalid connectionId format" });
  }


    try{

      const user = await User.findOne({token});
           
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const connectionUser = await User.findById({_id: connectionId});
       
        if(!connectionUser){
            return res.status(400).json({message: "Connection user not found"});
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        })

        if(existingRequest){
            return res.status(400).json({message:"Request already sent "});
        }

        const request = new ConnectionRequest({
             userId: user._id,
            connectionId: connectionUser._id
        })

        await request.save();
         return res.status(200).json({ message: "Connection request sent successfully" });

    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Server Error"})
    }
}

export const getMyConnectionsRequest = async(req,res) =>{
    const {token} =  req.query;
    console.log("token",token);
    try{

        const user = await User.findOne({token});

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        const connections = await ConnectionRequest.find({userId: user._id})
        .populate('connectionId','name email username profilePicture');

        return res.json({connections})

    }catch(err){
        return res.status(500).json({message: " Server Error"})
    }
}


export const whatAreMyConnections = async (req,res)=>{
    const { token } = req.query;

    try{

        const user = await User.findOne({token});

       

        if(!user){
            return res.status(400).json({message: " User not found "})
        }

        // const connections = await ConnectionRequest.find({connectionId: user._id})
        // .populate('userId','name, username,email,pofilePicture');
        const connections = await ConnectionRequest.find({userId: user._id})
        .populate('connectionId','name email username profilePicture');
        return res.json({connections})
       
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

export const acceptConnectionRequest = async(req,res)=>{
   

    try{
         const {token, requestId,userId,connectionId , action_type} = req.body;
         console.log(requestId,userId,connectionId);
        const user = await User.findOne({token})

       
        const connection = await ConnectionRequest.findOne({_id: requestId});
        console.log("Connections:",connection);
        if(!connection){
              return res.status(400).json({message: " Connection not found "})
        }

        if(action_type === "accept"){
            connection.status_accepted = true;
         }else{
            connection.status_accepted = false;
         }

         await connection.save();

         return res.json({connection});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const getUserProfileAndUserBasedOnUsername = async(req,res)=>{
  const {username} = req.query;
  try{
      const user = await User.findOne({username: username});
      if(!user){
          return res.status(404).json({message: "User not found"})
      }

      const userProfile = await Profile.findOne({userId: user._id})
      .populate('userId','name username email profilePicture');

      return res.json({"profiile": userProfile})
} catch(err){
      return res.status(500).json({message: err.message})
  }
} 