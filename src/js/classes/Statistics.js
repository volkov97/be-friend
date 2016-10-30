define(
	[
		'timer'
	],
	function(
		timer
	) {

	// Statistics info
	var statistics = {
		rightAnswers_count: 0,
		mistakes_count: 0,
		firstTryRightAnswers_count: 0
	}

	statistics.resetStatistic = function(){
		statistics.rightAnswers_count = 0;
		statistics.mistakes_count = 0;
		statistics.firstTryRightAnswers_count = 0;
	}

	statistics.incRightAnswers_count = function(){
		statistics.rightAnswers_count++;
	}

	statistics.incMistakes_count = function(){
		statistics.mistakes_count++;
	}

	statistics.incFirstTryRightAnswers = function(){
		statistics.firstTryRightAnswers_count++;
	}

	/**
	 * Returns information about last game
	 * @returns {{rightAnswers_count: number, mistakes_count: number,
	 *            game_time, firstTryRightAnswers_count: number
	 *           }}
	 */
	statistics.getOneGameStatistics = function(){
		var obj = {
			rightAnswers_count: statistics.rightAnswers_count,
			mistakes_count: statistics.mistakes_count,
			game_time: timer.getTotalGameTime(),
			firstTryRightAnswers_count: statistics.firstTryRightAnswers_count
		}

		return obj;
	}

	/**
	 * Structures data from database and calculate average values
	 * @param data statistics data from database
	 */
	statistics.getFullStatistics = function(data){

		var obj = {};

		obj.games_count = data['COUNT(*)'];
		obj.rightAnswers_count = data['SUM(hits)'];
		obj.firstTryRightAnswers_count = data['SUM(first_try_hits)'];
		obj.mistakes_count = data['SUM(misses)'];
		obj.maxScore = data['MAX(score)'];

		if (data['COUNT(*)'] == 0){
			obj.averageScorePerGame = 0;
			obj.averageTimePerGame = 0;
			obj.averageMistakesPerGame = 0;
		} else {
			obj.averageScorePerGame = Math.round(data['SUM(score)'] / data['COUNT(*)'] * 100) / 100;
			obj.averageTimePerGame = Math.round(data['SUM(game_time)'] / data['COUNT(*)'] * 100) / 100;
			obj.averageMistakesPerGame = Math.round(data['SUM(misses)'] / data['COUNT(*)'] * 100) / 100;
		}

		if (obj.rightAnswers_count + obj.mistakes_count == 0){
			obj.rightAnswers_percent = 0;
		} else {
			obj.rightAnswers_percent = Math.round((obj.rightAnswers_count/(obj.rightAnswers_count + obj.mistakes_count))
					* 10000)/100 + "%";
		}

		return obj;
	}

	return statistics;
})