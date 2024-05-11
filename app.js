$(document).ready(() => {
  const leftPaddleDiv = $("#leftPaddle");
  const rightPaddleDiv = $("#rightPaddle");
  const ball = $("#ball");

  leftPaddleDiv.css("top", $(document).height() / 2 - leftPaddleDiv.height() / 2);
  rightPaddleDiv.css("top", $(document).height() / 2 - rightPaddleDiv.height() / 2);

  let leftPaddle = {
    width: 100,
    height: 300,
    top: $(document).height() / 2 - leftPaddleDiv.height() / 2,
    bottom:
      leftPaddleDiv.height() +
      $(document).height() / 2 -
      leftPaddleDiv.height() / 2,
    left: 25,
    speed: 2,
    isStart: false,
    topTime: null,
    bottomTime: null,
  };

  let rightPaddle = {
    width: 100,
    height: 300,
    top: $(document).height() / 2 - rightPaddleDiv.height() / 2,
    bottom:
      leftPaddleDiv.height() +
      $(document).height() / 2 -
      leftPaddleDiv.height() / 2,
    left: $(document).width() - 125,
    speed: 2,
    isStart: false,
    topTime: null,
    bottomTime: null,
  };

  let gameBall = {
    width: 20,
    height: 20,
    left: $(document).width() / 2,
    top: $(document).height() / 2,
    speed: -4,
    speedY: 0,
    move: null,
  };

  function ballControl() {
    let right = $(document).width() - gameBall.width;

    // Top oyun sahasında mı diye kontrol
    if (gameBall.left >= 0 && gameBall.left <= right) {
      gameBall.left += gameBall.speed;
      ball.css("left", gameBall.left);
      gameBall.top += gameBall.speedY;
      ball.css("top", gameBall.top);
    } else {
      // GAME OVER
      clearInterval(gameBall.move);
    }

    // Top paddle'a çarpınca
    if (gameBall.left <= leftPaddle.width + leftPaddle.left) {
      if (
        leftPaddle.top <= gameBall.top + gameBall.height &&
        leftPaddle.bottom >= gameBall.top &&
        gameBall.speed < 0
      ) {
        console.log("1 if");
        ballBounce();
      } 
      else if (gameBall.left > leftPaddle.left) {
        console.log("3 if");
        if (gameBall.top + gameBall.height >= leftPaddle.top) {
          console.log("4 if");
        }
      }
    }

    if (
      gameBall.top <= 0 ||
      gameBall.top >= $(document).height() - gameBall.height
    ) {
      gameBall.speedY *= -1;
      gameBall.top += gameBall.speedY;
      ball.css("top", gameBall.top);
    }
  }

  function ballBounce() {
    console.log(
      "ballTop: " +
        ball.position().top +
        "\nPaddleTop: " +
        leftPaddleDiv.position().top +
        "\n Eksi: " +
        (150 - (ball.position().top - leftPaddleDiv.position().top)) +
        "\n Yüzde: " +
        ((150 - (ball.position().top - leftPaddleDiv.position().top)) / 150) *
          100
    );

    // BU KISIM ENEMY GÖRE DE YAPILACAK
    let testInt =
      -(
        ((150 - (ball.position().top - leftPaddleDiv.position().top)) / 150) *
        100
      ) / 15;

    if (testInt > 100 / 15) testInt = 100 / 15;
    if (testInt < 100 / -15) testInt = 100 / -15;

    gameBall.left -= gameBall.speed;
    gameBall.speed *= -1;
    ball.css("left", gameBall.left);
    gameBall.top -= gameBall.speedY;
    gameBall.speedY = testInt;
    ball.css("top", gameBall.top);
    
  }


  function paddleControl(direction, paddle) {
    if (paddle.top <= 0) {
      paddle.top = 1;
    } else if (paddle.top + paddle.height >= $(document).height()) {
      paddle.top = $(document).height() - paddle.height - 1;
    } else {
      let move = direction == "top" ? -paddle.speed : paddle.speed;
      paddle.top += move;
    }
    paddle.bottom = paddle.top + paddle.height;
    if(paddle == leftPaddle)
    leftPaddleDiv.css("top", paddle.top);
    else 
    rightPaddleDiv.css("top", paddle.top);
  }


  function keyControl(e) {
    const isKeyDown = e.type === "keydown" && !e.repeat;
    const isKeyUp = e.type === "keyup";
  
    if (isKeyDown) {
      if (e.key === "w") {
        clearInterval(leftPaddle.topTime);
        leftPaddle.topTime = setInterval(() => paddleControl("top", leftPaddle), 0.2);
      } else if (e.key === "s") {
        clearInterval(leftPaddle.bottomTime);
        leftPaddle.bottomTime = setInterval(() => paddleControl("bottom", leftPaddle), 0.2);
      } else if (e.key === "ArrowUp") {
        clearInterval(rightPaddle.topTime);
        rightPaddle.topTime = setInterval(() => paddleControl("top", rightPaddle), 0.2);
      } else if (e.key === "ArrowDown") {
        clearInterval(rightPaddle.bottomTime);
        rightPaddle.bottomTime = setInterval(() => paddleControl("bottom", rightPaddle), 0.2);
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
  }

  document.addEventListener("keydown", keyControl);
  document.addEventListener("keyup", keyControl);

  function startGame() {
    console.log("başladı");
    gameBall.move = setInterval(() => ballControl(), 0.2);
  }

  $(document).on("click", startGame);
});
