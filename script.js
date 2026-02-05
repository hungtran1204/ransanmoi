const boardSize = 400;
const blockSize = 20;
const rows = boardSize / blockSize;
const cols = boardSize / blockSize;

const board = document.getElementById('game-board');
const scoreElement = document.createElement('div');
scoreElement.id = 'score';
scoreElement.innerText = 'Điểm: 0';
board.appendChild(scoreElement);

const gameOverElement = document.createElement('div');
gameOverElement.id = 'game-over';
gameOverElement.innerText = 'Game Over!\nNhấn phím cách để chơi lại';
board.appendChild(gameOverElement);

let snake = [{ x: 10, y: 10 }];
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let direction = { x: 1, y: 0 };
let score = 0;
let gameInterval;
let isGameOver = false;

function draw() {
    // Xóa các phần tử rắn và mồi cũ (giữ lại score và game-over)
    while (board.children.length > 2) {
        board.removeChild(board.lastChild);
    }

    // Vẽ rắn
    snake.forEach(part => {
        const snakePart = document.createElement('div');
        snakePart.classList.add('snake');
        snakePart.style.width = `${blockSize}px`;
        snakePart.style.height = `${blockSize}px`;
        snakePart.style.left = `${part.x * blockSize}px`;
        snakePart.style.top = `${part.y * blockSize}px`;
        board.appendChild(snakePart);
    });

    // Vẽ mồi
    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.width = `${blockSize}px`;
    foodElement.style.height = `${blockSize}px`;
    foodElement.style.left = `${food.x * blockSize}px`;
    foodElement.style.top = `${food.y * blockSize}px`;
    board.appendChild(foodElement);

    // Cập nhật điểm
    scoreElement.innerText = `Điểm: ${score}`;
}

function update() {
    if (isGameOver) return;

    const head = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };

    // Va chạm tường
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        gameOver();
        return;
    }

    // Va chạm thân rắn
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Ăn mồi
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = { 
            x: Math.floor(Math.random() * cols), 
            y: Math.floor(Math.random() * rows) 
        };
    } else {
        snake.pop();
    }

    draw();
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    gameOverElement.style.display = 'block';
}

// Xử lý phím
document.addEventListener('keydown', e => {
    if (isGameOver && e.key === ' ') {
        // Chơi lại
        snake = [{ x: 10, y: 10 }];
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        direction = { x: 1, y: 0 };
        score = 0;
        isGameOver = false;
        gameOverElement.style.display = 'none';
        draw();
        gameInterval = setInterval(update, 100);
        return;
    }

    switch (e.key) {
        case 'ArrowUp':    if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown':  if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft':  if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
    }
});

// Khởi động game
draw();
gameInterval = setInterval(update, 100);
