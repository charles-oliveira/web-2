from rest_framework import serializers
from django.contrib.auth.models import User
from ...models import Category, Transaction, UserProfile, UserSettings
import logging

logger = logging.getLogger(__name__)

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'email_notifications',
            'push_notifications',
            'dark_mode',
            'language',
            'two_factor_auth',
            'data_sharing',
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        settings, _ = UserSettings.objects.get_or_create(user=user)
        for attr, value in validated_data.items():
            setattr(settings, attr, value)
        settings.save()
        return settings

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'phone', 'address', 'city', 'state', 'country', 'birth_date', 'profile_picture', 'bio', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def create(self, validated_data):
        logger.info(f"Criando perfil de usuário: {validated_data}")
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    profile = UserProfileSerializer(read_only=True)
    settings = UserSettingsSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2', 'profile', 'settings')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
            'username': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        logger.info(f"Validando username: {value}")
        if User.objects.filter(username=value).exists():
            logger.error(f"Username já existe: {value}")
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value

    def validate_email(self, value):
        logger.info(f"Validando email: {value}")
        if User.objects.filter(email=value).exists():
            logger.error(f"Email já existe: {value}")
            raise serializers.ValidationError("Este email já está em uso.")
        return value

    def validate(self, data):
        logger.info("Validando dados do usuário")
        if not data.get('password'):
            logger.error("Senha não fornecida")
            raise serializers.ValidationError({"password": "A senha é obrigatória."})
        
        if not data.get('password2'):
            logger.error("Confirmação de senha não fornecida")
            raise serializers.ValidationError({"password2": "A confirmação de senha é obrigatória."})
        
        if data['password'] != data['password2']:
            logger.error("Senhas não coincidem")
            raise serializers.ValidationError({"password2": "As senhas não coincidem."})
        
        if len(data['password']) < 8:
            logger.error("Senha muito curta")
            raise serializers.ValidationError({"password": "A senha deve ter pelo menos 8 caracteres."})
        
        return data

    def create(self, validated_data):
        logger.info("Criando novo usuário")
        try:
            validated_data.pop('password2')
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            logger.info(f"Usuário criado com sucesso: {user.username}")
            return user
        except Exception as e:
            logger.error(f"Erro ao criar usuário: {str(e)}", exc_info=True)
            raise

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'type', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, data):
        logger.info(f"Validando dados da categoria: {data}")
        user = self.context['request'].user
        
        # Verificar se já existe uma categoria com o mesmo nome e tipo para o usuário
        if Category.objects.filter(
            user=user,
            name=data['name'],
            type=data['type']
        ).exists():
            logger.error(f"Categoria já existe: {data['name']} ({data['type']})")
            raise serializers.ValidationError(
                f"Já existe uma categoria com o nome '{data['name']}' para o tipo {data['type']}."
            )
        
        return data

    def create(self, validated_data):
        logger.info(f"Criando categoria: {validated_data}")
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)

    class Meta:
        model = Transaction
        fields = ('id', 'amount', 'description', 'date', 'type', 'category', 'category_name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, data):
        logger.info(f"Validando dados da transação: {data}")
        user = self.context['request'].user
        
        # Verificar se a categoria pertence ao usuário
        if data['category'].user != user:
            logger.error(f"Categoria não pertence ao usuário: {data['category'].name}")
            raise serializers.ValidationError(
                {"category": "Categoria inválida."}
            )
        
        return data

    def create(self, validated_data):
        logger.info(f"Criando transação: {validated_data}")
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)