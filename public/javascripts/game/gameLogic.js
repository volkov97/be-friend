define([],function(){function e(){if(0==t.length)for(var e=0;e<a.length;e++)t[e]=e;var s=Math.round(Math.random()*(t.length-1)),i=t[s];return t.splice(s,1),i}var t=[],a=[{question:"Кто из ваших друзей изображен на этом фото?",withPhoto:!0,users_available:[],chooseOptions:function(){var e=Math.ceil(2*Math.random());this.users_available=this.users_available.filter(function(t){return t.sex==e}),this.users_available.sort(function(e,t){return Math.random()-.5}),s.setRightAnswer(this.users_available[0].first_name+" "+this.users_available[0].last_name);var t=[this.users_available[0],s.getRightAnswer(),this.users_available[1].first_name+" "+this.users_available[1].last_name,this.users_available[2].first_name+" "+this.users_available[2].last_name,this.users_available[3].first_name+" "+this.users_available[3].last_name];return t},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.photo_200||e.photo_200.indexOf("camera_200")!=-1)})}},{question:"Из какого города человек, изображенный на фото?",withPhoto:!0,users_available:[],chooseOptions:function(){for(var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=this.users_available.map(function(e){return e.cityName}),a=[],i=0;i<t.length;i++){for(var n=0,r=0;r<a.length;r++)if(t[i]==a[r]){n=1;break}0==n&&a.push(t[i])}a=a.filter(function(t){return t!=e.cityName}),a.sort(function(e,t){return Math.random()-.5});var l=[e,e.cityName,a[0],a[1],a[2]];return s.setRightAnswer(e.cityName),l},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.photo_200||0==e.city||e.photo_200.indexOf("camera_200")!=-1)})}},{question:"",users_available:[],withPhoto:!1,chooseOptions:function(){var e=friends,t=this.users_available[Math.floor(Math.random()*this.users_available.length)];e.sort(function(e,t){return Math.random()-.5}),this.question='Кому принадлежит этот статус: "'+t.status+'" ?';var a=[t,t.first_name+" "+t.last_name,e[0].first_name+" "+e[0].last_name,e[1].first_name+" "+e[1].last_name,e[2].first_name+" "+e[2].last_name];return s.setRightAnswer(t.first_name+" "+t.last_name),a},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return""!=e.status})}},{question:"",users_available:[],withPhoto:!1,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=" ";t=2==e.sex?"(-лся) ":"(-лась) ",this.question="В каком из университетов учится"+t+e.first_name+" "+e.last_name+" ?";for(var a=this.users_available.map(function(e){return e.universities[0].name}),i=[],n=0;n<a.length;n++){for(var r=0,l=0;l<i.length;l++)if(a[n]==i[l]){r=1;break}0==r&&i.push(a[n])}i=i.filter(function(t){return t!=e.universities[0].name}),i.sort(function(e,t){return Math.random()-.5});var o=[e,e.universities[0].name,i[0],i[1],i[2]];return s.setRightAnswer(e.universities[0].name),o},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.universities||e.universities.lenght<1||0==e.university)})}},{question:"",users_available:[],withPhoto:!1,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)];this.question="Кто из нижеперечисленных людей учится(-лся, -лась) в "+e.universities[0].name+" ?",this.users_available=this.users_available.filter(function(t){for(var a=0;a<t.universities.length;a++)if(t.universities[a].name==e.universities[0].name)return flag=1,!1;return!0}),this.users_available.sort(function(e,t){return Math.random()-.5});var t=[e,e.first_name+" "+e.last_name,this.users_available[0].first_name+" "+this.users_available[0].last_name,this.users_available[1].first_name+" "+this.users_available[1].last_name,this.users_available[2].first_name+" "+this.users_available[2].last_name];return s.setRightAnswer(e.first_name+" "+e.last_name),t},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.universities||e.universities.lenght<1||0==e.university)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e,t=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],a=this.users_available[Math.floor(Math.random()*this.users_available.length)];this.question="В каком месяце родился "+a.first_name+" "+a.last_name+" ?",e=a.bdate.indexOf(".")==a.bdate.lastIndexOf(".")?a.bdate.slice(a.bdate.indexOf(".")+1):a.bdate.slice(a.bdate.indexOf(".")+1,a.bdate.lastIndexOf(".")),s.setRightAnswer(t[e-1]),t.splice(e-1,1),t.sort(function(e,t){return Math.random()-.5});var i=[a,s.getRightAnswer(),t[0],t[1],t[2]];return i},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.bdate||void 0==e.photo_200||e.photo_200.indexOf("camera_200")!=-1||void 0==e.bdate)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=["Резко негативно","Негативно","Компромиссно","Нейтрально","Положительно"];this.question="Как "+e.first_name+" "+e.last_name+" относится к курению ?",s.setRightAnswer(t[e.personal.smoking-1]),t.splice(e.personal.smoking-1,1),t.sort(function(e,t){return Math.random()-.5});var a=[e,s.getRightAnswer(),t[0],t[1],t[2]];return a},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.personal||"undefined"==e.personal.smoking||!e.personal.smoking)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=["Резко негативно","Негативно","Компромиссно","Нейтрально","Положительно"];this.question="Как "+e.first_name+" "+e.last_name+" относится к алкоголю ?",s.setRightAnswer(t[e.personal.alcohol-1]),t.splice(e.personal.alcohol-1,1),t.sort(function(e,t){return Math.random()-.5});var a=[e,s.getRightAnswer(),t[0],t[1],t[2]];return a},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.personal||"undefined"==e.personal.alcohol||!e.personal.alcohol)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=["Семья и дети","Карьера и деньги","Развлечения и отдых","Наука и исследования","Совершенствование мира","Саморазвитие","Красота и искусство","Слава и влияние"];this.question="Что для "+e.first_name_gen+" "+e.last_name_gen+" главное в жизни ?",s.setRightAnswer(t[e.personal.life_main-1]),t.splice(e.personal.life_main-1,1),t.sort(function(e,t){return Math.random()-.5});var a=[e,s.getRightAnswer(),t[0],t[1],t[2]];return a},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return!(!e.personal||"undefined"==e.personal.life_main||!e.personal.life_main)})}},{question:"",users_available:[],withPhoto:!0,chooseOptions:function(){var e=this.users_available[Math.floor(Math.random()*this.users_available.length)],t=[];t=1==e.sex?["Не замужем","Есть друг","Помолвлена","Замужем","Всё сложно","В активном поиске","Влюблена"]:["Не женат","Есть подруга","Помолвлен","Женат","Всё сложно","В активном поиске","Влюблён"],this.question="Семейное положение "+e.first_name_gen+" "+e.last_name_gen+" ?",s.setRightAnswer(t[e.relation-1]),t.splice(e.relation-1,1),t.sort(function(e,t){return Math.random()-.5});var a=[e,s.getRightAnswer(),t[0],t[1],t[2]];return a},getAvailableUsers:function(){this.users_available=friends.filter(function(e){return 0!=e.relation&&void 0!=e.relation})}}],s={rightAnswer:""};return s.getRightAnswer=function(){return s.rightAnswer},s.setRightAnswer=function(e){s.rightAnswer=e},s.makeNewQuestion=function(t){function s(e,t){return Math.random()-.5}if(t<0||t>=a.length)return!1;var i=a[t||e()];i.getAvailableUsers();var n=i.chooseOptions(),r=n[1],l=n[0];n=n.slice(1),n.sort(s);var o={questionObj:i,options:n,rightUser:l,rightAnswerUser:r};return delete i.users_available,o},s});