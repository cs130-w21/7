from django.contrib import admin

# Register your models here.
from .models import UserInfo, Profile

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id','username', 'name', 'email', 'age', 'height', 'weight')

# Register your models here.
admin.site.register(UserInfo, UserInfoAdmin)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('username','first_name', 'last_name', 'age','sex', 'vegetarian', 'diet_plan')
# Register your models here.
admin.site.register(Profile, ProfileAdmin)