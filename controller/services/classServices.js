const classModel = require("../../model/classModel");
const userModel = require("../../model/userModel")
const classServices = {
  findClass: async (query) => {
    return await classModel.findOne(query);
  },
  createClass: async (insertObj) => {
    return await classModel.create(insertObj);
  },
  findAllClass: async () => {
    return await classModel.find()
      .populate("teacherId", "firstName lastName email")
      .populate("studentId", "firstName lastName email")
      .populate("subjectId", "subjectName");
  },
  aggrationFindAllClass: async () => {
    return await classModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher"
        }
      },
      {
        $unwind: "$teacher"
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "students"
        }
      },
      {
        $lookup: {
          from: "subjects", 
          localField: "subjectId",
          foreignField: "_id",
          as: "subjects"
        }
      },
      {
        $project: {
          className: 1,
          sectionName: 1,
          "teacher.firstName": 1,
          "teacher.lastName": 1,
          "teacher.email": 1,
          "students.firstName": 1,
          "students.lastName": 1,
          "students.email": 1,
          "subjects.subjectName": 1
        }
      }
    ]);
  },
  updateClassById: async (query, obj) => {
    return await classModel.findByIdAndUpdate(query, obj, { new: true });
  },
  findClassById: async (query) => {
    return await classModel.findById(query)
    .populate("teacherId","firstName lastName email role ")
    .populate("studentId","firstName lastName email role")
    .populate("subjectId");
  },
  findById: async (query) => {
    return await classModel.findById(query);
  },

  
  findIdAndDelete: async (query) => {
    return await classModel.findByIdAndDelete(query);
  },
  findAdmin: async (query) => {
    return await userModel.findOne(query);
  },
  countStudent: async (query) => {
    return await classModel.countDocuments(query);
  },
  aggregationTotal:async(query)=>{
    return await classModel.aggregate([
      {
        $project: {
          className: 1,
          sectionName: 1,
          studentCount: { $size: "$studentId" }
        }
      }
    ]);;
  },
  aggregationClassCountPerSection:async(query)=>{
    return await classModel.aggregate([
      {
        $group: {
          _id: "$sectionName",
          count: { $sum: 1}

        }
      }
    ]);
  },
  aggregationClassByTeacher:async(query)=>{
    return await classModel.aggregate([
      {
        $lookup:{
          from: 'users',
          localField: 'teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      {
        $unwind: "$teacher"
      },
      {
        $group: {
          _id: "$teacher.nameName",
          count: { $sum: 1 }
          }
      }
    ])
  }
  






























}
module.exports = classServices;