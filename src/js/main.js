requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		vkapi: 'classes/VKFuncs',
		gui: 'classes/GUI',
		timer: 'classes/Timer',
		db: 'classes/Database',

		vibration: 'html5apis/vibration',

		gameLogic: 'game/gameLogic',
		gameVariables: 'game/gameVariables'
	}
});

define(['gui'], function (gui) {

	$(".authButton").click(function(event) {
		gui.login();
	});

	$('.startSingleGameButton').click(function(event) {
		gui.singleGame();
	});

});