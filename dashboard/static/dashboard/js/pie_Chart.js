document.addEventListener('DOMContentLoaded', function () {
    const pieChartDataElement = document.getElementById('pie-chart-data');

    if (pieChartDataElement) {
        const pieChartLabels = JSON.parse(pieChartDataElement.dataset.labels);
        const pieChartData = JSON.parse(pieChartDataElement.dataset.data);

        const pieCtx = document.getElementById('pieChart').getContext('2d');
        const pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: pieChartLabels,
                datasets: [{
                    label: 'Pie Chart 예시',
                    data: pieChartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }
});
