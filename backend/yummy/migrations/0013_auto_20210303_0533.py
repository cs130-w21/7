# Generated by Django 3.0.5 on 2021-03-03 05:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yummy', '0012_auto_20210303_0528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='cuisin',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='profile',
            name='food_type',
            field=models.CharField(max_length=500),
        ),
    ]
