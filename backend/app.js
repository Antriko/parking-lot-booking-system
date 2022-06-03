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
app.use(cors({credentials: true, origin: "http://localhost:8060"}));


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
    await db.authenticate()
        .then(() => console.log("Connected"))
        .catch(e => console.log(e))

        
    // Create database
    await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`)
        .catch(e => console.log("caught", e))


    // Create all needed tables for app
    await db.query("CREATE TABLE IF NOT EXISTS `parkinglot`.`user` (`ID` int(11) NOT NULL AUTO_INCREMENT, `username` varchar(16) NOT NULL, `password` varchar(16) NOT NULL, PRIMARY KEY (`ID`))")
        .catch(e => console.log("caught"))

    await db.query("CREATE TABLE IF NOT EXISTS `parkinglot`.`bookings` ( `ID` INT NOT NULL AUTO_INCREMENT , `UserID` INT NOT NULL , `timeFrom` DATETIME NOT NULL , `timeTo` DATETIME NOT NULL , `parkingSlot` INT NOT NULL , PRIMARY KEY (`ID`))")
        .catch(e => console.log("caught"))

    await db.query("CREATE TABLE IF NOT EXISTS `parkinglot`.`vehicle` (`ID` int(11) NOT NULL AUTO_INCREMENT, `UserID` int(11) NOT NULL, `vehicleName` varchar(45) NOT NULL, `vehicleReg` varchar(45) NOT NULL, PRIMARY KEY (`ID`))")
        .catch(e => console.log(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST))
})();


// User login
app.post('/api/login', async (req, res) => {
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

app.post('/api/register', async (req, res) => {
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

app.post('/api/forgot', async (req, res) => {
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

app.get('/api/logout', (req, res) => {
    res.clearCookie("token").end();
});

app.get('/api/verify', authUser, (req, res) => {
    jwt.verify(token, secret, (err, dec) => {
        console.log(dec)
        res.status(200).send(dec);
    })
})


app.post('/api/book', authUser, async (req, res) => {
    // 30 minute intervals
    dateFrom = new Date(req.body.dateFrom);
    dateTo = new Date(req.body.dateTo);

    if (dateFrom > dateTo) {
        res.status(201).send("Invalid date");
    }

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

    res.status(200).send();
})

app.post('/api/availability', authUser, async (req, res) => {
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
    spots = await db.query(`SELECT parkingSlot FROM bookings WHERE (timeFrom >= cast('${dateFrom}' as datetime) && timeFrom < cast('${dateTo}' as datetime)) || (timeTo > cast('${dateFrom}' as datetime) && timeTo <= cast('${dateTo}' as datetime)) || (timeFrom < cast('${dateFrom}' as datetime) && timeTo >= cast('${dateTo}' as datetime))`, 
        { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));

    console.log(spots)
    res.status(200).send(spots);
})

app.get('/api/bookings', authUser, async (req, res) => {
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

app.post('/api/vehicle', authUser, async (req, res) => {
    var token = jwt.verify(req.cookies.token, secret, (err, dec) => {
        if(err) {
            res.sendStatus(201);
        }
        return dec.data
    })

    // Check if there is a entry of that user already, if so then update otherwise insert new

    vehicle = await db.query(`SELECT * FROM vehicle WHERE UserID=${token.ID}`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));

    console.log(vehicle)
    if(vehicle.length > 0) {

        // Update
        await db.query(`UPDATE vehicle SET vehicleName='${req.body.vehicleName}', vehicleReg='${req.body.regPlate}' WHERE UserID=${token.ID}`)
        res.sendStatus(200);
        return;
    }

    await db.query(`INSERT INTO vehicle (UserID, vehicleName, vehicleReg) VALUES ('${token.ID}', '${req.body.vehicleName}', '${req.body.regPlate}')`)
        .catch(e => console.log(e));

    res.sendStatus(200);
})

app.get('/api/getVehicle', authUser, async (req, res) => {
    var token = jwt.verify(req.cookies.token, secret, (err, dec) => {
        if(err) {
            res.sendStatus(201);
        }
        return dec.data
    })

    vehicle = await db.query(`SELECT * FROM vehicle WHERE UserID=${token.ID}`, { type: Sequelize.QueryTypes.SELECT })
        .catch(e => console.log(e));

    res.status(200).send(vehicle);
})


app.get('/api/test', async (req, res) => {
    console.log(req)
    res.sendStatus(200);
})

app.listen(8070);
console.log("😄")
module.exports = app;