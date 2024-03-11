from django.urls import path
from .views import CustomLogin, CurrentUser

urlpatterns = [
    path('login', CustomLogin.as_view(),name='custom_login'),
    path('currentuser', CurrentUser.as_view(),name='currentuser'),
]
