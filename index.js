String.prototype.count=function(c) { 
    var result = 0, i = 0;
    for(i;i<this.length;i++)if(this[i]==c)result++;
    return result;
  };

  function sortByNumberOfSlashesDesc(a,b){
    return b.count('/')-a.count('/');
}

const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');
const replace = require('replace-in-file');

function copyDirectory(compileFromParentPath,compileFromDirName,destinationParentPath,destinationDirName){
    return new Promise((resolve,reject)=>{
        ncp(path.join(compileFromParentPath,compileFromDirName),path.join(destinationParentPath,destinationDirName),function(err){
            if (err){
                reject(err)
            }
            else resolve()
        })
    })
}


const walkDir = require('@nickmanning214/walk-tree/implementations/walkDirectory.js');
module.exports = async function(compileFromParentPath,compileFromDirName,destinationParentPath,destinationDirName,renderObj){
    
    await copyDirectory(compileFromParentPath,compileFromDirName,destinationParentPath,destinationDirName);
    
    const pathNames = walkDir(destinationParentPath,destinationDirName).map(node=>`${node.metaData.parentPath}/${node.value}`);
    const files = pathNames.filter(path=>{
        const stats = fs.lstatSync(path);
        return stats.isFile();
    });
    
    console.log(pathNames,files);
    

    

    //Why do I need "await" here?
    let replacePromise = replace({
        files,
        from:/{color}/g,
        to:'red'
    });

    await replacePromise;

    const replacables = pathNames.filter(path=>{
        return path.match(/{[a-z]+}/g)
    }).sort(sortByNumberOfSlashesDesc);//todo what if a file name has an escaped slash
    
    await Promise.all([...replacables.map(path=>{
        return new Promise((resolve,reject)=>{
            fs.rename(path,path.replace(/{name}/g,'hello'),(err)=>{
                if (err) reject(err);
                resolve();
            })
        })
    })]);

}
