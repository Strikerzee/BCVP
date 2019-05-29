const   mysql = require('mysql');
const bcrypt = require('bcrypt');
var app = require('express')();
// let bodyparser = require('body-parser');
var saltrounds = 10;

// let urlencodedparser = bodyparser.urlencoded({extended: false});
// let jsonencodedparser = bodyparser.json();

// app.options('/login', (req, res)=>{
//     res.set('Access-Control-Allow-Methods', 'OPTIONS, POST');
//     res.set('Access-Control-Allow-Origin', '*');
//     res.set('Access-Control-Allow-Headers', 'Content-Type');
//     res.send();
// })

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

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

function set_token_null(obj,resp)
{
    
    connection.query("update People set token = NULL where VoterID = ?",obj,(err,rows) => {
        if(err)
         throw err;
        else
         resp.send("token did not match logging out\n");
    })
}

function generate_token(obj,resp,dash) {
    bcrypt.hash(obj,saltrounds,function(err,hash)
    {
        if(err)
        {
            resp.send("error while generating token\b");
            throw err;
            
        }
        else
        {
            var sql = "update People set token = ? where VoterID = " + obj;
            connection.query(sql,hash,(error,rows) => {
                if(error)
                {
                    throw error;
                    
                }
                else
                {
                    if(dash == false)
                    {
                        resp.send(hash);
                    }
                    else
                    {
                        query_for_candidates = "select * from Candidates"
                        connection.query(query_for_candidates,(er,row) =>{
                            if(er)
                            {
                                throw er;
                                
                            }
                            else
                            {
                                row.push({
                                    token: hash
                                });
                                resp.send(row);
                            }
                        })
                    }
                }
            })
           
        }
    })
}

app.get('/',function(req,resp){
    var hi = "5568"
    var sql = "select * from People where VoterID = ?";
    connection.query(sql, hi, (err,rows,fields) => {
        if(err)
        {
            // connection.release();
            console.log("hihihihihi");
            resp.send(err);  
        }
        else{
            if(isEmpty(rows))
             {
                 console.log("VoterID or Passwor")
             }
        }
    });
    
    
});


app.get('/login',function(req,resp){
    
    var id =  req.query.id;
    var password = req.query.password;
    console.log(password);
    var sql = "select * from People where VoterID = " +  id;
    connection.query(sql, (error,rows,fields) => {
        if(!!error){
            throw error;
            
        }
        else
        {
           if(isEmpty(rows))
           {
               console.log("Voter ID does not exist");
               resp.send("Voter ID does not exist\n");
           }
           else
           {
                hash = rows[0].Password;
                bcrypt.compare(password, hash, function(err, res) 
                    {
                        if(err)
                        {
                            console.log(err);
                        }    
                        else
                        {
                            if(res ==  true)
                            {
                                console.log("User is logged in");
                                // resp.send("user is logged in\n");
                                 generate_token(id,resp,false);                              
                                
                            }
                            else if(res == false)
                            {
                                console.log("password is wrong");
                                resp.send("password is wrong\n");
                            }
                        }
                    });
            }
        }
    });
});

app.get('/submit',function(req,resp){
    var id = req.query.id;
    var token =  req.query.token;
    var sql2 =  "select token from People where VoterID = ?" ;
    var sql1 = "update People set Voted = 1 where VoterID = ?";
    connection.query(sql2,id,(error,rows,fields) => {
        if(error)
        {
            console.log(error);
        }
        else if(isEmpty(rows))
        {
            console.log("wrong Voter id");
            resp.send("wrong Voter id\n");
        }
        else
        {
            var o_token = rows[0].token;
            if(o_token == null)
            {
                resp.send("token did not match logged out\n");
            }
            else if( token.trim() == o_token.toString())
            {
                connection.query(sql1,id,(error,rows) => {
                    console.log("user has voted");

                });
                console.log("token matched");    
                generate_token(id,resp,false);
                
            }
            else
            {
                set_token_null(id,resp);
                console.log("token did not match"); 

            
            }

        }
    });
})

app.get('/dashboard',function(req,resp){
    var id = req.query.id;
    var token =  req.query.token;
    var sql2 =  "select token from People where VoterID = ?";
    connection.query(sql2,id,(error,rows,fields) => {
        if(error)
        {
            console.log(error);
        }
        else if(isEmpty(rows))
        {
            console.log("wrong Voter id");
            resp.send("wrong Voter id\n");
        }
        else
        {
            var o_token = rows[0].token;
            if(o_token == null)
            {
                
                set_token_null(id,resp);
            }
            else if( token.trim() == o_token.toString())
            {
                
                console.log("token matched");    
                generate_token(id,resp,true);
                
            }
            else
            {
                set_token_null(id,resp);
                console.log("token did not match"); 
            }

        }
    });
})
app.listen(4000);