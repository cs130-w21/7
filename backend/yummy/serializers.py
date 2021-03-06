# todo/serializers.py
from rest_framework import serializers
from .models import Profile, Event
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist 
import hashlib 

class RegistrationSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['email','username', 'password']
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

    if filtering_email_user:
      raise serializers.ValidationError({'email': 'Email already existed.'})
    user.set_password(password)
    user.save()
    return user

class LoginSerializer(serializers.Serializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(max_length=200,required=True)
  

class ChangePasswordSerializer(serializers.Serializer):
  model = User

  """
  Serializer for password change endpoint.
  """
  old_password = serializers.CharField(max_length=200,required=True)
  new_password = serializers.CharField(max_length=200,required=True)


class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = Profile
    fields = ['username','first_name', 'last_name', 'age', 'height', 'weight', 'sex', 'vegetarian', 'cuisine', 'food_type']

  def create_profile(self):
    is_existed =self.is_username_existing(self.validated_data['username'])
    if not is_existed:
      self.create(self.validated_data)
      return True
    return False


  def update_profile(self):
    is_existed =self.is_username_existing(self.validated_data['username'])
    if is_existed:
      profile = Profile.objects.get(username=self.validated_data['username'])
      profile.first_name = self.validated_data['first_name']
      profile.last_name = self.validated_data['last_name']
      profile.age = self.validated_data['age']
      profile.height = self.validated_data['height']
      profile.weight = self.validated_data['weight']
      profile.sex = self.validated_data['sex']
      profile.vegetarian = self.validated_data['vegetarian']
      profile.cuisine = self.validated_data['cuisine']
      profile.food_type = self.validated_data['food_type']
      profile.save()
      return True
    return False

  def get_profile(self,username):
    is_existed =Profile.objects.filter(username)
    if is_existed:
      profile = Profile.objects.get(username=username)
      return profile
    return None
    



  def is_username_existing(self, username):
    profile = Profile.objects.filter(username=username)
    if profile.exists():
      return True
    else:
      return False

  def username_token_match(self, token):
    if str(token.user) == str(self.validated_data['username']):
        return True
    else:
        return False

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id','username','email']

class EventSerializer(serializers.ModelSerializer):
  id = serializers.IntegerField(required=False)
  attendees = UserSerializer(many=True,required=False)
  class Meta:
    model = Event
    fields = ['name','datetime','location','description','host','attendees','id']

  def create_event(self,username):
    user = User.objects.get(username=username)
    if user:
      existing_event = Event.objects.filter(name=self.validated_data['name'])
      if existing_event:
        return False
      self.validated_data["host"] = user
      event = self.create(self.validated_data)
      event.attendees.add(user)
      event.save()
      return True
    return False

  def update_event(self,username):
    data = {}
    event = Event.objects.filter(id=self.validated_data['id'])
    # check if the event exists
    if event:
      event = Event.objects.get(id=self.validated_data['id'])
      # check if the host is the one editing
      if str(event.host.username) != str(username):
        data['status'] = False
        data['message'] = 'You are not the host of the event'
        return data
      # check if the the updating name exists or not
      existing_event = Event.objects.filter(name=self.validated_data['name'])
      if existing_event.count() > 1:
        data['status'] = False
        data['message'] = "The event name already existed!"
        return data
      event.name = self.validated_data['name']
      event.datetime = self.validated_data['datetime']
      event.location = self.validated_data['location']
      event.description = self.validated_data['description']
      event.save()
      data['status'] = True
      data['message'] = "The event updated successful"
      return data
    data['status'] = False
    data['message'] = "Cannot find the event"
    return data

class GetEventSerializer(serializers.Serializer):
  name = serializers.CharField(required=False,max_length=200)

class GetEventIDSerializer(serializers.Serializer):
  id = serializers.IntegerField(required=True)

class JoinEventIDSerializer(serializers.Serializer):
  event_id = serializers.IntegerField(required=True)
  user_id = serializers.IntegerField(required=True)

class LeaveEventIDSerializer(serializers.Serializer):
  event_id = serializers.IntegerField(required=True)
  user_id = serializers.IntegerField(required=True)

class RecommendationSerializer(serializers.Serializer):
  latitude = serializers.FloatField(required=True)
  longitude = serializers.FloatField(required=True)
    