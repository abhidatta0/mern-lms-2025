const fs = require('fs');

// Stack overflow: https://stackoverflow.com/questions/64075741/how-to-delete-files-uploaded-with-multer-once-they-are-stored-in-the-cloud
const deleteLocalMediaFiles = (filePath)=>{
    let resultHandler = function (err) {
    if (err) {
        console.log("unlink failed", err);
    } else {
        console.log("file deleted");
    }
    }

    fs.unlink(filePath, resultHandler);
}

module.exports = {deleteLocalMediaFiles};