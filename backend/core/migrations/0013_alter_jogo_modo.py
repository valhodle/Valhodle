# Generated by Django 5.2 on 2025-04-04 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_alter_jogo_modo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jogo',
            name='modo',
            field=models.CharField(choices=[('frase', 'Frase'), ('normal', 'Normal')], default='normal', max_length=10),
        ),
    ]
