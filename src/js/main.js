requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		// Libs
		jquery: 'libs/jquery-3.1.1.min',
		socketio: 'libs/socket.io',
		chartLib: 'libs/Chart.min',

		// Classes
		vkapi: 'classes/VKFuncs',
		gui: 'classes/GUI',
		timer: 'classes/Timer',
		statistics: 'classes/Statistics',
		chart: 'classes/Chart',

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