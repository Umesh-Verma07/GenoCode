const fs = require('fs')
const path = require('path')
const {exec} = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true})
}

const executeCpp = (filePath)=>{
    const uniqueName = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${uniqueName}.exe`)

    return new Promise((resolve, reject)=>{
        const cmd = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${uniqueName}.exe`
        exec(cmd, (error, stdout, stderr)=>{
            if(error){
                reject({error});
            }
            if(stderr){
                console.log(stderr);
                reject({error : stderr});
            }
            resolve({stdout});
        })
    })
}

module.exports = executeCpp;