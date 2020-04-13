const { exec } = require('child_process');
const random = require('lodash.random');
const {TMP_DIR_NAME} = require('../constants.js');
const deleteTempDir = require('./util/deleteTmpDir.js');

function makeTmpDir(){
    const tmpDirName = TMP_DIR_NAME;

    return new Promise((resolve,reject)=>{
        exec(`mkdir ${tmpDirName}`,(err,stdout,stderr)=>{
            if (err) reject({err,stderr});
            resolve({
                stdout,
                tmpDirName
            });
        })
    })
}

function goInTmpDir(tmpDirName){
    return new Promise((resolve,reject)=>{
        try{
            process.chdir(tmpDirName);
            resolve(tmpDirName);
        }
        catch(e){
            reject(e);
        }
        
    })
}

module.exports = function before(){
    return new Promise((resolve,reject)=>{
        deleteTempDir(TMP_DIR_NAME,true).then(()=>{return makeTmpDir()})
            .then((data)=>{return goInTmpDir(data.tmpDirName)})
            .then((tmpDirName)=>{resolve(tmpDirName)})
            .catch((e)=>{

                reject(e)
            })
    })
}
