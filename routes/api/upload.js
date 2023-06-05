
const multer = require('multer');
const express = require('express');
const router = express.Router();

const upload = require('../../config/multerSetup');
const authAdmin = require('../../middleware/authAdmin');
const {uploadLimiter} = require('../../rate-limiters');

router.post('/', uploadLimiter, authAdmin, (req, res)=> {
    upload(req, res, err => {
        if (err instanceof multer.MulterError){
            console.log(err)
            return res.status(510).json(err)
        } else if (err){
            return res.status(501).json(err)
        }
        return res.status(200).json({imageURL: req.file.filename});
    });

});

module.exports = router;
