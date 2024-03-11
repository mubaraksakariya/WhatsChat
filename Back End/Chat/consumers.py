from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from User.models import ConnectedUser

        await self.accept()
        connected_user, created = await sync_to_async(ConnectedUser.objects.get_or_create)(user=self.scope['user'])
        connected_user.channel_name = self.channel_name
        await sync_to_async(connected_user.save)()

        # print(f'connected {self.channel_name}')

    async def disconnect(self, close_code):
        from User.models import ConnectedUser

        connected_user = await sync_to_async(ConnectedUser.objects.get)(user=self.scope['user'])
        if connected_user:
            await sync_to_async(connected_user.delete)()
            # print('connection closed')

    async def receive(self, text_data):
        # import is delayed because django may not be ready initially
        from User.models import ConnectedUser 

        data = json.loads(text_data)
        sender = self.scope['user']
        message = data['content']
        receiver_email = message['to']
        # print(f'\n{message}\n')
        try:
            receiver = await sync_to_async(ConnectedUser.objects.get)(user__email=receiver_email)
        except:
            receiver = None
            
        if receiver:
            type = message['type']

            # defines a forward message format
            
            if type == 'typing':
                message_to_forward = {
                    'type':type,
                    'time':message['time'],
                    'from': sender.email,
                }
            if type == 'text':
                message_to_forward = {
                    'type':type,
                    'text': message['text'],
                    'time':message['time'],
                    'from': sender.email,
                    'acknowledgement_id':message['id'],
                }
                 
            # send the message
                
            await self.channel_layer.send(
                receiver.channel_name,
                {
                    'type': 'chat_message',
                    'message':message_to_forward,
                }
            )

        else:
            await self.send(text_data=json.dumps({
                'message': 'User is not online.',
            }))
            #forwarding failed

            
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'data': message,
        }))
