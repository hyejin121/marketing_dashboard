document.addEventListener('DOMContentLoaded', function () {
    // HTML에서 데이터 가져오기 (data-* 속성 활용할 예정)
    const chartLabels = JSON.parse(document.getElementById('chart-data').dataset.labels);
    const chartData = JSON.parse(document.getElementById('chart-data').dataset.data);

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: '첫 번째 숫자형 컬럼',
                data: chartData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
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
});
