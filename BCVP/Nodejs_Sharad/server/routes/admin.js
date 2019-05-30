let mysql = require('mysql');
let router = require('express').Router();
let bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
var saltrounds = 10;

let urlencodedparser = bodyparser.urlencoded({extended: false});
let jsonencodedparser = bodyparser.json();

router.options('*', (req, res) => {
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

router.post('/login', jsonencodedparser, function(req, resp) {
    console.log('Login Request received');
    resp.setHeader('Access-Control-Allow-Origin', '*');
    var id = req.body.username;
    var password = req.body.password;
    var sql = "select * from Admins where username = " +  `'${id}'`;
    connection.query(sql, (error, rows, fields) => {
        if(!!error) {
            throw error;
        }
        else
        {
            if(isEmpty(rows))
            {
                console.log("No user with these credentials exists");
                resp.json({ 
                    success: false, 
                    message: "No user with these credentials exists" 
                });
            }
            else
            {
                hash = rows[0].Password;
                bcrypt.compare(password, hash)
                .then((res) =>
                {
                    if(res ==  true)
                    {
                        console.log("User is logged in");
                        let token = Math.random().toString(36);
                        let updateQuery = `UPDATE Admins set token = '${token}' where username='${id}'`;
                        connection.query(updateQuery, (err, row, fields)=>{
                            if(err){
                                console.log(err.message);
                                resp.status(500);
                                resp.json({
                                    success: false,
                                    message: 'Internal Server Error'
                                })
                            }else{
                                resp.json({
                                    success: true,
                                    message: {
                                        user_id: id,
                                        token: token
                                    }
                                })
                            }
                        })
                    }
                    else if(res == false)
                    {
                        console.log("password is wrong");
                        resp.json({
                            success: false, 
                            message: "password is wrong"
                        });
                    }
                })
                .catch((err)=>{
                    console.log(err.message);
                    resp.status(500);
                    resp.json({
                        success: false,
                        message: 'Internal Server Error'
                    })
                })
            }
        }
    });
});

router.post('/createVoter', jsonencodedparser, (req, resp)=>{
    console.log('body ', req.body);
    resp.set('Access-Control-Allow-Origin', '*');
    let authArray, id='', token='', voterDetails;
    if(req.get('Authorization') != undefined){
        authArray = req.get('Authorization').toString().split(' ').pop().split(':');
        id = authArray[0];
        token =  authArray[1];
        voterDetails = req.body.voter_details;
        console.log(req.body);
    }
    let tokenQuery = `SELECT * FROM Admins where token = '${token}' and username = '${id}'`
    connection.query(tokenQuery, (error, row)=>{
        if(error){
            console.log(error.message);
            resp.status(500);
            resp.json({
                success: false,
                message: 'Internal Server Error'
            })
            return;
        }
        if(isEmpty(row)){
            resp.json({
                success: false,
                message: 'token is invalid'
            })
        }
        else{
            let uniquenesQuery = `SELECT * FROM People where VoterID='${voterDetails.username}'`;
            connection.query(uniquenesQuery, (err, rows)=>{
                if(err){
                    console.log(err.message);
                    resp.status(500);
                    resp.json({
                        success: false,
                        message: 'Internal Server Error'
                    })
                }
                else if(isEmpty(rows)){
                    bcrypt.hash(voterDetails.password, 10)
                    .then((hash)=>{
                        var createVoterQuery = `INSERT INTO People(VoterID, password) values ('${voterDetails.username}', '${hash}')`;
                        connection.query(createVoterQuery, (errs, rows, fields)=>{
                            if(err){
                                console.log(errs.message);
                                resp.status(500);
                                resp.json({
                                    success: false,
                                    message: 'Internal Server Error'
                                })
                            }
                            else{
                                let newToken = Math.random().toString(36);
                                let updateQuery = `UPDATE Admins set token = '${newToken}' where username='${id}'`;
                                connection.query(updateQuery, (er)=>{
                                    if(er){
                                        console.log(er.message);
                                        resp.status(500);
                                        resp.json({
                                            success: false,
                                            message: 'Internal Server Error'
                                        })
                                    }else{
                                        resp.json({
                                            success: true,
                                            message: {
                                                user_id: id,
                                                token: newToken
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                    .catch(err=>{
                        console.log(err.message);
                        resp.status(500);
                        resp.json({
                            success: false,
                            message: 'Internal Server Error'
                        })
                    })
                }
                else{
                    console.log('User already exists');
                    resp.json({
                        success: false,
                        message: 'username is already taken'
                    })
                }
            })
        }
    })
})

module.exports = router;