from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status,viewsets
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated 
from .serializers import RegistrationSerializer, LoginSerializer, ProfileSerializer, EventSerializer, JoinEventIDSerializer, GetEventSerializer, GetEventIDSerializer, LeaveEventIDSerializer, ChangePasswordSerializer,RecommendationSerializer
from .authentication import token_expire_handler
from .models import User, Profile, Event
import requests
import json

@api_view(['POST'])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['response'] = "Successfully registered a new user."
            data['email'] = user.email
            token, created = Token.objects.get_or_create(user=user)
            data['token'] = token.key
            data['id'] = user.id
            return JsonResponse(data=data, status=status.HTTP_201_CREATED)
        else:
            data = serializer.errors
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def login_view(request):
    data = {}
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # check if the user exists or not
            existing_user = User.objects.filter(email=serializer.data['email'])
            if existing_user:
                user = User.objects.get(email=serializer.data['email'])
                # check if the password is correct
                if not user.check_password(serializer.data['password']):
                    data['message'] = 'Wrong password'
                    return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
                data['message'] = 'User successfully Login'
                token, created = Token.objects.get_or_create(user=user)
                data['token'] = token.key
                data['id'] = user.id
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            else:
                data['message'] = 'You have entered an invalid username or password'
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        else:
            data = serializer.errors
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def logout_view(request):
    data = {}
    if request.method == 'DELETE':
        # check if the user is login or not
        existing_token = Token.objects.filter(key=request.auth)
        if existing_token:
            token = Token.objects.get(key=request.auth)
            operation = token.delete()
            if operation:
                data['message'] = 'User loged out'
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            else:
                data['message'] = 'User cannot log out'
                return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)
        else:
            data['message'] = 'You already loged out'
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def create_profile_view(request):
    if request.method == 'POST':
        print(request.auth)
        serializer = ProfileSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            if serializer.create_profile():
                data['message'] = "created successful"
                return JsonResponse(data=data, status=status.HTTP_201_CREATED)
            data['message'] = "The username already existed"
            return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def update_profile_view(request):
    if request.method == 'PUT':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['token'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            if not serializer.username_token_match(token):
                data['message'] = "This username does not match to this token"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            if serializer.update_profile():
                data['message'] = "Updated successful"
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            data['message'] = "The username does not exist"
            return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_profile_view(request):
    if request.method == 'GET':
        data = {}
        print(request.auth)
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            
        try:
            profile = Profile.objects.get(username=token.user)
            serializer = ProfileSerializer(profile)
            return JsonResponse(data=serializer.data,status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return JsonResponse(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def create_event(request):
    data = {}
    token = Token.objects.get(key=request.auth)
    if token_expire_handler(token):
        data['message'] = "Token expired"
        return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST':
        token = Token.objects.get(key=request.auth)
        serializer = EventSerializer(data=request.data)
        # serializer.add_host(token.user)
        data = {}
        if serializer.is_valid():
            if serializer.create_event(token.user):
                data['success'] = "created an event successful"
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            data['message'] = "The event name exist"
            return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def update_event(request):
    data = {}
    token = Token.objects.get(key=request.auth)
    if token_expire_handler(token):
        data['message'] = "Token expired"
        return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'PUT':
        token = Token.objects.get(key=request.auth)
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.update_event(token.user)
            if response['status']:
                data['message'] = response['message']
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            data['message'] = response['message']
            return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_events(request):
    if request.method == 'GET':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        serializer = GetEventSerializer(data=request.data)
        if serializer.is_valid():
            events = Event.objects.filter(name__contains=request.data['name'])
            return JsonResponse(data=EventSerializer(events,many=True).data,status=status.HTTP_200_OK,safe=False)
        else:
            data = serializer.errors
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_event_by_id(request):
    if request.method == 'GET':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        serializer = GetEventIDSerializer(data=request.data)
        if serializer.is_valid():
            events = Event.objects.get(id=request.data['id'])
            return JsonResponse(data=EventSerializer(events).data,status=status.HTTP_200_OK,safe=False)
        else:
            data = serializer.errors
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def join_event(request):
    if request.method == 'PUT':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        
        serializer = JoinEventIDSerializer(data=request.data)
        if serializer.is_valid():
            # check if the event exist
            existing_event = Event.objects.filter(id=request.data['event_id'])
            if not existing_event:
                data['message'] = "The event does not exist"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            # check if the user exist
            existing_user = User.objects.filter(id=request.data['user_id'])
            if not existing_user:
                data['message'] = "The user does not exist"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)

            event = Event.objects.get(id=request.data['event_id'])
            user = User.objects.get(id=request.data['user_id'])
            #check if the token belongs to the user or not
            if str(token.user) != str(user.username):
                data['message'] = "This user's id cannot join"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            if user in event.attendees.all():
                data['message'] = "The user aleady join the event"
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            event.attendees.add(user)
            data['message'] = "Join successful"
            return JsonResponse(data=data,status=status.HTTP_200_OK)
        else:
            data = serializer.errors
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def leave_event(request):
    if request.method == 'DELETE':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        serializer = LeaveEventIDSerializer(data=request.data)
        if serializer.is_valid():
            # check if the event exist
            existing_event = Event.objects.filter(id=request.data['event_id'])
            if not existing_event:
                data['message'] = "The event does not exist"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            # check if the user exist
            existing_user = User.objects.filter(id=request.data['user_id'])
            if not existing_user:
                data['message'] = "The user does not exist"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            event = Event.objects.get(id=request.data['event_id'])
            user = User.objects.get(id=request.data['user_id'])
            #check if the token belongs to the user or not
            if str(token.user) != str(user.username):
                data['message'] = "You cannot remove this user from the list"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            # check if user is in the event
            if user not in event.attendees.all():
                data['message'] = "The user did not join the event"
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            event.attendees.remove(user)
            data['message'] = "Leave successful"
            return JsonResponse(data=data,status=status.HTTP_200_OK)
        else:
            data = serializer.errors
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def update_password(request):
    data={}
    if request.method == 'POST':
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['token'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        print(user)
        print(request.data)
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.data.get("old_password")):
                data['message'] = "Wrong password"
                return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            data['message'] = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
            }

            return JsonResponse(data=data)
        return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def recommendation(request):
    if request.method == 'GET':
        data = {}
        print(request.auth)
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            
        try:
            profile = Profile.objects.get(username=token.user)
            serializer = RecommendationSerializer(data=request.data)
            if serializer.is_valid():
                yelp_api = "https://api.yelp.com/v3/businesses/search"
                auth = {"Authorization": "Bearer jZsa2Da9xZlA7tD2UIUrDszi4ffcGOukaOMlDEWmo6MSIpvhf4r2sfoYQbx3jyQN3_9ElU6nkDBZePsmeCETwWrln-tLq6AhQqwbV-yMwN78WX8pEJ0-q1mfziE_YHYx"}
                params = {
                    "latitude": request.data['latitude'],
                    "longitude": request.data['longitude'],
                    "radius": 20000,
                    "limit": 50
                }

                res = requests.get(yelp_api, headers=auth, params=params)
                res = json.loads(res.content)
                result = ML_predict(res,profile.cuisine,profile.food_type)
                return JsonResponse(data=result,status=status.HTTP_200_OK)
            else:
                data = serializer.errors
                return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return JsonResponse(status=status.HTTP_400_BAD_REQUEST)

# Machine Learning Model
def ML_predict(businesses,cuisine,food_type):
    print(cuisine,food_type)
    return businesses