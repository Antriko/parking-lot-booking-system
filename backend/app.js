var express = require('express');
var cookieParser = require('cookie-parser');
var authUser = require('./authUser.js');

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
const { reset } = require('nodemon');
const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    // logging: false  // Uncomment if want to not see queries ran
});

(async () => {
    // Create all tables for app
    await db.query("CREATE TABLE IF NOT EXISTS `user` (`ID` int(11) NOT NULL AUTO_INCREMENT, `username` varchar(16) NOT NULL, `password` varchar(16) NOT NULL, PRIMARY KEY (`ID`))")
        .catch(e => console.log("caught", e))

    await db.query("CREATE TABLE IF NOT EXISTS `parkinglot`.`bookings` ( `ID` INT NOT NULL AUTO_INCREMENT , `UserID` INT NOT NULL , `timeFrom` DATETIME NOT NULL , `timeTo` DATETIME NOT NULL , `parkingSlot` INT NOT NULL , PRIMARY KEY (`ID`))")
    .catch(e => console.log("caught", e))
    
})();


// User login
app.post('/login', async (req, res) => {
    user = await db.query(`SELECT * FROM user WHERE username='${req.body.username}'`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));
    console.log(req.body, user)

    if (user.length < 1) {
        res.status(201).send("User not found");
        return;
    }

    if (user[0].password == req.body.password) {
        console.log(user)
        token = jwt.sign({
            data: { // TODO - More user data
                username: req.body.username,
                ID: user[0].ID
            }
        }, secret);
        // Successful login
        res.cookie("token", token, { Only: true }).status(200).send();
        return;
    }

    res.status(201).send("Incorrect password");
})

app.post('/register', async (req, res) => {
    user = await db.query(`SELECT * FROM user WHERE username='${req.body.username}'`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));
    console.log(req.body, user, user.length)

    if (user.length > 0) {
        res.status(201).send("User already exists");
        return;
    }

    // Encrypt password? Nah, plaintext.
    await db.query(`INSERT INTO user (username, password) VALUES ('${req.body.username}', '${req.body.password}')`)

    res.status(200).send("User created");
})

app.post('/forgot', async (req, res) => {
    user = await db.query(`SELECT * FROM user WHERE username='${req.body.username}'`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));
    console.log(req.body, user, user.length)

    if (user.length < 1) {
        res.status(201).send("User not found");
        return;
    }

    // Update password
    await db.query(`UPDATE user SET password='${req.body.password}' WHERE username='${req.body.username}'`)

    res.status(200).send("Password updated");
})

app.get('/logout', (req, res) => {
    res.clearCookie("token").end();
});

app.get('/verify', authUser, (req, res) => {
    jwt.verify(token, secret, (err, dec) => {
        console.log(dec)
        res.status(200).send(dec);
    })
})


app.post('/book', authUser, async (req, res) => {
    // 30 minute intervals
    dateFrom = new Date(req.body.dateFrom);
    dateTo = new Date(req.body.dateTo);
    while (dateFrom.getMinutes() != 0 && dateFrom.getMinutes() != 30) {
        dateFrom = new Date(dateFrom.getTime() - 60000)
    }
    while (dateTo.getMinutes() != 0 && dateTo.getMinutes() != 30) {
        dateTo = new Date(dateTo.getTime() + 60000)
    }
    
    var token = jwt.verify(req.cookies.token, secret, (err, dec) => {
        if(err) {
            res.sendStatus(400);
        }
        return dec.data
    })
    
    // Convert to MySQL date format
    dateFrom = dateFrom.toISOString().slice(0, 19).replace('T', ' ')
    dateTo = dateTo.toISOString().slice(0, 19).replace('T', ' ')
    console.log(token.username, "\nFrom\t", dateFrom, "\nTo\t", dateTo)

    await db.query(`INSERT INTO bookings (UserID, timeFrom, timeTo, parkingSlot) VALUES ('${token.ID}', '${dateFrom}', '${dateTo}', '${req.body.spot}')`)
        .catch(e => {console.log(e)})

    res.sendStatus(200);
})

app.post('/availability', authUser, async (req, res) => {
    // 30 minute intervals
    dateFrom = new Date(req.body.dateFrom);
    dateTo = new Date(req.body.dateTo);
    while (dateFrom.getMinutes() != 0 && dateFrom.getMinutes() != 30) {
        dateFrom = new Date(dateFrom.getTime() - 60000)
    }
    while (dateTo.getMinutes() != 0 && dateTo.getMinutes() != 30) {
        dateTo = new Date(dateTo.getTime() + 60000)
    }
    
    // Convert to MySQL date format
    dateFrom = dateFrom.toISOString().slice(0, 19).replace('T', ' ')
    dateTo = dateTo.toISOString().slice(0, 19).replace('T', ' ')
    console.log("\nFrom\t", dateFrom, "\nTo\t", dateTo, "\nKeep in mind of timezones.")

    // Get all spots that are not available for that time period, so available spots will be shown
    spots = await db.query(`SELECT parkingSlot FROM bookings WHERE (timeFrom > cast('${dateFrom}' as datetime) && timeFrom < cast('${dateTo}' as datetime)) || (timeTo > cast('${dateFrom}' as datetime) && timeTo < cast('${dateTo}' as datetime)) || (timeFrom < cast('${dateFrom}' as datetime) && timeTo > cast('${dateTo}' as datetime))`, 
        { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));

    console.log(spots)
    res.status(200).send(spots);
})

app.get('/bookings', authUser, async (req, res) => {
    var token = jwt.verify(req.cookies.token, secret, (err, dec) => {
        if(err) {
            res.sendStatus(201);
        }
        return dec.data
    })
    bookings = await db.query(`SELECT * FROM bookings WHERE UserID=${token.ID}`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));

    console.log(bookings)
    res.status(200).send(bookings);
})


console.log("😄")
app.listen(3001);