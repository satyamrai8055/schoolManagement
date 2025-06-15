const uploaderModel = require("../../model/uploaderModel");
const uploaderServices ={

    checkImage: async (query) => {
        return await uploaderModel.findOne(query);
      },
      createUploadImg: async (insertObj) => {
        return await uploaderModel.create(insertObj);
      },
       findAllImage: async () => {
          return await uploaderModel.find().populate("strAuthorizedBy", "userName email")
            
        },












}
module.exports = uploaderServices;