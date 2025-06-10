document.addEventListener('DOMContentLoaded', function (){
    const lineChartDataElement = document.getElementById('line-chart-data');

    if (lineChartDataElement){
        const lineChartLabels = JSON.parse(lineChartDataElement.dataset.labels);
        const lineChartData = JSON.parse(lineChartDataElement.dataset.data);

        const lineCtx = document.getElementById('lineChart').getContext('2d');
        const lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: lineChartLabels,
                datasets: [{
                    label: '첫 번째 숫자형 컬럼 (Line Chart)',
                    data: lineChartData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});