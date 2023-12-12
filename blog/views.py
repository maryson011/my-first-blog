from django.shortcuts import render, redirect
from django.views import View

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Dados
import json


class MainView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'main.html')


# @require_POST
# @csrf_exempt

# def salvar_dados(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         nome = data.get('nome')
#         id_groot = data.get('id_groot')
#         status = data.get('status')
#         categorias_status = data.get('categoria_status')

#         Dados.objects_create(nome=nome,  id_groot=id_groot, status=status, categorias_status=categorias_status)

#         return JsonResponse({'mensage': 'Dados salvos com sucesso!'})
#     else:
#         return JsonResponse({'mensage': 'Método não permitido'}, status=405)

# views.py

from django.shortcuts import render, redirect
from .models import Dados

def salvar_dados(request):
    if request.method == 'POST':
        # Obter dados do formulário
        nome = request.POST.get('nome')
        id_groot = request.POST.get('id_groot')
        status = request.POST.get('status')
        categoria_status = request.POST.get('categoria_status')

        # Salvar no banco de dados
        Dados.objects.create(
            nome=nome,
            id_groot=id_groot,
            status=status,
            categoria_status=categoria_status
        )

        return render(request, 'main.html') # Redirecionar para uma página de sucesso ou outra view
    else:
        return render(request, 'main.html')  # Renderizar o formulário HTML


# from .views import SucessoView
# class SucessoView(View):
#     def get(self, request, *args, **kwargs):
#         return render(request, 'sucesso.html')