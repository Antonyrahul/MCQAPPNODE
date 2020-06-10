const express = require('express');
const app = express();
const cors = require('cors')
const crypto = require('crypto')
const bodyparser = require('body-parser');
const mongodbclient = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt =  require("jsonwebtoken");
url = "mongodb+srv://antonyrahul96:antonyrahul96@cluster0-ficsj.mongodb.net/test?retryWrites=true&w=majority"/*"mongodb://localhost:27017/"*/
productdburl = "mongodb://localhost:27017/productDB";
usersdburl = "mongodb://localhost:27017/userDB";
studentsLoginDB = "studentsDB"
studentsCollection = "studentsCollection"
teachersLoginDB = "teachersDB"
teachersCollection = "teachersCollection"
questionDB = "questionDB"
questionCollection = "questionCollection"
answersheetsDB = "answersheetsDB"
answersheetscollection ="answersheetscollection"
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors())
dbName = "productDB"
dbCollection = "products"
userDB = "shoppinguserDB"
usersCollection = "userscollection"
app.post('/generateurl', function (req, res) {
   
    console.log(req.body);
    crypto.randomBytes(3,(err, buf) => {
        if (err) throw err;
        url = "antonyrahul.site/"+buf.toString('hex');
        
        res.json({
            message: "saved",
            url:url
        })
    })

})
app.get('/', function (req, res) {
  
   console.log("Connection from angular")

})
app.get('/generatetestid',function(req,res)
{
    crypto.randomBytes(3,(err, buf) => {
        if (err) throw err;
        var testid = buf.toString('hex');
        res.json({
            message: "saved",
            testid:testid
        
        })
       
})
})

app.post('/registeruser', function (req, res) {
    console.log(req.body);
    var collName = studentsCollection ;
    var dbName = studentsLoginDB;
    if(req.body.teacher)
    {
        collName = teachersCollection;
        dbName = teachersLoginDB
    }
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) throw err;
            var userData = {
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash
                
            }
            db.collection(collName).insertOne(userData, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved"
                })
            })
            // Store hash in your password DB.
        });

       // client.close();
    });

})

app.post('/loginuser', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var collName = studentsCollection ;
        var dbName = studentsLoginDB;
        if(req.body.teacher)
        {
            collName = teachersCollection;
            dbName = teachersLoginDB
        }
        
        var db = client.db(dbName);

            db.collection(collName).findOne({email:req.body.email}, function (err, data) {
                if(data)
                {
                if (err) throw err;
                bcrypt.compare(req.body.password, data.password, function(err, result) {
                    if(err) throw err;
                   
                    if(result == true)
                    {
                    console.log("logged in")
                    var jwtToken = jwt.sign({id:data.id},'qazwsxedcrfv')
                    client.close();
                    res.status(200).json({
                        message: "LOGGED IN",
                        jwttoken: jwtToken,
                        name : data.firstname,
                        email:data.email,
                        status :200
                    });
                    

                }
                    else{
                        client.close();
                        res.json({
                            message: "Incorrect password"
                        })
                    
                    console.log("wrong creds")
                    }
                });

                
                
            }
            else
            {
                client.close();
                res.json({
                    message : "Incorrect username"
                })
            }
            })
            // Store hash in your password DB.
        


    });

})

app.post('/savequestionpaper', function (req, res) {
   
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(questionDB);
        
            
          //  var userData = req.body
                
                
            
           db.collection(questionCollection).insertOne(req.body, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved"
                })
            })
            // Store hash in your password DB.
     

       // client.close();
    });

})
app.post('/saveanswersheet', function (req, res) {
   
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(answersheetsDB);
        
            
          //  var userData = req.body
                
                
            
           db.collection(answersheetscollection).insertOne(req.body, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved"
                })
            })
            // Store hash in your password DB.
     

       // client.close();
    });

})

app.post('/updateTestIdInStudentDB', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(studentsLoginDB);
        
            
            var filter ={
                email : req.body.email
                
            }
            console.log(filter)
          
            db.collection(studentsCollection).updateOne(filter,{$push:{teststaken:req.body.testid}}, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "sucess"
                })
            })
            // Store hash in your password DB.
    

       // client.close();
    });

})

app.post('/verifytesteligible', function (req, res) {
   
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(studentsLoginDB);
        
            
          //  var userData = req.body
                
                
            
           db.collection(studentsCollection).findOne(req.body, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved",
                    data:data.teststaken
                })
            })
            // Store hash in your password DB.
     

       // client.close();
    });

})





app.post('/getavailabletests', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(questionDB);
      
           
            
                
           
            db.collection(questionCollection).find(req.body).toArray(function (err, data) {
                console.log(data)
                if (err) throw err;
                client.close();
                if(data)
                res.json({
                    message: "sucess",
                    data:data
                })
                else{
                    res.json({
                        message: "failed"
                    })
                }
            })
            // Store hash in your password DB.
        

       // client.close();
    });

})

app.post('/gettakentests', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(answersheetsDB);
      
           
            
                
           
            db.collection(answersheetscollection).find(req.body).toArray(function (err, data) {
                console.log(data)
                if (err) throw err;
                client.close();
                if(data)
                res.json({
                    message: "sucess",
                    data:data
                })
                else{
                    res.json({
                        message: "failed"
                    })
                }
            })
            // Store hash in your password DB.
        

       // client.close();
    });

})

app.post('/getanswersheet', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(answersheetsDB);
      
           
            
                
           
            db.collection(answersheetscollection).findOne(req.body,function (err, data) {
                console.log(data)
                if (err) throw err;
                client.close();
                if(data)
                res.json({
                    message: "sucess",
                    data:data
                })
                else{
                    res.json({
                        message: "failed"
                    })
                }
            })
            // Store hash in your password DB.
        

       // client.close();
    });

})



app.post('/getquestionpaper', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(questionDB);
      
           
            
                
           
            db.collection(questionCollection).findOne(req.body,function (err, data) {
                console.log(data)
                if (err) throw err;
                client.close();
                if(data)
                res.json({
                    message: "sucess",
                    data:data
                })
                else{
                    res.json({
                        message: "failed"
                    })
                }
            })
            // Store hash in your password DB.
        

       // client.close();
    });

})



//process.env.PORT
app.listen(process.env.PORT, function () {

    console.log("listening on port 4123");
});

