const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");

let bird;
let pipes;
let gravity = 0.6;
let score;
let isGameRunning = false;
let animationFrameId;

function initGame() {
  bird = { x: 50, y: 200, width: 20, height: 20, velocity: 0 };
  pipes = [];
  score = 0;
  isGameRunning = true;
  gameOverScreen.classList.add("hidden");
  startScreen.classList.add("hidden");
  animationFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  update();
  draw();

  if (isGameRunning) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function update() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Pipe logic
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 180) {
    const gap = 100;
    const top = Math.random() * 200 + 50;
    pipes.push({
      x: canvas.width,
      width: 40,
      top,
      bottom: top + gap,
      passed: false,
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Score logic
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
    }

    // Collision logic
    const collidesX = bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width;
    const collidesY = bird.y < pipe.top || bird.y + bird.height > pipe.bottom;
    if (collidesX && collidesY) {
      endGame();
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Collision with ground or ceiling
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    endGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Pipes
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function endGame() {
  isGameRunning = false;
  cancelAnimationFrame(animationFrameId);
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

// === Event Listeners ===

startBtn.addEventListener("click", () => {
  initGame();
});

restartBtn.addEventListener("click", () => {
  initGame();
});

canvas.addEventListener("click", () => {
  if (isGameRunning) {
    bird.velocity = -10;
  }
});
