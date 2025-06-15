const  subjectModel = require("../../model/subjectModel");
const userModel = require("../../model/userModel");
const subjectService = {
    checkSubject: async (query) => {
        return await subjectModel.findOne(query);
      },
      createSubject: async (insertObj) => {
        return await subjectModel.create(insertObj);
      },
      findAllSubject: async () => {
        return await subjectModel.find().populate("teacherId","firstName lastName emailrst");
      },
      updateSubjectById: async (query, obj) => {
        return await subjectModel.findByIdAndUpdate(query, obj, { new: true });
      },
      findSubjectById: async (query) => {
        return await subjectModel.findById(query).populate("teacherId", "firstName lastName email");
      },
      findIdAndDelete: async (query) => {
        return await subjectModel.findByIdAndDelete(query);
      },
      findAdmin: async (query) => {
        return await userModel.findOne(query);
      },
      
}
module.exports=subjectService;