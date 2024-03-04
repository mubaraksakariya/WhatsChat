# chat/authentication.py
from channels.auth import AuthMiddlewareStack
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async



class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    @database_sync_to_async
    def get_user_from_token(self, token_key):
        from rest_framework.authtoken.models import Token
        try:
            token = Token.objects.get(key=token_key)
        except Exception as e:
            print(e)
        return token.user
    
    async def __call__(self, scope, receive, send):
        from django.contrib.auth.models import AnonymousUser  # Import here to avoid AppRegistryNotReady
        from rest_framework.authtoken.models import Token
        query_string = scope['query_string']
        query_params = parse_qs(query_string.decode('utf-8'))
        token_key = query_params.get('token', [None])[0]

        if token_key:
            try:
                try:
                    user = await self.get_user_from_token(token_key=token_key)
                except Exception as e:
                    print(e)
                # token = await sync_to_async(Token.objects.get)(key=token_key)
                scope['user'] = user
            except :
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)
    

def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
