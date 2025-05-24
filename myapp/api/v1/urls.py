from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    UserViewSet,
    UserProfileViewSet,
    UserSettingsViewSet,
    CategoryViewSet,
    TransactionViewSet,
    FinancialSummaryView,
    UserMeView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'settings', UserSettingsViewSet, basename='settings')
router.register(r'finance/categories', CategoryViewSet, basename='category')
router.register(r'finance/transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserMeView.as_view(), name='user-me'),
    path('finance/summary/', FinancialSummaryView.as_view(), name='finance-summary'),
] 