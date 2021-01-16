# todo/serializers.py
from rest_framework import serializers
from .models import Yummy

class YummySerializer(serializers.ModelSerializer):
  class Meta:
    model = Yummy
    fields = ('id', 'title', 'name')