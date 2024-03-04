import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        from User.models import ConnectedUser  # Import here to avoid AppRegistryNotReady
        self.user = self.scope['user']
        # ConnectedUser.objects.create(user=self.user, channel_name=self.channel_name)
        print(f'connected {self.user.id}')
        self.accept()

    def disconnect(self, close_code):
        print('connection closed')
        # from User.models import ConnectedUser  # Import here to avoid AppRegistryNotReady
        # ConnectedUser.objects.filter(user=self.scope['user']).delete()

    def receive(self, text_data):
        from User.models import ConnectedUser  # Import here to avoid AppRegistryNotReady
        data = json.loads(text_data)
        sender_id = self.scope['user'].id
        message = data['message']
        receiver_username = data['receiver']
        receiver = ConnectedUser.objects.filter(user__username=receiver_username).first()
        if receiver:
            self.channel_layer.send(
                receiver.channel_name,
                {
                    'type': 'chat.message',
                    'message': message,
                    'sender_id': sender_id,
                }
            )
        else:
            self.send(text_data=json.dumps({
                'message': 'User is not online.',
            }))

    def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
        }))
