const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const poolData = {
    UserPoolId: "us-east-1_ObunEnZB1",
    ClientId: "77iiml8g59676vtpsm5s19rfja"
}
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)


//  Standardized JSON return format as follows
//  var jsonResult = {
//      key : value
//  }
//  return res.status(200).json(jsonResult);
exports.processLogin = async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    try {
        let results = await auth.authenticate(email)
        if (results.length == 1) {
            if ((password == null) || (results[0] == null)) {
                let jsonResult = {
                    message: 'Login has failed.'
                };
                return res.status(500).json(jsonResult);
            }
            if (bcrypt.compareSync(password, results[0].user_password) == true) {
                
                if (results[0].role_name == 'admin') {
                    jwtkey = jwt.sign({ id: results[0].user_id }, config.JWTKeyAdmin, {
                        expiresIn: 86400 //Expires in 24 hrs
                    })
                } else {
                    jwtkey = jwt.sign({ id: results[0].user_id }, config.JWTKeyUser, {
                        expiresIn: 86400 //Expires in 24 hrs
                    })
                }

                let jsonResult = {
                    user_id: results[0].user_id,
                    role_name: results[0].role_name,
                    token: jwtkey
                }; //End of data variable setup
                // reset the failure counter so next time they log in they get 5 tries again before the delays kick in
                req.brute.reset(function () {
                    console.log("Logged in");
                    return res.status(200).json(jsonResult); // logged in
                });

            } else {
                let jsonResult = {
                    message: 'Login has failed.'
                };
                return res.status(500).json(jsonResult);
            } //End of passowrd comparison with the retrieved decoded password.
        } //End of checking if there are returned SQL results




    } catch (error) {
        let jsonResult = {
            message: 'Credentials are not valid.'
        };
        return res.status(500).json(jsonResult);
        //If the following statement replaces the above statement
        //to return a JSON response to the client, the SQLMap or
        //any attacker (who relies on the error) will be very happy
        //because they relies a lot on SQL error for designing how to do 
        //attack and anticipate how much "rewards" after the effort.
        //Rewards such as sabotage (seriously damage the data in database), 
        //data theft (grab and sell). 
        //return res.status(500).json({ message: error });
    } //end of try



};

// If user submitted data, run the code in below
exports.processRegister = (req, res, next) => {
    console.log('processRegister running');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;


    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            let jsonResult = {
                message: 'Unable to complete registration'
            };
            return res.status(500).json(jsonResult);
        } else {
            try {
                results = await user.createUser(fullName, email, hash);
                //console.log(results);
                console.log("User Registered!");
                // Do not console log sensitive details
                let jsonResult = {
                    message: 'Completed registration'
                };
                const emailData = {
                    Name:  fullName,
                    Value: email
                }

                const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData)

                userPool.signUp(email,null, [emailAttribute], null, (err,data) =>{
                    if (err) {
                        return console.error(err)
                    }
                    console.log(data.user);
                    return res.status(200).json(jsonResult);
                });
                
            } catch (error) {
                console.log('processRegister method : catch block section code is running');
                console.log(error, '=======================================================================');
                let jsonResult = {
                    message: 'Unable to complete registration'
                };
                return res.status(500).json(jsonResult);
            }
        }
    });


}; //End of processRegister

exports.processLogout =  (req, res, next) => {
    let token = req.body.token
    console.log(token);

    try {
        user.logoutUser(token);
        console.log("logout Successful");
        let jsonResult = {
            message: 'Completed logout'
        };
        return res.status(200).json(jsonResult);
    } catch (error) {
        console.log(error);
        let jsonResult = {
            message: 'Unable to complete logout'
        };
        return res.status(500).json(jsonResult);
    }
}