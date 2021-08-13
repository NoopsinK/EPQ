var players = []

function Player(id, x, y, isTagged, isImmune){
  this.id = id
  this.x = x
  this.y = y
  this.isTagged = isTagged
  this.isImmune = isImmune
}
//import express - this var is a function that makes an express app
var express = require('express')
//the resulting app
var app = express()

//listen for messages on the port 3000
var server = app.listen(3000)

//host everything in the 'public' directory so clients can see them
app.use(express.static('public'))

//import socket
var socket = require('socket.io')

//create a socket var that keeps track of incoming and outgoing messages
//that is created within our server
var io = socket(server)

setInterval(pulse, 20)

function pulse() {
  io.sockets.emit('pulse', players)
}
 /*
//new connection event - will pass the socket as an argument into the function
io.sockets.on('connection', newConnection)

//what should be done when we get a new visitor
function newConnection(socket){
  //log the new client's id to the terminal
  console.log('New Connection: ' + socket.id)

  socket.on('info', infoMsg)

  function infoMsg(data){
    //rebroadcast data to every client except the one who sent this message
    socket.broadcast.emit('info', data)
    for (let i = 0;)
    //console.log(data)
  }
}
*/

io.sockets.on(
  'connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log('New Connection: ' + socket.id)

    socket.on('start', function(data) {
      var player = new Player(socket.id, data.x, data.y, data.isTagged, data.isImmune)
      //first player in is it
      if (players.length === 0){
        player.isTagged = true
      }
      players.push(player)
    })

    socket.on('update', function(data) {

      for (let i = 0; i < players.length; i++) {
        if (players[i].id === socket.id) {
          players[i].x = data.x
          players[i].y = data.y
          players[i].isTagged = data.isTagged
          players[i].isImmune = data.isImmune
        }
      }
    })

    socket.on('disconnect', function() {
      console.log('Client has disconnected');
    })
  }
)

console.log("socket server is running :)")
