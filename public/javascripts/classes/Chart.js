define(['jquery', 'chartLib'], function($, Chart) {

    var chart = {};

    chart.drawCharts = function(pieChartData, barChartData) {
        chart.drawPieChart(pieChartData);
        chart.drawBarChart(barChartData);
    };

    chart.drawPieChart = function(pieChartData) {
        var ctx = $("#hitsAndMissesChart");
        
        var data = {
            labels: [
                "Верные ответы",
                "Ошибки"
            ],
            datasets: [
                {
                    data: pieChartData,
                    backgroundColor: [
                        "#76ab8e",
                        "#ce7878"
                    ],
                    hoverBackgroundColor: [
                        "#76ab8e",
                        "#ce7878"
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
                },
                legend: {
                    display: false,
                }
            }
        });
    };

    chart.drawBarChart = function(barChartData) {
        var ctx = $("#lastGamesChart");

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: barChartData.labels,
                datasets: [{
                    label: 'Количество очков',
                    data: barChartData.data,
                    backgroundColor: [
                        'rgba(239, 154, 154, 0.1)',
                        'rgba(239, 154, 154, 0.2)',
                        'rgba(239, 154, 154, 0.3)',
                        'rgba(239, 154, 154, 0.4)',
                        'rgba(239, 154, 154, 0.5)',
                        'rgba(239, 154, 154, 0.6)',
                        'rgba(239, 154, 154, 0.7)',
                        'rgba(239, 154, 154, 0.8)',
                        'rgba(239, 154, 154, 0.9)',
                        'rgba(239, 154, 154, 1)'
                    ],
                    borderColor: [
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)',
                        'rgba(239, 154, 154, 1)'
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
                },
                legend: {
                    display: false,
                }
            }
        });
    };

    return chart;

});
