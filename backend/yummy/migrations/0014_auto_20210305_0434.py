# Generated by Django 3.0.5 on 2021-03-05 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yummy', '0013_auto_20210303_0533'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='cuisin',
            new_name='cuisine',
        ),
        migrations.AlterField(
            model_name='event',
            name='name',
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
