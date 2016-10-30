define(
    [
        'jquery',
        'chartLib'
    ],
    function(
        $,
        Chart
    ) {
        
        var _myPieChart;
        var _myBarChart;

        var chart = {};

        /**
         * Calls draw charts methods
         * @param pieChartData data for pie chart
         * @param barChartData data for bar chart
         */
        chart.drawCharts = function(pieChartData, barChartData) {
            chart.drawPieChart(pieChartData);
            chart.drawBarChart(barChartData);
        };

        /**
         * Draws pie chart
         * @param pieChartData data for pie chart
         */
        chart.drawPieChart = function(pieChartData) {
            var ctx = $("#hitsAndMissesChart");

            if (_myPieChart === undefined){
                var data = {
                    labels: [
                        "Верные ответы",
                        "Ошибки",
                        "Верные с первой попытки"
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
                        }
                    ]
                };

                _myPieChart = new Chart(ctx, {
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
                _myPieChart.data.datasets[0].data = pieChartData;
                _myPieChart.update();
            }
        };

        /**
         * Draws bar chart
         * @param barChartData data for bar chart
         */
        chart.drawBarChart = function(barChartData) {
            var ctx = $("#lastGamesChart");

            if (_myBarChart === undefined) {
                _myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: barChartData.labels,
                        datasets: [
                            {
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
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            ]
                        },
                        legend: {
                            display: false,
                        }
                    }
                });
            } else {
                _myBarChart.data.labels = barChartData.labels;
                _myBarChart.data.datasets[0].data = barChartData.data;
                _myBarChart.update();
            }
        };

        return chart;
    }
);
