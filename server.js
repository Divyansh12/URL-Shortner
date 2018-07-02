var express = require('express');
var path = require('path');
var mysql = require('mysql');
const bodyParser = require("body-parser");
var app = express();
var useragent = require('useragent');
var cors = require('cors');
var cookieParser = require("cookie-parser");

app.listen(3000);

app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
useragent(true);
app.use(bodyParser.json());
app.use(cors());
var device = require("express-device");
app.use(device.capture({parseUserAgent:true}));

//==============================
//Database Methods
//==============================

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webtracker',
    dateStrings: true
});
  
con.connect(function (err) {
    if (err) console.log("Problem in connection to db!!!!");
    else console.log("Connected!");

    var sql = "CREATE TABLE IF NOT EXISTS dblog (url VARCHAR(255), browser VARCHAR(255), browser_version VARCHAR(255), date VARCHAR(255), resolution VARCHAR(255), os VARCHAR(255), referrer VARCHAR(255), site_id VARCHAR(255), Device_Type VARCHAR(255), time VARCHAR(255), Device_name VARCHAR(255))";

    con.query(sql, function(err, result) {
        if(err) throw err;
        else console.log('table dblog created');
    });
    
    sql = "CREATE TABLE IF NOT EXISTS sites (url VARCHAR(255), siteID VARCHAR(255))";

    con.query(sql, function(err, result) {
        if(err) throw err;
        else console.log('table sites created');
    });
});

//==============================
//Routes
//==============================

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

//============================
//Inserting data in the DB
//============================

app.post('/insertSite', function (req, res, next) {
    var tname = 'sites';

    var sql = `INSERT INTO ${tname} (url, siteID) values('${req.body.url}', '${req.body.siteID}')`;
    
    con.query(sql, function (err, result) {
        if (err) console.log(err.sqlMessage);
        else console.log("Inserted into sites!!");
    });
});

app.post('/insertlog', function (req, res, next){

    var tname = 'dblog';
    
    var ver = '1';
    
    var agent = useragent.parse(req.headers['user-agent']);
    
    var sql = `insert into ${tname} (url, browser, browser_version, date, resolution, os, referrer, site_id, Device_Type, time, Device_name) values('${req.body.url}','${req.device.parser.useragent.family}','${ver}',STR_TO_DATE('${req.body.date}', '%m/%d/%Y'),'${req.body.ress}','${agent.os.toString()}','${req.body.ref}','${req.body.S_id}','${req.device.type}','${req.body.time}','${req.device.name}')`;
    
    con.query(sql, function (err, result) {
        if (err) console.log(err.sqlMessage);
        else console.log("Inserted into datalog!!");
    });
      
    res.send('abc');
});

//========================================

app.get('/info', function (req, res) {
    console.log('redirected to here!');
    res.sendFile(path.join(__dirname, 'views', 'info.txt'));
});

app.get('/stage/:siteID', function (req, res) {
    
    var sID = req.params.siteID;

    var sql = "SELECT url FROM sites WHERE siteID = '" + sID + "'";

    con.query(sql, function(err, result) {
        if(err) throw err;
        else console.log('url found!');
        console.log(result);
    });

    res.sendFile(path.join(__dirname, 'views', 'stage.html'));
});

app.get('/url', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'url_shortner.html'));
});

app.get('/:siteID', function (req, res) {
    var sID = req.params.siteID;
    res.redirect("/stage/" + sID);
});

