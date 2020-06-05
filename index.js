const express = require('express');
const app = express();
const cors = require('cors')
const crypto = require('crypto')
const bodyparser = require('body-parser');
const mongodbclient = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt =  require("jsonwebtoken");
url = /*"mongodb+srv://antonyrahul96:antonyrahul96@cluster0-nl7jd.mongodb.net/test?retryWrites=true&w=majority"*/"mongodb://localhost:27017/"
productdburl = "mongodb://localhost:27017/productDB";
usersdburl = "mongodb://localhost:27017/userDB";
studentsLoginDB = "studentsDB"
studentsCollection = "studentsCollection"
teachersLoginDB = "teachersDB"
teachersCollection = "teachersCollection"
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
   //mongodb+srv://antonyrahul96:<password>@cluster0-jjxyl.mongodb.net/test?retryWrites=true&w=majority
//mongodb+srv://antonyrahul96:<password>@cluster0-nl7jd.mongodb.net/test?retryWrites=true&w=majority
   //"mongodb://localhost:27017/productDB"
   //mongodb+srv://antonyrahul96:<password>@cluster0-nl7jd.mongodb.net/test?retryWrites=true&w=majority
/*mongodbclient.connect(url, function (err, client) {
    if (err) throw err;
    var db = client.db("productDB");
    
        
        var userData = {
            id:"mobile2",
            name:"Iphone 10",
            category:"mobiles",
            price : "INR 110,000",
            imgsrc : "https://www.appsquadz.com/blog/wp-content/uploads/2016/12/iPhone-Apps.png",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!"
            
        }
        db.collection("products").insertOne(userData, function (err, data) {
            if (err) throw err;
            client.close();
            res.json({
                message: "saved"
            })
        })
        // Store hash in your password DB.
  

   // client.close();
});*/
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
                        res.status(401).json({
                            message: "Incorrect password"
                        })
                    
                    console.log("wrong creds")
                    }
                });

                
                
            }
            else
            {
                client.close();
                res.status(401).json({
                    message : "Incorrect username"
                })
            }
            })
            // Store hash in your password DB.
        


    });

})

app.post('/displayproducts', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        useUnifiedTopology: true
        if (err) throw err;
        var db = client.db(dbName);
     
            if(Object.keys(req.body).length === 0)
            {
                db.collection(dbCollection).find({}).toArray(function (err, data) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "saved",
                        data:data
                    })
                })
            }
            else{
            userdata = req.body
           // db.collection(dbCollection).findOne(userData,{projection: {expense:true}}, function (err, data) {
            db.collection(dbCollection).find(userdata).toArray(function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved",
                    data:data
                })
            })
        }
            // Store hash in your password DB.
        

       // client.close();
    });

})

app.post('/addproduct', function (req, res) {
   
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        
            
          //  var userData = req.body
                
                
            
           db.collection(dbCollection).insertOne(req.body, function (err, data) {
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

app.post('/editproduct', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        
            
            var filter ={
                productid : req.body.productid
                
            }
            console.log(filter)
          
            db.collection(dbCollection).updateOne(filter,{$set:req.body}, function (err, data) {
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

app.post('/verifyproduct', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
      
           
            
                
           
            db.collection(dbCollection).findOne(req.body,function (err, data) {
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
app.listen(4123, function () {

    console.log("listening on port 4123");
});

/*
 editProduct(data):Observable<any>{
    console.log(data)
    return this.http.post('http://localhost:4123/editproduct',data)
  }

  verifyProduct(data):Observable<any>{
    console.log(data)
    return this.http.post('http://localhost:4123/verifyproduct',data)
  }
  */
 /*
 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://antonyrahul96:<password>@cluster0-nl7jd.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/