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

function replaceName(obj){
    return new Promise((resolve,reject)=>{
        Promise.all(obj.files.map(path=>{
            return new Promise((resolve,reject)=>{

                

                fs.rename(path,path.replace(obj.from,obj.to),(err)=>{
                    if (err) reject(err);
                    resolve();
                })
            })
        })).then(resolve).catch(err=>reject(err))
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
    
    

    

   
    await Promise.all(Object.keys(renderObj).map(key=>{

        const regex = new RegExp(`{${key}}`,'g');

        return replace({
            files,
            from:new RegExp(`{${key}}`,'g'),
            to:renderObj[key]
        });
    }));

    await Promise.all(Object.keys(renderObj).map(key=>{
       
        return replaceName({
            files:pathNames.filter(path=>{
                return path.match(/{[a-z]+}/g)
            }).sort(sortByNumberOfSlashesDesc),
            from:new RegExp(`{${key}}`,'g'),
            to:renderObj[key]
        });
    }));


}
