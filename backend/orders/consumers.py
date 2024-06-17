import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Order

logger = logging.getLogger(__name__)

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            logger.info('WebSocket connection accepted for user: %s', self.user)
        else:
            await self.close()
            logger.info('WebSocket connection closed: User not authenticated')

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info('WebSocket disconnected for user: %s', self.user)

    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info('WebSocket received data: %s', data)
        order = await self.create_order(data)
        # await self.send_order_to_group(order)

    @database_sync_to_async
    def create_order(self, data):
        logger.info('Order created in WebSocket: %s', data)
        return {
            'id': str(data["id"]),
            'description': data["description"],
            'user_id': data["user_id"]
        }

    async def send_order_to_group(self, order):
        await self.channel_layer.group_send(
            f'user_{order["user_id"]}',
            {
                'type': 'order_message',
                'order': order
            }
        )
        logger.info('Order sent to group: user_%s', order["user_id"])

    async def order_message(self, event):
        order = event['order']
        logger.info('Order message received: %s', order)
        await self.send(text_data=json.dumps(order))
