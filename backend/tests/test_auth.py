from django.urls import reverse
import json
import pytest

@pytest.fixture
def client():
   from rest_framework.test import APIClient
   return APIClient()

@pytest.mark.django_db
def test_registration(client):
    dataJson={
            'email':'test@gmail.com',
            'username':'test123',
            'password':'tEst1$'
        }
    response = client.post(reverse('register'), dataJson, format='json')
    assert response.status_code == 201
    
    token = response.json()['token']
    email = response.json()['email']
    assert token != None
    assert email == dataJson['email']

    response = client.post(reverse('register'), None)
    assert response.status_code == 400


@pytest.mark.django_db
def login(client, dataJson):
    test_registration(client)
    response = client.post(reverse('login'), dataJson, format='json')
    return response


@pytest.mark.django_db
def test_login(client):
    dataJson={
            "email":"test@gmail.com",
            "password":"tEst1$"
        }
    dataJsonWrongPassword={
        "email":"test@gmail.com",
        "password":"tEstW1$"
    }
    dataJsonWrongEmail={
        "email":"test123@gmail.com",
        "password":"tEst1$"
    }

    response = login(client, dataJson)
    assert response.status_code == 200
    token = response.json()['token']
    assert token != None

    response = client.post(reverse('login'), dataJsonWrongPassword, format='json')
    assert response.status_code == 400
    message = response.json()['message']
    assert message == 'Wrong password'

    response = client.post(reverse('login'), dataJsonWrongEmail, format='json')
    assert response.status_code == 400
    message = response.json()['message']
    assert message == 'You have entered an invalid username or password'

@pytest.mark.django_db
def test_logout(client):
    dataJson={
            "email":"test@gmail.com",
            "password":"tEst1$"
        }
    response = login(client, dataJson)
    token = response.json()['token']
    response = client.delete(reverse('logout'), HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 200

@pytest.mark.django_db
def test_updatePassword(client):
    dataJson={
            "email":"test@gmail.com",
            "password":"tEst1$"
        }
    dataJsonCorrectPassword={
        "old_password":"tEst1$",
        "new_password":"tEst2!"
    }
    dataJsonWrongOldPassword={
        "old_password":"tEst3",
        "new_password":"tEst2!"
    }

    response = login(client, dataJson)
    token = response.json()['token']

    response = client.post(reverse('update_password'), dataJsonWrongOldPassword, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 400
    message = response.json()['message']
    assert message == 'Wrong password'

    response = client.post(reverse('update_password'), dataJsonCorrectPassword, format='json', HTTP_AUTHORIZATION='Token ' + token)
    assert response.status_code == 200
