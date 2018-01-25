// Game class
function Game(x, y, width, height, bgColour) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.bgColour = bgColour;

	this.holes = [];


	this.addHole = function(rx, ry, rrad, points, bgColour) {
		if(rx <= 1 && ry <= 1 && rrad <=1) {
			this.holes.push(new Hole(
				this.x + (rx * this.width),
				this.y - (ry * this.height),
				(rrad * this.width),
				points,
				bgColour));
		}
	}


	this.draw = function(p) {
		p.fill(this.bgColour);
		p.stroke(0);
		p.rect(this.x, this.y, this.width, -this.height);

		this.holes.forEach(function(hole) {
			hole.draw(p);
		});
	}


	this.checkClick = function(x, y) {
		var points = 0;
		this.holes.some(function(hole) {
			points = hole.checkClick(x, y)
			if(points > 0) {
				return true;
			}
		});

		return points;
	}


	// Hole class
	function Hole(x, y, radius, points, bgColour) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.points = points;
		this.bgColour = bgColour;
		this.textSize = 20;

		this.clickPersistCounter = 0;


		this.draw = function(p) {
			// Draw click ring
			if(this.clickPersistCounter) {
				p.strokeWeight(0);
				p.fill(0, 255, 0, (255 * (1 - (this.clickPersistCounter / 100))));
				p.ellipse(this.x, this.y, ((this.radius) * 2 + 50));
				if(++this.clickPersistCounter > 100) {
					this.clickPersistCounter = 0;
				}
				p.strokeWeight(1);
			}

			// Draw hole
			p.fill(255);
			p.ellipse(this.x, this.y, (this.radius * 2));

			// Draw number of points
			p.stroke(0);
			p.textAlign(p.CENTER, p.CENTER);
			p.textSize(this.textSize);
			p.fill(0);
			p.text(this.points, this.x, this.y);			
		}


		this.checkClick = function(x, y) {
			var dx = this.x - x;
			var dy = this.y - y;
			var ds = Math.sqrt((dx*dx) + (dy*dy));

			if(ds < this.radius) {
				this.clickPersistCounter = 1;
				return this.points;
			}

			return 0;
		}
	}
}


