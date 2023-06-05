const {check, param} = require('express-validator');
const path = require('path');
const paintingStatusTypes = require('../models/paintingStatusTypes');

const filenameValidator = filename => {
        if (filename.split('/').length !== 1){
          return false;
        }
        var extension = (path.extname(filename)).toLowerCase()
        switch(extension){
            case '.jpg':
                return true
            case '.jpeg':
                return true
            case  '.png':
                return true
            case  '.tif':
                return true
            case  '.gif':
                return true
            default:
                return false;
        }
};

const filenameListValidator = filenames => {
  for (let i=0; i < filenames.length; i++){
    if (filenameValidator(filenames[i]) !== true){
      return false
    }
  }

  return true;

}


module.exports = validate = (method) => {
    switch(method){
        case 'createPainting':
            return [
                check('name',"Name doesn't exist.").exists().notEmpty(),
                check('filename').exists().notEmpty().custom(filenameListValidator),
                check('date',"Incorrect date format.").optional().isString(),
                check('description',"Description must be text.").optional().isString(),
                check('price', "The price has to be text.").optional().isString(),
                check('status').optional().isIn(paintingStatusTypes),
                check('size').optional().isString(),
                check('materials').optional().isString(),
                check('stock_amount').optional().isNumeric(),
            ]

        case 'editPainting':
            return [
                param('id').exists().notEmpty(),
                check('name',"Name is empty.").optional().notEmpty(),
                check('filename').optional().notEmpty().custom(filenameListValidator),
                check('date',"Incorrect date format.").optional().isString(),
                check('description',"Description must be text.").optional().isString(),
                check('price', "The price has to be text.").optional().isString(),
                check('status').optional().isIn(paintingStatusTypes),
                check('size').optional().isString(),
                check('materials').optional().isString(),
                check('stock_amount').optional().isNumeric(),
            ]

            case 'editPaintings':
                return [
                    check('date',"Incorrect date format.").optional().isString(),
                    check('description',"Description must be text.").optional().isString(),
                    check('status').optional().isIn(paintingStatusTypes),
                    check('size').optional().isString(),
                    check('materials').optional().isString(),
                    check('stock_amount').optional().isNumeric(),
                ]


        case 'deleteFilename':
            return [
                param('id').exists(),
                check('filename',"filename field must be a valid filename").exists().isString().custom(filenameValidator),
            ]

        case 'addFilename':
            return [
                param('id').exists(),
                check('filename',"filename field must be a valid filename").exists().isString().custom(filenameValidator),
            ]


        case 'deletePainting':
            return [
                param('id').exists(),
            ]

        case 'emailForm':
            return [
                check('user_name').exists(),
                check('user_email').exists(),
                check('user_email',"The email provided is not valid.").isEmail(),
                check('user_message').exists()
            ]

        case 'orderForm':
            return [
                check('user_name').exists(),
                check('user_email').exists(),
                check('user_email').isEmail(),
                check('user_message').exists(),
                check('questions').exists().isBoolean(),
                check('purchase').exists().isBoolean(),
                param('paintingID').exists(),
            ]

        case 'reportError':
            return [
                check('error').exists()
            ]
    }
}
