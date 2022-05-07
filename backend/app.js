var express = require('express');
var cookieParser = require('cookie-parser');

// api config
var app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// dotenv
require('dotenv').config()

// enable all cors
const cors = require('cors');
app.use(cors({credentials: true, origin: "http://localhost:3000"}));


// jwt
var jwt = require('jsonwebtoken');
secret = process.env.JWT_SECRET

// MySQL database
const { Sequelize, Model, DataTypes } = require('sequelize');
const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

// (async () => {
//         console.log(await db.query("SELECT * FROM `subject`", { type: Sequelize.QueryTypes.SELECT }));
//         await db.query("UPDATE `subject` SET subjectName=`Maths` WHERE subjectName='Meth'")
//             .catch(e => console.log("caught"))
//          console.log(await db.query("SELECT * FROM `subject`", { type: Sequelize.QueryTypes.SELECT }));
// })();



// User login
app.post('/login', async function(req, res) {
    user = await db.query(`SELECT * FROM user WHERE username='${req.body.username}'`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));
    console.log(req.body, user)

    if (user.length < 1) {
        res.status(201).send("User not found");
        return;
    }

    if (user[0].password == req.body.password) {
        token = jwt.sign({
            data: { // TODO - More user data
                username: req.body.username,
            }
        }, secret);
        // Successful login
        res.cookie("token", token, { Only: true }).status(200).send();
        return;
    }

    res.status(201).send("Incorrect password");
})

app.post('/register', async function(req, res, next) {
    user = await db.query(`SELECT * FROM user WHERE username='${req.body.username}'`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => next(console.log(e)));
    console.log(req.body, user, user.length)

    if (user.length > 0) {
        res.status(201).send("User already exists");
        return;
    }

    // Encrypt password? Nah, plaintext.
    await db.query(`INSERT INTO user (username, password) VALUES ('${req.body.username}', '${req.body.password}')`)

    res.status(200).send("User created");
})

app.post('/forgot', async function(req, res) {
    user = await db.query(`SELECT * FROM user WHERE username='${req.body.username}'`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => next(console.log(e)));
    console.log(req.body, user, user.length)

    if (user.length < 1) {
        res.status(201).send("User not found");
        return;
    }

    // Update password
    await db.query(`UPDATE user SET password='${req.body.password}' WHERE username='${req.body.username}'`)

    res.status(200).send("Password updated");
})

app.get('/logout', function(req, res) {
    res.clearCookie("token").end();
});

app.get('/verify', function(req, res) {
    token = req.cookies.token
    if (!token) {
        console.log("No token")
        res.sendStatus(201);
        return;
    }

    jwt.verify(token, secret, (err, dec) => {
        console.log(dec)
        res.status(200).send(dec);
    })
})


console.log("😄")
app.listen(3001);