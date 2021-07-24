const multer = require("multer");
const path = require("path")
const { v4: uuidv4 } = require('uuid');


/*
@author 14 KP
Untuk menentukan file gambarnya ingin disimpan dimana
*/
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/docx');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4()+ path.extname(file.originalname))
    }
});

/*
@author 14 KP
Untuk memfilter tipe file
*/

exports.imageUpload = multer({
    storage: fileStorage
}).single("fileSoal")
