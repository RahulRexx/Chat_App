 var socket = io();
 socket.on('connect', function () {
     console.log('connected to the server');
 });
 socket.on('disconnect', function ()  {
     console.log('server closed');
 });

 socket.on('newMessage' ,function (received_data) {
    // console.log('new message form server',received_data);
    

    var li = jQuery('<li></li>');
    li.text(`${received_data.from} : ${received_data.text}`);
    jQuery('#messages').append(li);
 });



 jQuery('#message-form').on('submit',function (e) {
     e.preventDefault();
     
     var textBox = jQuery('[name=message]');

     socket.emit('createMessage',{
         from : 'User',
         text: textBox.val()
     },function (data) {
         textBox.val('');
     });
     
 });

var userLocation = jQuery('#send-location');

userLocation.on('click',function() {
    
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser');
    }
    userLocation.attr('disabled','disabled').text('Sending  Location ...');
    navigator.geolocation.getCurrentPosition(function(position) {
        userLocation.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
        // console.log('clicked',position);
    },function( ) {
        userLocation.removeAttr('disabled').text('Send Location');
        alert('Cannot fetch the location');
    });

});

socket.on('newLocationMessage', function (data) {
    // console.log(data);
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current Location</a>');
    li.text(`${data.from} : `);
    a.attr('href',data.url);
    li.append(a);
    jQuery('#messages').append(li);
});