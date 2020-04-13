
const { exec } = require('child_process');
const fs = require("fs"); // Or `import fs from "fs";` with ESM

module.exports = function deleteTmpDir(tmpDirName,ifExists){
    return new Promise((resolve,reject)=>{
        if (fs.existsSync(tmpDirName)) {
            exec(`rm -rf ${tmpDirName}`,(err,stdout,stderr)=>{
                if (err) reject({err,stderr});
                resolve(stdout);
            })
        }
        else{
            if (!ifExists) {
                reject()
                console.log(`Directory  ${tmpDirName} didn't exist from ${process.cwd()}`)
            }
            else resolve();
        }
        
    })
}
