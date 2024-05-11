$(document).ready(() => {
  const leftPaddleDiv = $("#leftPaddle");
  const rightPaddleDiv = $("#rightPaddle");
  const ball = $("#ball");

  leftPaddleDiv.css(
    "top",
    $(document).height() / 2 - leftPaddleDiv.height() / 2
  );
  rightPaddleDiv.css(
    "top",
    $(document).height() / 2 - rightPaddleDiv.height() / 2
  );

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
      // GAME OVER
      clearInterval(gameBall.move);
    }

    // Top oyun sahasının üst veya alt sınırlarına çarpınca
    if (gameBall.top <= 0 || gameBall.top >= ballBottomLimit) {
      gameBall.speedY *= -1;
      gameBall.top += gameBall.speedY;
      ball.css("top", gameBall.top);
    }
  }

  function ballBounce(paddle) {
    const speedRatio = 20;
    const verticalDistance = paddle.height / 2 - (gameBall.top - paddle.top);
    let newSpeedY =
      (verticalDistance / (paddle.height / 2)) * (100 / -speedRatio);

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
  }

  document.addEventListener("keydown", keyControl);
  document.addEventListener("keyup", keyControl);

  function startGame() {
    console.log("başladı");
    gameBall.move = setInterval(() => ballControl(), 0.2);
  }

  $(document).on("click", startGame);
});
