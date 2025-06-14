

canvas.width = window.innerWidth; canvas.height = window.innerHeight;

const startScreen = document.getElementById("start-screen"); const gameOverScreen = document.getElementById("game-over-screen"); const startBtn = document.getElementById("startBtn"); const restartBtn = document.getElementById("restartBtn"); const finalScoreText = document.getElementById("finalScore");

const birdImg = new Image(); birdImg.src = 'monad-logo-transparent.png';

const bgImg = new Image(); bgImg.src = 'background-blur.jpg'; // Your blurred background image

const tapSound = new Audio('tap.wav'); const gameOverSound = new Audio('gameover.wav'); const clickSound = new Audio('click.wav');

let isGameStarted = false; let isGameOver = false;

let bird = { x: 50, y: 150, width: 40, height: 40, velocity: 0, rotation: 0 };

let gravity = 0.5; let pipeSpeed = 2.5; let pipes = []; let score = 0;

function resetGame() { bird.y = 150; bird.velocity = 0; bird.rotation = 0; pipes = []; score = 0; isGameOver = false; }

function createPipe() { let gap = 170; let topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50; pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap }); }

function drawBird() { ctx.save(); ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2); ctx.rotate(bird.rotation); ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height); ctx.restore(); }

function drawPipes() { ctx.fillStyle = "#00ff88"; pipes.forEach(pipe => { ctx.fillRect(pipe.x, 0, 60, pipe.top); ctx.fillRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom); }); }

function drawScore() { ctx.fillStyle = "#ffffff"; ctx.font = "24px sans-serif"; ctx.fillText("Score: " + score, 20, 40); }

function drawGameOver() { gameOverScreen.classList.remove("hidden"); finalScoreText.innerText = score; gameOverSound.play(); }

function checkCollision(pipe) { if ( bird.x + bird.width > pipe.x && bird.x < pipe.x + 60 && (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) ) { return true; } if (bird.y + bird.height > canvas.height || bird.y < 0) { return true; } return false; }

function update() { if (!isGameStarted || isGameOver) return;

bird.velocity += gravity; bird.y += bird.velocity; bird.rotation = Math.min(Math.max(bird.velocity * 2, -25), 90) * Math.PI / 180;

pipes.forEach(pipe => { pipe.x -= pipeSpeed; });

if (pipes.length > 0 && pipes[0].x + 60 < 0) { pipes.shift(); score++; }

if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) { createPipe(); }

for (let pipe of pipes) { if (checkCollision(pipe)) { isGameOver = true; drawGameOver(); break; } } }

function draw() { ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); drawPipes(); drawBird(); drawScore(); }

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

startBtn.addEventListener("click", () => { clickSound.play(); startScreen.classList.add("hidden"); resetGame(); isGameStarted = true; createPipe(); });

restartBtn.addEventListener("click", () => { clickSound.play(); gameOverScreen.classList.add("hidden"); resetGame(); isGameStarted = true; createPipe(); });

canvas.addEventListener("click", () => { if (!isGameOver && isGameStarted) { bird.velocity = -10; tapSound.play(); } });

resetGame(); gameLoop();

