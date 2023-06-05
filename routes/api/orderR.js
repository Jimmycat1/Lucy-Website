// This file stores all the painting interactions with the users
// Requesting, watching, unwatching ...
// Most routes here would be open to public access (provided a CSRF token)

const express = require('express');
const router = express.Router();
const Painting = require('../../models/Painting');
const config = require('config')

const { validationResult } = require('express-validator');
const validate = require('../../validators/methods');

const {emailLimiter} = require('../../rate-limiters/index.js');
const sendEmail = require('../../middleware/sendEmail.js');
const { orderByWordClassic, orderByWordClassic_painting_not_found } = require('./emailTemplates.js');
const { getDateTimeNaturalString } = require('../../utils/getDate.js');
const { StandardAnswers } = require('../StandardAnswers');
//const config = require('config');

// User requests a painting
// @path      /api/orderR/:paintingID
// @access    PUBLIC
router.post('/:paintingID', emailLimiter, validate('orderForm'), (req,res) => {
    //Check input is valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let answer = StandardAnswers['invalid_request_email_client']
      return res.status(answer.status).json(answer.answer);
      // return res.status(422).json({ errors: errors.array(), 'message':'email not sent' });
    }
    console.log('New order incoming!')
    const paintingID = req.params.paintingID;
    const {user_name, user_email, user_message, purchase, questions} = req.body;
    acceptOrderRequest({req,res},{paintingID, user_name, user_email, user_message, purchase, questions})
})

//https://blog.risingstack.com/mastering-async-await-in-nodejs/
async function acceptOrderRequest({req, res}, {paintingID, user_name, user_email, user_message, purchase, questions}) {

  // FETCH PAINTING
  let painting;
  let mailOptions;
  try {
    painting = await Painting.findById(paintingID)
    console.log(`Someone requested ${painting.name}.`)
    mailOptions = orderByWordClassic({ to: config.get('ownerEmail') },{
      date: getDateTimeNaturalString(),
      painting_name: painting.name,
      paintingID: paintingID,
      user_message: user_message,
      user_name: user_name,
      user_email: user_email,
      user_bool_questions: questions,
      user_bool_purchase: purchase,
    });
  } catch (err) {
    mailOptions = orderByWordClassic_painting_not_found({ to: config.get('ownerEmail') },{
      date: getDateTimeNaturalString(),
      user_message: user_message,
      user_name: user_name,
      user_email: user_email,
      user_bool_purchase: purchase,
      user_bool_questions: questions,
    });
  }

  try {
    // EMAIL ARTIST
    await sendEmail(mailOptions)
  } catch (err) {
    console.log(err)
    let answer = StandardAnswers['order_request_not_sent_client']
    return res.status(answer.status).json(answer.answer)
    // return res.status(500).json({'message': 'Message could not be sent to the artist. Please email yourself.'})
  }

  let answer = StandardAnswers['order_request_sent_client']
  return res.status(answer.status).json(answer.answer)
}

/*
    const afterPainting = (painting) => {
        console.log(painting);
        // Check if the user can request it
        const checkAvailable = new Promise((resolve, rej)=>{
            painting.available?resolve():rej({});
        })
        checkAvailable.catch(err => console.log('Painting not available...'));
        // ERRoR IN STATUS

        // Set its status to requested. Users will see a different message
        // but can still request it in hope of getting it
        const setRequested = new Promise((resolve,rej) => {
            Painting.findOneAndUpdate(painting.paintingId, {status: 'Requested'})
            .then(resolve())
            .catch(rej());
        });
        setRequested.catch(err => console.log('Cannot access DB to edit painting...'));
        // ERROR IN DB

        // Email the artist
        const emailArtist = new Promise((resolve, reject) => {
            console.log(`Someone requested ${painting.name}.`)
            const mailOptions = orderByWordClassic(
                {to: config.get('ownerEmail')},
                {date: getDateTimeNaturalString(),
                painting_name: painting.name
            });
            sendEmail(mailOptions)
                .then((result)=> resolve())
                .catch((err)=> reject(err))

        })
        emailArtist.catch(err => {
            console.log('Error when sending email...:',err)
        })
        // ERRROR IN EMAIL

        // Email artist and set requested concurrently
        const placeOrder = Promise.all([
            emailArtist,
            setRequestedP
        ])
        placeOrder.catch(err => {
            // Notify Artist or Admin that something did not work
            // ERROR REPORT
            // Notify user of error
            res.status(500).json({'success':false});
        })
        // ERROR IN SERVER - EMAIL OR DB

        return Promise.resolve()
        .then(checkAvailable)
        .then(placeOrder)
    };

    Promise.resolve()
        .then(find)
        .then(afterPainting)

    // Check that painting can be requested
    // x
        // Error msg

    // Email Mum
    // x
        // Error msg

    // Add order (orderR[equest]) details
    // Email, date, paintingID
    // x
        // Email Mum - classic error report

    // Set painting status requested
    // If a painting was requested, it can still be requested
    // but with msg that prob won't gett it
    // x
        // Email Mum - classic error report

})
*/


// User watches a painting

// Get users watching a painting

module.exports = router;
