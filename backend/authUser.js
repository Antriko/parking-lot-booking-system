var jwt = require('jsonwebtoken');
secret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    token = req.cookies.token
    if (!token) {
        res.sendStatus(203);
        return;
    }

    jwt.verify(token, secret, (err, dec) => {
        if (err) {
            res.sendStatus(203);
            return;
        } else {
            next()
        }
    })
}