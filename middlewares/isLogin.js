// const jwt = require("jsonwebtoken");
// const dotenv = require('dotenv');

let login_status = false;

const checkLogin = (req, res, next) => {
    // const token = req.cookies.token;
    // if(token){
    //     jwt.verify(token, "fasdfsdfsdfuihyfweuibfjbsdf%",(err, data) => {
    //         if(!err){
    //             req.usermobile = data.usermobile;
    //             req.userId = data.userId;
    //             req.login_status = true;

    //             return next();
    //         }else{
    //             res.clearCookie('token');
    //             return res.redirect('/');
    //         }
    //     });
    // }else {
    //     next();
    // }

    const token = req.cookies.userId;

    if(token){
        req.userId = token;
        req.login_status = true;
        return next();
    }else {
        next();
    }

};

module.exports = checkLogin;