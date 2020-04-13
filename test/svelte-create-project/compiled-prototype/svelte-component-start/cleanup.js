const { exec } = require('child_process');
const fs = require("fs"); // Or `import fs from "fs";` with ESM
const deleteTmpDir = require('./util/deleteTmpDir.js');

function stepOutOfTmpDir(tmpDirName){
    return new Promise((resolve,reject)=>{
        try{
            process.chdir('..');
            resolve(tmpDirName);
        }
        catch(e){
            reject(e);
        }
        
    })
}




module.exports = function(tmpDirName){
    return new Promise((resolve,reject)=>{
        stepOutOfTmpDir(tmpDirName)
            .then((tmpDirName)=>{
                return deleteTmpDir(tmpDirName)
            }).then(resolve).catch(reject)
    })
}
