define([],function(){function e(){if(0==t.length)for(var e=0;e<s.length;e++)t[e]=e;var a=Math.round(Math.random()*(t.length-1)),i=t[a];return t.splice(a,1),i}var t=[],s=[{question:"Кто из ваших друзей изображен на этом фото?",withPhoto:!0,users_available:[],chooseOptions:function(){var e=Math.ceil(2*Math.random());return this.users_available=this.users_available.filter(function(t){return t.sex==e}),this.users_available.sort(function(e,t){return Math.random()-.5}),a.setRightAnswer(this.users_available[0].first_name+" "+this.users_available[0].last_name),[this.users_available[0],a.getRightAnswer(),this.users_available[1].first_name+" "+this.users_available[1].last_name,this.users_available[2].first_name+" "+this.users_available[2].last_name,this.users_available[3].first_name+" "+this.users_available[3].last_name]},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.photo_200||-1!=e.photo_200.indexOf("camera_200"))})}},{question:"Из какого города человек, изображенный на фото?",withPhoto:!0,users_available:[],chooseOptions:function(){for(var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=this.users_available.map(function(e){return e.cityName}),s=[],i=0;i<t.length;i++){for(var n=0,r=0;r<s.length;r++)if(t[i]==s[r]){n=1;break}0==n&&s.push(t[i])}s=s.filter(function(t){return t!=e.cityName}),s.sort(function(e,t){return Math.random()-.5});var l=[e,e.cityName,s[0],s[1],s[2]];return a.setRightAnswer(e.cityName),l},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.photo_200||0==e.city||-1!=e.photo_200.indexOf("camera_200"))})}},{question:"",users_available:[],withPhoto:!1,chooseOptions:function(){var e=friends,t=this.users_available[Math.floor(Math.random()*this.users_available.length)];e.sort(function(e,t){return Math.random()-.5}),this.question='Кому принадлежит этот статус: "'+t.status+'" ?';var s=[t,t.first_name+" "+t.last_name,e[0].first_name+" "+e[0].last_name,e[1].first_name+" "+e[1].last_name,e[2].first_name+" "+e[2].last_name];return a.setRightAnswer(t.first_name+" "+t.last_name),s},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return""!=e.status})}},{question:"",users_available:[],withPhoto:!1,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=" ";t=2==e.sex?"(-лся) ":"(-лась) ",this.question="В каком из университетов учится"+t+e.first_name+" "+e.last_name+" ?";for(var s=this.users_available.map(function(e){return e.universities[0].name}),i=[],n=0;n<s.length;n++){for(var r=0,l=0;l<i.length;l++)if(s[n]==i[l]){r=1;break}0==r&&i.push(s[n])}i=i.filter(function(t){return t!=e.universities[0].name}),i.sort(function(e,t){return Math.random()-.5}),e.universities[0].name=e.universities[0].name.trim();var o=[e,e.universities[0].name,i[0],i[1],i[2]];return a.setRightAnswer(e.universities[0].name),o},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.universities||e.universities.lenght<1||0==e.university)})}},{question:"",users_available:[],withPhoto:!1,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)];this.question="Кто из нижеперечисленных людей учится(-лся, -лась) в "+e.universities[0].name+" ?",this.users_available=this.users_available.filter(function(t){for(var s=0;s<t.universities.length;s++)if(t.universities[s].name==e.universities[0].name)return flag=1,!1;return!0}),this.users_available.sort(function(e,t){return Math.random()-.5});var t=[e,e.first_name+" "+e.last_name,this.users_available[0].first_name+" "+this.users_available[0].last_name,this.users_available[1].first_name+" "+this.users_available[1].last_name,this.users_available[2].first_name+" "+this.users_available[2].last_name];return a.setRightAnswer(e.first_name+" "+e.last_name),t},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.universities||e.universities.lenght<1||0==e.university)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e,t=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],s=this.users_available[Math.floor(Math.random()*this.users_available.length)];return this.question="В каком месяце родился "+s.first_name+" "+s.last_name+" ?",e=s.bdate.indexOf(".")==s.bdate.lastIndexOf(".")?s.bdate.slice(s.bdate.indexOf(".")+1):s.bdate.slice(s.bdate.indexOf(".")+1,s.bdate.lastIndexOf(".")),a.setRightAnswer(t[e-1]),t.splice(e-1,1),t.sort(function(e,t){return Math.random()-.5}),[s,a.getRightAnswer(),t[0],t[1],t[2]]},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.bdate||void 0==e.photo_200||-1!=e.photo_200.indexOf("camera_200")||void 0==e.bdate)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=["Резко негативно","Негативно","Компромиссно","Нейтрально","Положительно"];return this.question="Как "+e.first_name+" "+e.last_name+" относится к курению ?",a.setRightAnswer(t[e.personal.smoking-1]),t.splice(e.personal.smoking-1,1),t.sort(function(e,t){return Math.random()-.5}),[e,a.getRightAnswer(),t[0],t[1],t[2]]},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.personal||"undefined"==e.personal.smoking||!e.personal.smoking)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=["Резко негативно","Негативно","Компромиссно","Нейтрально","Положительно"];return this.question="Как "+e.first_name+" "+e.last_name+" относится к алкоголю ?",a.setRightAnswer(t[e.personal.alcohol-1]),t.splice(e.personal.alcohol-1,1),t.sort(function(e,t){return Math.random()-.5}),[e,a.getRightAnswer(),t[0],t[1],t[2]]},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.personal||"undefined"==e.personal.alcohol||!e.personal.alcohol)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=["Семья и дети","Карьера и деньги","Развлечения и отдых","Наука и исследования","Совершенствование мира","Саморазвитие","Красота и искусство","Слава и влияние"];return this.question="Что для "+e.first_name_gen+" "+e.last_name_gen+" главное в жизни ?",a.setRightAnswer(t[e.personal.life_main-1]),t.splice(e.personal.life_main-1,1),t.sort(function(e,t){return Math.random()-.5}),[e,a.getRightAnswer(),t[0],t[1],t[2]]},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.personal||"undefined"==e.personal.life_main||!e.personal.life_main)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=[];return t=1==e.sex?["Не замужем","Есть друг","Помолвлена","Замужем","Всё сложно","В активном поиске","Влюблена"]:["Не женат","Есть подруга","Помолвлен","Женат","Всё сложно","В активном поиске","Влюблён"],this.question="Семейное положение "+e.first_name_gen+" "+e.last_name_gen+" ?",a.setRightAnswer(t[e.relation-1]),t.splice(e.relation-1,1),t.sort(function(e,t){return Math.random()-.5}),[e,a.getRightAnswer(),t[0],t[1],t[2]]},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return 0!=e.relation&&void 0!=e.relation})}}],a={rightAnswer:""};return a.getRightAnswer=function(){return a.rightAnswer},a.setRightAnswer=function(e){a.rightAnswer=e},a.makeNewQuestion=function(t){function a(e,t){return Math.random()-.5}if(t<0||t>=s.length)return!1;var i=s[t||e()];i.getAvailableUsers();var n=i.chooseOptions(),r=n[1],l=n[0];n=n.slice(1),n.sort(a);var o={questionObj:i,options:n,rightUser:l,rightAnswerUser:r};return delete i.users_available,o},a});