define(['jquery', 'chartLib'], function($, Chart) {

    var chart = {};

    chart.drawCharts = function(pieChartData, barChartData) {
        chart.drawPieChart(pieChartData);
        chart.drawBarChart(barChartData);
    };

    chart.drawPieChart = function(pieChartData) {
        var ctx = $("#lastGamesChart");
        
        var data = {
            labels: [
                "Правильные ответы",
                "Ошибочные ответы"
            ],
            datasets: [
                {
                    data: pieChartData,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
        };

        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true
                }
            }
        });
    };

    chart.drawBarChart = function(barChartData) {
        var ctx = $("#hitsAndMissesChart");

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: barChartData.labels,
                datasets: [{
                    label: 'Количество очков',
                    data: barChartData.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    };

    return chart;

});
