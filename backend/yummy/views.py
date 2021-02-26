from django.shortcuts import render

# Create your views here.
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status,viewsets
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated 
from .serializers import RegistrationSerializer, LoginSerializer, ProfileSerializer, EventSerializer
from .authentication import token_expire_handler
from .models import Profile, Event

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
        else:
            data = serializer.errors
        return JsonResponse(data)

@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['response'] = 'User successfully Login'
            token, created = Token.objects.get_or_create(user=user)
            data['token'] = token.key
        else:
            data['response'] = 'You have entered an invalid username or password'
        
        return JsonResponse(data)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def create_profile_view(request):
    if request.method == 'POST':
        print(request.auth)
        # token = Token.objects.get(user=)
        # if token_expire_handler(token):
        #     data['token'] = "Token expired"
        #     JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        serializer = ProfileSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            if serializer.create_profile():
                data['success'] = "created successful"
                return JsonResponse(data=data)
            data['username'] = "The username already existed"
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
                data['username'] = "This username does not match to this token"
                return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            if serializer.update_profile():
                data['success'] = "Updated successful"
                return JsonResponse(data=data)
            data['username'] = "The username does not exist"
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
            data['token'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
            
        try:
            profile = Profile.objects.get(username=token.user)
            serializer = ProfileSerializer(profile)
            return JsonResponse(data=serializer.data,status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return JsonResponse(status=status.HTTP_400_BAD_REQUEST)
        
        
        
        # is_existed = serializer.get_profile(request.data.username)
        # if is_existed:
        #     data['data'] = is_existed
        #     return data
        # data['username'] = "User not exist"
        # return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        # data['data'] = serializer.get_profile()
        # data['success'] = "GET successful"
        # return JsonResponse(data=data)
        # return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def create_event(request):
    data = {}
    token = Token.objects.get(key=request.auth)
    if token_expire_handler(token):
        data['token'] = "Token expired"
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
            data['event'] = "The event name exist"
            return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def update_event(request):
    data = {}
    token = Token.objects.get(key=request.auth)
    if token_expire_handler(token):
        data['token'] = "Token expired"
        return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'PUT':
        token = Token.objects.get(key=request.auth)
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.update_event(token.user)
            if response['status']:
                data['success'] = response['message']
                return JsonResponse(data=data,status=status.HTTP_200_OK)
            data['event'] = response['message']
            return JsonResponse(data=data, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_events(request):
    if request.method == 'GET':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['token'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        
        events = Event.objects.filter(name__contains=request.data['name'])
        return JsonResponse(data=EventSerializer(events,many=True).data,status=status.HTTP_200_OK,safe=False)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_event_by_id(request):
    if request.method == 'GET':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['token'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        
        events = Event.objects.get(id=request.data['id'])
        return JsonResponse(data=EventSerializer(events).data,status=status.HTTP_200_OK,safe=False)