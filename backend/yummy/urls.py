# todos/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListYummy.as_view()),
    path('<int:pk>/', views.DetailYummy.as_view()),
]