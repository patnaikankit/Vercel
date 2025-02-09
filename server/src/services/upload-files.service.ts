import fs from "fs/promises"; 
import { s3 } from "../config/s3";

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!BUCKET_NAME) {
  console.error("❌ Missing AWS_BUCKET_NAME environment variable.");
  process.exit(1);
}

export const uploadFiles = async (fileKey: string, localFilePath: string) => {
  try {
    await fs.access(localFilePath);

    const fileContent = await fs.readFile(localFilePath);

    const response = await s3.upload({
      Body: fileContent,
      Bucket: BUCKET_NAME,
      Key: fileKey,
    }).promise();

    console.log(`✅ Uploaded: ${fileKey} -> ${BUCKET_NAME}/${fileKey}`);
    return response;
  } catch (error: any) {
    console.error(`❌ Failed to upload ${fileKey}:`, error.message);

    throw new Error(`Upload failed for ${fileKey}: ${error.message}`);
  }
};
