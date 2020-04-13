const { spawn } = require('child_process');


function runCommandLineProgramWithPrompts(command,prompts,between,doneMessage,errorMessage){
    return new Promise((resolve,reject)=>{
        let program = spawn(command);
        program.stderr.on('data', (data) => {
            console.log("ERRORRR!!!!",data.toString());
        })
        program.stdout.on('data', (data) => {
           
            const promptKeys = Object.keys(prompts);

            let prompt = data.toString();
            for (var i=prompt.length;i<70;i++){
                prompt+=" ";
            }

            promptKeys.forEach(key=>{
                if (data.includes(key)){

                    console.log(prompt,'\x1b[36m', 'Input:','\x1b[32m', prompts[key],'\x1b[0m');
                   

                    program.stdin.write(`${prompts[key]}\n`);
                    between(data.toString(),`${prompts[key]}\n`)
                }
            })

            if (typeof doneMessage=='undefined') reject('No message sent back (doneMessage is undefined)')
            else if (data.includes(doneMessage)) {
                program.kill();
                resolve();
            }
            else if (typeof errorMessage !== 'undefined' && data.includes(errorMessage)) {
                console.log('message:',errorMessage);
                console.log("The error is being sent to stdout rather than stderr which I'm not sure if that's correct")
                reject(errorMessage);
            }

        })
    });
}


module.exports = {
    runCommandLineProgramWithPrompts
}
