# Generated by Django 3.0.5 on 2021-02-26 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yummy', '0010_auto_20210225_2153'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='datetime',
            field=models.DateTimeField(),
        ),
    ]
