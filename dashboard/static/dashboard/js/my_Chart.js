document.addEventListener('DOMContentLoaded', function () {

    // ✅ CSRF 토큰 가져오기
    function getCSRFToken() {
        return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    }

    // ✅ 초기 빈 데이터 구성
    const emptyLabels = Array(5).fill('');
    const emptyData = Array(5).fill(0);

    // ✅ 1️⃣ Bar Chart 초기 생성
    const chartDataElement = document.getElementById('chart-data');
    const ctx = document.getElementById('myChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartDataElement ? JSON.parse(chartDataElement.dataset.labels) : emptyLabels,
            datasets: [{
                label: '첫 번째 숫자형 컬럼',
                data: chartDataElement ? JSON.parse(chartDataElement.dataset.data) : emptyData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            resizeDelay: 0,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // ✅ 2️⃣ Line Chart 초기 생성
    const lineChartDataElement = document.getElementById('line-chart-data');
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    window.lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: lineChartDataElement ? JSON.parse(lineChartDataElement.dataset.labels) : emptyLabels,
            datasets: [{
                label: '첫 번째 숫자형 컬럼 (Line Chart)',
                data: lineChartDataElement ? JSON.parse(lineChartDataElement.dataset.data) : emptyData,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            resizeDelay: 0,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // ✅ 3️⃣ Pie Chart 초기 생성
    const pieChartDataElement = document.getElementById('pie-chart-data');
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    window.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: pieChartDataElement ? JSON.parse(pieChartDataElement.dataset.labels) : emptyLabels,
            datasets: [{
                label: '첫 번째 숫자형 컬럼 (Pie Chart)',
                data: pieChartDataElement ? JSON.parse(pieChartDataElement.dataset.data) : emptyData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            resizeDelay: 0,
            animation: {
                duration: 0
            }
        }
    });

    // ✅ 4️⃣ 드롭다운 change 이벤트 → AJAX 요청
    const columnSelector = document.getElementById('selected_column');

    columnSelector?.addEventListener('change', function () {
        const formData = new FormData();
        formData.append('selected_column', columnSelector.value);

        fetch('/get_chart_data/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error');
            }
            return response.json();
        })
        .then(data => {
            // ✅ Bar Chart update
            if (window.myChart) {
                myChart.data.labels = data.chart_labels;
                myChart.data.datasets[0].data = data.chart_data;
                myChart.update();
            }

            // ✅ Line Chart update
            if (window.lineChart) {
                lineChart.data.labels = data.line_chart_labels;
                lineChart.data.datasets[0].data = data.line_chart_data;
                lineChart.update();
            }

            // ✅ Pie Chart update
            if (window.pieChart) {
                pieChart.data.labels = data.pie_chart_labels;
                pieChart.data.datasets[0].data = data.pie_chart_data;
                pieChart.update();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('차트 데이터를 가져오는 중 오류 발생');
        });
    });

});
