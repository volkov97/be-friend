requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		// Libs
		jquery: 'libs/jquery-3.1.1.min',

		// Classes
		vkapi: 'classes/VKFuncs',
		gui: 'classes/GUI',
		timer: 'classes/Timer',
		db: 'classes/Database',

		// HTML5 APIs
		vibration: 'html5apis/vibration',

		// Game
		gameLogic: 'game/gameLogic',
		gameVariables: 'game/gameVariables'
	}
});

define(['jquery', 'gui'], function ($, gui) {

	$(".authButton").click(function(event) {
		gui.login();
	});

	$('.startSingleGameButton').click(function(event) {
		gui.singleGame();
	});

});