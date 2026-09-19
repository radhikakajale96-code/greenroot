from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'provider', 'is_staff')
    list_filter = ('provider', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('GreenRoots Details', {'fields': ('google_id', 'avatar', 'provider')}),
    )
