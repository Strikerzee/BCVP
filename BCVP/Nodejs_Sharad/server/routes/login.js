let mysql = require('mysql');
var fs = require("fs");
var express = require('express');
let login = express.Router();
const fabric_router = require('./app');
let bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
var saltrounds = 10;
var http = require("http");
let urlencodedparser = bodyparser.urlencoded({extended: false});
let jsonencodedparser = bodyparser.json();
const request = require('request');
// const fetch = require('node-fetch');
const https = require("https");

login.use('/fabric', fabric_router);
login.options('*', (request, res) => {
    res.set('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send();
})
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampledatabase'
})
connection.connect((error) => {
    if(!!error)
    {
        console.log("Error",error);
    }
    else
    {
        console.log("Successful Connection"); 
    }
});

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

function set_token_null(obj)
{
    connection.query("update People set token = NULL where VoterID = ?", obj, (err, rows) => {
        if(err)
            console.log(err.message);
    })
};

function generate_token(obj, resp, dash) {
    bcrypt.hash(obj,saltrounds, function(err,hash)
    {
        if(err)
        {
            resp.json({ 
                success: false, 
                message: "error while generating token" 
            });
            console.log(err.message);
        }
        else
        {
            var sql = `update People set token = '${hash}' where VoterID = '${obj.split(' ', 1)[0]}'`;
            connection.query(sql, (error, rows) => {
                if(error) {
                    console.log(error.message)
                }
                else
                {
                    if(dash == false)
                    {
                        resp.json({
                            success: true,
                            message: { 
                                token: hash,
                                user_id: obj.split(' ', 1)[0]
                            }
                        });
                    }
                    
                    else if(dash == true)
                    {
                        console.log('Fetching candidates.....');
                        // resp.send(hash);
                        query_for_candidates = "select * from Candidates"
                        connection.query(query_for_candidates,(er,row) =>{
                            if(er) {
                                console.log(er.message);
                                resp.status(500).json({
                                    success: false,
                                    message: 'Internal Server Error'
                                })
                            }
                            else
                            {
                                let response = {
                                    success: true,
                                    message: {
                                        candidate_details: row,
                                        user_details: {
                                            token: hash,
                                            user_id: obj.split(' ', 1)[0]
                                        }
                                    }
                                }
                                resp.json(response);
                            }
                        })
                    }
                }
            })
        }
    })
}

login.post('/login', jsonencodedparser, function(request, resp) {
    console.log('Login Request received');
    resp.setHeader('Access-Control-Allow-Origin', '*');
    var id = request.body.username;
    var password = request.body.password;
    var sql = "select * from People where VoterID = " +  `'${id}'`;
    connection.query(sql, (error, rows, fields) => {
        if(!!error) {
            throw error;
        }
        else
        {
            if(isEmpty(rows))
            {
                console.log("Voter ID does not exist");
                resp.json({ 
                    success: false, 
                    message: "Voter ID does not exist" 
                });
            }
            else
            {
                hash = rows[0].Password;
                bcrypt.compare(password, hash, function(err, res) 
                {
                    if(err) {
                        console.log(err);
                    }
                    else
                    {
                        if(res ==  true)
                        {
                            console.log("User is logged in");
                            generate_token(id + ' ' + password, resp, false);
                        }
                        else if(res == false)
                        {
                            console.log("password is wrong");
                            resp.json({
                                success: false, 
                                message: "password is wrong" 
                            });
                        }
                    }
                });
            }
        }
    });
});

login.post('/submit',jsonencodedparser, function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    let authArray = req.get('Authorization').toString().split(' ').pop().split(':');
    var id = authArray[0];
    var token =  authArray[1];
    var sql2 =  "select token from People where VoterID = ?" ;
    var sql1 = "update People set Voted = 1 where VoterID = ?";
    connection.query(sql2, id, (error, rows, fields) => {
        if(error)
        {
            console.log(error);
        }
        else if(isEmpty(rows))
        {
            console.log("wrong Voter id");
            resp.json({ 
                success: false, 
                message: "wrong Voter id" 
            });
        }
        else
        {
            var o_token = rows[0].token;
            if(o_token == null) {
                resp.json({
                    success: false, 
                    message: "token did not match logged out" 
                });
            }
            else if(token.trim() == o_token.toString())
            {
                let jsonData = JSON.parse(fs.readFileSync('Org1.json', 'utf-8'))
                Bearer_token = "Bearer " + jsonData.token;
                
                let Party = req.body.candidate;
                var reqBody = '{"peers": ["peer0.org1.example.com", "peer2.org1.example.com","peer3.org1.example.com"],"fcn":"vote","args":[\"'+Party+'\"]}';

                let request = https.request({
                    port: 4000,
                    hostname: 'localhost',
                    method: 'POST',
                    path: '/v1/login-backend/fabric/channels/voting-channel/chaincodes/voting-block',
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(reqBody)
                    }
                }, (res)=>{
                    if(res.statusCode != 200){
                        console.log(res.statusCode);
                    }
                    else{
                        console.log(res);
                    }
                })
                request.write(reqBody, (err)=>{
                    console.log(err.message);
                })
                request.on('error', (err)=>{
                    console.log(err.message);
                })
                request.end();
                // request.write(reqBody);
                // request.end();
                // const agent = new https.Agent({
                //     method: 'post',
                //     body:    JSON.stringify(reqBody),
                //     headers: { 'Content-Type': 'application/json' },
                //     rejectUnauthorized: false
                //   });
                // fetch('https://localhost:4000/v1/login-backend/fabric/channels/voting-channel/chaincodes/voting-block', { agent })
                  
                // const options = {
                //     hostname: 'localhost',
                //     port: 4000,
                //     path: '/v1/login-backend/fabric/channels/voting-channel/chaincodes/voting-block',
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // };
                  
                //   const requ = http.request(options, (res) => {
                //     console.log(`STATUS: ${res.statusCode}`);
                //     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                //     res.setEncoding('utf8');
                //     res.on('data', (chunk) => {
                //       console.log(`BODY: ${chunk}`);
                //     });
                //     res.on('end', () => {
                //       console.log('No more data in response.');
                //     });
                //   });
                  
                //   requ.on('error', (e) => {
                //     console.error(`problem with request: ${e.message}`);
                //   });
                  
                //   // Write data to request body
                //   requ.write(reqBody);
                //   requ.end();

                connection.query(sql1, id, (error, rows) => {
                    console.log("user has voted");
                });
                console.log("token matched");    
                set_token_null(id);
                resp.json({ 
                    success: true, 
                    message: "User has Voted" 
                });
            }
            else
            {
                set_token_null(id);
                resp.json({
                    success: false, 
                    message: "token did not match logging out" 
                });
                console.log("token did not match");
            }

        }
    });
})

login.get('/dashboard', jsonencodedparser,function(request, resp) {
    console.log('Received post request');
    resp.set('Access-Control-Allow-Origin', '*');
    let authArray = request.get('Authorization').toString().split(' ').pop().split(':');
    var id = authArray[0];
    var token =  authArray[1];
    var sql2 =  "select token from People where VoterID = ?";
    connection.query(sql2, id, (error, rows, fields) => {
        if(error)
        {
            console.log(error);
        }
        else if(isEmpty(rows))
        {
            console.log("wrong Voter id");
            resp.json({ 
                success: false, 
                message: "wrong Voter id" 
            });
        }
        else
        {
            var o_token = rows[0].token;
            if(o_token == null) {
                set_token_null(id);
            }
            else if(token.trim() == o_token.toString())
            {
                console.log("token matched");    
                generate_token(id + ' ' + token, resp, true);
            }
            else
            {
                set_token_null(id);
                resp.json({ 
                    success: false, 
                    message: "token did not match logging out" 
                });
                console.log("token did not match"); 
            }

        }
    });
})

// login.post('/login', urlencodedparser, (request, res)=>{
//     console.log('Login request received');
//     let cred = request.body;
//     let query = "select username, password from userData where username = " + cred.username + " and password = " + cred.password;
//     connection.query(query, (err, rows)=>{
//         if(err)
//             console.log(err.stack);
//         else if(rows.length)
//             res.send('<p> You are logged in! </p>');
//         else
//             res.send('<p> Invalid Credentials </p>')
//     })
// })

module.exports = login;