
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'userImages')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname.replace(' ','') )
    }
});

var upload = multer({ storage: storage }).single('file');

module.exports = upload;