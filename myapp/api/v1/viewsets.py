from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from myapp.models import Category, Income, Expense
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from myapp.api.v1.serializers import (
    CategorySerializer,
    IncomeSerializer,
    ExpenseSerializer
)
from django.db.models import Sum


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

class ReportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        filters = {}
        if start_date and end_date:
            filters['date__range'] = [start_date, end_date]

        income_total = Income.objects.filter(is_deleted=False, **filters).aggregate(total=Sum('amount'))['total'] or 0
        expense_total = Expense.objects.filter(is_deleted=False, **filters).aggregate(total=Sum('amount'))['total'] or 0
        balance = income_total - expense_total

        return Response({
            'income_total': income_total,
            'expense_total': expense_total,
            'balance': balance,
            'start_date': start_date,
            'end_date': end_date,
        })