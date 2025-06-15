const mongoose = require("mongoose");
const classSchema = new mongoose.Schema({
    className:{
        type:String,
    },
    sectionName:{
        type:String,
    },
    teacherId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        require:true,
    },
    studentId: [{
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    }],
    subjectId:[{
        type:mongoose.Types.ObjectId,
        ref:"subject",
        require:true
    }],
},{timestamps:true});
module.exports = mongoose.model("class",classSchema, "class");