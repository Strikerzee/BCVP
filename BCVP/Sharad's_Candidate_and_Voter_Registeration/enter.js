const  express = require('express');
const   mysql = require('mysql');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
const   app = express();
const saltRounds = 10;
var VoterId;  
var password;

app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampledatabase'
});

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

app.post('/register/voters', (req,resp) =>{
    VoterId = req.body.name;
    password = req.body.pass;
    re_password = req.body.re_pass;
    if(password.trim() != re_password.toString())
        resp.send("password does not match");
    else
    {
        bcrypt.hash(password, saltRounds, function(err, hash) 
        {
            if(err)
            {
                throw err;
            }
            else
            {
                console.log(hash);
                hash = "\"" + hash +  "\"";
                VoterId = "\"" + VoterId +  "\"";
                const sql = "INSERT INTO People values (" + VoterId + ", " + hash + ", " + "false, NULL)"; 
                connection.query(sql,(error, rows, fields) =>
                {
                    if(error)
                    {
                        resp.send("Voter already exist")
                        console.log(error);
                    }
                    else
                    {
                        resp.send("user is entered successfully with VOter ID " + VoterId);
                        console.log("Sucessfully added user with voter id " + VoterId);
                    }
                });
            }
        });
        
    }
})


app.post('/register/candidates', (req,resp) =>{
    Name = req.body.your_name;
    Party = req.body.your_pass;
    Name = "\"" + Name +  "\"";
    Party = "\"" + Party +  "\"";
    sql = "INSERT INTO Candidates values (" + Name + ", " + Party + ")";
    connection.query(sql,(error, rows, fields) =>
    {
        if(error)
        {
            resp.send("Candidate for this Party already Registeres")
            console.log(error);
        }
        else
        {
            resp.send("Candidate is entered successfully with  Name" + Name);
            console.log("Candidate is entered successfully with  Name" + Name);
        }
    });
        
    
})

app.listen(8090, function() {
    console.log('Server running at http://127.0.0.1:8090/');
  });
    // bcrypt.hash(password, saltRounds, function(err, hash) 
    // {
    //     if(err)
    //     {
    //         throw err;
    //     }
    //     else
    //     {
    //         console.log(hash);
    //         hash = "\"" + hash +  "\"";
    //         const sql = "INSERT INTO People values (" + VoterId + ", " + hash + ", " + "false, NULL)"; 
    //         connection.query(sql,(error, rows, fields) =>
    //         {
    //             if(error)
    //             {
    //                 console.log(error);
    //             }
    //             else
    //             {
    //                 console.log("Sucessfully added user with voter id ");
    //             }
    //         });
    //     }
        
        
        
    // });



// bcrypt.compare(password, hash, function(err, res) 
//     {
//         if(err)
//         {
//             console.log(err);
//         }    
//         else
//         {
//             if(res ==  true)
//             {
//                 console.log("true");
//             }
//             else if(res == false)
//             {
//                 console.log("false");
//             }
//         }
//     });

// p = sharad
// hihi
// yoyo