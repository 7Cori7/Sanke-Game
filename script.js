//Seleccionar Elementos HTML:
const board = document.querySelector('#game-board');
const instrucciones = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Definir variables del juego:
const gridSize = 20;
let snake = [{x: 10, y: 10}]; //<-- la culebrita es un arreglo que contiene posiciones (ejes x = filas, y = columnas) del mapa de juego (grilla del game board)
let foodPosition = generateFoodPostion();
let specialFoodPosition;
let direction = 'rigth';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
let bonus = 0;

//* Función para dibujar en el mapa del juego (gameboard), la culebrita (snake) y la comidita (food):
function draw(){

    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();

};


//Dibujar culebrita (snake) y ponerla en el gameboard:
function drawSnake(){

    snake.forEach(segmento => {

        const snakeElement = createGameElement('div', 'snake');

        setPosition(snakeElement, segmento);

        board.appendChild(snakeElement);

    });

};


//Dibujar comida (food) y ponerla en el gameboard:
function drawFood(){

    if(gameStarted){

        const foodElement = createGameElement('div', 'food');

        setPosition(foodElement, foodPosition);

        board.appendChild(foodElement);

    }

};



//Función para generar la posición de la comida:
function generateFoodPostion(){

    const x = Math.floor((Math.random() * gridSize) + 1);
    const y = Math.floor((Math.random() * gridSize) + 1);

    return { x, y };

};



//Función para crear segmentos de la culebra o cubos de comida:
function createGameElement(tag, className){

    const element = document.createElement(tag);
    element.className = className;
    return element;

};


//Función para establecer la posción de la culebrita o la comida en el gameboard:
function setPosition(element, position){

    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

};


//* Mover la culebrita:
function move(){

    const head = {...snake[0]};

    switch(direction){

        case 'right':

            head.x++;

            break;

        case 'left':

            head.x--;

            break;
        
        case 'up':

            head.y--;

            break;

        case 'down':

            head.y++;

            break;

    };

    snake.unshift(head); //<-- hacer un "push" al arreglo pero al frente y no al final

    //* Si se "come la comida":
    if( head.x === foodPosition.x && head.y === foodPosition.y ){

        foodPosition = generateFoodPostion(); //<--- Se vuelve a generar la comida

        increaseSpeed();

        if(snake.length > 30){

            bonus += 3;
    
            increaseDificulty();
    
            clearInterval(gameInterval);
    
            //specialFoodPosition = generateSpecialPosition();
    
            gameInterval = setInterval(()=>{
    
                move();
                draw();
                checkCollision();
                //drawSpecialFood(specialFoodPosition);
                //comerComidaEspecial(head);
    
            }, gameSpeedDelay);

    
        }else{
    
            clearInterval(gameInterval); // <--- borra el intervalo anterior

            gameInterval = setInterval(()=>{

                move();
                draw();
                checkCollision();

            }, gameSpeedDelay);

        };

    }else{

        snake.pop(); //<-- va borrando lo que queda de último, esto da la ilusión de que se mueve

    };    

};


//* Función para iniciar el juego:
function startGame(){

    gameStarted = true;

    instrucciones.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => {

        move(); //mover la culebrita
        draw(); //dibujar cada nueva posicion
        checkCollision(); //activar la colisión

    }, gameSpeedDelay);

};



//* Escuchar los Eventos (presionar las teclas del teclado):
function handleKeyPress(event){

    //Si NO se ha iniciado el juego:
    if( (!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ') ){

        startGame();

    }else{
        //Si ya se inició el juego:
        switch(event.key){

            case 'ArrowUp':

                direction = 'up';

                break;

            case 'ArrowDown':

                direction = 'down';

                break;

            case 'ArrowLeft':

                direction = 'left';

                break;

            case 'ArrowRight': 

                direction = 'right';

                break;

        };

     };

};

document.addEventListener('keydown', e => {

    handleKeyPress(e);

});


//Función para incrementar velocidad:
function increaseSpeed(){

    if(gameSpeedDelay > 150){

        gameSpeedDelay -= 5;

    }else if(gameSpeedDelay > 100){

        gameSpeedDelay -= 3;

    }else if(gameSpeedDelay > 50){

        gameSpeedDelay -= 2;

    }else if(gameSpeedDelay > 25){

        gameSpeedDelay -= 1;

    }

};


//Función para activar colisión:
function checkCollision(){

    const head = snake[0];

    //Si se pega con las paredes:
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){

        resetGame();

    }

    //Si se pega consigo misma:
    for(i = 1; i < snake.length; i++){

        if(head.x === snake[i].x && head.y === snake[i].y){

            resetGame();

        };

    };

};


//Función para reiniciar el juego:
function resetGame(){
    
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    foodPosition = generateFoodPostion();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();

};


//Funciones para actualizar los puntajes:
function updateScore(){

    const currentScore = (snake.length - 1) + bonus;
    score.textContent = currentScore.toString().padStart( 3,'0' ); //<--padStart es para colocar los 000 ademas de ser la cantidad de digitos permitida

};

function updateHighScore(){

    const currentScore = (snake.length - 1) + bonus;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';

};

//Función para detener el juego:
function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instrucciones.style.display = 'block';
    logo.style.display = 'block';
    board.innerHTML = '';
};


//Incrementar la dificultad:
function increaseDificulty(){

    gameSpeedDelay -= 10;

};


//TODO: comida especial: Escribir funciones para dibujarla y borrarla

function drawSpecialFood(position){

    if(gameStarted){

        const foodElement = createSpecialElement('div', 'specialFood');

        setSpecialPosition(foodElement, position);

        board.appendChild(foodElement);

    }

};


function createSpecialElement(tag, className){

    const element = document.createElement(tag);
    element.className = className;
    return element;

};


function generateSpecialPosition(){

    const x = Math.floor((Math.random() * gridSize) + 1);
    const y = Math.floor((Math.random() * gridSize) + 1);

    console.log('comida especial!', {x,y})

    return { x, y };
    
};


function setSpecialPosition(element, position){

    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

};


function comerComidaEspecial(head){

    if(head.x === specialFoodPosition.x && head.y === specialFoodPosition.y){
    
        console.log('comi comida especial')

        specialFoodPosition = generateSpecialPosition();

        bonus += 3;

        increaseSpeed();

        clearInterval(gameInterval);

        gameInterval = setInterval(()=>{

            move();
            draw();
            checkCollision();
            drawSpecialFood(specialFoodPosition);

        }, gameSpeedDelay);
    }

};