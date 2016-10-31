define(["jquery","gui","multiplayer","gameVariables","statistics","vibration","vkapi","timer","gameLogic","fullscreen","audio","slick"],function(e,t,n,o,s,i,r,a,u,l,c,d){function f(i){return new Promise(function(r,u){var l=e(".startSingleGameButton"),c=(e(".createRoomButton"),e(".joinRoomButton"),e(".quizForSingleGame")),d=e(".multiplayer"),f=e(".quizForMultiplayerGame"),m=e(".roomInfo .forCreator"),h=e(".roomInfo .forUser"),g=e(".gameResult"),v=e(".questionWrap .question"),p=!1;i.prop("disabled",!0),c.hasClass("hidden")||(p=!0,c.removeClass("bounceInLeft").addClass("bounceOutRight"),setTimeout(function(){c.addClass("hidden"),g.hasClass("hidden")||(g.addClass("hidden"),v.removeClass("hidden")),i.prop("disabled",!1),r()},1e3)),d.hasClass("hidden")||(p=!0,d.removeClass("bounceInLeft").addClass("bounceOutRight"),n.getRoom()&&n.clearRoom(),setTimeout(function(){d.addClass("hidden"),f.removeClass("bounceInRight").addClass("hidden"),m.removeClass("hidden"),h.addClass("hidden"),g.hasClass("hidden")||(g.addClass("hidden"),v.removeClass("hidden")),i.prop("disabled",!1),r()},1e3)),l.is(i)||l.text("Начать"),e(".multiplayerMode .error").addClass("hidden"),e(".roomInfo .error").addClass("hidden"),s.resetStatistic(),a.reset(),t.updateTimer(),o.resetScore(),p||(i.prop("disabled",!1),r())})}var m={slickActive:!1};return m.setAuthButtonOffline=function(){e(".authButton").text("Offline").addClass("offline")},m.connectHeaderButtons=function(){m.setEventListenerOnAuth(),m.triggerSound(),m.share(),m.triggerFullscreen()},m.share=function(){e(".controls .share a").click(function(e){if(void 0!==navigator.share)return e.preventDefault(),navigator.share({title:"BeFriend",text:"Наше приложение позволит Вам сблизиться со всеми вашими знакомыми и заводить настоящих друзей. Мы поможем Вам узнать знакомых намного лучше, а также обнаружить у них Ваши общие интересы. Все это сделает из Вас внимательного, привлекательного в общении человека.",url:"https://befriend.herokuapp.com"}).then(function(){console.log("Successful share")}).catch(function(){console.log("Error sharing:",error)}),!1})},m.triggerFullscreen=function(){screenfull.enabled&&document.addEventListener(screenfull.raw.fullscreenchange,function(){screenfull.isFullscreen?e(".controls .fullscreen svg use").attr("xlink:href","#fullscreenExit"):e(".controls .fullscreen svg use").attr("xlink:href","#fullscreenEnter")}),e(".controls .fullscreen a").click(function(e){return e.preventDefault(),screenfull.enabled?screenfull.toggle():alert("Полноэкранный режим не поддерживается на Вашем устройстве."),!1})},m.triggerSound=function(){c.isSupported()||e(".controls .sound svg use").attr("xlink:href","#soundOff"),e(".controls .sound a").click(function(t){return t.preventDefault(),c.isSupported()&&(c.isTurnedOn()?(e(".controls .sound svg use").attr("xlink:href","#soundOff"),c.turnOff()):(e(".controls .sound svg use").attr("xlink:href","#soundOn"),c.turnOn())),!1})},m.makeSlickSlider=function(){e(window).width()<=992&&(e(".modes .row").slick({slidesToShow:1,dots:!0,prevArrow:!1,nextArrow:!1,infinite:!1}),m.slickActive=!0)},m.setEventListenerOnWindowResize=function(){e(window).resize(function(){m.slickActive?e(window).width()>992&&(e(".modes .row").slick("unslick"),m.slickActive=!1):m.makeSlickSlider()})},m.setEventListenerOnAuth=function(){e(".authButton").click(function(e){t.login(),m.setEventListenerOnSingleGame(),m.setEventListenerOnOnlineUsers(),m.setEventListenerOnSearchPlayers(),m.setEventListenerOnCreateRoom(),m.setEventListenerOnJoinRoom(),m.setEventListenerOnStartRoom(),m.setEventListenersOnNotifications()})},m.setEventListenerOnSearchPlayers=function(){e(".searchUsersInput").keyup(function(t){e(".onlinePlayers .onlinePlayers__player").addClass("hidden").filter(function(){return e(this).text().indexOf(e(".searchUsersInput").val())!=-1}).removeClass("hidden")})},m.setEventListenerOnSingleGame=function(){e(".startSingleGameButton").click(function(n){return n.preventDefault(),f(e(".startSingleGameButton")).then(function(){e(".startSingleGameButton").text("Заново"),t.drawQuestion(u.makeNewQuestion()),e(".quizForSingleGame").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass("hidden"),a.start()}),!1})},m.setEventListenerOnCreateRoom=function(){e(".createRoomButton").click(function(t){return t.preventDefault(),f(e(this)).then(function(){n.createRoom(r.getUserInfo().id),e(".multiplayer").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass("hidden")}),!1})},m.setEventListenerOnJoinRoom=function(){e(".joinRoomButton").click(function(t){return t.preventDefault(),f(e(".joinRoomButton")).then(function(){return""==e(".joinGameSecret").val()?(require("gui").showMultiplayerError("Введите секретный код."),!1):(n.getRoom()&&n.clearRoom(),n.joinRoom(e(".joinGameSecret").val()),e(".roomInfo .forCreator").addClass("hidden"),void e(".roomInfo .forUser").removeClass("hidden"))}),!1})},m.setEventListenerOnStartRoom=function(){e(".startRoomButton").click(function(t){return t.preventDefault(),""==e("#winPoints").val()?(require("gui").showMultiplayerStartError("Введите победные очки."),!1):(e(".roomInfo .error").addClass("hidden"),n.setRoomOptions(n.getRoom(),{maxScore:e("#winPoints").val()}),n.getNewQuestion(n.getRoom()),e(".startRoomButton").addClass("hidden"),!1)})},m.setEventListenerOnOnlineUsers=function(){e(".onlinePlayers__player").click(function(t){t.preventDefault();var o=e(this);return f(e(".onlinePlayers__player")).then(function(){var t=n.createRoom(r.getUserInfo().id);n.sendRequestTo(o.attr("href").slice(17),t),e(".multiplayer").removeClass("bounceOutRight").addClass("bounceInLeft").removeClass("hidden")}),!1})},m.setEventListenersOnNotifications=function(){e("body").on("click",".gameRequest .notification__close, .gameRequest .notification__activities .reject",function(t){t.preventDefault();var n=e(this).closest(".notification");return n.removeClass("bounceInUp").addClass("bounceOutDown"),setTimeout(function(){n.addClass("hidden").remove()},1e3),!1}),e("body").on("click",".gameRequest .notification__activities .confirm",function(t){t.preventDefault();var o=e(this).closest(".notification"),s=o.find(".notification__text").text(),i=s.lastIndexOf("(")+6,r=s.lastIndexOf(")"),a=s.substring(i,r);return f(e(this)).then(function(){n.getRoom()&&n.clearRoom(),n.joinRoom(a),e(".roomInfo .forCreator").addClass("hidden"),e(".roomInfo .forUser").removeClass("hidden")}),o.removeClass("bounceInUp").addClass("bounceOutDown"),setTimeout(function(){o.addClass("hidden").remove()},1e3),!1})},m.addListenersToOptionsForSingleGame=function(){e(".question__answer").each(function(n){e(this).click(function(){e(this).text().indexOf(u.getRightAnswer())!=-1?(e(this).addClass("right"),c.correctAnswer(),o.addPoints(),1==o.getIsFirstTryValue()?s.incFirstTryRightAnswers():o.setIsFirstTryValue(!0),t.updatePoints(),t.updateTimer(),s.incRightAnswers_count(),0==e(".question__answer.wrong").length&&(a.addTime(),t.updateTimer()),t.drawQuestion(u.makeNewQuestion())):(i.vibrate(100),e(this).addClass("wrong"),c.wrongAnswer(),o.subtractPoints(),o.setIsFirstTryValue(!1),a.substractTime(),t.updateTimer(),t.updatePoints(),s.incMistakes_count())})})},m.addListenersToOptionsForMultiplayerGame=function(){e(".question__answer").each(function(t){e(this).click(function(){e(this).text().indexOf(u.getRightAnswer())!=-1?(e(this).addClass("right"),c.correctAnswer(),o.addPoints(),s.incRightAnswers_count(),n.answer({vk_id:r.getUserInfo().id,points:o.getPointsForRight(),roomName:n.getRoom(),right:!0})):(i.vibrate(100),e(this).addClass("wrong"),c.wrongAnswer(),o.subtractPoints(),s.incMistakes_count(),n.answer({vk_id:r.getUserInfo().id,points:o.getPointsForWrong(),roomName:n.getRoom(),right:!1}))})})},m});