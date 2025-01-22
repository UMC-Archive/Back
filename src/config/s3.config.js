import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.REGION
});
export const s3 = new AWS.S3();
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });