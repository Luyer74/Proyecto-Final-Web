var jwt = require("jsonwebtoken");

function getUser(req,res,next) {

var token = req.cookies.token || '' ; 

if (!token) {
    req.userId = "invalid";
    req.permission = '';
    next();
}
else {
    
    jwt.verify(token,process.env.SECRET, function(err,data){

        if (err){
            
            req.userId = "invalid";
            req.permission = '';

            next();
        }
        else {

            req.userId = data.id;
            req.permission = data.permission;

            next();
        }

    })

    
}

}


module.exports = getUser;