 var socket = io();


 function scrollToBottom () {
     var message = jQuery('#messages');
     var newMessage = message.children('li:last-child');

     var clientHeight = message.prop('clientHeight');
     var scrollTopi = message.prop('scrollTop');
     var scrollHeight = message.prop('scrollHeight');
     var newMessageHeight = newMessage.innerHeight();
     var lastMessageHeight = newMessage.prev().innerHeight();
     
     if (clientHeight + scrollTopi + newMessageHeight + lastMessageHeight >= scrollHeight)
     {
         message.scrollTop(scrollHeight);     //scrollTop is a jQuery method
     }
 }


 socket.on('connect', function () {
     console.log('connected to the server');
     var value = jQuery.deparam(window.location.search);
    //  console.log(val);
     socket.emit('join',value,function (err) {
         if(err)
         {
             alert(err);
             window.location.href ='/';
         }
     });
 });

 socket.on('disconnect', function ()  {
     console.log('server closed');
 });

socket.on('newMessage' ,function (received_data) {

    var formattedTime = moment().format('LT');
    var template = jQuery('#message-template').html();
    var html=Mustache.render(template,{
        text : received_data.text,
        from : received_data.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
 });

 socket.on('updateUserList', function (received_data) {
     console.log(received_data);
     var ol = jQuery('<ol></ol>');
     received_data.forEach( function (user) {
         ol.append(jQuery('<li></li>').text(user));
     });
     jQuery('#users').html(ol); //= ol;

 });


 jQuery('#message-form').on('submit',function (e) {
     e.preventDefault();
     
     var textBox = jQuery('[name=message]');

     socket.emit('createMessage',{
        //  from : 'User',
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

socket.on('newLocationMessage', function (received_data) {
    // console.log(data);
    var formattedTime = moment().format('LT');
    

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        url : received_data.url,
        from : received_data.from,
        createdAt : formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});