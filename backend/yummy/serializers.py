# todo/serializers.py
from rest_framework import serializers
from .models import UserInfo
from django.contrib.auth.models import User

class UserInfoSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserInfo
    fields = ('id','username', 'name', 'email', 'age', 'height', 'weight')

class RegistrationSerializer(serializers.ModelSerializer):
  password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
  class Meta:
    model = User
    fields = ['email', 'username', 'password', 'password2']
    extra_kwargs = {
                'password': {'write_only': True}
    }

  def save(self):
    user = User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
    )
    filtering_email_user = User.objects.filter(email=self.validated_data['email'])
    password = self.validated_data['password']
    password2 = self.validated_data['password2']

    if password != password2:
      raise serializers.ValidationError({'password': 'Password must match.'})
    if filtering_email_user:
      raise serializers.ValidationError({'email': 'Email already existed.'})
    user.set_password(password)
    user.save()
    return user

