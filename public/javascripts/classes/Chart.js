define(["jquery","chartLib"],function(a,r){var t,e,d={};return d.drawCharts=function(a,r){d.drawPieChart(a),d.drawBarChart(r)},d.drawPieChart=function(e){var d=a("#hitsAndMissesChart");if(void 0===t){var b={labels:["Верные ответы","Ошибки","Верные с первой попытки"],datasets:[{data:e,backgroundColor:["#81bd81","#f75a5a","#00E676"],hoverBackgroundColor:["#81bd81","#f75a5a","#00E676"]}]};t=new r(d,{type:"doughnut",data:b,options:{responsive:!0,maintainAspectRatio:!1,animation:{animateRotate:!0},legend:{display:!1}}})}else t.data.datasets[0].data=e,t.update()},d.drawBarChart=function(t){var d=a("#lastGamesChart");void 0===e?e=new r(d,{type:"bar",data:{labels:t.labels,datasets:[{label:"Количество очков",data:t.data,backgroundColor:["rgba(239, 154, 154, 0.1)","rgba(239, 154, 154, 0.2)","rgba(239, 154, 154, 0.3)","rgba(239, 154, 154, 0.4)","rgba(239, 154, 154, 0.5)","rgba(239, 154, 154, 0.6)","rgba(239, 154, 154, 0.7)","rgba(239, 154, 154, 0.8)","rgba(239, 154, 154, 0.9)","rgba(239, 154, 154, 1)"],borderColor:["rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)","rgba(239, 154, 154, 1)"],borderWidth:1}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{yAxes:[{ticks:{beginAtZero:!0}}]},legend:{display:!1}}}):(e.data.labels=t.labels,e.data.datasets[0].data=t.data,e.update())},d});