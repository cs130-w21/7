from rest_framework.test import APITestCase
from django.urls import reverse
import json

class RegistrationTestCase(APITestCase):
    def register(self):
        self.dataJson={
            'email':'test@gmail.com',
            'username':'test123',
            'password':'tEst1$'
        }
        response = self.client.post(reverse('register'), self.dataJson, format='json')
        return response

    def test_registration(self):

        response = self.register()
        self.assertEqual(response.status_code, 201)
        
        token = response.json()['token']
        email = response.json()['email']
        assert token != None
        assert email == self.dataJson['email']

        response = self.client.post(reverse('register'), None)
        self.assertEqual(response.status_code, 400)

class LoginTestCase(APITestCase):
    def login(self):
        dataJson={
                    "email":"test@gmail.com",
                    "password":"tEst1$"
                }
        response = self.client.post(reverse('login'), dataJson, format='json')
        return response
        
    def test_login(self):
        dataJsonWrongPassword={
            "email":"test@gmail.com",
            "password":"tEstW1$"
        }
        dataJsonWrongEmail={
            "email":"test123@gmail.com",
            "password":"tEst1$"
        }
       
        RegistrationTestCase.register(self)

        response = self.login()
        self.assertEqual(response.status_code, 200)
        token = response.json()['token']
        assert token != None

        response = self.client.post(reverse('login'), dataJsonWrongPassword, format='json')
        self.assertEqual(response.status_code, 400)
        message = response.json()['message']
        assert message == 'Wrong password'

        response = self.client.post(reverse('login'), dataJsonWrongEmail, format='json')
        self.assertEqual(response.status_code, 400)
        message = response.json()['message']
        assert message == 'You have entered an invalid username or password'

class LogoutTestCase(APITestCase):
    def test_logout(self):
        RegistrationTestCase.register(self)
        response = LoginTestCase.login(self)
        token = response.json()['token']
        response = self.client.delete(reverse('logout'), HTTP_AUTHORIZATION='Token ' + token)
        self.assertEqual(response.status_code, 200)
