


// !!!!!!!!!!!!!!!!!!!!!!!!!!!1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//              NEVER USE WITH UNTRUSTED HTML
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const config = require('config');
const nodemailer = require('nodemailer');

sendEmail = function({to,subject,html}) {return new Promise((resolve, reject)=> {

    // Get sending email access
    const MY_EMAIL = config.get('ownerEmail');
    const MY_EMAIL_PASS = config.get('ownerEmailPass');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${MY_EMAIL}`,
            pass: `${MY_EMAIL_PASS}`
        },
    });

    const mailOptions = {
        from: `${MY_EMAIL}`,
        to,
        subject,
        html
    };

    console.log('Sending Email...');

    // Send and pass back response
    transporter.sendMail(mailOptions, (err,response) => {
        if (err){
            console.log('Email not sent');
            reject(err);
        } else {
            console.log('Email sent.');
            resolve(response);
        }
    });
})
}

module.exports = sendEmail;
