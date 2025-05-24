from .models import Category, Transaction, UserProfile, UserSettings
from django.contrib import admin

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    list_filter = ('user',)
    search_fields = ('name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'type', 'category', 'user', 'date')
    list_filter = ('type', 'category', 'user', 'date')
    search_fields = ('description',)
    date_hierarchy = 'date'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'city', 'state', 'country')
    list_filter = ('country', 'state')
    search_fields = ('user__username', 'phone', 'city')

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'push_notifications', 'dark_mode', 'language')
    list_filter = ('dark_mode', 'language')
    search_fields = ('user__username',)