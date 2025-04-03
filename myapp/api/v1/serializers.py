from rest_framework import serializers
from myapp.models import Category, Income, Expense

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.filter(type='INCOME', is_deleted=False))
    
    class Meta:
        model = Income
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.filter(type='EXPENSE', is_deleted=False))
    
    class Meta:
        model = Expense
        fields = '__all__'