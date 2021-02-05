from django.shortcuts import render

# Create your views here.
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.decorators import api_view
from .serializers import UserInfoSerializer, RegistrationSerializer  
from rest_framework.authtoken.models import Token
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
            data['token_created'] = token.created
        else:
            data = serializer.errors
        return JsonResponse(data)
