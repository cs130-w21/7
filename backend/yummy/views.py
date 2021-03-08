from django.shortcuts import render
from django.http.response import JsonResponse
from django.http import HttpResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status,viewsets
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegistrationSerializer, LoginSerializer, ProfileSerializer, EventSerializer, JoinEventIDSerializer, GetEventSerializer, GetEventIDSerializer, LeaveEventIDSerializer, ChangePasswordSerializer,RecommendationSerializer
from .authentication import token_expire_handler
from .models import User, Profile, Event
import requests
import json
import pandas as pd
import pickle
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
import os
import logging
from django.views.generic import View
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer
from rest_framework.decorators import api_view, renderer_classes
from rest_framework import response, schemas


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    build`).
    """
    index_file_path = os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')

    def get(self, request):
        try:
            with open(self.index_file_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead after
                running `yarn start` on the frontend/ directory
                """,
                status=501,
            )


@api_view(['POST'])
def registration_view(request):
    """
    This API taking a user's information (email, username, password) and create an account for that user. It reuturns a message in response.
    - Input:
        - username: <username> (unique)
        - email: <email> (unique)
        - password: <password>
    - Output: {
        "message": <message>,
        "email": <email>,
        "tolen": tocken,
        "id": <user_id>
    }
    """
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
@ensure_csrf_cookie
def login_view(request):
    """
    This API is used to login a user with email, and password. It returns the user's id and a token that expires in 2 hours
    if login successfully.
    - Input:
        - email: registered email 
        - password: password
    - Output: {
        "message": <message>,
        "email": <email>,
        "tolen": tocken,
        "id": <user_id>
    }
    """
    data = {}
    if request.method == 'POST':
        print(request.data)
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
    """
    This API is used to logout a user. It return a message.
    - Input:
        - Authorization: Token <user’s token taken from login or register>
    - output: {
        "message": <message>
    }
    """
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
    """
    This API is used to create a profile after register. It will return a message if it adds a new record successfully.
    - Input:
        - Authorization: Token <user’s token taken from login or register>
        - username: string
        - first_name: string
        - last_name: string
        - age: integer
        - height: integer in inches
        - weight: integer in lbs
        - sex: <F or M>
        - vegetarian: <T or F>
        - cuisine: string
        - food_type: string
    - Output: {
        "message": <message>
    }
    
    """
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
    """
    This API is used to update a profile . It will return a message if it updates a new record successfully.
    - Input:
        - Authorization: Token <user’s token taken from login or register>
        - username: string
        - first_name: string
        - last_name: string
        - age: integer
        - height: integer in inches
        - weight: integer in lbs
        - sex: <F or M>
        - vegetarian: <T or F>
        - cuisine: string
        - food_type: string
    - Output: {
        "message": <message>
    }
    """
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
    """
    This API is used to get a profile. It returns the user's profile as json format.
    - Input:
        - Authorization: Token <user’s token taken from login or register>
    - Output: {
        "username": string,
        "first_name": string,
        "last_name": string,
        "age": integer,
        "height": integer in inches,
        "weight": integer in lbs,
        "sex": <F or M>,
        "vegetarian": <T or F>,
        "cuisine": string,
        "food_type": string,
    }
    """
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
            data['message'] = "The profile does nto exist"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def create_event(request):
    """
    This API is used to create an event. It returns a message. 
    - Input:
        - Authorization: Token <user’s token taken from login or register>
        - name: string
        - datetime: <YYYY-MM-DDTHH:MM:SS>
        - location: string
        - description: string

    - Output: {
        "message": string
    }
    """
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
    """
    This API is used to update an event. It returns a message.
    - Input:
        - Authorization: Token <user’s token taken from login or register>
        - name: string
        - datetime: <YYYY-MM-DDTHH:MM:SS>
        - location: string
        - description: string

    - Output: {
        "message": string
    }
    """
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

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_events(request):
    """
    This API is used to get information of events by name. It returns information of events as json format.
    - Input:
        - Authorization: Token <user’s token taken from login or register>
        - name: string
    - Output: {
        {
            "name": string,
            "datetime": datatime,
            "location": string,
            "description": string,
            "host": user_id,
            "attendees": [
                {
                    "id": user_id,
                    "username": string,
                    "email": string
                }
            ],
            "id": event_id
        },
        {
            "name": string,
            "datetime": datatime,
            "location": string,
            "description": string,
            "host": user_id,
            "attendees": [
                {
                    "id": user_id,
                    "username": string,
                    "email": string
                }
            ],
            "id": event_id
        }
    }
    """
    if request.method == 'POST':
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        serializer = GetEventSerializer(data=request.data)
        # if serializer.is_valid():
        if "name" in request.data:
            events = Event.objects.filter(name__contains=request.data['name'])
            return JsonResponse(data=EventSerializer(events,many=True).data,status=status.HTTP_200_OK,safe=False)
        else:
            data = serializer.errors
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_event_by_id(request):
    """
    This API is used to get information of an evnet by id. It returns information of the event as json format.
    - Input:
        - id: integer
    - Output: {
        "name": string,
        "datetime": datatime,
        "location": string,
        "description": string,
        "host": user_id,
        "attendees": [
            {
                "id": user_id,
                "username": string,
                "email": string
            }
        ],
        "id": event_id
    }
    """
    if request.method == 'POST':
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
    """
    This API is used when a user want to join an event. It returns a message.
    - Input:
        - user_id: integer
        - event_id: integer
    - Output: {
        "message": string
    }
    """
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
    """
    This API is used when a user want to leave an event. It returns a message
    - Input:
        - user_id: integer
        - event_id: integer
    - Output: {
        "message": string
    }
    """
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
    """
    This API is used when a user want reset her/his password Parameters:
    - Input: 
        - old_password
        - new_password
    - Output:
        - {message:"A message"}
    """
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
    """
    This API takes location of a user and returns 6 nearby businesses that may have food the user wants
    - Input:
        - latitude: float
        - longtitude: float
        - cuisine: string
        - food_type: string
    - Output: {
    "businesses": [
        {
            "id": "TQEfj1-QhyWCJ29u3l9Kjw",
            "alias": "gen-korean-bbq-house-san-jose",
            "name": "Gen Korean BBQ House",
            "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/-g5mYPUvxsX7hfor95Iq-Q/o.jpg",
            "is_closed": false,
            "url": "https://www.yelp.com/biz/gen-korean-bbq-house-san-jose?adjust_creative=SuGSFJESF5J6ELQXB8uQRA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=SuGSFJESF5J6ELQXB8uQRA",
            "review_count": 7215,
            "categories": [
                {
                    "alias": "korean",
                    "title": "Korean"
                },
                {
                    "alias": "bbq",
                    "title": "Barbeque"
                }
            ],
            "rating": 4.5,
            "coordinates": {
                "latitude": 37.3872324410459,
                "longitude": -121.885422354631
            },
            "transactions": [],
            "price": "$$",
            "location": {
                "address1": "1628 Hostetter Rd",
                "address2": "Ste F",
                "address3": "",
                "city": "San Jose",
                "zip_code": "95131",
                "country": "US",
                "state": "CA",
                "display_address": [
                    "1628 Hostetter Rd",
                    "Ste F",
                    "San Jose, CA 95131"
                ]
            },
            "phone": "+14084772773",
            "display_phone": "(408) 477-2773",
            "distance": 1234.427583824074
        },
        {
            "id": "OeePb_OQIgCnt3nO53XEtA",
            "alias": "claw-shack-san-jose",
            "name": "Claw Shack",
            "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/KGxTuv0tqYpa6IeSLBmvYg/o.jpg",
            "is_closed": false,
            "url": "https://www.yelp.com/biz/claw-shack-san-jose?adjust_creative=SuGSFJESF5J6ELQXB8uQRA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=SuGSFJESF5J6ELQXB8uQRA",
            "review_count": 1296,
            "categories": [
                {
                    "alias": "cajun",
                    "title": "Cajun/Creole"
                },
                {
                    "alias": "seafood",
                    "title": "Seafood"
                },
                {
                    "alias": "chicken_wings",
                    "title": "Chicken Wings"
                }
            ],
            "rating": 4.5,
            "coordinates": {
                "latitude": 37.3728449142057,
                "longitude": -121.8738632705
            },
            "transactions": [
                "delivery"
            ],
            "price": "$$",
            "location": {
                "address1": "1696 Berryessa Rd",
                "address2": "",
                "address3": "",
                "city": "San Jose",
                "zip_code": "95133",
                "country": "US",
                "state": "CA",
                "display_address": [
                    "1696 Berryessa Rd",
                    "San Jose, CA 95133"
                ]
            },
            "phone": "+14086496741",
            "display_phone": "(408) 649-6741",
            "distance": 1122.6155667338178
        },
    """
    if request.method == 'GET':
        latitude = float(request.GET.get('latitude'))
        longitude = float(request.GET.get('longitude'))
        data = {}
        token = Token.objects.get(key=request.auth)
        if token_expire_handler(token):
            data['message'] = "Token expired"
            return JsonResponse(data=data,status=status.HTTP_400_BAD_REQUEST)
        try:
            profile = Profile.objects.get(username=token.user)
            serializer = RecommendationSerializer(data=request.GET)
            if serializer.is_valid():
                yelp_api = "https://api.yelp.com/v3/businesses/search"
                auth = {"Authorization": "Bearer jZsa2Da9xZlA7tD2UIUrDszi4ffcGOukaOMlDEWmo6MSIpvhf4r2sfoYQbx3jyQN3_9ElU6nkDBZePsmeCETwWrln-tLq6AhQqwbV-yMwN78WX8pEJ0-q1mfziE_YHYx"}
                params = {
                    "term": "food",
                    "latitude": latitude,
                    "longitude": longitude,
                    "radius": 20000,
                    "limit": 50,
                    "open_now": True,
                }

                res = requests.get(yelp_api, headers=auth, params=params)
                res = json.loads(res.content)
                result = ML_predict(res,profile.cuisine,profile.food_type)
                return JsonResponse(data=result,status=status.HTTP_200_OK, safe=False)
            else:
                data = serializer.errors
                return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return JsonResponse(data,status=status.HTTP_400_BAD_REQUEST)

# Machine Learning Model
def ML_predict(businesses,cuisine,food_type):
    # List of cuisines
    cuisines = ["American (Traditional)", "Mexican", "American (New)", "Italian",
        "Chinese", "Japanese", "Asian Fusion", "Indian", "Thai", "Middle Eastern",
        "Vietnamese", "Greek", "French", "Korean", "Caribbean", "Latin American",
        "Pakistani", "Hawaiian", "Lebanese", "Taiwanese", "Filipino", "Spanish",
        "Irish", "African", "Turkish", "Cantonese", "Pan Asian", "German",
        "Brazilian", "Ethiopian", "Polish", "Malaysian", "Arabian", "Mongolian"]

    # List of types
    types = ["Restaurants", "Fast Food", "Sandwiches", "Pizza", "Breakfast & Brunch", "Burgers",
        "Specialty Food", "Bakeries", "Desserts", "Cafes", "Ice Cream & Frozen Yogurt",
        "Chicken Wings", "Salad", "Seafood", "Sushi Bars", "Beer", "Sports Bars",
        "Pubs", "Steakhouses", "Cocktail Bars", "Diners", "Ethnic Food",
        "Food Delivery Services", "Food Trucks", "Soup", "Comfort Food", "Buffets",
        "Donuts", "Tacos", "Hot Dogs", "Bubble Tea", "Chicken Shop", "Bagels",
        "Noodles", "Tapas/Small Plates", "Food Stands", "Cupcakes", "Soul Food",
        "Fish & Chips", "Dim Sum", "Cajun/Creole", "Ramen", "Creperies", "Food Court",
        "Bistros", "Gelato", "Waffles", "Hot Pot", "Acai Bowls", "Kebab", "Pretzels"]

    # Loading list of businesses nearby
    

    # Converting business information to dataframe format for machine learning prediction
    df = pd.DataFrame(columns = ["business_id", "categories"])
    for business in businesses["businesses"]:
        categories_list = ""
        for category in business["categories"]:
            categories_list += category["title"] + ","
        df = df.append({"business_id":business["id"], "categories":categories_list}, ignore_index = True)
    for c in cuisines:
        df[c] = (df['categories'].str.contains(c, regex=False)).astype('int8')
    for t in types:
        df[t] = (df['categories'].str.contains(t, regex=False)).astype('int8')
    df.drop(columns="categories", inplace=True)
    cuisines_col_x = list(map(lambda name : name + '_x', cuisines))
    types_col_x = list(map(lambda name : name + '_x', types))
    df.columns = ["business_id"] + cuisines_col_x + types_col_x
    if (len(df) == 0):
        return []
    
    # Converting user information to dataframe format for machine learning prediction
    cuisines_col_y = list(map(lambda name : name + '_y', cuisines))
    types_col_y = list(map(lambda name : name + '_y', types))
    user = pd.DataFrame(columns = cuisines_col_y + types_col_y)
    user_values = []
    for c in cuisines:
        user_values.append((c in cuisine) & 1)
    for t in types:
        user_values.append((t in food_type) & 1)
    user.loc[0]= user_values
    user[cuisines_col_y] = user[cuisines_col_y].div(user[cuisines_col_y].sum(axis=1), axis=0)
    user[types_col_y] = user[types_col_y].div(user[types_col_y].sum(axis=1), axis=0)
    user = pd.concat([user]*len(df), ignore_index = True)
    user = user.astype('float')
    
    # Finalizing dataframe for machine learning prediction
    final_df = pd.concat([df, user], axis=1)
    prediction = final_df.iloc[:,0].to_frame()
    model_df = final_df.drop(columns="business_id")
    print(os.getcwd())
    # Loading machine learning model
    loaded_model = pickle.load(open("/app/backend/yummy/models/basemodel.pkl", 'rb'))
    rating = loaded_model.predict(model_df)
    prediction["rating"] = rating
    result = prediction.sort_values(by='rating', ascending=False).iloc[0:6,0].to_list()

    # Getting JSON format of suggested restaurants
    json_result = []
    for business in businesses["businesses"]:
        if (business["id"] in result):
            json_result.append(business)
    return json.dumps(json_result, indent=4, sort_keys=True)
