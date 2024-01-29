# Generated by Django 5.0 on 2024-01-11 19:33

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_reportdata_dados_lauch_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='CadastroUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('password', models.CharField(max_length=30)),
                ('lauch_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
            ],
        ),
        migrations.CreateModel(
            name='loginUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=100)),
                ('log', models.BooleanField(default=False)),
                ('lauch_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]