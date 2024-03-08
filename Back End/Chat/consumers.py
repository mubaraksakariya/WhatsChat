import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        from User.models import ConnectedUser  # Import here to avoid AppRegistryNotReady
        self.user = self.scope['user']
        self.accept()
        connected_user, created = ConnectedUser.objects.get_or_create(user=self.user)
        connected_user.channel_name = self.channel_name
        connected_user.save()
        print(f'connected {self.user.id}')

    def disconnect(self, close_code):
        from User.models import ConnectedUser  # Import here to avoid AppRegistryNotReady
        ConnectedUser.objects.filter(user=self.scope['user']).delete()
        print('connection closed')

    def receive(self, text_data):
        from User.models import ConnectedUser  # Import here to avoid AppRegistryNotReady
        data = json.loads(text_data)
        
        message = data['content']['message']
        receiver = data['content']['to']
        sender = self.scope['user']
        receiver = ConnectedUser.objects.filter(user__email=receiver['email']).first()
        print(f'{sender} sends {message} to {receiver}')
        # if receiver:
        #     self.channel_layer.send(
        #         receiver.channel_name,
        #         {
        #             'type': 'chat.message',
        #             'message': message,
        #             'sender_id': sender.id,
        #         }
        #     )
        # else:
        #     self.send(text_data=json.dumps({
        #         'message': 'User is not online.',
        #     }))

    def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
        }))
