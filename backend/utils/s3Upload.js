const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = (file, modelName) => {
    const fileStream = fs.createReadStream(file.path);

    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    //format the file name
    const folderName = modelName.replace(/\s+/g, '').replace(/^(.)/, (match) => match.toLowerCase());

    // Create appropriate subfolder
    const fileTypeFolder = isImage ? 'images' : isVideo ? 'videos' : 'other';

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = path.parse(file.originalname).name;
    const cleanFileName = fileName.replace(/[^\w\-]/g, '').replace(/\s+/g, '-');

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: `${folderName}/${fileTypeFolder}/${cleanFileName}${fileExtension}`,
        ContentType: file.mimetype
    };

    return s3.upload(uploadParams).promise()
};

const deleteFile = (file) => {
    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file
    };

    return s3.deleteObject(deleteParams).promise()
};

module.exports = {
    uploadFile,
    deleteFile
};