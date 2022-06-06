class RainDrop {
  constructor() {
    this.pos = createVector(random(0, width), random(-1000, -10));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = random(0.01, 0.1);

    this.z = random(0, 20);

    this.yspeed = map(this.z, 0, 20, 2, 5);

    // this.x = random(0, width);
    // this.y = random(-1000, -100);

    this.length = map(this.z, 0, 20, 8, 13);

    this.rainWidth = map(this.z, 0, 20, 1, 5);

    this.gravity = map(this.z, 0, 20, 0, 0.1);

    this.mass = map(this.z, 0, 20, 0.03, 0.05);
    
    this.angle = 0;
  }

  applyForce(force, angle) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f); //add. ADDS all the forces applied together
    this.angle = angle
  }

  update() {
    this.yspeed = this.yspeed + this.gravity;
    this.vel = createVector(0, this.yspeed);
    if (this.pos.y > height) {
      this.pos.y = random(-600, -10);
      this.yspeed = map(this.z, 0, 10, 2, 5);
    }
    
    if (this.pos.x > width){
        this.pos.x = this.pos.x - width
        }
    if (this.pos.x < 0){
      this.pos.x = this.pos.x + width
    }

    this.vel.add(this.acc); //adds acc vector to vel vector
    this.pos.add(this.vel); //adds vel vector to pos vector
    this.acc.set(0, 0); //sets the acceleration vector to 0 at the end of every frame, i.e. if the force goes away it should go back to 0
  
  }

  show() {
    push()
    stroke(232, 241, 255, 200);
    //stroke(39, 80, 214);
    strokeWeight(this.rainWidth);
    push();
    translate(this.pos.x, this.pos.y);
    this.angle = this.vel.heading();
    pop();
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.length);
    pop()
    
  }
}
