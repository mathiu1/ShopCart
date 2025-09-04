const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const ErrorHandler = require("../utils/errorHandler");



const fileFilter=(req,file,cb)=>{
    const allowedTypes=/jpeg|jpg|png/;
    const isAllowed= allowedTypes.test(file.mimetype);

    if(isAllowed){
        cb(null,true)
    }else{
        cb(new ErrorHandler("only .jpeg, .png, or .jpg files are allowed",400))
    }
}

exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
        const extension =path.extname(file.originalname);
      
    const  newName=uuidv4()+extension;

    file.newName=newName;
      cb(null, newName);
    },
  }),


  limits:{
    fileSize:3*1024*1024,
    
  },
  fileFilter:fileFilter,


});



exports.uploads = multer({
  
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/products"));
    },
    filename: function (req, file, cb) {
        const extension =path.extname(file.originalname);
      
    const  newName=uuidv4()+extension;

    file.newName=newName;
      cb(null, newName);
    },
  }),


  limits:{
    fileSize:3*1024*1024,
    
  },
  fileFilter:fileFilter,


});
