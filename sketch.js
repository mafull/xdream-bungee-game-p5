// Include additional files
var script = document.createElement("script");
script.src = "./game.js";
document.head.appendChild(script);
script = document.createElement("script");
script.src = "./leaderboard.js";
document.head.appendChild(script);


const DEBUG_MODE = true;
const SCALE = 2.5;
const TIMER = 5;

const XD_COLOUR = "#222222";

const BOARD_WIDTH = 200 * SCALE;
const BOARD_HEIGHT = 300 * SCALE;


var canvas;
var canvasWidth, canvasHeight;

var sketch;
var leaderboard;

var user;

var countdownTimer;
var secondsRemaining;

var sketch = function(p) {

	p.setup = function() {
		// Initialise the canvas
		canvasWidth = BOARD_WIDTH + 100;
		canvasHeight = BOARD_HEIGHT + 100;
		canvas = p.createCanvas(canvasWidth, canvasHeight);

		// Set the frame rate - used for animations
		p.frameRate(60);

		// Initialise the game
		game = new Game(
			50, (canvasHeight - 50),
			BOARD_WIDTH, BOARD_HEIGHT,
			XD_COLOUR);

		// Add holes to the game
		game.addHole(0.1, 0.1, 0.05, 15, "#0F0");
		game.addHole(0.5, 0.7, 0.15, 5, "#0F0");
		game.addHole(0.75, 0.25, 0.2, 2, "#0F0");
	}


	p.draw = function() {
		//p.background(200);

		// Draw the game board
		game.draw(p);
	}


	p.mouseClicked = function() {
		if(DEBUG_MODE) {
			var clickPoints = game.checkClick(p.mouseX, p.mouseY);
			if(clickPoints && user != null) {
				var totalPoints = user.addPoints(clickPoints);
				$("#scoreText")[0].textContent = "Score: " + totalPoints;
			}
		}
	}
};


function startButtonPressed() {
	var name = $("#inputName")[0].value;
	var number = $("#inputNumber")[0].value;

	// Check that the form inputs aren't empty
	if(!name.length || !number.length) {
		return;
	}

	// Clear the inputs ready for next time
	$("#inputName")[0].value = "";
	$("#inputNumber")[0].value = "";

	// Create a new user with the form details
	user = new User(name, number);
	if(!leaderboard) {
		leaderboard = new Leaderboard();
	}
	leaderboard.addUser(user);

	// Hide the form and leaderboard
	$("#formContainer")[0].style.display = "none";

	// Start the game
	sketch = new p5(sketch, "container");
	$("#canvasContainer")[0].style.display = "block";
	$("#scoreText")[0].textContent = "Score: 0";
	$("#countdownText")[0].textContent = "Time remaining: " + TIMER + "s";
	$("#currentUserSegment")[0].style.display = "block";

	// Start the countdown timer
	secondsRemaining = TIMER;
	countdownTimer = window.setInterval(function() {
		secondsRemaining--;
		$("#countdownText")[0].textContent = "Time remaining: " + secondsRemaining + "s";

		if(secondsRemaining == 0) {
			window.clearInterval(countdownTimer);
			finishButtonPressed();
		}
	}, 1000);
}


function newUserButtonPressed() {
	console.log("NEW USER");

	currentUser = new User("Max Fuller", "123");
	leaderboard.addUser(currentUser);
}


function finishButtonPressed() {
	window.clearInterval(countdownTimer);

	var table = $("#leaderboardTable")[0];

	// Delete existing table body
	if(table.tBodies[0]) {
		table.removeChild(table.tBodies[0]);
	}

	// Create a new, blank table body
	var body = table.createTBody();

	// Sort user data
	var users = leaderboard.getUsersForTable(true);
	users.sort(function(a, b) {return (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0);} );

	var toShow = users.length < 5 ? users.length :5;
	for(var i = 0; i < toShow; i++) {
		var tr = body.insertRow();
		tr.insertCell().textContent = i+1;
		tr.insertCell().textContent = users[i].name;
		tr.insertCell().textContent = users[i].score;
	}

	sketch = null;
	$("#currentUserSegment")[0].style.display = "none";
	$("#canvasContainer")[0].style.display = "none";
	$("#formContainer")[0].style.display = "block";
}