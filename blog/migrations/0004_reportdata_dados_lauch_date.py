# Generated by Django 5.0 on 2023-12-13 20:10

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_dados'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_Groot', models.IntegerField()),
                ('status', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=500)),
                ('lauch_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
            ],
        ),
        migrations.AddField(
            model_name='dados',
            name='lauch_date',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False),
        ),
    ]
