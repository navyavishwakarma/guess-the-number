let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 10;

function checkGuess() {
    const guess = Number(document.getElementById("guessInput").value);
    const message = document.getElementById("message");
    const attemptsDisplay = document.getElementById("attempts");
    const body = document.body;

    if (!guess || guess < 1 || guess > 100) {
        message.textContent = "⚠️ Enter a number between 1 and 100!";
        message.style.color = "orange";
        return;
    }

    if (guess === randomNumber) {
        message.textContent = `🎉 Correct! The number was ${randomNumber}!`;
        message.style.color = "green";
        body.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
        // celebration: confetti
        try { triggerConfetti(); } catch (e) { /* fail silently if unavailable */ }
    } else if (attempts > 1) {
        attempts--;
        message.textContent = guess > randomNumber ? "⬆️ Too high!" : "⬇️ Too low!";
        message.style.color = "red";
        attemptsDisplay.textContent = `Attempts left: ${attempts}`;
        // Change background color slightly for fun
        body.style.background = `hsl(${Math.random()*360}, 70%, 80%)`;
        // Add a short shake animation to the container when the guess is wrong
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('shake');
            const handler = function() {
                container.classList.remove('shake');
                container.removeEventListener('animationend', handler);
            };
            container.addEventListener('animationend', handler);
        }
    } else {
        message.textContent = `💥 Game over! The number was ${randomNumber}.`;
        message.style.color = "darkred";
        attemptsDisplay.textContent = "Attempts left: 0";
        body.style.background = "linear-gradient(to right, #ff5f6d, #ffc371)";
    }
}

// Simple confetti animation using a full-screen canvas
function triggerConfetti(duration = 3000, particleCount = 120) {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const colors = ['#ff0a54','#ff477e','#ff6b6b','#ffa600','#7bed9f','#00d2ff','#9b5cff'];
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * -h,
            r: Math.random() * 8 + 4,
            dx: (Math.random() - 0.5) * 6,
            dy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 0.5
        });
    }
    const start = performance.now();
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    function draw(now) {
        const elapsed = now - start;
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.05; // gravity
            p.tilt += 0.02;
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.tilt);
            ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
            ctx.restore();
        });
        if (elapsed < duration) {
            requestAnimationFrame(draw);
        } else {
            window.removeEventListener('resize', resize);
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
    }
    requestAnimationFrame(draw);
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 10;
    document.getElementById("message").textContent = "";
    document.getElementById("attempts").textContent = "Attempts left: 10";
    document.getElementById("guessInput").value = "";
    document.body.style.background = "linear-gradient(to right, #ffecd2, #fcb69f)";
}

// Allow pressing Enter in the input to submit the guess
window.addEventListener('load', function() {
    const input = document.getElementById('guessInput');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkGuess();
            }
        });
    }
});
