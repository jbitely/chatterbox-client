var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

$(document).ready(function(){

  var mainSettings = {
    limit: 50,
    createdAfter: JSON.stringify({createdAt:{"$gte":{"__type":"Date","iso":"2016-01-24T00:00:00"}}}),
    room: 'default'
  };

  var messageCache = {};
  var user = window.location.search.slice(10);

  app.init = function(){return};
  app.send = function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
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
  app.addMessage = function(message){
    $('#chats').append("<div>"+message.text+"</div>");
  }
  app.fetch = function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {limit: mainSettings.limit, where: mainSettings.createdAfter},
      success: function(response){
        for (var i = 0; i < response.results.length; i++) {
          if(!(response.results[i] in messageCache)){
            messageCache[response.results[i].objectId] = response.results[i];
          }
          app.addMessage(response.results[i]);
        };
      },
      error: function(){
        console.log('There was an error');
      }
    })
  }
  app.handleSubmit = function(){
    console.log('hi');
    //create message
    var message = {
      roomname: $('#roomSelect').val(),
      username: 'default',
      text: $('#message').val()
    }
    // post message
    app.send(message);
  }
  $('#send .submit').on('submit',function(event){
    event.preventDefault();
    app.handleSubmit();
  })
  app.clearMessages = function(){
    $('#chats').empty();
  }
  app.addRoom = function(roomName){
    $('#roomSelect').append("<option val=" + roomName + ">" + roomName + "</option>");
  }
  $('#roomSelect').change(function(){
    var selected = $('#roomSelect option:selected').val();
    if(selected === 'newRoom'){
      var newRoom = prompt('Enter a new room name');
      app.addRoom(newRoom);
      $('#roomSelect').val(newRoom);
    }
  app.clearMessages();
    //get messages for currently selected room
  })
});


