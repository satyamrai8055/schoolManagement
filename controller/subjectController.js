const mongoose = require("mongoose");
const joi = require("joi");
const subjectService = require("./services/subjectServices");
const { findAdmin ,checkSubject,createSubject ,findAllSubject,findSubjectById ,updateSubjectById ,findIdAndDelete}=subjectService;

module.exports={
    createSubject: async(req, res)=>{
        const validationSchema = joi.object({
            subjectName: joi.string().trim().required(),
            subjectCode:joi.string().trim().required(),
            teacherId:joi.string().required(),
        });
        try {
            const validateBody = await validationSchema.validateAsync(req.body);
            const {subjectName,subjectCode,teacherId   }=validateBody;
            const adminId = req.userId;
            const admin = await  findAdmin({ _id: adminId, role: "admin"}) ;
            if (!admin) {
                return res.status(401).json({success:false, responseCode:401, message: "You are not an admin" });
            }
            const existingSubject =  await checkSubject ({subjectName,subjectCode});
            if (existingSubject) {
                return res.status(400).json({success:false, responseCode:400, message: "Subject allready exist"});
            }
            const subject = await createSubject({subjectName,subjectCode,teacherId });
            return res.status(201).json({success:true, responseCode:201, message:"Subject create SuccessFully",data:subject});

        } catch (error) {
            return res.status(500).json({success:false, responseCode:500, message: "Internal server error", data:error});
            
        }
    },
    getAllSubject:async(req,res)=>{
        try {
            const subject = await findAllSubject();
            return res.status(200).json({success:true, responseCode:200, message:"Subject find Successfuly",data:subject});
        } catch (error) {
            return res.status(500).json({success:false, responseCode:500, message: "Internal Server error",data:error});

            
        }
    },
    getSingleSubjectById:async(req,res)=>{
      try {
        const subjectId = req.params.id;
        const subject = await findSubjectById(subjectId);
        if(!subject){
            return res.status(404).json({success:false, responseCode:404, message:"Subject not found"});
        }
        return res.status(200).json({success:true ,responseCode:200, message:"Subject found",data:subject});
      } catch (error) {
        return res.status(500).json({success:false, responseCode:500, message: "Internal server error",data:error});

        
      }
    },
    updateSubject:async(req,res)=>{
        const validationSchema=joi.object({
            subjectName:joi.string().trim().required(),
            subjectCode:joi.string().trim().required(),
        });
        try {
            const validateBody = await validationSchema.validateAsync(req.body);
            const {subjectName,subjectCode}=validateBody;
            const adminId = req.userId;
            const subjectId = req.params.id;
            const admin = await findAdmin({_id:adminId,role:"admin"});
            if(!admin){
                return res.status(401).json({success:false,responseCode:401,message:"Admin not found"});
            }
            const subject = await findSubjectById(subjectId);
            if(!subject){
                return res.status(404).json({success:false,responseCode:404,message:"Subject not found"});
            }
            const subjectUpdate = await updateSubjectById(subjectId,{subjectName,subjectCode});
            return res.status(200).json({success:true,responseCode:200,message:"Subject updated successfully",data:subjectUpdate});
        } catch (error) {
            return res.status(500).json({success:false,responseCode:500,message:"Internal server error",data:error});
            
        }
    },
    deleteSubject:async(req,res)=>{
        try {
            const adminId = req.userId;
            const subjectId = req.params.id;
            const admin = await findAdmin({_id:adminId,role:"admin"});
            if(!admin){
                return res.status(401).json({success:false,responseCode:401,message:"Admin not found"});
            }
            const subject = await findSubjectById(subjectId);
            if(!subject){
                return res.status(404).json({success:false,responseCode:404,message:"Subject not found"});
            }
            const subjectDelete = await findIdAndDelete(subjectId);
            return res.status(200).json({success:true,responseCode:200,message:"Subject deleted successfully",data:subjectDelete});

        } catch (error) {
            return res.status(500).json({success:false,responseCode:500,message:"Internal server error",data:error});
            
        }
    }











}