from rest_framework.routers import DefaultRouter
from myapp.views import ReportViewSet, CategoryViewSet, IncomeViewSet, ExpenseViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'incomes', IncomeViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = router.urls