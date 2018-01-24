// Game class
function Game(x, y, width, height, bgColour) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.bgColour = bgColour;

	this.holes = [];


	this.addHole = function(x, y, radius, points, bgColour) {
		this.holes.push(new Hole(
			this.x + x,
			this.y - y,
			radius,
			points,
			bgColour));
	}


	this.draw = function() {
		fill(this.bgColour);
		stroke(0);
		rect(this.x, this.y, this.width, -this.height);

		this.holes.forEach(function(hole) {
			hole.draw();
		});
	}


	// Hole class
	function Hole(x, y, radius, points, bgColour) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.points = points;
		this.bgColour = bgColour;


		this.draw = function() {
			fill(255);
			ellipse(this.x, this.y, (this.radius * 2));
		}
	}
}


