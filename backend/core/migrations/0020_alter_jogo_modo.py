# Generated by Django 5.2 on 2025-04-04 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_alter_jogo_modo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jogo',
            name='modo',
            field=models.CharField(choices=[('normal', 'Normal'), ('frase', 'Frase')], default='normal', max_length=10),
        ),
    ]
