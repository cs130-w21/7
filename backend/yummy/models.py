from django.db import models

# Create your models here.
class Yummy(models.Model):
    title = models.CharField(max_length=120)
    name = models.TextField()

def _str_(self):
    return self.title