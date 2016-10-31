define(["jquery","vkapi","gameLogic","vibration","gameVariables","timer","statistics","multiplayer","chart","security","events","audio"],function(e,t,s,a,n,i,r,o,d,l,u,m){var c={};return c.login=function(){e(".authButton").addClass("loading"),t.loginUser().then(function(s){t.setId(s.user_id),o.identify(t.getUserInfo()),c.updateStatistics(),c.updateNeighbors(),e(".welcomeBlocks .rate, .about").addClass("bounceOutRight"),e(".welcomeBlocks .descr").addClass("bounceOutLeft"),setTimeout(function(){e(".welcomeBlocks .rate, .welcomeBlocks .descr, .about").addClass("hidden"),e(".stats").removeClass("hidden"),e(".stats .rate.miniTop, .charts").addClass("bounceInRight").removeClass("hidden"),e(".modes, .rate.userTopRate").addClass("bounceInLeft").removeClass("hidden"),require("events").makeSlickSlider(),require("events").setEventListenerOnWindowResize()},1e3)},function(e){alert("Rejected: "+e)})},c.drawQuestion=function(t,s){$questionText=e(".question__text"),$questionProps=e(".question__properties"),$questionAnswers=e(".question__answers");var a='<div class="question__text">'+t.questionObj.question+"</div>";a+='<div class="question__properties clearfix">',t.questionObj.withPhoto&&(a+='<div class="question__image"><img src=\''+t.rightUser.photo_200+'\' class="question__img" width="200px" height="200px" alt="Quiz Question Image"></div>'),a+='<div class="question__answers clearfix">';for(var n=0;n<t.options.length;n++)a+="<div class=question__answer>"+t.options[n]+"</div>";a+="</div>",a+="</div>",s?(e(".quizForMultiplayerGame .question").html(a),e(".quizForMultiplayerGame").hasClass("hidden")&&e(".quizForMultiplayerGame").addClass("bounceInRight").removeClass("hidden"),e(".roomInfo .waiting").hasClass("hidden")||e(".roomInfo .waiting").addClass("hidden"),require("events").addListenersToOptionsForMultiplayerGame()):(e(".quizForSingleGame .question").html(a),require("events").addListenersToOptionsForSingleGame())},c.updatePoints=function(){e("#onlinePoints").text(n.getScore())},c.updateTimer=function(){e("#onlineSeconds").text(i.getSecondsLeft())},c.endGame=function(s){if(m.finishGame(),s)e(".quizForSingleGame .question").addClass("hidden"),e("#gameResultPoints").text(n.getScore()),e(".gameResult").removeClass("hidden"),e.post("/vl/sendGameResults",{user_id:t.getId(),score:n.getScore(),statistics:r.getOneGameStatistics(),access_token:l.getToken()},function(e){c.updateTopList(),c.updateNeighbors(),c.updateStatistics()});else{e(".rate__table.roomOnline tr").each(function(s){if(0==s)return!0;var a=this.getElementsByClassName("name")[0].innerText;a==t.getUserInfo().first_name+" "+t.getUserInfo().last_name&&e("#gameResultPlace").text(this.getElementsByClassName("number")[0].innerText)});e(".quizForMultiplayerGame .question").addClass("hidden"),e(".gameResult").removeClass("hidden")}},c.updateTopList=function(){e.post("/getTopList",{number:5},function(t){for(var s='<tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr>',a=0;a<t.length;a++)s+="<tr><td class ='number'>"+(a+1)+"</td><td class='name'><a href='https://vk.com/id"+t[a].vk_id+"' target = '_blank'>"+t[a].first_name+" "+t[a].last_name+"</a></td><td class='points'>"+t[a].max_score+"</td></tr>";e(".winners").html(s)},"json")},c.updateStatistics=function(s){e.post("/vl/getStatistics",{id:t.getId(),access_token:l.getToken()},function(s){var a=r.getFullStatistics(s[0]);e(".mistakesPerGame").text(a.averageMistakesPerGame),e(".pointsPerGame").text(a.averageScorePerGame),e(".gamesPlayed").text(a.games_count),e(".oneGameTime").text(a.averageTimePerGame);var n=10;e.post("/vl/getLastGames",{id:t.getId(),num:n,access_token:l.getToken()},function(e){for(var t=[a.rightAnswers_count,a.mistakes_count,a.firstTryRightAnswers_count],s={labels:[],data:[]},n=0;n<e.rows.length;n++)s.labels[n]="Игра №"+(e.countOfGames-e.rows.length+n+1).toString(),s.data[e.rows.length-1-n]=e.rows[n].score;d.drawCharts(t,{labels:s.labels,data:s.data})},"json")},"json")},c.updateNeighbors=function(){e.post("/vl/getNeighbours",{id:t.getId(),num:5,access_token:l.getToken()},function(t){var s=t.list;if(e(".noNeighbors").addClass("hidden"),s==-1)return void e(".noNeighbors").removeClass("hidden");for(var a='<thead><tr class="tableHead"><th>№</th><th>Имя</th><th>Оценка</th></tr></thead><tbody>',n=0;n<s.length;n++)a+=t.userPos==s[n].realPos?"<tr class='currentUser'>":"<tr>",a+="<td class ='number'>"+s[n].realPos+"</td><td class='name'><a href='https://vk.com/id"+s[n].vk_id+"' target = '_blank'>"+s[n].first_name+" "+s[n].last_name+"</a></td><td class='points'>"+s[n].max_score+"</td></tr>";a+="</tbody>",e(".userTopRate table.rate__table").html(a)})},c.updateOnlinePlayersList=function(s){for(var a="",n=0;n<s.length;n++)s[n].id!=t.getUserInfo().id&&(a+="<a href='https://vk.com/id"+s[n].id+"' class='onlinePlayers__player'><img src='"+s[n].img_src+"' class='onlinePlayers__img' width='32' height='32'>"+s[n].first_name+" "+s[n].last_name+"</a>");e(".onlinePlayers__list").html(a),require("events").setEventListenerOnOnlineUsers()},c.showMultiplayerError=function(t){e(".multiplayerMode .error").text(t).removeClass("hidden")},c.showMultiplayerStartError=function(t){e(".roomInfo .error").text(t).removeClass("hidden")},c.updateOnlineRoom=function(t){e(".joinGame .errorSpan").addClass("hidden");var s=t.list;s.sort(function(e,t){return e.points<t.points?1:-1});for(var a='<tr class="tableHead"><th>№</th><th>Имя</th><th>Баллов</th></tr><tdody>',n=0;n<s.length;n++)a+="<td class ='number'>"+(n+1)+"</td><td class='name'><a href='https://vk.com/id"+s[n].id+"' target = '_blank'>"+s[n].first_name+" "+s[n].last_name+"</a></td><td class='points'>"+s[n].points+"</td></tr>";a+="</tdody>",e(".members .rate__table").html(a);var i=t.key;e(".key.styledInput input").val(i),e(".multiplayer").hasClass("hidden")&&e(".multiplayer").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass("hidden"),t.endGame&&c.endGame(!1)},c});