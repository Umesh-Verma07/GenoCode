const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')

const inputPath = path.join(__dirname, "inputs");
if(!fs.existsSync(inputPath)){
    fs.mkdirSync(inputPath, {recursive: true})
}

const generateInputFile = (input)=> {
    const uniqueName = uuid();
    const fileName = `${uniqueName}.txt`;
    const filePath = path.join(inputPath, fileName);
    fs.writeFileSync(filePath, input);
    return filePath;
}

module.exports = generateInputFile;