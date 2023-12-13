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

@csrf_exempt  # Apenas para simplificar, geralmente use uma proteção CSRF apropriada
def salvar_dados(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            data_answer = data.get('dataAnswer', [])

            for item in data_answer:
                nome = item[0]
                id_groot = item[1]
                answer = item[2]

                Dados.objects.create(
                    nome=nome,
                    id_groot=id_groot,
                    status=answer,
                    categoria_status=''  # Adicione o valor apropriado aqui
                )

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'message': 'Método de requisição incorreto'})


# from .views import SucessoView
# class SucessoView(View):
#     def get(self, request, *args, **kwargs):
#         return render(request, 'sucesso.html')