from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from models import Category, Income, Expense
from .serializers import CategorySerializer, IncomeSerializer, ExpenseSerializer
from django_filters.rest_framework import DjangoFilterBackend

class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        return self.queryset.filter(is_deleted=False)

class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    search_fields = ['name', 'description']
    filterset_fields = ['type']

class IncomeViewSet(BaseViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    search_fields = ['description', 'source']
    filterset_fields = ['category', 'date']

class ExpenseViewSet(BaseViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    search_fields = ['description', 'payment_method']
    filterset_fields = ['category', 'date', 'payment_method']