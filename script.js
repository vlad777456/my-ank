const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const foodSound = document.getElementById('foodSound');
const gameOverSound = document.getElementById('gameOverSound');

const snakeSize = 20;
let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 }
];
let dx = snakeSize;
let dy = 0;

let foodX;
let foodY;
let score = 0;
let changingDirection = false;

document.addEventListener('keydown', changeDirection);

main();
createFood();

function main() {
    if (gameOver()) {
        gameOverSound.play();
        alert(`Гра закінчена! Ваші очки: ${score}`);
        document.location.reload();
        return;
    }

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lime';
    ctx.strokeStyle = 'black';
    ctx.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
    ctx.strokeRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        document.getElementById('score').innerText = score;
        foodSound.play();
        createFood();
    } else {
        snake.pop();
    }
}

function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - snakeSize)) / snakeSize) * snakeSize;
    foodY = Math.round((Math.random() * (canvas.height - snakeSize)) / snakeSize) * snakeSize;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    ctx.fillRect(foodX, foodY, snakeSize, snakeSize);
    ctx.strokeRect(foodX, foodY, snakeSize, snakeSize);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingRight = dx === snakeSize;
    const goingLeft = dx === -snakeSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -snakeSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -snakeSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = snakeSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = snakeSize;
    }
}
