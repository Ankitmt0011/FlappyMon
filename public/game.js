import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.10.0/+esm";

let userAddress = null; let contract = null;

const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d"); canvas.width = window.innerWidth; canvas.height = window.innerHeight;

const startScreen = document.getElementById("start-screen"); const gameOverScreen = document.getElementById("game-over-screen"); const startBtn = document.getElementById("startBtn"); const restartBtn = document.getElementById("restartBtn"); const finalScoreText = document.getElementById("finalScore");

const birdImg = new Image(); birdImg.src = 'icon.png';

const bgImg = new Image(); bgImg.src = 'background.jpg';

const tapSound = new Audio("tap.wav"); const gameOverSound = new Audio("gameover.wav"); const clickSound = new Audio("click.wav");

function playSound(sound) { sound.currentTime = 0; sound.play(); }

let isGameStarted = false; let isGameOver = false;

let bird = { x: 50, y: 150, width: 35, height: 35, velocity: 0, rotation: 0 }; let gravity = 0.5; let pipeSpeed = 3; let pipes = []; let score = 0;

function resetGame() { bird.y = 150; bird.velocity = 0; bird.rotation = 0; pipes = []; score = 0; isGameOver = false; }

function createPipe() { let gap = 150; let topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50; pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap }); }

function drawBackground() { ctx.globalAlpha = 0.6; ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1; }

function drawBird() { ctx.save(); ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2); ctx.rotate(bird.rotation); ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height); ctx.restore(); }

function drawPipes() { ctx.fillStyle = "#22d3ee"; pipes.forEach(pipe => { ctx.beginPath(); ctx.roundRect(pipe.x, 0, 60, pipe.top, [20]); ctx.fill(); ctx.beginPath(); ctx.roundRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom, [20]); ctx.fill(); }); }

function drawScore() { ctx.fillStyle = "#ffffff"; ctx.font = "24px sans-serif"; ctx.fillText("Score: " + score, 20, 40); }

function drawGameOver() { playSound(gameOverSound); gameOverScreen.classList.remove("hidden"); finalScoreText.innerText = score; saveScore(score); }

function checkCollision(pipe) { if ( bird.x + bird.width > pipe.x && bird.x < pipe.x + 60 && (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) ) return true; if (bird.y + bird.height > canvas.height || bird.y < 0) return true; return false; }

function update() { if (!isGameStarted || isGameOver) return;

bird.velocity += gravity; bird.y += bird.velocity; bird.rotation = Math.min(Math.max(bird.velocity * 2, -25), 90) * Math.PI / 180; pipes.forEach(pipe => pipe.x -= pipeSpeed);

if (pipes.length > 0 && pipes[0].x + 60 < 0) { pipes.shift(); score++; } if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) { createPipe(); } for (let pipe of pipes) { if (checkCollision(pipe)) { isGameOver = true; drawGameOver(); break; } } }

function draw() { drawBackground(); drawPipes(); drawBird(); drawScore(); }

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

startBtn.addEventListener("click", async () => { playSound(clickSound);

const address = await connectWallet(); if (!address) return;

const paid = await payEntryFee(); if (!paid) return;

await initContract();

startScreen.classList.add("hidden"); resetGame(); isGameStarted = true; createPipe(); });

restartBtn.addEventListener("click", () => { gameOverSound.pause(); gameOverSound.currentTime = 0; playSound(clickSound); gameOverScreen.classList.add("hidden"); resetGame(); isGameStarted = true; createPipe(); });

canvas.addEventListener("click", () => { if (!isGameOver && isGameStarted) { bird.velocity = -10; playSound(tapSound); } });

resetGame(); gameLoop();

async function connectWallet() { if (!window.ethereum) { alert("Wallet not found. Please use Brave or MetaMask or open inside Warpcast."); return null; } try { const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); userAddress = accounts[0]; return userAddress; } catch (err) { alert("Wallet connection rejected"); return null; } }

const GAME_ENTRY_FEE = "0.03"; const MONAD_CHAIN_ID = "0x3151c"; // 201804 const PROJECT_WALLET_ADDRESS = "0xfc8e4ffEC914D567460AC549a3CD642981A43674";

async function payEntryFee() { try { await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: MONAD_CHAIN_ID }] });

const tx = {
  from: userAddress,
  to: PROJECT_WALLET_ADDRESS,
  value: "0x" + (parseFloat(GAME_ENTRY_FEE) * 1e18).toString(16)
};

await window.ethereum.request({ method: 'eth_sendTransaction', params: [tx] });
return true;

} catch (err) { console.error("Payment failed:", err); alert("Payment failed. Make sure you're on Monad testnet with test MON."); return false; } }

const CONTRACT_ADDRESS = "0x4343F07386231bfF48CeaF12B27E713Cf7611453"; const ABI = [ { inputs: [{ internalType: "uint256", name: "score", type: "uint256" }], name: "submitScore", outputs: [], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "player", type: "address" }], name: "getHighScore", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" } ];

async function initContract() { const provider = new ethers.BrowserProvider(window.ethereum); const signer = await provider.getSigner(); contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer); }

async function saveScore(score) { if (!contract || !userAddress) return;

try { const current = await contract.getHighScore(userAddress); if (score > current) { const tx = await contract.submitScore(score); await tx.wait(); console.log("Score saved!"); } else { console.log("No update, lower score"); } } catch (err) { console.error("Score save error:", err); } }

