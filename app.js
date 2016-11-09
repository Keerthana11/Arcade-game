/*
 * GAME CLASS
 */

// Create the game constructor to store the game variables
var Game = function() {
	this.gameOver = false;
	this.gameWin = false;
};

/*
 * ENEMY CLASS
 */

// Create the enemy constructor
var Enemy = function(x,y) {

	// Set the image for the enemy
	this.sprite = 'images/enemy-bug.png';

	// Set the enemy position
	this.x = x;
	this.y = y;

	// Set the speed multipler for the enemy using a random
	// number between 1 & 5
	this.multiplier = Math.floor((Math.random() * 5) + 1);

};

// Update the enemy's position and check for collisions
Enemy.prototype.update = function(dt) {

	// Set the position of the enemy based on dt and the speed multipler
	this.x = this.x + 101 * dt * this.multiplier;

	// Check for collisions with the player
	if (this.y == player.y && (this.x > player.x - 20 && this.x < player.x + 20)) {

		// Player has encountered an enemy and thus loses one life
		player.lives--;
		document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + player.lives;

		// Check to see if the player has any lives left
		if (player.lives === 0) {
			// Player is out of lives, show the game over image
			game.gameOver = true;

		} else {
			// Player still has lives left, check to see if the player
			// is currently holding a gem
			if (player.hold === true) {
				// Player is holding a gem, so find out which gem and
				// reset it to its original position
				allGems[player.gemIdx].reset();
			}

		// Reset the player to her original position
		player.reset();
		}
	}

	// If the enemy goes off of the board, reset it
	if (this.x > 750) {
		this.reset();
	}
};

// Reset the enemy to the left of the board with a new y position
// and a new speed multiplier
Enemy.prototype.reset = function() {
	this.x = -200;
	var yVals = [220, 140, 60];
	this.y = yVals[Math.floor((Math.random() * 3))];
	this.multiplier = Math.floor((Math.random() * 5) + 1);
};

// Render the enemy to the canvas
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * PLAYER CLASS
 */

// Create the Player constructor
var Player = function(x,y) {

	// Set the player to the girl in the cat hat image
	this.sprite = 'images/char-horn-girl.png';

	// Set the player's location
	this.x = x;
	this.y = y;

	// Give the player 5 lives to start
	this.lives = 5;

	// Store the original position of the player for resetting later
	this.xo = x;
	this.yo = y;

	// Set some variables related to the gems
	this.hold = false; // player is not holding a gem
	this.color = undefined; // will reflect color of currently held gem

	// If the player is holding a gem, this will be set to the index
	// of the currently held gem in allGems array
	this.gemIdx = undefined;
};

Player.prototype.handleInput = function(dir) {

	// Change the player's position based on the user keyboard input
	if (dir == 'up') {
		this.y = this.y - 80;
	} else if (dir == 'down') {
		this.y = this.y + 80;
	} else if (dir == 'left') {
		this.x = this.x - 101;
	} else if (dir == 'right') {
		this.x = this.x + 101;
	}

	// Check the position of the player
	if (this.x < 0) {
		// Player is off to the left side of the board, move the player
		// back to zero
		this.x = 0;

	} else if (this.x > 606) {
		// Player is off to the right side of the board, move the player
		// back to the right-most square (606)
		this.x = 606;

	} else if (this.y > 404) {
		// Player is off the bottom of the board
		// Reset player & gem (if the player is holding one)
		if (player.hold === true) {
			allGems[player.gemIdx].reset();
		}
		this.reset();

	} else if (this.y <= -20 && this.x > 0 && this.x < 606) {
		// Player has made it to the top colored blocks
		// Check to see if the block is the right color for the gem
		// If it is, put the gem on the block
		if (this.hold === true) {
			if (this.color === 'red' && this.x === 101) {
				allGems[0].x = 120;
				allGems[0].y = 25;
			} else if (this.color === 'orange' && this.x === 202) {
				allGems[1].x = 224;
				allGems[1].y = 25;
			} else if (this.color === 'green' && this.x === 303) {
				allGems[2].x = 325;
				allGems[2].y = 25;
			} else if (this.color === 'blue' && this.x === 404) {
				allGems[3].x = 424;
				allGems[3].y = 25;
			} else if (this.color === 'purple' && this.x === 505) {
				allGems[4].x = 524;
				allGems[4].y = 25;
			} else {

				// gem did not match the color, so reset the gem
				allGems[player.gemIdx].reset();
			}
		}

		// Check to see if the player has won the game
		var win = true;
		for (var w = 0; w < winPositions.length; w++) {
			if (allGems[w].x === winPositions[w][0] && allGems[w].y === winPositions[w][1]) {
				// gem is in the winning position, do nothing
			} else {
				// Set the win flag to false
				win = false;
			}
		}

		// If the player has won, display the game winning image
		if (win) {
			game.gameWin = true;
		}

		// Reset the player to her original location & image
		this.reset();

	} else if (this.y <= -20 && (this.x === 0 || this.x === 606)) {
		// Player made it to one of the two water blocks

		// Check to see if the player is holding a gem
		if (player.hold === true) {
			// Player is holding a gem, so find out which gem and
			// reset it to its original position
			allGems[player.gemIdx].reset();
		}

		// Lose a life and reset the player
		this.lives--;
		if (this.lives === 0) {
			// Player has no more lives left, show the game over image
			game.gameOver = true;
		} else {
			// Player still has lives left so update the lives and reset the player
			document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + this.lives;
			this.reset();
		}
	}
};

// Reset the player to her original position & image
Player.prototype.reset = function() {
	// Reset the player to the original position
	this.x = this.xo;
	this.y = this.yo;

	// Reset the image
	this.sprite = 'images/char-horn-girl.png';

	// Reset the defaults for holding gems
	this.hold = false;
	this.color = undefined;
	this.gemIdx = undefined;
};

// Update the player's position
Player.prototype.update = function() {
	this.x = this.x;
	this.y = this.y;
};

// Render the player to the canvas
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * GEM CLASS
 */

// Create the gem constructor
var gem = function(color, x, y) {

	// Set the color of the gem
	this.color = color;
	// Set the image based on the color
	this.sprite = 'images/Gem-' + color + '.png';

	// Set the starting position of the gem
	this.x = x;
	this.y = y;

	// Set the original position of the gem
	// This does not change throughout one game
	this.xo = x;
	this.yo = y;
};

// Reset the gem to its original position
gem.prototype.reset = function() {
	this.x = this.xo;
	this.y = this.yo;
};

// Updates the gem's location if the player picks it up
gem.prototype.update = function () {
	if (this.y === player.y + 65 && this.x === player.x && player.hold === false) {

		// Change the player's sprite to be the girl 'holding' the correct color gem
		player.sprite = 'images/char-horn-girl-' + this.color + '-gem.png';

		player.hold = true; // player is now holding a gem
		player.color = this.color; // player's color matches the gem's color
		player.gemIdx = gemIndex(this.color); // Index of currently held gem in allGems

		// Move the gem sprite to off of the grid so it isn't visible
		this.x = -100;
		this.y = -100;
	}
};

// Renders the gem to the canvas
gem.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * FUNCTIONS
 */

// Determine the index of a gem in the allGems array
// based on the color of the gem
var gemIndex = function(color) {
	if (color === 'red') {
		return 0;
	} else if (color === 'orange') {
		return 1;
	} else if (color === 'green') {
		return 2;
	} else if (color === 'blue') {
		return 3;
	} else if (color === 'purple') {
		return 4;
	}
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	// Pass the values to the handleInput method
	player.handleInput(allowedKeys[e.keyCode]);
});

/*
 * INSTANTIATE OBJECTS
 */

// -- Instantiate the enemies --

// Create the allEnemies array, which will hold all of the
// enemy objects
var allEnemies = [];
// Set a varaiable for the possible y values
var yVals = [220, 140, 60];

// Create the separate enemy instances
for (var i = 0; i < 5; i++) {

	// Set a starting x-position based on a random value
	var x = Math.floor((Math.random() * -1000) + 1);

	// Set a starting y-position based on a random selection
	// of the 3 possible values
	var y = yVals[Math.floor(Math.random() * 3)];

	// Create the new enemy object
	var enemy = new Enemy(x, y);

	// Push the enemy into the array
	allEnemies.push(enemy);
}

// -- Instantiate the player --
var player = new Player(303, 380);

// -- Instantiate the gems --

// Set up the possible colors, x-values, and y-values
var colors = ['red', 'orange', 'green', 'blue', 'purple'];
var xVals = [0, 101, 202, 303, 404, 505, 606];
var yValsgem = [285, 205, 125];

// Create a variable for all the possible xy locations
// This will be used to ensure only one gem occupies
// each possible spot
var xyLocations = [];

// Look through the x & y values and push each location pair
// into the xyLocations array
for (var l = 0; l < xVals.length; l++) {
	for (var n = 0; n < yValsgem.length; n++) {
		xyLocations.push([xVals[l], yValsgem[n]]);
	}
}

// Create the allGems array, which will hold all of the
// gem objects
var allGems = [];

// Create the separate gem instances
for (var j = 0; j < 5; j++) {

	// Select a random starting location for the gem
	var index = Math.floor(Math.random() * (21 - j));
	var xy = xyLocations[index];
	var x = xy[0];
	var y = xy[1];

	// Create the new Gem object
	var Gem = new gem(colors[j], x, y);

	// Push the new Gem into the array
	allGems.push(Gem);

	// Remove the xy pair from the array
	xyLocations.splice(index, 1);
}

// Set up the winning positions of the gems
var winPositions = [[120, 25], [224, 25], [325, 25], [424, 25], [524, 25]];

// -- Instantiate the game --
var game = new Game();
