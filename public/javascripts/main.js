requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		// Libs
		jquery: 'libs/jquery-3.1.1.min',
		jquery_cookie: 'libs/jquery.cookie',
		jquery_md5: 'libs/jquery.md5',
		slick: 'libs/slick.min',
		socketio: 'libs/socket.io',
		chartLib: 'libs/Chart.min',
		promise: 'libs/promise.min',

		// Classes
		vkapi: 'classes/VKFuncs',
		gui: 'classes/GUI',
		events: 'classes/GUI_events',
		timer: 'classes/Timer',
		statistics: 'classes/Statistics',
		chart: 'classes/Chart',
		security: 'classes/Security',

		// HTML5 APIs
		vibration: 'html5apis/vibration',
		notify: 'html5apis/notification',
		sw: 'html5apis/serviceWorker',
		fullscreen: 'html5apis/screenfull',

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