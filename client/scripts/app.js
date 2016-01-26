
var messageCache = [];
var getMessages = $.ajax({
    url:'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function(response){
      for (var i = 0; i < response.results.length; i++) {
        messageCache.push(response.results[i]);
      };
    },
    error: function(){
      console.log('There was an error');
    }
  });
getMessages.done(function(){console.log(messageCache);});
