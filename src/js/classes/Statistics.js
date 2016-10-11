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

		var divisionByZero;
		if (data['COUNT(*)'] == 0){
			divisionByZero = 1;
		} else {
			divisionByZero = 0;
		}

		var obj = {
			games_count: data['COUNT(*)'],
			rightAnswers_count: data['SUM(hits)'],
			mistakes_count: data['SUM(misses)'],
			maxScore: data['MAX(score)'],
			averageScorePerGame: data['SUM(score)'] / (data['COUNT(*)'] + divisionByZero),
			averageTimePerGame: data['SUM(game_time)'] / (data['COUNT(*)'] + divisionByZero),
			averageMistakesPerGame: data['SUM(misses)'] / (data['COUNT(*)'] + divisionByZero)
 		}

		return obj;
	}

	return statistics;
})