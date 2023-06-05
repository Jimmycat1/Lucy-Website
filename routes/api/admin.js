const express = require('express');
const router = express.Router()
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const authOwner = require("../../middleware/authOwner");
const validateAdmin = require('../../validators/adminMethods');

// Admin model
const Admin = require('../../models/Admin');


// I figure I ought to remove this functionality as an owner can simply access the MongoDB and change admins there.

/*

// @route   POST /api/admin
// @desc    Register a new admin profile
// @access  Owner
router.post('/',
    authOwner,
    validateAdmin('registerNew'),
    (req,res)=>{
        //Check input is valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        Admin.findOne({ name })
            .then(admin => {
                if(admin) return res.status(400).json({'message':'Admin with that name already exists.'});

                const newAdmin = new Admin({
                    name, 
                    email,
                    password
                });

                // Create salt and hash
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newAdmin.password, salt, (err,hash)=>{
                        if (err) throw err;
                        newAdmin.password = hash;
                        newAdmin.save()
                            .then(admin => {

                                jwt.sign(
                                    { id: admin.id },
                                    config.get('jwtSecret'),
                                    { expiresIn: 3600 },
                                    (err, token) => {
                                        if(err) throw err;
                                        res.json({
                                            token,
                                            admin:{
                                                id: admin.id,
                                                name: admin.name,
                                                email: admin.email
                                            }
                                        });
                                    }
                                )
                            })
                            .catch(err => {throw err});
                    })
                });
            });
    }
);



//@route    DELETE api/admin/:id
//@desc     Delete an admin
//@access   Owner
router.delete('/:id', 
    authOwner,
    validateAdmin('deleteAdmin'),
    (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        Admin.findById(req.params.id)
            .then(admin => admin.remove().then(() => res.json({success: true, deletedAdmin: admin})))
            .catch(err => res.status(404).json({success:false}))
});

*/

module.exports = router;


