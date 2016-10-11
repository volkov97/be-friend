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

		// Game
		gameLogic: 'game/gameLogic',
		gameVariables: 'game/gameVariables',
		multiplayer: 'game/multiplayer'
	}
});

define(['jquery', 'multiplayer', 'gui'], function ($, onlineUser, gui) {

	onlineUser.connect();

	$(".authButton").click(function(event) {
		gui.login();
	});

	$('.startSingleGameButton').click(function(event) {
		gui.singleGame();
	});

});