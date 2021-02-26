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
    url(r'^api/event/get_events', views.get_events),
    url(r'^api/event/get_event', views.get_event_by_id),
    url(r'^api/event/join_event', views.join_event),
    url(r'^api/event/leave_event', views.leave_event),
]