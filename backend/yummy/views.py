from django.shortcuts import render

# Create your views here.
from rest_framework import generics         
from .serializers import YummySerializer  
from .models import Yummy

class ListYummy(generics.ListCreateAPIView):
    queryset = Yummy.objects.all()
    serializer_class = YummySerializer


class DetailYummy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Yummy.objects.all()
    serializer_class = YummySerializer