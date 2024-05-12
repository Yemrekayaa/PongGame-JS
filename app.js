$(document).ready(() => {
  const gameArea = $(".game-area");
  const leftPaddleDiv = $("#leftPaddle");
  const rightPaddleDiv = $("#rightPaddle");
  const ball = $("#ball");
  const leftScore = $("#leftScore");
  const rightScore = $("#rightScore");


  leftPaddleDiv.css(
    "top",
    $(document).height() / 2 - leftPaddleDiv.height() / 2
  );
  rightPaddleDiv.css(
    "top",
    $(document).height() / 2 - rightPaddleDiv.height() / 2
  );

  leftScore.css("right", $(document).width() / 2 + 50);
  rightScore.css("left", $(document).width() / 2 + 50);


  let leftPaddle = {
    width: 15,
    height: 300,
    top: $(document).height() / 2 - leftPaddleDiv.height() / 2,
    bottom:
      leftPaddleDiv.height() +
      $(document).height() / 2 -
      leftPaddleDiv.height() / 2,
    left: 25,
    speed: 3,
    isStart: false,
    topTime: null,
    bottomTime: null,
    score: 0
  };

  let rightPaddle = {
    width: 15,
    height: 300,
    top: $(document).height() / 2 - rightPaddleDiv.height() / 2,
    bottom:
      leftPaddleDiv.height() +
      $(document).height() / 2 -
      leftPaddleDiv.height() / 2,
    left: $(document).width() - 40,
    speed: 3,
    isStart: false,
    topTime: null,
    bottomTime: null,
    score : 0
  };

  let gameBall = {
    width: 20,
    height: 20,
    left: $(document).width() / 2 - ball.width() / 2,
    top: $(document).height() / 2 - ball.height() / 2,
    speed: 5,
    speedY: 0,
    move: null,
  };

  function ballControl() {
    const screenWidth = $(document).width();
    const screenHeight = $(document).height();

    const ballRightLimit = screenWidth - gameBall.width;
    const ballBottomLimit = screenHeight - gameBall.height;

    // Top oyun sahasında mı diye kontrol
    if (gameBall.left >= 0 && gameBall.left <= ballRightLimit) {
      gameBall.left += gameBall.speed;
      gameBall.top += gameBall.speedY;
      ball.css({ left: gameBall.left, top: gameBall.top });

      // Top paddle'a çarpınca
      if (
        gameBall.left <= leftPaddle.width + leftPaddle.left &&
        gameBall.speed < 0
      ) {
        if (
          leftPaddle.top <= gameBall.top + gameBall.height &&
          leftPaddle.bottom >= gameBall.top
        ) {
          ballBounce(leftPaddle);
        }
      }

      if (
        gameBall.left >= rightPaddle.left - gameBall.width &&
        gameBall.speed > 0
      ) {
        if (
          rightPaddle.top <= gameBall.top + gameBall.height &&
          rightPaddle.bottom >= gameBall.top
        ) {
          ballBounce(rightPaddle);
        }
      }
    } else {
      endGame(gameBall.left <= 0 ? rightPaddle : leftPaddle)

    }

    // Top oyun sahasının üst veya alt sınırlarına çarpınca
    if (gameBall.top <= 0 || gameBall.top >= ballBottomLimit) {
      gameBall.speedY *= -1;
      gameBall.top += gameBall.speedY;
      ball.css("top", gameBall.top);
    }
  }


  function ballBounce(paddle) {
    const speedRatio = 15;
    const verticalDistance = paddle.height / 2 - ((gameBall.top + gameBall.height/2) - paddle.top);
    console.log(verticalDistance);
    let newSpeedY =
      (verticalDistance / (paddle.height / 2)) * (100 / -speedRatio);
    console.log(newSpeedY);
    newSpeedY = Math.min(
      Math.max(newSpeedY, -100 / speedRatio),
      100 / speedRatio
    );

    gameBall.left -= gameBall.speed;
    gameBall.speed *= -1;
    ball.css("left", gameBall.left);

    gameBall.top -= gameBall.speedY;
    gameBall.speedY = newSpeedY;
    ball.css("top", gameBall.top);
  }

  function paddleControl(direction, paddle) {
    const paddleTopLimit = 0;
    const paddleBottomLimit = $(document).height();
    let newTop;

    if (direction === "top") {
      newTop = Math.max(paddleTopLimit, paddle.top - paddle.speed);
    } else {
      newTop = Math.min(
        paddleBottomLimit - paddle.height,
        paddle.top + paddle.speed
      );
    }

    paddle.top = newTop;
    paddle.bottom = newTop + paddle.height;

    const paddleDiv = paddle === leftPaddle ? leftPaddleDiv : rightPaddleDiv;
    paddleDiv.css("top", newTop);
  }

  function keyControl(e) {
    const isKeyDown = e.type === "keydown" && !e.repeat;
    const isKeyUp = e.type === "keyup";

    if (isKeyDown) {
      if (e.key === "w") {
        clearInterval(leftPaddle.topTime);
        leftPaddle.topTime = setInterval(
          () => paddleControl("top", leftPaddle),
          0.2
        );
      } else if (e.key === "s") {
        clearInterval(leftPaddle.bottomTime);
        leftPaddle.bottomTime = setInterval(
          () => paddleControl("bottom", leftPaddle),
          0.2
        );
      } else if (e.key === "ArrowUp") {
        clearInterval(rightPaddle.topTime);
        rightPaddle.topTime = setInterval(
          () => paddleControl("top", rightPaddle),
          0.2
        );
      } else if (e.key === "ArrowDown") {
        clearInterval(rightPaddle.bottomTime);
        rightPaddle.bottomTime = setInterval(
          () => paddleControl("bottom", rightPaddle),
          0.2
        );
      }
    } else if (isKeyUp) {
      switch (e.key) {
        case "w":
          clearInterval(leftPaddle.topTime);
          break;
        case "s":
          clearInterval(leftPaddle.bottomTime);
          break;
        case "ArrowUp":
          clearInterval(rightPaddle.topTime);
          break;
        case "ArrowDown":
          clearInterval(rightPaddle.bottomTime);
          break;
      }
    }

    if(e.key == "p"){
      clearInterval(gameBall.move);
    }
  }

  document.addEventListener("keydown", keyControl);
  document.addEventListener("keyup", keyControl);

  function mainMenu(){
    const mainMenuArea = $("<div />")
    .css({
      "backgroundColor": "rgba(0, 0, 0, 0.3)",
      "width": "100vw",
      "height": "100vh",
      "position": "absolute",
      "z-index": "1"
    }).insertBefore(gameArea);

    const startGameButton = $("<button />").css({
      "backgroundColor": "#343434",
      "width": "400px",
      "height": "100px",
      "position": "relative",
      "border": "4px solid magenta",
      "top": "calc(50% - 70px)",
      "left": "calc(50% - 200px)",
      "font-size": "50px",
      "color": "magenta"
    }).text("Start Game")
    .appendTo(mainMenuArea);

    startGameButton.on("click",() => {
      gameBall.move = setInterval(() => ballControl(), 0.2);
      mainMenuArea.css("display","none");
    });

    const controlCSS = {
        "backgroundColor": "#343434",
        "position": "absolute",
        "width": "100px",
        "height": "110px",
        "color": "magenta",
        "font-size": "100px",
        "border": "8px solid magenta",
        "padding": "10px 20px",
        "text-align": "center"
    }

    const leftControlUp = $("<div />")
    .css(controlCSS)
    .css({
      "top": "calc(50% - 200px)",
      "left": "100px"
    })
    .text("W")
    .appendTo(mainMenuArea);

    const leftControlDown = $("<div />")
    .css(controlCSS)
    .css({
      "top": "calc(50% + 100px)",
      "left": "100px"
    }).text("S").appendTo(mainMenuArea);
    
    const rightControlUp = $("<div />")
    .css(controlCSS)
    .css({
      "top": "calc(50% - 200px)",
      "right": "100px",
      "font-size": "80px"
    }).text("↑").appendTo(mainMenuArea);

    const rightControlDown = $("<div />")
    .css(controlCSS)
    .css({
      "top": "calc(50% + 100px)",
      "right": "100px",
      "font-size": "80px"
    }).text("↓").appendTo(mainMenuArea);
  }

  function endGame(winnerPaddle){
    clearInterval(gameBall.move);
  
    winnerPaddle.score++; 
    const paddleTop = ($(document).height() / 2) - (leftPaddle.height / 2);
    leftPaddle.top = paddleTop;
    leftPaddle.bottom = paddleTop + leftPaddle.height;
    leftPaddleDiv.css("top", paddleTop);
    
    rightPaddle.top = paddleTop;
    rightPaddle.bottom = paddleTop + rightPaddle.height;
    rightPaddleDiv.css("top", paddleTop);
    
    const ballTop = ($(document).height() / 2) - gameBall.height / 2;
    const ballLeft = ($(document).width() / 2) - gameBall.width / 2;
    gameBall.top = ballTop;
    gameBall.left = ballLeft;
    gameBall.speedY = 0;
    ball.css({ "top": ballTop, "left": ballLeft });
    leftScore.text(leftPaddle.score);
    rightScore.text(rightPaddle.score);
    gameBall.move = setInterval(ballControl, 0.2); 
  }

  
  mainMenu();

});
