import fs from "fs/promises";
import path from "path";

export const fetchFiles = async (folderPath: string): Promise<string[]> => {
  let result: string[] = [];

  try {
    const allFiles = await fs.readdir(folderPath);

    for (const file of allFiles) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        const nestedFiles = await fetchFiles(filePath); 
        result = result.concat(nestedFiles);
      } else {
        result.push(filePath);
      }
    }
  } catch (error: any) {
    console.error(`❌ Error reading directory ${folderPath}: ${error.message}`);
    throw new Error(`Failed to fetch files from ${folderPath}`);
  }

  return result;
};
