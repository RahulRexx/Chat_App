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
    //    users.removeUser(socket.id);
    //    users.addUser(socket.id,received_data.name,received_data.room);
    //    io.to(received_data.room).emit('updateUserList',users.getUserList(received_data.room));
       socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
       socket.broadcast.to(received_data.room).emit('newMessage', generateMessage('Admin', `${received_data.name} has joined the room`));

        callback();

    });

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
        // var user = users.removeUser(socket.id);
        // console.log(user);
        // if(user)
        // {
        //     io.to(user.room).emit('updateUserList',users.getUserList(user.room));
        //     io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room`));
        // }
    })
});



server.listen(port,()=> {
    console.log('server started at port 3000');
});