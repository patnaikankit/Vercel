import { s3 } from "../config/s3";
import fs from "fs";
import path from "path";
import { fetchFiles } from "./fetch-files.service";
import { uploadFiles } from "./upload-files.service";

export const downloadS3Data = async (prefix: string): Promise<void> => {
    const bucketName = process.env.AWS_BUCKET;
    if(!bucketName){
        throw new Error("AWS_BUCKET environment variable is not set.");
    }

    const allFiles = await s3.listObjectsV2({ 
        Bucket: bucketName,
        Prefix: prefix, }).promise();

        const s3DownloadTasks = allFiles.Contents?.map(async ({ Key }) => {
            return new Promise((resolve, reject) => {
                if(!Key) return resolve("");

                const filePath = path.join(__dirname, Key);
                const fileStream = fs.createWriteStream(filePath);
                const dirName = path.dirname(filePath);
                if(!fs.existsSync(dirName)){
                    fs.mkdirSync(dirName, { recursive: true });
                }
                const s3Stream = s3.getObject({ 
                    Bucket: bucketName, 
                    Key })
                    .createReadStream()
                    .pipe(fileStream)
                    .on("finish", () => {
                        resolve("")
                    });
            });
         }) || [];

         console.log("Downloading files from S3");

         const response = await Promise.all(s3DownloadTasks?.filter((task) => task !== undefined) || []);
};

export const copyFileDist = async (ID: string) => {
    const source = path.join(__dirname, `repos/${ID}/dist`);
    const getFiles = fetchFiles(source);

    const allFiles = await getFiles;

    allFiles.forEach((file: any) => {
        uploadFiles(file.slice(__dirname.length + 1), file);
    });
}