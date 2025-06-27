from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Add more paths as needed for your app's functionality
    path('match/', views.match, name='match'),
]