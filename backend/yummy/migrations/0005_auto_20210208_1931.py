# Generated by Django 3.0.5 on 2021-02-08 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yummy', '0004_auto_20210208_1849'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='username',
            field=models.CharField(max_length=120),
        ),
    ]
