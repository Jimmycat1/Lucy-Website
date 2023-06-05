const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')

getMime = require('../config/mimeTypes').getMime;

// Serve images
router.get('/:img', function(req, res){ 
    filename = req.params.img;
    mime = getMime(filename);
    fs.readFile(path.join(`./userImages/${filename}`), function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end(`Error loading ${filename} with Error: ${err}`);
        }
        res.writeHead(200, {"Content-Type": mime});
        res.end(data);
    });
    
}); 

module.exports = router;