const express = require('express');
const http = require('http');
const websocket = require('ws');
const roslib = require('roslib')

const port = 5070;
const rosport = 9090;
const roshost = "10.2.1.172"

const app = express();

const server = http.createServer(app);

const wss = new websocket.Server({server});

const allConnection = []

const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws){
    ws.on('message',function (message){
        console.log('receive ')
        a += 1
    })
})


// rest section

app.get('/testserv',(req,res)=>{
    const customers = [
        {comment : "Server running normally.  " + a}
    ];
    res.json(customers);
});

app.post('/connect',(req,res) => {
    const clientip = req.body.ip;
})









server.listen(port,() => console.log('Server started on port : ' + port));















/*
// ros section
const ros = new roslib.Ros({
    url : 'ws://' + roshost + ':' + rosport
});

ros.on('connection',function(){
    console.log('Connected to RosBridge.')
});

ros.on('error',function(error){
    console.log("RosBridge Connection Error : " + error)
});

ros.on('close', function() {
    console.log('End connection to RosBridge server.');
});

var listener = new roslib.Topic({
    ros : ros,
    name : 'chatter',
    messageType : 'std_msgs/String'
});


listener.subscribe(function(message) {
    console.log('Received message on ' + listener.name + ': ' + message.data);
});
*/