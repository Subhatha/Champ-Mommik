// 🌸 Flower Button
const flowerBtn = document.getElementById('flowerBtn');
const flowerContainer = document.getElementById('flowerContainer');

flowerBtn.addEventListener('click', () => {
  const flower = document.createElement('div');
  flower.className = 'flower';
  
  // Spawn randomly but avoid canvas area (top 80% of viewport)
  flower.style.left = Math.random() * (window.innerWidth - 40) + 'px';
  flower.style.top = Math.random() * (window.innerHeight * 0.8 - 40) + 'px';
  
  flowerContainer.appendChild(flower);

  setTimeout(() => {
    flower.remove();
  }, 5000);
});

// ⏱ Persistent "Get Well Soon" Countdown
const countdownEl = document.getElementById('countdown');

// Set the target date for "Get Well Soon" (fixed date)
const targetDate = new Date("2025-09-20T00:00:00").getTime(); // change to your desired date

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownEl.innerHTML = "💖 Get Well Soon, My Champ! 💖";
    return;
  }

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const minutes = Math.floor((diff / (1000*60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownEl.innerHTML = `
    <span class="count">${days}d</span> 
    <span class="count">${hours}h</span> 
    <span class="count">${minutes}m</span> 
    <span class="count">${seconds}s</span> 💕
  `;
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown();


// Add CSS animation class dynamically
const style = document.createElement('style');
style.innerHTML = `
  .count { display:inline-block; animation: pop 0.3s ease; margin: 0 2px; }
  @keyframes pop {
    0% { transform: scale(0.7); opacity: 0.5; }
    50% { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

// ⚽ Mini Football Game with Score
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
const gameMessage = document.getElementById('gameMessage');

// Draw field and goals
function drawField() {
  ctx.fillStyle = '#2e8b57';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;

  // center line
  ctx.beginPath();
  ctx.moveTo(canvas.width/2,0);
  ctx.lineTo(canvas.width/2,canvas.height);
  ctx.stroke();

  // center circle
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI*2);
  ctx.stroke();

  // goals
  ctx.strokeRect(0, canvas.height/2 - 50, 10, 100); // left
  ctx.strokeRect(canvas.width-10, canvas.height/2 - 50, 10, 100); // right
}

// Ball properties
let ball = { x: canvas.width/2, y: canvas.height/2, radius: 15, vx: 0, vy: 0 };
let isDragging = false;
let dragStart = null;

function draw() {
  drawField();

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Draw drag line
  if (isDragging && dragStart) {
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(dragStart.mx, dragStart.my);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}
draw();

// Drag & shoot
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  isDragging = true;
  dragStart = { mx: mx, my: my };
});

canvas.addEventListener('mousemove', e => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    dragStart.mx = e.clientX - rect.left;
    dragStart.my = e.clientY - rect.top;
  }
});

canvas.addEventListener('mouseup', e => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = ball.x - mx;
    const dy = ball.y - my;
    ball.vx = dx / 8;
    ball.vy = dy / 8;

    isDragging = false;

    gameMessage.textContent = ["Shoot! ⚽","Great kick! 💥","Goal attempt! 🎯"][Math.floor(Math.random()*3)];
  }
});

// Update ball position, friction, edge & goal detection
function updateBallPosition() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // friction
  ball.vx *= 0.98;
  ball.vy *= 0.98;

  // clamp inside canvas
  if (ball.x - ball.radius < 0) {
    // left goal
    if (ball.y > canvas.height/2 - 50 && ball.y < canvas.height/2 + 50) {
      score++;
      gameMessage.textContent = `Goal! 🎉 Score: ${score}`;
      resetBall();
    }
    ball.x = ball.radius;
    ball.vx = 0;
  }
  if (ball.x + ball.radius > canvas.width) {
    // right goal
    if (ball.y > canvas.height/2 - 50 && ball.y < canvas.height/2 + 50) {
      score++;
      gameMessage.textContent = `Goal! 🎉 Score: ${score}`;
      resetBall();
    }
    ball.x = canvas.width - ball.radius;
    ball.vx = 0;
  }
  if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.vy = 0; }
  if (ball.y + ball.radius > canvas.height) { ball.y = canvas.height - ball.radius; ball.vy = 0; }

  requestAnimationFrame(updateBallPosition);
}

function resetBall() {
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.vx = 0;
  ball.vy = 0;
}

updateBallPosition();
