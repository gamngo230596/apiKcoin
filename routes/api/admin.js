var express = require('express');
var mongodb=require('mongodb');
var ObjectId=mongodb.ObjectId;
var axios= require('axios');
var router = express.Router();

/* GET students listing. */
router.get('/', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds163806.mlab.com:63806/userkcoin';
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);

            // Get the documents collection
            var collection = db.collection('user');
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(result);
                }
                //Close connection
                db.close();
            });
        }
    });
});

router.post('/', function(req, res,next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds163806.mlab.com:63806/userkcoin';
    var address;
    var privatekey;
    var publickey;
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            axios.get('https://api.kcoin.club/generate-address')
                .then(function(respone){
                    console.log(respone.data);
                    address=respone.data.address;
                    privatekey=respone.data.privateKey;
                    publickey=respone.data.publicKey;
                    var myobj = { "email": req.body.email,"password":req.body.password,"firstname":req.body.firstname,"lastname":req.body.lastname,"active":0,"actualbalance":0,"availablebalance":0,"address":address,"privatekey":privatekey,'publickey':publickey};
                    db.collection("user").insertOne(myobj, function(err, result) {
                        if (err)
                            res.send(err);
                        else
                            res.send("1 documents inserted");
                        db.close();
                    });
                        })
                        .catch(function(err){
                            console.log(err);
                        });
            

        }
    });
});

router.delete('/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds163806.mlab.com:63806/userkcoin';
    MongoClient.connect(url, function (err, db)
    {

        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);

            var myobj = { "_id": new ObjectId(""+req.params.id)};
            db.collection("user").removeOne(myobj, function(err, result) {
                if (err) res.send(err);
                else
                    res.send("1 document deleted");
                db.close();
            });

        }

    });
});
router.put('/active/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds163806.mlab.com:63806/userkcoin';
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);

            // Get the documents collection
            var myobj = { "_id": new ObjectId(""+req.params.id)};
            var newobj={$set:{"active":1}};
            db.collection("user").updateOne(myobj, newobj, function(err, result) {
                if (err) res.send(err);
                else
                    res.send("1 document updated");
                db.close();
            });

        }
    });
});
router.put('/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds163806.mlab.com:63806/userkcoin';
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);

            // Get the documents collection
            var myobj = { "_id": new ObjectId(""+req.params.id)};

            var newobj={$set:{"password":req.body.newpassword}};
            db.collection("user").updateOne(myobj, newobj, function(err, result) {
                if (err) res.send(err);
                else
                    res.send("1 document updated");
                db.close();
            });

        }
    });
});
module.exports = router;