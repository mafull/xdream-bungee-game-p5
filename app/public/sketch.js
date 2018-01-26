// --------------------------------------------------------------------------------
//  Settings
// --------------------------------------------------------------------------------
const DEBUG_MODE = false;

const SERIAL_PORT = "COM4";

const SCALE = 2.5;
const TIME_LIMIT = 30000000;

const XD_COLOUR = "#222222";

// --------------------------------------------------------------------------------
//  Requirements
// --------------------------------------------------------------------------------
const electron    = require("electron"),
      SerialPort  = require("serialport"),
      fs          = require("fs");
console.log(SerialPort);

// --------------------------------------------------------------------------------
//  Serial stuff
// --------------------------------------------------------------------------------
var serialPort;
SerialPort.list(function(err, ports) {
	console.log("Available serial ports:");
	console.log(ports);

	serialPort = new SerialPort(
		ports[0].comName,
		{
			baudRate: 9600
		});
		serialPort.on("open", function() {
		console.log("Serial port opened");
		serialPort.on("data", function(data) {
			// var num = String.fromCharCode(data);
			// console.log("data:" + data + " num:" + num);
			
			if(game) {
				var points = game.hitHole(data);
				if(points && user != null) {
					var totalPoints = user.addPoints(points);
					$("#scoreText")[0].textContent = "Score: " + totalPoints;
				}
			}
		});
	});
});


// --------------------------------------------------------------------------------
//  Other code
// --------------------------------------------------------------------------------
const BOARD_WIDTH = 200 * SCALE;
const BOARD_HEIGHT = 300 * SCALE;

var canvas;
var canvasWidth, canvasHeight;

var sketch;
var leaderboard;
var game;

var user;

var countdownTimer;
var secondsRemaining;

var inData = "";


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
		game.addHole(0.23, 0.52, 0.17, 5, "#0F0");
		game.addHole(0.7, 0.8, 0.12, 10, "#0F0");
		game.addHole(0.84, 0.17, 0.098, 15, "#0F0");
		game.addHole(0.1, 0.12, 0.013, 1000, "#0F0");
		game.addHole(0.65, 0.56, 0.05, 50, "#0F0");
		game.addHole(0.2, 0.8, 0.07, 30, "#0F0");
		game.addHole(0.87, 0.44, 0.085, 20, "#0F0");
		game.addHole(0.9, 0.93, 0.025, 200, "#0F0");
		game.addHole(0.35, 0.25, 0.085, 20, "#0F0");
	}


	p.draw = function() {
		p.background(200);

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
	$("#countdownText")[0].textContent = "Time remaining: " + TIME_LIMIT + "s";
	$("#currentUserSegment")[0].style.display = "block";
	$("#haveAGoSegment")[0].style.display = "block";

	// Start the countdown timer
	secondsRemaining = TIME_LIMIT;
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
	$("#haveAGoSegment")[0].style.display = "none";
	$("#currentUserSegment")[0].style.display = "none";
	$("#canvasContainer")[0].style.display = "none";
	$("#formContainer")[0].style.display = "block";

	// Save to file
	appendToFile(leaderboard.users[leaderboard.users.length - 1].getCSV());
}


function appendToFile(text) {
	var stream = fs.createWriteStream("./leaderboard.csv", {flags: "a"});
	stream.write(text + "\n");
	stream.end();
}