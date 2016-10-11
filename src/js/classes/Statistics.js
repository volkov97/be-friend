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

	statistics.getStatistics = function(){
		var obj = {
			rightAnswers_count: statistics.rightAnswers_count,
			mistakes_count: statistics.mistakes_count,
			game_time: timer.totalGameTime() 
		}

		console.log(obj);
		return obj;
	}

	return statistics;
})