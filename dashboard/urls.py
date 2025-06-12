from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), #http://127.0.0.1:8000/ -> home 뷰로 연결
    path('upload/', views.upload_csv, name='upload_csv'),   # csv 업로드 URL 추가업
    path('get_chart_data/', views.get_chart_data, name='get_chart_data'),   #AJAX용 URL추가
]