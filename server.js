const express = require("express");
const mongoose = require("mongoose");
const config = require('config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const path = require('path');
require('dotenv').config();

const {apiLimiter, imageLimiter} = require('./rate-limiters');



const ENVIRONMENT = process.env.NODE_ENV;
console.log(ENVIRONMENT)


const app = express();
app.use(express.json());

// Tell app to ignore the proxy's IP in requests
app.set('trust proxy', 1)
// https://expressjs.com/en/guide/behind-proxies.html

app.use(cors());
app.use(cookieParser());
const csrfProtection = csurf({
    cookie: true
});


//DB Config
const db = config.get('mongoURI_A');

//Connect to Mongo
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB.'))
    .catch((err) => console.log(err));


//Implement csrf protection
app.use(csrfProtection);
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
})

// Limit Request Rate for all API calls below
app.use('/api/', apiLimiter);
app.use('/images/', imageLimiter)

//Public Routes
//app.use('/api/errors', require('./routes/api/errors'));
app.use('/images', require('./routes/images'));
app.use('/api/email',require('./routes/api/email'));
app.use('/api/orderR',require('./routes/api/orderR'));

// Protected routes.
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/painting',require('./routes/api/painting'));
app.use('/api/admin/auth', require('./routes/api/auth'));
app.use('/api/upload', require('./routes/api/upload'));



// Serve static assets if in production
if (ENVIRONMENT === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}


const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server started on port ${port}.`));
