config = require('../config/config');
const pool = require('../config/database')
module.exports.authenticate = async(email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                if (err) reject(err);
            } else {
                try {
                    connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`,[email], (err, rows) => {
                        if (err) {
                            if (err) return reject(err);

                        } else {
                            if (rows.length == 1) {
                                return resolve(rows);

                            } else {
                                return reject('Login has failed');
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return resolve(error);
                }
            }
        }); //End of getConnection
    }); 


    } //End of authenticate