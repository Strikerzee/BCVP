let mysql = require('mysql');
let router = require('express').Router();
let bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
var saltrounds = 10;

let urlencodedparser = bodyparser.urlencoded({extended: false});
let jsonencodedparser = bodyparser.json();

router.options('/login', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send();
})
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampledatabase'
})
connection.connect( (error) => {
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
    resp.setHeader('Content-Type', 'application/json');
    connection.query("update People set token = NULL where VoterID = ?",obj, (err, rows) => {
        if(err)
         throw err;
        else
            resp.end(JSON.stringify({ success: false, message: "token did not match logging out" }));
            // resp.send("token did not match logging out\n");
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
            // resp.send("error while generating token\n");
            throw err;
        }
        else
        {
            var sql = `update People set token = '${hash}' where VoterID = '${obj.split(' ', 1)[0]}'`;
            connection.query(sql, (error, rows) => {
                if(error)
                {
                    throw error;
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
                        // resp.send(hash);
                        query_for_candidates = "select * from Candidates"
                        connection.query(query_for_candidates,(er,row) =>{
                            if(er)
                            {
                                throw er;
                                
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

router.post('/login', jsonencodedparser, function(req, resp) {
    console.log('Login Request received');
    resp.setHeader('Access-Control-Allow-Origin', '*');
    var id = req.body.username;
    var password = req.body.password;
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
                    if(err){
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

router.post('/submit',jsonencodedparser, function(req, resp) {
    var id = req.body.username;
    var token =  req.body.token;
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
            if(o_token == null){
                resp.json({ 
                    success: false, 
                    message: "token did not match logged out" 
                });
            }
            else if( token.trim() == o_token.toString())
            {
                connection.query(sql1,id, (error, rows) => {
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

router.post('/dashboard', jsonencodedparser,function(req, resp) {
    var id = req.body.username;
    var token =  req.body.token;
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
            if(o_token == null){
                set_token_null(id);
            }
            else if(token.trim() == o_token.toString())
            {
                console.log("token matched");    
                generate_token(id + ' ' + resp, true);
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

// router.post('/login', urlencodedparser, (req, res)=>{
//     console.log('Login request received');
//     let cred = req.body;
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

module.exports = router;