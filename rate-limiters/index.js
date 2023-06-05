const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 1000
})

const uploadLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 10,
    skipFailedRequests: true,
})

const adminLoginIPLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 3,
    skipSuccessfulRequests: true,
})

const adminLoginUserLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,

    keyGenerator: (req) => {
        if(req.body && req.body.name){
            // Can't login without that
            return req.body.name
        } else {
            return ""
        }
    }
})

const emailLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3
});

const imageLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 500
});

module.exports = {
    apiLimiter,
    uploadLimiter,
    adminLoginIPLimiter,
    adminLoginUserLimiter,
    emailLimiter,
    imageLimiter
}
