requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		// Libs
		jquery: 'libs/jquery-3.1.1.min',
		socketio: 'libs/socket.io',

		// Classes
		vkapi: 'classes/VKFuncs',
		gui: 'classes/GUI',
		timer: 'classes/Timer',
		db: 'classes/Database',
		statistics: 'classes/Statistics',

		// HTML5 APIs
		vibration: 'html5apis/vibration',
		notify: 'html5apis/notification',
		sw: 'html5apis/serviceWorker',

		// Game
		gameLogic: 'game/gameLogic',
		gameVariables: 'game/gameVariables',
		multiplayer: 'game/multiplayer',

		// App
		app: 'app'
	}
});

define(['app'], function (app) {

	app.init();

});