from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class Profile(models.Model):
    class Sex(models.TextChoices):
        FEMALE = 'F','Female'
        MALE = 'M', 'Male'
        OTHER = 'O', 'Other'
    username = models.CharField(max_length=120)
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    age = models.IntegerField(blank=True)
    height = models.FloatField(blank=True)
    weight = models.FloatField(blank=True)
    sex = models.CharField(
        max_length=2,
        choices=Sex.choices,
        default=Sex.FEMALE
    )
    vegetarian = models.BooleanField()
    cuisin = models.CharField(max_length=500)
    food_type = models.CharField(max_length=500)

class Event(models.Model):
    name = models.CharField(max_length=120)
    datetime = models.DateTimeField()
    attendees = models.ManyToManyField(User,blank=True)
    location = models.CharField(max_length=200)
    description = models.CharField(max_length=500,blank=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="host",blank=True)

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)