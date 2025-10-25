const express = require('express');
const multer = require('multer');
const {deleteMediaFromCloudinary, uploadMediaToCloudinary} = require('../../helpers/cloudinary');
const fs = require('fs');
const router = express.Router();

const upload = multer({dest:'./uploads'});

router.post('/upload', upload.single('file'), async (req, res)=>{
    try{
     const result = await uploadMediaToCloudinary(req.file.path);
     res.status(200).json({success: true, data: result})
    }catch(e){
        res.status(500).json({success: false, message:'Error Uploading'})
    }finally{
        // Stack overflow: https://stackoverflow.com/questions/64075741/how-to-delete-files-uploaded-with-multer-once-they-are-stored-in-the-cloud
        let resultHandler = function (err) {
        if (err) {
            console.log("unlink failed", err);
        } else {
            console.log("file deleted");
        }
        }

        fs.unlink(req.file.path, resultHandler);
    }
});

router.post('/delete',  async (req, res)=>{
    try{
     const {publicId} = req.body;
     if(!publicId){
        return res.status(400).json({success: false, message:'Asset Id is required'})
     }
     const result = await deleteMediaFromCloudinary(publicId);
     console.log({result})
      res.status(200).json({success: true, message: 'Asset deleted successfully'})

    }catch(e){
        res.status(500).json({success: false, message:'Error Deleting'})
    }
})

module.exports = router;