# Generated by Django 5.2 on 2025-04-03 11:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_alter_jogo_modo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pessoa',
            old_name='usa_oculos',
            new_name='oculos',
        ),
    ]
