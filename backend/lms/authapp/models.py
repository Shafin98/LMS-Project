from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('instructor', 'Instructor'),
        ('student', 'Student'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)

    # role-specific example fields
    expertise = models.CharField(max_length=255, blank=True, null=True)  # instructor
    enrolled_date = models.DateTimeField(auto_now_add=True)  # student

    def __str__(self):
        return self.user.username