const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`)
    .then(() => {
        console.log("MongoDB Database connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB Database connection failed:", error);
    });