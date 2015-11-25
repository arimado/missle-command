(function () {

	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');

	// Game factory functions
	function GameObject(name, conf) {
		var gameObj = {
			name: name,
			updatingElements : [],
			renderingElements: [],
			renderContext: conf.renderContext,
			config: conf.config
		};
		return gameObj;
	}

	function gameElement(gameObj, conf) {
		function factory () {
			var element = {};
			var state = {};
			if (typeof conf.init === 'function') {
				conf.init(state);
			}

			element.state = state;
			element.name = conf.name;
			element.update = conf.updates;
			element.render = conf.render;

			if (typeof element.update === 'function') {
				gameObj.updatingElements.push(element);
			}
			if  (typeof element.render === 'function') {
				gameObj.renderingElements.push(element);
			}
			return element;
		}
		return factory;
	}

	// Create game instance
	var game = GameObject('Missile Command', {
		renderContext: ctx,
		config: {
			width: 500,
			height: 400,	
		}
	});

	// Define game elements
	var Scene = gameElement(game, {
		name: 'Scene',
		init: function (state) {
			state.width = 500;
			state.height = 400;
		},
		update: function (state, delta) {
			// Background gradient
		},
		render: function (state, context) {
			context.clearRect(0, 0, state.width, this.state.height);
		}
	});

	function randomColour() {
		return 'rgb(' + ((Math.random() * 255)) + ', ' + (Math.random() * 255) + ', ' + (Math.random() * 255) +')';
	}

	var IncomingMissile = gameElement(game, {
		name: 'Incoming Missile',
		init: function (state) {
			state.fillStyle = randomColour();
			state.positionX = Math.random() * 300;
			state.positionY = Math.random() * 100;
		},
		update: function (state, delta) {
			state.positionY -= 0.1 * Math.sin(delta);
		},
		render: function (state, context) {
			context.fillStyle = state.fillStyle;
			context.fillRect(state.positionX, state.positionY, 55, 50);
		}
	});

	var DefenseMissile = gameElement(game, {
		name: 'Defense Missile',
		init: function (state) {
			state.fillStyle = 'rgba(245,0,0,0.5)';
			state.positionX = 0;
			state.positionY = 330;
		},
		update: function (state, delta) {
			state.positionX -= 0.5 * Math.sin(delta);
		},
		render: function (state, context) {
			context.fillStyle = state.fillStyle;
			context.fillRect(state.positionX, state.positionY, 55, 50);
		}
	});


	// Create game elements
	var scene = Scene();
	var enemy1 = IncomingMissile();
	var enemy2 = IncomingMissile();
	var defense1 = DefenseMissile();


	// Game loop functions
	function update(gameObj, delta) {
		gameObj.updatingElements.forEach(function (element) {
			element.update(element.state, delta);
		});
	}

	function render(gameObj) {
		gameObj.renderingElements.forEach(function (element) {
			element.render(element.state, gameObj.renderContext);
		});
	}

	var gameLoopDelta = 0;
	var lastFrameTimeMs = 0;
	function gameLoop(timestamp) {
		gameLoopDelta = timestamp - lastFrameTimeMs;
	    lastFrameTimeMs = timestamp;
	    
		update(game, gameLoopDelta);
		render(game);
		requestAnimationFrame(gameLoop);
	}
	 
	// Start things off
	requestAnimationFrame(gameLoop);


})();