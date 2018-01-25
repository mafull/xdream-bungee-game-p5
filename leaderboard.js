var table;
var file;


function preload() {
	//table = loadTable("./assets/leaderboard.csv", "csv", "header");

	// Check for File API support
	// if(window.File && window.FileReader && window.FileList && window.Blob) {
	// 	console.log("File shit should be okay!");
	// } else {
	// 	alert("The File APIs are not fully supported in this browser!");
	// }

	// var fr = new FileReader();
	// fr.onload = function


}


function Leaderboard() {
	this.users = [];


	this.addUser = function(user) {
		this.users.push(user);
	}


	this.draw = function() {
		stroke(255);
		strokeWeight(5);
		line(200, 200, 200, 400);
		strokeWeight(2);

		var index = 1;
		this.users.forEach(function(user) {
			var yPos = (index++) * 30;
			text(user.name, 400, yPos);
			text(user.points, 600, yPos);
		});
	}


	this.getUsersForTable = function(all) {
		if(all) {
			var usersTableInfo = [];

			var index = 0;
			this.users.forEach(function(user) {
				usersTableInfo.push({
					name: user.name,
					score: user.points
				});
			});

			return usersTableInfo;
		} else {
			var user = this.users[this.users.length - 1];
			
			return {
				name: user.name,
				score: user.points
			};
		}
	}

	this.getCSV = function() {
		var csv = "";
		this.users.foreach(function(user) {
			csv += user.getCSV();
			csv += "\n\t";
		});

		return csv;
	}
}


function User(name, phone) {
	this.name = name;
	this.phone = phone;

	this.points = 0;


	this.addPoints = function(points) {
		this.points += points;
		return this.points;
	}

	
	this.getCSV = function() {
		return this.name + "," + this.phone + "," + this.points;
	}
}