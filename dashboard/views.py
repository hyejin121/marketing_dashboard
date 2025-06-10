from django.http import HttpResponse
from django.shortcuts import render
import pandas as pd
import json

# 홈 화면
def home(request):
    return render(request, 'dashboard/home.html')

# CSV업로드 화면 + 파일 받기 + 분석 결과 보여주기 + 차트 데이터 전달
def upload_csv(request):
    table_html = None # 테이블 초기값
    stats_html = None # 기본 통계 HTML 추가
    chart_labels = []
    chart_data = []
    line_chart_labels = []
    line_chart_data = []
    pie_chart_labels = []
    pie_chart_data = []

    selected_column = None
    numeric_cols = []   # 숫자형 컬럼 리스트

    if request.method == 'POST':
        csv_file = request.FILES.get('csv_file')
        selected_column = request.POST.get('selected_column')   # 사용자가 선택한 컬럼만 가져오기

        # csv파일 읽기, 인코딩 대응
        try:
            df = pd.read_csv(csv_file, encoding='utf-8')    # 우선 utf-8시도
        except UnicodeEncodeError:
            # utf-8 실패시 cp949로 다시 시도
            df = pd.read_csv(csv_file, encoding='cp949')


        table_html = df.head().to_html(classes='table table-striped')    # CSV 미리보기 (상위 5행)
        stats_html = df.describe().to_html(classes='table table-bordered')  # 기본 통계 정보

        # 예시 : 첫 번째 숫자형 컬럼을 막대 그래프로 표시
        numeric_cols = df.select_dtypes(include='number').columns   # 숫자형 컬럼 목록

        # 차트 데이터 구성
        if selected_column and selected_column in df.columns:
            # Bar Chart / Line Chart / Pie Chart 모두 Selected_column 기준으로 구성
            # Bar chart 데이터 (기존과 동일 -> 10개)
            chart_labels = df[selected_column].index.tolist()[:10]  # 인덱스 10개까지만
            chart_data = df[selected_column].values.tolist()[:10]  # 값 -> 10개까지만

            # Line Chart 데이터 (index 또는 다른 컬럼 기준 -> 여기선 index기준 예시)
            line_chart_labels = df.index.tolist()[:10]  # 인덱스 x축 (나중에 날짜 컬럼으로 변경 가능)
            line_chart_data = df[selected_column].values.tolist()[:10]

            # Pie chart -> 상위 5개만 예시로 구성
            pie_chart_labels = df[selected_column].index.astype(str).tolist()[:5]
            pie_chart_data = df[selected_column].values.tolist()[:5]

        # if len(numeric_cols) > 0:
        #     first_numeric_col = numeric_cols[0]

    return render(
        request,
        'dashboard/upload_csv.html',
        {
            'table_html': table_html,
            'stats_html': stats_html,
            'chart_labels':json.dumps(chart_labels),    #json.dumps() : chart.js에서 사용할 수 있도록 JSON 문자열로 변환
            'chart_data':json.dumps(chart_data),
            'line_chart_labels':json.dumps(line_chart_labels),
            'line_chart_data':json.dumps(line_chart_data),
            'pie_chart_labels':json.dumps(pie_chart_labels),
            'pie_chart_data':json.dumps(pie_chart_data),
            'numeric_cols':numeric_cols,    # 템플릿에 전달(드롭다운용)
            'selected_column':selected_column,  # 현재 선택된 컬럼명도 전달
        }
    )