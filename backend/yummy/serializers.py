# todo/serializers.py
from rest_framework import serializers
from .models import UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserInfo
    fields = ('id','username', 'name', 'email', 'age', 'height', 'weight')