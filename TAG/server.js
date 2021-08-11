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
    //console.log(data)
  }
}
console.log("socket server is running :)")
