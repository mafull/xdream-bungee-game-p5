const 	electron 	= require("electron"),
		url 		= require("url"),
		path 		= require("path");

const {app, BrowserWindow, ipcMain} = electron;


let mainWindow;

// Listen for app to be ready
app.on("ready", function() {
	// Create new window
	mainWindow = new BrowserWindow({});
	mainWindow.setFullScreen(true);

	// Quit app when closed
	mainWindow.on("closed", function() {
		app.quit();
	});

	// Disable the menu
	mainWindow.setMenu(null);

	// Load HTML into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "html/index.html"),
		protocol: "file",
		slashes: true,
		icon: path.join(__dirname, "assets/icons/win/xdlogo.png.ico")
	}));

	// Open dev tools if not in production
	//mainWindow.webContents.openDevTools();
});