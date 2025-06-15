const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../model/userModel");
const cloudinary =  require('cloudinary');


module.exports = {
  getToken: async (payload) => {
    var token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  },
  auth: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];

      if (!token) {
        return res
          .status(403)
          .send({ responseCode: 403, responseMessage: "Access denied!!!" });
      } else {
        const result = await model.find(
          { _id: token._id },
          { status: "active" }
        );

        if (result) {
          jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
            if (err) {
              return res
                .status(400)
                .send({ responseCode: 400, responseMessage: "Bad request" });
            } else {
              req.userId = result._id;
              return next();
            }
          });
        } else {
          return res
            .status(403)
            .send({ responseCode: 403, responseMessage: "Unauthorized" });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .send({ responseCode: 500, responseMessage: "Something went wrong" });
    }
  },
//   uploadBase64File: async (base64File) => {
//     try {
//       const result = await cloudinary.uploader.upload(base64File, {
//         resource_type: "auto"
//       });
//       console.log(result);
//       return result.secure_url;

//     } catch (error) {
//       console.log(error);
//       return error


//     }
  
// },
 




cloudinary: async (data)=> {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'duk93vvi3', 
        api_key: '952785255291781', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(data)
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
}











}