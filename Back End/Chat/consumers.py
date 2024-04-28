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
        from User.models import ConnectedUser, CustomUser
        from django.utils import timezone

        try:
            connected_user = await sync_to_async(ConnectedUser.objects.get)(user=self.scope['user'])
            if connected_user:
                await sync_to_async(connected_user.delete)()
                custom_user = await sync_to_async(CustomUser.objects.get)(id=connected_user.user_id)
                custom_user.last_seen = timezone.now()
                await sync_to_async(custom_user.save)()
        except ConnectedUser.DoesNotExist:
            print('no connected user found')
        except Exception as e:
            print(str(e))

            
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
            if type == 'attachment':
                message_to_forward = {
                    'type':type,
                    'attachment': message['attachment'],
                    'time':message['time'],
                    'from': sender.email,
                    'acknowledgement_id':message['id'],
                }
            if type == 'image':
                message_to_forward = {
                    'type':type,
                    'image': message['image'],
                    'time':message['time'],
                    'from': sender.email,
                    'acknowledgement_id':message['id'],
                }
            if type == 'audio':
                message_to_forward = {
                    'type':type,
                    'audio': message['audio'],
                    'time':message['time'],
                    'from': sender.email,
                    'acknowledgement_id':message['id'],
                }
            if type == 'video-call':
                if message['status'] == 'offer':
                    message_to_forward = {
                        'type':type,
                        'offer': message['offer'],
                        'time':message['time'],
                        'from': sender.email,
                        'status':message['status']
                    }
                elif message['status'] == 'reached':
                    message_to_forward = {
                        'type':type,
                        'time':message['time'],
                        'from': sender.email,
                        'status':message['status']
                    }
                elif message['status'] == 'answer':
                    message_to_forward = {
                        'type':type,
                        'answer':message['answer'],
                        'time':message['time'],
                        'from': sender.email,
                        'status':message['status']
                    }
                elif message['status'] == 'icecandidate':
                    message_to_forward = {
                        'type':type,
                        'candidate':message['candidate'],
                        'time':message['time'],
                        'from': sender.email,
                        'status':message['status']
                    }
                elif message['status'] == 'end-call':
                    message_to_forward = {
                        'type':type,
                        'time':message['time'],
                        'from': sender.email,
                        'status':message['status']
                    }
                

            if type == 'delete':
                # print(message)
                message_to_forward={
                    'type':type,
                    'from': sender.email,
                    'id':message['acknowledgement_id'],
                }
            if type == 'acknowledgement':
                # print(message)
                message_to_forward={
                    'type':type,
                    'from': sender.email,
                    'acknowledgement_id':message['acknowledgement_id'],
                    'status':message['status'],
                    'id':message['id']
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
             #forwarding failed because the user is offline

            if message['type'] != 'typing' and message['type'] != 'acknowledgement':
                message_to_forward = {
                    'type': 'acknowledgement',
                    'from': sender.email,
                    'acknowledgement_id': message['id'],
                    'status': 'error',
                }
                await self.send(text_data=json.dumps({'data':message_to_forward,}))


           
            
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'data': message,
        }))
