# from rest_framework.test import APITestCase
# from django.urls import reverse
# import json
# from . import LoginTestCase

# class CreateProfileTestCase(APITestCase):
#     def test_createProfile(self):
#         dataJson={
#             "username":"test",
#             "first_name":"LL",
#             "last_name":"FF",
#             "age":43,
#             "height":"",
#             "weight":"",
#             "sex":"",
#             "vegetarian":"",
#         }
#         response = LoginTestCase.login(self)
#         token = response.json()['token']
#         response = self.client.post(reverse('create_profile'), dataJson, format='json', HTTP_AUTHORIZATION='Token ' + token)
#         self.assert(response.status_code, 201)

# class UpdateProfileTestCase(APITestCase):
#     def test_updateProfile(self):
#         dataJson={
#             "username":"test",
#             "first_name":"LL",
#             "last_name":"FF",
#             "age":43,
#             "height":"",
#             "weight":"",
#             "sex":"",
#             "vegetarian":"",
#         }
#         response = LoginTestCase.login(self)
#         token = response.json()['token']
#         response = self.client.put(reverse('update_profile'), dataJson, format='json', HTTP_AUTHORIZATION='Token ' + token)
#         self.assert(response.status_code, 200)

# class GetProfileTestCase(APITestCase):
#     def test_getProfile(self):
#         response = LoginTestCase.login(self)
#         token = response.json()['token']
#         response = self.client.get(reverse('get_profile'), HTTP_AUTHORIZATION='Token ' + token)
#         self.assert(response.status_code, 200)