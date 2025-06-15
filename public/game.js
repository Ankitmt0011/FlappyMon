const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScoreText = document.getElementById("finalScore");

// Images
const birdImg = new Image();
birdImg.src = 'monad-logo-transparent.png';

const bgImg = new Image();
bgImg.src = 'background.jpg';

// Sound Effects (preloaded)
const tapSound = new Audio("tap.wav");
const gameOverSound = new Audio("gameover.wav");
const clickSound = new Audio("click.wav");

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

let isGameStarted = false;
let isGameOver = false;

let bird = {
  x: 50,
  y: 150,
  width: 35,
  height: 35,
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

function drawBackground() {
  ctx.globalAlpha = 0.6;
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(bird.rotation);
  ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
  ctx.restore();
}

function drawPipes() {
  ctx.fillStyle = "#22d3ee";
  pipes.forEach(pipe => {
    ctx.beginPath();
    ctx.roundRect(pipe.x, 0, 60, pipe.top, [20]);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom, [20]);
    ctx.fill();
  });
}

function drawScore() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px sans-serif";
  ctx.fillText("Score: " + score, 20, 40);
}

function drawGameOver() {
  playSound(gameOverSound);
  gameOverScreen.classList.remove("hidden");
  finalScoreText.innerText = score;
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
      drawGameOver();
      break;
    }
  }
}

function draw() {
  drawBackground();
  drawPipes();
  drawBird();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Event Listeners
startBtn.addEventListener("click", () => {
  playSound(clickSound);
  startScreen.classList.add("hidden");
  resetGame();
  isGameStarted = true;
  createPipe();
});

restartBtn.addEventListener("click", () => {
  playSound(clickSound);
  gameOverScreen.classList.add("hidden");
  resetGame();
  isGameStarted = true;
  createPipe();
});

startBtn.addEventListener("click", async () => {
  const address = await connectWallet();
  if (!address) return;

  startScreen.classList.add("hidden");
  resetGame();
  isGameStarted = true;
  createPipe();
});

canvas.addEventListener("click", () => {
  if (!isGameOver && isGameStarted) {
    bird.velocity = -10;
    playSound(tapSound);
  }
});

resetGame();
gameLoop();


restartBtn.addEventListener("click", () => {
  gameOverSound.pause();           // Stop game over sound
  gameOverSound.currentTime = 0;  // Reset it to beginning
  playSound(clickSound);          // Play button click sound
  gameOverScreen.classList.add("hidden");
  resetGame();
  isGameStarted = true;
  createPipe();
});

let userAddress = null;

// Connect to the Warpcast wallet
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      console.log("Connected to Warpcast wallet:", userAddress);
      return userAddress;
    } catch (error) {
      console.error("User denied wallet connection:", error);
      return null;
    }
  } else {
    alert("Warpcast wallet not available. Please open inside the Warpcast app.");
    return null;
  }
}
