const {
    CLEAR_ERROR_MESSAGE,
    CLEAR_DONE_MESSAGE
} = require('../../../constants.js');


const {runCommandLineProgramWithPrompts} = require('../../util.js');
const cleanup = require('../cleanup.js');

module.exports =  function(projectName,tmpDirName){
    console.log(projectName);
    return runCommandLineProgramWithPrompts('svelte-component-clear',{
    'Component Name': projectName.toLowerCase().split(' ').join('-')
},()=>{},CLEAR_DONE_MESSAGE,CLEAR_ERROR_MESSAGE).then(()=>{
    console.log('cleanup');
    cleanup(tmpDirName)
} //some of this got duplicated I guess
)}
