//component object constructor
function component(id, width, height, mainColour, xpos, ypos, isTagged){
  this.id = id
  this.width = width
  this.height = height
  this.xpos = xpos
  this.ypos = ypos
  this.xspeed = 0
  this.yspeed = 0
  this.mainColour = mainColour
  this.displayColour = mainColour

  //istagged will actually always be initialised to false
  //something else will make this true for game starts later
  this.isTagged = isTagged
  this.isImmune = false

  //with each game area update, draw the components
  this.update = function() {
    //draw corresponding shape
    context = gameArea.context
    context.fillStyle = this.displayColour

    //circle: arc(x coord, y coord, radius, starting angle (rad), ending angle(rad))
    context.beginPath()
    context.arc(this.xpos, this.ypos, this.width, 0, 2 * Math.PI)
    context.fill()

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
}
