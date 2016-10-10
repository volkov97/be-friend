/*************************************************************************/
/*************************************************************************/
/****************************** VARIABLES ********************************/
/*************************************************************************/
/*************************************************************************/
/*
var config = {
	selectors: {
		authButton: ".authButton",
		openButton: ".openButton",
		betaErrorList: ".beta-errorsList",
		betaFirstScreen: ".beta-firstScreen",
		startButton: ".startButton",
		quiz: ".quiz",
		questionBlock: ".question",
		question__text: ".question__text",
		question__properties: ".question__properties",
		question__answers: ".question__answers",
		question__answer: ".question__answer",
		question__img: ".question__img"
	},
	gameTimeOut: 90000
};

var userObj;
var friends;
var stringOfUserIDs;
var questionNumbersToSelect = [];

window.game = {};
window.game.score = 0;
window.gui = new GUI();
window.db = new Database();
window.logger = new Logger();
window.logger.turnLoggerOff();

var startButton = $(config.selectors.startButton);
var questionBlock = $(config.selectors.questionBlock);
var openButton = $(config.selectors.openButton);
var authButton = $(config.selectors.authButton);
*/

requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		// the left side is the module ID,
		// the right side is the path to
		// the jQuery file, relative to baseUrl.
		// Also, the path should NOT include
		// the '.js' file extension. This example
		// is using jQuery 1.9.0 located at
		// js/lib/jquery-1.9.0.js, relative to
		// the HTML page.
		jquery: 'jquery-3.1.1.min',
		vkapi: 'vkAPI/vkFuncs',
		gui: 'classes/GUI',
		gameLogic: 'game/gameLogic',
		gameVariables: 'game/gameVariables',
		vibration: 'html5apis/vibration',
		timer: 'classes/Timer',
		db: 'classes/Database'
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