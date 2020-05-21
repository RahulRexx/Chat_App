var moment = require('moment');

var generateMessage = (from,text) => {
    return {
        from : from,
        text : text,
        createdAt : moment().format('LT')
    }
};

var generateLocationMessage = (from,latitude,longitude) => {
    return {
        from : from,
        url : `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt : moment().format('LT')
    }
};

module.exports =  {
    generateMessage : generateMessage,
    generateLocationMessage: generateLocationMessage
}