const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");

let bird, pipes, gravity, score, isGameOver, animationId;

function resetGame() {
  bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
  pipes = [];
  gravity = 0.6;
  score = 0;
  isGameOver = false;
}

function startGame() {
  resetGame();
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  animationId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  update();
  draw();

  if (!isGameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function update() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Pipe logic
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) {
    const gap = 100;
    const top = Math.random() * 200 + 50;
    pipes.push({ x: canvas.width, top, bottom: top + gap, passed: false });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + 40 &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver();
    }

    if (!pipe.passed && pipe.x + 40 < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + 40 > 0);

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver();
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
    ctx.fillRect(pipe.x, 0, 40, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 40, canvas.height - pipe.bottom);
  });

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameOver() {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

// Jump on click
canvas.addEventListener("click", () => {
  if (!isGameOver) {
    bird.velocity = -10;
  }
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
