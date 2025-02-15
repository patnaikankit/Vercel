import express from 'express';
import { connectRedis, publisher, subscriber } from "../config/redis";
import { copyFileDist, downloadS3Data } from "../services/download-files.service"
import path from "path";

connectRedis();

const buildProject = (ID: string) => {
    return new Promise((resolve, reject) => {
        const child = require("child_process").exec(`cd ${path.join(__dirname, `repos/${ID}`)} && npm install && npm run build`, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve("");
        });

        child.stdout?.on("data", (data: any) => {
            console.log("stdout: " + data);
        });

        child.stderr?.on("data", (data: any) => {
            console.error("stderr" + data);
        });

        child.on("close", (code: any) => {
            console.log(`child process exited with code ${code}`);
            resolve("");
        });
    });
};

export const deployWebApps = async (): Promise<void> => {
    while (true) {
        const response = await subscriber.brPop("build-queue", 0);
        const ID = response?.element;
        if (!ID) continue;

        console.log(`Building web app with ID: ${ID}`);
        await downloadS3Data(`/repos/${ID}`);
        await buildProject(ID);
        copyFileDist(ID);
        publisher.hSet("status", ID, "deployed");
    }
};
