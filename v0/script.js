// Get your canvas html object
var canvas = document.getElementById('game');
// Get the canvas context (this allows you to draw things)
var ctx = canvas.getContext('2d');

// Create rectangle size objects
var rect1 = {
    width: 55,
    height: 50
};

var rect2 = {
    x: 30,
    y: 30
}; 

function rectangle() {
    return {
        width: 55,
        height: 50
    }; 
} 

function update() {

    // Update the size of rectangle 1
    rect1.width += 2;
    rect1.height += 2;

    // If the size get's too big then reset the rectangle size
    if (rect1.width > 450) {
        rect1.width = 55;
        rect1.height = 50;
    }

    // Update the position of rectangle 2
    rect2.x += 0.5;
    rect2.y += 0.1;

     // If the position get's too far then reset the rectangle position
    if (rect2.x > 500) {
        rect2.x = 30;
        rect2.y = 30;   
    }
} 


function draw() {

    // Clear canvas
    ctx.clearRect(0,0,500,500);

    // Draw rectangle 1
    ctx.fillStyle = 'rgb(200,0,0)';
    ctx.fillRect (10, 10, rect1.width, rect1.height);

    // Draw rectangle 2
    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(rect2.x, rect2.y, 40, 40);

}

// Define a function to run over and over again for your game loop animation
function gameLoop(timestamp) {

    update();   
    draw();
    // Continue game loop animation
    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);









