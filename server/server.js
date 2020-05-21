//built-ins
const path = require('path'); 
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
var app = express();
var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);

io.on('connection',(socket)=> {
    console.log("new client connected");

    
    
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new User joined the chat room'));

    socket.on('createMessage',  (received_data,callback) => {
        console.log('createMessage from client',received_data);

        io.emit('newMessage', generateMessage(received_data.from, received_data.text));
        callback();

    });

    socket.on('createLocationMessage',(position) => {
        io.emit('newLocationMessage', generateLocationMessage('AdminLoc', position.latitude, position.longitude));

    });
   
    socket.on('disconnect',() => {
        console.log('client disconnected');
    })
});



server.listen(port,()=> {
    console.log('server started at port 3000');
});