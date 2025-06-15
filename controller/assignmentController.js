const mongoose = require("mongoose");
const joi = require("joi");
const helper = require("../helper/util")
const assignmentServices = require("./services/assignmentServices");
const { findTeacher, findByIdClass, findByIdSubject, createHomework, findByIdAssignment, findAdmin, findAssignmentById, findIdAndDelete, updateAssigmentById } = assignmentServices

module.exports = {

    createAssignment: async (req, res) => {
        const validateSchema = joi.object({
            homeworkType: joi.string().valid("Homework", "Assignment", "project", "quiz", "exam").trim().required(),
            classId: joi.string().trim().required(),
            subjectId: joi.string().trim().required(),
            fromDate: joi.string().required().custom(v => new Date(v.split("/").reverse().join("-"))),
            toDate: joi.string().required().custom(v => new Date(v.split("/").reverse().join("-"))),
            HomeworkTitle: joi.string().trim().required(),
            description: joi.string().trim().required(),
            maxMarks: joi.string().trim().required(),
            attachmentUrl: joi.string().trim().required(),
            urlLinks: joi.string().trim().required()
        }); console.log("================================================>");

        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const { homeworkType, classId, subjectId, fromDate, toDate, HomeworkTitle, description, maxMarks, attachmentUrl, urlLinks } = validatedBody;

            const existingteacher = await findTeacher({ $and: [{ _id: req.userId }, { role: "teacher" }] });


            if (!existingteacher) {
                return res.status(401).json({ success: false, responseCode: 401, message: " teacher not found" });
            }
            //  Check if class and subject exist
            const existingClass = await findByIdClass(classId);
            if (!existingClass) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Class not found" });
            }
            const existingSubject = await findByIdSubject(subjectId);
            console.log(existingSubject);

            if (!existingSubject) {
                return res.status(401).json({ success: false, message: "Subject not found" });
            }
            //  Optional: Cloudinary upload if file present
            let uploadedUrl = attachmentUrl;
            if (req.file) {
                const result = await helper.cloudinary.uploader.upload(req.file.path, {
                    resource_type: "raw",
                    folder: "school/homework"
                });
                uploadedUrl = result.secure_url;
            }
            const homework = await createHomework({
                homeworkType,
                classId,
                subjectId,
                fromDate,
                toDate,
                HomeworkTitle,
                description,
                maxMarks,
                attachmentUrl: uploadedUrl,
                urlLinks,

            });

            return res.status(200).json({ success: true, responseCode: 200, message: "Homework created successfully", homework });
        } catch (error) {
            console.error("Error creating homework:", error.message);
            return res.status(500).json({ success: false, responseCode: 500, message: "Internal server error" })
        }
    },
    getAssignment: async (req, res) => {
        try {

            const assignment = await findByIdAssignment(req.params.id);

            if (!assignment) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Assignment not found" });
            }

            return res.status(200).json({
                success: true,
                responseCode: 200,
                message: "Assignment found successfully",
                assignment,
            });
        } catch (error) {
            console.error("Error fetching assignment:", error.message);
            return res.status(500).json({
                success: false,
                responseCode: 500,
                message: "Internal server error",
            });
        }
    },
    updateAssignment: async (req, res) => {
        try {
            const assignmentId = req.params.id;
            const adminId = req.userId;
            const { fromDate, toDate, homeworkType, maxMarks } = req.body;

            const admin = await findAdmin({ _id: adminId, role: "admin" });
            
            
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Admin not found" });
            }
            const existingAssignment = await findAssignmentById(assignmentId);
            if (!existingAssignment) {
                return res.status(404).json({ success: false, message: "Assignment not found" });
            }

            const updatedFields = {};
            if (fromDate) updatedFields.fromDate = fromDate;
            if (toDate) updatedFields.toDate = toDate;
            if (homeworkType) updatedFields.homeworkType = homeworkType;
            if (maxMarks) updatedFields.maxMarks = maxMarks;

            const updatedAssignment = await updateAssigmentById(assignmentId, updatedFields);
            return res.status(200).json({ success: true, message: "Assignment updated", updatedAssignment });
        } catch (error) {
            console.error("Update error:", error.message);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

    },
    deleteAssignment: async (req, res) => {
        try {
            const adminId = req.userId;
            const assignmentId = req.params.id;
            const admin = await findAdmin({ _id: adminId, role: "admin" });
            if (!admin) {
                return res.status(401).json({ success: false, responseCode: 401, message: "Admin not found" });
            }
            const assignment = await findAssignmentById(assignmentId);
            if (!assignment) {
                return res.status(404).json({ success: false, responseCode: 404, message: "Assignment not found" });
            }
            const assignmentDelete = await findIdAndDelete(assignmentId);
            return res.status(200).json({ success: true, responseCode: 200, message: "Assignment deleted successfully", data: assignmentDelete });

        } catch (error) {
            console.log(error.message);

            return res.status(500).json({ success: false, responseCode: 500, message: "Internal server error", data: error });

        }
    }


































}