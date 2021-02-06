const { compareSync } = require('bcrypt');
var validator = require('validator');

// ==================================== Login ==========================================
module.exports.loginUser = (req, res, next) => {

        //Validation to check input values
        // anystring@anystring.anystring
        var reEmail = new RegExp(/\S+@\S+\.\S+/);

        var email = req.body.email;

        //Exit if invalid
        if (reEmail.test(email)) {
            next()
            return;
        } else {
            console.log('Input not allowed')
            res.status(500).json({ message: 'Input not allowed' });
            return;
        }

    } //End of updateValidator

// ==================================== Register ==========================================
module.exports.registerUser = (req, res, next) => {

        //Validation to check input values
        // anystring@anystring.anystring
        var reEmail = new RegExp(/\S+@\S+\.\S+/);
        //7 to 15 characters which contain at least one numeric digit, one special character, one uppercase and one lowercase letter
        var rePassword = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
        var reFullName = new RegExp("^[a-zA-Z_ ]*$");

        var fullName = req.body.fullName;
        var email = req.body.email;
        var password = req.body.password;

        console.log(rePassword.test(password));

        //Exit if invalid
        if (reEmail.test(email) && rePassword.test(password) && reFullName.test(fullName)) {
            next()
            return;
        } else {
            console.log('Input not allowed')
            res.status(500).json({ message: 'Input not allowed' });
            return;
        }

    } //End of updateValidator

// ==================================== submit Design ==========================================
module.exports.submitValidator = (req, res, next) => {

    //Validation to check input values
    var reTitle = new RegExp("^[A-Za-z0-9 ]+$");
    var reDescription = new RegExp(`^[A-Za-z0-9_.'"!? ]+$`);
    var reRecordId = new RegExp("^[0-9]+$");

    var recordId = req.headers['user'];
    var title = req.body.designTitle;
    var description = req.body.designDescription;

    //Exit if invalid
    if (!reTitle.test(title) || !reDescription.test(description) || !reRecordId.test(recordId)) {
        console.log('Input not allowed')
        res.status(500).json({ message: 'Input not allowed' });
        return;
    } else {
        next()
        return;
    }

} //End of updateValidator
// ==================================== Update Design ==========================================
module.exports.updateValidator = (req, res, next) => {

        //Validation to check input values
        var reTitle = new RegExp("^[A-Za-z0-9 ]+$");
        var reDescription = new RegExp(`^[A-Za-z0-9_.'"!? ]+$`);
        var reRecordId = new RegExp("^[0-9]+$");

        var recordId = req.headers['user'];
        var title = req.body.designTitle;
        var description = req.body.designDescription;

        //Exit if invalid
        if (!reTitle.test(title) || !reDescription.test(description) || !reRecordId.test(recordId)) {
            console.log('Input not allowed')
            res.status(500).json({ message: 'Input not allowed' });
            return;
        } else {
            next()
            return;
        }

    } //End of updateValidator