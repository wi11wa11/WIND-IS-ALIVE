//william wallis //05/06/1999
//Computational Prototyping //RMIT university
//formatted to be viewed with word wrap (wrap text) off
//need to download and run p5.serial applet for use with arduino and sensors
//p5.serial stuff will only work in CHROME browser, the p5.serial applet cannot communicate with other stuff

let bgAlpha = 255;
let bgCol = 220;
let mode = 0;

//fonts---------------------------
let boldFont;
let regFont;
let italicFont;

//GUI---------------------------------------
let gui;

//wind particle variables-----------------------
let particles = [];
let scoreRHS = 0;
let scoreLHS = 0;
let score = 0;
let score2 = 0;
let num = 50;
let showVal = 1;
// let xoff = 0;

//vid capture variables------------------
let springVid = [];
let spacer = 50;
let xoff = 0;
let capture;

//p5.serial variables--------------------
let serial;
let latestData = "waiting for data";

//rainDrops-------------------------------------
let d = [];
let dropnum = 500;

let rainCount = 0;
let rainCountLimit = 48; //48 matches screen refresh rate? to animate the particles in cobwebs()

//gotData function for p5.serial----------------------
function gotData() {
  let currentString = serial.readLine(); //store the data in a variable
  trim(currentString); //get rid of whitespace values
  if (!currentString) return; // if there's nothing in there, ignore it <-- if there is no data ignore the data? unsure what this does
  console.log(currentString); // print it out
  latestData = currentString; // save it to the global variable
}
//preload-----------------------------
function preload() {
  boldFont = loadFont("Roboto-Bold.ttf");
  regFont = loadFont("Roboto-Regular.ttf");
  italicFont = loadFont("Roboto-Italic.ttf");
}
//setup--------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  //rainDrops---------------------------------------------------------------------
  for (let i = 0; i < dropnum; i++) {
    d[i] = new RainDrop();
  }
  

  //video capture------------------------------------------------------------------
  capture = createCapture(VIDEO); //initiates video capture
  capture.hide(); //hides video from screen
  for (let i = 0; i < windowWidth; i += spacer) {
    springVid[i] = [];
    for (let j = 0; j < windowHeight; j += spacer) {
      springVid[i][j] = new SpringVid();
    }
  } //nested for loop creates a new springVid object along the x and y axis of the window

  //p5.serial-----------------------------------------------------------------------
  serial = new p5.SerialPort();
  serial.list();
  serial.open("COM5");
  serial.on("data", gotData);

  //particles-----------------------------------------------------------------------
  for (let i = 0; i < num; i++) {
    particles[i] = new Particle();
  }
  
  //GUI-----------------------------------------------------------------------------
  gui = createGui();

  if (mode == 0) {
    homeScreenSetup();
  }
  textFont(regFont);
}

//draw----------------------------------------------
function draw() {
  
  buttonPressed();

  if (mode == 0) {
    background(bgCol, bgAlpha); 
    drawGui();
    homeScreenDraw(); //home screen graphics function
    b.visible = true;
    b2.visible = true;
    b3.visible = true;
    b4.visible = true;
  } //HOMESCREEN

  if (mode == 1) {
    background(bgCol, bgAlpha);
    drawGui();
    b.visible = false;
    b2.visible = false;
    b3.visible = false;
    b4.visible = false;
    b5.visible = true;

    bgCol = 220;
    bgAlpha = 100
    windParticles(); //contains particle class functions
    scoreAndRemove();
    vectorKeyBindings(); //eastwest wind function with 'a' and 'd'
    vectorData();
  } //KATABATIC

  if (mode == 2) {
   
    background(bgCol, bgAlpha);
    
    drawGui();
    b.visible = false;
    b2.visible = false;
    b3.visible = false;
    b4.visible = false;
    b5.visible = true;
    
    bgCol = 20;
    bgAlpha = 100;
    windParticles(); //contains particle class functions
    vectorKeyBindings(); //eastwest wind function with 'a' and 'd'
    scoreAndBounce(2);
    vectorData();
  } //COBWEBS

  if (mode == 3) {
    
    background(bgCol, bgAlpha);
    
    drawGui();
    b.visible = false;
    b2.visible = false;
    b3.visible = false;
    b4.visible = false;
    b5.visible = true;

    bgCol = 220;
    windParticles(); //contains particle class functions
    vectorKeyBindings(); //eastwest wind function with 'a' and 'd'
    scoreAndBounce(3);
    vectorData();
  } //SINGLEPLAYER

  if (mode == 4) {
    
    background(bgCol, bgAlpha);
    
    drawGui();
    b.visible = false;
    b2.visible = false;
    b3.visible = false;
    b4.visible = false;
    b5.visible = true;

    bgCol = 0;
    windParticles(); //contains particle class functions
    vectorKeyBindings(); //eastwest wind function with 'a' and 'd'
    scoreAndBounce();
    vectorData();
  } //verynormal

  //vectorData(); //vector function with anemometer

  //p5.serial data printed to sketch------
  fill(0, 0, 0);
  textSize(50);
  //text(latestData, 100, 100);

  if (latestData > 1){
    push();
    fill(255, 0, 0);
    circle(20, 20, 10)
    pop();
  }
}

function windParticles() {
  // bgAlpha = 100;
  for (let i = 0; i < particles.length; i++) {
    particles[i].edgesTopBot();
    particles[i].update();
    particles[i].show(showVal);
    particles[i].friction();
    particles[i].drag();

    if (b.isPressed) {
      scoreRHS = 0;
      scoreLHS = 0;
      showVal = 1;
      for (let i = 0; i < particles.length; i++) {
        let reset = true;
        particles[i].update(reset); //resets the initial position, velocity and mass each button press
      }
    }
    if (b2.isPressed) {
      scoreRHS = 0;
      scoreLHS = 0;
      showVal = 2;
      for (let i = 0; i < num; i++) {
        let reset = true;
        particles[i].update(reset);
      }
    }
    if (b3.isPressed) {
      scoreRHS = 0;
      scoreLHS = 0;
      showVal = 1;
      for (let i = 0; i < particles.length; i++) {
        let reset = true;
        particles[i].update(reset);
      }
    }
    if (b4.isPressed) {
      scoreRHS = 0;
      scoreLHS = 0;
      for (let i = 0; i < particles.length; i++) {
        let reset = true;
        particles[i].update(reset);
      }
    }
  } //for loop running the particles class
}

function vectorData() {
  for (let i = 0; i < particles.length; i++) {
    
    if (latestData <= 1) {
      let windWest = createVector(0, 0); // no wind
      particles[i].applyForce(windWest);
      d[i].applyForce(windWest);
      
      // fill(255, 0, 0);
      // circle(width / 2, height / 2, 50); // I used shapes and colours to test if statements were working
    } else if (latestData <= 5) {
      let windWest = createVector(0.005, 0); //light wind value
      particles[i].applyForce(windWest);
        
      n = random(-0.005, 0.005); //light wind value
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom);

      // fill(0, 255, 0);
      // circle(width / 2, height / 2, 75);
    } else if (latestData <= 10) {
      let windWest = createVector(0.01, 0); //gentle wind value
      particles[i].applyForce(windWest);
      d[i].applyForce(windWest);
      
      n = random(-0.01, 0.01); //gentle wind value
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom);

      // fill(0, 0, 255);
      // circle(width / 2, height / 2, 100);
    } else if (latestData <= 15) {
      let windWest = createVector(0.05, 0); //moderate wind value
      particles[i].applyForce(windWest);

      n = random(-0.05, 0.05); //moderate wind value
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom);

      // fill(255, 0, 0);
      // rect(width / 2, height / 2, 150, 150);
    } else if (latestData <= 20) {
      let windWest = createVector(0.1, 0); //high wind value
      particles[i].applyForce(windWest);

      n = random(-0.1, 0.1); //high wind value
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom);

      // fill(255, 255, 0);
      // rect(width / 2, height / 2, 150, 150);
    } else if (latestData <= 25) {
      let windWest = createVector(0.15, 0); //strong wind value
      particles[i].applyForce(windWest);

      n = random(-0.15, 0.15); //strong wind value
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom);

      // text("WOOOOOOOO", width / 2, height / 2);
      // fill(255, 255, 0);
      // rect(width / 2, height / 2, 150, 150);
    } else if (latestData > 25) {
      let windWest = createVector(0.2, 0); //adjust vector for very strong wind
      particles[i].applyForce(windWest);

      n = random(-0.2, 0.2); //adjust vector for very strong wind
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom);
    }
  }
}

function vectorDataVid() {
  for (let i = 0; i < springVid.length; i++) {
    for (let j = 0; j < springVid.length; j++){
      
    if (latestData <= 1) {
      let windWest = createVector(0, 0); // no wind
      springVid[i][j].applyForce(windWest);

      // fill(255, 0, 0);
      // circle(width / 2, height / 2, 50); // I used shapes and colours to test if statements were working
    } else if (latestData <= 5) {
      let windWest = createVector(0.005, 0); //light wind value
      springVid[i][j].applyForce(windWest);

      n = random(-0.005, 0.005); //light wind value
      let windRandom = createVector(0, n);
      springVid[i][j].applyForce(windWest);

      // fill(0, 255, 0);
      // circle(width / 2, height / 2, 75);
    } else if (latestData <= 10) {
      let windWest = createVector(0.01, 0); //gentle wind value
      springVid[i][j].applyForce(windWest);

      n = random(-0.01, 0.01); //gentle wind value
      let windRandom = createVector(0, n);
      springVid[i][j].applyForce(windWest);

      // fill(0, 0, 255);
      // circle(width / 2, height / 2, 100);
    } else if (latestData <= 15) {
      let windWest = createVector(0.05, 0); //moderate wind value
      springVid[i][j].applyForce(windWest);

      n = random(-0.05, 0.05); //moderate wind value
      let windRandom = createVector(0, n);
      springVid[i][j].applyForce(windWest);

      // fill(255, 0, 0);
      // rect(width / 2, height / 2, 150, 150);
    } else if (latestData <= 20) {
      let windWest = createVector(0.1, 0); //high wind value
      springVid[i][j].applyForce(windWest);

      n = random(-0.1, 0.1); //high wind value
      let windRandom = createVector(0, n);
      springVid[i][j].applyForce(windWest);

      // fill(255, 255, 0);
      // rect(width / 2, height / 2, 150, 150);
    } else if (latestData <= 25) {
      let windWest = createVector(0.15, 0); //strong wind value
      springVid[i][j].applyForce(windWest);

      n = random(-0.15, 0.15); //strong wind value
      let windRandom = createVector(0, n);
      springVid[i][j].applyForce(windWest);

      // text("WOOOOOOOO", width / 2, height / 2);
      // fill(255, 255, 0);
      // rect(width / 2, height / 2, 150, 150);
    } else if (latestData > 25) {
      let windWest = createVector(0.2, 0); //adjust vector for very strong wind
      springVid[i][j].applyForce(windWest);

      n = random(-0.2, 0.2); //adjust vector for very strong wind
      let windRandom = createVector(0, n);
      springVid[i][j].applyForce(windWest);
    }
  }
}
}

function vectorDataRain() {
  for (let i = 0; i < d.length; i++) {
    if (latestData <= 1) {
      let windWest = createVector(0, 0); // no wind
      let rainAngle = 0.3;
      d[i].applyForce(windWest, rainAngle);
    } else if (latestData <= 5) {
      let windWest = createVector(0.005, 0); //light wind value
      let rainAngle = -0.3;
      d[i].applyForce(windWest, rainAngle);
    } else if (latestData <= 10) {
      let windWest = createVector(0.01, 0); //gentle wind value
      let rainAngle = 0.3;
      d[i].applyForce(windWest, rainAngle);
    } else if (latestData <= 15) {
      let windWest = createVector(0.05, 0); //moderate wind value
      let rainAngle = 0.3;
      d[i].applyForce(windWest, rainAngle);
    } else if (latestData <= 20) {
      let windWest = createVector(0.1, 0); //high wind value
      let rainAngle = 0.3;
      d[i].applyForce(windWest, rainAngle);
    } else if (latestData <= 25) {
      let windWest = createVector(0.15, 0); //strong wind value
      let rainAngle = 0.3;
      d[i].applyForce(windWest, rainAngle);
    } else if (latestData > 25) {
      let windWest = createVector(0.2, 0); //adjust vector for very strong wind
      let rainAngle = 0.3;
      d[i].applyForce(windWest, rainAngle);
    }
  }
}

function vectorKeyBindings() {
  for (let i = 0; i < particles.length; i++) {
    if (keyIsPressed && key == "d") {
      let windWest = createVector(0.1, 0);
      particles[i].applyForce(windWest); //westerly wind force on particles

      // xoff += 0.01
      // n = map(noise(xoff), 0, 1, -0.2, 0.2) //using perlin noise to apply random north south wind force
      //the noise seems to always trends to the negative and moves the particles as a flock, does not have the random effect I am after
      //doing something wrong here?

      n = random(-0.2, 0.2);
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom); //random north south wind force on particles
    } //if 'd' is pressed then a wind force is applied from the west

    if (keyIsPressed && key == "a") {
      let windEast = createVector(-0.1, 0);
      particles[i].applyForce(windEast); //easterly wind force on particles

      n = random(-0.2, 0.2);
      let windRandom = createVector(0, n);
      particles[i].applyForce(windRandom); //random north south wind force on particles
    } //if 'a' is pressed then a wind force is applied from the east
  }
}

function scoreAndRemove() {
  //originally used splice to scoreAndRemove particles from the array when scoreRHS/LHS was true
  //this meant that for other modes there would be no more particles in the particles array
  //instead of making a separate array I decided to reset the position of the particles back the the center
  //I think that this is better as it allows for more competitive gameplay opportunities
  //when removing the particles (with num = 50) the player who got more than half would win
  //this made the rest of the particles useless and the gamemode feel unfinished
  //now players can play to a high score or time limit

  if (scoreRHS < 200 && scoreLHS < 200) {
    textSize(20);
    text("score " + scoreRHS, width - 150, height - 50); //score text
    text("score " + scoreLHS, 0 + 50, height - 50);
  }

  if (scoreRHS >= 200 && scoreLHS < 200) {
    scoreLHS -= 50;
    push();
    strokeWeight(2);
    stroke(0);
    fill(150, 150, 150, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2, 500, 200, 10); //would be nice to have rect and text fade in 
    pop();
    
    push();
    textSize(30);
    textAlign(CENTER, CENTER);
    textFont(boldFont);
    text("The Westerly Wind Prevails!", width / 2, height / 2 - 25);
    textSize(12);
    text("(player one wins)", width / 2, height / 2 + 3);
    textSize(17);
    textFont(italicFont);
    text("MAY THE WINDS BE EVER IN YOUR FAVOUR", width / 2, height / 2 + 25);
    pop();
  }

  if (scoreLHS >= 200 && scoreRHS < 200) {
    scoreRHS -= 50;
    push();
    strokeWeight(2);
    stroke(0);
    fill(150, 150, 150, 150);
    rectMode(CENTER);
    rect(width / 2, height / 2, 500, 200, 10);
    pop();
    push();
    textSize(30);
    textAlign(CENTER, CENTER);
    textFont(boldFont);
    text("The Easterly Wind Prevails!", width / 2, height / 2 - 25);
    textSize(12);
    text("(player one wins)", width / 2, height / 2 + 3);
    textSize(17);
    textFont(italicFont);
    text("MAY THE WINDS BE EVER IN YOUR FAVOUR", width / 2, height / 2 + 25);
    pop();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].scoreRHS();
    //loops backwards through the array
    //     if (particles[i].scoreRHS()) { //if statement calling if scoreRHS is true
    //       //particles.splice(i, 1); //splice removes the last object from an array
    //     }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].scoreLHS();
    // if (particles[i].scoreLHS()) {
    //   //particles.splice(i, 1);
    // }
  }
}

function scoreAndBounce(mode) {
  
  if (mode == 2){
    
  textSize(12);
  fill(125);
  text("score " + score, width - 150, height - 50); //score text
  
    push();
    let k = (width - height)/2;
    let s = height/4;
    let h = height/8;
    let inc = 25
    textSize(80)
    fill(125)
    textFont(boldFont);
    //first row
    if (score > (inc)){
      textAlign(LEFT, CENTER)
    text("LET", k, h)
    }
    if (score > (inc * 2)){
      textAlign(CENTER, CENTER)
    text("US", k + h + s, h)
    }
    if (score > (inc * 3)){
      textAlign(CENTER, CENTER)
    text("GO", k + h + (2*s), h)
    }
    if (score > (inc * 4)){
      textAlign(RIGHT, CENTER)
    text("FOR", k + (4*s), h)
    }
    //second row
    if (score > (inc * 5)){
    textAlign(LEFT, CENTER)
    text("A", k, h + s)
    }
    if (score > (inc * 6)){
    textAlign(CENTER, CENTER)
    text("WALK", k + s, h + s)  
    }
    if (score > (inc * 7)){
      textAlign(CENTER, CENTER)
    text("AND", k + (2*s) + h, h + s)
    }
    if (score > (inc * 8)){
      textAlign(RIGHT, CENTER)
    text("BLOW", k + (4*s), h + s)
    }
    //third row
    if (score > (inc * 9)){
      textAlign(LEFT, CENTER)
    text("THE", k, h + (s*2))
    }
    if (score > (inc * 10)){
     textAlign(CENTER, CENTER)
    text("COBWEBS", k + s + s, h + (s*2)) 
    }
    if (score > (inc * 11)){
      textAlign(RIGHT, CENTER)
    text("AWAY!", k + (4*s), h + (s*2))
    }
    //fourth row
    if (score > (inc * 12)){
      textAlign(LEFT, CENTER)
    text("IN", k, h + (s*3))
    }
    if (score > (inc * 13)){
     textAlign(CENTER, CENTER)
    text("THE", k + s + h, h + (s*3)) 
    }
    if (score > (inc * 14)){
     textAlign(RIGHT, CENTER)
    text("RAIN.", k + (4*s), h + (s*3)) 
    }
    pop();
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].edgeScore(); //if a particle bounces off the Right Hand Side the corresponding score will change
    if(score > inc * 14){
        rainIncrement();
      if (rainCount == 0){
        isRaining();
      }
      }
    }
    
  } //cobwebs
  
  if (mode == 3){
    
  textSize(12);
  text("score " + score2, width - 150, height - 50); //score text
  // text("score " + scoreLHS, 0 + 50, height - 50);

  push();
    let k = (width - height)/2;
    let s = height/4;
    let h = height/8;
    let inc = 25
    textSize(12)
    
    //first row
    if (score2 > (inc)){
      textAlign(LEFT, CENTER)
    text("Hello!", k, h)
    }
    if (score2 > (inc * 2)){
      textAlign(CENTER, CENTER)
    text("How are you!", k + h + s, h)
    }
    if (score2 > (inc * 3)){
      textAlign(CENTER, CENTER)
    text("wooooosh, that is the wind replying", k + h + (2*s), h)
    }
    if (score2 > (inc * 4)){
      textAlign(RIGHT, CENTER)
    text("mysterious....", k + (4*s), h)
    }
    //second row
    if (score2 > (inc * 5)){
    textAlign(LEFT, CENTER)
    text("What does the wind mean to you?", k, h + s)
    }
    if (score2 > (inc * 6)){
    textAlign(CENTER, CENTER)
    text("The wind is free,", k + s + h, h + s)  
    }
    if (score2 > (inc * 7)){
      textAlign(CENTER, CENTER)
    text("be like the wind.", k + (2*s) + h, h + s)
    }
    if (score2 > (inc * 8)){
      textAlign(RIGHT, CENTER)
    text("If you", k + (4*s), h + s)
    }
    //third row
    if (score2 > (inc * 9)){
      textAlign(LEFT, CENTER)
    text("like this", k, h + (s*2))
    }
    if (score2 > (inc * 10)){
     textAlign(CENTER, CENTER)
    text("please", k + s +s, h + (s*2)) 
    }
    if (score2 > (inc * 11)){
      textAlign(RIGHT, CENTER)
    text("show", k + (4*s), h + (s*2))
    }
    //fourth row
    if (score2 > (inc * 12)){
      textAlign(LEFT, CENTER)
    text("a", k, h + (s*3))
    }
    if (score2 > (inc * 13)){
     textAlign(CENTER, CENTER)
    text("friend", k + s + h, h + (s*3)) 
    }
    if (score2 > (inc * 14)){
     textAlign(RIGHT, CENTER)
    text(":)))))).", k + (4*s), h + (s*3)) 
    }
    pop();  
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].edgeScore2(); //if a particle bounces off the Right Hand Side the corresponding score will change
  }

  } //singleplayer
  
}

function springVideo(capSizeW, capSizeH) {
  if (capture.loadedmetadata) {
    let c = capture.get(0, 0, 640, 480);

    c.resize(capSizeW, capSizeH); //resizes the video capture to the windowWidth and windowHeight

    push();

    translate(c.width, 200); //translates video to the right by the capture width
    translate(width / 2 + 50, 0);
    scale(-1, 1); //scales the video by -1 on the x axis, reflecting it so the video is mirrored properly

    for (let i = 0; i < capSizeW; i += spacer) {
      for (let j = 0; j < capSizeH; j += spacer) {
        tint(0, 0, 255);
        springVid[i][j].update();
        let video = c.get(i, j);

        springVid[i][j].show(i, j, video);

        if (keyIsPressed && keyCode == RIGHT_ARROW) {
          xoff += 0.01;
          let n = map(noise(xoff), 0, 1, -0.3, 0.3);
          let windWest = createVector(random(0, -2), n); // negative value due to translate and scale
          springVid[i][j].applyForce(windWest);
        } //adds random 'wind' force to velocity values

        if (keyIsPressed && keyCode == LEFT_ARROW) {
          xoff += 0.01;
          let n = map(noise(xoff), 0, 1, -0.3, 0.3);
          let windEast = createVector(random(0, 2), n); //positive value due to translate and scale
          springVid[i][j].applyForce(windEast);
        } //adds random 'wind' force to velocity values
      }
    }
    pop();
  }
}

function isRaining() {
  bgAlpha = 170;

  for (let i = 0; i < d.length; i++) {
    d[i].update();
    d[i].show();

    if (keyIsPressed && key == "a") {
      let rainAngle = 0.3;
      let windEast = createVector(-0.2, 0);
      d[i].applyForce(windEast, rainAngle);
    } else {
      rainAngle = 0;
      windEast = createVector(0, 0);
      d[i].applyForce(windEast, rainAngle);
    }

    if (keyIsPressed && key == "d") {
      let rainAngle = -0.3;
      let windWest = createVector(0.2, 0);
      d[i].applyForce(windWest, rainAngle);
    } else {
      rainAngle = 0;
      windWest = createVector(0, 0);
      d[i].applyForce(windWest, rainAngle);
    }
  }
}

function homeScreenSetup() {
  
  b = createButton("Katabatic()", width / 6, height / 3, 170, 40);
  b2 = createButton("Cobwebs()", width / 6, height / 3 + 75, 170, 40);
  b3 = createButton("SinglePlayer()", width / 6, height / 3 + 150, 200, 40);
  b4 = createButton("VeryNormalMode()", width / 6, height / 3 + 225, 230, 40);
  b5 = createButton("Home", width - 90, 20, 70, 30);

  gui.loadStyle("Gray");
  gui.setRounding(5);
  gui.setTextSize(20);
  gui.setStrokeWeight(2);
  //gui.setFont(myFont);

  b2.setStyle({
    //fillBgHover : color(39, 80, 214),
    fillLabelHover: color(39, 80, 214),
    strokeBgHover: color(39, 80, 214),
  });
}

function homeScreenDraw() {
  bgCol = 100;
  bgAlpha = 100;

  b5.visible = false; //testing button visibility

  isRaining();
  
  //vectorDataVid();
  vectorDataRain();
  
  push();
  fill(220);
  noStroke();
  rect(width / 2, 0, width / 2, height);
  pop();
  springVideo(width / 2 - 100, 480);
  
  push();
  
  textFont(boldFont)
  textSize(60)
  textAlign(CENTER, BOTTOM)
  text("WIND IS ALIVE", width/2 - (width/4) , 0 + 175)
  textAlign(CENTER, BOTTOM)
  text("HOLD ON TO",width/2 + (width/4), 0 + 175)
  text("YOUR FACE", width/2 + (width/4), height - 30)
  pop();

  if (
    mouseX > width / 6 &&
    mouseX < width / 6 + 170 &&
    mouseY > height / 3 &&
    mouseY < height / 3 + 40
  ) {
    push();
    textSize(12);
    textFont(italicFont);
    let w =
      "Katabatic wind, a sudden strong down\nslope wind, found near cold mountains.";
    text(w, width / 6 + 185, height / 3 + 12);
    pop();
  }

  if (
    mouseX > width / 6 &&
    mouseX < width / 6 + 200 &&
    mouseY > height / 3 + 150 &&
    mouseY < height / 3 + 190
  ) {
    push();
    textSize(15);
    let smiley = ":))))))))))))))))";
    text(smiley, width / 6 + 210, height / 3 + 175);
    pop();
  }

  b4.setStyle({
    fillLabelHover: color(random(255), random(255), random(255)),
    strokeBgHover: color(random(255), random(255), random(255)),
  });
}

function buttonPressed() {
  if (b.isPressed) {
    // b5.visible = true;
    mode = 1;
    print(b.label + " is pressed.");
    print("mode " + mode);
  }
  if (b2.isPressed) {
    mode = 2;
    print(b2.label + " is pressed");
    print("mode " + mode);
  }
  if (b3.isPressed) {
    mode = 3;
    print(b3.label + " is pressed");
    print("mode " + mode);
  }
  if (b4.isPressed) {
    mode = 4;
    print(b4.label + " is pressed");
    print("mode " + mode);
  }
  if (b5.isPressed) {
    mode = 0;
    print(b5.label + " is pressed");
    print("mode " + mode);
  }
}

function rainIncrement() {
    rainCount++; // counts up
    if (rainCount > rainCountLimit) {
      //when counter exceeds limit value reset to 0
      rainCount = 0;
    }
  }
