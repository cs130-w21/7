from django.shortcuts import render

# Create your views here.
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated 
from .serializers import UserInfoSerializer, RegistrationSerializer, ProfileSerializer 
from .authentication import token_expire_handler

from .models import UserInfo

@api_view(['POST'])
def userinfo(request):
    # GET list of userinfo, POST a new userinfo, DELETE all userinfo
    if request.method == 'POST':
        userinfo_data = JSONParser().parse(request)
        userinfo_serializer = UserInfoSerializer(data=userinfo_data)
        if userinfo_serializer.is_valid():
            userinfo_serializer.save()
            return JsonResponse(userinfo_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(userinfo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def userinfo_detail(request, pk):
    try: 
        userinfo = UserInfo.objects.get(pk=pk) 
    except UserInfo.DoesNotExist: 
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET': 
        userinfo_serializer = UserInfoSerializer(userinfo) 
        return JsonResponse(userinfo_serializer.data)
    elif request.method == 'PUT':
        userinfo_data =JSONParser().parse(request)
        userinfo_serializer = UserInfoSerializer(userinfo, data=userinfo_data)
        if userinfo_serializer.is_valid():
            userinfo_serializer.save()
            return JsonResponse(userinfo_serializer.data)
        return JsonResponse(userinfo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        userinfo.delete() 
        return JsonResponse({'message': 'The user was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['response'] = "Successfully registered a new user."
            data['email'] = user.email
            data['username'] = user.username
            token = Token.objects.get(user=user)
            data['token'] = token.key
        else:
            data = serializer.errors
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

