class SpringVid {
  constructor() {
    this.k = 0.01;
    this.tile = createVector(0, 0);
    this.velocity = createVector(0, 0);
    
    this.rectSize = 50
    this.mass = random(0.1, 4);
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.velocity.add(f);
  }

  update() {
    let force = p5.Vector.sub(this.tile); //creates a vector that points from 0, 0 to objects position
    let x = force.mag(); //calculates the displacement(mag) of the object from 0, 0
    force.normalize(); //normalizes the force vector to unit length of 1
    force.mult(-1 * this.k * x); //hookes law equation to calculate the spring force on the object
    this.velocity.add(force); //adds force to velocity
    this.tile.add(this.velocity); //adds velocity to tile
    this.velocity.mult(0.95); //friction. Velocity is reduced each time draw is called
  }
  
  show(x, y, video) {
    noStroke();
    fill(video);
    rect(this.tile.x + x, this.tile.y + y, this.rectSize, this.rectSize);
  }
}
