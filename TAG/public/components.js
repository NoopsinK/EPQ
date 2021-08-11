//component object constructor
function component(id, width, height, mainColour, xpos, ypos, shape, isTagged){
  this.id = id
  this.width = width
  this.height = height
  this.xpos = xpos
  this.ypos = ypos
  this.xspeed = 0
  this.yspeed = 0
  this.mainColour = mainColour
  this.displayColour = mainColour
  this.shape = shape

  //istagged will actually always be initialised to false
  //something else will make this true for game starts later
  this.isTagged = isTagged
  this.isImmune = false

  //with each game area update, draw the components
  this.update = function() {
    //draw corresponding shape
    context = gameArea.context
    context.fillStyle = this.displayColour

    if (this.shape === "circle"){
      //circle: arc(x coord, y coord, radius, starting angle (rad), ending angle(rad))
      context.beginPath()
      context.arc(this.xpos, this.ypos, this.width, 0, 2 * Math.PI)
      context.fill()
    } else if (this.shape === "rect"){
      context.fillRect(this.xpos, this.ypos, this.width, this.height)
    }
  }
  this.newPos = function() {
    //update positions based on speed values
    this.xpos += this.xspeed
    this.ypos += this.yspeed

    //check if border is hit
    if (
      (this.xpos+this.width >= gameArea.canvas.width) ||
      (this.xpos-this.width <= 0)) {
        this.xpos -= this.xspeed
      }
    if (
      (this.ypos+this.height >= gameArea.canvas.height) ||
      (this.ypos-this.height <= 0)) {
        this.ypos -= this.yspeed
      }

  }

  //check if this component has collided with the given other component
  this.hasCollided = function(otherX, otherY, otherR){
    //rectangle collision
    /*
    var myLeft = this.xpos
    var myRight = this.xpos + (this.width)
    var myTop = this.ypos
    var myBottom = this.ypos + (this.height)

    var otherLeft = otherComp.xpos
    var otherRight = otherComp.xpos + (otherComp.width)
    var otherTop = otherComp.ypos
    var otherBottom = otherComp.ypos + (otherComp.height)

    if (
      (myBottom < otherTop) ||
      (myTop > otherBottom) ||
      (myRight < otherLeft) ||
      (myLeft > otherRight)){
        return true
    } else {
      return false
    }
    */

    //for circles - take the centres, then check if the distance
    //is less than the sum of the two radii
    var xdistance = this.xpos - otherX
    var ydistance = this.ypos - otherY
    var distance = Math.sqrt( Math.pow(xdistance,2) + Math.pow(ydistance,2))

    if (distance < (this.width) + (otherR)){
      return true
    } else {
      return false
    }
  }
}
