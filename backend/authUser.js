var jwt = require('jsonwebtoken');
secret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    token = req.cookies.token
    if (!token) {
        console.log("No token")
        res.sendStatus(201);
        return;
    }

    jwt.verify(token, secret, (err, dec) => {
        if (err) {
            console.log("Invalid token")
            res.sendStatus(201);
        } else {
            next()
        }
    })
}