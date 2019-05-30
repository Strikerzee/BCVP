//OK.

let https = require('https');
let express = require('express');
let app = express();
let fs = require('fs');
let path = require('path')
let login = require('./routes/login');
// app.options('*', cors());
// app.use(cors());
// set secret variable
app.set('secret', 'thisismysecret');
app.use('/v1/login-backend', login);

app.get('/', (req, res)=>{
    res.send('<h1> Hello World </h1>');
});

const options = {
    key: fs.readFileSync(path.resolve(__dirname + '/../secure/ryans-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname + '/../secure/ryans-cert.pem'))
}

https.createServer(options, app).listen(4000, 'localhost', (error) => {
    
    if(error)
    {
        throw error;
    }
    else
        console.log('Listening at https://localhost:4000');
})