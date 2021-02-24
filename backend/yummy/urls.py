from django.urls import path
from django.conf.urls import url 
from . import views

urlpatterns = [
    url(r'^api/user$', views.userinfo),
    # url(r'^api/user/(?P<username>\w+)$', views.userinfo_detail),
    url(r'^api/user/(?P<pk>[0-9]+)$', views.userinfo_detail),
    url(r'^api/register', views.registration_view),
    url(r'^api/profile/create', views.create_profile_view),
    url(r'^api/profile/update', views.update_profile_view),
]