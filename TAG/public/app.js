//DOM content loaded? VV

//define game area object and initialise in function start game VV

//create constructor for components (OOP!) VV

//update game area 50 times per second
//this function is where random movement will be (for bots) VV

//controls VV

//for multiple pressed keys, add a keys array and set the corresponding
//keys to true for as long as they're pressed VV fix diagonal movement
//"cannot set property for (16/17) undefined on line 113?" - in eventlistener
//for keyup - changing smth in pressedKeys array to false

//for collisions, the update game area function will need to loop
//through each obstacle and check for a collision
//there might be a better way to do this? VV

//^^ also need a property for counting frames and executing something
//at a given frame rate

//page, elements, movement
document.getElementById("startBtn").addEventListener("DOMContentLoaded", startGame)
//document.getElementById("multiBtn").addEventListener("DOMContentLoaded", startMultiGame)

var player
var players = []
var socket

//keyCodes, all in one place
const leftKey = 37
const rightKey = 39
const upKey = 40
const downKey = 38

const aKey = 65
const dKey = 68
const wKey = 87
const sKey = 83

//key bools
var leftB
var rightB
var upB
var downB

var aB
var dB
var wB
var sB

var objects = []

function startGame() {
  //hide start button and start start canvas
  document.getElementById("startBtn").style.display="none";
  document.getElementById("startCanvas").style.display="none";
  gameArea.start()

  socket = io.connect()

  //create new component for player, at the canvas center
  player = new component(socket.id, 30, 30, "green", 375, 250, false)
  //enemy = new component(30, 30, "blue", 375, 450, "circle", true)
  //players.push(player)

  //message to send to server
  var data = {
    id: player.id,
    x: player.xpos,
    y: player.ypos,
    isTagged: player.isTagged,
    isImmune: player.isImmune
  }

  console.log('Start, immune? ' + player.isImmune)

  socket.emit('start', data)

  //sync local players array with the server's with each pulse
  socket.on('pulse', function(data){
    players = data
    //console.log('received pulse')
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === player.id) {
        player.isTagged = players[i].isTagged
        player.isImmune = players[i].isImmune
      }
    }
  })

  //listen for info
  socket.on('info', function(data){
    player.id = data.id
    player.isTagged = data.isTagged
    console.log('My id: ' + player.id)
    console.log("I'm tagged? " + player.isTagged)
  })

}

//this will happen the most
function updateGameArea() {
  //will need to pass values received from the server as arguments
  /*
  //check for collisions, tag accordingly
  if (player.hasCollided(eneimes[i].xpos, enemies[i].ypos, enemies[i].width)){
    //check which of the two is currently tagged, then tag the other
    if (player.isTagged === true &&
      player.isImmune === false &&
      enemy.isImmune === false){
      //change x and y pos to prevent immediate re-tagging?
      player.isTagged = false
      enemy.isTagged = true
      enemy.isImmune = true
      player.isImmune = true

      //wait 5 seconds, then remove immunity - should make into subroutine?
      setTimeout(() => {
        enemy.isImmune = false
        player.isImmune = false
      }, 5000)
    } else if (enemy.isTagged === true &&
      player.isImmune === false &&
      enemy.isImmune === false){
      player.isTagged = true
      enemy.isTagged = false
      enemy.isImmune = true
      player.isImmune = true

      setTimeout(() => {
        enemy.isImmune = false
        player.isImmune = false
      }, 5000)
    }
  }
  */


  //each client only checks if they themselves are tagged
  if (player.isTagged) {
    player.displayColour = "red"
  } else {
    player.displayColour = player.mainColour
  }

  //reset stoofs
  gameArea.clear()
  player.xspeed = 0
  player.yspeed = 0

  //player movement
  //check which key bools are true and change speed accordingly
  if (leftB === true){
    player.xspeed = -1
  }
  if (rightB === true){
    player.xspeed = 1
  }
  if (upB === true){
    player.yspeed = 1
  }
  if (downB === true){
    player.yspeed = -1
  }

  //calculate new positions
  player.newPos()

  //redraw all players
  for (let i = 0; i < players.length; i++){

    //draw corresponding shape
    context = gameArea.context

    if (players[i].id === player.id){
      if (player.isTagged === true){
        context.fillStyle = "red"
        console.log('tagged')
      } else {
        context.fillStyle = "green"
        console.log('free')
      }
      //console.log('drawing self')
    } else {
      if (players[i].isTagged === true){
        context.fillStyle = "red"
      } else {
        context.fillStyle = "blue"
      }
      //console.log('drawing enemy')
    }

    //circle: arc(x coord, y coord, radius, starting angle (rad), ending angle(rad))
    context.beginPath()
    //width is 30
    context.arc(players[i].x, players[i].y, 30, 0, 2 * Math.PI)
    context.fill()

  }
  //player.update()

  //message to send to server
  var data = {
    id: player.id,
    x: player.xpos,
    y: player.ypos,
    isTagged: player.isTagged,
    isImmune: player.isImmune
  }

  //send message - name, data
  socket.emit('update', data)
  console.log('Immune? ' + player.isImmune)
}

//draw canvas and add element to html
var gameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 750;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");

    //insert canvas into body? into html
    document.body.insertBefore(this.canvas, document.body.childNodes[0])
    //update the game area every 20 milliseconds
    this.interval = setInterval(updateGameArea, 20)

    //eventlistener for keydown
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === leftKey){
        leftB = true
      }
      if (e.keyCode === rightKey){
        rightB = true
      }
      if (e.keyCode === upKey){
        upB = true
      }
      if (e.keyCode === downKey){
        downB = true
      }

      if (e.keyCode === aKey){
        aB = true
      }
      if (e.keyCode === dKey){
        dB = true
      }
      if (e.keyCode === wKey){
        wB = true
      }
      if (e.keyCode === sKey){
        sB = true
      }
    })

    //eventlistener for keyup
    window.addEventListener('keyup', function(e) {
      if (e.keyCode === leftKey){
        leftB = false
      }
      if (e.keyCode === rightKey){
        rightB = false
      }
      if (e.keyCode === upKey){
        upB = false
      }
      if (e.keyCode === downKey){
        downB = false
      }

      if (e.keyCode === aKey){
        aB = false
      }
      if (e.keyCode === dKey){
        dB = false
      }
      if (e.keyCode === wKey){
        wB = false
      }
      if (e.keyCode === sKey){
        sB = false
      }
    })
  },
  //object method to reset the canvas
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
