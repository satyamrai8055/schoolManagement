const mongoose = require('mongoose');

const uploaderSchema = new mongoose.Schema({
  strEmpId: { 
    type: String,
    require:null
  },
  strSchoolId:{
     type: String,
     require:null
     },
  strSessionId:{
     type: String
     },
  strDocumentType:{
     type: String 
    },
  strFileType:{
     type: String 
    },
  strSectionIds:{
     type: String,
     require:null
     },
  strDocumentName:{
     type: String,
     require:null 
    },
  cloudinaryUrl:{ 
    type: String, required: true
 },
  strAuthorizedBy:{
     type: mongoose.Schema.Types.ObjectId, ref: 'user'
     }
}, {
  timestamps: true
});

module.exports = mongoose.model('uploader', uploaderSchema, "uploader");
