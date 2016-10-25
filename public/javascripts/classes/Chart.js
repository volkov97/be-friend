define(['jquery', 'chartLib'], function($, Chart) {

    var chart = {};
    var myPieChart;
    var myBarChart;

    chart.drawCharts = function(pieChartData, barChartData) {
        chart.drawPieChart(pieChartData);
        chart.drawBarChart(barChartData);
    };

    chart.drawPieChart = function(pieChartData) {
        var ctx = $("#hitsAndMissesChart");

        if (myPieChart === undefined){
            var data = {
                labels: [
                    "Верные ответы",
                    "Ошибки",
                    "Верные ответы с 1-ой попытки"
                ],
                datasets: [
                    {
                        data: pieChartData,
                        backgroundColor: [
                            "#81bd81",
                            "#f75a5a",
                            "#00E676"
                        ],
                        hoverBackgroundColor: [
                            "#81bd81",
                            "#f75a5a",
                            "#00E676"
                        ]
                    }]
            };

            myPieChart = new Chart(ctx, {
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
        } else {
            myPieChart.data.datasets[0].data = pieChartData;
            myPieChart.update();
        }
    };

    chart.drawBarChart = function(barChartData) {
        var ctx = $("#lastGamesChart");

        if (myBarChart === undefined) {
            myBarChart = new Chart(ctx, {
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
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false,
                    }
                }
            });
        } else {
            myBarChart.data.labels = barChartData.labels;
            myBarChart.data.datasets[0].data = barChartData.data;
            myBarChart.update();
        }
    };

    return chart;

});
