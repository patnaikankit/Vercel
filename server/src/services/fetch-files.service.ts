import fs from 'fs';
import path from 'path';

export const fetchFiles = (folderPath: string): string[] => {
    let result: string[] = [];

    const allFiles = fs.readdirSync(folderPath);
    allFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        if(fs.statSync(filePath).isDirectory()){
            result = result.concat(fetchFiles(filePath));
        }
        else{
            result.push(filePath);
        }
    });

    return result;
}