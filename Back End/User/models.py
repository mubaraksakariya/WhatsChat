from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from rest_framework import serializers


class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50,default = 'first name')
    last_name = models.CharField(max_length=50,default = 'last name')
    otp = models.CharField(max_length=6,default=0000)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True, auto_now_add=False)

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'last_seen']

class ConnectedUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    channel_name = models.CharField(max_length=255)

    def __str__(self):
        return self.channel_name
    
class ConnectedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedUser
        fields = ['id', 'user', 'channel_name']
