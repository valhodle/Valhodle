# Generated by Django 5.2 on 2025-04-04 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_alter_jogo_modo'),
    ]

    operations = [
        migrations.AddField(
            model_name='pessoa',
            name='altura',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='pessoa',
            name='area_estudo',
            field=models.CharField(default='não informado', max_length=100),
        ),
        migrations.AddField(
            model_name='pessoa',
            name='tatuagem',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='pessoa',
            name='time',
            field=models.CharField(default='nenhum', max_length=100),
        ),
        migrations.AlterField(
            model_name='jogo',
            name='modo',
            field=models.CharField(choices=[('normal', 'Normal'), ('frase', 'Frase')], default='normal', max_length=10),
        ),
    ]
