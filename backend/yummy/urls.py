from django.urls import path
from django.conf.urls import url 
from . import views

urlpatterns = [
    # url(r'^api/user/(?P<username>\w+)$', views.userinfo_detail),
    url(r'^api/register', views.registration_view),
    url(r'^api/login', views.login_view),
    url(r'^api/profile/create', views.create_profile_view),
    url(r'^api/profile/update', views.update_profile_view),
    url(r'^api/profile/get', views.get_profile_view),
    url(r'^api/event/create', views.create_event),
    url(r'^api/event/update', views.update_event),
]