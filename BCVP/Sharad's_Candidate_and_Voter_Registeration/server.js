let https = require('https');
let express = require('express');
let fs = require('fs');
let path = require('path')
let login = require('./script.js');


let app = express();
app.use('/users/', login)

app.get('/', (req, res)=>{
    res.send('<h1> Hello World </h1>');
});

const options = {
    key: fs.readFileSync(path.resolve(__dirname + '/../secure/ryans-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname + '/../secure/ryans-cert.pem'))
}

https.createServer(options, app).listen(8443, 'localhost', (error)=>{
    if(error)
        throw error;
    else
        console.log('Listening at https://localhost:8443');
})