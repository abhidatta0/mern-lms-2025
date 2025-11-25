import fs, { NoParamCallback } from 'fs';

// Stack overflow: https://stackoverflow.com/questions/64075741/how-to-delete-files-uploaded-with-multer-once-they-are-stored-in-the-cloud
export const deleteLocalMediaFiles = (filePath:string)=>{
    let resultHandler:NoParamCallback = function (err) {
    if (err) {
        console.log("unlink failed", err);
    } else {
        console.log("file deleted");
    }
    }

    fs.unlink(filePath, resultHandler);
}

