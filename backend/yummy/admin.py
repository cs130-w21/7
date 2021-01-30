from django.contrib import admin

# Register your models here.
from .models import UserInfo

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id','username', 'name', 'email', 'age', 'height', 'weight')

# Register your models here.
admin.site.register(UserInfo, UserInfoAdmin)