define(["require","gui"],function(e,n){var t,r=0,i=0,u={};return u.start=function(){t=setInterval(function(){i+=1e3,r+=1e3,e("gui").updateTimer(),r>=9e4&&(r=9e4,e("gui").updateTimer(),u.end())},1e3)},u.end=function(){e("gui").endGame(!0),clearInterval(t)},u.clrInterval=function(){clearInterval(t)},u.reset=function(){u.clrInterval(),r=0,i=0},u.getSecondsLeft=function(){return(9e4-r)/1e3},u.addTime=function(){r-=2e3},u.substractTime=function(){r+=1e3},u.getTotalGameTime=function(){return i/1e3},u});