let board = document.querySelector('.board');
let blockH = 50;
let blockW = 50;

let startbtn = document.querySelector(".btn-start");
let modal = document.querySelector('.modal');
let startGameModal = document.querySelector('.start-game');
let GameOverModal = document.querySelector('.game-over')
let restartBtn = document.querySelector('.btn-restart')     

let cols = Math.floor(board.clientWidth / blockW);
let rows = Math.floor(board.clientHeight / blockH);
let intervalID = null;
let timerIntervalID = null;
let food = { x: Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)};

let hsEle = document.querySelector('#high-score')
let scoreEle = document.querySelector('#score');
let timeEle = document.querySelector('#time');

let hs = localStorage.getItem('hs') || 0;
let score = 0;
let time = '00:00'

hsEle.textContent = hs;

let blocks =[];
let snake = [   {x:1, y:3} ]
let direction = "down";


for (let row = 0; row < rows; row++){
    for (let col = 0; col < cols; col++){
        let block = document.createElement('div');
        block.classList.add('block')
        board.appendChild(block);
        blocks [ `${row}-${col}` ] = block;
    }
}


//Snake Render
function render(){
    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === "left") {head = {x: snake[0].x, y:snake[0].y-1 }} 
    else if (direction === "right"){ head = {x: snake[0].x, y:snake[0].y+1 }}
    else if (direction === "down"){ head = {x: snake[0].x+1, y:snake[0].y }}
    else if (direction === "up"){ head = {x: snake[0].x-1, y: snake[0].y }}

    if(head.x<0 || head.x >= rows || head.y<0 || head.y >= cols) {
        clearInterval(intervalID);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        GameOverModal.style.display = 'flex';
        return;
    }

// Food Logic
    if (head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)};

        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        score += 10;
        scoreEle.textContent = score;

        if(score > hs){
            hs = score;
            localStorage.setItem('hs', hs.toString())
        }
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

startbtn.addEventListener("click", function(){
    modal.style.display = 'none'
    intervalID = setInterval(() => { render() },300);

    timerIntervalID = setInterval(() => {
        let [min,sec] = time.split(":").map(Number)
        if(sec==59) {
            min+=1;
            sec = 0;
        } else sec+=1;

        time = `${min}:${sec}`
        timeEle.textContent = time;
    },1000)
})

restartBtn.addEventListener('click', restartGame);


//Game Restart:
function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    score = 0;
    time = '00:00'

    scoreEle.textContent = score;
    timeEle.textContent = time;
    hsEle.textContent = hs;

    modal.style.display = 'none';
    direction = 'down';
    snake = [ {x:1, y:3} ];
    food = { x: Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)};
    intervalID = setInterval(() => { render() },300);
}


//Button Working
addEventListener("keydown", function(dets){
    if(dets.key == "ArrowUp") direction = "up"
    else if(dets.key == "ArrowRight") direction = "right"
    else if(dets.key == "ArrowDown") direction = "down"
    else if(dets.key == "ArrowLeft") direction = "left"
});


/* --------------- TOUCH CONTROLS FOR MOBILE (SNAKE GAME) ---------------*/

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", function(e){
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", function(e){
    if(!touchStartX || !touchStartY) return;

    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

// Horizontal Swipe
    if(Math.abs(diffX) > Math.abs(diffY)){
        if(diffX > 0 && direction !== "left") direction = "right";
        else if(diffX < 0 && direction !== "right") direction = "left";
    }

// Vertical Swipe
    else{
        if(diffY > 0 && direction !== "up") direction = "down";
        else if(diffY < 0 && direction !== "down") direction = "up";
    }
    
    touchStartX = 0;
    touchStartY = 0;
});
