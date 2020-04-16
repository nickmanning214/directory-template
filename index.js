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
const replaceInFile = require('replace-in-file');

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
    
    

    
    //Doing it this way won't work with multiple variables in same file.
   
    await Promise.all(Object.keys(renderObj).map(key=>{

        const regex = new RegExp(`{${key}}`,'g');

        return replaceInFile.sync({
            files,
            from:new RegExp(`{${key}}`,'g'),
            to:renderObj[key]
        });
    }));

    //you have to loop through files, not keys. Reason: file names will change during this.
    /*
    await Promise.all(Object.keys(renderObj).map(key=>{
       
        return replaceName({
            files:pathNames.filter(path=>{
                return path.match(/{[a-z\-]+}/g)//lowercase letters and hyphen
            }).sort(sortByNumberOfSlashesDesc),
            from:new RegExp(`{${key}}`,'g'),
            to:renderObj[key]
        });
    }));
    */


//same problem with this.

    
    const pathsForFileNameReplace = pathNames.filter(path=>{
        return path.match(/{[a-z\-]+}/g)//lowercase letters and hyphen
    }).sort(sortByNumberOfSlashesDesc);

    const newNames = pathsForFileNameReplace.reduce((aggregator,pathName)=>{
        aggregator[pathName] = Object.keys(renderObj).reduce((currentPath,key)=>{
            currentPath = currentPath.replace(new RegExp(`{${key}}`,'g'),renderObj[key])
            return currentPath;
        },pathName);
        return aggregator;
    },{});

    await Promise.all(Object.keys(newNames).map(oldName=>{
        const newName = newNames[oldName];
        return new Promise((resolve,reject)=>{
            fs.rename(oldName,newName,(err)=>{
                if (err) reject(err);
                resolve();
            })
        })
    }));
    

    /*
    await Promise.all(pathsForFileNameReplace.map(path=>{
        return new Promise((resolve,reject)=>{
            Promise.all(Object.keys(renderObj).map(key=>{
                return replaceName({
                    files:[path],
                    from:new RegExp(`{${key}}`,'g'),
                    to:renderObj[key]
                })
            })).then(resolve).catch(reject);
            
        })
    }))*/

}
