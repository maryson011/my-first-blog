from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from blog.views import MainView 


urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', MainView.as_view(), name='open_main'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)