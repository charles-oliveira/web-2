from rest_framework import status, generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
    CategorySerializer,
    TransactionSerializer,
)
from ...models import Category, Transaction, UserProfile, UserSettings
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        logger.info(f"[REGISTRO] Recebendo requisição de registro: {request.method} {request.path}")
        logger.info(f"[REGISTRO] Headers da requisição: {dict(request.headers)}")
        logger.info(f"[REGISTRO] Dados recebidos: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            logger.error(f"[REGISTRO] Erros de validação: {serializer.errors}")
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar a senha
            password = request.data.get('password')
            logger.info("[REGISTRO] Validando senha...")
            validate_password(password)
            
            # Criar o usuário
            logger.info("[REGISTRO] Criando usuário...")
            user = serializer.save()
            logger.info(f"[REGISTRO] Usuário criado com sucesso: {user.username}")
            
            return Response({
                'message': 'Usuário criado com sucesso',
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.error(f"[REGISTRO] Erro de validação da senha: {e}")
            return Response({
                'error': 'Senha inválida',
                'details': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"[REGISTRO] Erro inesperado ao criar usuário: {str(e)}", exc_info=True)
            return Response({
                'error': 'Erro ao criar usuário',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class UserSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def get_object(self):
        return UserSettings.objects.get_or_create(user=self.request.user)[0]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def get_object(self):
        return self.request.user

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return UserProfile.objects.get_or_create(user=self.request.user)[0]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FinancialSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Período atual (mês atual)
            today = timezone.now()
            start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_of_month = (start_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)

            # Total de receitas
            total_income = Transaction.objects.filter(
                user=request.user,
                type='income',
                date__range=[start_of_month, end_of_month]
            ).aggregate(total=Sum('amount'))['total'] or 0

            # Total de despesas
            total_expense = Transaction.objects.filter(
                user=request.user,
                type='expense',
                date__range=[start_of_month, end_of_month]
            ).aggregate(total=Sum('amount'))['total'] or 0

            # Saldo
            balance = total_income - total_expense

            # Transações recentes
            recent_transactions = Transaction.objects.filter(
                user=request.user
            ).order_by('-date')[:5]

            # Resumo por categoria
            category_summary = Category.objects.filter(
                user=request.user
            ).annotate(
                total=Sum('transactions__amount', filter=Q(transactions__date__range=[start_of_month, end_of_month]))
            ).values('name', 'total')

            return Response({
                'total_income': total_income,
                'total_expense': total_expense,
                'balance': balance,
                'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
                'category_summary': category_summary,
            })
        except Exception as e:
            logger.error(f"Erro ao gerar resumo financeiro: {str(e)}")
            return Response(
                {'error': 'Erro ao gerar resumo financeiro'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserMeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user 

class UserProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        try:
            return self.request.user.profile
        except UserProfile.DoesNotExist:
            logger.info(f"Criando perfil para o usuário: {self.request.user.username}")
            return UserProfile.objects.create(user=self.request.user)

    def update(self, request, *args, **kwargs):
        logger.info(f"Atualizando perfil do usuário: {request.user.username}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            logger.error(f"Erros de validação: {serializer.errors}")
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_update(serializer)
            logger.info(f"Perfil atualizado com sucesso: {request.user.username}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Erro ao atualizar perfil: {str(e)}", exc_info=True)
            return Response({
                'error': 'Erro ao atualizar perfil',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        logger.info(f"Atualizando dados do usuário: {request.user.username}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            logger.error(f"Erros de validação: {serializer.errors}")
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_update(serializer)
            logger.info(f"Usuário atualizado com sucesso: {request.user.username}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Erro ao atualizar usuário: {str(e)}", exc_info=True)
            return Response({
                'error': 'Erro ao atualizar usuário',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST) 