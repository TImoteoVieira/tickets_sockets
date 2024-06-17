from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_order, name='create_order'),
    path('list/', views.list_orders, name='list_orders'),
    path('create_user/', views.create_user, name='create_user'),
    path('users/', views.list_users, name='list_users'),
]
