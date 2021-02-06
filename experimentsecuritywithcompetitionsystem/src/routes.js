// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const token = require('./middlewares/tokenValidation');
const validatorFn = require('./middlewares/validatorFn')


const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore();
const failCallback = function (req, res, next) {
    let jsonResult = {
        message: 'Too many attempts',
        code: 429
    };
    return res.status(200).json(jsonResult);
};
// Start slowing requests after 5 failed attempts to do something for the same user
const userBruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour,
    failCallback: failCallback
});


// Match URL's with controllers

exports.appRoute = router => {
    //POST
    router.post('/api/user/login', validatorFn.loginUser, userBruteforce.getMiddleware({
        key: function (req, res, next) {
            // prevent too many attempts for the same email
            next(req.body.email);
        }
    }), authController.processLogin);

    router.post('/api/user/register',
        validatorFn.registerUser,
        authController.processRegister);

    router.post('/api/user/process-submission',
        validatorFn.submitValidator,
        checkUserFn.getClientUserId,
        token.userVerifyToken,
        userController.processDesignSubmission);

    router.post('/api/user/logout',
        authController.processLogout)

    //PUT
    router.put('/api/user/',
        checkUserFn.getClientUserId,
        token.adminVerifyToken,
        userController.processUpdateOneUser);

    router.put('/api/user/design/',
        validatorFn.updateValidator,
        checkUserFn.getClientUserId,
        token.userVerifyToken,
        userController.processUpdateOneDesign);


    //GET    
    router.get('/api/user/process-search-design/:pagenumber/:search?',
        checkUserFn.getClientUserId,
        token.userVerifyToken,
        userController.processGetSubmissionData);

    router.get('/api/user/process-search-user/:pagenumber/:search?',
        checkUserFn.getClientUserId,
        token.adminVerifyToken,
        userController.processGetUserData);

    router.get('/api/user/:recordId',
        checkUserFn.getClientUserId,
        token.userVerifyToken,
        userController.processGetOneUserData);

    router.get('/api/user/design/:fileId',
        checkUserFn.getClientUserId,
        token.userVerifyToken,
        userController.processGetOneDesignData);
};