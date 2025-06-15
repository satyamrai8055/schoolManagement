const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schoolSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    contactInfo: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["student", "admin", "teacher"],
        require:true,

    },
    profilePicture: {
        type: String
    },
    status: {
        type: String,
        enum: ["active", "deleted", "blocked"],
        default: "active",
    },
   

}, { timestamps: true }
);

const USER = mongoose.model("user", schoolSchema, "user");

const adminData = async (req, res) => {
    const existingAdmin = await USER.find({ role: "admin" });
    if (existingAdmin.length != 0) {
        console.log(" Admin already present!!");
    } else {
        const obj = {
            userName: "Admin",
            password: bcrypt.hashSync("admin", 10),
            email: "satyamrai382@gmail.com",
            role: "admin",
            profilePicture: "default.jpg",
            status: "active",
            firstName: "satyam",
            lastName: "rai",
            contactInfo: "9580683951",
        };
        const user = await USER.create(obj);
        console.log("Default admin created:", user);
    }
};
adminData();
module.exports = USER;


