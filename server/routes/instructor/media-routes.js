const express = require('express');
const multer = require('multer');
const {deleteMediaFromCloudinary, uploadMediaToCloudinary} = require('../../helpers/cloudinary');
const fs = require('fs');
const { deleteLocalMediaFiles } = require('../../uploads/file-handling');
const router = express.Router();

const upload = multer({dest:'./uploads'});

router.post('/upload', upload.single('file'), async (req, res)=>{
    try{
     const result = await uploadMediaToCloudinary(req.file.path);
     res.status(200).json({success: true, data: result})
    }catch(e){
        res.status(500).json({success: false, message:'Error Uploading'})
    }finally{
        deleteLocalMediaFiles(req.file.path);
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

router.post('/bulk-upload', upload.array('files',10), async (req, res)=>{
    try{
     const uploadPromises = req.files.map((fileItem)=> uploadMediaToCloudinary(fileItem.path));
     const results = await Promise.all(uploadPromises);
     res.status(200).json({success: true, data: results})
    }catch(e){
        res.status(500).json({success: false, message:'Error Uploading files'})
    }finally{
        const promises = req.files.map((fileItem)=> deleteLocalMediaFiles(fileItem.path));
        await Promise.all(promises);
    }
});

module.exports = router;