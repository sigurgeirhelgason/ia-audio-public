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
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from .views import redirect_view


urlpatterns = [
    path('', redirect_view),
    path('admin/', admin.site.urls, name='admin'), 
    path('api/user/', include('userAPI.urls', namespace='userAPI')),
    path('api/book/', include('book.urls', namespace='book')),
    path('docs/', include_docs_urls(title='AI-Audio'), name='docs'),
    path('schema', get_schema_view(
        title="AI-Audio",
        description="API for the AI-Audio API",
        version="1.0.0"
    ), name='openapi-schema'),

] 

STATICFILES_DIRS = [
    "/static",
]


if settings.DEBUG:
    urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns+= static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


