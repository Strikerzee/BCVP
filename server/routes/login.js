let mysql = require('mysql');
let router = require('express').Router();
let bodyparser = require('body-parser');

let urlencodedparser = bodyparser.urlencoded({extended: false});
let jsonencodedparser = bodyparser.json();

router.options('/login', (req, res)=>{
    res.set('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send();
})

router.post('/login', urlencodedparser, (req, res)=>{
    console.log('Login request received');
    let cred = req.body;
    let query = "select username, password from userData where username = " + cred.username + " and password = " + cred.password;
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'BCVP'
    })
    connection.on('error', ()=>{
        res.status(500).end();
    })
    connection.query(query, (err, rows)=>{
        if(err)
            console.log(err.stack);
        else if(rows.length)
            res.send('<p> You are logged in! </p>');
        else
            res.send('<p> Invalid Credentials </p>')
    })
})

module.exports = router;