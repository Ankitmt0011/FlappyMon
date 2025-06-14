const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isGameStarted = false;
let isGameOver = false;

const birdImg = new Image();
birdImg.src = 'monad-logo-transparent.png';

let bird = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  velocity: 0,
  rotation: 0
};

let gravity = 0.5;
let pipeSpeed = 3;
let pipes = [];
let score = 0;

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  bird.rotation = 0;
  pipes = [];
  score = 0;
  isGameOver = false;
  isGameStarted = false;
}

function createPipe() {
  let gap = 150;
  let topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap
  });
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(bird.rotation);
  ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
  ctx.restore();
}

function drawPipes() {
  ctx.fillStyle = "#00ff88";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 60, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px sans-serif";
  ctx.fillText("Score: " + score, 20, 40);
}

function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "24px sans-serif";
  ctx.fillText("Flappy Mini", canvas.width / 2, canvas.height / 2);
  ctx.fillText("Your Score: " + score, canvas.width / 2, canvas.height / 2 + 40);
  ctx.fillStyle = "#6366f1";
  ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 + 80, 150, 40);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2 + 108);
  ctx.textAlign = "start";
}

function checkCollision(pipe) {
  if (
    bird.x + bird.width > pipe.x && bird.x < pipe.x + 60 &&
    (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
  ) {
    return true;
  }
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    return true;
  }
  return false;
}

function update() {
  if (!isGameStarted || isGameOver) return;

  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Tilt bird based on velocity
  bird.rotation = Math.min(Math.max(bird.velocity * 2, -25), 90) * Math.PI / 180;

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
  });

  if (pipes.length > 0 && pipes[0].x + 60 < 0) {
    pipes.shift();
    score++;
  }

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    createPipe();
  }

  for (let pipe of pipes) {
    if (checkCollision(pipe)) {
      isGameOver = true;
      break;
    }
  }
}

function draw() {
  ctx.fillStyle = "#0f172a"; // dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPipes();
  drawBird();
  drawScore();

  if (!isGameStarted) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Tap to Start", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "start";
  }

  if (isGameOver) {
    drawGameOver();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", (e) => {
  if (isGameOver) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (
      clickX >= canvas.width / 2 - 75 && clickX <= canvas.width / 2 + 75 &&
      clickY >= canvas.height / 2 + 80 && clickY <= canvas.height / 2 + 120
    ) {
      resetGame();
    }
  } else {
    isGameStarted = true;
    bird.velocity = -10;
  }
});

resetGame();
gameLoop();
