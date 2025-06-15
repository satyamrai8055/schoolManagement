const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema({
    subjectName:{
        type:String,
    },
    subjectCode:{
        type:String,
    },
    teacherId:{
          type:mongoose.Types.ObjectId,
                ref:"user",
                require:true,
    },
},{timestamps:true}
);
module.exports = mongoose.model("subject",subjectSchema,"subject");