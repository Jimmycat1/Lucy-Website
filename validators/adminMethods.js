const {check, param} = require('express-validator');

module.exports = validateAdmin = (method) => {
    switch(method){

        case 'registerNew':
            return [
                check('name',"Username not provided.").exists().notEmpty(),
                check('email',"No email address provided.").exists(),
                check('email',"Invalid email address.").isEmail(),
                check('password', "No password provided.").exists(),
                check('password','The password needs to be longer than 9 characters.').isLength({min: 10})
            ]
        
        case 'deleteAdmin':
            return [
                param('id').exists()
            ]
        
        case 'editAdmin':
            return [
                param('id').exists(),
                check('name',"Username is empty.").optional().notEmpty(),
                check('email',"Email is not valid.").optional().isEmail(),
                check('password','The password needs to be longer than 9 characters.').optional().isLength({min: 10})
            ]

        case 'authenticate':
            return [
                check('name',"No name provided.").exists().notEmpty(),
                check('password',"No password provided.").exists().notEmpty()
            ]
    }
}