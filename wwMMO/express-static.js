/* What about serving up static content, kind of like apache? */
require('./static_files/lib/constants.js');
require('./static_files/lib/zxcvbn.js');
const assert = require('assert');
// var mongodb = require('mongodb');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


function DEBUGexpressServer(msg) {
    console.log('==== (EXPRESS SERVER) ==== ' + msg + ' ====');
}

// ===================== DATABASE prerequisites ========================
const MongoClient = require('mongodb').MongoClient;
var db;
const utorid = global.wwUtorid;
const password = global.wwPassword;
const dbName = global.wwDbName;
const mongodbPort = global.wwDbPort;
const url = 'mongodb://'+utorid+':'+password+'@mcsdb.utm.utoronto.ca:'+mongodbPort+'/'+dbName;
// ===================== DATABASE prerequisites ========================

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
// create a virtual path prefix (where the path does not actually exist in the
// file system) for files that are served by the express.static function
// currently '/'
// serve images, CSS files, and JavaScript files in a directory named 'static-content'
app.use('/', express.static('static_files')); // this directory has files to be returned
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// Initialize connection once
MongoClient.connect(url, function(err, database) {
    if(err) throw err;

    db = database.db(dbName);
    DEBUGexpressServer('database created');
    // console.log(db);

    db.createCollection('users', function(err, res) {
        if (err) throw err;
            DEBUGexpressServer('users Collection created!');
            // db.close();
    });

    var myobj = { uname: "aaaa", pass: "12345678" };
    db.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
            DEBUGexpressServer('1 default user document inserted');
            // db.close();
    });



    // Start the application after the database connection is ready
    app.listen(global.wwPort, function () {
        DEBUGexpressServer('Express server listening on port '+global.wwPort+'!');
    });

    // ================ ENDPOINTS =========================================
    app.get('/api/db/', function(req, res) {
        res.send('Hello World');

    });

    app.get('/api/css', function(req, res) {
        res.sendFile(__dirname+'/static_files/main.css');
    });

    app.get('/api/users', function(req, res) {
        DEBUGexpressServer('in api users endpoint');

        db.collection('users').findOne({}, function(err, result) {
            if (err) throw err;
            DEBUGexpressServer('found one user: '+result.uname);
            res.send(result.uname);
            // db.close();
        });
    });

    app.post('/api/login', function(req, res) {

        var recUname = req.body.uname;
        var recPw = req.body.pw;

        db.collection('users').findOne({uname: recUname, pass: recPw}, function(err, result) {
            if (err) throw err;

            // IF user already exists, then don't register
            var msg = {};
            msg['verified'] = false;

            if (result) {
                DEBUGexpressServer('login exists!: ');
                DEBUGexpressServer(result);
                msg['verified'] = true;
                res.json(msg);

            } else {

                DEBUGexpressServer('login does not exist ('+recUname+', '+recPw+')');
                res.json(msg);

            }
            DEBUGexpressServer('done registering user');

        });


    });

    app.post('/api/register', function(req, res) {

        var recUname = req.body.uname;
        var recPw = req.body.pw;

        db.collection('users').findOne({uname: recUname}, function(err, result) {
            if (err) throw err;

            // IF user already exists, then don't register
            var msg = {};
            msg['registered'] = false;
            if (result) {
                DEBUGexpressServer('user already exists!: ');
                DEBUGexpressServer(result);
                res.json(msg);

                // var msgStr = JSON.stringify({message: 'user already exists!'});
                // res.json(msgStr);

            } else {
                var newUser = { uname: recUname, pass: recPw, scores: []};
                db.collection("users").insertOne(newUser, function(err, result) {
                    if (err) throw err;
                    DEBUGexpressServer('new user ('+recUname+', '+recPw+') document inserted');
                    msg['registered'] = true;
                    res.json(msg);
                    // db.close();
                    // var msgStr = JSON.stringify({message: 'user registered!'});
                    // res.json(msgStr);
                });
            }
            DEBUGexpressServer('done registering user');

        });


    });

    app.get('/api/top10', function(req, res) {

        db.collection('users').find().sort({"scores.0": -1}).limit(10);
        if (err) throw err;
        DEBUGexpressServer('got top 10 of all players');
        res.send(result);
    });

    app.get('/api/usertop10', function(req, res) {
        db.collection('users').find({uname: req.body.user}).sort({"scores.0": -1}).limit(10);
        if (err) throw err;
        DEBUGexpressServer('got top 10 of all players');
        res.send(result);
    });

    app.post('/api/addscore', function(req, res) {
        db.collection('users').find({uname: req.body.user}).insertOne({scores: req.body.score});
        if (err) throw err;
        DEBUGexpressServer('added score to a user');
        //res.send(result);
        // TODO stop breaking shit pls lol
    });

    app.post('/api/changeusername', function(req, res) {
        db.collection('users').update({uname: req.body.olduname}, {$set:{uname: req.body.newuname}});
        if (err) throw err;
        DEBUGexpressServer('changed username successfully');
        var msg = {};
        msg['changedUsername'] = true;
        res.json(msg);

    });

    app.post('/api/changepassword', function(req, res) {
        db.collection('users').update({uname: req.body.uname}, {$set:{pass: req.body.newpw}});
        if (err) throw err;
        DEBUGexpressServer('changed password successfully');
        var msg = {};
        msg['changedPassword'] = true;
        res.json(msg);
    });



    // ================ end of ENDPOINTS ==================================

  // db.close();

  // console.log("Listening on port 3000");
});
// =====================================================================
