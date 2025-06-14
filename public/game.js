const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");

let bird = { x: 50, y: 200, width: 20, height: 20, velocity: 0 };
let pipes = [];
let gravity = 0.6;
let score = 0;
let isGameRunning = false;
let animationId = null;

function resetGame() {
  bird = { x: 50, y: 200, width: 20, height: 20, velocity: 0 };
  pipes = [];
  score = 0;
  isGameRunning = true;
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  animationId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  update();
  draw();

  if (isGameRunning) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function update() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Add pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 180) {
    const gap = 100;
    const top = Math.random() * 200 + 50;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: top,
      bottom: top + gap,
      passed: false
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
    }

    const collidesX = bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width;
    const collidesY = bird.y < pipe.top || bird.y + bird.height > pipe.bottom;

    if (collidesX && collidesY) {
      endGame();
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function endGame() {
  isGameRunning = false;
  cancelAnimationFrame(animationId);
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

// === Controlled input (only active when game is running) ===
canvas.addEventListener("click", () => {
  if (!isGameRunning) return;
  bird.velocity = -10;
});

// === Start / Restart buttons ===
startBtn.addEventListener("click", resetGame);
restartBtn.addEventListener("click", resetGame);
