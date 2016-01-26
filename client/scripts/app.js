var app = {};

$(document).ready(function(){

  var mainSettings = {
    limit: 50,
    createdAfter: JSON.stringify({createdAt:{"$gte":{"__type":"Date","iso":"2016-01-24T00:00:00"}}}),
    endpoint:'https://api.parse.com/1/classes/chatterbox',
    room: 'default'
  }
  var messageCache = {};
  var user = window.location.search.slice(10);

  app.init = function(){return};
  app.send = function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: mainSettings.endpoint,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  };

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

  $('.input button').on('click',function(event){
    event.preventDefault();
    //create message
    var message = {
      roomname: 'default',
      username: 'default',
      text: $('.input textarea').val()
    }
    // post message
    app.send(message);
  })

  $('.rooms').change(function(){
    var selected = $('.rooms option:selected').val();
    if(selected === 'newRoom'){
      var newRoom = prompt('Enter a new room name');
      $('.rooms').append("<option val=" + newRoom + ">" + newRoom + "</option>");
      $('.rooms').val(newRoom);
    }
  })
});


