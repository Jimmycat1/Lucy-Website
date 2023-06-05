
const config = require('config')
const DOMAIN_NAME = config.get("DOMAIN_NAME")

// Removes < and > .
const sanitise_from_html = require('../../utils/sanitise_from_html');


// ===================================================================================//
// THESE FUNCTIONS RETURN parts of the mailOptions required for a nodemailer email.
// ===================================================================================//


// When user fills out a contact form (any questions), this email is sent to the artist.
function contactFormClassic({to}, {date, user_name, user_email, user_message}) {
    return {
        to: `${to}`,
        subject: 'New message received.',
        html:
            "<p style='font-weight:bold;'>You received a new message from your art website.</p>\n\n"+
            "<p style='font-weight:bold;'>Date:</p> "+ `${sanitise_from_html(date)}` + '\n'+
            "<p style='font-weight:bold;'>From:</p> "+ `${sanitise_from_html(user_name)}` + '\n'+
            "<p style='font-weight:bold;'>Email:</p> "+ `${sanitise_from_html(user_email)}` + '\n'+
            "<p style='font-weight:bold;'>They said:</p>\n"+ `${sanitise_from_html(user_message)}`,
    };
}

// User fills out form below painting to order it.
// This email is sent to the artist.
function orderByWordClassic({to}, {date, painting_name, paintingID, user_message, user_name, user_email,  user_bool_questions, user_bool_purchase}){
    return {
        to: `${to}`,
        subject: 'New order received.',
        html:
            `<p style='font-weight:bold;'>You received a new order from your art website.</p>\n\n`+
            `<p style='font-weight:bold;'> Name: </p> ${sanitise_from_html(user_name)} \n` +
            `<p style='font-weight:bold;'> Email: </p> ${sanitise_from_html(user_email)} \n` +
            `<p style='font-weight:bold;'> Message:</p>\n`+
            `<p> ${sanitise_from_html(user_message)} </p>\n`+
            `<p style='font-weight:bold;'> They have questions: </p> ${user_bool_questions} \n` +
            `<p style='font-weight:bold;'> They would like to buy the painting: </p> ${user_bool_purchase} \n` +
            `<p style='font-weight:bold;'>Date:</p> ${sanitise_from_html(date)} \n`+
            `<p style='font-weight:bold;'>Painting name:</p> ${sanitise_from_html(painting_name)} \n`+
            `<p style='font-weight:bold;'>Painting ID:</p> ${sanitise_from_html(paintingID)} \n`+
            `<p style='font-weight:bold;'>Link to painting:</p> ${DOMAIN_NAME}/paintings/${sanitise_from_html(paintingID)} \n`

    };
}
function orderByWordClassic_painting_not_found({to}, {date, user_message, user_name, user_email,  user_bool_questions, user_bool_purchase}){
    return {
        to: `${to}`,
        subject: 'New order received.',
        html:
            `<p style='font-weight:bold;'>You received a new order from your art website.</p>\n\n`+
            `<p style='font-weight:bold;'>For some reason, the request sent did not include a valid painting ID. This is suspicious. Here is the message sent, anyway. </p>`+
            `<p style='font-weight:bold;'> Name: </p> ${sanitise_from_html(user_name)} \n` +
            `<p style='font-weight:bold;'> Email: </p> ${sanitise_from_html(user_email)} \n` +
            `<p style='font-weight:bold;'> Message: </p>\n`+
            `<p> ${sanitise_from_html(user_message)} </p>\n`+
            `<p style='font-weight:bold;'> They have questions: </p> ${user_bool_questions} \n` +
            `<p style='font-weight:bold;'> They would like to buy the painting: </p> ${user_bool_purchase} \n` +
            `<p style='font-weight:bold;'> Date: </p> ${sanitise_from_html(date)} \n`
    };
}

module.exports = {contactFormClassic, orderByWordClassic, orderByWordClassic_painting_not_found};
