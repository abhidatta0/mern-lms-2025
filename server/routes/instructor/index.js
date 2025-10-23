const express = require('express');
const multer = require('multer');
const {deleteMediaFromCloudinary, uploadMediaToCloudinary} = require('../../helpers/cloudinary');

const router = express.Router();

const upload = multer({dest:'uploads/'});

router.post('/upload', upload.single('file'), async (req, res)=>{
    try{
     const result = await uploadMediaToCloudinary(req.file.path);
     res.status(200).json({success: true, data: result})
    }catch(e){
        res.status(500).json({success: false, message:'Error Uploading'})
    }
});

router.delete('/delete/:id',  async (req, res)=>{
    try{
     const {id} = req.params;
     if(!id){
        return res.status(400).json({success: false, message:'Asset Id is required'})
     }
     const result = await deleteMediaFromCloudinary(id);
      res.status(200).json({success: true, message: 'Asset deleted successfully'})

    }catch(e){
        res.status(500).json({success: false, message:'Error Deleting'})
    }
})

module.exports = router;