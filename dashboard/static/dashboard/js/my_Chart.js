document.addEventListener('DOMContentLoaded', function () {

    // ✅ CSRF 토큰 가져오기
    function getCSRFToken() {
        return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    }

    // ✅ 1️⃣ Bar Chart 초기 생성
    const chartDataElement = document.getElementById('chart-data');
    if (chartDataElement) {
        const chartLabels = JSON.parse(chartDataElement.dataset.labels);
        const chartData = JSON.parse(chartDataElement.dataset.data);

        const ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
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
    }

    // ✅ 2️⃣ Line Chart 초기 생성
    const lineChartDataElement = document.getElementById('line-chart-data');
    if (lineChartDataElement) {
        const lineChartLabels = JSON.parse(lineChartDataElement.dataset.labels);
        const lineChartData = JSON.parse(lineChartDataElement.dataset.data);

        const lineCtx = document.getElementById('lineChart').getContext('2d');
        window.lineChart = new Chart(lineCtx, {
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

    // ✅ 3️⃣ Pie Chart 초기 생성
    const pieChartDataElement = document.getElementById('pie-chart-data');
    if (pieChartDataElement) {
        const pieChartLabels = JSON.parse(pieChartDataElement.dataset.labels);
        const pieChartData = JSON.parse(pieChartDataElement.dataset.data);

        const pieCtx = document.getElementById('pieChart').getContext('2d');
        window.pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: pieChartLabels,
                datasets: [{
                    label: '첫 번째 숫자형 컬럼 (Pie Chart)',
                    data: pieChartData,
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
            options: {}
        });
    }

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
            if (!response.ok){
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

            // ✅ Line Chart update (안전 패턴 적용)
            const lineChartCanvas = document.getElementById('lineChart');
            if (lineChartCanvas) {
                const lineCtx = lineChartCanvas.getContext('2d');
                if (!window.lineChart) {
                    window.lineChart = new Chart(lineCtx, {
                        type: 'line',
                        data: {
                            labels: data.line_chart_labels,
                            datasets: [{
                                label: '첫 번째 숫자형 컬럼 (Line Chart)',
                                data: data.line_chart_data,
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
                } else {
                    window.lineChart.data.labels = data.line_chart_labels;
                    window.lineChart.data.datasets[0].data = data.line_chart_data;
                    window.lineChart.update();
                }
            }

            // ✅ Pie Chart update (안전 패턴 적용)
            const pieChartCanvas = document.getElementById('pieChart');
            if (pieChartCanvas) {
                const pieCtx = pieChartCanvas.getContext('2d');
                if (!window.pieChart) {
                    window.pieChart = new Chart(pieCtx, {
                        type: 'pie',
                        data: {
                            labels: data.pie_chart_labels,
                            datasets: [{
                                label: '첫 번째 숫자형 컬럼 (Pie Chart)',
                                data: data.pie_chart_data,
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
                        options: {}
                    });
                } else {
                    window.pieChart.data.labels = data.pie_chart_labels;
                    window.pieChart.data.datasets[0].data = data.pie_chart_data;
                    window.pieChart.update();
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('차트 데이터를 가져오는 중 오류 발생');
        });
    });

});
