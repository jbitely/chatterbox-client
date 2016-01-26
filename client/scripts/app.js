var mainSettings = {
  limit: 50,
  createdAfter: JSON.stringify({createdAt:{"$gte":{"__type":"Date","iso":"2016-01-24T00:00:00"}}}),
  endpoint:'https://api.parse.com/1/classes/chatterbox',
  room: 'default'

}

var messageCache = {};

var getMessages = $.ajax({
    url: mainSettings.endpoint,
    type: 'GET',
    data: {limit: mainSettings.limit, where: mainSettings.createdAfter},
    success: function(response){
      for (var i = 0; i < response.results.length; i++) {
        if(!(response.results[i] in messageCache)){
          messageCache[response.results[i].objectId] = response.results[i];
        }
      };
    },
    error: function(){
      console.log('There was an error');
    }
  });

getMessages.done(function(){
  _.each(messageCache, function(message){
    $('.content').append("<div>"+message.text+"</div>");
  });
});
