#general
from django.shortcuts import render
from .models import *
from .serializers import *
from django.core.mail import send_mail
from .permissions import *
#rest
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)

        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class ForgotPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        # create token
        token_obj = PasswordResetToken.objects.create(user=user)

        reset_link = f"http://localhost:3000/reset-password/{token_obj.token}"

        # (for now just print instead of email)
        # Right now email is NOT sent

        # We just print link (good for development)

        # Later upgrade to:

        # SMTP (Gmail)
        # SendGrid
        # Celery background tasks

        print("RESET LINK:", reset_link)

        return Response({"message": "Password reset link generated"})
    
class ResetPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        try:
            token_obj = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=400)

        if token_obj.is_expired():
            return Response({"error": "Token expired"}, status=400)

        user = token_obj.user
        user.set_password(new_password)
        user.save()

        # delete token after use
        token_obj.delete()

        return Response({"message": "Password reset successful"})
    
class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        return Response({"message": "Hello Admin"})
    
class InstructorOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

class StudentOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]