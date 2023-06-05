
const config = require('config')
const email = config.get("openEmail")

const Standard_Answer_Dictionary = {
  // ============ CLIENT HANDLED - just for refeerence - not used here.=======/
  // INCLUDES EMAIL of artist
  'too_many_requests':{
    // INCLUDES EMAIL of artist
    status: 429,
    answer: {
      error_id: -3,
      message: `Sorry, but this service is experiencing too many requests at the moment. Please return later, or contact me: ${email}.`
    }
  },
  'communication_in_code_error':{
    status: undefined,
    answer: {
      // INCLUDES EMAIL of artist
      error_id: -2,
      message: `Something seems to be wrong in the code. It would be good if you could report this error (-2) to me: ${email} . Thanks, and sorry.`
    }
  },
  'network_error': {
    status: undefined,
    answer: {
      error_id: -1,
      message: 'The server seems to have disconnected. Maybe check your Internet connection?'
    }
  },

  // ============ SENT BY SERVER - used here. ============/
  // EMAIL and NAME of artist present
  'email_not_sent_client': {
    status: 500,
    answer: {
      error_id: 0,
      message: `Sorry, I (the server) could not send this message to Lucy. Please accept my apologies. You can email her yourself at ${email} . Thanks.`
    }
  },
  'email_sent_client': {
    status: 200,
    answer: {
      message: `Your message is now in my inbox.`
    }
  },
  'painting_not_found_client': {
    status: 404,
    answer: {
      error_id: 1,
      message: `Hi, I couldn't find this painting in my catalogue, for some reason.`
    }
  },
  'painting_not_created_admin':{
    status: 500,
    answer: {
      error_id: 2,
      message: `Hi, I couldn't make a new record for the painting. Sometimes, this is because the name is the same as another painting. If that doesn't help, it is propbably something to do with the database. Thank you and keep painting! You're good.`
    }
  },
  'painting_not_found_admin':{
    status: 404,
    answer:{
      error_id: 3,
      message: `Hi there! Sorry, I couldn't find the painting using its ID.`
    }
  },
  'painting_not_updated_admin':{
    status: 500,
    answer: {
      error_id: 4,
      message: `Hello. Just saying, I couldn't update the painting, unfortunately. Maybe you entered the same name as another painting? Try entering a different one, if so. Otherwise, it is probably something to do with the DB.`
    }
  },
  'all_paintings_not_updated_admin':{
    status: 500,
    answer: {
      error_id: 5,
      message: `Hi, I couldn't do that, unfortunately. Might be the DB playing up, perhaps.`
    }
  },
  'photo_not_uploaded_admin':{
    status: 500,
    answer: {
        error_id: 6,
        message: 'The upload could not happen.'
    }
  },
  'name_not_found_log_in_admin':{
    status: 400,
    answer: {
      error_id: 7,
      message: 'There is no admin with that name, as far as I am aware.'
    }
  },
  'password_incorrect_log_in_admin':{
    status: 400,
    answer: {
      error_id: 8,
      message: 'The password is incorrect.'
    }
  },
  'JWT_not_made_log_in_admin':{
    status: 500,
    answer: {
      error_id: 9,
      message: `Ahem.. Sorry... We couldn't make you a thing to identify you as someone who has already logged in.  A.k.a. JWT could not be made. If you want more computer jargon, ask someone else. Like the web developer, that made this.`
    }
  },
  // EMAIL PRESENT
  'invalid_request_general_client':{
    status: 400,
    answer: {
      error_id: 10,
      message: `Sorry, but I, the server, don't understand the request. One of two things has happened. Either the code that runs this website is wrong, or you've entered something incorrectly. Might I ask to check your email address, if you've entered one? Otherwise, it's probably a good idea to email me or the developer - ${email}. Or to continue with your day another way. Sorry again. Cheerio!`
    }
  },
  // INCLUDES EMAIL of Artist
  'invalid_request_email_client':{
    status: 400,
    answer: {
      error_id: 11,
      message: `Your message was not sent. Can you check that you entered the correct email address? If you did, this is probably an error in the code. If so, please can you report this error (11) to me? (${email}) Thank you!`
    }
  },
  'invalid_request_general_admin':{
    status: 400,
    answer: {
      error_id: 12,
      message: `Hmm... Either you entered something incorrectly, or the website code is wrong.`
    }
  },
  // EMAIL of artist present.
  'rate_limit_exceeded':{
    status: 429,
    answer: {
      error_id: 13,
      message:`Seems like this service is very popular! In fact, so many people (or bots) are using it, that I can't even answer your request. Come back another time, perhaps. Might want to give the owner a heads up about this: ${email} . Cheerio!`
    }
  },
  'not_logged_in':{
    status: 400,
    answer: {
      error_id: 14,
      message: `You don't seem to be an admin. Or, at least, at first glance. Have you logged in? Try logging out to log in again.`
    }
  },
  // EMAIL of artist present.
  'DB_error_general':{
    status: 500,
    answer: {
      error_id: 15,
      message: `There seems to be some difficulty. You may want to try to reload the page. Otherewise, maybe you could consider letting me know about this error (15)? You can email me at ${email} . Thank you!`
    }
  },
  'order_request_not_sent_client': {
    status: 500,
    answer: {
      error_id: 16,
      message: `Sorry, I (the server) could not send this message to Lucy. Please accept my apologies. You can email her yourself at ${email} . Thanks.`
    }
  },
  'painting_last_photo_remaining_admin':{
    status: 400,
    answer: {
      error_id: 20,
      message: `One photo was left in, because a painting must have at least one photo.`
    }
  },
  'order_request_sent_client': {
    status: 200,
    answer: {
      message: `Your request is now in my inbox.`
    }
  },
  'painting_photo_not_deleted_admin': {
    status: 500,
    answer: {
      error_id: 21,
      message: ({ filename_photo }) => (`The operation went through, but the photo file was not deleted from storage. This will not cause a significant problem to operation, but the photo ${filename_photo} will need to be cleared from the server, to free up space.`)
    }
  },
  'invalid_request_photo_filename_admin': {
    status: 400,
    answer: {
      error_id: 22,
      message: "The most common cause for this error is that the extension for this photo is not supported. Alternatively, the website code is incorrect."
    }
  }
}

module.exports = {StandardAnswers: Standard_Answer_Dictionary};
