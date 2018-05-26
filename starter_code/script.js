window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };
 
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
 
  //Classes
 
  function Board(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.score = 0;
    this.img = new Image();
    this.img.src = 'images/bg.png';
    this.sound = new Audio();
    this.sound.src = "http://66.90.93.122/ost/super-mario-bros.-1-3-anthology/gczrgwrx/1%2001%20Main%20Theme%20Overworld.mp3";
    this.sound2 = new Audio();
    this.sound2.src = "images/mario-gameover.mp3";
    this.img.onload = function() {
      this.draw();
    }.bind(this);
 
    this.move = function() {
      this.x--;
      if(this.x < -canvas.width) this.x = 0;
    }
 
    this.draw = function() {
      this.move();
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);
    }
    this.drawScore = function() {
      this.score = Math.floor(frames/60);
      ctx.font = "50px Avenir";
      ctx.fillStyle = "orange";
      ctx.fillText(this.score, this.width/2, this.y+50);
    }
  }

  function Flappy(){
    
    this.x = 150;
    this.y = 150;
    this.width = 50;
    this.height = 50;
    this.img = new Image();
    this.img.src = "images/flappy.png";
    this.sound = new Audio();
    this.sound.src = "http://soundfxcenter.com/video-games/super-mario-bros/8d82b5_Super_Mario_Bros_Jump_Super_Sound_Effect.mp3";
    this.img.onload = function() {
      this.draw();
    }.bind(this);
      
    this.move = function () {
      this.y -= 20;
      this.sound.play();
    }
      
    this.draw = function () {
      this.y += 1;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      if( this.y < 0 || this.y > canvas.height - this.height) gameOver();
    }
    
      this.isTouching = function(pipe) {
        return  (this.x < pipe.x + pipe.width) &&
                (this.x + this.width > pipe.x) &&
                (this.y < pipe.y + pipe.height) &&
                (this.y + this.height > pipe.y);
      }
    }
     
  
 
  function Pipe(y, height, type){
    this.x = canvas.width;
    this.y = y;
    this.width = 50;
    this.height = height;
    this.img = new Image();
    this.img.src = "images/obstacle_top.png";
    this.img2 = new Image();
    this.img2.src = "images/obstacle_bottom.png";
    
    this.draw = function(){
      this.x--;
      if(type) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
      } else {
        ctx.drawImage(this.img2, this.x, this.y, this.width, this.height)
      }
     
     // ctx.fillStyle = "green";
     // ctx.fillRect(this.x, this.y, this.width, this.height);
      
    }
//Listeners
addEventListener("keydown", function(e){
  if (e.keyCode === 32){
    flappy.move();
  }
});


  }
  //declaraciones
  var intervalo;
  var frames = 0;
  var board = new Board();
  var flappy = new Flappy();
  var pipes = [];


  //Funciones Auxiliares
   function gameOver (){
     stop();
     ctx.font = "120px courier";
     ctx.strokeStyle = "red";
     ctx.lineWidth = 8;
     ctx.strokeText("Game Over", 50,200);
     board.sound.pause();

    }

  function generatePipes(){
    if(!(frames % 300 === 0))return;
      var ventanita = 150;
      var randomHeight = Math.floor(Math.random() * 200 ) + 50;
    
      var pipe = new Pipe(0,randomHeight, true);
      var pipe2 = new Pipe(randomHeight + ventanita, canvas.height - (randomHeight + ventanita), false);
      pipes.push(pipe);
      pipes.push(pipe2);
      
  }
  function drawPipes() {
    pipes.forEach(function(pipe) {
      pipe.draw();
      
  });
}
  function checkColition(){
    pipes.forEach(function(pipe){
      if(flappy.isTouching(pipe)) gameOver();
    });
  }
  //main
  function update() {
    generatePipes();
    frames ++;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    board.draw();
    drawPipes();
    flappy.draw();
    checkColition();
    board.drawScore();
  }

  function stop() {
    clearInterval(intervalo);
    intervalo = 0;
    board.sound.pause();
    board.sound2.play();
  }
 
  function startGame() {
    if(intervalo > 0) return;
 
    intervalo = setInterval(function() {
      update();
    },1000/60);
    board.sound.play();
  }

 };
 