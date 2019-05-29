let mysql = require('mysql');
const bcrypt = require('bcrypt');
var saltrounds = 10;
let username = 'Arnav';
let password = 'Arnav@123';

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

bcrypt.hash(password, saltrounds).then((hash) => {
    connection.query(`Insert INTO People (VoterID, Password) values ('${username}', '${hash}')`, (err, rows) => {
        if(err){
            console.log(err.message);
        }
        else{
            console.log('Entered Data in table');
        }
    });
}).catch((err)=>{
    console.log('Can\'t generate hash', err.message);
})