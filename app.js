const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const dataDocOBJID = '618bd9723e5394334136e5a4';
const DB_URI = 'mongodb+srv://admin:Vi1cu8aoQW44LsjD@cluster0.nlsfg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const port = process.env.PORT || '5000';

setInterval(()=>{
    var randomAppliedWalletsNumber = Math.floor(Math.random()*5)+4; // min:4 max:8
    MongoClient.connect(DB_URI, (error, client)=>{
        if(error)console.error(error);
        const db = client.db('main');
        db.collection('data').findOne({_id: ObjectId(dataDocOBJID)}).then(response=>{
            db.collection('data').updateOne({_id: ObjectId(dataDocOBJID)}, {$set: {
                walletsApplied: response.walletsApplied+randomAppliedWalletsNumber,
                coinsCountdown: response.coinsCountdown+(randomAppliedWalletsNumber*8)
            }}).then(result=>{
                console.log(result);
                client.close(); 
                console.log('updated!');
            }).catch(err=>console.error(err));
        }).catch(err=>console.error(err));
    });
}, 2700000);

app.use(require('cors')());

app.post('/getData', (req, res)=>{
    MongoClient.connect(DB_URI, (error, client)=>{
        if(error)console.error(error);
        const db = client.db('main');
        db.collection('data').findOne({_id: ObjectId(dataDocOBJID)}).then(response=>{
            console.log(response);
            client.close();
            response._id=undefined;
            res.send(response);
        }).catch(err=>console.error(err));
    });
});

app.listen(port);