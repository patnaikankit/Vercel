import { Request, Response } from "express";
import { s3 } from "../config/s3";

const getContentType = (filePath: string): string => {
    if (filePath.endsWith(".html")){
        return "text/html";
    } 
    if (filePath.endsWith(".css")){
        return "text/css";
    } 
    if (filePath.endsWith(".js")){
        return "application/javascript";
    }
    return "application/octet-stream"; 
};

export const serveFiles = async (req: Request, res: Response): Promise<void> => { 
    try {
        const host = req.hostname;
        const id = host.split(".")[0];
        const filePath = req.path;
        const bucketName = process.env.AWS_BUCKET_NAME;

        if(!bucketName){
            console.error("❌ Missing AWS_BUCKET_NAME environment variable.");
            res.status(500).json({ error: "Server configuration error: AWS_BUCKET_NAME is missing." });
            return;
        }

        const s3Key = `${id}${filePath}`;

        const data = await s3.getObject({ Bucket: bucketName, Key: s3Key }).promise();

        if(!data.Body){
            console.warn(`⚠️ File found but empty: ${s3Key}`);
            res.set("Content-Type", getContentType(filePath));
            res.status(200).send(""); 
            return;
        }

        res.set("Content-Type", getContentType(filePath));
        res.status(200).send(data.Body.toString());
        
    } catch (error: any) {
        if (error.code === "NoSuchKey") {
            console.warn(`⚠️ File not found in S3: ${req.path}`);
            res.status(404).json({ error: "File not found." });
        } else {
            console.error(`❌ Error retrieving file from S3: ${error.message}`);
            res.status(500).json({ error: "Internal server error." });
        }
    }
};