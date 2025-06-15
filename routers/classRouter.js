const express = require("express");
const router = express.Router();
router.use(express.json());
const common = require("../helper/util");
const classController = require("../controller/classController");
/**
 * @swagger
 * /api/v1/class/createNewClass:
 *   post:
 *     summary: Create a new class
 *     tags:
 *       - CLASS (ADMIN)
 *     description: Allows admin to create a new class with class name, section, teacher, students, and subjects.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: admin  token
 *         required: true
 *         type: string
 *       - name: className
 *         in: formData
 *         type: string
 *         required: true
 *         description: Name of the class
 *       - name: sectionName
 *         in: formData
 *         type: string
 *         required: true
 *         description: Name of the section
 *       - name: teacherId
 *         in: formData
 *         type: string
 *         required: true
 *         description: ID of the assigned teacher
 *       - name: studentId
 *         in: body
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *         description: Array of student IDs
 *       - name: subjectId
 *         in: body
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *         description: Array of subject IDs
 *     responses:
 *       200:
 *         description: Class created successfully
 *       400:
 *         description: Class already exists or invalid data
 *       401:
 *         description: You are not an admin
 */

router.post("/createNewClass",common.auth,classController.createNewClass);
router.get("/getClasses", common.auth,classController.getClasses);
router.get("/getClassById/:id",classController.getClassById);
router.put("/updateClassById/:id",common.auth,classController.updateClassById);
router.delete("/deleteClassById/:id",common.auth,classController.deleteClassById);
router.get("/getTotalStudentInEachClass",common.auth,classController.getTotalStudentInEachClass);
router.get("/getClassCountPerSection",common.auth,classController.getClassCountPerSection);
router.get("/getClassByTeacher",common.auth,classController.getClassByTeacher);















module.exports=router
