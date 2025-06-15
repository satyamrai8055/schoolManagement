const mongoose = require("mongoose");
const joi = require("joi");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const commanFunction = require("../helper/util");
const UserServices = require("./services/userServices");
const { checkUser, createUser, findAllUser, findUserById, updateUserById,findById, findIdAndDelete,findAdmin, countStudent } = UserServices;

module.exports = {


    userRegister: async (req, res,next) => {
        const validateSchema = joi.object({
            userName: joi.string().min(3).max(50).required(),
            password: joi.string().min(6).max(100).trim().required(),
            email: joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).trim().required(),
            role: joi.string().valid("admin", "teacher", "student").trim().required(),
            profilePicture: joi.string().trim().uri().optional(),
            firstName: joi.string().min(3).max(50).required(),
            lastName: joi.string().min(3).max(50).required(),
            contactInfo: joi.string().pattern(/[6-9]{1}[0-9]{9}/).trim().required(),
        });

        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            console.log(">>>>>>>>>>>>>>>>>>>",validatedBody);
         
            const existingUser = await checkUser({ email: validatedBody.email });
            if (existingUser) {
                if (existingUser.status === "blocked") {
                    return res.status(403).json({success: false, responseCode: 403, message: "Your account is blocked. Please contact support." });
                }
                return res.status(401).json({ success: false, responseCode: 400, message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

            const newUser = await createUser({
                userName: validatedBody.userName,
                password: hashedPassword,
                email: validatedBody.email,
                role: validatedBody.role,
                profilePicture: validatedBody.profilePicture,
                firstName: validatedBody.firstName,
                lastName: validatedBody.lastName,
                contactInfo: validatedBody.contactInfo,
            });

            return res.status(201).json({ success: true, responseCode: 201, message: "User registered successfully", newUser });

        } catch (error) {
            console.error("Error in registerStudent:", error);
            return res.status(500).json({ success: false, responseCode: 500, message: "Internal server error", error: error });
        }
    },
    UserLogin: async (req, res, next) => {
        const validateSchema = joi.object({
            email: joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).trim().required(),
            password: joi.string().min(6).max(100).trim().required(),

        });
        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const existingUser = await checkUser({ email: validatedBody.email });
            if (!existingUser) {
                return res.status(404).json({ success: false, responseCode: 404, message: "Invalid email or password" });
            }
            if (existingUser.status === "blocked") {
                return res.status(403).json({
                    success: false,
                    responseCode: 403,
                    message: "Your account is blocked. Please contact support.",
                });
            }
            if (existingUser.status === "deleted") {
                return res.status(404).json({
                    success: false,
                    responseCode: 404,
                    message: "User not found",
                });
            }
            const isValidPassword = await bcrypt.compare(validatedBody.password, existingUser.password);
            if (!isValidPassword) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Invalid password" });
            }
            const token = await commanFunction.getToken({ _id: existingUser._id, userType: existingUser.role, })
            return res.status(200).send({ responseCode: 200, responseMessage: "Login successful.", token: token, });

        } catch (error) {
            console.log("Error :", error);
            return res.status(500).send({
                responseCode: 500,
                responseMessage: "Something went wrong.",
            });
        }
    },
    getProfileById: async (req, res) => {
        try {
            const userDetail = await findUserById({ _id: req.userId });
            if (!userDetail) {
                return res.status(404).send({
                    responseCode: 404,
                    responseMessage: "User not found.",
                });
            }
            return res.status(200).send({
                responseCode: 200,
                responseMessage: "User details retrieved successfully.",
                data: userDetail,
            });
        } catch (error) {
            console.error("Error retrieving user profile:", error);
            return res.status(500).send({
                responseCode: 500,
                responseMessage: "Something went wrong. Please try again.",
            });
        }
    },
    getAllUser: async (req, res, next) => {
        try {
            const user= await findAllUser();
            if (!user) {
                return res.status(404).send({ responseCode: 404, responseMessage: "No user found." });
            }
            return res.status(200).send({ responseCode: 200, responseMessage: "Users retrieved successfully.", data: user });

        } catch (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).send({ responseCode: 500, responseMessage: "Internal server error" });
        }
    },
    updateUser: async (req, res, next) => {
        const validateSchema = joi.object({
            email: joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).trim().required(),
            contactInfo: joi.string().pattern(/^[0-9]{10}$/).trim().required(),
        });
        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const { email, contactInfo } = validatedBody;
            const userId = req.userId;
            const existingUser = await checkUser({ _id:userId});
            if (!existingUser) {
                return res.status(404).json({ success: false, responseCode: 404, message: "User  not found" });
            }
            const updatedUser = await updateUserById(
                userId,
                { email, contactInfo },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            res.status(200).json({
                success: true, message: "User details updated successfully",
                student: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    contactInfo: updatedUser.contactInfo,
                },
            });

        } catch (error) {
            console.error("Error in updatedUser:", error);
            return res.status(500).json({
                success: false,
                responseCode: 500,
                message: "Something went wrong."
            });
        }
    },
    userDelete: async (req, res) => {
        try {
            const userDetail = await findById({ _id: req.userId });
            if (!userDetail) {
                return res.status(404).send({success: false, responseCode: 404,responseMessage: "User not found."});
            }
           const user = await findIdAndDelete({ _id: userDetail._id });
            return res.status(200).send({ success:true,   responseCode: 200,responseMessage: "User profile deleted successfully.",user});
        } catch (error) {
            console.log("Error:", error);
            return res.status(500).send({
                responseCode: 500,
                responseMessage: "Something went wrong.",
            });
        }
    },


    // admin opration only
    adminLogin: async (req, res) => {
        const validateSchema = joi.object({
            email: joi.string().email(),
            password: joi.string().required(),
        });
        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const {email,password}= validatedBody
            const admin = await findAdmin({email ,role:"admin"});
            if (!admin) {
              return res.status(404).json({ message: "Admin not found." });
            }
            
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
              return res.status(401).json({success:false, responseCode:401, message: "Invalid credentials." });
            }
            const token = await commanFunction.getToken({_id:admin._id,role:admin.role});
        
             return res.status(200).json({success:true, responseCode:200, message: "Login successful", token });
          } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
          }
    
    },
    getAllUserByAdmin:async(req, res, next)=>{
        try {
            const user = req.userId;
            const admin = await findAdmin({_id:user,role:"admin"});
            if(!admin){
                return res.status(404).json({success:false,message:"Admin not found"});
            }
            const allUser = await findAllUser({role:{$nin: ["student", "teacher"]},status:{$ne:"delete"}});
            const totalUser = await countStudent({role:{$ne:"admin"},status:{$ne:"deleted"}});
           return res.status(200).json({success:true,message:"All User list", totalUser,user:allUser,});
        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({success:false, responseCode:500, message:"Internal server error"})
            
        }
    },
    searchUser:async(req, res, next)=>{
        const validateSchema=joi.object({
            status: joi.string().valid("active", "deleted", "blocked").optional(),
            email:joi.string().email().optional(),
            id:joi.string().optional(),
            contactInfo:joi.string() .pattern(/^\d{10}$/).optional(),
        });
        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const {status,email,id,contactInfo}=validatedBody;
            const userId = req.userId;
            const admin = await findAdmin({_id:userId,role:"admin"});
            if(!admin){
                return res.status(404).json({success:false, responseMessage:404,message:"Unauthorized access. Only admins can perform this action."});
            }
            let query ={};
            if(status) query.status =status;
            if(email) query.email=email;
            if(id) query.id=id;
            if (contactInfo) query.contactInfo= contactInfo;
            if(Object.keys(query).length ===0){
                return res.status(400).json({success:false, responseMessage:400,message:"Please provide at least one parameter (status,id ,email, contactInfo) is required"});
            }
            const user = await checkUser(query);
            if(user.length ===0){
                return res.status(404).json({success:false,responseCode:404, responseMessage:404,message:"User not found"});
            }
            return res.status(200).json({success:true, responseCode:200, message:"search results.",user:user});


        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({success:false, responseCode:500, message:"Internal server error"});

            
        }
    },
    userDeleteByAdmin: async(req, res, next)=>{
        try {
            const adminId = req.userId;
            const userId = req.params.id;
            if(!userId){
                return res.status(400).json({success:false, responseMessage:400,message:"Please provide studentId"});
            }
            const admin = await findAdmin({_id:adminId,role:"admin"});
            if(!admin){
                return res.status(404).json({success:false, responseMessage:404,message:"Unauthorized , only accessible for admin"});

            }
            const user = await findUserById(userId);
            if (!user || !["student", "teacher"].includes(user.role)){
                return res.status(404).json({success:false,responseCode:404, responseMessage:404,message:"user not found"});
            }
            await findIdAndDelete(userId);
            return res.status(200).json({success:true, responseCode:200, message:"User deleted successful."});

        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({success:false, responseCode:500, message:"Internal server error"});
            
        }
    },
    updateUserByAdmin: async(req, res)=>{
        try {
            const adminId = req.userId;
            const userId = req.params.id;
            const {firstName, lastName, email, contactInfo} = req.body;

        const admin = await findAdmin({_id:adminId, role:"admin"});
        if(!admin){
            return res.status(404).json({success:false, responseMessage:404,message:"Unauthorized, only admin can update user."});
        }
        const user = await findById({_id:userId,role:"student"});
        if(!user){
            return res.status(404).json({success:false,responseCode:404, responseMessage:404,message:"Student not found"});
        }
        const updatedUser = await updateUserById(userId, {firstName, lastName, email, contactInfo});
        return res.status(200).json({success:true, responseCode:200, message:"Student update successfully.",updatedUser});
        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({success:false, responseCode:500, message:"Internal server error"}); 
        }

    },
    getTotalStudents: async (req, res) => {
        try {
            const adminId = req.userId;
    
            // Verify admin
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Only admin can access this route."
                });
            }
    
            // Count only students (exclude teachers and admins)
            const totalStudents = await countStudent({
                role: "student",
                status: { $ne: "deleted" }
            });
    
            return res.status(200).json({
                success: true,
                message: "Total student count fetched successfully.",
                totalStudents
            });
    
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

}