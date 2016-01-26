var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.friends = {};

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
    $('#chats').append("<div><span class='message'>"+_.escape(message.text)+
      "</span> - <span class='username'>" + _.escape(message.username) + "</span>"
      + "<span>"+  message.createdAt + "</span>" + "</div>");
  }
app.fetch = function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {order:'-createdAt',where: mainSettings.createdAfter},
      success: function(response){
        for (var i = 0; i < response.results.length; i++) {
          var found = false;
          $('option').each(function(item){
            if($(this).val()===response.results[i].roomname){
              found = true;
            }
          })
          if(!found){
            app.addRoom(response.results[i].roomname)
          }
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
    if(roomName){
      roomName = _.escape(roomName);
      $('#roomSelect').append("<option val=" + roomName + ">" + roomName + "</option>");
    }
  }
  $('#roomSelect').change(function(){
    var selected = $('#roomSelect').val();
    if(selected === 'newRoom'){
      var newRoom = prompt('Enter a new room name');
      app.addRoom(newRoom);
      $('#roomSelect').val(newRoom);
    }
    app.clearMessages();
    //get messages for currently selected room
  })

  app.addFriend = function(username){
    if(!username in app.friends){
      app.friends[username] = true;
    }
  }
  $('#main').on('click', '.username',function(){
    app.addFriend($(this).val());
  });
  app.fetch();
});

