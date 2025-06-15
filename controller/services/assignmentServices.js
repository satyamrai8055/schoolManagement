const assignmentModel = require("../../model/assignmentModel");
const userModel = require("../../model/userModel");
const classModel = require("../../model/classModel");
const subjectModel = require("../../model/subjectModel");


const assignmentServices = {

  findTeacher: async (query) => {
    return await userModel.findOne(query);
  },
  findByIdClass: async (query) => {
    return await classModel.findById(query);
  },
  findByIdSubject: async (query) => {
    return await subjectModel.findById(query);
  },
  findByIdAssignment: async (query) => {
    return await assignmentModel.findById(query);
  },
  createHomework: async (insertObj) => {
    return await assignmentModel.create(insertObj);
  },
  findAdmin: async (query) => {
    return await userModel.findOne(query);
  },
  findAssignmentById: async (query) => {
    return await assignmentModel.findById(query);
  },
  findIdAndDelete: async (query) => {
    return await assignmentModel.findByIdAndDelete(query);
  },
  updateAssigmentById: async (query, obj) => {
    return await assignmentModel.findByIdAndUpdate(query, obj, { new: true });
  },







}
module.exports = assignmentServices;