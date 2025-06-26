const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')

const dirCodes = path.join(__dirname, "codes");
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true})
}

const generateFile = (code, language)=> {
    const uniqueName = uuid();
    const fileName = `${uniqueName}.${language}`;
    const filePath = path.join(dirCodes, fileName);
    fs.writeFileSync(filePath, code);
    return filePath;
}

module.exports = generateFile;