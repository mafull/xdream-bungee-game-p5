// Include additional files
var script = document.createElement("script");
script.src = "./game.js";
document.head.appendChild(script);


const XD_COLOUR = "#222222";

const BOARD_WIDTH = 520;
const BOARD_HEIGHT = 780;


var canvas;
var canvasWidth, canvasHeight;

var game;

function setup() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	canvas = createCanvas(canvasWidth, canvasHeight);

	game = new Game(
		400, 850,
		BOARD_WIDTH, BOARD_HEIGHT,
		XD_COLOUR);

	game.addHole(50, 80, 20, 15, "#0F0");
	game.addHole(300, 380, 40, 5, "#0F0");
}


function draw() {
	background(200);
	game.draw();
}


window.onresize = function() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	canvas.size(canvasWidth, canvasHeight);
}