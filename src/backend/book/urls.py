"""ia_audio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from . import views
from django.urls import path, include

app_name = 'book'

urlpatterns = [
    path('', views.BookList.as_view()),
    path('get_roads', views.BookList.as_view()),
    path('<int:pk>/', views.BookDetails.as_view(), 
    name='details'),
    path('<int:pk>/', include([
        path('crossroads/', views.CrossroadList.as_view()),
        path('crossroads/<int:pk>', views.RoadDetails.as_view()),
        path('chapters/', views.ChapterList.as_view()),
        path('chapters/<int:pk>', views.ChapterDetails.as_view()),
        path('roads/', views.RoadList.as_view()),
        path('get_media/', views.get_media, name='get_media'),
    ])),
    # Enable this path to enable zip delivery from backend
    #path('get_media/<int:book_id>', views.download, name='get_media'), 
    ]

