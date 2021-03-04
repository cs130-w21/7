from django.contrib import admin

# Register your models here.
from .models import Profile, Event


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('username','first_name', 'last_name', 'age','sex', 'vegetarian', 'cuisine', 'food_type')

class EventAdmin(admin.ModelAdmin):
    list_display = ('name','datetime', 'location', 'description','host')
# Register your models here.
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Event, EventAdmin)