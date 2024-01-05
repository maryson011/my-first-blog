from django.shortcuts import render, redirect
from django.views import View

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

class homePage(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'homePage.html')

class MainView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'main.html')

from django.shortcuts import render, redirect
from .models import Dados
from .models import ReportData

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
                categoria_status = item[3]

                Dados.objects.create(
                    nome=nome,
                    id_groot=id_groot,
                    status=answer,
                    categoria_status=categoria_status
                )

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'message': 'Método de requisição incorreto'})


@csrf_exempt
def salvar_report(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            props = data.get('props', [])

            for item in props:
                if item[0] != '':
                    id_Groot = item[0]
                    status = item[1]
                    report = item[2]

                    ReportData.objects.create(
                        id_Groot=id_Groot,
                        status=status,
                        description=report
                    )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
        
    return JsonResponse({'success': False, 'message': 'Método de requisição incorreto'})

# from .views import SucessoView
# class SucessoView(View):
#     def get(self, request, *args, **kwargs):
#         return render(request, 'sucesso.html')

from datetime import datetime

@csrf_exempt
def get_dados(request):
    if request.method == 'GET':
        nome_filtro = request.GET.get('nome', None)
        status_filtro = request.GET.get('status', None)
        lauch_date_filtro = request.GET.get('lauch_date', None)

        filtros = {}

        if nome_filtro:
            filtros['nome__icontains'] = nome_filtro

        if status_filtro:
            filtros['status'] = status_filtro

        if lauch_date_filtro:
            try:
                lauch_date = datetime.strptime(lauch_date_filtro, '%Y-%m-%d')

                filtros['lauch_date__date'] = lauch_date.date()

            except:
                return JsonResponse({'error': 'Formato de data invalido'}, status=400)


        dados = Dados.objects.filter(**filtros).values()

        return JsonResponse({'dados': list(dados)})
    else:
        return JsonResponse({'error': 'Metodo de requisição incorreto'}, status=405)

   
from django.utils import timezone
    
@csrf_exempt
def update_status(request):
    if request.method == 'PUT':
        try:
            id = request.GET.get('id')
            status = request.GET.get('status')

            Dados.objects.filter(id=id).update(status=status, lauch_date=timezone.now())

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
        
    return JsonResponse({'error': 'Método de requisição incorreto'}, status=405)

