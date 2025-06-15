const mongoose = require("mongoose");
const joi = require("joi")
const helper = require("../helper/util");
const uploaderServices = require("./services/uploaderServices");
const {createUploadImg ,findAllImage ,checkImage }=uploaderServices




module.exports={

    uploadImage:async(req, res)=>{
        const validateSchema = joi.object({
            strEmpId:joi.string().required(),
            strSchoolId:joi.string().required(),
            strSessionId:joi.string().required(),
            strDocumentType:joi.string().required(),
            strFileType:joi.string().required(),
            strBase64File:joi.string().required(),
            strSectionIds:joi.string().required(),
            strDocumentName:joi.string().required(),
            strAuthorizedBy:joi.string().required()

        });
        try {
            const validatedBody = await validateSchema.validateAsync(req.body);
            const  {strEmpId,strSchoolId,strSessionId,strDocumentType,strFileType,strBase64File,strSectionIds,strDocumentName,strAuthorizedBy}=validatedBody;
            const uploadUrl = await helper.uploadBase64File(strBase64File);
            const saveData = await createUploadImg({
                strEmpId,
                strSchoolId,
                strSessionId,
                strDocumentType,
                strFileType,
                strSectionIds,
                strDocumentName,
                cloudinaryUrl: uploadUrl,
                strAuthorizedBy
            });
            return res.status(200).json({
                message: "File uploaded successfully",
                data: saveData
              });

        } catch (error) {
            return res.status(400).json({
                message: error.message || "Something went wrong"
              });
        }

    },
    getAllDocuments: async (req, res) => {
        try {
          const docs = await findAllImage();
          res.status(200).json({ success: true, data: docs });
        } catch (err) {
          res.status(500).json({ success: false, message: "Internal server error", error: err });
        }
      },
    
      getDocumentsByUserId: async (req, res) => {
        try {
          const userId = req.params.userId;
          const docs = await checkImage({ strAuthorizedBy: userId });
          if (!docs.length) {
            return res.status(404).json({ success: false, message: "No documents found for this user." });
          }
          res.status(200).json({ success: true, data: docs });
        } catch (err) {
          res.status(500).json({ success: false, message: "Internal server error", error: err });
        }
      }



































































}