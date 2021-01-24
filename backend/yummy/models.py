from django.db import models

class UserInfo(models.Model):
    username = models.CharField(max_length=120, blank=False, default='')
    name = models.CharField(max_length=120, blank=False, default='')
    email = models.TextField(max_length=120, blank=False, default='')
    age = models.IntegerField()
    height = models.FloatField()
    weight = models.FloatField()
    
    # def _str_(self):
    #     return self.username

