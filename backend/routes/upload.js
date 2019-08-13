const fs = require('fs');

module.exports = app => {
  const checkOut = (path, fileName) => {
    const names = fs.readdirSync(path);
    if (!names.includes(fileName)) {
      return fileName;
    }
    const reg = /^\d+$/;
    let part = '';
    for (let i = 0; i < fileName.length; i++) {
      if (reg.test(fileName[i])) {
        part += fileName[i];
      } else {
        fileName = fileName.substring(i);
        break;
      }
    }
  
    if (part.length === 0) {
      part = '1';
    } else {
      part = Number(part) + 1;
    }
  
    return checkOut(path, `${part}${fileName}`);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  }
  
  app.post('/upload', (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
  
    const validName = checkOut(`${__dirname}/../public/`, file.name);
    
    file.mv(`${__dirname}/../public/${validName}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
  
      res.json({ fileName: validName, filePath: `/upload/${file.name}` });
    });
  });
};