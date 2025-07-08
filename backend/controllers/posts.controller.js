
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bycrypt from "bcrypt";
export const runningCheck = async (req,res)=>{
  return res.status(200).json({message : "RUNNING"});
};

