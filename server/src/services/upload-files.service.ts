import fs from "fs";
import { s3 } from "../config/s3";

export const uploadFiles = async (fileKey: string, localFilePath: string) => {
    try {
        const fileContent = fs.readFileSync(localFilePath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket: "deployly",
            Key: fileKey,
          }).promise();
          
        console.log(`Uploaded: ${fileKey}`);
        return response;
      } catch (error) {
        console.error(`Failed to upload ${fileKey}:`, error);
        throw error;
      }
};