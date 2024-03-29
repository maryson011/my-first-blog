from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from blog.views import homePage
from blog.views import Cadastro
from blog.views import MainView
from blog.views import salvar_dados
from blog.views import salvar_report
from blog.views import get_dados
from blog.views import update_status


urlpatterns = [
    path('', homePage.as_view(), name='homePage'),
    path('cadastro/', Cadastro.as_view(), name='cadastro'),
    path('admin/', admin.site.urls),
    path('main/', MainView.as_view(), name='open_main'),
    path('salvar_dados/', salvar_dados, name='salvar_dados'),
    path('salvar_report/', salvar_report, name='salvar_report'),
    path('get_dados/', get_dados, name='get_dados'),
    path('update_status/', update_status, name='update_status')
    # path('sucesso/', SucessoView.as_view(), name='sucesso'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)