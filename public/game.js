const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");

let bird, pipes, gravity, score, isGameOver;

function startGame() {
  bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
  pipes = [];
  gravity = 0.6;
  score = 0;
  isGameOver = false;
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (isGameOver) return;

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

function update() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Create pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
    const gap = 100;
    const top = Math.random() * 200 + 50;
    pipes.push({ x: canvas.width, top, bottom: top + gap });
  }

  // Move pipes
  for (let pipe of pipes) {
    pipe.x -= 2;

    // Check collision
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + 40 &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver();
    }

    // Score
    if (!pipe.passed && pipe.x + 40 < bird.x) {
      score++;
      pipe.passed = true;
    }
  }

  // Remove offscreen pipes
  pipes = pipes.filter(pipe => pipe.x + 40 > 0);

  // Check floor/ceiling
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Draw pipes
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, 40, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 40, canvas.height - pipe.bottom);
  }

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameOver() {
  isGameOver = true;
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

canvas.addEventListener("click", () => {
  bird.velocity = -10;
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
