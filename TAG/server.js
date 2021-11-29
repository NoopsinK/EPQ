var aPORT = process.env.PORT || 3000;
//import express - this var is a function that makes an express app
var express = require('express')
//the resulting app
var app = express()

var players = []

function Player(id, x, y, isTagged, isImmune){
  this.id = id
  this.x = x
  this.y = y
  this.isTagged = isTagged
  this.isImmune = isImmune
}

//check if this component has collided with the given other component
function hasCollided(player1, player2, radius1, radius2){
  //take the centres, then check if the distance
  //is less than the sum of the two radii
  var xdistance = player1.x - player2.x
  var ydistance = player1.y - player2.y
  var distance = Math.sqrt( Math.pow(xdistance,2) + Math.pow(ydistance,2))

  if (distance < (radius1) + (radius2)){
    return true
  } else {
    return false
  }
}


//listen for messages on the port 3000
var server = app.listen(aPORT)

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
        console.log('Tagging first guest...')
      }

      //send id and tag info to this player
      var data = {
        id: socket.id, //could also be player.isTagged?
        isTagged: player.isTagged
      }

      io.to(socket.id).emit('info', data)
      players.push(player)
    })

    socket.on('update', function(data) {

      var thisPlayer = {
        id: null,
        x: null,
        y: null,
        isTagged: null,
        isImmune: null
      }
      var thisPlayerIndex = 0
      for (let i = 0; i < players.length; i++) {
        if (players[i].id === socket.id) {
          //console.log('Setting thisPlayer')
          /*
          thisPlayer = players[i]
          thisPlayer.x = data.x
          thisPlayer.y = data.y
          thisPlayer.isTagged = data.isTagged
          thisPlayer.isImmune = data.isImmune
          */
          players[i].x = data.x
          players[i].y = data.y
          players[i].isTagged = data.isTagged
          players[i].isImmune = data.isImmune

          thisPlayerIndex = i

          thisPlayer.id = data.id
          thisPlayer.x = data.x
          thisPlayer.y = data.y
          thisPlayer.isTagged = data.isTagged
          thisPlayer.isImmune = data.isImmune
        }
      }
      var lastTagged = null
      //check if anyone is tagged at all, then tag the last tagged
      var noneTagged = true

      while (noneTagged === true){
        for (let i = 0; i < players.length; i++){
          if (players[i].isTagged = true){
            noneTagged = false
          }
        }
      }

      //check for collisions, tag accordingly
      for (let i = 0; i < players.length; i++){
        if (players[thisPlayerIndex].id != players[i].id){
          if (hasCollided(players[thisPlayerIndex], players[i], 30, 30)){
            /* COLLISION + TAG/IMMUNITY LOGS
            console.log('collision')
            console.log('thisPlayer.isTagged: ' + players[thisPlayerIndex].isTagged)
            console.log('thisPlayer.isImmune: ' + players[thisPlayerIndex].isImmune)
            console.log('players[i].isTagged: ' + players[i].isTagged)
            console.log('players[i].isImmune: ' + players[i].isImmune)
            */
            //check which of the two is currently tagged, then tag the other
            if (players[thisPlayerIndex].isTagged === true && players[i].isImmune === false){
              //change x and y pos to prevent immediate re-tagging?
              console.log('tagging!')
              players[thisPlayerIndex].isImmune = true
              players[thisPlayerIndex].isTagged = false
              players[i].isTagged = true
              players[i].isImmune = true

              //set the tagged player to lastTagged
              lastTagged = players[i]

              //wait 5 seconds, then remove immunity - should make into subroutine?
              setTimeout(function(){
                console.log('removing immunity')
                players[i].isImmune = false
                players[thisPlayerIndex].isImmune = false
              }, 10000)

            } else if (players[i].isTagged === true && players[thisPlayerIndex].isImmune === false){

              console.log('tagging!')
              players[i].isImmune = true
              players[thisPlayerIndex].isTagged = true
              players[i].isTagged = false
              players[thisPlayerIndex].isImmune = true

              //set the tagged player to lastTagged
              lastTagged = players[thisPlayerIndex]

              setTimeout(function(){
                console.log('removing immunity')
                players[i].isImmune = false
                players[thisPlayerIndex].isImmune = false
              }, 10000)

            }
          }
        }
      }

      if (noneTagged === true){
        lastTagged.isTagged = true
      }

    })

    socket.on('disconnect', function() {
      console.log('Client has disconnected');
    })
  }
)

console.log("server is up :)")
