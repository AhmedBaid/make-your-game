// === GLOBAL VARIABLES ===

// DOM elements
const introScreen = document.getElementById("introScreen");
const ballDive = document.getElementById("ball");
const paddleDive = document.getElementById("paddle");
const gameMessage = document.getElementById("gameMessage");
const bricksContainer = document.getElementById("bricksContainer");
const timeValue = document.querySelector(".time-value");
const container = document.getElementById("gameArea");
const pauseIcon = document.querySelector(".pause-icon");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const scoreValue = document.querySelector(".score-value");
const lifeValue = document.querySelector(".lives-value");

// Game state

const gameee = gameMessage.innerHTML;

const gameState = {
  gameStart: false,
  gamePause: false,
  gameOver: false,
  gameWine: false,
};

// Brick settings
const brick = {
  brickesrow: 6,
  brickescol: 5,
  brickeswidth: 102,
  brickesheight: 25,
  brickesColor: [
    "brick-red",
    "brick-orange",
    "brick-yellow",
    "brick-green",
    "brick-blue",
    "brick-purple",
  ],
};
const bricksPositions = [];

// Paddle settings
const paddle = {
  element: paddleDive,
  x: container.offsetWidth / 2 - paddleDive.offsetWidth / 2,
  y: container.offsetHeight - 30,
  width: paddleDive.offsetWidth,
  height: paddleDive.offsetHeight,
};

// Ball settings
const BALL_RADIUS = 8;
const ball = {
  x: container.offsetWidth / 2 - BALL_RADIUS,
  y: container.offsetHeight - 60,
  radius: BALL_RADIUS,
  speed: 3,
  dx: 3,
  dy: -3,
};

// Canvas size
const cvs = {
  width: container.offsetWidth,
  height: container.offsetHeight,
};

// Keyboard controls
let cursors = {
  rightPressed: false,
  leftPressed: false,
};

// Timer
const time = {
  interval: null,
  sec: 0,
  min: 0,
};

// Score & Lives
const dakchi = {
  lifes: 3,
  score: 0,
  scoreValue: scoreValue,
  lifeValue: lifeValue,
};

// === MAIN GAME SETUP ===

function GameLoop() {
  introScreen.classList.add("image");

  pauseBtn.addEventListener("click", () => {
    if (gameState.gameStart && !gameState.gamePause) {
      console.log("pause click");

      pauseIcon.innerHTML = "▶️ Continue";

      Pause(gameMessage);
      gameState.gameStart = false;
      gameState.gamePause = true;
      creatTime(timeValue, time, gameState);
    } else if (
      !gameState.gameStart &&
      gameState.gamePause &&
      !gameState.gameOver &&
      !gameState.gameWine
    ) {
      console.log("start click");
      pauseIcon.innerHTML = "⏸️ pause";
      gameState.gameStart = true;
      gameState.gamePause = false;
      start(gameMessage);
      creatTime(timeValue, time, gameState);
    }
  });

  continueBtn.addEventListener("click", () => {
    console.log(1);

    pauseIcon.innerHTML = "⏸️ pause";
    gameState.gameStart = true;
    gameState.gamePause = false;
    start(gameMessage);
    creatTime(timeValue, time, gameState);
  });

  restartBtn.addEventListener("click", () => {
    Restart();
  });

  createbrickes(brick, bricksContainer, bricksPositions);

  document.body.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      if ((gameState.gameOver || gameState.gameWine) && gameState.gamePause) {
        Restart();
      } else if (!gameState.gameStart && !gameState.gamePause) {
        // Start for the first time

        introScreen.classList.add("hidden");
        pauseIcon.innerHTML = "⏸️ pause";
        gameState.gameStart = true;
        gameState.gamePause = false;
        start(gameMessage);
        creatTime(timeValue, time, gameState);
      } else if (gameState.gameStart && !gameState.gamePause) {
        console.log("pause space");

        // Pause the game
        pauseIcon.innerHTML = "▶️ Continue";
        gameState.gameStart = false;
        gameState.gamePause = true;
        creatTime(timeValue, time, gameState);
        Pause(gameMessage);
      } else if (
        !gameState.gameStart &&
        gameState.gamePause &&
        !gameState.gameOver &&
        !gameState.gameWine
      ) {
        // Resume after pause
        console.log("start space");

        pauseIcon.innerHTML = "⏸️ pause";
        gameState.gameStart = true;
        gameState.gamePause = false;
        start(gameMessage);
        creatTime(timeValue, time, gameState);
      }
    } else if (event.key === "ArrowRight") {
      cursors.rightPressed = true;
    } else if (event.key === "ArrowLeft") {
      cursors.leftPressed = true;
    }
  });

  document.body.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
      cursors.rightPressed = false;
    } else if (event.key === "ArrowLeft") {
      cursors.leftPressed = false;
    }
  });

  loop(
    ball,
    paddle,
    bricksPositions,
    cvs,
    ballDive,
    cursors,
    gameState,
    dakchi
  );
}

function loop(
  ball,
  paddle,
  bricksPositions,
  cvs,
  ballDive,
  cursors,
  gameState,
  dakchi
) {
  if (gameState.gameStart) {
    movepaddle(paddle, cursors);
    draw(ball, ballDive, paddle, dakchi);
    update(ball, paddle, bricksPositions, cvs, dakchi);
  }

  requestAnimationFrame(() =>
    loop(
      ball,
      paddle,
      bricksPositions,
      cvs,
      ballDive,
      cursors,
      gameState,
      dakchi
    )
  );
}

function creatTime(timeValue, time, gameState) {
  if (gameState.gameStart && time.interval === null) {
    time.interval = setInterval(() => {
      time.sec++;
      if (time.sec === 60) {
        time.min++;
        time.sec = 0;
      }
      timeValue.innerHTML = `${String(time.min).padStart(2, "0")}:${String(
        time.sec
      ).padStart(2, "0")}`;
    }, 1000);
  } else if (gameState.gamePause) {
    clearInterval(time.interval);
    time.interval = null;
  }
}

function start(gameMessage) {
  gameMessage.style.display = "none";
}

function Pause(gameMessage) {
  gameMessage.style.display = "block";
}

function Restart(
 
) {
  
  window.location.reload()
}

function movepaddle(paddle, cursors) {
  const brick_container = document.querySelector(".bricks-container");
  const paddleWidth = paddle.width;
  const containerWidth = brick_container.offsetWidth;

  if (cursors.rightPressed) {
    paddle.x += 6;
  } else if (cursors.leftPressed) {
    paddle.x -= 6;
  }
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > containerWidth - paddleWidth) {
    paddle.x = containerWidth - paddleWidth;
  }
}

function createbrickes(brick, bricksContainer, bricksPositions) {
  let count = 0;
  for (let row = 0; row < brick.brickesrow; row++) {
    for (let col = 0; col < brick.brickescol; col++) {
      const div = document.createElement("div");
      div.classList = `brick ${brick.brickesColor[row]}`;
      div.style.width = `${brick.brickeswidth}px`;
      div.style.height = `${brick.brickesheight}px`;
      div.id = count;
      bricksContainer.appendChild(div);

      bricksPositions.push({
        id: count,
        element: div,
        x: col * (10 + brick.brickeswidth) + 25,
        y: row * (10 + brick.brickesheight) + 25,
        brickeswidth: brick.brickeswidth,
        brickesheight: brick.brickesheight,
        status: true,
      });
      count++;
    }
  }
}

function update(ball, paddle, bricksPositions, cvs, dakchi) {
  ballPaddleCollision(ball, paddle);
  ballWallCollision(ball, paddle, cvs, dakchi);
  ballBrikCollision(ball, bricksPositions, dakchi);

  const allBricksBroken = bricksPositions.every((b) => b.status === false);
  if (allBricksBroken && !gameState.gameOver && !gameState.gameWine) {
    gameState.gameWine = true;
    gameState.gameStart = false;
    gameWin();
    return;
  }
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function draw(ball, divBall, paddle, dakchi) {
  dakchi.scoreValue.innerHTML = dakchi.score;
  dakchi.lifeValue.innerHTML = dakchi.lifes;
  divBall.style.transform = `translate(${ball.x + ball.dx}px, ${
    ball.y + ball.dy
  }px)`;
  paddle.element.style.transform = `translate(${paddle.x}px)`;
}

function resetBall(ball, paddle, cvs) {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = ball.speed * (Math.random() * 2 - 1);
  ball.dy = -ball.speed;
}

function ballPaddleCollision(ball, paddle) {
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius < paddle.y + paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = collidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
  if (
    ball.y >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ((ball.x + ball.radius >= paddle.x &&
      ball.x + ball.radius <= paddle.x + 5) ||
      (ball.x <= paddle.x + paddle.width &&
        ball.x >= paddle.x + paddle.width - 5))
  ) {
    ball.dx *= -1;
  }
}

function ballWallCollision(ball, paddle, cvs, dakchi) {
  if (ball.x + ball.radius >= cvs.width || ball.x - ball.radius <= 0) {
    ball.dx *= -1;
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy *= -1;
  }
  if (ball.y - ball.radius >= cvs.height) {
    dakchi.lifes--;
    if (dakchi.lifes === 0) {
      gameState.gameOver = true;
      gameState.gameStart = false;
      gameOver();
      return;
    }
    resetBall(ball, paddle, cvs);
  }
}

function ballBrikCollision(ball, bricks, dakchi) {
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].status) {
      if (
        ball.x >= bricks[i].x &&
        ball.x <= bricks[i].x + bricks[i].brickeswidth &&
        ((ball.y - ball.radius <= bricks[i].y + bricks[i].brickesheight &&
          ball.y - ball.radius > bricks[i].y) ||
          (ball.y + ball.radius >= bricks[i].y &&
            ball.y + ball.radius < bricks[i].y + bricks[i].brickesheight))
      ) {
        bricks[i].status = false;
        bricks[i].element.style.opacity = 0;
        ball.dy *= -1;
        dakchi.score += 20;
      } else if (
        ball.y >= bricks[i].y &&
        ball.y <= bricks[i].y + bricks[i].brickesheight &&
        ((ball.x + ball.radius >= bricks[i].x &&
          ball.x + ball.radius < bricks[i].x + bricks[i].brickeswidth) ||
          (ball.x - ball.radius <= bricks[i].x + bricks[i].brickeswidth &&
            ball.x - ball.radius > bricks[i].x))
      ) {
        bricks[i].status = false;
        bricks[i].element.style.opacity = 0;
        ball.dx *= -1;
        dakchi.score += 20;
      }
    }
  }
}

function generateStars(count = 100) {
  const container = document.getElementById("starsBackground");

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    const size = Math.random() * 2 + 1;
    star.classList.add("star");
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.animationDuration = `${10 + Math.random() * 20}s`;

    container.appendChild(star);
  }
}

// Start game
GameLoop();
generateStars(300);

function gameOver() {
  // Stop game
  gameState.gameStart = false;
  gameState.gamePause = true;

  gameMessage.innerText = "💀 Game Over! Press Space to Restart";
  gameMessage.style.display = "block";

  // Stop timer
  clearInterval(time.interval);
  time.interval = null;
}

function gameWin() {
  gameState.gameStart = false;
  gameState.gamePause = true;

  gameMessage.innerText = "🎉 You Win! Press Space to Restart";
  gameMessage.style.display = "block";

  clearInterval(time.interval);
  time.interval = null;
}
