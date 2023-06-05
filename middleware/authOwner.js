const config = require('config');

function authOwner(req,res,next){
    if (!req.header('x-owner-password')){
        return res.status(401).json({'message':"You need the owner's permission to do this."})
    } else {
        if (config.get('ownerPass') === req.header('x-owner-password')){
            next();
        } else {
            return res.status(401).json({'message':"You need the owner's permission to do this."})
        }
    }
}

module.exports = authOwner;