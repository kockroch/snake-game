const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [
    { x: 100, y: 100 },
    { x: 80, y: 100 },
    { x: 60, y: 100 }
];

let dx = gridSize;
let dy = 0;

let foodX;
let foodY;

let score = 0;
let changingDirection = false;

document.addEventListener('keydown', changeDirection);
main();
generateFood();

function main() {
    if (didGameEnd()) return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = '#fff';
    ctx.strokestyle = '#333';

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
    ctx.strokeRect(foodX, foodY, gridSize, gridSize);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        score += 10;
        document.getElementById('score').innerHTML = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function generateFood() {
    foodX = Math.round((Math.random() * (canvas.width - gridSize)) / gridSize) * gridSize;
    foodY = Math.round((Math.random() * (canvas.height - gridSize)) / gridSize) * gridSize;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if (foodIsOnSnake) generateFood();
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}
