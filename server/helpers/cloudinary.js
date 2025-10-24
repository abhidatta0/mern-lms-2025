const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath)=>{
    try{
        const result = await cloudinary.uploader.upload(filePath,{
        resource_type:'auto',
        folder:'mern-lms'
        });
        return result;
    }catch(error){
       console.log({error});
       throw new Error('Error Uploading to Cloudinary')
    }
}

const deleteMediaFromCloudinary = async (publicId)=>{
    try{
        /* First we get the resource info for resource_type, then we call destroy() */
        const assetData = await cloudinary.search.expression(`public_id="${publicId}"`).execute();
        if (assetData.total_count === 0) {
            throw new Error(`Resource not found: ${publicId}`);
        }

        const resource = assetData.resources[0];
        const result = await cloudinary.uploader.destroy(publicId,{invalidate:true, resource_type:resource.resource_type});
        return result;
    }catch(error){
       console.log({error});
       throw new Error('Error Deleting media from Cloudinary')
    }
}

module.exports = {uploadMediaToCloudinary, deleteMediaFromCloudinary};