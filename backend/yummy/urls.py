from django.urls import path,re_path
from django.conf.urls import url
from . import views
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    url(r'^', views.FrontendAppView.as_view()),
    url(r'^api/register', views.registration_view, name="register"),
    url(r'^api/login', views.login_view, name="login"),
    url(r'^api/logout', views.logout_view, name="logout"),
    url(r'^api/update_password', views.update_password, name="update_password"),
    url(r'^api/profile/create', views.create_profile_view, name="create_profile"),
    url(r'^api/profile/update', views.update_profile_view, name="update_profile"),
    url(r'^api/profile/get', views.get_profile_view, name="get_profile"),
    url(r'^api/event/create', views.create_event, name="create_event"),
    url(r'^api/event/update', views.update_event, name="update_event"),
    url(r'^api/event/get_events', views.get_events, name="get_events"),
    url(r'^api/event/get_event', views.get_event_by_id),
    url(r'^api/event/join_event', views.join_event),
    url(r'^api/event/leave_event', views.leave_event),
    url(r'^api/recommendation', views.recommendation, name="recommendation"),
]