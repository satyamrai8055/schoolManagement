const express = require("express");
const app = express();
require("dotenv").config();
require("./config/dbConnection");
const port = process.env.PORT || 5000
const Router =require("./routers/userRouter");
const router = require("./routers/classRouter");
const subjectRouter = require("./routers/subjectRouter");
const uploaderRouter = require("./routers/uploaderRouter")
const assignmentRouter = require("./routers/assigmentRouter");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require ("swagger-ui-express");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 



app.use("/api/v1",Router);
app.use("/api/v1/class",router);
app.use("/api/v1/subject",subjectRouter);
app.use("/api/v1/uploader",uploaderRouter)
app.use("/api/v1/assigment",assignmentRouter)





// swagger>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>================
const definition = {
    info: {
      title: 'nodejs',
      version: '1.0.0',
      description:"Swagger ",
    },
    host:`localhost:1574`,
    basePath:"/",
};
const options={
  definition:definition,
  apis: ['./routers/*.js'],

};
const swaggerSpace = swaggerJSDoc(options);
app.get("/swagger.json",(req,res)=>{
  res.setHeader("Content-Type","application/json");
  res.send(swaggerSpace);
});
app.use("/api_docs",swaggerUi.serve,swaggerUi.setup(swaggerSpace));


app.listen(port,()=>{
    console.log(`Server is running on port ${port} - ${new Date()}`);
})