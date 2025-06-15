const express = require("express");
const router = express.Router();
router.use(express.json());
const subjectController = require("../controller/subjectController");
const common = require("../helper/util");
router.post("/createSubject",common.auth,subjectController.createSubject);
router.get("/getAllSubject",subjectController.getAllSubject);
router.get("/getSingleSubjectById/:id",subjectController.getSingleSubjectById);
router.put("/updateSubject/:id",common.auth,subjectController.updateSubject);
router.delete("/deleteSubject/:id",common.auth,subjectController.deleteSubject);












module.exports=router;
