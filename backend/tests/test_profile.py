from django.urls import reverse
import json
import pytest
from test_auth import login

@pytest.fixture
def client():
   from rest_framework.test import APIClient
   return APIClient()


@pytest.mark.django_db
def test_createProfile(client):
    UserLoginJson={
        "email":"test@gmail.com",
        "password":"tEst1$"
    }
    dataJson={
        "username":"test123",
        "first_name":"TestingF",
        "last_name":"TestingL",
        "age":23,
        "height":5.8,
        "weight":150,
        "sex":"F",
        "vegetarian":"false",
        "cuisin":"Vietnamese",
        "food_type":"Sandwiches"
    }

    response = login(client, UserLoginJson)
    token = response.json()['token']  
    assert token != None

    response = client.post(reverse('create_profile'), dataJson, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 201

@pytest.mark.django_db
def test_updateProfile(client):
    UserLoginJson={
        "email":"test@gmail.com",
        "password":"tEst1$"
    }

    dataJsonCreate={
        "username":"test123",
        "first_name":"TestingF",
        "last_name":"TestingL",
        "age":23,
        "height":5.8,
        "weight":150,
        "sex":"F",
        "vegetarian":"false",
        "cuisin":"Vietnamese",
        "food_type":"Sandwiches"
    }
    dataJsonUpdate={
        "username":"test123",
        "first_name":"TestingF",
        "last_name":"TestingL",
        "age":23,
        "height":5.8,
        "weight":150,
        "sex":"F",
        "vegetarian":"false",
        "cuisin":"Korean",
        "food_type":"Bakeries"
    }

    dataJsonWrongUsername={
        "username":"testW",
        "first_name":"TestingF",
        "last_name":"TestingL",
        "age":23,
        "height":5.8,
        "weight":150,
        "sex":"F",
        "vegetarian":"false",
        "cuisin":"Korean",
        "food_type":"Bakeries"
    }

    response = login(client, UserLoginJson)
    token = response.json()['token']

    response = client.post(reverse('create_profile'), dataJsonCreate, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 201

    response = client.put(reverse('update_profile'), dataJsonUpdate, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 200

    response = client.put(reverse('update_profile'), dataJsonWrongUsername, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 400

@pytest.mark.django_db
def test_getProfile(client):
    UserLoginJson={
        "email":"test@gmail.com",
        "password":"tEst1$"
    }

    dataJsonCreate={
        "username":"test123",
        "first_name":"TestingF",
        "last_name":"TestingL",
        "age":23,
        "height":5.8,
        "weight":150,
        "sex":"F",
        "vegetarian":"false",
        "cuisin":"Vietnamese",
        "food_type":"Sandwiches"
    }

    response = login(client, UserLoginJson)
    token = response.json()['token']

    response = client.post(reverse('create_profile'), dataJsonCreate, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 201

    response = client.get(reverse('get_profile'), HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 200
    first_name = response.json()['first_name']
    cuisin = response.json()['cuisin']

    assert first_name == dataJsonCreate['first_name']
    assert cuisin == dataJsonCreate['cuisin']
