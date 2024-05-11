$(document).ready(() => {
  const paddlePlayer = $("#paddlePlayer");
  const paddleEnemy = $("#paddleEnemy");
  const ball = $("#ball");

  paddlePlayer.css("top", $(document).height() / 2 - paddlePlayer.height() / 2);
  paddleEnemy.css("top", 10000);

  let myPaddle = {
    width: 25,
    height: 300,
    top: $(document).height() / 2 - paddlePlayer.height() / 2,
    bottom:
      paddlePlayer.height() +
      $(document).height() / 2 -
      paddlePlayer.height() / 2,
    left: 20,
    speed: 2,
    isStart: false,
    topTime: null,
    bottomTime: null,
  };

  let enemyPaddle = {
    width: 25,
    height: 10000,
    top: 0,
    bottom: 100000,
    left: $(document).width() - paddleEnemy.width(),
    speed: 1,
    isStart: false,
    topTime: null,
    bottomTime: null,
  };

  let gameBall = {
    width: 20,
    height: 20,
    left: $(document).width() / 2,
    top: $(document).height() / 2,
    speed: -3,
    speedY: 0,
    move: null,
  };

  function paddleControl(direction) {
    if (myPaddle.top <= 0) {
      myPaddle.top = 1;
    } else if (myPaddle.top + myPaddle.height >= $(document).height()) {
      myPaddle.top = $(document).height() - myPaddle.height - 1;
    } else {
      let move = direction == "top" ? -myPaddle.speed : myPaddle.speed;
      myPaddle.top += move;
    }
    myPaddle.bottom = myPaddle.top + myPaddle.height;
    paddlePlayer.css("top", myPaddle.top);
  }

  function ballControl() {
    let right = $(document).width() - gameBall.width;


    // Top oyun sahasında mı diye kontrol
    if(gameBall.left <= 0 || gameBall.left >= right){
        clearInterval(gameBall.move)
    } else {
        gameBall.left += gameBall.speed;
        ball.css("left", gameBall.left); 
        gameBall.top += gameBall.speedY;
        ball.css("top", gameBall.top);
    }
    if(myPaddle.top <= gameBall.top + gameBall.height && myPaddle.bottom >= gameBall.top && gameBall.speed < 0){
      console.log("aynen öyle");
    }

    if (gameBall.left <= myPaddle.width + myPaddle.left || gameBall.left >= right - myPaddle.width) {
         if (myPaddle.top <= gameBall.top + gameBall.height && myPaddle.bottom >= gameBall.top && gameBall.speed < 0) {;
            ballBounce();
          } 
          else if (enemyPaddle.top <= gameBall.top && enemyPaddle.bottom >= gameBall.top && gameBall.speed > 0){
            ballBounce();
          }
    }
    
     
    if (gameBall.top <= 0 || gameBall.top >= $(document).height() - gameBall.height) {
        gameBall.speedY *= -1;
        gameBall.top += gameBall.speedY;
        ball.css("top", gameBall.top);
    }




  }

  function ballBounce(){
    console.log("ballTop: " + ball.position().top 
    + "\nPaddleTop: " + paddlePlayer.position().top
    + "\n Eksi: " + (150 - (ball.position().top - paddlePlayer.position().top))
    + "\n Yüzde: " + (((150 - (ball.position().top - paddlePlayer.position().top)) / 150) * 100)
    );

    // BU KISIM ENEMY GÖRE DE YAPILACAK
    let testInt = -(((150 - (ball.position().top - paddlePlayer.position().top)) / 150) * 100) / 50;

    gameBall.left -= gameBall.speed;
    gameBall.speed *= -1;
    ball.css("left", gameBall.left);
    gameBall.speedY = testInt;
  }

  function keyControl(e) {
    if (e.type == "keydown" && !e.repeat) {
      if (e.key == "w") {
        myPaddle.topTime = setInterval(() => paddleControl("top"), 0.2);
      } else if (e.key == "s") {
        myPaddle.bottomTime = setInterval(() => paddleControl("bottom"), 0.2);
      }
    } else if ((e.key == "w" || e.key === "s") && e.type == "keyup") {
      clearInterval(myPaddle.topTime);
      clearInterval(myPaddle.bottomTime);
    }
  }

  document.addEventListener("keydown", keyControl);
  document.addEventListener("keyup", keyControl);

  function startGame() {
    console.log("başladı");
    gameBall.move = setInterval(() => ballControl(), 0.2);
  }

  $(document).on("click", startGame);
   
});
