from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from .models import Order, User
from rest_framework import status
import json
import logging
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)

@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        logger.info('Creating user with data: %s', data)
        user = User.objects.create_user(
            username=data['username'],
            password=data['password']
        )
        logger.info('User created: %s', user)
        return JsonResponse({'id': user.id, 'username': user.username})

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    logger.info('Received create order request with data: %s', request.data)
    description = request.data.get('description')
    user_id = request.data.get('user_id')

    if not description or not user_id:
        logger.error('Description or user_id missing')
        return JsonResponse({'error': 'Description and user_id are required'}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.error('User not found: %s', user_id)
        return JsonResponse({'error': 'User not found'}, status=404)

    order = Order.objects.create(description=description, user=user)
    order_data = {
        'id': str(order.id),
        'description': order.description,
        'user_id': order.user.id,
    }
    logger.info('Order created: %s', order_data)

    # Enviar a ordem via WebSocket para o usuário específico
    channel_layer = get_channel_layer()
    try:
        async_to_sync(channel_layer.group_send)(
            f'user_{user.id}',
            {
                'type': 'order_message',
                'order': order_data
            }
        )
        logger.info('Order sent via WebSocket to user_%s', user.id)
    except Exception as e:
        logger.error('Error sending order via WebSocket: %s', str(e))

    return JsonResponse(order_data, status=201)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    user = request.user
    logger.info('Listing orders for user: %s', user)
    orders = Order.objects.filter(user=user)
    orders_list = [{'id': str(order.id), 'description': order.description, 'user_id': order.user.id} for order in orders]
    return Response(orders_list, status=status.HTTP_200_OK)

@csrf_exempt
def list_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        users_list = [{'id': user.id, 'username': user.username} for user in users]
        logger.info('Listing all users')
        return JsonResponse(users_list, safe=False)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
