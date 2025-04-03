from django.db import models
from django.utils import timezone

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.is_deleted = True
        self.save()

    def hard_delete(self):
        super().delete()

class Category(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=10, choices=[('INCOME', 'Receita'), ('EXPENSE', 'Despesa')])

    def __str__(self):
        return self.name

class Transaction(BaseModel):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT,
        related_name='%(class)s_transactions'  # Isso criará nomes únicos
    )

    class Meta:
        abstract = True

        
class Income(Transaction):
    source = models.CharField(max_length=100)

    def __str__(self):
        return f"Income: {self.amount} from {self.source}"

class Expense(Transaction):
    payment_method = models.CharField(max_length=50, choices=[
        ('CASH', 'Dinheiro'),
        ('CREDIT_CARD', 'Cartão de Crédito'),
        ('DEBIT_CARD', 'Cartão de Débito'),
        ('BANK_TRANSFER', 'Transferência Bancária'),
        ('OTHER', 'Outro'),
    ])

    def __str__(self):
        return f"Expense: {self.amount} for {self.description}"