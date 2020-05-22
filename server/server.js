//built-ins
const path = require('path'); 
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const {isValidStringValue} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
var app = express();
var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');

var users = new Users();

app.use(express.static(publicPath));

var server = http.createServer(app);

var io = socketIO(server);

io.on('connection',(socket)=> {
    console.log("new client connected");

    socket.on('join',(received_data,callback) => {
       if( !(isValidStringValue(received_data.name) && isValidStringValue(received_data.room) ))
       {
            return  callback('Enter valid value');
       }

       socket.join(received_data.room);

       users.removeUser(socket.id);

       var newuser = users.addUser(socket.id,received_data.name,received_data.room);
    //    console.log(newuser);

       io.to(received_data.room).emit('updateUserList',users.getUserList(received_data.room));
       socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
       socket.broadcast.to(received_data.room).emit('newMessage', generateMessage('Admin', `${received_data.name} has joined the room`));

        callback();

    });

    socket.on('createMessage',  (received_data,callback) => {
        console.log('createMessage from client',received_data);
        var user = users.getUser(socket.id);

        if (user && isValidStringValue(received_data.text))
        {
            io.to(user.room).emit('newMessage', generateMessage(user.name, received_data.text));
        }

        
        callback();

    });

    socket.on('createLocationMessage',(position) => {
        var user = users.getUser(socket.id);
        if(user)
        {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, position.latitude, position.longitude));
        }
        

    });
   
    socket.on('disconnect',() => {
        console.log('client disconnected');
        var user = users.removeUser(socket.id);
        // console.log(user,socket.id);
        if(user)
        {
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room`));
        }
    })
});



server.listen(port,()=> {
    console.log('server started at port 3000');
});