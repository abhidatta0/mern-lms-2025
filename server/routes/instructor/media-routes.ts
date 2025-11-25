import express from 'express';
import multer from 'multer';

import {deleteMediaFromCloudinary, uploadMediaToCloudinary} from '../../helpers/cloudinary';
import { deleteLocalMediaFiles } from '../../uploads/file-handling';
const router = express.Router();

const upload = multer({dest:'./uploads'});

router.post('/upload', upload.single('file'), async (req, res)=>{
    try{
      if(!req.file || !req.file.path){
        return res.status(500).json({success: false, message: 'No file uploaded'})
      }
     const result = await uploadMediaToCloudinary(req.file.path);
     res.status(200).json({success: true, data: result})
    }catch(e){
        res.status(500).json({success: false, message:'Error Uploading'})
    }finally{
        if(!req.file || !req.file.path){
          return res.status(500).json({success: false, message: 'No file uploaded'})
        }
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
     if(!req.files || !Array.isArray(req.files)){
        return res.status(500).json({success: false, message: 'No files uploaded'})
     }
     const uploadPromises = req.files.map((fileItem)=> uploadMediaToCloudinary(fileItem.path));
     const results = await Promise.all(uploadPromises);
     res.status(200).json({success: true, data: results})
    }catch(e){
        res.status(500).json({success: false, message:'Error Uploading files'})
    }finally{
        if(!req.files || !Array.isArray(req.files)){
            return res.status(500).json({success: false, message: 'No files uploaded'})
        }
        const promises = req.files.map((fileItem)=> deleteLocalMediaFiles(fileItem.path));
        await Promise.all(promises);
    }
});

export default router;