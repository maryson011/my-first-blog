from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from blog.views import MainView
from blog.views import salvar_dados
from blog.views import salvar_report


urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', MainView.as_view(), name='open_main'),
    path('salvar_dados/', salvar_dados, name='salvar_dados'),
    path('salvar_report/', salvar_report, name='salvar_report'),
    # path('sucesso/', SucessoView.as_view(), name='sucesso'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)