from django.contrib import admin

# Register your models here.
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('username','first_name', 'last_name', 'age','sex', 'vegetarian', 'diet_plan')
# Register your models here.
admin.site.register(Profile, ProfileAdmin)