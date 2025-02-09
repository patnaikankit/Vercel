import { S3 } from "aws-sdk";

if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_ENDPOINT){
    console.error("❌ Missing AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, or AWS_ENDPOINT");
    process.exit(1); 
}

export const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
});
