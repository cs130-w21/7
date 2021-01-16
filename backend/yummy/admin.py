from django.contrib import admin

# Register your models here.
from .models import Yummy

class YummyAdmin(admin.ModelAdmin):
    list_display = ('title', 'name')

# Register your models here.
admin.site.register(Yummy, YummyAdmin)