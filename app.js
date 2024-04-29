// app.js
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 2,
    dy: -2,
    radius: 10
};

let target = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 15
};

let obstacles = [{
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 20
}];

let score = 0;

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawTarget() {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI*2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawObstacle() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function updateBall() {
    if(ball.x + ball.dx > canvas.width-ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if(ball.y + ball.dy > canvas.height-ball.radius || ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    }
    ball.x += ball.dx;
    ball.y += ball.dy;

    let dx = target.x - ball.x;
    let dy = target.y - ball.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + target.radius) {
        score++;
        target.x = Math.random() * canvas.width;
        target.y = Math.random() * canvas.height;

        // Add a new obstacle
        obstacles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 20
        });
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        dx = obstacle.x - ball.x;
        dy = obstacle.y - ball.y;
        distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + obstacle.radius) {
            // End the game
            ball.dx = 0;
            ball.dy = 0;
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
            return;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawTarget();
    drawScore();
    drawObstacle();
    updateBall();

    // Only continue the game if the ball is still moving
    if (ball.dx !== 0 || ball.dy !== 0) {
        requestAnimationFrame(draw);
    }
}

canvas.addEventListener('click', function (event) {
    let rect = canvas.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    let dx = clickX - ball.x;
    let dy = clickY - ball.y;

    let magnitude = Math.sqrt(dx * dx + dy * dy);
    let acceleration = 5;

    ball.dx += (dx / magnitude) * acceleration;
    ball.dy += (dy / magnitude) * acceleration;
});

draw();