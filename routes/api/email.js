const config = require('config');
const express = require('express');

const { validationResult } = require('express-validator');
const validate = require('../../validators/methods');

const {emailLimiter} = require('../../rate-limiters/index.js');
const sendEmail = require('../../middleware/sendEmail.js');
const {contactFormClassic} = require('./emailTemplates.js');
const {getDateTimeNaturalString} = require('../../utils/getDate.js');
const {StandardAnswers} = require('../StandardAnswers')
const {sanitise_from_html} = require('../../utils/sanitise_from_html');

const router = express.Router();

//@route    POST api/email
//@desc     Email contact form message
//@access   Public
router.post('/',
    emailLimiter,
    validate('emailForm'),
    (req,res) => {
        //Check input is valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          let answer = StandardAnswers['invalid_request_email_client']
          return res.status(answer.status).json(answer.answer);
          // return res.status(422).json({ errors: errors.array(), 'message':'email not sent' });
        }

        // Valid user message, email, etc
        const {user_name, user_email, user_message} = req.body;
        const MY_EMAIL = config.get('ownerEmail');

        // Send email to artist with user's message
        const mailOptions = contactFormClassic({to:MY_EMAIL},
            {   date: getDateTimeNaturalString(),
                user_email,
                user_message,
                user_name
            })

        // Function to send off email. Never use with untrusted html.
        sendEmail(mailOptions)
            .then((response) => {
                let {status, answer} = StandardAnswers['email_sent_client'];
                res.status(status).json(answer)
            })
            .catch((err) => {
                let {status, answer} = StandardAnswers['email_not_sent_client'];
                res.status(status).json(answer);
                console.error('There was and error: ', err);
            });
});



module.exports = router;
