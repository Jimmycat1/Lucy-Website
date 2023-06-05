
// This is a one-off script, to be run by the server administrator.
// It changes an admin's password using their email and new password.

// Set the following variables when running the script:
// (Run in git bash)
/*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
CAP_ADMIN_NAME="Someone" CAP_ADMIN_NEW_PASS="hmmpassword"  MONGO_URI="mongodb+srv://max####" node changeAdminPass.js
/*/
console.log(`\nFor reference, this is how to input parameters into this program:`)
console.log(`CAP_ADMIN_NAME="Someone" CAP_ADMIN_NEW_PASS="hmmpassword"  MONGO_URI="mongodb+srv://max###something###" node changeAdminPass.js`)
console.log(`Make sure to use a Linux terminal or Bash shell to run this script. Windows CMD will not be able to accept these parameters.\n`)

// The existing email
const adminName = process.env.CAP_ADMIN_NAME;
// The new password
const newPassword = process.env.CAP_ADMIN_NEW_PASS;
// DB connection String
const db = process.env.MONGO_URI;


const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

//Connect to Mongo
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB.'))
    .catch((err) => console.log(err));

function updatePassword(admin_name, new_password){
  Admin.findOne({ name: admin_name })
      .then(admin => {
          if (!admin){
            console.log('No admin with that email found.');
            process.exit()
            return;
          }

          // Create salt and hash
          bcrypt.genSalt(10, (err, salt)=>{
              bcrypt.hash(new_password, salt, (err,hash)=>{
                  if (err) {
                    console.log('Failed to save new password')
                    console.error(err);
                    process.exit()
                  };
                  admin.password = hash;
                  admin.save()
                      .then(admin => {
                        console.log('Saved new password.');
                        process.exit()
                      })
                      .catch(err => {
                        console.log('Failed to save new password.')
                        console.error(err)
                        process.exit()
                      })
              })
          })
      })
}


if (!newPassword){
  console.log('I see no password.')
  process.exit()
}
else if (newPassword.length < 5){
  console.log('More than 5 letters please...')
  process.exit()
}
else if (!adminName){
  console.log('I see no admin name.')
  process.exit()
} else if (!db){
  console.log('You need a mongo URI to connect to the database.')
  process.exit()
}
else {
  console.log('All ok. Now changing the password.')
  updatePassword(adminName, newPassword)
}


// Quit after 60s from start.
setTimeout(()=>{
  console.log('No response, so exitting.')
  process.exit()
}, 60000, 'exit')
