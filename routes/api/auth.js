const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const authAdmin = require("../../middleware/authAdmin");
const validateAdmin = require("../../validators/adminMethods");
const { adminLoginIPLimiter, adminLoginUserLimiter } = require('../../rate-limiters');
const {StandardAnswers} = require('../StandardAnswers')

// Admin model
const Admin = require("../../models/Admin");

// @route   POST /api/admin/auth
// @desc    Authenticate admin user logging in
// @access  PUBLIC
router.post("/",
  adminLoginIPLimiter,
  adminLoginUserLimiter,
  validateAdmin("authenticate"),
  (req, res) => {

    //Check input is valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let answer = StandardAnswers['invalid_request_general_admin'];
      return res.status(answer.status).json(answer.answer)
      // return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;
    Admin.findOne({ name: name }).then((admin) => {
      if (!admin){
        let answer = StandardAnswers['name_not_found_log_in_admin']
        return res.status(answer.status).json(answer.answer)
        //return res.status(422).json({ message: "There is no admin with that name." });
      }

      // Validate password
      bcrypt.compare(password, admin.password).then((isMatch) => {
        if (!isMatch){
          let answer = StandardAnswers['password_incorrect_log_in_admin']
          return res.status(answer.status).json(answer.answer)
          // return res.status(400).json({ message: "Incorrect password." });
        }

        // Add jwt token
        jwt.sign(
          { id: admin.id },
          config.get("jwtSecret"),
          { expiresIn: 60*60*1000 },
          (err, token) => {
            if (err) {
              let answer = StandardAnswers['JWT_not_made_log_in_admin']
              return res.status(answer.status).json(answer.answer)
              // res.status(500).json({message: 'Something failed.'})
            };

            // Set http only cookie in browser
            res.cookie('token', token, {httpOnly: true, secure: false, maxAge: 60*60*1000, sameSite: true});

            // Return token anyway?
            res.json({
              user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
              },
            });
          }
        );
      });
    })
    .catch(err => {
      let answer = StandardAnswers['DB_error_general']
      return res.status(answer.status).json(answer.answer)
    })
});


// @route   GET /api/admin/auth/user
// @desc    Get user data
// @access  Admin
router.get("/user", authAdmin, (req, res) => {
  Admin.findById(req.user.id)
    .select("-password") // Don't send password
    .then((user) => res.json(user))
    .catch((err) => {
      res.status(400).json({ message: "That admin does not exist." })
    });
});


// @route   POST /api/admin/auth/logout
// @desc    Nullify the httpOnly token if any
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie('token', '');
  res.status(200).json({success: true});
})

module.exports = router;
