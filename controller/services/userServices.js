const userModel = require("../../model/userModel");
const UserServices = {
  checkUser: async (query) => {
    return await userModel.findOne(query);
  },
  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },
  findAllUser: async () => {
    return await userModel.find();
  },
  findUserById: async (id) => {
    return await userModel
      .findOne({ $and: [{ _id: id }, { status: { $ne: "deleted" } }] })
      .select("firstName lastName email role status");
  },
  updateUserById: async (query, obj) => {
    return await userModel.findByIdAndUpdate(query, obj, { new: true });
  },
  findById: async (query) => {
    return await userModel.findById(query);
  },
  findIdAndDelete: async (query) => {
    return await userModel.findByIdAndDelete(query);
  },
  findAdmin: async (query) => {
    return await userModel.findOne(query);
  },
  countStudent: async (query) => {
    return await userModel.countDocuments(query);
  },
}
module.exports = UserServices;