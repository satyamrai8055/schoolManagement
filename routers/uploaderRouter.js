const express = require("express");
const router = express.Router();
router.use(express.json());
const common = require("../helper/util");
const controller = require("../controller/uploaderController");

/**
 * @swagger
 * /api/v1/uploader/uploadImage:
 *   post:
 *     summary: Upload a document to Cloudinary and save metadata
 *     tags:
 *       - Document Uploader
 *     description: Uploads a document using base64 or file and stores metadata in MongoDB
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: strEmpId
 *         in: formData
 *         type: string
 *         required: true
 *         description: Employee ID
 *       - name: strSchoolId
 *         in: formData
 *         type: string
 *         required: true
 *         description: School ID
 *       - name: strSessionId
 *         in: formData
 *         type: string
 *         required: true
 *         description: Session ID
 *       - name: strDocumentType
 *         in: formData
 *         type: string
 *         required: true
 *         description: Type of document (e.g., "Marksheet")
 *       - name: strFileType
 *         in: formData
 *         type: string
 *         required: true
 *         description: File type (e.g., PDF, JPG)
 *       - name: strBase64File
 *         in: formData
 *         type: string
 *         required: true
 *         description: Base64-encoded file string
 *       - name: strSectionIds
 *         in: formData
 *         type: string
 *         required: true
 *         description: Section IDs
 *       - name: strDocumentName
 *         in: formData
 *         type: string
 *         required: true
 *         description: Document name/title
 *       - name: strAuthorizedBy
 *         in: formData
 *         type: string
 *         required: true
 *         description: ID of the authorized user
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Validation or upload error
 *       500:
 *         description: Internal server error
 */
router.post("/uploadImage",controller.uploadImage);
/**
 * @swagger
 * /api/v1/uploader/getAllDocuments:
 *   get:
 *     summary: Get all uploaded documents
 *     tags:
 *       - Document Uploader
 *     description: Returns a list of all documents with metadata
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all documents
 *       500:
 *         description: Internal server error
 */
router.get("/getAllDocuments",controller.getAllDocuments);
/**
 * @swagger
 * /api/v1/uploader/getDocumentsByUserId/{userId}:
 *   get:
 *     summary: Get uploaded documents by user ID
 *     tags:
 *       - Document Uploader
 *     description: Returns documents uploaded by a specific user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: MongoDB ObjectId of the authorized user
 *     responses:
 *       200:
 *         description: Successfully retrieved user documents
 *       404:
 *         description: No documents found
 *       500:
 *         description: Internal server error
 */

router.get("/getDocumentsByUserId",common.auth,controller.getDocumentsByUserId)




























module.exports=router;