class Particle {
  //constructor setting initial particle attributes
  constructor() {
    this.pos = createVector(
      random(windowWidth / 2 - 10, windowWidth / 2 + 10),
      random(0, windowHeight)
    ); //initial position of particles set along the middle of the screen
    this.vel = createVector(random(-2, 2), random(-2, 2)); //slight initial velocity of particles
    // this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = random(0.1, 1.2); //(0.5, 2);
    this.r = 4;
    this.colour = color(20);
    this.colourCobweb = color(230);
    //this.colour = color(random(255), random(255), random(255));
  }

  //friction function
  friction() {
    this.vel.mult(0.99); //shrinks the velocity each frame by * by 0.99
  }

  //simulates a drag force on the particles as they gain velocity,
  //could also be achieved by placing a limit on the velocity.
  //however, this slows the particles more 'naturally' as the velocity increases, rather than accelerating up to a point
  drag() {
    //direction of drag force
    let drag = this.vel.copy();
    drag.normalize();
    drag.mult(-1);

    //magnitude of drag force
    let coefficientofdrag = 0.001;
    let speedSq = this.vel.magSq();
    drag.setMag(coefficientofdrag * speedSq);

    this.applyForce(drag);
  }

  //creates an apply force function into which different external forces can be passed
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f); //add. ADDS all the forces applied together
  }

  //scoring function that adds a score based on if a particle has exited the window
  //also returns true/false
  scoreRHS() {
    if (this.pos.x >= width + this.r) {
      print("yes!!!!!");
      scoreRHS += 1; //score +1

      this.pos.x = random(width / 2 - 50, width / 2 + 50);

      return this.pos.x >= width + this.r;
      // return gives true if the statement is correct and flase if it is no longer a correct statement
      // +radius so as to have particle not dissapear before it leaves the screen
    }
  }

  //scoring function that adds a score based on if a particle has exited the window
  //also returns true/false
  scoreLHS() {
    if (this.pos.x <= 0 - this.r) {
      print("yessir!!");
      scoreLHS += 1; //score +1

      this.pos.x = random(width / 2 - 50, width / 2 + 50);

      return this.pos.x <= 0 - this.r;
      //-radius so as to have particle not dissapear before it leaves the screen
    }
  }

  //edges function makes particles reverse their x,y velocities (by * by -1) if they touch the edge of the window
  edgesTopBot() {
    if (this.pos.y >= windowHeight - this.r) {
      this.pos.y = windowHeight - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y <= 0 + this.r) {
      this.pos.y = 0 + this.r;
      this.vel.y *= -1;
    }
  }
  
  edgeScore(){
    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;

      print("ok!");
      score += 1;
    }
    if (this.pos.x <= 0 + this.r) {
      this.pos.x = 0 + this.r;
      this.vel.x *= -1;

      print("alright33333");
      score += 1;
    }
  }
  
  edgeScore2(){
    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;

      print("ok!");
      score2 += 1;
    }
    if (this.pos.x <= 0 + this.r) {
      this.pos.x = 0 + this.r;
      this.vel.x *= -1;

      print("alright33333");
      score2 += 1;
    }
  }
  
  //edges function, separated from TopBot edges function to be used for scoring
  edgeScoreRHS() {
    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;

      print("score!");
      scoreRHS += 1;
    }
  }

  edgeScoreLHS() {
    if (this.pos.x <= 0 + this.r) {
      this.pos.x = 0 + this.r;
      this.vel.x *= -1;

      print("SCOREEEEEEEEE");
      scoreLHS += 1;
    }
  }

  //   collision() {
  //     for (let i = 0; i < bubbles.length; i++); {
  //       let d = dist(this.pos.x, this.pos.y, bubbles[i].pos.x,   bubbles[i].pos.y)
  //       if (d < this.r + bubble[i].r && this.index !== i) {
  //       this.vel.x *= -1;
  //       this.vel.y *= -1;

  //       fill(255, 0, 0)
  //       print('collision!')

  //       break //illegal break???
  //       } else {
  //         fill(0)
  //       }
  //     }
  //   }

  //update updates the position of the particles every frame
  update(reset) {
    if (reset == true) {
      this.pos = createVector(
        random(windowWidth / 2 - 10, windowWidth / 2 + 10),
        random(0, windowHeight)
      );
      this.vel = createVector(random(-2, 2), random(-2, 2));
      this.mass = random(0.1, 1.2);
    }

    this.vel.add(this.acc); //adds acc vector to vel vector
    this.pos.add(this.vel); //adds vel vector to pos vector
    this.acc.set(0, 0); //sets the acceleration vector to 0 at the end of every frame, i.e. if the force goes away it should go back to 0
  }

  //show draws the object on the screen
  show(showVal) {
    if (showVal == 1) {
      strokeWeight(0);
      fill(this.colour);

      push();
      translate(this.pos.x, this.pos.y);
      this.angle = this.vel.heading();
      rotate(this.angle);
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      pop();
    }

    if (showVal == 2) {
      push();
      strokeWeight(1);
      stroke(220);
      fill(this.colourCobweb, 100);
      translate(this.pos.x, this.pos.y);
      this.angle = this.vel.heading();
      rotate(this.angle);
      circle(this.r, this.r, this.r - 3.5);
      pop();
    }
    
    if (showVal == 3) {
      strokeWeight(0);
      fill(this.colour);

      push();
      translate(this.pos.x, this.pos.y);
      this.angle = this.vel.heading();
      rotate(this.angle);
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      pop();
    }

    // circle(this.pos.x, this.pos.y, this.r * 2); //magnitude and direction of final vector is stored in pos which can be used to set the x and y values
  }
}
