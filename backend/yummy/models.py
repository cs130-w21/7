from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class UserInfo(models.Model):
    username = models.CharField(max_length=120, blank=False, default='')
    name = models.CharField(max_length=120, blank=False, default='')
    email = models.TextField(max_length=120, blank=False, default='')
    age = models.IntegerField()
    height = models.FloatField()
    weight = models.FloatField()
    
    # def _str_(self):
    #     return self.username

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)