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
		events: 'classes/Events',
		timer: 'classes/Timer',
		statistics: 'classes/Statistics',
		chart: 'classes/Chart',
		security: 'classes/Security',
		bufferLoader: 'classes/BufferLoader',

		// HTML5 APIs
		vibration: 'html5apis/vibration',
		notify: 'html5apis/notification',
		sw: 'html5apis/serviceWorker',
		fullscreen: 'html5apis/screenfull',
		audio: 'html5apis/audio',

		// Game
		gameLogic: 'game/gameLogic',
		gameVariables: 'game/gameVariables',
		multiplayer: 'game/multiplayer',

		// App
		app: 'app'
	},
	shim: {
		'jquery.md5': ['jquery'],
		'jquery.cookie': ['jquery']
	}
});

define(
	[
		'app'
	], function (
		app
	) {

	app.init();

});