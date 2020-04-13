//require("leaked-handles");
const util = require('util')
const walkSync = require('../../util/walkSync.js');
const titleCase = require('../../util/titleCase.js');

const test = require('tape');
const random = require('lodash.random');
const puppeteer = require('puppeteer');
const {
    PROJECT_NAME,
    TESTING_FINISH_SUCCESS_MESSAGE,
    TESTING_FINISH_FAILURE_MESSAGE
} = require('../constants.js');
const path = require('path');

const {
    START_NEW_ERROR_MESSAGE,
    START_NEW_DONE_MESSAGE
} = require('../../constants.js'); //it's okay to import these because the intent is not to test these constants. It's to share constants between the program and the test.

const before = require('./before.js');
const cleanup = require('./cleanup.js');
const {runCommandLineProgramWithPrompts} = require('../util.js');
const config = require('../../config.js');
const colors = require('colors');
const projectPath = require('../../util/projectPath.js');
const runSvelteComponentClear = require('./util/runSvelteComponentClear.js');
const fs = require('fs');
const patienceDiffPlus = require('./util/patienceDiffPlus.js');
const invert = require('lodash.invert');

function log(...args){
    const a = [...args].map(arg=>colors.yellow(arg));
    console.log(...a);
}



function runTest(tmpDirName,between){
    //https://stackoverflow.com/questions/23209413/how-to-respond-to-a-command-line-promt-with-node-js
    return new Promise((resolve,reject)=>{

        //This will run the command line program.
        //It listens for a generic error message (passed as START_NEW_ERROR_MESSAGE) and catches based on this.
        //The actual error message is lost though.


        //Seems this is leaking?
        runCommandLineProgramWithPrompts('svelte-component-start',{
            'Component Name': PROJECT_NAME,
            'Author Name': 'Exey McExampleton',
            'Demo Link': 'Demo Link',//to do remove this
            'Description':'Here is a "description"'
        },between,START_NEW_DONE_MESSAGE,START_NEW_ERROR_MESSAGE)
            .then(()=>{
                resolve(tmpDirName)
            })
            .catch(e=>{reject(e)})
    })
    

    
}

/*
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});
  
    await browser.close();
  })();
*/




before()

    .then((tmpDirName)=>{

        inputValuesShouldBe = [
            'Component Name',
            'Author Name',
            'Demo Link',
            'Description'
        ];

        const inputValuesAre = [];

        return runTest(tmpDirName,(prompt,input)=>{

            inputValuesAre.push(prompt);

        }).then((tmpDirName)=>{
            return new Promise((resolve,reject)=>{



                test.onFinish(()=>{
                    //not being called...
                    log("Test finished")
                    resolve(tmpDirName)
                  })
                test.onFailure(()=>{
                    log("Test error");
                    reject();
                  });

                test('Prompts in correct order', async function (t) {
                
               
                    t.ok(inputValuesAre.every((val,i)=>val.includes(inputValuesShouldBe[i])));

                    t.end()
                    
                });


                test('Creates directory properly. Handles quotes in description.', async function (t) {
                
                    const generatedPath = `./${PROJECT_NAME.toLowerCase().split(' ').join('-')}`;
                    const generatedFileHash = walkSync(generatedPath).filter(p=>!p.includes('/.git/')).reduce((aggregator,pathName)=>{
                        aggregator[pathName.substr(generatedPath.length+1)] = fs.readFileSync(pathName);
                        return aggregator;
                    },{});
                    const generatedKeys = Object.keys(generatedFileHash);
                  
                   

                    const hardcodedPath = projectPath('/tests/project-template-prototype');
                    const hardcodedFileHash = walkSync(hardcodedPath).reduce((aggregator,pathName)=>{
                        aggregator[pathName.substr(hardcodedPath.length+1)] = fs.readFileSync(pathName);
                        return aggregator;
                    },{});

                    const hardcodedKeys = Object.keys(hardcodedFileHash);
                    log(generatedKeys,hardcodedKeys);



                    //generatedFileHash['ProjectName.svelte'] = generatedFileHash['{comopnent-name}.svelte'];
                    //delete generatedFileHash['{comopnent-name}.svelte'];

                    hardcodedKeys.forEach(hardcodedKey=>{
                        if (typeof generatedFileHash[hardcodedKey]=='undefined') log(`${hardcodedKey} is undefined`);
                        else if (hardcodedFileHash[hardcodedKey].toString()!==generatedFileHash[hardcodedKey].toString()) {
                            log(hck,' does not match');
                            console.log(util.inspect(patienceDiffPlus(hardcodedFileHash[hardcodedKey].toString(),generatedFileHash[hardcodedKey].toString()).lines.filter(e=>e.aIndex!==e.bIndex), { maxArrayLength: null }))
                            //log('=============================');
                            //log(hardcoded[hck].toString())
                            //log('--------------------------------')
                            //log(generated[hck].toString());

                        }
                    });

                    t.deepEqual(hardcodedFileHash,generatedFileHash);
                   

                    t.end();
                });

                test('pushes github repo', async (t) => {
                    const browser = await puppeteer.launch({headless: true})
                    const page = await browser.newPage()
                    await page.goto('https://github.com/login')
                    await page.type('#login_field', config.githubUsername)
                    await page.type('#password', config.githubPassword)
                    await page.click('[name="commit"]');
                    //await page.waitForNavigation(); apparently I don't need this

                    await page.goto(`https://github.com/${config.githubUsername}/${PROJECT_NAME.toLowerCase().split(' ').join('-')}`)
                    
                    t.ok(await page.$(`a[href="/${config.githubUsername}/${PROJECT_NAME.toLowerCase().split(' ').join('-')}"]`));
                    //await browser.close();

                    t.end()

                  

                   
                  })

            })

        });

        
    })
    
    .then((tmpDirName)=>{
        return runSvelteComponentClear(PROJECT_NAME,tmpDirName)/*.then(()=>{
            log("runSvelteComponentClear then callback")
            cleanup(tmpDirName)
        });*/
        //But this is part of cleanup. It has to be called in before as well.
        //Honestly, clearing should be in safemode before the test (prompting) and not in safe mode afterwards.
        //But this is for later.
        })

  
    .then(()=>{
        log(TESTING_FINISH_SUCCESS_MESSAGE);
        process.exit(1);
    })
    .catch((e)=>{
        log(TESTING_FINISH_FAILURE_MESSAGE,e)
    })

