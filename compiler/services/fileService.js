const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const codesDir = path.join(__dirname, '../codes');
if (!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true });
}


//Create file
function writeCodeToFile(code, lang) {
    const filename = `${uuid()}.${lang}`;
    const filePath = path.join(codesDir, filename);
    fs.writeFileSync(filePath, code);
    return filePath;
}


// Delete file
function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
    }
    catch (e) {
        //console.log(e);
    }
}

module.exports = { writeCodeToFile, deleteFile };