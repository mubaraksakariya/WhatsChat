from django.conf import settings
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import random
from .models import CustomUser

def generate_otp():
    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    return otp

def send_otp(to_email,otp):
    print(f"Sending OTP to: {to_email}")
    otp = otp
    message = Mail(
        from_email='mubaraksakariya@gmail.com',
        to_emails=to_email,
        subject='Login with OTP',
        html_content=f'<strong>Your OTP for login is - {otp} </strong>')
      
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"SendGrid API Response - Status Code: {response.status_code}")
        print(f"SendGrid API Response - Body: {response.body}")
        print(f"SendGrid API Response - Headers: {response.headers}")
        return response.status_code
    except Exception as e:
        print("Error occurred while sending email")
        print(e)
        return "Error occurred while sending email"


class CustomLogin(APIView):
    # Manages sign up, gets email/phone and sends otp
    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            if email:
                try:
                    user, created = CustomUser.objects.get_or_create(email=email)
                except Exception as e:
                    print(e)
                print('here')
                otp = generate_otp()
                user.otp = otp
                user.save()
                response = send_otp(email, otp)
                return Response({
                    'email': email,
                    'message': 'Trying to send OTP to the email',
                    'result': response,
                }, status=response)
            else:
                return Response({
                    'error': 'Email is missing in the request data.',
                }, status=400)
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}',
            }, status=500)
    
    # Recieves otp from user and authenticates
    def put(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            otp = request.data.get('otp')
            user, created = CustomUser.objects.get_or_create(email=email)
            if user.otp == otp:
                print(user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'message': 'The user is authenticated',
                    'email': email,
                    'result':True,
                    'token': token.key,
                }, status=200)
            else:
                return Response({
                    'message': 'The otp does not match',
                    'email': email,
                    'result':False,
                    'token': None,
                }, status=200)
        except Exception as e:
            print({str(e)})
            return Response({
                'error': f'An error occurred: {str(e)}',
            }, status=500)
