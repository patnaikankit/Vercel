import express from 'express';
import { randomUUID } from 'crypto';
import simpleGit from 'simple-git';
import { fetchFiles } from '../services/fetch-files.service';
import path from 'path';
import { uploadFiles } from '../services/upload-files.service';
import { publisher, subscriber, connectRedis } from "../config/redis"

connectRedis();

export const uploadRepo = async (req: express.Request, res: express.Response): Promise<void> => { 
    try {
        const repoUrl = req.body.repoUrl;
        if (!repoUrl) {
            res.status(400).json({ error: "Missing repository URL." });
            return;
        }

        const ID = randomUUID();
        const repoPath = path.resolve(__dirname, `../../repos/${ID}`);

        console.log(`🚀 Cloning repo: ${repoUrl} -> ${repoPath}`);

        await simpleGit().clone(repoUrl, repoPath);
        console.log("✅ Repository cloned successfully.");

        const files = await fetchFiles(repoPath);
        console.log(`📂 Found ${files.length} files. Uploading...`);

        for(const file of files){
            await uploadFiles(file.slice(__dirname.length + 1), file);
        }

        console.log("✅ All files uploaded.");

        await new Promise((resolve) => setTimeout(resolve, 5000));

        await publisher.lPush("build-queue", ID);
        await publisher.hSet("status", ID, "uploaded");

        console.log(`📡 Repo ${ID} added to build queue.`);

        res.status(200).json({ ID });
    } catch (error: any) {
        console.error("❌ Error uploading repository:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getStatus = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const id = req.query.id as string;
  
      if (!id) {
        res.status(400).json({ error: "Missing required query parameter: id" });
        return;
      }
  
      const status = await subscriber.hGet("status", id);
  
      if (!status) {
        res.status(404).json({ error: `No status found for ID: ${id}` });
        return;
      }
  
      res.status(200).json({ status });
    } catch (error: any) {
      console.error("❌ Error fetching status:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  };