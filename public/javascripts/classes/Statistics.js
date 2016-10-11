define(['timer'], function(timer){

	var statistics = {
		rightAnswers_count: 0,
		mistakes_count: 0,
	}

	statistics.resetStatistic = function(){
		statistics.rightAnswers_count = 0;
		statistics.mistakes_count = 0;
	}

	statistics.incRightAnswers_count = function(){
		statistics.rightAnswers_count++;
	}

	statistics.incMistakes_count = function(){
		statistics.mistakes_count++;
	}

	statistics.getOneGameStatistics = function(){
		var obj = {
			rightAnswers_count: statistics.rightAnswers_count,
			mistakes_count: statistics.mistakes_count,
			game_time: timer.getTotalGameTime()
		}

		return obj;
	}

	statistics.getFullStatistics = function(data){

		var obj = {};

		obj.games_count = data['COUNT(*)'];
		obj.rightAnswers_count = data['SUM(hits)'];
		obj.mistakes_count = data['SUM(misses)'];
		obj.maxScore = data['MAX(score)'];

		if (data['COUNT(*)'] == 0){
			obj.averageScorePerGame = 0;
			obj.averageTimePerGame = 0;
			obj.averageMistakesPerGame = 0;
		} else {
			obj.averageScorePerGame = data['SUM(score)'] / data['COUNT(*)'];
			obj.averageTimePerGame = data['SUM(game_time)'] / data['COUNT(*)'];
			obj.averageMistakesPerGame = data['SUM(misses)'] / data['COUNT(*)'];
		}

		if (obj.rightAnswers_count + obj.mistakes_count == 0){
			obj.rightAnswers_percent = 0;
		} else {
			obj.rightAnswers_percent = (obj.rightAnswers_count/(obj.rightAnswers_count + obj.mistakes_count)) * 100 + "%";
		}

		return obj;
	}

	return statistics;
})