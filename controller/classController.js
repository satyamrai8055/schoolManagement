const mongoose = require("mongoose");
const joi = require("joi");
const classServices = require("./services/classServices");
const { findAdmin, createClass, findClass, findAllClass, findClassById, findById, updateClassById, findIdAndDelete,aggregationTotal,aggregationClassCountPerSection,aggregationClassByTeacher } = classServices;
module.exports = {
    createNewClass: async (req, res) => {
        const validateSchema = joi.object({
            className: joi.string().trim().required(),
            sectionName: joi.string().trim().required(),
            teacherId: joi.string().required(),
            studentId: joi.array().items(joi.string()).required(), 
            subjectId: joi.array().items(joi.string()).required()
        });
        try {
            // console.log("==============================>satyamrai",className);
        
            const validatedBody = await validateSchema.validateAsync(req.body);
            const { className, sectionName, teacherId, studentId, subjectId } = validatedBody;
            console.log("==============>satyam",validatedBody );
            
            const adminId = req.userId;    
            console.log(adminId);
            
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            console.log(admin);
            
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "You are not an admin" });
            }
            const existingClass = await findClass({ className, sectionName });
            if (existingClass) {
                return res.status(400).json({ success: false, responseCode: 400, message: "Class already exists" });
            }
            const newClass = await createClass({
                className, sectionName, teacherId, studentId, subjectId
            })
            return res.status(200).json({ success: true, responseCode: 200, message: "Class create successfully", newClass })

        } catch (error) {
            console.log(error);
            
            return res.status(400).json({ success: false, responseCode: 400, message: "Internal server error",data:error });

        }

    },
    getClasses: async (req, res) => {
        try {
            const adminId = req.userId;
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Admin not found" });
            }
            const classes = await findAllClass()
            return res.status(200).json({ success: true, data: classes });
        } catch (error) {
            console.error("Get Classes Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    getClassById: async (req, res) => {
        try {
            const classData = await findClassById(req.params.id);
            if (!classData) {
                return res.status(404).json({ success: false, responseCode: 404, message: "Class not found" });
            }
            return res.status(200).json({ success: true, data: classData });

        } catch (error) {

        }
    },
    updateClassById: async (req, res) => {
        const validateSchema = joi.object({
            className: joi.string().required(),
            sectionName: joi.string().required(),
        });
        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const { className, sectionName } = validatedBody
            const adminId = req.userId;
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Unauthorized: Admin access only" });
            }
            const classData = await findById(req.params.id);
            console.log(classData);

            if (!classData) {
                return res.status(404).json({ success: false, responseCode: 404, message: "Class not found" });
            }
            const updatedClass = await updateClassById(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Class updated", data: updatedClass });

        } catch (error) {
            console.error("Update Class Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" })

        }
    },
    deleteClassById: async (req, res) => {
        try {
            const adminId = req.userId;
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Unauthorized: Admin access only" });
            }
            const classData = await findById(req.params.id);
            if (!classData) {
                return res.status(404).json({ success: false, responseCode: 404, message: "Class not found" })
                    ;
            }
            const deletedClass = await findIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, responseCode:200 ,message: "Class deleted", data: deletedClass });
        } catch (error) {
            console.error("Delete Class Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    },





    getTotalStudentInEachClass:async(req, res)=>{
        try {
            const adminId = req.userId;
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message:"Unauthorized: Admin access only"});
            }
            const classes = await aggregationTotal();
            return res.status(200).json({ success: true, message: "Total students in each",data:classes});
            
        } catch (error) {
            console.error("Get Total Student In Each Class Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
            
        }
    },
    getClassCountPerSection: async(req, res)=>{
        try {
           const adminId = req.userId;
           const admin = await findAdmin({ _id: adminId, role: "admin" });
           if (!admin) {
            return res.status(401).json({ success: false, responseCode: 401, message : "Unauthorized: Admin access only"});
           }
           const classes = await aggregationClassCountPerSection();
           return res.status(200).json({ success: true, message: "Class count per section",data:classes});
        } catch (error) {
            console.error("Get Class Count Per Section Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
            
        }
    },
    getClassByTeacher:async(req, res)=>{
        try {
            const adminId = req.userId;
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Unauthorized: Admin access only"});
            }
            const classes = await aggregationClassByTeacher();
            return res.status(200).json({ success: true, message: "Class by teacher",data:classes});
            
        } catch (error) {
            console.error("Get Class By Teacher Error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error"});

            
        }
    }



































}