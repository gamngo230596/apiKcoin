var express = require('express');
var mongodb=require('mongodb');
var ObjectId=mongodb.ObjectId;
var axios= require('axios');
var router = express.Router();
setInterval(()=>{
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds137957.mlab.com:37957/datablocks';
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            const WebSocket = require('ws');
            const ws = new WebSocket('wss://api.kcoin.club/');
            ws.onopen = function () {
                    ws.send("Hey there!");  
            };
            ws.onmessage = function (result) {
                console.log(result.data);
                console.log(JSON.parse(result.data).data);
                if(JSON.parse(result.data).type.toString()==="block")
                {
                    var lengthTrans=JSON.parse(result.data).data.transactions.length;//tung cai
                //console.log(lengthTrans);
                var arrTransaction=[];
                for(var k=0;k<lengthTrans;k++)//2 1
                {
                    var lengthOutput=JSON.parse(result.data).data.transactions[k].outputs.length;
                    var arrOutput=[];
                    for(var p=0;p<lengthOutput;p++)//1 lan 2 10
                    {
                        var objOut={
                            "index":p,
                            "lockScript":JSON.parse(result.data).data.transactions[k].outputs[p].lockScript,
                            "value":JSON.parse(result.data).data.transactions[k].outputs[p].value
                        }
                        arrOutput.push(objOut);

                    }
                   //console.log(arrOutput);
                    var obj={"hash":JSON.parse(result.data).data.transactions[k].hash,
                        "input":JSON.parse(result.data).data.transactions[k].inputs,
                        "outputs":arrOutput
                    }
                    arrTransaction.push(obj);
                }
                //console.log(arrTransaction);
                var model={
                    "hash":JSON.parse(result.data).data.hash,
                    "transactions":arrTransaction
                }
                db.collection("blocks").insertOne(model, function(err3, result) {
                    if (err)
                        console.log(err3);
                    else
                        console.log("1 documents inserted");
                });  
                }
                
                
                
            };   
        }
    });
    
},30000);
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

router.get('/transactionRev', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://taichau:taichau123@ds249737.mlab.com:49737/kcoindeposits';
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
            var collection = db.collection('deposits');
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

router.post('/transactionRev', function(req, res,next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://taichau:taichau123@ds249737.mlab.com:49737/kcoindeposits'; 
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            var myobj = { "idwallet":req.body.idwallet, "deposits":req.body.deposits};
            db.collection("deposits").insertOne(myobj, function(err, result) {
                if (err)
                    res.send(err);
                else
                    res.send("1 documents inserted");
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
    console.log(req.body);
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
                    address=respone.data.address;
                    privatekey=respone.data.privateKey;
                    publickey=respone.data.publicKey;
                    var myobj = { "idwallet":req.body.idwallet,"email": req.body.email,"password":req.body.password,"firstname":req.body.firstname,"lastname":req.body.lastname,"active":0,"actualbalance":0,"availablebalance":0,"address":address,"privatekey":privatekey,'publickey':publickey};
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
    var url = 'mongodb://NgoGam:gam23051996@ds241737.mlab.com:41737/kcointransactions';
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
            db.collection("trans").removeOne(myobj, function(err, result) {
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
            console.log(req.body);
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
router.post('/transactionsHis', function(req, res,next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds241737.mlab.com:41737/kcointransactions';
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            var myobj = { "addressmain":req.body.addressmain,"address": req.body.address,"date":getDate(),"status":req.body.status,"confirm":false,"money":req.body.money};
                db.collection("trans").insertOne(myobj, function(err, result) {
                    if (err)
                        res.send(err);
                    else
                        res.send("1 documents inserted");
                    db.close();
                });
        }
    });
});
router.put('/updatestatus/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds241737.mlab.com:41737/kcointransactions';
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

            var newobj={$set:{"status":req.body.status,"confirm":true}};
            
           db.collection("trans").updateOne(myobj, newobj, function(err, result) {
                if (err) res.send(err);
                else
                    res.send("1 document updated");
                db.close();
            });

        }
    });
});

router.put('/updateactual/:id', function(req, res, next) {
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
            var newobj={$set:{"actualbalance":req.body.actual}};
            db.collection("user").updateOne(myobj, newobj, function(err, result) {
                if (err) res.send(err);
                else
                    res.send("1 document updated");
                db.close();
            });

        }
    });
});
router.put('/updateavailable/:id', function(req, res, next) {
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

            var newobj={$set:{"availablebalance":req.body.newavailable}};
            
           db.collection("user").updateOne(myobj, newobj, function(err, result) {
                if (err) res.send(err);
                else
                    res.send("1 document updated");
                db.close();
            });

        }
    });
});

router.get('/balance/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds137957.mlab.com:37957/datablocks';
    var temp=[];
    var balance=[];
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            var address='ADD '+req.params.id.toString();
            var query = {"transactions.outputs.lockScript":{$all:[address]}};
            var balance=[];
            db.collection("blocks").find(query).toArray(function(err, result) {
                if (err) throw err;
                var resultLength=result.length;
               
                var transactionsID;
                var index;
                var money;
                var obj;
                
                for(var k=0;k<resultLength;k++)///3
                {
                     var transactionLength=result[k].transactions.length;
                    for(var i=0;i<transactionLength;i++){
                    var outputsLength=result[k].transactions[i].outputs.length;
                        for(var j=0;j<outputsLength;j++){
                            if(result[k].transactions[i].outputs[j].lockScript===address)
                            {
                                transactionsID=result[k].transactions[i].hash;
                                index=result[k].transactions[i].outputs[j].index;
                                money=result[k].transactions[i].outputs[j].value;
                                obj=result[k].transactions[i].hash;
                                
                                var myobj={"hash":obj,"money":money,"index":index};
                                temp.push(myobj);   

                            }
                        }
                    }
                  
                }
                
                 db.close();
                
            });

           
        }
    });
    setTimeout(()=>{
         MongoClient.connect(url, function (err1, db1)
        {
        if(err1)
        {
            console.log('Unable to connect to server',err1);
        }
        else
        {
            console.log('Connection established to', url);
            temp.map((data)=>{
                var query2 = {"transactions.input.referencedOutputHash":{$all:[data.hash]},"transactions.input.referencedOutputIndex":{$all:[data.index]}};
                db1.collection("blocks").find(query2).toArray(function(err2, result2) {
                if (err2) throw err2;
                if(result2.length===0)
                { 
                    balance.push(data);
                    res.json(balance);
                }
            });
            });

            
            
         db1.close();
           
        }

    });
         
    },3000);

});
router.get('/money/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds137957.mlab.com:37957/datablocks';
    var temp=[];
    var balance=[];
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            var address='ADD '+req.params.id.toString();
            var query = {"transactions.outputs.lockScript":{$all:[address]}};
            var balance=[];
            db.collection("blocks").find(query).toArray(function(err, result) {
                if (err) throw err;
                var resultLength=result.length;
               
                var transactionsID;
                var index;
                var money;
                var obj;
                
                for(var k=0;k<resultLength;k++)///3
                {
                     var transactionLength=result[k].transactions.length;
                    for(var i=0;i<transactionLength;i++){
                    var outputsLength=result[k].transactions[i].outputs.length;
                        for(var j=0;j<outputsLength;j++){
                            if(result[k].transactions[i].outputs[j].lockScript===address)
                            {
                                transactionsID=result[k].transactions[i].hash;
                                index=result[k].transactions[i].outputs[j].index;
                                money=result[k].transactions[i].outputs[j].value;
                                obj=result[k].transactions[i].hash;
                                
                                var myobj={"hash":obj,"money":money,"index":index};
                                temp.push(myobj);   

                            }
                        }
                    }
                  
                }
                
                 db.close();
                
            });

           
        }
    });
    setTimeout(()=>{
         MongoClient.connect(url, function (err1, db1)
        {
        if(err1)
        {
            console.log('Unable to connect to server',err1);
        }
        else
        {
            console.log('Connection established to', url);
            temp.map((data)=>{
                var query2 = {"transactions.input.referencedOutputHash":{$all:[data.hash]},"transactions.input.referencedOutputIndex":{$all:[data.index]}};
                db1.collection("blocks").find(query2).toArray(function(err2, result2) {
                if (err2) throw err2;
                if(result2.length===0)
                { 
                    balance.push(data);
                    //res.json(balance.money);
                }
            });
            });

            
            
         db1.close();
           
        }
        setTimeout(()=>{
            var money=0;
            balance.map((data)=>{
                money+=data.money;
            })
            res.send(""+money);
        },2000);

    });
         
    },3000);

});

router.get('/getblocks', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds137957.mlab.com:37957/datablocks';
    MongoClient.connect(url, function (err, db)
    {
        if(err)
        {
            console.log('Unable to connect to server',err);
        }
        else
        {
            console.log('Connection established to', url);
            axios.get('https://api.kcoin.club/blocks')
            .then(function(respone1){
                var total=respone1.headers['x-total-count'];
                var length=Math.floor(total/100);
                var q=0;
                for(var i=0;i<length+1;i++)//1400 100 200 300 400 500 600 700 800 900 1000 1100 1200 1300 1400 
                {
                    axios.get('https://api.kcoin.club/blocks?offset='+q)
                    .then(function(respone2){
                        for(var j=0;j<respone2.data.length;j++){//100
                            var lengthTrans=respone2.data[j].transactions.length;//tung cai

                            var arrTransaction=[];
                            for(var k=0;k<lengthTrans;k++)//2 1
                            {
                                var lengthOutput=respone2.data[j].transactions[k].outputs.length;
                                var arrOutput=[];
                                for(var p=0;p<lengthOutput;p++)//1 lan 2 10
                                {
                                    var objOut={
                                        "index":p,
                                        "lockScript":respone2.data[j].transactions[k].outputs[p].lockScript,
                                        "value":respone2.data[j].transactions[k].outputs[p].value
                                    }
                                    arrOutput.push(objOut);

                                }
                               //console.log(arrOutput);
                                var obj={"hash":respone2.data[j].transactions[k].hash,
                                    "input":respone2.data[j].transactions[k].inputs,
                                    "outputs":arrOutput
                                }
                                arrTransaction.push(obj);
                            }
                            //console.log(arrTransaction);
                            var model={
                                "hash":respone2.data[j].hash,
                                "transactions":arrTransaction
                            }
                            db.collection("blocks").insertOne(model, function(err3, result) {
                                if (err)
                                    console.log(err3);
                                else
                                    console.log("1 documents inserted");
                            });  
                        }
                        
                    })
                    .catch(function(err2){
                        console.log(err2);
                    });
                    var temp=q;
                    q=q+100;
                    if(q>total && temp<total) {
                        q=temp+(total-temp);
                    }
                    else if(q>total)
                    {
                        res.send("inserted!");
                    }
                }
            })
            .catch(function(err1){
                console.log(err1)
            });
            
        }
    });
    res.send("inserted!");
});
router.get('/gettransaction/:id', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds241737.mlab.com:41737/kcointransactions';
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
            var collection = db.collection('trans');
            collection.find({"addressmain":req.params.id.toString()}).toArray(function (err, result) {
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
router.get('/gettransaction', function(req, res, next) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://NgoGam:gam23051996@ds241737.mlab.com:41737/kcointransactions';
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
            var collection = db.collection('trans');
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
router.get('/getunconfirm/:id', function(req, res, next) {
    axios.get('https://api.kcoin.club/unconfirmed-transactions')
    .then(function(respone){
        var address=req.params.id;
        var resultLength=respone.data.length;
        var result=[];
        for(var i=0;i<resultLength;i++)
        {
            var outputsLength=respone.data[i].outputs.length;
            for(var j=0;j<outputsLength;j++)
            {
                 if(respone.data[i].outputs[j].lockScript==="ADD "+address)
                 {
                    result.push(respone.data[i]);
                 }
            }
           
        }
        res.json(result);
    })
    .catch(function(error){
        console.log(error);
    });
});

router.post('/withdrawal', function(req, res,next) {
    let destinations=req.body.addressreceived;
    let inputaddress=req.body.address;
    var key;
    axios.get('https://api-kcoin.herokuapp.com/api/admin')
    .then(function(res){
        res.data.map((data)=>{
            for(var i=0;i<res.data.length;i++)
            {
                if(data.address===inputaddress)
                {
                    key={"address":data.address,"privateKey":data.privatekey,"publicKey":data.publickey};
                }
            }
        });
            
    })
    .catch(function(err){
        console.log(err);
    });
    setTimeout(()=>{
    let referenceOutputsHashes = [];
    var arrOutput=[];
    axios.get('http://localhost:3000/api/admin/balance/'+key.address)
    .then(function(res){
        res.data.map((data)=>{
            arrOutput.push(data);
        });
    })
    .catch(function(err){
        console.log(err);
    });
        
        setTimeout(()=>{
            if(arrOutput.length!==0)
            {
            const BOUNTY = parseInt(req.body.money);//tien gui
            let sum=0;
            let fund=0;
            let check=0;
            for(var i=0;i<arrOutput.length;i++)
            {
                fund+=arrOutput[i].money;
            }
            arrOutput.map((data)=>{
                referenceOutputsHashes.push(data);
            });
            let change = fund - BOUNTY;
           
            // Generate transacitons
            let bountyTransaction = {
              version: 1,
              inputs: [],
              outputs: []
            };

            let keys = [];

            referenceOutputsHashes.forEach(hash => {
              bountyTransaction.inputs.push({
                referencedOutputHash: hash.hash,
                referencedOutputIndex: hash.index,
                unlockScript: ''
              });
            });

            // Change because reference output must be use all value
            bountyTransaction.outputs.push({
              value: change,
              lockScript: 'ADD ' + key.address
            });
            // Output to all destination 10000 each

              bountyTransaction.outputs.push({
                value: BOUNTY,
                lockScript: 'ADD ' + destinations
              });


            // Sign
            //console.log(bountyTransaction);
            sign(bountyTransaction, key);

            // Write to file then POST https://api.kcoin.club/transactions
            console.log(JSON.stringify(bountyTransaction));
           axios.post(' https://api.kcoin.club/transactions',bountyTransaction,{
                 headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(function(respone){
                console.log(respone);
            })
            .catch(function(err){
                console.log(err)
            });
            }
        },5000);
       
        
    },5000);
    
    
    

            
    res.send('123');
});


let getDate=function(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}
  // Convert a transaction to binary format for hashing or checking the size
  let toBinary = function (transaction, withoutUnlockScript) {
    let version = Buffer.alloc(4);
    version.writeUInt32BE(transaction.version);
    let inputCount = Buffer.alloc(4);
    inputCount.writeUInt32BE(transaction.inputs.length);
    let inputs = Buffer.concat(transaction.inputs.map(input => {
      // Output transaction hash
      let outputHash = Buffer.from(input.referencedOutputHash, 'hex');
      // Output transaction index
      let outputIndex = Buffer.alloc(4);
      // Signed may be -1
      outputIndex.writeInt32BE(input.referencedOutputIndex);
      let unlockScriptLength = Buffer.alloc(4);
      // For signing
      if (!withoutUnlockScript) {
        // Script length
        unlockScriptLength.writeUInt32BE(input.unlockScript.length);
        // Script
        let unlockScript = Buffer.from(input.unlockScript, 'binary');
        return Buffer.concat([ outputHash, outputIndex, unlockScriptLength, unlockScript ]);
      }
      // 0 input
      unlockScriptLength.writeUInt32BE(0);
      return Buffer.concat([ outputHash, outputIndex, unlockScriptLength]);
    }));
    let outputCount = Buffer.alloc(4);
    outputCount.writeUInt32BE(transaction.outputs.length);
    let outputs = Buffer.concat(transaction.outputs.map(output => {
      // Output value
      let value = Buffer.alloc(4);
      value.writeUInt32BE(output.value);
      // Script length
      let lockScriptLength = Buffer.alloc(4);
      lockScriptLength.writeUInt32BE(output.lockScript.length);
      // Script
      let lockScript = Buffer.from(output.lockScript);
      return Buffer.concat([value, lockScriptLength, lockScript ]);
    }));
    return Buffer.concat([ version, inputCount, inputs, outputCount, outputs ]);
  };

  // Sign transaction
  let sign = function (transaction, keys) {
    let message = toBinary(transaction, true);
    transaction.inputs.forEach((input, index) => {
      //let key = key[index];
      let signature = sign2(message, keys.privateKey);
      // Genereate unlock script
      input.unlockScript = 'PUB ' + keys.publicKey + ' SIG ' + signature;
    });
  };
  let sign2 = function (message, privateKeyHex) {
    const HASH_ALGORITHM = 'sha256';
    var ursa=require('ursa');
    // Create private key form hex
    let privateKey = ursa.createPrivateKey(Buffer.from(privateKeyHex, 'hex'));
    // Create signer
    let signer = ursa.createSigner(HASH_ALGORITHM);
    // Push message to verifier
    signer.update(message);
    // Sign
    return signer.sign(privateKey, 'hex');
  };

module.exports = router;