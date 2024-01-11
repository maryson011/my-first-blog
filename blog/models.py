from django.db import models
from django.utils import timezone

class Post(models.Model):
    # author = models.ForeignKey('auth.User')
    author = models.TextField()
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(
        default=timezone.now
    )
    published_date = models.DateTimeField(
        blank=True, null=True
    )

    def publish(self):
        self.published_date = timezone.now()
        self.save()
    
    def __str__(self):
        return self.title
    
class Dados(models.Model):
    nome = models.CharField(max_length=255)
    id_groot = models.IntegerField()
    status = models.CharField(max_length=100)
    categoria_status = models.CharField(max_length=100)
    lauch_date = models.DateTimeField(default=timezone.now, editable=False)

class ReportData(models.Model):
    id_Groot = models.IntegerField()
    status = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    lauch_date = models.DateTimeField(default=timezone.now, editable=False)

class CadastroUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=30)
    lauch_date = models.DateTimeField(default=timezone.now, editable=False)

class loginUser(models.Model):
    username = models.CharField(max_length=100)
    log = models.BooleanField(default=False, editable=True)
    lauch_date = models.DateTimeField(default=timezone.now, editable=True)
