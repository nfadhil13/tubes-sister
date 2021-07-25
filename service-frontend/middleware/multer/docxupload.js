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
const fileFilter = (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if(ext !== '.zip') {
        const error = new Error('Invalid File')
        error.status = 402
        error.cause = "File docx merupakan html dalam bentuk zip"
        return cb(error)
    }
    cb(null, true)
}

exports.imageUpload = multer({
    storage: fileStorage,
    fileFilter
}).single("fileSoal")
