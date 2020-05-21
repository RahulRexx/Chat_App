var generateMessage = (from,text) => {
    return {
        from : from,
        text : text,
        createdAt : new Date()
    }
};

var generateLocationMessage = (from,latitude,longitude) => {
    return {
        from : from,
        url : `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt : new Date()
    }
};

module.exports =  {
    generateMessage : generateMessage,
    generateLocationMessage: generateLocationMessage
}