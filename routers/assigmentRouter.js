const express = require("express");
const router = express.Router();
router.use(express.json());
const controller = require("../controller/assignmentController");
const common = require("../helper/util");
/**
 * @swagger
 * /api/v1/assigment/createAssignment:
 *   post:
 *     summary: Create a new homework or assignment
 *     tags:
 *       - HOMEWORK
 *     description: Teacher can create a homework for a class
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Token for teacher authentication
 *         required: true
 *         type: string
 *       - name: homeworkType
 *         in: formData
 *         required: true
 *         type: string
 *         description: Type of homework
 *       - name: classId
 *         in: formData
 *         required: true
 *         type: string
 *         description: ID of the class
 *       - name: subjectId
 *         in: formData
 *         required: true
 *         type: string
 *         description: ID of the subject
 *       - name: fromDate
 *         in: formData
 *         required: true
 *         type: string
 *         format: date
 *         description: Starting date of the homework
 *       - name: toDate
 *         in: formData
 *         required: true
 *         type: string
 *         format: date
 *         description: Ending date of the homework
 *       - name: HomeworkTitle
 *         in: formData
 *         required: true
 *         type: string
 *         description: Title of the homework
 *       - name: description
 *         in: formData
 *         required: true
 *         type: string
 *         description: Detailed description
 *       - name: maxMarks
 *         in: formData
 *         required: true
 *         type: string
 *         description: Maximum marks assigned
 *       - name: attachmentUrl
 *         in: formData
 *         required: true
 *         type: file
 *         description: File upload (PDF/Image etc.)
 *       - name: urlLinks
 *         in: formData
 *         required: true
 *         type: string
 *         description: Link to any external resource (Google Drive, YouTube etc.)
 *     responses:
 *       200:
 *         description: Homework created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - only teacher can create
 *       500:
 *         description: Internal server error
 */


router.post("/createAssignment",common.auth,controller.createAssignment);
router.get("/getAssignment/:id",controller.getAssignment);
router.delete("/deleteAssignment/:id",common.auth,controller.deleteAssignment)
router.put("/updateAssignment/:id",common.auth,controller.updateAssignment)










module.exports=router