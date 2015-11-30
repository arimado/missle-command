

document.addEventListener('DOMContentLoaded',function(){

	document.getElementById('canvasWrap').innerHTML = '<canvas id="canvasBg" width="800" height="500"></canvas><canvas id="canvasEnemy" width="800" height="500"></canvas><canvas id="canvasJet" width="800" height="500"></canvas><canvas id="canvasHUDbg" width="800" height="500"></canvas><canvas id="canvasHUD" width="800" height="500"></canvas><canvas id="canvasEnd" width="800" height="500"></canvas><div id="inner"></div><div id="aoy-link-wrap"></div>';

	document.getElementById("inner").innerHTML = "loading...";

	var canvasBg = document.getElementById('canvasBg');
	var ctxBg = canvasBg.getContext('2d'); 
	var canvasJet = document.getElementById('canvasJet');
	var ctxJet = canvasJet.getContext('2d');  
	var canvasEnemy = document.getElementById('canvasEnemy');
	var ctxEnemy = canvasEnemy.getContext('2d'); 
	var canvasHUD = document.getElementById('canvasHUD');
	var ctxHUD = canvasHUD.getContext('2d'); 
	var canvasHUDlvl = document.getElementById('canvasHUD');
	var ctxHUDlvl = canvasHUD.getContext('2d'); 
	var canvasHUDhealth = document.getElementById('canvasHUD');
	var ctxHUDhealth = canvasHUD.getContext('2d');
	var canvasHUDtill = document.getElementById('canvasHUD');
	var ctxHUDtill = canvasHUDtill.getContext('2d');
	var canvasEnd = document.getElementById('canvasEnd');
	var ctxEnd = canvasEnd.getContext('2d');
	var canvasHUDbg = document.getElementById('canvasHUDbg');
	var ctxHUDbg = canvasHUDbg.getContext('2d');


	ctxHUD.fillStyle = "hsl(0, 0%, 100%)"; //doing this because our canvas is only text
	ctxHUD.font = "bold 20px Arial"; //this gets fon
	ctxHUDlvl.fillStyle = "hsl(0, 0%, 100%)"; //doing this because our canvas is only text
	ctxHUDlvl.font = "bold 20px Arial"; //this gets font
	ctxHUDtill.fillStyle = "hsl(0, 0%, 100%)"; //doing this because our canvas is only text
	ctxHUDtill.font = "bold 20px Arial"; //this gets font


	var jet1 = new Jet(); //need to describe our jet object so we can reference it in other places //it's up here because want the jet to be drawn before we call it to draw with the event listeners
	var enemy1 = new Enemy(); 

	var bullet1 = new Bullet();
 
	var changeLevel = false;

	var btnPlay = new Button(310, 437, 411, 460);
	var btnNext = new Button(0, 800, 0, 500);
	var btnRestart = new Button(0, 800, 0, 500);

	var gameWidth = canvasBg.width; //we use these variables alot throughout the code, so we 
	var gameHeight = canvasBg.height; //declare them here so we can glboally cchange them.

	var mouseX = 0; 
	var mouseY = 0;

	var mousePageX = 0;
	var mousePageY = 0;

	var mousePageFunction = true;

	var keyToggle = true;

	var isPlaying = false; //going to be a var to tell if the game is running or paused

	var requestAnimFrame = window.requestAnimationFrame || //this is a funciton but defined in a different way //.requestAnimationFrame is the method to get the animation, but different browsers have differnet ways of getting to this
						   window.webkitRequestAnimationFrame || 
						   window.mozRequestAnimationFrame ||  //older browsers might not work. have to take into account browser verisons.
						   window.msRequesAnimationFrame || 
						   window.oRequestAnimationFrame ||
						   function(callback) {
						   window.setTimeout(callback, 1000 / 60);
						   };


	var enemies = []; // we wont see the attay in the code, but we will be automoating the list.

	var spawnAmount = 5;

	var pointLvl2 = 25; //stereosonic
	var pointLvl3 = 99999; //western sydney
	var pointLvl4 = 75; //outback
	var pointLvl5 = 150; //dreamtime
	var pointLvlfin = 250; //done 
	var notMoving = true;

	var imgSprite = new Image(); //told the canvas that we will be using an image 'image();'
	imgSprite.src = 'http://yeahnah.tv/sites/yeahnah.tv/files/sprite-b.png';
	imgSprite.addEventListener('load', init, false); //only when the event 'load' is executed is when we call the draw function - because the picture needs to be loaded for it to load.
	var currentLevel = 'MELBOURNE';
	var isNextLvl = false;

	imgSprite.onload = function () {
		removeLoading();
	}

	/* 
		MAIN FUNCTIONS
	*/

	function init() {
		spawnEnemy(spawnAmount); //fixed amount of enemies through the whole game.
		drawSlide1();
		document.addEventListener('click', mouseNext, false);
	}

	function removeLoading() {
		var div = document.getElementById('inner');
		div.parentNode.removeChild(div);
	}


	function externalMouse() { 
		document.addEventListener('click', mousePage, false);
	}

	function slide2() {
		drawSlide2();
		document.removeEventListener('click', mouseNext, false);
		document.addEventListener('click', mouseNext2, false);

	}

	function slide3() {
		drawSlide3();
		document.removeEventListener('click', mouseNext2, false);
		document.addEventListener('click', mouseNext3, false);
	}

	function slide4() {
		playGame();
	}

	function endSlide() {
		drawEndSlide();
	}

	function pauseGame() {
		keyToggle = false;
		pauseGameTxt();
		document.removeEventListener('keydown', checkKeyDown, false);
		document.removeEventListener('keyup', checkKeyUp, false);
		stopLoop();
		
	}

	function pauseGameTxt() {
		ctxHUD.fillText("CLICK TO RESUME", 300, 245);
		drawHUDbgLvl(250, 200, 300, 80);
	}

	function resumeGame() {
		keyToggle = true;
		ctxHUD.clearRect(250, 200, 300, 80); 
		clearCtxHUDbgParam(250, 200, 300, 80);
		playGame();
		notMoving = false;
	}

	function readyGame() {
		document.addEventListener('click', mouseClicked, false);
	}

	function playGame() {
		drawBg();
		externalMouse();
		startLoop(); //we call this when the game loads
		updateHUD();
		if (keyToggle) {
			document.addEventListener('keydown', checkKeyDown, false);
			document.addEventListener('keyup', checkKeyUp, false);
		}
		notMoving = false;
	}



	function playAgain() {
		clearCtxEnd();
		clearCtxEnemy();
		clearCtxJet();
		clearCtxBg();
		jet1.score = 0;
		restartHUD();
		if (enemies.length > 5) {
			for (var i = 0; i < enemies.length; i++) {
				enemies.splice(0, enemies.length);
			}
			increaseSpawn(5);
		}
		drawAllEnemies();
		forceRecycleEnemies();
		document.removeEventListener('click', mouseRestart, true);
		playGame();
		mousePageFunction = true;
	}


	function spawnEnemy(number) {
		for (var i = 0; i < number; i++) { //parameter as the for loop max thing. 
			enemies[enemies.length] = new Enemy(); //?? Not sure why 'enemies.length' is in the aray //this for loop creates a new item in the enemies array//not sure why this references the enemy object in the init() function.
		} 
	}

	function decreaseEnemy(number) {
			enemies.splice(0, number);
	}

	function increaseSpawn(n) {
		spawnEnemy(n);
	}

	function drawAllEnemies() {
		clearCtxEnemy();
		for (var i = 0; i < enemies.length; i++) { //the length of the array is different from the positions. eg. positions can be 0-7 but length is 1-8. thats why we use the < sign not the <= sign.
			enemies[i].draw(); //this for loop will keep drawing enemies until it runs out of array items
		}
	}

	function changeNewLevel() {
		if(jet1.score === pointLvl2){ isNextLvl = true; increaseSpawn(5);}
		if(jet1.score === pointLvl3) { isNextLvl = true; increaseSpawn(0);}
		if(jet1.score === pointLvl4) { isNextLvl = true; increaseSpawn();}
		if(jet1.score === pointLvl5) { isNextLvl = true; increaseSpawn(0);}
		if(jet1.score === pointLvlfin) { gameWin(); }
		if(isNextLvl) {
			forceRecycleEnemies();
			isNextLvl = false;
		} 

	}

	function forceRecycleEnemies() {
		clearCtxEnemy();
		for (var i = 0; i < enemies.length; i++) { 
			enemies[i].recycleEnemy(); 
		}
	}


	function loop() {
		if (isPlaying) {
			jet1.draw(); // draw() is referencing the draw function in the JHet.prototype.thing. im not sure whats going on.
			drawAllEnemies();
			gameOutcomes();
			requestAnimFrame(loop); //requestAnimFrame calls a function over and over again, in this case we want it to call the loop function.
		} 
	} 

	function startLoop() {
		isPlaying = true; //starts the game
		loop(); // calls loop
	}

	function stopLoop() {
		isPlaying = false;
	}

	function gameOutcomes() {
		if (enemy1.health <= 0) {
			gameOver();
		}
	}

	function gameWin() {
		clearCtxJet();
		clearCtxEnemy();
		clearCtxBg();
		stopLoop();
		drawEnd(0, 1923);
		document.getElementById('aoy-link-wrap').innerHTML = '<div id="aoy-link">You can now collect your Australian of The Year Award via sweet jpeg <a href="http://yeahnah.tv/australianoftheyear">here</a></div>';
	}

	function gameOver() {
		clearCtxJet();
		clearCtxEnemy();
		clearCtxBg();
		stopLoop();
		drawEnd(0, 4922);
		mousePageFunction = false;
		document.addEventListener('click', mouseRestart, false);
	}

	function drawMenu() {
		var srcX = 0; 
		var srcY = 670;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gaeWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawBg() {
		var srcX = 0; 
		var srcY = 2422;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function clearCtxBg() {
		ctxBg.clearRect(0,0,gameWidth,gameHeight); //this clears the canvas limited to the size of the coordinates you give it
	} 

	function drawEnd(srcX, srcY) {
		var srcX = srcX;  
		var srcY = srcY; //4922
		var drawX = 0; 
		var drawY = 0;
		enemy1.speed = 2;
		ctxEnd.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);
	}

	function clearCtxEnd() {
		ctxEnd.clearRect(0,0,gameWidth,gameHeight); 
	}

	function drawSlide1() {
		var srcX = 0; 
		var srcY = 425;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawSlide2() {
		var srcX = 0; 
		var srcY = 925;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}


	function drawSlide3() {
		var srcX = 0; 
		var srcY = 1424;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawLvl1() {
		var srcX = 0; 
		var srcY = 2922	;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawLvl2() {
		var srcX = 0; 
		var srcY = 3422;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawLvl3() {
		var srcX = 0; 
		var srcY = 3922;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawLvl4() {
		var srcX = 0; 
		var srcY = 4422;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}

	function drawEndSlide() {
		var srcX = 0; 
		var srcY = 2654;
		var drawX = 0; 
		var drawY = 0;
		ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);  //.drawImage built in function to draw image
	}



	/*
	function changeChar(scoreN) {
		if(jet1.score = scoreN) {
			for(var i = 0; i < enemies.length; i++) {
				enemies[i].recycleEnemy();
			}
		}
	}
	*/ 



	/*

	function changeLevel() {
		if(jet1.score === 10) {
			isNextLvl = true;
			recycleNewEnemy();
			break;
		}
	}

	function recycleNewEnemy() {
		if(isNextLvl) {
			for (var i = 0; i < enemies.length; i++) {
				enemies[i].recycleEnemy();
			}
		}
	}

	*/

	function updateText(lvl, name, pointsTill, textTill) {
		var drawLvlx = 30;
		var drawLvly = 30;
		var drawScoreX = 590;
		var drawScoreY = 30;
		var drawTillX = 520;
		var drawTilly = 62;
		ctxHUDlvl.clearRect(0,0,gameWidth,gameHeight);
		ctxHUDlvl.fillText(lvl + name, drawLvlx, drawLvly);
		ctxHUD.fillText("PPL HELPED: " + jet1.score, drawScoreX, drawScoreY);
	}

	function restartHUD() {
		changeNewLevel();
		updateText('LEVEL 1: ', 'MELBOURNE', pointLvl2, "TILL NXT LVL");
		currentLevel = 'First Level';
		enemy1.srcX = 465;    //145
		enemy1.srcY = 162; 	//502 srcX, srcY dictating what area it can draw in 
		enemy1.width = 304;
		enemy1.height = 120;
		enemy1.speed = 2;
	}

	function updateHUD() {

		changeNewLevel();
		updateText('LEVEL 1: ', 'MELBOURNE', pointLvl2, "TILL NXT LVL");
		drawHUDbgLvl(-5, 8, 270, 30);
		drawHUDbgScore(580, 8, 300, 30);
		drawHUDbgTill(510, 40, 300, 30);

		if (jet1.score >= pointLvl2) {
			updateText('LEVEL 2: ', 'STEREOSONIC', pointLvl3, "TILL NXT LVL");
			drawLvl1();
			clearCtxHUDbg();
			drawHUDbgLvl(-5, 8, 280, 30);
			drawHUDbgScore(580, 8, 300, 30);
			drawHUDbgTill(510, 40, 300, 30);
			enemy1.srcX = 195;
			enemy1.srcY = 8;
			enemy1.width = 230;
			enemy1.height = 150;
			enemy1.speed = 4;

		}
		if (jet1.score >= pointLvl3) {
			updateText('LEVEL 3: ', 'WESTERN SYDNEY', pointLvl3, "TILL NXT LVL");
			drawLvl2();
			clearCtxHUDbg();
			drawHUDbgLvl(-5, 8, 318, 30);
			drawHUDbgScore(580, 8, 300, 30);
			drawHUDbgTill(510, 40, 300, 30);
			enemy1.srcX = 427;
			enemy1.srcY = 8;
			enemy1.width = 166;
			enemy1.height = 115;
			enemy1.speed = 5;
		}
		if (jet1.score >= pointLvl4) {
			updateText('LEVEL 3: ', 'ULURU MINING COMPLEX', pointLvl3, "TILL NXT LVL");
			drawLvl3();
			clearCtxHUDbg();
			drawHUDbgLvl(-5, 8, 390, 30);
			drawHUDbgScore(580, 8, 300, 30);
			drawHUDbgTill(510, 40, 300, 30);
			enemy1.speed = 5.5;
			enemy1.srcX = 465;
			enemy1.srcY = 292;
			enemy1.width = 304;
			enemy1.height = 89;
		}

		if (jet1.score >= pointLvl5) {
			updateText('FINAL LEVEL: ', 'THE DREAMTIME', pointLvl3, "TILL NXT LVL");
			drawLvl4();
			clearCtxHUDbg();
			drawHUDbgLvl(-5, 8, 345, 30);
			drawHUDbgScore(580, 8, 300, 30);
			drawHUDbgTill(510, 40, 300, 30);
			enemy1.speed = 6;
			enemy1.srcX = 0;
			enemy1.srcY = 173;
			enemy1.width = 460;
			enemy1.height = 110;
		} 
	}

	function drawHUDbgLvl(drawX, drawY, length, height) {
		ctxHUDbg.drawImage(imgSprite,13, 292,50,40,drawX,drawY, length, height);
	}

	function clearCtxHUDbgParam(drawX, drawY, length, height) {
		ctxHUDbg.clearRect(drawX, drawY, length, height); 
	}

	function drawHUDbgScore(drawX, drawY, length, height) {
		ctxHUDbg.drawImage(imgSprite,10,292,72,40,drawX,drawY, length, height);
	}

	function drawHUDbgTill(drawX, drawY, length, height) {
	}


	function clearCtxHUDbg() {
		ctxHUDbg.clearRect(0,0,gameWidth,gameHeight); 
	} 

	/* 

		END OF MAIN FUNCTIONS

	*/


	/* 

		JET FUNCTIONS a

	*/



	function Jet() {
		this.srcX = 0;
		this.srcY = 0; // srcX, srcY dictating what area it can draw in
		this.width = 145;
		this.height = 172;
		this.speed = 4; // moves 2 pixels everytime the draw function is called, whioc 
		this.drawX = 220; //drawX, drawY dictating where it appears on the canvas 
		this.drawY = 200;
		this.noseX = this.drawX + 127; //dimensions relative to the jet draw dimenions not the dimenions of the whole sprite
		this.noseY = this.drawY + 89; 
		this.leftX = this.drawX;
		this.rightX = this.drawX + this.width;
		this.topY = this.drawY;
		this.bottomY = this.drawY + this.height; 
		this.isUpKey = false; 
		this.isRightKey = false; 
		this.isDownKey = false; 
		this.isLeftKey = false; 
		this.isSpacebar = false; 
		this.isShooting = false; 
		this.bullets = []; 
		this.currentBullet = 0; 
		for (var i = 0; i < 25; i++) { //forloop simlar to the spawnEnemy's loop. for somereason.
			this.bullets[this.bullets.length] = new Bullet(this); //??? i dont know this --- > passing in 'this' in the bullet paramater so the bullet knows which jet is belongs to 
		}
		this.score = 0; //??why here

	}

	Jet.prototype.draw = function () { //prototype is the keyword we need to share it //this its an anonymous function or sometihng, juse like 'function drawJet()' but can be shared between alot of jets
		clearCtxJet(); //so it redraws the jet every 10 milliseconds , instead of redrawing the jet over and over again.
		this.updateCoors(); //jet needs to update coors before the direction
		this.checkDirection(); 
		this.checkShooting(); //checks to see if spacebat is down
		this.drawAllBullets(); 
		ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	};

	Jet.prototype.updateCoors = function() {
		this.noseX = this.drawX + 127; //why do these coordinates match the new drawn plane?
		this.noseY = this.drawY + 89;
		this.leftX = this.drawX;
		this.rightX = this.drawX + this.width;
		this.topY = this.drawY;
		this.bottomY = this.drawY + this.height;
	} 

	Jet.prototype.checkDirection = function () { //still dont get this prototype function stuff
		if (this.isUpKey && this.topY > -60) {
			this.drawY -= this.speed; 
		}
		if (this.isRightKey && this.rightX < gameWidth - 40) {
			this.drawX += this.speed; 
		}
		if (this.isDownKey && this.bottomY < gameHeight + 60) {
			this.drawY += this.speed; 
		}
		if (this.isLeftKey && this.leftX > -60) {
			this.drawX -= this.speed; 
		}
	}; 

	Jet.prototype.drawAllBullets = function() {
		clearCtxEnemy();
		for (var i = 0; i < this.bullets.length; i++) { //as long as i 
			if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
			if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw(); //if the bullet has hit an enemy we're going to draw an explosion
		} 
	}

	Jet.prototype.checkShooting = function() {
		if (this.isSpacebar && !this.isShooting) {
			this.isShooting = true; 
			this.bullets[this.currentBullet].fire(this.noseX, this.noseY); // dont get this.currentBullet
			this.currentBullet++;
			if (this.currentBullet >= this.bullets.length) this.currentBullet = 0; //if the current bullet exceeds the bullet length array, than it will go back to 
		} else if (!this.isSpacebar) {
			this.isShooting = false;
		}
	}

	Jet.prototype.updateScore = function(points) {
		this.score += points; //taking the jets score and adding to it with the value that is passed into the parrameter
		updateHUD(); //need to update the hud so it shows the new score that we update
	}

	function clearCtxJet() {
		ctxJet.clearRect(0,0,gameWidth,gameHeight); 
	}	

	/* 
		END OF JET FUNCITONS
	*/

	/* 
		EVENT FUNCTIONS
	*/


	function checkKeyDown(e) { //e is a keyword or something we use to describe an event, whenever 
		var keyID = e.keyCode || e.which; //this is like an if statment excoet in one line // it gets the keyID from the differing ID's from different browsers. cross-browser 
		if (keyID === 38 || keyID === 87) {  //  **** Up arrow and W *****
			jet1.isUpKey = true;
			e.preventDefault(); //prevents default actions of the up and w key funcions, like scrolling up and down
		}
		if (keyID === 39 || keyID === 68) {  //  **** RIGHT & W *****
			jet1.isRightKey = true;
			e.preventDefault(); 
		}
		if (keyID === 40 || keyID === 83) {  //  **** DOWN or S *****
			jet1.isDownKey = true;
			e.preventDefault(); 
		}
		if (keyID === 37 || keyID === 65) {  //  **** LEFT or A *****
			jet1.isLeftKey = true;
			e.preventDefault(); 
		}
		if (keyID === 32) {  //  **** SPACEBAR *****
			jet1.isSpacebar = true;
			e.preventDefault(); 
		}
	} 

	function checkKeyUp(e) { 
		var keyID = e.keyCode || e.which; 
		if (keyID === 38 || keyID === 87) {  //  **** Up arrow and W *****
			jet1.isUpKey = false;
			e.preventDefault(); 
		}
		if (keyID === 39 || keyID === 68) {  //  **** RIGHT & W *****
			jet1.isRightKey = false;
			e.preventDefault(); 
		}
		if (keyID === 40 || keyID === 83) {  //  **** DOWN or S *****
			jet1.isDownKey = false;
			e.preventDefault(); 
		}
		if (keyID === 37 || keyID === 65) {  //  **** LEFT or A *****
			jet1.isLeftKey = false;
			e.preventDefault(); 
		}
		if (keyID === 32) {  //  **** SPACEBAR *****
			jet1.isSpacebar = false;
			e.preventDefault(); 
		}
	}

	function mouseNext(e) {
		mouseX = e.pageX - canvasBg.offsetLeft;
		mouseY = e.pageY - canvasBg.offsetTop;
		if (!isPlaying && notMoving === true) {
			if (btnNext.checkClicked()) {
				slide2();
			}
		}
	}

	function mouseNext2(e) {
		mouseX = e.pageX - canvasBg.offsetLeft;
		mouseY = e.pageY - canvasBg.offsetTop;
		if (!isPlaying && notMoving === true) {
			if (btnNext.checkClicked()) {
				slide3();
			}
		}
	}

	function mouseNext3(e) {
		mouseX = e.pageX - canvasBg.offsetLeft;
		mouseY = e.pageY - canvasBg.offsetTop;
		if (!isPlaying && notMoving === true) {
			if (btnNext.checkClicked()) {
				slide4();
			}
		}
	}

	function mouseClicked(e) {
		mouseX = e.pageX - canvasBg.offsetLeft;
		mouseY = e.pageY - canvasBg.offsetTop;
		if (!isPlaying && notMoving === true) {
			if (btnPlay.checkClicked()) {
				playGame();	
			}  
		}  
	} 

	function mouseRestart(e) {
		mouseX = e.pageX - canvasBg.offsetLeft;
		mouseY = e.pageY - canvasBg.offsetTop;
		if (!isPlaying && notMoving === false) {
			if (btnRestart.checkClicked()) {
				playAgain();
			}  
		}  
	}

	function mousePage(e) {
		mousePageX = e.pageX;
		mousePageY = e.pageY;
		if (mouseOffCanvas()) {
			pauseGame();
		} 

		if(mouseOnCanvas() && !isPlaying && mousePageFunction) {
			resumeGame();
		} 
		document.getElementById('mouseCoors').innerHTML = "X: " + mousePageX + " Y: " + mousePageY + " || " + "Offset Width: " + OW + " Width: " + W + " Offset Height: " + OH + " Height: " + H ;
		alert('hi');
	}

	function mouseOffCanvas() {
		var OW = canvasBg.offsetLeft;
		var W = canvasBg.width;
		var OH = canvasBg.offsetTop;
		var H = canvasBg.height;
		if (mousePageX <= OW || mousePageX >= OW + W || mousePageY <= OH || mousePageY >= OH + H) {
			return true;
		} 
	}

	function mouseOnCanvas() {
		var OW = canvasBg.offsetLeft;
		var W = canvasBg.width;
		var OH = canvasBg.offsetTop;
		var H = canvasBg.height;
		if (mousePageX >= OW && mousePageX <= OW + W && mousePageY >= OH && mousePageY <= OH + H) {
			return true;
		} 
	}





	/* 

		END OF EVENT FUNCTIONS

	*/

	/* 

		BUTTON OBJECT 

	*/

	function Button(xL, xR, yT, yB) { //i guess this isn an object
		this.xLeft = xL;
		this.xRight = xR;
		this.yTop = yT;
		this.yBottom = yB;
	}

	Button.prototype.checkClicked = function () { 
		if (this.xLeft <= mouseX && mouseX <= this.xRight &&
			this.yTop <= mouseY && mouseY <= this.yBottom) {
			return true;
		}
	};

	/*

		END OF BUTTON OBJECT

	*/

	/*
	function updateHealth(hp) {
		enemy1.health -= hp;
		updateHUD();
	}
	*/
	/* 
	ENEMY JET FUNCTION 
	*/

	function Enemy() {
		this.srcX = 465;    //145
		this.srcY = 162; 	//502 srcX, srcY dictating what area it can draw in 
		this.width = 304;
		this.height = 120;
		this.speed = 2; // moves 2 pixels everytime the draw function is called, whioc 
		this.drawX = Math.floor(Math.random() * 1000) + gameWidth; //drawX, drawY dictating where it appears on the canvas 
		this.drawY = Math.floor(Math.random() * 360); //Math.floor rounds down to the nearest integer
		this.rewardPoints = 1; //this is the amount of points our score will update by
		this.damage = 5;
		this.health = 100; 
	}

	/* OOOLD
	Enemy.prototype.draw = function () {
		this.drawX -= this.speed; 
		var character = characters[parseInt(Math.random())];
		ctxEnemy.drawImage(imgSprite,character.srcX,character.srcY,character.width,character.height,this.drawX,this.drawY,character.width,character.height);
	}
	*/


	Enemy.prototype.updateHealth = function (hp) {
		this.health -= hp;
		updateHUD();
	};

	Enemy.prototype.draw = function () { //prototype is the keyword we need to share it //this its an anonymous function or sometihng, juse like 'function drawJet()' but can be shared between alot of jets
		this.drawX -= enemy1.speed;
		//var objectddd = {wee: 145, dee: 502};
		ctxEnemy.drawImage(imgSprite,enemy1.srcX,enemy1.srcY,enemy1.width,enemy1.height,this.drawX,this.drawY,enemy1.width, enemy1.height);
		this.checkEscaped();
		//this.checkNewLvl();
	}; 


	Enemy.prototype.checkEscaped = function () { //prototype is the keyword we need to share it //this its an anonymous function or sometihng, juse like 'function drawJet()' but can be shared between alot of jets
		if((this.drawX + enemy1.width <= 0)) {
			this.recycleEnemy();
			gameOver();
			//this.jet.updateScore(enemies[i].rewardPoints);
		} 

	};


	/*

	Enemy.prototype.checkNewLvl = function () {
		while(jet1.score == 10) {
			isNextLvl = true;
			this.recycleNewEnemy();
			break;
		}
	}

	Enemy.prototype.recycleNewEnemy = function () {
		if(isNextLvl === true) {
			this.recycleEnemy();
			isNextLvl = false;
		}
	}


	*/



	Enemy.prototype.recycleEnemy = function () { //prototype is the keyword we need to share it //this its an anonymous function or sometihng, juse like 'function drawJet()' but can be shared between alot of jets
		this.drawX = Math.floor(Math.random() * 1000) + gameWidth; 
		this.drawY = Math.floor(Math.random() * 360);
	};

	function clearCtxEnemy() {
		ctxEnemy.clearRect(0,0,gameWidth,gameHeight); 
	}

	/* 
		BULLET FUNCTIONS
	*/

	function Bullet(j) {
		this.jet = j; //so the bullet can be distinctly referenced. so points can differ between enemies. im pretty sure i dont really know.
		this.srcX = 160;	
		this.srcY = 17;
		this.drawX = -20; //keeps the bullet offscreeen until we want to fire
		this.drawY = 0; 
		this.width = 33;
		this.height = 13;
		this.explosion = new Explosion;
		this.speed = 4;
	} 

	Bullet.prototype.draw = function () { 
		this.drawX += this.speed; //everytime the canvas is drawn the x coordinate will increment by 3
		ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.checkHitEnemy();
		if (this.drawX > gameWidth) {
			this.recycle; //we could have put this as 'this.drawX = -20' but we put that thing in a funciton called 'recycle'. this is so the code reads better when we read over it.
		}

	};

	Bullet.prototype.fire = function(startX, startY) {  //this function when executed will change the position of the bullet from outside the canvas to the nose
		this.drawX = startX; 
		this.drawY = startY; 
	};

	Bullet.prototype.checkHitEnemy = function () { 
		
		for (var i = 0; i < enemies.length; i++) { 
			if (this.drawX >= enemies[i].drawX + (enemies[i].width / 4) &&
				this.drawX <= enemies[i].drawX + enemies[i].width &&
				this.drawY >= enemies[i].drawY &&
				this.drawY <= enemies[i].drawY + enemies[i].height) {
					this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2) + (enemies[i].width / 2); //this line and the one below just position the explosion
					this.explosion.drawY = enemies[i].drawY;
					this.explosion.hasHit = true;
					this.recycle(); //the bullet gets recyvled
					enemies[i].recycleEnemy(); //the enemy gets recycled
					this.jet.updateScore(enemies[i].rewardPoints); //??? i dont know --> gets the enemies reward points and passes it in into the updateScore funciton
									//more info on this post http://www.youtube.com/embed/rFWGCHmjc7Y 17 mins in

			} 
		}

	}; 

	Bullet.prototype.recycle = function () { 
		this.drawX = -20; 
	}; 



	/* 

		END OF BULLET FUNCTIONS 

	*/

	/*

		EXPLOSION FUNCITONS

	*/


	function Explosion () {
		this.srcX = 607;	
		this.srcY = 23;
		this.drawX = 0; //keeps the bullet offscreeen until we want to fire
		this.drawY = 0; 
		this.width = 45;
		this.height = 42;
		this.currentFrame = 0; 
		this.hasHit = false;
		this.totalFrames = 20; //this is how long the explosion will be shown on screen
	}


	Explosion.prototype.draw = function () {  //this draw function tells the game when to stop showing the explosion function
		if (this.currentFrame <= this.totalFrames) {
			ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			this.currentFrame++;
		} else {
			this.hasHit = false; //so the explosion goes away
			this.currentFrame = 0; //so the next explosion can start up
		}
	};



	/* 

		END OF EXPLOSION FUNCTIONS

	*/ 



	/* 

		SLIDE FUNCTIONS

	*/

	

}) 


















