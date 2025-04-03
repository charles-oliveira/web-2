from django.contrib import admin
from .models import Category, Income, Expense

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'is_deleted')
    list_filter = ('type', 'is_deleted')

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('source', 'amount', 'date', 'is_deleted')
    list_filter = ('is_deleted', 'category')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'date', 'payment_method', 'is_deleted')
    list_filter = ('is_deleted', 'category', 'payment_method')