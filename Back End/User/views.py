from django.conf import settings
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import random

def generate_otp():
    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    return otp

def send_otp(to_email):
    print(f"Sending OTP to: {to_email}")
    otp = generate_otp()
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

    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            if email:
                response = send_otp(email)
                return Response({
                    'email': email,
                    'message': 'Trying to send OTP to the email',
                    'result': response,
                },status=response)
            else:
                return Response({
                    'error': 'Email is missing in the request data.',
                }, status=400)
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}',
            }, status=500)
    

    def put(self, request, *args, **kwargs):
        # Your GET request logic
        print(request.data['otp'])
        email = request.data['email']
        otp = request.data['otp']
        return Response({
            'message': 'This is a PUT request',
            'email':email,
            'otp':otp,
            
        },status=200)
