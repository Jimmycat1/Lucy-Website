
const router = require('express').Router();
const myError = require('../../models/Error');

const validate = require('../../validators/methods');
const { validationResult } = require('express-validator');
const { config } = require('dotenv/types');

// @route           POST /api/errors/report
// @description     Log an error that was caught by an error boundary
// @access          Public
router.post('/report', validate('reportError'),  (req,res)=> {
    //Check input is valid
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({ errors: errors.array(), 'message':'email not sent' });
    }
    
    const {error, where} = req.body;

    let newError = new myError({
        error: error,
        extraInfo: {
            where: where || ''
        }
    })

    newError.save()
    .then(success => {
        // Email errors to right people
        let emails = config.get('emailErrorsTo');
        res.status(200).json({})
    })
    .catch(err => {
        console.log('WARNING!!! Errors are not being reported...');
        console.log(`Server Error: ${err}`)
        console.log(`Client Error: ${error}`)
        res.status(422).json({})
    });
})


module.exports = router;